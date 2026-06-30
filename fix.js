const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;
    
    // Fix hamburger
    if (content.includes('class="nav-actions"') && !content.includes('class="menu-toggle"')) {
        content = content.replace(/<a href="signup\.html" class="btn btn-primary magnetic">Sign Up<\/a>\s*<\/div>/,
        '<a href="signup.html" class="btn btn-primary magnetic">Sign Up</a>\n                <button class="menu-toggle"><i class="fa-solid fa-bars"></i></button>\n            </div>');
        console.log('Fixed hamburger in ' + file);
        changed = true;
    }
    
    // Fix double quotes in style url
    if (content.includes('url("image-digi/')) {
        content = content.replace(/url\("image-digi\/([^"]+)"\)/g, "url('image-digi/$1')");
        console.log('Fixed url quotes in ' + file);
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content);
    }
});
