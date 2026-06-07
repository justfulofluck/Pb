"""
Sitemap definitions for Pinobite.

Defines sitemap entries for static pages, products, blog posts,
events, and categories using Django's sitemap framework.
"""
from django.contrib.sitemaps import Sitemap
from .models import Product, BlogPost, Event, Category


class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = "weekly"

    PRIORITIES = {
        "": 1.0,
        "shop": 0.9,
        "blogs": 0.8,
        "about": 0.7,
        "journey": 0.7,
        "contact": 0.6,
        "events": 0.7,
        "distributors": 0.6,
        "faq": 0.6,
        "terms": 0.3,
        "privacy": 0.3,
        "refund": 0.3,
        "shipping": 0.3,
    }

    CHANGEFREQ = {
        "": "daily",
        "shop": "daily",
        "blogs": "daily",
        "events": "weekly",
    }

    def items(self):
        return [
            "", "shop", "about", "journey", "contact",
            "blogs", "events", "distributors", "faq",
            "terms", "privacy", "refund", "shipping",
        ]

    def location(self, item):
        if item == "":
            return "/"
        return f"/{item}"

    def priority(self, item):
        return self.PRIORITIES.get(item, 0.5)

    def changefreq(self, item):
        return self.CHANGEFREQ.get(item, "monthly")


class ProductSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8

    def items(self):
        return Product.objects.all()

    def location(self, obj):
        return f"/product/{obj.slug}"


class BlogPostSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        return BlogPost.objects.filter(is_active=True)

    def location(self, obj):
        return f"/blog/{obj.slug}"

    def lastmod(self, obj):
        return obj.updated_at if obj.updated_at else obj.created_at


class EventSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6

    def items(self):
        return Event.objects.filter(is_active=True)

    def location(self, obj):
        return f"/events/{obj.pk}"


class CategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return Category.objects.all()

    def location(self, obj):
        return f"/shop?category={obj.name}"
