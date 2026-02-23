import os
import re

html_file = "/home/bhavan/Videos/pb11/Pb/Snaxxo/pages/cheddar-cheese.html"
jsx_file = "/home/bhavan/Videos/pb11/Pb/pb-frontend/components/ProductPage.tsx"

with open(html_file, 'r') as f:
    html = f.read()

# Extract from 
# <section class="section overflow-hidden">
# <div class="w-layout-blockcontainer container product-page-intro w-container">
start_str = '<section class="section overflow-hidden"><div class="w-layout-blockcontainer container product-page-intro w-container">'
start_idx = html.find(start_str)

# Find the end of this section. 
# It ends right before:  <section class="section overflow-hidden"><div class="w-layout-blockcontainer container product-page-large-bg-image w-container">
end_str = '<section class="section overflow-hidden"><div class="w-layout-blockcontainer container product-page-large-bg-image w-container">'
end_idx = html.find(end_str, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find start or end")
    exit(1)

html_section = html[start_idx:end_idx]

# Convert HTML to JSX
jsx_section = html_section.replace('class=', 'className=')
jsx_section = jsx_section.replace('style="', 'styleString="') # To be handled manually or just stripped for simplicity, but wait, colors rely on it.
# Let's fix style="color:hsla(...)" to style={{ color: bgColor }}
jsx_section = re.sub(r'style="[^"]*visibility:\s*inherit[^"]*"', '', jsx_section)
jsx_section = re.sub(r'style="[^"]*color:[^"]*"', 'style={{ color: bgColor }}', jsx_section)
jsx_section = re.sub(r'style="[^"]*background-color:[^"]*"', 'style={{ backgroundColor: bgColor }}', jsx_section)

# Fix void elements
jsx_section = re.sub(r'<img([^>]+)(?<!/)>', r'<img\1/>', jsx_section)

# Rename innerHTML SVG camelCase attributes
jsx_section = jsx_section.replace('clip-path=', 'clipPath=').replace('fill-rule=', 'fillRule=').replace('opacity=', 'opacity=').replace('enable-background', 'enableBackground')

# Replace exact image sizes or srcset since we want product.image
# the image is: <img className="content-image _100" src="../images/695dbbd52febabe2129d2e32_wecdsxa.avif" ... />
jsx_section = re.sub(r'<img className="content-image _100" src="\.\./images/[^"]+"[^>]*>', '<img className="content-image _100" src={product.image} alt={product.name} data-snaxxo-animate />', jsx_section)

# Let's wrap it nicely
jsx_section = jsx_section.replace('data-gsap-init-basic-blocks="1"', 'data-snaxxo-animate')
jsx_section = jsx_section.replace('data-gsap-init-words-slide-up="1"', 'data-snaxxo-animate')
jsx_section = jsx_section.replace('words-slide-up=""', '')
jsx_section = jsx_section.replace('text-split=""', '')
jsx_section = jsx_section.replace('aria-hidden="true"', '')
jsx_section = jsx_section.replace('fade-up=""', '')
jsx_section = jsx_section.replace('slide-up=""', '')
jsx_section = jsx_section.replace('scale-up=""', '')
jsx_section = jsx_section.replace('delay="0.2"', '')
jsx_section = jsx_section.replace('duration="0.4"', '')
jsx_section = jsx_section.replace('duration="0.5"', '')
jsx_section = jsx_section.replace('duration="0.6"', '')
jsx_section = jsx_section.replace('stagger="0.05"', '')


# Read target JSX
with open(jsx_file, 'r') as f:
    target_jsx = f.read()

# Replace in target
target_start = '<section className="section overflow-hidden">\n        <div className="w-layout-blockcontainer container product-page-intro w-container">'
target_end = '</section>\n\n\n\n      <section className="section overflow-hidden relative" style={{ padding: 0, height: \'70vh\''

t_start_idx = target_jsx.find(target_start)
t_end_idx = target_jsx.find(target_end)

if t_start_idx == -1 or t_end_idx == -1:
    print("Could not find target chunk in ProductPage.tsx")
    exit(1)

new_target = target_jsx[:t_start_idx] + jsx_section + target_jsx[t_end_idx:]

with open(jsx_file, 'w') as f:
    f.write(new_target)

print("Replaced section in ProductPage.tsx")

