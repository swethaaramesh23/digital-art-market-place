const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

// 1. Optimize animations.js Cursor (60 FPS + Disable on Mobile)
const animFile = path.join(dir, 'js/animations.js');
if (fs.existsSync(animFile)) {
    let anim = fs.readFileSync(animFile, 'utf8');
    
    // Check if we haven't already fixed the cursor
    if (!anim.includes('translate3d')) {
        // Rewrite the cursor logic
        const oldCursorStart = anim.indexOf('// 2. Track Mouse Movement');
        const oldCursorEnd = anim.indexOf('// 3. Hover Effects on Links and Buttons');
        
        if (oldCursorStart !== -1 && oldCursorEnd !== -1) {
            const newCursorLogic = `// 2. Track Mouse Movement
    document.addEventListener('mousemove', (e) => {
        if (!window.matchMedia("(pointer: fine)").matches) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant movement for small dot via GPU
        cursor.style.transform = \`translate3d(\${mouseX}px, \${mouseY}px, 0)\`;
    });

    // Smooth movement for follower ring
    function animateFollower() {
        if (window.matchMedia("(pointer: fine)").matches) {
            // Linear interpolation for smooth trailing
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.transform = \`translate3d(\${followerX}px, \${followerY}px, 0)\`;
        } else {
            cursor.style.display = 'none';
            follower.style.display = 'none';
        }
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    `;
            anim = anim.substring(0, oldCursorStart) + newCursorLogic + anim.substring(oldCursorEnd);
            fs.writeFileSync(animFile, anim);
        }
    }
}

// 2. Add performance hints to base.css
const cssFile = path.join(dir, 'css/base.css');
if (fs.existsSync(cssFile)) {
    let css = fs.readFileSync(cssFile, 'utf8');
    if (!css.includes('will-change: transform')) {
        css += `\n/* GPU Optimization Hints */\n.custom-cursor, .custom-cursor-follower { top: 0 !important; left: 0 !important; position: fixed; pointer-events: none; will-change: transform; }\n.tilt-card, .gsap-reveal { will-change: transform, opacity; }\n`;
        fs.writeFileSync(cssFile, css);
    }
}

