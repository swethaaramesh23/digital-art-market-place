const fs = require('fs');
['user-dashboard.html', 'artist-dashboard.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes('style="display: none; margin-right: 15px;"')) {
        content = content.replace(/style="display: none; margin-right: 15px;"/g, 'style="margin-right: 15px;" class="mobile-menu-btn-hidden"');
        content = content.replace(/<\/style>/, '  .mobile-menu-btn-hidden { display: none; }\n        @media (max-width: 768px) { .mobile-menu-btn-hidden { display: block !important; } }\n    </style>');
        fs.writeFileSync(file, content);
        console.log('Fixed dashboard mobile menu in ' + file);
    }
});
