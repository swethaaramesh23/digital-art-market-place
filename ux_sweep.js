const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// 1. Fix CSS (layout.css)
let cssPath = path.join(dir, 'css/layout.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Ensure header.scrolled has z-index 10000 and padding works properly
css = css.replace(/header\.scrolled\s*\{[\s\S]*?\}/, `header.scrolled {
    background: var(--bg-glass) !important;
    backdrop-filter: blur(12px) !important;
    border-bottom: 1px solid var(--border-glass) !important;
    padding: 0 !important;
    z-index: 10000 !important;
}`);

// Ensure main padding is tighter
if(css.includes('main, .main-content { padding-top: 100px !important; }')) {
    css = css.replace('main, .main-content { padding-top: 100px !important; }', 'main, .main-content { padding-top: 75px !important; }');
}

// Ensure cards are same height globally
if (!css.includes('.glass-card { display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; }')) {
    css += `\n/* Ensure equal height cards */
.glass-card { display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; height: 100%; }
.nft-info { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
.hero-section { padding-top: 60px !important; } /* Reduce top space */
section { padding: 40px 0 !important; } /* tighter sections */
`;
}
fs.writeFileSync(cssPath, css);


// 2. Fix main.js Scroll Performance & Button Handling
let jsPath = path.join(dir, 'js/main.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Replace raw scroll listeners with RequestAnimationFrame
const oldScrollRegex = /window\.addEventListener\('scroll', \(\) => \{[\s\S]*?header\.classList\.add\('scrolled'\);[\s\S]*?\}\);/m;
if (oldScrollRegex.test(js)) {
    const newScroll = `let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const header = document.querySelector('header');
                if (header) {
                    if (window.scrollY > 50) header.classList.add('scrolled');
                    else header.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });`;
    js = js.replace(oldScrollRegex, newScroll);
}

const oldScroll2Regex = /window\.addEventListener\('scroll', \(\) => \{\s*\/\/\s*Progress Bar[\s\S]*?pointerEvents = 'auto';\s*\}\s*else\s*\{[\s\S]*?\}\s*\}\);/m;
if (oldScroll2Regex.test(js)) {
    const newScroll2 = `let isScrolling2 = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling2) {
            window.requestAnimationFrame(() => {
                const progressBar = document.getElementById('preloader-bar');
                const backToTopBtn = document.getElementById('backToTop');
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                if(progressBar && height > 0) {
                    const scrolled = (winScroll / height) * 100;
                    progressBar.style.width = scrolled + '%';
                }
                if(backToTopBtn) {
                    if (winScroll > 500) {
                        backToTopBtn.style.opacity = '1';
                        backToTopBtn.style.transform = 'translateY(0)';
                        backToTopBtn.style.pointerEvents = 'auto';
                    } else {
                        backToTopBtn.style.opacity = '0';
                        backToTopBtn.style.transform = 'translateY(20px)';
                        backToTopBtn.style.pointerEvents = 'none';
                    }
                }
                isScrolling2 = false;
            });
            isScrolling2 = true;
        }
    });`;
    js = js.replace(oldScroll2Regex, newScroll2);
}


// Fix global button functionality & loading states
const oldBtnLogic = /document\.querySelectorAll\('button, \.btn'\)\.forEach\(btn => \{[\s\S]*?\}\);/m;
if (oldBtnLogic.test(js)) {
    const newBtnLogic = `document.querySelectorAll('button:not(.menu-toggle), .btn').forEach(btn => {
        if (!btn.hasAttribute('onclick') && !btn.id && btn.innerText.trim().length > 0) {
            btn.addEventListener('click', (e) => {
                // If it's a real link, let it navigate, unless href is #
                if (btn.tagName === 'A' && btn.getAttribute('href') && btn.getAttribute('href') !== '#') {
                    return; 
                }
                e.preventDefault();
                
                // Don't trigger if already loading
                if(btn.classList.contains('btn-loading')) return;
                
                // Add loading state
                const originalHTML = btn.innerHTML;
                const originalWidth = btn.offsetWidth;
                btn.style.width = originalWidth + 'px'; // Lock width to prevent layout shift
                btn.classList.add('btn-loading');
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                
                setTimeout(() => {
                    btn.classList.remove('btn-loading');
                    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    btn.style.backgroundColor = 'var(--accent-neon-blue)';
                    btn.style.color = '#000';
                    btn.style.borderColor = 'var(--accent-neon-blue)';
                    
                    showToast('Success! Action completed.');
                    
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style = '';
                    }, 2000);
                }, 800);
            });
        }
    });`;
    js = js.replace(oldBtnLogic, newBtnLogic);
}

fs.writeFileSync(jsPath, js);
console.log('UX sweep JS applied!');