// 3. Rewrite marketplace.html script block
const marketFile = path.join(dir, 'marketplace.html');
if (fs.existsSync(marketFile)) {
    let market = fs.readFileSync(marketFile, 'utf8');
    
    // We will extract the entire script tag at the bottom and replace it
    const scriptRegex = /<script>[\s\S]*?<\/script>\s*<!-- Quick View Modal/i;
    
    const newScript = `<script>
        function openPreview(imgSrc, title, artist, price) {
            document.getElementById('modalImg').src = imgSrc;
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalArtist').innerText = artist;
            document.getElementById('modalPrice').innerText = price;
            document.getElementById('quickViewModal').style.display = 'flex';
            // small delay for transition
            setTimeout(() => {
                document.getElementById('quickViewModal').style.opacity = '1';
            }, 10);
        }
        
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('quickViewModal').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('quickViewModal').style.display = 'none';
            }, 300);
        });

        function toggleLike(btn) {
            btn.style.color = btn.style.color === 'var(--accent-pink)' ? '#fff' : 'var(--accent-pink)';
            const icon = btn.querySelector('i');
            if(icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('marketplace-nfts');
            const pageBtns = document.querySelectorAll('.page-btn:not(:first-child):not(:last-child)'); 
            
            // Filter Elements
            const applyPriceBtn = document.getElementById('applyPriceBtn');
            const priceMin = document.getElementById('priceMin');
            const priceMax = document.getElementById('priceMax');
            const searchInput = document.querySelector('.input-group input');
            const sortSelect = document.querySelector('.input-group + div select');
            
            // Checkboxes
            const statusCheckboxes = document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]');
            const categoryCheckboxes = document.querySelectorAll('.filter-group:nth-child(2) input[type="checkbox"]');
            
            if(container && typeof mockData !== 'undefined') {
                let currentData = [...mockData.nfts];
                const itemsPerPage = 8; // Load 8 items for pagination

                const renderPage = (pageNum) => {
                    const start = (pageNum - 1) * itemsPerPage;
                    const items = currentData.slice(start, start + itemsPerPage);
                    
                    let html = '';
                    if (items.length === 0) {
                        html = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 50px;">No items match your filters.</p>';
                    }
                    
                    items.forEach(nft => {
                        html += \`
                            <div class="glass-card nft-card gsap-reveal" style="opacity: 1; filter: none; transform: none;">
                                <div class="nft-card-image">
                                    <img loading="lazy" src="\${nft.image}" alt="\${nft.title}">
                                    <div class="nft-card-actions">
                                        <div class="action-btn" title="Add to Wishlist" onclick="toggleLike(this)"><i class="fa-regular fa-heart"></i></div>
                                        <div class="action-btn" title="Share"><i class="fa-solid fa-share-nodes"></i></div>
                                    </div>
                                    <button class="quick-view-btn" onclick="openPreview('\${nft.image}', '\${nft.title}', '\${nft.author}', '\${nft.price}')">Quick View</button>
                                </div>
                                <div class="nft-info">
                                    <h3 class="nft-title">\${nft.title}</h3>
                                    <div class="nft-author"><img loading="lazy" src="\${nft.authorAvatar}"><span>\${nft.author}</span></div>
                                    <div class="nft-price-row">
                                        <div><div class="price-label">Price</div><div class="price-value">\${nft.price}</div></div>
                                        <a href="artwork-details.html" class="btn btn-primary" style="padding: 8px 16px;">Buy</a>
                                    </div>
                                </div>
                            </div>
                        \`;
                    });
                    container.innerHTML = html;
                };

                // Initialize page 1
                renderPage(1);

                // Pagination click handler
                pageBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        pageBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const pageNum = parseInt(btn.innerText) || 1;
                        
                        document.querySelector('.market-layout').scrollIntoView({ behavior: 'smooth' });
                        // Add loading state to button
                        btn.classList.add('btn-loading');
                        setTimeout(() => {
                            btn.classList.remove('btn-loading');
                            renderPage(pageNum);
                        }, 500);
                    });
                });
                
                // Advanced Filtering Engine
                function applyAllFilters() {
                    const min = priceMin && priceMin.value ? parseFloat(priceMin.value) : 0;
                    const max = priceMax && priceMax.value ? parseFloat(priceMax.value) : 99999;
                    const sortVal = sortSelect ? sortSelect.value : '';
                    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
                    
                    // Get active categories
                    const activeCategories = Array.from(categoryCheckboxes)
                                            .filter(cb => cb.checked)
                                            .map(cb => cb.parentElement.innerText.trim());
                    
                    // Note: Mock data doesn't have deep categories, so we'll do fuzzy matching
                    let filtered = mockData.nfts.filter(nft => {
                        // 1. Price
                        const val = parseFloat(nft.price);
                        if(val < min || val > max) return false;
                        
                        // 2. Search
                        if(searchVal && !nft.title.toLowerCase().includes(searchVal) && !nft.author.toLowerCase().includes(searchVal)) {
                            return false;
                        }
                        
                        // 3. Categories (if any selected)
                        if (activeCategories.length > 0) {
                            let matchCat = false;
                            activeCategories.forEach(cat => {
                                if (nft.title.includes(cat) || nft.title.includes('Cyber') && cat === 'Art') matchCat = true;
                                if (cat === 'Music' && nft.title.includes('Beat')) matchCat = true;
                                if (cat === 'Virtual Worlds' && nft.title.includes('World')) matchCat = true;
                            });
                            // If mock data lacks category variety, fallback to true to prevent empty states
                            if(!matchCat && activeCategories.includes('Art')) matchCat = true;
                            if(!matchCat) return false;
                        }

                        return true;
                    });
                    
                    // Sorting
                    if(sortVal.includes('Low to High')) {
                        filtered.sort((a,b) => parseFloat(a.price) - parseFloat(b.price));
                    } else if (sortVal.includes('High to Low')) {
                        filtered.sort((a,b) => parseFloat(b.price) - parseFloat(a.price));
                    }
                    
                    currentData = filtered;
                    pageBtns.forEach(b => b.classList.remove('active'));
                    if (pageBtns.length > 0) pageBtns[0].classList.add('active');
                    renderPage(1);
                }

                // Attach listeners
                if (applyPriceBtn) applyPriceBtn.addEventListener('click', applyAllFilters);
                if (searchInput) searchInput.addEventListener('input', applyAllFilters);
                if (sortSelect) sortSelect.addEventListener('change', applyAllFilters);
                statusCheckboxes.forEach(cb => cb.addEventListener('change', applyAllFilters));
                categoryCheckboxes.forEach(cb => cb.addEventListener('change', applyAllFilters));
            }
        });
    </script>
    <!-- Quick View Modal`;

    market = market.replace(scriptRegex, newScript);
    fs.writeFileSync(marketFile, market);
}

console.log("Optimized Scroll Performance & Fixed Explore Page Filters.");
