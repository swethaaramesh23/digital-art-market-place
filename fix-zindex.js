const fs = require('fs');

let css = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/css/layout.css', 'utf8');

// Update header z-index to be higher than nav-links
css = css.replace(/z-index: 9999 !important;/g, "z-index: 10000 !important;");
css = css.replace(/z-index: 10000 !important; \/\* nav-links \*\//, "z-index: 9999 !important; /* nav-links */");

// Actually, let's just do a string replacement for the whole mobile block to be completely sure.
const mobileHeaderRegex = /@media \(max-width: 900px\) \{\s*header \{[\s\S]*?\}\n\}/;

const newMobileHeader = `@media (max-width: 900px) {
    header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        border-radius: 0 !important;
        padding: 0 !important;
        height: 72px;
        background: rgba(10, 10, 15, 0.95) !important;
        backdrop-filter: blur(16px) !important;
        border-bottom: 1px solid var(--border-glass) !important;
        border-left: none !important;
        border-right: none !important;
        border-top: none !important;
        z-index: 10000 !important; /* Header on top */
        display: flex;
        align-items: center;
        margin-bottom: 0 !important;
    }
    
    header .navbar {
        height: 100%;
        padding: 0 20px;
        align-items: center;
        width: 100%;
    }

    header .nav-actions {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .mobile-menu-btn, .menu-toggle {
        margin: 0 !important;
        padding: 10px !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
    }

    .nav-links { 
        position: fixed !important;
        top: 0 !important; 
        right: 0 !important; 
        left: auto !important;
        width: 100% !important; 
        height: 100vh !important;
        background: rgba(10, 10, 15, 0.98) !important; 
        backdrop-filter: blur(25px) !important;
        flex-direction: column !important; 
        justify-content: flex-start !important; /* Let items start from top */
        align-items: center !important;
        z-index: 9999 !important;  /* Under header */
        transform: translateX(100%) !important;
        transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1) !important;
        padding: 100px 0 40px 0 !important; /* Push down below header */
        display: flex !important;
        overflow-y: auto !important; /* Scroll if too many items */
    }
    .nav-links.active { transform: translateX(0) !important; }
    
    .nav-links a {
        font-size: 1.0rem !important;
        margin: 5px 0 !important;
        font-weight: 600 !important;
    }
    
    main, .main-content { padding-top: 100px !important; }
}`;

css = css.replace(/@media \(max-width: 900px\) \{\s*header \{[\s\S]*?padding-top: 100px !important; \}\s*\}/, newMobileHeader);

// In case the regex didn't hit, let's manually replace
if(!css.includes('z-index: 10000 !important; /* Header on top */')) {
    css = css.replace(/z-index: 9999 !important;/, 'z-index: 10000 !important; /* Header on top */');
    css = css.replace(/z-index: 10000 !important;/, 'z-index: 9999 !important; /* Under header */');
    css = css.replace(/justify-content: center !important;/, 'justify-content: flex-start !important;');
    css = css.replace(/padding: 0 !important;/, 'padding: 100px 0 40px 0 !important; overflow-y: auto !important;');
}

fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/css/layout.css', css);


// Update main.js to change the hamburger icon to an X when open
let js = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/js/main.js', 'utf8');

const oldToggle = `navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');`;
            
const newToggle = `navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }`;

if (js.includes(oldToggle) && !js.includes('fa-xmark')) {
    js = js.replace(oldToggle, newToggle);
}

const oldClose = `nav.classList.remove('active'); 
            document.body.classList.remove('no-scroll');`;

const newClose = `nav.classList.remove('active'); 
            document.body.classList.remove('no-scroll');
            const icon = btn ? btn.querySelector('i') : null;
            if(icon) { icon.classList.remove('fa-xmark'); icon.classList.add('fa-bars'); }`;

if (js.includes(oldClose) && !js.includes("icon.classList.remove('fa-xmark')")) {
    js = js.replace(oldClose, newClose);
}

fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/js/main.js', js);
console.log('Fixed visibility and icon');
