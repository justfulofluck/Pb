import os
import tempfile
import gdown
import uuid
import re
from moviepy.editor import VideoFileClip
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def extract_file_id_from_url(url: str) -> str:
    # Extract Google Drive file ID from standard link structures
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", url)
    if match:
        return match.group(1)
    match = re.search(r"id=([a-zA-Z0-9_-]+)", url)
    if match:
        return match.group(1)
    return url

def process_google_drive_video_to_mp4(drive_url: str) -> dict:
    """
    Ultra-lightweight processor for Docker/Low-RAM environments.
    1. Downloads to temp.
    2. Snippet (360p, silent, ultrafast).
    3. Full (720p, audio, ultrafast).
    """
    file_id = extract_file_id_from_url(drive_url)
    download_url = f"https://drive.google.com/uc?id={file_id}"
    
    # 1. Prepare temp paths for raw and processed output
    fd_in, temp_in = tempfile.mkstemp(suffix=".mp4")
    fd_loop, temp_loop = tempfile.mkstemp(suffix=".mp4")
    fd_full, temp_full = tempfile.mkstemp(suffix=".mp4")
    os.close(fd_in)
    os.close(fd_loop)
    os.close(fd_full)

    try:
        # Download
        print(f"DEBUG: Downloading {download_url}...")
        gdown.download(download_url, temp_in, quiet=True, fuzzy=True)

        if not os.path.exists(temp_in) or os.path.getsize(temp_in) == 0:
            raise ValueError("Failed to download video from Google Drive.")

        # 2. Process Snippet (Loop) - Small resolution, fast preset
        print("DEBUG: Processing snippet...")
        with VideoFileClip(temp_in) as video:
            duration = min(video.duration, 5)
            # Resize and remove audio for the loop
            snippet = video.subclip(0, duration).without_audio().resize(height=360)
            snippet.write_videofile(
                temp_loop, 
                codec="libx264", 
                audio=False, 
                preset="ultrafast",
                threads=1,
                logger=None
            )
            snippet.close()

        # 3. Process Full Video - Fast preset, ensures web compatibility
        print("DEBUG: Processing full video...")
        with VideoFileClip(temp_in) as full_video:
            # We don't resize the full video, just transcode for web
            full_video.write_videofile(
                temp_full, 
                codec="libx264", 
                audio_codec="aac",
                preset="ultrafast",
                threads=1,
                logger=None
            )
            full_video.close()

        # 4. Save results to Django Storage
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
        # 5. CRITICAL: Cleanup all temp files immediately to free Docker space
        for f in [temp_in, temp_loop, temp_full]:
            if os.path.exists(f):
                try:
                    os.remove(f)
                except:
                    pass
