// mock-data.js
const mockData = {
            nfts: (function(){
        const base = [
            { id: 1, title: "Neon Genesis #01", author: "CyberArtist", authorAvatar: "image-digi/artist_cyber.webp", price: "2.4 ETH", image: "image-digi/real_art_1.webp", likes: 245 },
            { id: 2, title: "Crystal Void", author: "HoloDream", authorAvatar: "image-digi/artist_holo.webp", price: "1.8 ETH", image: "image-digi/real_art_2.webp", likes: 189 },
            { id: 3, title: "Digital Mirage", author: "PixelGod", authorAvatar: "image-digi/artist_pixel.webp", price: "5.0 ETH", image: "image-digi/real_art_3.webp", likes: 512 },
            { id: 4, title: "Cyber Ape #404", author: "ApeClub", authorAvatar: "image-digi/artist_neon.webp", price: "12.5 ETH", image: "image-digi/real_art_4.webp", likes: 1024 },
            { id: 5, title: "Midnight City", author: "NightOwl", authorAvatar: "image-digi/artist_queen.webp", price: "0.9 ETH", image: "image-digi/real_art_5.webp", likes: 88 },
            { id: 6, title: "Ethereal Dream", author: "Dreamer", authorAvatar: "image-digi/artist_master.webp", price: "3.2 ETH", image: "image-digi/real_art_6.webp", likes: 320 },
            { id: 7, title: "Cosmic Entity", author: "StarGazer", authorAvatar: "image-digi/artist_meta.webp", price: "4.1 ETH", image: "image-digi/real_art_7.webp", likes: 410 },
            { id: 8, title: "Abstract Flow", author: "FlowMaster", authorAvatar: "image-digi/artist_virtual.webp", price: "1.1 ETH", image: "image-digi/real_art_8.webp", likes: 150 },
            { id: 9, title: "Future Retro", author: "RetroKing", authorAvatar: "image-digi/real_avatar_9.webp", price: "2.2 ETH", image: "image-digi/real_art_9.webp", likes: 275 },
            { id: 10, title: "Virtual Reality", author: "VRGod", authorAvatar: "image-digi/real_avatar_10.webp", price: "6.5 ETH", image: "image-digi/real_art_10.webp", likes: 650 },
            { id: 11, title: "Pixel Perfect", author: "PixelGod", authorAvatar: "image-digi/real_avatar_11.webp", price: "0.5 ETH", image: "image-digi/real_art_11.webp", likes: 45 },
            { id: 12, title: "Neon Skyline", author: "CyberArtist", authorAvatar: "image-digi/real_avatar_12.webp", price: "3.8 ETH", image: "image-digi/real_art_12.webp", likes: 380 },
            { id: 13, title: "Cyber Samurai", author: "SamuraiX", authorAvatar: "image-digi/real_avatar_13.webp", price: "8.0 ETH", image: "image-digi/real_art_13.webp", likes: 800 },
            { id: 14, title: "Solar Flare", author: "SunGod", authorAvatar: "image-digi/real_avatar_14.webp", price: "1.5 ETH", image: "image-digi/real_art_14.webp", likes: 155 },
            { id: 15, title: "Digital Odyssey", author: "Odyssey", authorAvatar: "image-digi/real_avatar_15.webp", price: "9.9 ETH", image: "image-digi/real_art_15.webp", likes: 999 }
        ];
        
        let expanded = [];
        for(let i=0; i<36; i++) {
            let item = Object.assign({}, base[i % base.length]);
            item.id = i + 1;
            if(i >= 15) item.title = item.title + " (Vol " + Math.floor(i/15 + 1) + ")";
            expanded.push(item);
        }
        return expanded;
    })(),
            artists: (function(){
        const base = [
            { id: 1, name: "CyberArtist", followers: "12.4k", image: "image-digi/artist_cyber.webp", cover: "image-digi/real_art_1.webp" },
            { id: 2, name: "HoloDream", followers: "8.2k", image: "image-digi/artist_holo.webp", cover: "image-digi/real_art_2.webp" },
            { id: 3, name: "PixelGod", followers: "45.1k", image: "image-digi/artist_pixel.webp", cover: "image-digi/real_art_3.webp" },
            { id: 4, name: "NeonKing", followers: "102k", image: "image-digi/artist_neon.webp", cover: "image-digi/real_art_4.webp" },
            { id: 5, name: "CryptoQueen", followers: "88k", image: "image-digi/artist_queen.webp", cover: "image-digi/real_art_5.webp" },
            { id: 6, name: "DigitalMaster", followers: "32k", image: "image-digi/artist_master.webp", cover: "image-digi/real_art_6.webp" },
            { id: 7, name: "MetaCreator", followers: "14k", image: "image-digi/artist_meta.webp", cover: "image-digi/real_art_7.webp" },
            { id: 8, name: "VirtualStar", followers: "9.5k", image: "image-digi/artist_virtual.webp", cover: "image-digi/real_art_8.webp" }
        ];
        let expanded = [];
        for(let i=0; i<32; i++) {
            let item = Object.assign({}, base[i % base.length]);
            item.id = i + 1;
            if(i >= 8) item.name = item.name + " " + Math.floor(i/8 + 1);
            expanded.push(item);
        }
        return expanded;
    })()
};

// Utility function to render NFT Cards
function renderNFTCards(containerId, count = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    const items = mockData.nfts.slice(0, count);
    
    items.forEach(nft => {
        html += `
            <div class="glass-card nft-card gsap-reveal">
                <div class="nft-card-image">
                    <img src="${nft.image}" alt="${nft.title}" loading="lazy">
                    <div class="nft-like">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                </div>
                <div class="nft-info">
                    <h3 class="nft-title">${nft.title}</h3>
                    <div class="nft-author">
                        <img src="${nft.authorAvatar}" alt="${nft.author}" loading="lazy">
                        <span>@${nft.author}</span>
                    </div>
                    <div class="nft-price-row">
                        <div>
                            <div class="price-label">Current Bid</div>
                            <div class="price-value">${nft.price}</div>
                        </div>
                        <a href="artwork-details.html" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">Place Bid</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}











