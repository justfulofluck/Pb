"""
Django management command to convert base64-encoded images to proper media files.
Run: python manage.py convert_base64_images
"""
import os
import re
import base64
import uuid
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings

from api.models import Product, HeroSlide, BlogPost, Category, Event, Story, UsageIdea


class Command(BaseCommand):
    help = 'Convert base64 data URL images to proper media files'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting base64 image conversion...'))
        
        # Ensure media directories exist
        media_root = settings.MEDIA_ROOT
        os.makedirs(media_root, exist_ok=True)
        
        # Track statistics
        stats = {
            'products': 0,
            'heroslides': 0,
            'blogposts': 0,
            'categories': 0,
            'events': 0,
            'stories': 0,
            'usageideas': 0,
            'models_3d': 0,
            'errors': []
        }
        
        # Process Products
        self.stdout.write('\nProcessing Products...')
        for product in Product.objects.all():
            try:
                # Process main image
                if product.image and str(product.image).startswith('data:'):
                    self.process_image_field(product, 'image', 'products', stats)
                
                # Process 3D model field (FileField)
                if product.model_3d and str(product.model_3d).startswith('data:'):
                    self.process_file_field(product, 'model_3d', 'models_3d', stats)
                
                # Process gallery images (JSON field)
                if product.gallery:
                    new_gallery = []
                    changed = False
                    for img_path in product.gallery:
                        if isinstance(img_path, str) and img_path.startswith('data:'):
                            filename = self.save_base64_image(img_path, 'products/gallery')
                            new_gallery.append(filename)
                            changed = True
                        else:
                            new_gallery.append(img_path)
                    if changed:
                        product.gallery = new_gallery
                        product.save(update_fields=['gallery'])
                        stats['products'] += 1
                        self.stdout.write(f"  Updated gallery for Product {product.id}: {product.name}")
            except Exception as e:
                stats['errors'].append(f"Product {product.id}: {str(e)}")
                self.stdout.write(self.style.ERROR(f"  Error processing Product {product.id}: {e}"))
        
        # Process HeroSlides
        self.stdout.write('\nProcessing HeroSlides...')
        for slide in HeroSlide.objects.all():
            try:
                for field in ['image', 'background_image', 'mobile_image']:
                    val = getattr(slide, field, None)
                    if val and str(val).startswith('data:'):
                        subdir = 'hero'
                        if field == 'mobile_image':
                            subdir = 'hero/mobile'
                        elif field == 'background_image':
                            subdir = 'hero/bg'
                        self.process_image_field(slide, field, subdir, stats)
                stats['heroslides'] += 1
            except Exception as e:
                stats['errors'].append(f"HeroSlide {slide.id}: {str(e)}")
                self.stdout.write(self.style.ERROR(f"  Error processing HeroSlide {slide.id}: {e}"))
        
        # Process BlogPosts
        self.stdout.write('\nProcessing BlogPosts...')
        for blog in BlogPost.objects.all():
            try:
                for field in ['image', 'author_image', 'secondary_image', 'tertiary_image']:
                    val = getattr(blog, field, None)
                    if val and str(val).startswith('data:'):
                        subdir = 'blog'
                        if field == 'author_image':
                            subdir = 'blog/authors'
                        elif field in ['secondary_image', 'tertiary_image']:
                            subdir = 'blog/extra'
                        self.process_image_field(blog, field, subdir, stats)
                stats['blogposts'] += 1
            except Exception as e:
                stats['errors'].append(f"BlogPost {blog.id}: {str(e)}")
                self.stdout.write(self.style.ERROR(f"  Error processing BlogPost {blog.id}: {e}"))
        
        # Process Categories
        self.stdout.write('\nProcessing Categories...')
        for category in Category.objects.all():
            try:
                if category.image and str(category.image).startswith('data:'):
                    self.process_image_field(category, 'image', 'categories', stats)
                stats['categories'] += 1
            except Exception as e:
                stats['errors'].append(f"Category {category.id}: {str(e)}")
        
        # Process Events
        self.stdout.write('\nProcessing Events...')
        for event in Event.objects.all():
            try:
                if event.image and str(event.image).startswith('data:'):
                    self.process_image_field(event, 'image', 'events', stats)
                # Process gallery if it contains images (though typically it might be other media)
                stats['events'] += 1
            except Exception as e:
                stats['errors'].append(f"Event {event.id}: {str(e)}")
        
        # Process Stories
        self.stdout.write('\nProcessing Stories...')
        for story in Story.objects.all():
            try:
                for field in ['media_url', 'poster_url', 'full_video_url']:
                    val = getattr(story, field, None)
                    if val and str(val).startswith('data:'):
                        subdir = 'stories'
                        if field == 'poster_url':
                            subdir = 'stories/posters'
                        elif field == 'full_video_url':
                            subdir = 'stories/full'
                        self.process_file_field(story, field, subdir, stats)
                stats['stories'] += 1
            except Exception as e:
                stats['errors'].append(f"Story {story.id}: {str(e)}")
        
        # Process UsageIdeas
        self.stdout.write('\nProcessing UsageIdeas...')
        for idea in UsageIdea.objects.all():
            try:
                if idea.image and str(idea.image).startswith('data:'):
                    self.process_image_field(idea, 'image', 'usage_ideas', stats)
                stats['usageideas'] += 1
            except Exception as e:
                stats['errors'].append(f"UsageIdea {idea.id}: {str(e)}")
        
        # Print summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('Conversion Complete!'))
        self.stdout.write(f"Products processed: {stats['products']}")
        self.stdout.write(f"HeroSlides processed: {stats['heroslides']}")
        self.stdout.write(f"BlogPosts processed: {stats['blogposts']}")
        self.stdout.write(f"Categories processed: {stats['categories']}")
        self.stdout.write(f"Events processed: {stats['events']}")
        self.stdout.write(f"Stories processed: {stats['stories']}")
        self.stdout.write(f"UsageIdeas processed: {stats['usageideas']}")
        self.stdout.write(f"3D Models processed: {stats['models_3d']}")
        if stats['errors']:
            self.stdout.write(self.style.WARNING(f"\nErrors ({len(stats['errors'])}):"))
            for err in stats['errors']:
                self.stdout.write(f"  - {err}")
    
    def extract_file_info(self, data_url):
        """Extract mime type and base64 data from data URL."""
        # Pattern: data:<mime>;base64,<data>
        # Matches both image/* and other MIME types
        match = re.match(r'data:([^;]+);base64,(.*)', data_url, re.DOTALL)
        if not match:
            raise ValueError(f"Invalid data URL format: {data_url[:50]}...")
        mime_type = match.group(1)
        base64_data = match.group(2)
        
        # Map common MIME types to extensions
        mime_to_ext = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'image/svg+xml': 'svg',
            'image/avif': 'avif',
            'model/gltf+json': 'glb',
            'application/octet-stream': 'bin',
            'application/pdf': 'pdf',
            'video/mp4': 'mp4',
            'video/webm': 'webm',
        }
        
        # For images, use specific mapping; for others, try to derive extension
        if mime_type in mime_to_ext:
            ext = mime_to_ext[mime_type]
        else:
            # Fallback: try to get subtype after '/'
            parts = mime_type.split('/')
            ext = parts[-1] if len(parts) > 1 else 'bin'
            # Remove common suffixes like +json
            ext = ext.split('+')[0]
        
        return mime_type, ext, base64_data
    
    def save_base64_image(self, data_url, subdir):
        """Decode base64 image and save to media folder. Returns relative path."""
        mime_type, ext, base64_data = self.extract_file_info(data_url)
        
        # Generate unique filename
        filename = f"{uuid.uuid4().hex}.{ext}"
        rel_path = os.path.join(subdir, filename)
        abs_path = os.path.join(settings.MEDIA_ROOT, rel_path)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        
        # Decode and save
        try:
            file_data = base64.b64decode(base64_data)
            with open(abs_path, 'wb') as f:
                f.write(file_data)
            return rel_path.replace('\\', '/')  # Ensure forward slashes
        except Exception as e:
            raise Exception(f"Failed to save image: {e}")
    
    def process_image_field(self, obj, field_name, subdir, stats):
        """Process a single ImageField containing base64 data."""
        val = str(getattr(obj, field_name))
        if not val.startswith('data:'):
            return
        
        try:
            new_path = self.save_base64_image(val, subdir)
            setattr(obj, field_name, new_path)
            obj.save(update_fields=[field_name])
            stats[obj.__class__.__name__.lower() + 's'] += 1
            self.stdout.write(f"  Converted {obj.__class__.__name__} {obj.id}: {field_name} -> {new_path}")
        except Exception as e:
            raise Exception(f"Failed to process {field_name}: {e}")
    
    def process_file_field(self, obj, field_name, subdir, stats):
        """Process a FileField containing base64 data."""
        val = str(getattr(obj, field_name))
        if not val.startswith('data:'):
            return
        
        try:
            # Extract extension from mime type
            mime_type, ext, base64_data = self.extract_file_info(val)
            filename = f"{uuid.uuid4().hex}.{ext}"
            rel_path = os.path.join(subdir, filename)
            abs_path = os.path.join(settings.MEDIA_ROOT, rel_path)
            
            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            file_data = base64.b64decode(base64_data)
            with open(abs_path, 'wb') as f:
                f.write(file_data)
            
            setattr(obj, field_name, rel_path.replace('\\', '/'))
            obj.save(update_fields=[field_name])
            stats[obj.__class__.__name__.lower() + 's'] += 1
            self.stdout.write(f"  Converted {obj.__class__.__name__} {obj.id}: {field_name} -> {rel_path}")
        except Exception as e:
            raise Exception(f"Failed to process {field_name}: {e}")
