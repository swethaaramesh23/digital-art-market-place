const fs = require('fs');
let txt = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/marketplace.html','utf8');
txt = txt.replace(/class="gsap-reveal"/g, '');
// Restore the market layout grid to what it should be
txt = txt.replace(/id="marketplace-nfts" style="display: grid; grid-template-columns: repeat\(2, 1fr\); gap: 20px;"/g, 'id="marketplace-nfts" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px;"');
fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/marketplace.html', txt);
console.log('Removed gsap-reveal from marketplace.html');
