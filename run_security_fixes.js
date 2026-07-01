const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = 'c:/Users/SWETHA/Desktop/digi';
const imgDir = path.join(dir, 'image-digi');

// Helper to download files
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function runSecurityFixes() {
    console.log("Starting Security Remediation...");

    // 1. Download third party images to localize them
    try {
        await downloadFile('https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg', path.join(imgDir, 'google-logo.svg'));
        await downloadFile('https://cryptologos.cc/logos/solana-sol-logo.svg?v=025', path.join(imgDir, 'solana-logo.svg'));
        await downloadFile('https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025', path.join(imgDir, 'polygon-logo.svg'));
        console.log("Downloaded third-party images successfully.");
    } catch (e) {
        console.log("Failed to download images: ", e);
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

    files.forEach(file => {
        const filePath = path.join(dir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Replace contact iframe
        if (file === 'contact.html') {
            const iframeRegex = /<iframe[\s\S]*?<\/iframe>/i;
            if (iframeRegex.test(html)) {
                html = html.replace(iframeRegex, `<div class="glass-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 450px; text-align: center; border: 1px solid var(--border-glass);">
                    <i class="fa-solid fa-map-location-dot" style="font-size: 4rem; color: var(--accent-neon-blue); margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 15px;">Our Headquarters</h3>
                    <p class="text-secondary" style="margin-bottom: 25px;">MMR Complex, Chinna Thirupathi, Salem - 636 003</p>
                    <a href="https://www.google.com/maps?q=MMR+complex,+chinna+thirupathi,+salem-636+003" target="_blank" rel="noopener noreferrer" class="btn btn-primary magnetic">
                        Open Securely in Google Maps <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>`);
                modified = true;
            }
        }

        // Replace Google Logo links
        if (html.includes('https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg')) {
            html = html.replace(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/5\/53\/Google_%22G%22_Logo\.svg/g, 'image-digi/google-logo.svg');
            modified = true;
        }

        // Replace CryptoLogos links
        if (html.includes('https://cryptologos.cc/logos/solana-sol-logo.svg?v=025')) {
            html = html.replace(/https:\/\/cryptologos\.cc\/logos\/solana-sol-logo\.svg\?v=025/g, 'image-digi/solana-logo.svg');
            modified = true;
        }
        if (html.includes('https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025')) {
            html = html.replace(/https:\/\/cryptologos\.cc\/logos\/polygon-matic-logo\.svg\?v=025/g, 'image-digi/polygon-logo.svg');
            modified = true;
        }

        // Add SRI hashes to CDNs
        const faLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
        const faSecure = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer">';
        if (html.includes(faLink)) {
            html = html.replace(faLink, faSecure);
            modified = true;
        }

        const gsapScript = '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>';
        const gsapSecure = '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" integrity="sha512-16esztaSRplJROstbIIdwX3N97V1+pZvV33ABoG1H2OyTttBxEQSQBxgGviWaiEa424G4+A3rA82Rk3F2L7y/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>';
        if (html.includes(gsapScript)) {
            html = html.replace(gsapScript, gsapSecure);
            modified = true;
        }

        const scrollTriggerScript = '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>';
        const scrollTriggerSecure = '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" integrity="sha512-lcxaC5m/zX6yEaR8z6sXNlEty3f31jY01O94w8k93WzL345X2uGg5E1+w4hLkt4IypU/t9L/B1gX6M0+D/fS7Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>';
        if (html.includes(scrollTriggerScript)) {
            html = html.replace(scrollTriggerScript, scrollTriggerSecure);
            modified = true;
        }

        // Add rel="noopener noreferrer" to external target="_blank" links
        const targetBlankRegex = /<a[^>]*target=["']_blank["'][^>]*>/gi;
        html = html.replace(targetBlankRegex, (match) => {
            if (!match.includes('rel=')) {
                return match.replace(/target=["']_blank["']/, 'target="_blank" rel="noopener noreferrer"');
            } else if (!match.includes('noopener')) {
                return match.replace(/rel=["']([^"']*)["']/, 'rel="$1 noopener noreferrer"');
            }
            return match;
        });

        // If changes were made, or regex replaced target="_blank", write file
        fs.writeFileSync(filePath, html);
    });

    console.log("Remediation complete!");
}

runSecurityFixes();
