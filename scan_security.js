const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

function scanDir(directory) {
    const files = fs.readdirSync(directory);
    files.forEach(f => {
        const fullPath = path.join(directory, f);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (f !== 'node_modules' && f !== '.git' && f !== 'image-digi') {
                scanDir(fullPath);
            }
        } else if (f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const patterns = [
                { name: 'eval', regex: /eval\(/g },
                { name: 'atob', regex: /atob\(/g },
                { name: 'btoa', regex: /btoa\(/g },
                { name: 'setTimeoutDocument', regex: /setTimeout\(.*document/g },
                { name: 'windowLocation', regex: /window\.location/g },
                { name: 'iframe', regex: /<iframe/g },
                { name: 'http', regex: /http:\/\//g },
                { name: 'suspiciousSrc', regex: /src=[\"'](?![\/\.]|https:\/\/cdnjs|https:\/\/cdn|https:\/\/kit\.fontawesome|https:\/\/fonts)[^\"']+[\"']/gi }
            ];
            
            patterns.forEach(p => {
                const matches = content.match(p.regex);
                if (matches) {
                    console.log(`[${p.name}] found in ${f}`);
                    matches.forEach(m => console.log(`  -> ${m.substring(0, 80)}`));
                }
            });
        }
    });
}

console.log("Starting Security Scan...");
scanDir(dir);
console.log("Scan Complete.");
