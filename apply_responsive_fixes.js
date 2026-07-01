const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// --- 1. General & Navigation CSS (layout.css) ---
let layoutCssPath = path.join(dir, 'css/layout.css');
if (fs.existsSync(layoutCssPath)) {
    let layoutCss = fs.readFileSync(layoutCssPath, 'utf8');
    
    // Remove old custom fixes if any to avoid duplicates
    if(layoutCss.includes('/* Custom Responsive Fixes */')) {
        layoutCss = layoutCss.substring(0, layoutCss.indexOf('/* Custom Responsive Fixes */'));
    }
    
    const responsiveCss = `
/* Custom Responsive Fixes */
/* Global Resets */
body, html { overflow-x: hidden; width: 100%; }
.container { overflow-x: hidden; max-width: 100%; padding: 0 15px; box-sizing: border-box; }
* { box-sizing: border-box; }

/* Image scaling */
img { max-width: 100%; height: auto; }

/* Cards equal height */
.glass-card { display: flex; flex-direction: column; height: 100%; }
.glass-card > * { max-width: 100%; }

/* Mobile Navigation */
@media (max-width: 900px) {
    .navbar { position: relative; flex-wrap: wrap; justify-content: space-between; }
    .nav-links { 
        display: none; 
        width: 100%; 
        flex-direction: column; 
        background: var(--bg-glass); 
        backdrop-filter: blur(20px);
        position: absolute; 
        top: 100%; 
        left: 0; 
        padding: 20px; 
        z-index: 1000; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .nav-links.active { display: flex !important; }
    .mobile-menu-btn { display: block !important; }
}

/* Grids */
.team-grid, .collection-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
@media (max-width: 1024px) {
    .team-grid, .collection-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
    .team-grid, .collection-grid { grid-template-columns: 1fr; }
    .contact-grid { grid-template-columns: 1fr !important; }
    .hero-stats-stack { flex-direction: column !important; }
}

/* Forms & Inputs */
input, textarea, select { max-width: 100%; box-sizing: border-box; }
.input-group { width: 100%; }
.input-group input { width: 100%; padding-left: 45px; }
.input-group i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); }

/* Collection Buy Button Overlap */
.nft-price-row { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 15px; }

/* Blog Categories */
.blog-categories { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 30px; }
`;
    fs.writeFileSync(layoutCssPath, layoutCss + responsiveCss);
}

// --- 2. Mobile Menu JS (main.js) ---
let mainJsPath = path.join(dir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
    let mainJs = fs.readFileSync(mainJsPath, 'utf8');
    if(!mainJs.includes('mobileMenuBtn.addEventListener')) {
        const menuJs = `
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
        });
    }
});
`;
        fs.writeFileSync(mainJsPath, mainJs + menuJs);
    }
}

// --- 3. Login & Signup Pages ---
['login.html', 'signup.html'].forEach(file => {
    let fp = path.join(dir, file);
    if (fs.existsSync(fp)) {
        let content = fs.readFileSync(fp, 'utf8');
        // Fix placeholders, alignments
        if (!content.includes('form-responsive-fixes')) {
            const formCSS = `
    <style id="form-responsive-fixes">
        .form-group input { width: 100%; padding: 15px 40px; box-sizing: border-box; }
        .form-group i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); z-index: 2; }
        .password-toggle { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; z-index: 2; }
        .radio-group, .checkbox-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .radio-group label, .checkbox-group label { display: flex; align-items: center; gap: 5px; }
        .btn-full { width: 100%; }
        @media (max-width: 480px) {
            .glass-card { padding: 20px !important; }
        }
    </style>
</head>`;
            content = content.replace('</head>', formCSS);
            fs.writeFileSync(fp, content);
        }
    }
});

// --- 4. Contact Page ---
let contactHtml = path.join(dir, 'contact.html');
if (fs.existsSync(contactHtml)) {
    let content = fs.readFileSync(contactHtml, 'utf8');
    // Add contact-grid class
    content = content.replace(/<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;" class="gsap-reveal">/g, '<div class="contact-grid gsap-reveal" style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">');
    // Ensure inputs are full width
    content = content.replace(/<input type="text" style="/g, '<input type="text" style="width: 100%; ');
    content = content.replace(/<input type="email" style="/g, '<input type="email" style="width: 100%; ');
    content = content.replace(/<textarea style="/g, '<textarea style="width: 100%; ');
    fs.writeFileSync(contactHtml, content);
}

// --- 5. Blog Page ---
let blogHtml = path.join(dir, 'blog.html');
if (fs.existsSync(blogHtml)) {
    let content = fs.readFileSync(blogHtml, 'utf8');
    // Wrap category buttons
    content = content.replace(/<div style="display: flex; gap: 15px; margin-bottom: 40px; overflow-x: auto; padding-bottom: 10px;" class="gsap-reveal">/, '<div class="blog-categories gsap-reveal">');
    fs.writeFileSync(blogHtml, content);
}

// --- 6. About Page ---
let aboutHtml = path.join(dir, 'about.html');
if (fs.existsSync(aboutHtml)) {
    let content = fs.readFileSync(aboutHtml, 'utf8');
    // Add team-grid class
    content = content.replace(/<div style="display: grid; grid-template-columns: repeat\(4, 1fr\); gap: 30px;">/, '<div class="team-grid">');
    content = content.replace(/<div style="display: grid; grid-template-columns: repeat\(auto-fill, minmax\(min\(100%, \), 1fr\)\); gap: 30px;">/, '<div class="team-grid">');
    fs.writeFileSync(aboutHtml, content);
}

// --- 7. Collection Page ---
let collHtml = path.join(dir, 'collections.html');
if (fs.existsSync(collHtml)) {
    let content = fs.readFileSync(collHtml, 'utf8');
    // Add collection-grid class
    content = content.replace(/<div id="collection-items" style="display: grid; grid-template-columns: repeat\(4, 1fr\); gap: 20px; margin-bottom: 50px;">/, '<div id="collection-items" class="collection-grid" style="margin-bottom: 50px;">');
    
    // Make top filters wrap
    content = content.replace(/<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;" class="gsap-reveal">/, '<div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; align-items: center; margin-bottom: 20px;" class="gsap-reveal">');
    fs.writeFileSync(collHtml, content);
}

console.log("Responsive fixes applied successfully.");
