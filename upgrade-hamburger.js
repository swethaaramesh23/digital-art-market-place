const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// 1. Add CSS for Professional Animated Hamburger
let css = fs.readFileSync(path.join(dir, 'css/layout.css'), 'utf8');

const hamburgerCSS = `
/* Professional Animated Hamburger */
.menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 40px;
    height: 40px;
    padding: 10px !important;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-sm);
    cursor: pointer;
    z-index: 10001;
}

@media (max-width: 900px) {
    .menu-toggle {
        display: flex !important;
    }
}

.hamburger-line {
    display: block;
    width: 20px;
    height: 2px;
    background-color: #fff;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
}

.menu-toggle.open .hamburger-line:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
}
.menu-toggle.open .hamburger-line:nth-child(2) {
    opacity: 0;
}
.menu-toggle.open .hamburger-line:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
}
`;

if (!css.includes('Professional Animated Hamburger')) {
    css += hamburgerCSS;
    fs.writeFileSync(path.join(dir, 'css/layout.css'), css);
}

// 2. Replace the HTML hamburger on all pages
const newHTML = `<button class="menu-toggle" aria-label="Toggle Menu">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>`;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Replace old font-awesome based buttons
    // Match variations like <button class="btn btn-icon btn-glass mobile-menu-btn menu-toggle" ...><i class="fa-solid fa-bars"></i></button>
    // or <button class="menu-toggle" ...><i class="fa-solid fa-bars"></i></button>
    
    html = html.replace(/<button[^>]*menu-toggle[^>]*>[\s\S]*?<\/button>/g, newHTML);
    html = html.replace(/<button[^>]*mobile-menu-btn[^>]*>[\s\S]*?<\/button>/g, newHTML);
    
    fs.writeFileSync(filePath, html);
});

// 3. Update main.js to use the new `.open` class for the animation instead of swapping font-awesome classes
let js = fs.readFileSync(path.join(dir, 'js/main.js'), 'utf8');

// Replace the old toggle logic completely
const oldToggleRegex = /menuToggle\.addEventListener\('click', \(\) => \{[\s\S]*?\}\);/m;
if (oldToggleRegex.test(js)) {
    const newToggleLogic = `menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            menuToggle.classList.toggle('open');
        });`;
    js = js.replace(oldToggleRegex, newToggleLogic);
}

// Replace close logic to remove 'open' class
const oldCloseRegex1 = /nav\.classList\.remove\('active'\);[\s\S]*?document\.body\.classList\.remove\('no-scroll'\);[\s\S]*?\}/m;
// Let's just find and replace the whole block to be safe
const fullCloseBlock = `// Mobile Menu Close Logic
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-links');
    const btn = document.querySelector('.menu-toggle');
    if (nav && nav.classList.contains('active')) {
        if (e.target === nav || (!nav.contains(e.target) && btn && !btn.contains(e.target))) {
            nav.classList.remove('active'); 
            document.body.classList.remove('no-scroll');
            if (btn) btn.classList.remove('open');
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const navLinksAnchors = document.querySelectorAll('.nav-links a');
    navLinksAnchors.forEach(a => {
        a.addEventListener('click', () => {
            const nav = document.querySelector('.nav-links');
            const btn = document.querySelector('.menu-toggle');
            if(nav) nav.classList.remove('active'); 
            document.body.classList.remove('no-scroll');
            if(btn) btn.classList.remove('open');
        });
    });
});`;

// clear out old close block
const closeStart = js.indexOf('// Mobile Menu Close Logic');
if (closeStart !== -1) {
    js = js.substring(0, closeStart) + fullCloseBlock;
}

fs.writeFileSync(path.join(dir, 'js/main.js'), js);
console.log('Successfully upgraded hamburger to a professional CSS animation!');
