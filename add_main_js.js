const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('src="js/main.js"')) {
        content = content.replace(/<\/body>/, '<script src="js/main.js"></script>\n</body>');
        fs.writeFileSync(file, content);
        console.log('Added main.js to ' + file);
    }
});
