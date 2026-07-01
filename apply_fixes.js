const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// 1. Mobile Menu & Header CSS Fixes
const cssFile = path.join(dir, 'css/layout.css');
if (fs.existsSync(cssFile)) {
    let css = fs.readFileSync(cssFile, 'utf8');
    if (!css.includes('Mobile Header Override')) {
        css += `
/* Mobile Header Override */
@media (max-width: 900px) {
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
        z-index: 9999 !important;
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
        z-index: 10001;
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
        justify-content: center !important;
        align-items: center !important;
        z-index: 10000 !important; 
        transform: translateX(100%) !important;
        transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1) !important;
        padding: 0 !important;
        display: flex !important;
    }
    .nav-links.active { transform: translateX(0) !important; }
    
    .nav-links a {
        font-size: 1.5rem !important;
        margin: 15px 0 !important;
        font-weight: 600 !important;
    }
    
    main, .main-content { padding-top: 100px !important; }
}

/* Trending Auto-Scroll Marquee */
.trending-marquee-wrapper {
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: 10px 0;
}
.trending-marquee-track {
    display: flex;
    gap: 30px;
    width: max-content;
    animation: marquee-scroll-trending 15s linear infinite;
}
.trending-marquee-track:hover {
    animation-play-state: paused;
}
.trending-marquee-track > div {
    width: 280px;
    flex-shrink: 0;
}
@keyframes marquee-scroll-trending {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 15px)); }
}
`;
        fs.writeFileSync(cssFile, css);
    }
}

// 2. Artists Page Fix (Trending Marquee)
const artistsFile = path.join(dir, 'artists.html');
if (fs.existsSync(artistsFile)) {
    let artists = fs.readFileSync(artistsFile, 'utf8');
    
    if (!artists.includes('trending-marquee-wrapper')) {
        // Extract the 4 boxes
        const regex = /<div class="artists-grid" style="grid-template-columns: repeat\(2, 1fr\);">([\s\S]*?)>Follow<\/button>\s*<\/div>\s*<\/div>/;
        const match = artists.match(regex);
        if (match) {
            const innerHTML = match[1] + ">Follow</button>\n                    </div>";
            // Duplicate the 4 boxes to allow seamless scrolling
            const newHTML = `<div class="trending-marquee-wrapper">
                    <div class="trending-marquee-track">
                        ${innerHTML}
                        ${innerHTML}
                    </div>
                </div>`;
            artists = artists.replace(regex, newHTML);
            fs.writeFileSync(artistsFile, artists);
        }
    }
}

console.log("Fixes applied successfully.");
