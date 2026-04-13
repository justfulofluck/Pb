import json
import os
from django.core.management.base import BaseCommand
from api.models import BlogPost


class Command(BaseCommand):
    help = "Import blog posts from JSON fixture file"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            type=str,
            help="Path to JSON file (relative to api/fixtures/)",
            default="blog_healthy_breakfast.json",
        )

    def handle(self, *args, **options):
        filename = options["file"]
        fixture_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "fixtures", filename
        )

        if not os.path.exists(fixture_path):
            self.stderr.write(self.style.ERROR(f"File not found: {fixture_path}"))
            return

        with open(fixture_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        required_fields = [
            "post_type",
            "title",
            "excerpt",
            "image",
            "date",
            "read_time",
            "author",
            "content",
        ]
        missing = [f for f in required_fields if f not in data]
        if missing:
            self.stderr.write(self.style.ERROR(f"Missing required fields: {missing}"))
            return

        if data.get("post_type") not in ["Recipe", "Lifestyle", "News"]:
            self.stderr.write(
                self.style.ERROR(
                    f"Invalid post_type: {data.get('post_type')}. Must be Recipe, Lifestyle, or News"
                )
            )
            return

        blog_post = BlogPost.objects.create(
            post_type=data["post_type"],
            title=data["title"],
            excerpt=data.get("excerpt", ""),
            image=data.get("image", ""),
            date=data.get("date", ""),
            read_time=data.get("read_time", ""),
            author=data.get("author", ""),
            content=data.get("content", []),
            tags=data.get("tags", []),
            is_active=data.get("is_active", True),
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created blog post: "{blog_post.title}" (ID: {blog_post.id})'
            )
        )
        self.stdout.write(self.style.SUCCESS(f"  - Type: {blog_post.post_type}"))
        self.stdout.write(self.style.SUCCESS(f"  - Author: {blog_post.author}"))
        self.stdout.write(self.style.SUCCESS(f"  - Date: {blog_post.date}"))
        self.stdout.write(self.style.SUCCESS(f"  - Active: {blog_post.is_active}"))
