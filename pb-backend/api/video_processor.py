import os
import tempfile
import gdown
import uuid
import re
import subprocess
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


def extract_file_id_from_url(url: str) -> str:
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", url)
    if match:
        return match.group(1)
    match = re.search(r"id=([a-zA-Z0-9_-]+)", url)
    if match:
        return match.group(1)
    return url


def _get_duration(path: str) -> float:
    result = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            path,
        ],
        capture_output=True, text=True,
    )
    try:
        return float(result.stdout.strip())
    except ValueError:
        return 5.0


def process_google_drive_video_to_mp4(drive_url: str) -> dict:
    file_id = extract_file_id_from_url(drive_url)
    download_url = f"https://drive.google.com/uc?id={file_id}"

    fd_in, temp_in = tempfile.mkstemp(suffix=".mp4")
    fd_loop, temp_loop = tempfile.mkstemp(suffix=".mp4")
    fd_full, temp_full = tempfile.mkstemp(suffix=".mp4")
    os.close(fd_in)
    os.close(fd_loop)
    os.close(fd_full)

    try:
        print(f"DEBUG: Downloading {download_url}...")
        gdown.download(download_url, temp_in, quiet=True, fuzzy=True)

        if not os.path.exists(temp_in) or os.path.getsize(temp_in) == 0:
            raise ValueError("Failed to download video from Google Drive.")

        duration = min(_get_duration(temp_in), 5)

        print("DEBUG: Processing snippet...")
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", temp_in,
                "-t", str(duration),
                "-an",
                "-vf", "scale=-2:360",
                "-c:v", "libx264",
                "-preset", "ultrafast",
                "-threads", "1",
                temp_loop,
            ],
            capture_output=True, text=True,
        )

        print("DEBUG: Processing full video...")
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", temp_in,
                "-c:v", "libx264",
                "-c:a", "aac",
                "-preset", "ultrafast",
                "-threads", "1",
                temp_full,
            ],
            capture_output=True, text=True,
        )

        base_id = uuid.uuid4().hex
        loop_name = f"stories/{base_id}_loop.mp4"
        full_name = f"stories/{base_id}_full.mp4"

        with open(temp_loop, "rb") as f:
            saved_loop = default_storage.save(loop_name, ContentFile(f.read()))

        with open(temp_full, "rb") as f:
            saved_full = default_storage.save(full_name, ContentFile(f.read()))

        return {
            "loop_url": f"{settings.MEDIA_URL}{saved_loop}",
            "full_url": f"{settings.MEDIA_URL}{saved_full}",
        }

    except Exception as e:
        print(f"ERROR: Video processor crashed: {str(e)}")
        raise e

    finally:
        for f in [temp_in, temp_loop, temp_full]:
            if os.path.exists(f):
                try:
                    os.remove(f)
                except:
                    pass
