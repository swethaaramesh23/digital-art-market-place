const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// 1. CSS STATES & SMOOTH SCROLLING (components.css)
const cssFile = path.join(dir, 'css/components.css');
if (fs.existsSync(cssFile)) {
    let css = fs.readFileSync(cssFile, 'utf8');
    if (!css.includes('/* Interactive States & Forms */')) {
        css += `
/* Interactive States & Forms */
html { scroll-behavior: smooth; }

.btn:active {
    transform: scale(0.95) !important;
}

.btn-loading {
    position: relative !important;
    color: transparent !important;
    pointer-events: none !important;
}
.btn-loading::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    animation: btn-spin 1s linear infinite;
}
@keyframes btn-spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
}

input:focus, textarea:focus, select:focus {
    border-color: var(--accent-neon-blue) !important;
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.2) !important;
    outline: none !important;
}

/* Success/Error States */
.form-success-input {
    border-color: #00ff00 !important;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.2) !important;
}
.form-error-input {
    border-color: #ff0055 !important;
    box-shadow: 0 0 10px rgba(255, 0, 85, 0.2) !important;
}
`;
        fs.writeFileSync(cssFile, css);
    }
}

// 2. JS FORM INTERCEPTION (main.js)
const jsFile = path.join(dir, 'js/main.js');
if (fs.existsSync(jsFile)) {
    let js = fs.readFileSync(jsFile, 'utf8');
    if (!js.includes('document.addEventListener("submit"')) {
        js += `
// Global Form Submission Intercept
document.addEventListener("submit", (e) => {
    const form = e.target;
    if (form.tagName.toLowerCase() === 'form') {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary') || form.querySelector('button');
        if (btn) btn.classList.add('btn-loading');
        
        // Simulate network request
        setTimeout(() => {
            if (btn) btn.classList.remove('btn-loading');
            if (typeof showToast === 'function') {
                showToast('Success! Form submitted.');
            }
            form.reset();
        }, 1500);
    }
});
`;
        fs.writeFileSync(jsFile, js);
    }
}

// 3. PERFORMANCE OPTIMIZATIONS (animations.js)
const animFile = path.join(dir, 'js/animations.js');
if (fs.existsSync(animFile)) {
    let js = fs.readFileSync(animFile, 'utf8');
    
    // Tilt Cards: Only on Desktop
    if (!js.includes('if (window.matchMedia("(min-width: 768px)").matches) { card.addEventListener("mousemove"')) {
        js = js.replace(/card\.addEventListener\('mousemove'/g, 'if (window.matchMedia("(min-width: 768px)").matches) { card.addEventListener(\'mousemove\'');
        js = js.replace(/card\.addEventListener\('mouseenter', \(\) => {[\s\S]*?}\);/g, 'card.addEventListener(\'mouseenter\', () => {\n            card.style.transition = \'none\';\n        }); }');
    }
    
    // GSAP Reveals: Only on Desktop, fallback to opaque on mobile
    if (!js.includes('if(window.matchMedia("(min-width: 768px)").matches) { gsap.from(el')) {
        js = js.replace(/gsap\.from\(el, {/g, 'if(window.matchMedia("(min-width: 768px)").matches) { gsap.from(el, {');
        js = js.replace(/y: 60, opacity: 0, filter: 'blur\(15px\)', duration: 1, ease: 'power3\.out'\s*}\);/g, 'y: 60, opacity: 0, filter: \'blur(15px)\', duration: 1, ease: \'power3.out\'\n                }); } else { el.style.opacity = 1; el.style.filter = "none"; el.style.transform = "none"; }');
    }

    fs.writeFileSync(animFile, js);
}

// 4. IMAGE LAZY LOADING (All HTML files)
const files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const fp = path.join(dir, file);
        let content = fs.readFileSync(fp, 'utf8');
        
        // Match <img tags without loading="lazy" and add it. 
        // Not perfect regex but robust enough for standard HTML
        content = content.replace(/<img(?![^>]*loading=)[^>]*>/g, (match) => {
            return match.replace('<img', '<img loading="lazy"');
        });
        
        fs.writeFileSync(fp, content);
    }
});

console.log("Interactive states and performance optimizations applied successfully.");
