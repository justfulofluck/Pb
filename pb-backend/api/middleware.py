"""
Prerender.io Middleware for Django.

Detects crawler user agents and serves pre-rendered HTML from
the Prerender.io service for improved SEO indexing.
"""
import ipaddress
import re
from urllib.parse import urlencode, urlparse, parse_qs

import requests
from django.conf import settings
from django.http import HttpResponse


class PrerenderMiddleware:
    """
    Middleware that intercepts crawler/bot requests and returns
    server-side rendered HTML from Prerender.io.
    Regular traffic passes through unchanged.
    """

    PRERENDER_IPS = [
        ipaddress.ip_network("103.207.40.0/22"),
        ipaddress.ip_network("104.224.12.0/22"),
        ipaddress.ip_network("2602:2dd::/36"),
    ]

    CRAWLER_USER_AGENTS = [
        "googlebot",
        "bingbot",
        "facebookexternalhit",
        "facebookcatalog",
        "twitterbot",
        "slackbot",
        "slack-image-crawler",
        "linkedinbot",
        "whatsapp",
        "telegrambot",
        "applebot",
        "pinterest",
        "discordbot",
        "yahoo! slurp",
        "baiduspider",
        "yandexbot",
        "rogerbot",
        "embedly",
        "quora link preview",
        "showyoubot",
        "outbrain",
        "ia_archiver",
        "ahrefsbot",
        "semrushbot",
        "dotbot",
        "seznambot",
        "gptbot",
        "claude-web",
        "ccbot",
        "chrome-lighthouse",
        "prerender",
    ]

    EXTENSIONS_TO_SKIP = (
        ".js", ".css", ".json", ".xml", ".txt", ".ico",
        ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp",
        ".avif", ".mp4", ".webm", ".woff", ".woff2", ".ttf",
        ".eot", ".pdf", ".zip", ".gz", ".map",
    )

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method not in ("GET", "HEAD"):
            return self.get_response(request)

        path = request.path_info

        if path.startswith("/api/") or path.startswith("/admin/") \
                or path.startswith("/media/") or path.startswith("/static/"):
            return self.get_response(request)

        if any(path.lower().endswith(ext) for ext in self.EXTENSIONS_TO_SKIP):
            return self.get_response(request)

        remote_ip = request.META.get("REMOTE_ADDR", "")
        try:
            ip_obj = ipaddress.ip_address(remote_ip)
            for net in self.PRERENDER_IPS:
                if ip_obj in net:
                    return self.get_response(request)
        except ValueError:
            pass

        user_agent = request.META.get("HTTP_USER_AGENT", "").lower()
        is_crawler = any(crawler in user_agent for crawler in self.CRAWLER_USER_AGENTS)
        has_fragment = "_escaped_fragment_" in request.GET

        if not (is_crawler or has_fragment):
            return self.get_response(request)

        return self._fetch_prerendered(request)

    def _fetch_prerendered(self, request):
        prerender_token = getattr(settings, "PRERENDER_TOKEN", None)
        if not prerender_token:
            return self.get_response(request)

        scheme = "https"
        full_url = f"{scheme}://{request.get_host()}{request.get_full_path()}"

        if "_escaped_fragment_" in full_url:
            parsed = urlparse(full_url)
            query_params = parse_qs(parsed.query, keep_blank_values=True)
            query_params.pop("_escaped_fragment_", None)
            cleaned_query = urlencode(query_params, doseq=True)
            cleaned_path = parsed.path
            if cleaned_query:
                cleaned_path += f"?{cleaned_query}"
            full_url = f"{scheme}://{parsed.netloc}{cleaned_path}"

        prerender_url = f"https://service.prerender.io/{full_url}"

        try:
            resp = requests.get(
                prerender_url,
                headers={
                    "User-Agent": request.META.get("HTTP_USER_AGENT", ""),
                    "Accept": (
                        "text/html,application/xhtml+xml,"
                        "application/xml;q=0.9,*/*;q=0.8"
                    ),
                    "Accept-Language": request.META.get(
                        "HTTP_ACCEPT_LANGUAGE", "en-US,en;q=0.5"
                    ),
                    "X-Prerender-Token": prerender_token,
                },
                cookies=request.COOKIES,
                timeout=30,
                proxies=getattr(settings, "PRERENDER_PROXIES", None),
            )

            if resp.status_code == 200:
                response = HttpResponse(
                    resp.content,
                    content_type="text/html; charset=utf-8",
                    status=resp.status_code,
                )
                for header, value in resp.headers.items():
                    if header.lower().startswith("x-prerender-"):
                        response[header] = value
                return response

        except requests.ConnectionError:
            pass
        except requests.Timeout:
            pass
        except requests.RequestException:
            pass

        return self.get_response(request)
