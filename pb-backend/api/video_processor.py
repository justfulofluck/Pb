import os
import tempfile
import gdown
from moviepy.editor import VideoFileClip
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid


def extract_file_id_from_url(url: str) -> str:
    import re

    # Extract Google Drive file ID from standard link structures
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", url)
    if match:
        return match.group(1)
    # Check if id= query param is used
    match = re.search(r"id=([a-zA-Z0-9_-]+)", url)
    if match:
        return match.group(1)
    return url  # Fallback to assumming the param itself is an ID


def process_google_drive_video_to_mp4(drive_url: str) -> dict:
    """
    Downloads original from Google Drive, creates:
    1. A 5s silent lightweight MP4 for the homepage grid.
    2. A web-optimized full-length version for the popup.
    Returns a dict with both paths.
    """
    file_id = extract_file_id_from_url(drive_url)
    download_url = f"https://drive.google.com/uc?id={file_id}"

    fd, temp_video_in = tempfile.mkstemp(suffix=".mp4")
    os.close(fd)
    
    fd_loop, temp_video_loop = tempfile.mkstemp(suffix=".mp4")
    os.close(fd_loop)

    fd_full, temp_video_full = tempfile.mkstemp(suffix=".mp4")
    os.close(fd_full)

    clip = None
    trimmed_clip = None

    try:
        # Download the original video
        gdown.download(download_url, temp_video_in, quiet=False, fuzzy=True)

        clip = VideoFileClip(temp_video_in)
        
        # 1. Create the LOOP (5s, no audio)
        try:
            trimmed_clip = clip.subclip(0, min(5, clip.duration))
        except AttributeError:
            trimmed_clip = clip.subclipped(0, min(5, clip.duration))

        trimmed_clip.write_videofile(
            temp_video_loop, 
            codec="libx264", 
            audio=False, 
            threads=4,
            logger=None
        )

        # 2. Create the FULL video (Compressed for web)
        # We use a CRF of 23-28 for good quality vs size balance
        clip.write_videofile(
            temp_video_full, 
            codec="libx264", 
            audio_codec="aac",
            threads=4,
            logger=None
        )

        # 3. Save both to Django Media
        base_id = uuid.uuid4().hex
        loop_name = f"stories/{base_id}_loop.mp4"
        full_name = f"stories/{base_id}_full.mp4"

        with open(temp_video_loop, "rb") as f:
            saved_loop = default_storage.save(loop_name, ContentFile(f.read()))

        with open(temp_video_full, "rb") as f:
            saved_full = default_storage.save(full_name, ContentFile(f.read()))

        return {
            "loop_url": f"{settings.MEDIA_URL}{saved_loop}",
            "full_url": f"{settings.MEDIA_URL}{saved_full}",
        }

    finally:
        # Cleanup temp files
        try:
            if trimmed_clip: trimmed_clip.close()
            if clip: clip.close()
            for f in [temp_video_in, temp_video_loop, temp_video_full]:
                if os.path.exists(f): os.remove(f)
        except: pass
