const fs = require('fs');
const file = '/home/bhavan/Videos/pb11/Pb/pb-frontend/components/ProductPage.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. Remove the extra popup at the end of the section
const popupStart = '<div styleString="background-color:hsla(33.17647058823529, 0.00%, 100.00%, 1.00)" className="ingredients-popup-wrapper">';
if (content.indexOf(popupStart) !== -1) {
    const startIdx = content.indexOf(popupStart);
    // Find the end of the section where this popup exists
    const sectionEndStr = '</p></div></div></div></section></section>';
    const endIdx = content.indexOf(sectionEndStr, startIdx);

    if (endIdx !== -1) {
        // We replace exactly the popup and the trailing `</p></div></div></div></section></section>`
        // With `</div></div></section>` because `content-wrapper intro-pdf` and `w-layout-blockcontainer` need closing.
        // Let's verify how many divs were left open before the popup.
        // Actually, let's just use string replacement specifically:
        let beforePopup = content.substring(0, startIdx);
        let afterEnd = content.substring(endIdx + sectionEndStr.length);
        content = beforePopup + '</div></div></section>\n' + afterEnd;
    }
}

// 2. Fix all styleString="..." occurrences
content = content.replace(/styleString="([^"]*)"/g, (match, val) => {
    if (val.includes('background-color:')) {
        return `style={{ backgroundColor: bgColor }}`;
    } else if (val.includes('color:')) {
        return `style={{ color: bgColor }}`;
    }
    return '';
});

// 3. Fix camelCasing for SVG elements
content = content.replace(/clip-path=/g, 'clipPath=');
content = content.replace(/fill-rule=/g, 'fillRule=');
content = content.replace(/enable-background=/g, 'enableBackground=');
content = content.replace(/xml:space=/g, 'xmlSpace=');

// 4. Any `class=` that snuck in
content = content.replace(/ class="/g, ' className="');

fs.writeFileSync(file, content);
console.log("Successfully fixed React styles and HTML structure.");
