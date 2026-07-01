const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// 1. Auth & Form Logic (main.js)
const mainJsFile = path.join(dir, 'js/main.js');
if (fs.existsSync(mainJsFile)) {
    let js = fs.readFileSync(mainJsFile, 'utf8');
    
    // Replace the generic submit interceptor we added earlier with auth logic
    const oldSubmitStart = js.indexOf('// Global Form Submission Intercept');
    if (oldSubmitStart !== -1) {
        js = js.substring(0, oldSubmitStart);
    }
    
    js += `
// Global Form Submission Intercept & Auth Logic
document.addEventListener("submit", (e) => {
    const form = e.target;
    if (form.tagName.toLowerCase() === 'form') {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary') || form.querySelector('button');
        if (btn) btn.classList.add('btn-loading');
        
        // Simulate network request
        setTimeout(() => {
            if (btn) btn.classList.remove('btn-loading');
            
            // Check if it's Login or Signup form
            const isAuth = form.closest('.glass-card') && (form.innerHTML.includes('Password') || form.innerHTML.includes('password'));
            
            if (isAuth) {
                // Get username/email
                let username = "NFT_Whale"; // fallback
                const nameInput = form.querySelector('input[type="text"]');
                const emailInput = form.querySelector('input[type="email"]');
                if (nameInput && nameInput.value) username = nameInput.value;
                else if (emailInput && emailInput.value) username = emailInput.value.split('@')[0];
                
                // Save to localStorage
                localStorage.setItem('stackly_auth', JSON.stringify({ username: username, role: "Collector" }));
                
                if (typeof showToast === 'function') showToast('Authentication successful! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'user-dashboard.html';
                }, 1000);
            } else {
                if (typeof showToast === 'function') showToast('Success! Form submitted.');
                form.reset();
            }
        }, 1500);
    }
});
`;
    fs.writeFileSync(mainJsFile, js);
}

// 2. Dashboard Logic (user-dashboard.html)
const dashboardFile = path.join(dir, 'user-dashboard.html');
if (fs.existsSync(dashboardFile)) {
    let dash = fs.readFileSync(dashboardFile, 'utf8');
    
    if (!dash.includes('dashboard-routing-logic')) {
        const script = `
    <script id="dashboard-routing-logic">
        document.addEventListener('DOMContentLoaded', () => {
            // Auth Hydration
            const authStr = localStorage.getItem('stackly_auth');
            if (authStr) {
                try {
                    const auth = JSON.parse(authStr);
                    const nameEl = document.getElementById('dashboardUsername');
                    if (nameEl && auth.username) {
                        nameEl.innerHTML = auth.username + ' <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; margin-left: 5px;"></i>';
                    }
                } catch(e) {}
            }
            
            // Sidebar Routing
            const links = document.querySelectorAll('.sidebar-nav a');
            const mainContent = document.querySelector('.dashboard-container');
            
            // Create dummy views for those that don't exist
            const requiredViews = ['view-overview', 'view-wallet', 'view-collection', 'view-favorites', 'view-history', 'view-settings'];
            requiredViews.forEach(vId => {
                if (!document.getElementById(vId)) {
                    const div = document.createElement('div');
                    div.id = vId;
                    div.className = 'dashboard-view';
                    div.style.display = 'none';
                    div.innerHTML = \`<h2 style="margin-bottom: 20px;">\${vId.replace('view-', '').toUpperCase()}</h2><div class="dashboard-panel"><p>This section is under construction.</p></div>\`;
                    mainContent.appendChild(div);
                }
            });

            const views = document.querySelectorAll('.dashboard-view');
            // Hide all except active
            views.forEach(v => {
                if (!v.classList.contains('active')) v.style.display = 'none';
            });

            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('data-target');
                    if (targetId) {
                        links.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                        
                        views.forEach(v => {
                            v.classList.remove('active');
                            v.style.display = 'none';
                        });
                        
                        const targetView = document.getElementById(targetId);
                        if (targetView) {
                            targetView.classList.add('active');
                            targetView.style.display = 'block';
                            targetView.style.animation = 'fadeIn 0.3s ease forwards';
                        }
                    }
                });
            });
        });
        
        function logoutUser(e) {
            e.preventDefault();
            localStorage.removeItem('stackly_auth');
            window.location.href = 'login.html';
        }
    </script>
</body>`;
        dash = dash.replace(/<\/body>/i, script);
        fs.writeFileSync(dashboardFile, dash);
    }
}

