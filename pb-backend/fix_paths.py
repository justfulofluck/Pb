import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product, Story, HeroSlide, Event, BlogPost, UsageIdea, Category

def fix_path(obj, field_name):
    val = str(getattr(obj, field_name))
    if val.startswith('/media/'):
        print(f"Fixing path for {obj.__class__.__name__} {obj.id}: {val}")
        new_val = val.replace('/media/', '', 1)
        # Use simple string update to avoid FileField's path prefixing
        setattr(obj, field_name, new_val)
        obj.save()
        print(f"  New path: {new_val}")

def run():
    print("Starting path fix...")
    
    for p in Product.objects.all():
        fix_path(p, 'image')
        if p.gallery:
            new_gallery = [img.replace('/media/', '', 1) if str(img).startswith('/media/') else img for img in p.gallery]
            if new_gallery != p.gallery:
                p.gallery = new_gallery
                p.save()
                print(f"  Fixed gallery for Product {p.id}")
                
    for s in Story.objects.all():
        fix_path(s, 'media_url')
        fix_path(s, 'poster_url')
        fix_path(s, 'full_video_url')
        
    for h in HeroSlide.objects.all():
        fix_path(h, 'image')
        fix_path(h, 'background_image')
        
    for e in Event.objects.all():
        fix_path(e, 'image')
        
    for b in BlogPost.objects.all():
        fix_path(b, 'image')
        
    for c in Category.objects.all():
        fix_path(c, 'image')

    print("Path fix finished.")

if __name__ == "__main__":
    run()
