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
    return None


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
    if not file_id:
        raise ValueError("Could not extract a valid Google Drive File ID. Please check the URL.")

    # Using the standardized export link
    download_url = f"https://drive.google.com/uc?id={file_id}"

    fd_in, temp_in = tempfile.mkstemp(suffix=".mp4")
    fd_loop, temp_loop = tempfile.mkstemp(suffix=".mp4")
    fd_full, temp_full = tempfile.mkstemp(suffix=".mp4")
    fd_poster, temp_poster = tempfile.mkstemp(suffix=".jpg")
    
    os.close(fd_in)
    os.close(fd_loop)
    os.close(fd_full)
    os.close(fd_poster)

    try:
        print(f"DEBUG: Downloading File ID: {file_id}...")
        
        # Using a more robust download method
        result_path = gdown.download(id=file_id, output=temp_in, quiet=False)
        
        if not result_path or not os.path.exists(temp_in) or os.path.getsize(temp_in) == 0:
            raise ValueError("Failed to download video. Ensure the Google Drive file is set to 'Anyone with the link can view'.")

        duration = min(_get_duration(temp_in), 5)

        # 1. GENERATE LOOP (Muted, Low Res, 5s)
        print("DEBUG: Processing snippet...")
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", temp_in,
                "-t", str(duration),
                "-an", # Remove audio
                "-vf", "scale=-2:480", # Slightly higher res for better quality
                "-c:v", "libx264",
                "-preset", "ultrafast",
                "-threads", "0", # USE ALL CPU CORES
                temp_loop,
            ],
            capture_output=True, text=True,
        )

        # 2. GENERATE FULL VIDEO (High Quality)
        print("DEBUG: Processing full video...")
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", temp_in,
                "-c:v", "libx264",
                "-c:a", "aac",
                "-b:a", "128k",
                "-preset", "ultrafast",
                "-threads", "0", # USE ALL CPU CORES
                temp_full,
            ],
            capture_output=True, text=True,
        )

        # 3. GENERATE POSTER (First frame)
        print("DEBUG: Generating poster...")
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", temp_in,
                "-ss", "00:00:00.000",
                "-vframes", "1",
                temp_poster,
            ],
            capture_output=True, text=True,
        )

        base_id = uuid.uuid4().hex
        loop_name = f"stories/{base_id}_loop.mp4"
        full_name = f"stories/{base_id}_full.mp4"
        poster_name = f"stories/{base_id}_poster.jpg"

        with open(temp_loop, "rb") as f:
            saved_loop = default_storage.save(loop_name, ContentFile(f.read()))

        with open(temp_full, "rb") as f:
            saved_full = default_storage.save(full_name, ContentFile(f.read()))
            
        with open(temp_poster, "rb") as f:
            saved_poster = default_storage.save(poster_name, ContentFile(f.read()))

        return {
            "loop_url": f"{settings.MEDIA_URL}{saved_loop}",
            "full_url": f"{settings.MEDIA_URL}{saved_full}",
            "poster_url": f"{settings.MEDIA_URL}{saved_poster}",
        }

    except Exception as e:
        print(f"ERROR: Video processor crashed: {str(e)}")
        raise e

    finally:
        for f in [temp_in, temp_loop, temp_full, temp_poster]:
            if os.path.exists(f):
                try:
                    os.remove(f)
                except:
                    pass
