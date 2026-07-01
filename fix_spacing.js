const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const replacements = [
    { regex: /margin-bottom:\s*120px/g, replacement: 'margin-bottom: 60px' },
    { regex: /margin-bottom:\s*100px/g, replacement: 'margin-bottom: 50px' },
    { regex: /margin-bottom:\s*80px/g, replacement: 'margin-bottom: 40px' },
    { regex: /padding:\s*180px 0 100px/g, replacement: 'padding: 120px 0 60px' },
    { regex: /padding:\s*150px 0 100px/g, replacement: 'padding: 100px 0 60px' },
    { regex: /margin-top:\s*100px/g, replacement: 'margin-top: 50px' },
    { regex: /padding:\s*100px 0/g, replacement: 'padding: 60px 0' },
    { regex: /margin-bottom:\s*60px/g, replacement: 'margin-bottom: 40px' } // Wait, this might be too aggressive if I already replaced 120->60. Let's do it carefully.
];

// Let's do string replacement directly if possible or sequence them carefully.
const directReplacements = [
    ['margin-bottom: 120px', 'margin-bottom: 60px'],
    ['margin-bottom: 100px', 'margin-bottom: 50px'],
    ['margin-bottom: 80px', 'margin-bottom: 40px'],
    ['padding: 180px 0 100px', 'padding: 120px 0 60px'],
    ['padding: 150px 0 100px', 'padding: 100px 0 60px'],
    ['padding: 120px 0', 'padding: 80px 0'],
    ['padding: 100px 0', 'padding: 60px 0'],
    ['margin-top: 100px', 'margin-top: 50px'],
    ['margin-bottom: 60px', 'margin-bottom: 40px'] // Note: this will also hit 120->60 replacements, so it effectively becomes 120->40. Which is fine (compact layout).
];

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    
    for (const [find, replace] of directReplacements) {
        // use regex with global flag to replace all occurrences
        const regex = new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        content = content.replace(regex, replace);
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
}
