import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import tempfile
import uuid
import traceback
from moviepy import VideoFileClip
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def test_local_video_to_gif():
    # create dummy 2-sec video using moviepy first
    from moviepy import ColorClip
    c = ColorClip(size=(100,100), color=(255,0,0), duration=2)
    fd, temp_video_path = tempfile.mkstemp(suffix=".mp4")
    os.close(fd)
    
    fd_out, temp_gif_path = tempfile.mkstemp(suffix=".gif")
    os.close(fd_out)
    
    try:
        # Save dummy video
        c.write_videofile(temp_video_path, fps=24, codec='libx264', logger=None)
        
        # Now run our logic
        clip = VideoFileClip(temp_video_path)
        trimmed_clip = clip.subclip(0, min(5, clip.duration))
        trimmed_clip.write_gif(temp_gif_path, fps=10)
        clip.close()
        
        unique_filename = f'stories/{uuid.uuid4().hex}.gif'
        with open(temp_gif_path, 'rb') as f:
            default_storage.save(unique_filename, ContentFile(f.read()))

        print("SUCCESS! File saved.")
    except Exception as e:
        traceback.print_exc()
    finally:
        try:
            if os.path.exists(temp_video_path):
                os.remove(temp_video_path)
            if os.path.exists(temp_gif_path):
                os.remove(temp_gif_path)
            print("CLEANUP SUCCESS")
        except Exception as e:
            print(f"CLEANUP ERROR: {e}")

test_local_video_to_gif()
