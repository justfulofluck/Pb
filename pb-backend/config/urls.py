"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf import settings
from django.views.static import serve as static_serve
from django.http import HttpResponse

from api.views import index_view

# Sitemap
from django.contrib.sitemaps.views import sitemap
from api.sitemaps import (
    StaticViewSitemap,
    ProductSitemap,
    BlogPostSitemap,
    EventSitemap,
    CategorySitemap,
)

_sitemaps = {
    "static": StaticViewSitemap,
    "products": ProductSitemap,
    "blog": BlogPostSitemap,
    "events": EventSitemap,
    "categories": CategorySitemap,
}


def cors_static_serve(request, path, document_root=None, show_indexes=False):
    response = static_serve(request, path, document_root, show_indexes)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "*"
    return response


def robots_txt(request):
    content = (
        "User-agent: *\n"
        "Disallow: /admin/\n"
        "Disallow: /checkout/\n"
        "Disallow: /dashboard/\n"
        "Disallow: /visitor-form/\n"
        "Disallow: /api/\n"
        "\n"
        "# AI crawler exclusion\n"
        "User-agent: GPTBot\n"
        "Disallow: /\n"
        "\n"
        "User-agent: Claude-Web\n"
        "Disallow: /\n"
        "\n"
        "User-agent: CCBot\n"
        "Disallow: /\n"
        "\n"
        "User-agent: Google-Extended\n"
        "Disallow: /\n"
        "\n"
        "User-agent: anthropic-ai\n"
        "Disallow: /\n"
        "\n"
        "Sitemap: https://pinobite.com/sitemap.xml\n"
    )
    return HttpResponse(content, content_type="text/plain; charset=utf-8")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', cors_static_serve, {'document_root': settings.MEDIA_ROOT}),
]

urlpatterns += [
    path('robots.txt', robots_txt, name='robots_txt'),
]

urlpatterns += [
    path(
        'sitemap.xml',
        sitemap,
        {'sitemaps': _sitemaps},
        name='django.contrib.sitemaps.views.sitemap',
    ),
]

urlpatterns += [
    re_path(r'^.*$', index_view, name='index'),
]
