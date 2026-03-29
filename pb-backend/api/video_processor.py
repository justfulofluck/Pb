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


def process_google_drive_video_to_gif(drive_url: str) -> str:
    """
    Downloads video directly from public Drive URL, trims it to 5 seconds,
    converts to GIF, and rigorously deletes the temporary local video.
    Returns the relative path under the media root.
    """
    file_id = extract_file_id_from_url(drive_url)
    download_url = f"https://drive.google.com/uc?id={file_id}"

    # 1. Download Video locally securely
    fd, temp_video_path = tempfile.mkstemp(suffix=".mp4")
    os.close(fd)  # Close file descriptor since gdown handles writing

    # Create temp gif file descriptor
    fd_out, temp_gif_path = tempfile.mkstemp(suffix=".gif")
    os.close(fd_out)

    clip = None
    trimmed_clip = None

    try:
        # Download the video directly via the public URL
        gdown.download(download_url, temp_video_path, quiet=False, fuzzy=True)

        # 2. Process Video into GIF
        clip = VideoFileClip(temp_video_path)
        trimmed_clip = clip.subclipped(0, min(5, clip.duration))

        # Write GIF (10fps for optimization)
        trimmed_clip.write_gif(temp_gif_path, fps=10)

        # 3. Move temp GIF into Django's Media storage
        unique_filename = f"stories/{uuid.uuid4().hex}.gif"
        with open(temp_gif_path, "rb") as f:
            saved_path = default_storage.save(unique_filename, ContentFile(f.read()))

        media_url = f"{settings.MEDIA_URL}{saved_path}"

    finally:
        # Guarantee ffmpeg releases the file handles so Windows os.remove doesn't throw WinError 32
        try:
            if trimmed_clip:
                trimmed_clip.close()
            if clip:
                clip.close()
        except:
            pass

        # 4. Securely delete everything from temporary storage regardless of failure
        try:
            if os.path.exists(temp_video_path):
                os.remove(temp_video_path)
            if os.path.exists(temp_gif_path):
                os.remove(temp_gif_path)
        except Exception as cleanup_error:
            print(f"Cleanup non-fatal error: {cleanup_error}")

    return media_url
