const fs = require('fs');
let css = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/css/layout.css', 'utf8');

// Replace the destructive global classes I added
const badCSS = `/* Ensure equal height cards */
.glass-card { display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; height: 100%; }
.nft-info { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
.hero-section { padding-top: 60px !important; } /* Reduce top space */
section { padding: 40px 0 !important; } /* tighter sections */`;

const goodCSS = `/* Ensure equal height cards ONLY for grids */
.grid .glass-card, .artist-card, .nft-card, .collection-card { 
    display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; height: 100%; 
}
.nft-info, .artist-info { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
.hero-section { padding-top: 60px; }
`;

if (css.includes(badCSS)) {
    css = css.replace(badCSS, goodCSS);
    fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/css/layout.css', css);
    console.log("Fixed CSS globals.");
} else {
    console.log("Could not find the bad CSS string to replace. I might need a regex.");
}
