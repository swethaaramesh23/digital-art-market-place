const fs = require('fs');
let txt = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/marketplace.html','utf8');
txt = txt.replace("document.getElementById('closeModal').addEventListener('click', () => {", "document.addEventListener('DOMContentLoaded', () => { document.getElementById('closeModal').addEventListener('click', () => {");
txt = txt.replace("}, 300);\n        });", "}, 300);\n        }); });");
fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/marketplace.html', txt);
console.log('Fixed JS error');
