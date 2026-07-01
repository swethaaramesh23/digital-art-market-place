const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/SWETHA/Desktop/digi';

console.log("Deep Scanning for Safe Browsing Triggers...");

function scanFile(filePath) {
    const ext = path.extname(filePath);
    if (!['.html', '.js', '.css'].includes(ext)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    // 1. Phishing keywords often flagged by Google Safe Browsing in crypto apps
    const phishingKeywords = [
        'seed phrase', 'mnemonic', 'recovery phrase', 'private key',
        'walletconnect', 'ethereum.request', 'eth_sendTransaction',
        'import wallet', 'keystore'
    ];
    
    phishingKeywords.forEach(k => {
        if (content.toLowerCase().includes(k)) {
            console.log(`[Phishing Keyword] ${k} found in ${filename}`);
        }
    });

    // 2. Suspicious forms (collecting passwords/keys without backend or sending to shady domains)
    if (ext === '.html') {
        const formActionRegex = /<form[^>]*action=["']([^"']*)["'][^>]*>/gi;
        let match;
        while ((match = formActionRegex.exec(content)) !== null) {
            console.log(`[Form Action] ${match[1]} in ${filename}`);
        }
        
        // Check for password inputs
        if (content.includes('type="password"')) {
            console.log(`[Password Input] Found in ${filename}`);
        }
    }
    
    // 3. Obfuscated JS (Hex, long strings, eval)
    if (ext === '.js') {
        if (/eval\s*\(/.test(content)) console.log(`[EVAL] found in ${filename}`);
        if (/0x[0-9a-fA-F]{4,}/.test(content)) console.log(`[HEX STRING] found in ${filename}`);
        const longStrings = content.match(/(["'`])(?:(?=(\\?))\2.)*?\1/g);
        if (longStrings) {
            longStrings.forEach(s => {
                if (s.length > 500 && !s.includes('<svg')) {
                    console.log(`[LONG STRING] ${s.length} chars in ${filename}`);
                }
            });
        }
    }

    // 4. Any remaining http:// links
    const httpLinks = content.match(/http:\/\/[^"'\s]+/g);
    if (httpLinks) {
        httpLinks.forEach(link => console.log(`[HTTP LINK] ${link} in ${filename}`));
    }
}

function scanDir(directory) {
    const files = fs.readdirSync(directory);
    files.forEach(f => {
        const fullPath = path.join(directory, f);
        if (fs.statSync(fullPath).isDirectory()) {
            if (f !== 'node_modules' && f !== '.git' && f !== 'image-digi') {
                scanDir(fullPath);
            }
        } else {
            scanFile(fullPath);
        }
    });
}

scanDir(dir);
console.log("Scan Complete.");
