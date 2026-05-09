import os
import tempfile
import gdown
import uuid
import re
import subprocess
import signal
from contextlib import contextmanager
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


class TimeoutException(Exception):
    pass


@contextmanager
def timeout_handler(seconds: int):
    """Context manager to timeout operations."""

    def handler(signum, frame):
        raise TimeoutException(f"Operation timed out after {seconds} seconds")

    old_handler = signal.signal(signal.SIGALRM, handler)
    try:
        signal.alarm(seconds)
        yield
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, old_handler)


def extract_file_id_from_url(url: str) -> str:
    # Handle /d/ID/ format
    match = re.search(r"/d/([a-zA-Z0-9_-]{10,})", url)
    if match:
        return match.group(1)
    # Handle id=ID format
    match = re.search(r"id=([a-zA-Z0-9_-]{10,})", url)
    if match:
        return match.group(1)
    # If the URL itself looks like just an ID
    if re.match(r"^[a-zA-Z0-9_-]{10,}$", url):
        return url
    return ""


def _get_duration(path: str) -> float:
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                path,
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )
        return float(result.stdout.strip())
    except (ValueError, subprocess.TimeoutExpired):
        return 5.0


def _safe_remove(path: str) -> None:
    """Safely remove a file, ignoring errors."""
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def process_google_drive_video_to_mp4(drive_url: str) -> dict:
    file_id = extract_file_id_from_url(drive_url)
    if not file_id:
        raise ValueError(
            "Could not extract a valid Google Drive File ID. Please check the URL."
        )

    # Track temp files for cleanup
    temp_files: list[str] = []
    loop_content: bytes = b""
    full_content: bytes = b""
    poster_content: bytes = b""

    try:
        # Create temp files
        for suffix in [".mp4", "_loop.mp4", "_full.mp4", "_poster.jpg"]:
            fd, path = tempfile.mkstemp(suffix=suffix)
            os.close(fd)
            temp_files.append(path)

        temp_in, temp_loop, temp_full, temp_poster = temp_files

        # Download with size limit and timeout
        print(f"DEBUG: Downloading File ID: {file_id}...")
        try:
            # Try download with timeout using signal
            with timeout_handler(300):
                result_path = gdown.download(id=file_id, output=temp_in, quiet=False)
        except TimeoutException:
            raise ValueError("Download timed out (max 5 minutes)")
        except TypeError:
            # Fallback for older gdown versions without timeout param
            result_path = gdown.download(id=file_id, output=temp_in, quiet=False)

        if not result_path or not os.path.exists(temp_in):
            raise ValueError(
                "Failed to download video. Ensure the Google Drive file is set to 'Anyone with the link can view'."
            )

        file_size = os.path.getsize(temp_in)
        if file_size > 500 * 1024 * 1024:  # 500MB limit
            raise ValueError("Video too large (>500MB)")

        duration = min(_get_duration(temp_in), 5)  # Cap at 5s for loop

        # 1. GENERATE LOOP (Muted, Low Res, capped duration)
        print("DEBUG: Processing snippet...")
        result = subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                temp_in,
                "-t",
                str(duration),
                "-an",  # Remove audio
                "-vf",
                "scale=-2:480",
                "-c:v",
                "libx264",
                "-preset",
                "ultrafast",
                "-threads",
                "2",  # Limit threads
                "-max_muxing_queue_size",
                "1024",
                temp_loop,
            ],
            capture_output=True,
            text=True,
            timeout=600,
        )
        if result.returncode != 0:
            err = result.stderr[-1000:] if result.stderr else "Unknown error"
            raise RuntimeError(f"ffmpeg loop generation failed: {err}")
        # Help GC by clearing large strings
        result.stdout = ""  # type: ignore
        result.stderr = ""  # type: ignore

        # 2. GENERATE FULL VIDEO (High Quality)
        print("DEBUG: Processing full video...")
        result = subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                temp_in,
                "-c:v",
                "libx264",
                "-c:a",
                "aac",
                "-b:a",
                "128k",
                "-preset",
                "ultrafast",
                "-threads",
                "2",  # Limit threads
                "-max_muxing_queue_size",
                "1024",
                temp_full,
            ],
            capture_output=True,
            text=True,
            timeout=600,
        )
        if result.returncode != 0:
            err = result.stderr[-1000:] if result.stderr else "Unknown error"
            raise RuntimeError(f"ffmpeg full video generation failed: {err}")
        result.stdout = ""  # type: ignore
        result.stderr = ""  # type: ignore

        # 3. GENERATE POSTER (First frame)
        print("DEBUG: Generating poster...")
        result = subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                temp_in,
                "-ss",
                "00:00:00.000",
                "-vframes",
                "1",
                temp_poster,
            ],
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode != 0:
            err = result.stderr[-1000:] if result.stderr else "Unknown error"
            raise RuntimeError(f"ffmpeg poster generation failed: {err}")
        result.stdout = ""  # type: ignore
        result.stderr = ""  # type: ignore

        # Read temp files into memory
        with open(temp_loop, "rb") as f:
            loop_content = f.read()
        with open(temp_full, "rb") as f:
            full_content = f.read()
        with open(temp_poster, "rb") as f:
            poster_content = f.read()

    except Exception as e:
        print(f"ERROR: Video processor crashed: {str(e)}")
        raise
    finally:
        # Always clean up temp files
        for path in temp_files:
            _safe_remove(path)

    # Save to storage
    base_id = uuid.uuid4().hex
    loop_name = f"stories/{base_id}_loop.mp4"
    full_name = f"stories/{base_id}_full.mp4"
    poster_name = f"stories/{base_id}_poster.jpg"

    saved_loop = default_storage.save(loop_name, ContentFile(loop_content))
    saved_full = default_storage.save(full_name, ContentFile(full_content))
    saved_poster = default_storage.save(poster_name, ContentFile(poster_content))

    # Clear content from memory immediately after saving
    del loop_content, full_content, poster_content

    return {
        "loop_url": f"{settings.MEDIA_URL}{saved_loop}",
        "full_url": f"{settings.MEDIA_URL}{saved_full}",
        "poster_url": f"{settings.MEDIA_URL}{saved_poster}",
    }
