"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf import settings
from django.views.static import serve as static_serve
from django.http import HttpResponse
import json

from api.views import index_view

# Sitemap
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom


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
        "Disallow: /3D-assets/\n"
        "Disallow: /media/\n"
        "Disallow: /wp-\n"
        "Crawl-delay: 10\n"
        "Content-Signal: ai-train=no, search=yes, ai-input=no\n"
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
        "User-agent: ClaudeBot\n"
        "Disallow: /\n"
        "\n"
        "Sitemap: https://pinobite.com/sitemap.xml\n"
    )
    return HttpResponse(content, content_type="text/plain; charset=utf-8")


def old_url_gone(request, *args, **kwargs):
    return HttpResponse(status=404)


from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom


def sitemap_text_xml(request, *args, **kwargs):
    site = "https://pinobite.com"

    root = Element("urlset")
    root.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    # Homepage
    url_el = SubElement(root, "url")
    loc = SubElement(url_el, "loc")
    loc.text = site + "/"
    cf = SubElement(url_el, "changefreq")
    cf.text = "daily"
    pr = SubElement(url_el, "priority")
    pr.text = "1.0"

    # Products
    from api.models import Product
    for product in Product.objects.all().order_by("name"):
        url_el = SubElement(root, "url")
        loc = SubElement(url_el, "loc")
        loc.text = site + f"/product/{product.slug}"
        cf = SubElement(url_el, "changefreq")
        cf.text = "daily"
        pr = SubElement(url_el, "priority")
        pr.text = "0.8"
        lm = SubElement(url_el, "lastmod")
        dt = product.updated_at if product.updated_at else product.created_at
        lm.text = dt.strftime("%Y-%m-%d") if dt else ""

    rough = tostring(root, encoding="unicode")
    reparsed = minidom.parseString(rough)
    xml = reparsed.toprettyxml(indent="", newl="")

    return HttpResponse(xml, content_type="text/xml; charset=utf-8")


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

def llms_txt(request):
    site = "https://pinobite.com"
    content = f"""# Pinobite
> Premium healthy energy bars, nut butters, and superfoods — made with 100% natural ingredients.

## Core Pages
- [Home]({site}/): Pinobite homepage — featured products, categories, and brand story.
- [Shop]({site}/shop): Browse all products by category (Peanut Butter, Muesli, Oats).
- [FAQ]({site}/faq): Frequently asked questions about products, shipping, and returns.
- [Blogs]({site}/blogs): Health, nutrition, and recipe articles.
- [Events]({site}/events): Community events and brand activations.
- [Our Journey]({site}/journey): The Pinobite story and mission.
- [Become a Distributor]({site}/distributor): Partner with Pinobite.

## Products
- [Natural Crunchy Peanut Butter]({site}/product/natural-crunchy-peanut-butter): 100% roasted peanuts, no added sugar or salt.
- [Mango With Chia Seeds Peanut Butter]({site}/product/mango-with-chia-seeds-peanut-butter): Real Alphonso mango with omega-3 rich chia seeds.
- [Dark Chocolate Almond Crunchy Peanut Butter]({site}/product/dark-chocolate-almond-crunchy-peanut-butter): Rich dark Belgian chocolate with premium almonds.
- [Strawberry With Chia Peanut Butter]({site}/product/strawberry-with-chia-peanut-butter): Strawberry and chia seed fusion.
- [American Nuts Crunchy Peanut Butter]({site}/product/american-nuts-crunchy-peanut-butter): Premium American nuts with dry fruits and berries.
- [Pineapple Crunchy Peanut Butter]({site}/product/pineapple-crunchy-peanut-butter): Tropical pineapple flavored peanut butter.
- [Oats with Dark Chocolate Mixnut & Berry]({site}/product/oats-with-dark-chocolate-mixnut-berry): Whole grain oats with dark chocolate, nuts, and berries.
- [Dark Chocolate Berries & Almonds Muesli]({site}/product/dark-chocolate-berries-almonds-muesli): Wholesome muesli with dark chocolate, berries, and almonds.

## Blog Posts
- [How to Choose the Best Peanut Butter for You]({site}/blog/how-to-choose-the-best-peanut-butter-for-you)
- [Easy Peanut Butter Recipes You Can Make at Home]({site}/blog/easy-peanut-butter-recipes-you-can-make-at-home)
- [Why Peanut Butter is Popular in Fitness Diets]({site}/blog/why-peanut-butter-is-popular-in-fitness-diets)

## Policies
- [Privacy Policy]({site}/privacy-policy)
- [Terms & Conditions]({site}/terms-and-conditions)
- [Refund Policy]({site}/refund-policy)
- [Shipping Policy]({site}/shipping-policy)
"""
    return HttpResponse(content, content_type="text/plain; charset=utf-8")


urlpatterns += [
    path('robots.txt', robots_txt, name='robots_txt'),
    path('llms.txt', llms_txt, name='llms_txt'),
]


def api_catalog(request):
    data = {
        "linkset": [
            {
                "anchor": "https://pinobite.com/api/",
                "service-desc": [
                    {
                        "href": "https://pinobite.com/api/schema/",
                        "type": "application/vnd.oai.openapi"
                    }
                ],
                "service-doc": [
                    {
                        "href": "https://pinobite.com/api/docs/",
                        "type": "text/html"
                    },
                    {
                        "href": "https://pinobite.com/api/redoc/",
                        "type": "text/html"
                    }
                ]
            }
        ]
    }
    return HttpResponse(
        json.dumps(data, indent=2),
        content_type='application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'
    )


urlpatterns += [
    re_path(r'^\.well-known/api-catalog$', api_catalog, name='api_catalog'),
]

urlpatterns += [
    path(
        'sitemap.xml',
        sitemap_text_xml,
        name='sitemap',
    ),
]

urlpatterns += [
    # Old WooCommerce / WordPress URLs — return 404 so Googlebot drops them
    re_path(r'^product-category/.*', old_url_gone),
    re_path(r'^product-tag/.*', old_url_gone),
    re_path(r'^product-type-.*', old_url_gone),
    re_path(r'^blog/tag/.*', old_url_gone),
    re_path(r'^blog/type/.*', old_url_gone),
    re_path(r'^wp-.*', old_url_gone),
    re_path(r'^my-account.*', old_url_gone),
    re_path(r'^cart.*', old_url_gone),
    re_path(r'^checkout-2-2.*', old_url_gone),
    re_path(r'^shop-right-sidebar.*', old_url_gone),
    re_path(r'^about.*', old_url_gone),
    re_path(r'^contact.*', old_url_gone),
    re_path(r'^our-story.*', old_url_gone),
    re_path(r'^our-products.*', old_url_gone),
    re_path(r'^feed.*', old_url_gone),
    re_path(r'^history.*', old_url_gone),
    re_path(r'^account-login-page.*', old_url_gone),
]

urlpatterns += [
    re_path(r'^.*$', index_view, name='index'),
]
