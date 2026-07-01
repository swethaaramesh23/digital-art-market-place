const fs = require('fs');
let css = fs.readFileSync('c:/Users/SWETHA/Desktop/digi/css/layout.css','utf8');
css = css.replace(/\.no-scroll\s*\{[\s\S]*?\}/, `.no-scroll {
    overflow: hidden !important;
    height: 100vh !important;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    touch-action: none;
}`);
fs.writeFileSync('c:/Users/SWETHA/Desktop/digi/css/layout.css', css);
console.log('Fixed no-scroll');
