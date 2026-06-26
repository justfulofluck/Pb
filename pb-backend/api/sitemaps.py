from django.contrib.sitemaps import Sitemap
from .models import Product


class HomepageSitemap(Sitemap):
    priority = 1.0
    changefreq = "daily"

    def items(self):
        return [""]

    def location(self, item):
        return "/"


class ProductSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8

    def items(self):
        return Product.objects.all().order_by("name")

    def location(self, obj):
        return f"/product/{obj.slug}"

    def lastmod(self, obj):
        return obj.updated_at if obj.updated_at else obj.created_at
