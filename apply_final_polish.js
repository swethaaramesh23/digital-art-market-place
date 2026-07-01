const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// 1. Mobile Menu UX (main.js)
const mainJsFile = path.join(dir, 'js/main.js');
if (fs.existsSync(mainJsFile)) {
    let js = fs.readFileSync(mainJsFile, 'utf8');
    if (!js.includes('Mobile Menu Close Logic')) {
        js += `
// Mobile Menu Close Logic
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-links');
    const btn = document.querySelector('.mobile-menu-btn') || document.querySelector('.menu-toggle');
    if (nav && nav.classList.contains('active')) {
        if (!nav.contains(e.target) && btn && !btn.contains(e.target)) {
            nav.classList.remove('active');
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const navLinksAnchors = document.querySelectorAll('.nav-links a');
    navLinksAnchors.forEach(a => {
        a.addEventListener('click', () => {
            const nav = document.querySelector('.nav-links');
            if(nav) nav.classList.remove('active');
        });
    });
});
`;
        fs.writeFileSync(mainJsFile, js);
    }
}

// 2. Swipeable Testimonials (layout.css)
const cssFile = path.join(dir, 'css/layout.css');
if (fs.existsSync(cssFile)) {
    let css = fs.readFileSync(cssFile, 'utf8');
    if (!css.includes('Swipeable Testimonials')) {
        css += `
/* Swipeable Testimonials Mobile */
@media (max-width: 768px) {
    .testimonials-grid, [style*="grid-template-columns: repeat(3, 1fr)"] {
        display: flex !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        padding-bottom: 20px !important;
    }
    .testimonials-grid > div, [style*="grid-template-columns: repeat(3, 1fr)"] > div {
        flex: 0 0 85% !important;
        scroll-snap-align: center !important;
        min-width: 85% !important;
    }
    /* Hide scrollbar for cleaner look */
    .testimonials-grid::-webkit-scrollbar, [style*="grid-template-columns: repeat(3, 1fr)"]::-webkit-scrollbar {
        display: none;
    }
}
`;
        fs.writeFileSync(cssFile, css);
    }
}

// 3. Add 'testimonials-grid' class to index.html grid if missing
const indexHtml = path.join(dir, 'index.html');
if (fs.existsSync(indexHtml)) {
    let index = fs.readFileSync(indexHtml, 'utf8');
    index = index.replace(/<div style="display: grid; grid-template-columns: repeat\(3, 1fr\); gap: 30px;" class="gsap-reveal">/g, '<div class="testimonials-grid gsap-reveal" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">');
    fs.writeFileSync(indexHtml, index);
}

// 4. Blog Load More (blog.html)
const blogFile = path.join(dir, 'blog.html');
if (fs.existsSync(blogFile)) {
    let blog = fs.readFileSync(blogFile, 'utf8');
    if (!blog.includes('Load More Logic')) {
        // Just inject the logic into the existing script
        blog = blog.replace('</script>', `
            // Load More Logic
            const loadBtns = document.querySelectorAll('.btn');
            loadBtns.forEach(btn => {
                if (btn.innerText.trim().toLowerCase().includes('load more')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        btn.classList.add('btn-loading');
                        setTimeout(() => {
                            btn.classList.remove('btn-loading');
                            btn.style.display = 'none';
                            if (typeof showToast === 'function') showToast('All articles loaded.');
                        }, 1000);
                    });
                }
            });
        </script>`);
        fs.writeFileSync(blogFile, blog);
    }
}

// 5. ARIA Labels Injection (All HTML Files)
const files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const fp = path.join(dir, file);
        let content = fs.readFileSync(fp, 'utf8');
        
        let changed = false;
        if (content.includes('class="mobile-menu-btn"') && !content.includes('aria-label="Toggle Menu"')) {
            content = content.replace(/class="mobile-menu-btn"/g, 'class="mobile-menu-btn" aria-label="Toggle Menu"');
            changed = true;
        }
        if (content.includes('class="menu-toggle"') && !content.includes('aria-label="Toggle Menu"')) {
            content = content.replace(/class="menu-toggle"/g, 'class="menu-toggle" aria-label="Toggle Menu"');
            changed = true;
        }
        if (content.includes('id="theme-toggle"') && !content.includes('aria-label="Toggle Theme"')) {
            content = content.replace(/id="theme-toggle"/g, 'id="theme-toggle" aria-label="Toggle Theme"');
            changed = true;
        }
        if (content.includes('class="btn btn-icon"') && !content.includes('aria-label')) {
            // General icon buttons
            content = content.replace(/class="btn btn-icon btn-glass"/g, 'class="btn btn-icon btn-glass" aria-label="Action Button"');
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(fp, content);
        }
    }
});

console.log("Final polish logic injected successfully.");
