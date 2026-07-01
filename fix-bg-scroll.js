const fs = require('fs');
let txt = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/js/main.js','utf8');
txt = txt.replace(/nav\.classList\.remove\('active'\);/g, "nav.classList.remove('active'); document.body.classList.remove('no-scroll');");
fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/js/main.js', txt);
console.log('Fixed background scroll lock issue');
