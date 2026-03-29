import requests
token = "replace_with_token_if_needed"
data = {
    "category": "Test",
    "headline": "Test",
    "image": "",
    "cta": "Test",
    "bg_color": "Test",
    "accent_color": "Test",
    "blob_color": "Test",
    "is_active": True
}
res = requests.post("http://localhost:8003/api/hero-slides/", json=data)
print(res.status_code, res.text)
