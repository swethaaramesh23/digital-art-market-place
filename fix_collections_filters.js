const fs = require('fs');

let coll = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/collections.html', 'utf8');

if (!coll.includes('id="collectionSearch"')) {
    coll = coll.replace('<input type="text" placeholder="Search items in collection..."', '<input id="collectionSearch" type="text" placeholder="Search items in collection..."');
    coll = coll.replace('<select style="padding: 10px 20px', '<select id="collectionSort" style="padding: 10px 20px');
    
    const scriptToReplace = `renderNFTCards('collection-items', 8);`;
    const replacementScript = `
                // Custom render logic with filtering for collections
                const container = document.getElementById('collection-items');
                const search = document.getElementById('collectionSearch');
                const sort = document.getElementById('collectionSort');
                
                let collData = [];
                if(typeof mockData !== 'undefined' && mockData.nfts) {
                    collData = mockData.nfts.slice(0, 8); // Base 8 items for this collection
                }
                
                function renderCollItems() {
                    let filtered = [...collData];
                    const q = search ? search.value.toLowerCase() : '';
                    if(q) {
                        filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q));
                    }
                    const s = sort ? sort.value : '';
                    if(s.includes('Low to High')) {
                        filtered.sort((a,b) => parseFloat(a.price) - parseFloat(b.price));
                    } else if(s.includes('High to Low')) {
                        filtered.sort((a,b) => parseFloat(b.price) - parseFloat(a.price));
                    }
                    
                    let html = '';
                    filtered.forEach(nft => {
                        html += \`
                            <div class="glass-card nft-card gsap-reveal visible" style="opacity: 1; height: 100%; display: flex; flex-direction: column;">
                                <div class="nft-card-image" style="width: 100%; aspect-ratio: 1; border-radius: var(--radius-lg); overflow: hidden; position: relative;">
                                    <img src="\${nft.image}" alt="\${nft.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <div class="nft-info" style="padding: 16px;">
                                    <h3 class="nft-title" style="margin-bottom: 5px;">\${nft.title}</h3>
                                    <div class="nft-price-row" style="margin-top:10px; display: flex; justify-content: space-between; align-items: center;">
                                        <div><div class="price-label" style="font-size: 0.8rem; color: var(--text-secondary);">Price</div><div class="price-value" style="color: var(--accent-neon-blue); font-weight: bold;">\${nft.price}</div></div>
                                        <a href="artwork-details.html" class="btn btn-primary" style="padding: 5px 15px;">Buy</a>
                                    </div>
                                </div>
                            </div>
                        \`;
                    });
                    if(filtered.length === 0) html = '<p style="grid-column: 1/-1; text-align: center;">No items found.</p>';
                    if(container) container.innerHTML = html;
                }
                
                renderCollItems();
                
                if(search) search.addEventListener('input', renderCollItems);
                if(sort) sort.addEventListener('change', renderCollItems);
`;
    coll = coll.replace(scriptToReplace, replacementScript);
    fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/collections.html', coll);
}

console.log("Done");
