const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// 1. Fix main.js hamburger logic to support dashboard sidebar
let jsPath = path.join(dir, 'js/main.js');
let js = fs.readFileSync(jsPath, 'utf8');

const oldToggleRegex = /menuToggle\.addEventListener\('click', \(\) => \{\s*navLinks\.classList\.toggle\('active'\);[\s\S]*?menuToggle\.classList\.toggle\('open'\);\s*\}\);/m;
if (oldToggleRegex.test(js)) {
    const newToggleLogic = `menuToggle.addEventListener('click', () => {
            const targetNav = document.querySelector('.nav-links') || document.querySelector('.sidebar');
            if (targetNav) targetNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            menuToggle.classList.toggle('open');
            
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) overlay.classList.toggle('active');
        });`;
    js = js.replace(oldToggleRegex, newToggleLogic);
}

// Fix dashboard overlay close logic
const oldCloseLogic = /const nav = document\.querySelector\('\.nav-links'\);/g;
if (oldCloseLogic.test(js)) {
    js = js.replace(/const nav = document\.querySelector\('\.nav-links'\);/g, "const nav = document.querySelector('.nav-links') || document.querySelector('.sidebar');");
    
    // Also remove active from overlay when closing
    js = js.replace(/document\.body\.classList\.remove\('no-scroll'\);/g, "document.body.classList.remove('no-scroll');\n            const overlay = document.querySelector('.sidebar-overlay');\n            if(overlay) overlay.classList.remove('active');");
}

fs.writeFileSync(jsPath, js);

// 2. Fix Logo Links globally (Just in case they are missing)
// I will ensure e.preventDefault() in my recent main.js doesn't break index.html
// In ux_sweep.js I wrote:
// if (btn.tagName === 'A' && btn.getAttribute('href') && btn.getAttribute('href') !== '#') { return; }
// This correctly ignores valid anchor tags, so clicking logo should work perfectly!
// But just to be sure, check if logo has href="index.html" on all pages.

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
files.forEach(file => {
    let html = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Fix blog.html hero section
    if (file === 'blog.html') {
        const oldHero = `<div class="glass-card gsap-reveal" style="padding: 0; overflow: hidden; display: flex; flex-wrap: wrap; margin-bottom: 40px;">
                <div style="flex: 1; min-width: 100%; max-width: 300px;">
                    <img loading="lazy" src="image-digi/real_avatar_10.webp" style="width: 100%; height: 100%; object-fit: cover; min-height: 300px;">
                </div>
                <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                    <div class="badge" style="margin-bottom: 20px; display: inline-block; align-self: flex-start; background: rgba(138,43,226,0.1); color: var(--accent-purple); border-color: var(--accent-purple);">Featured Story</div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 20px;">The Future of Digital Ownership on Stackly</h2>
                    <p class="text-secondary" style="margin-bottom: 30px; font-size: 1.1rem;">We sat down with our founders to discuss where the NFT space is heading in the next 5 years, and how Stackly is preparing for mass adoption.</p>
                    <a href="404.html" class="btn btn-primary magnetic" style="align-self: flex-start;">Read Full Story <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>`;
            
        const newHero = `<div class="glass-card gsap-reveal" style="padding: 0; overflow: hidden; display: flex; flex-wrap: wrap; margin-bottom: 40px; flex-direction: row-reverse;">
                <div style="flex: 1; min-width: 300px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2);">
                    <img loading="lazy" src="image-digi/real_avatar_10.webp" style="width: 100%; max-width: 400px; height: auto; object-fit: cover; border-radius: var(--radius-md); padding: 20px;">
                </div>
                <div style="flex: 1; min-width: 300px; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                    <div class="badge" style="margin-bottom: 20px; display: inline-block; align-self: flex-start; background: rgba(138,43,226,0.1); color: var(--accent-purple); border-color: var(--accent-purple);">Featured Story</div>
                    <h2 style="font-size: 2.5rem; margin-bottom: 20px;">The Future of Digital Ownership on Stackly</h2>
                    <p class="text-secondary" style="margin-bottom: 30px; font-size: 1.1rem;">We sat down with our founders to discuss where the NFT space is heading in the next 5 years, and how Stackly is preparing for mass adoption.</p>
                    <a href="404.html" class="btn btn-primary magnetic" style="align-self: flex-start;">Read Full Story <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>`;
            
        if (html.includes('The Future of Digital Ownership on Stackly')) {
            html = html.replace(oldHero, newHero);
        }
    }
    
    // Make sure logo has correct href.
    html = html.replace(/<a href="#" class="logo"/g, '<a href="index.html" class="logo"');
    
    fs.writeFileSync(path.join(dir, file), html);
});

console.log('Fixed dashboard hamburger, blog hero, and logo links.');