// 3. Artists Page Fixes (artists.html)
const artistsFile = path.join(dir, 'artists.html');
if (fs.existsSync(artistsFile)) {
    let artists = fs.readFileSync(artistsFile, 'utf8');
    
    // Replace non-human avatars with human avatars
    artists = artists.replace(/image-digi\/real_art_\d+\.webp/g, (match) => {
        // Just pick a random person image or cycle through them
        const num = Math.floor(Math.random() * 3) + 1;
        return `image-digi/person_\${num}.webp`; // Use existing person images, fallback to a known one
    });
    // Hardcode fallback to person_alex.webp if person_1 doesn't exist
    artists = artists.replace(/image-digi\/person_\d+\.webp/g, 'image-digi/person_alex.webp');

    // Add exactly 3 columns css and Follow Logic
    if (!artists.includes('artist-specific-fixes')) {
        const css = `
    <style id="artist-specific-fixes">
        .artists-grid { display: grid; grid-template-columns: repeat(3, 1fr) !important; gap: 30px; }
        @media (max-width: 1024px) { .artists-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) { .artists-grid { grid-template-columns: 1fr !important; } }
    </style>
</head>`;
        artists = artists.replace('</head>', css);
        
        // Find the grid container and add class
        artists = artists.replace(/<div style="display: grid; grid-template-columns: repeat\(auto-fill, minmax\(min\(100%, \), 1fr\)\); gap: 30px;"/g, '<div class="artists-grid"');
        artists = artists.replace(/<div style="display: grid; grid-template-columns: repeat\(4, 1fr\); gap: 30px;"/g, '<div class="artists-grid"');
        
        // Follow logic
        const script = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const followBtns = document.querySelectorAll('.btn-follow');
            // If they don't have .btn-follow, select by text
            const allBtns = document.querySelectorAll('.btn');
            allBtns.forEach(btn => {
                if (btn.innerText.trim() === 'Follow') {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (this.innerText.includes('Following')) {
                            this.innerText = 'Follow';
                            this.classList.remove('btn-primary');
                            this.classList.add('btn-glass');
                        } else {
                            this.innerText = 'Following';
                            this.classList.remove('btn-glass');
                            this.classList.add('btn-primary');
                        }
                    });
                }
            });
        });
    </script>
</body>`;
        artists = artists.replace(/<\/body>/i, script);
        fs.writeFileSync(artistsFile, artists);
    }
}

// 4. Blog Page Filtering (blog.html)
const blogFile = path.join(dir, 'blog.html');
if (fs.existsSync(blogFile)) {
    let blog = fs.readFileSync(blogFile, 'utf8');
    
    if (!blog.includes('blog-filtering-logic')) {
        const script = `
    <script id="blog-filtering-logic">
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.querySelector('input[placeholder="Search articles..."]');
            const categoryBtns = document.querySelectorAll('.blog-categories button');
            const articles = document.querySelectorAll('article');
            
            function filterArticles() {
                const q = searchInput ? searchInput.value.toLowerCase() : '';
                let activeCat = 'All Posts';
                categoryBtns.forEach(btn => {
                    if (btn.classList.contains('btn-primary')) {
                        activeCat = btn.innerText.trim();
                    }
                });
                
                articles.forEach(article => {
                    const text = article.innerText.toLowerCase();
                    const badge = article.querySelector('.badge');
                    const articleCat = badge ? badge.innerText.trim() : '';
                    
                    let matchSearch = q === '' || text.includes(q);
                    let matchCat = activeCat === 'All Posts' || articleCat === activeCat;
                    
                    if (matchSearch && matchCat) {
                        article.style.display = 'flex';
                    } else {
                        article.style.display = 'none';
                    }
                });
            }
            
            if (searchInput) searchInput.addEventListener('input', filterArticles);
            
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    categoryBtns.forEach(b => {
                        b.classList.remove('btn-primary');
                        b.classList.add('btn-glass');
                    });
                    btn.classList.remove('btn-glass');
                    btn.classList.add('btn-primary');
                    filterArticles();
                });
            });
        });
    </script>
</body>`;
        blog = blog.replace(/<\/body>/i, script);
        fs.writeFileSync(blogFile, blog);
    }
}

console.log("Logic injected successfully.");
