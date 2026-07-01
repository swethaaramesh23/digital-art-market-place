const fs = require('fs');

// 1. Further reduce font-size and spacing
let css = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/css/layout.css','utf8');
css = css.replace('font-size: 1.1rem !important;', 'font-size: 1.0rem !important;');
css = css.replace('margin: 8px 0 !important;', 'margin: 5px 0 !important;');
fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/css/layout.css', css);

// 2. Fix JS so clicking the background of the nav-links closes the menu
let js = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/js/main.js','utf8');
// Find the mobile close logic and replace it
const oldLogic = `// Mobile Menu Close Logic
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-links');
    const btn = document.querySelector('.mobile-menu-btn') || document.querySelector('.menu-toggle');
    if (nav && nav.classList.contains('active')) {
        if (!nav.contains(e.target) && btn && !btn.contains(e.target)) {
            nav.classList.remove('active'); document.body.classList.remove('no-scroll');
        }
    }
});`;

const newLogic = `// Mobile Menu Close Logic
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-links');
    const btn = document.querySelector('.mobile-menu-btn') || document.querySelector('.menu-toggle');
    if (nav && nav.classList.contains('active')) {
        // Close if they clicked exactly on the full-screen background (nav itself) 
        // OR if they clicked outside completely
        if (e.target === nav || (!nav.contains(e.target) && btn && !btn.contains(e.target))) {
            nav.classList.remove('active'); 
            document.body.classList.remove('no-scroll');
        }
    }
});`;

if(js.includes(oldLogic)) {
    js = js.replace(oldLogic, newLogic);
} else {
    // Just inject the specific if condition if regex is easier
    js = js.replace("if (!nav.contains(e.target) && btn && !btn.contains(e.target)) {", "if (e.target === nav || (!nav.contains(e.target) && btn && !btn.contains(e.target))) {");
}
fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/js/main.js', js);
console.log('Fixed background click and reduced sizes');
