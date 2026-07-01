const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js/mock-data.js');
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = {
    'artist_cyber.webp': 'person_alex.webp',
    'artist_holo.webp': 'person_sarah.webp',
    'artist_pixel.webp': 'person_marcus.webp',
    'artist_neon.webp': 'person_elena.webp',
    'artist_queen.webp': 'professional_ceo.webp',
    'artist_master.webp': 'professional_cto.webp',
    'artist_meta.webp': 'professional_designer.webp',
    'artist_virtual.webp': 'professional_vp.webp',
    'real_avatar_9.webp': 'person_alex.webp',
    'real_avatar_10.webp': 'person_elena.webp',
    'real_avatar_11.webp': 'person_marcus.webp',
    'real_avatar_12.webp': 'person_sarah.webp',
    'real_avatar_13.webp': 'professional_ceo.webp',
    'real_avatar_14.webp': 'professional_cto.webp',
    'real_avatar_15.webp': 'professional_designer.webp'
};

for (const [oldImg, newImg] of Object.entries(replacements)) {
    // Escape dots and create global regex
    const regex = new RegExp(oldImg.replace(/\./g, '\\.'), 'g');
    content = content.replace(regex, newImg);
}

fs.writeFileSync(filePath, content);
console.log('Updated mock-data.js avatars.');
