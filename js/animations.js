// animations.js
// Assumes GSAP is loaded via CDN in HTML
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Ripple Effect for Buttons ---
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // --- 2. Tilt Card (Vanilla JS 3D Effect) ---
    const tiltCards = document.querySelectorAll('.glass-card, .nft-card');
    tiltCards.forEach(card => {
        card.classList.add('tilt-card');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease-out';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // --- 3. GSAP Animations ---
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Hero Stagger
        const heroElements = document.querySelectorAll('.hero-animate');
        if (heroElements.length > 0) {
            gsap.from(heroElements, {
                y: 50, opacity: 0, filter: 'blur(10px)', duration: 1.2,
                stagger: 0.15, ease: 'power3.out', delay: 0.2
            });
        }

        // Floating Animations
        gsap.to('.floating-animate', {
            y: "-=20", duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut"
        });

        // Blur & Slide Reveal on Scroll
        if (typeof ScrollTrigger !== 'undefined') {
            const reveals = document.querySelectorAll('.gsap-reveal');
            reveals.forEach(el => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el, start: "top 85%", toggleActions: "play none none reverse"
                    },
                    y: 60, opacity: 0, filter: 'blur(15px)', duration: 1, ease: 'power3.out'
                });
            });

            // Animated Counters
            const counterElements = document.querySelectorAll('.gsap-reveal h3');
            counterElements.forEach(counter => {
                const text = counter.innerText;
                if (text.match(/[0-9]/) && (text.includes('M') || text.includes('K'))) {
                    let numString = text.replace(/[^0-9]/g, '');
                    let suffix = text.replace(/[0-9$,.]/g, ''); 
                    let prefix = text.includes('$') ? '$' : '';
                    if (numString.length > 0) {
                        let finalVal = parseInt(numString, 10);
                        let obj = { val: 0 };
                        gsap.to(obj, {
                            val: finalVal,
                            duration: 2.5,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: counter, start: "top 90%"
                            },
                            onUpdate: function() {
                                counter.innerText = prefix + Math.floor(obj.val) + suffix;
                            }
                        });
                    }
                }
            });
        }
    }
});

// --- Premium Web3 Preloader ---
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('premium-preloader');
    if (!preloader) return;

    // Check if user has already seen the preloader in this session
    if (sessionStorage.getItem('hasSeenPreloader')) {
        preloader.style.display = 'none';
        return;
    }

    const fillBar = document.getElementById('preloader-bar');
    const percentText = document.getElementById('preloader-percentage');
    let progress = 0;

    // Smoothly animate from 0 to 100% over ~2.5 seconds
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1; // random increment between 1 and 5
        if (progress > 100) progress = 100;
        
        fillBar.style.width = progress + '%';
        percentText.innerText = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('fade-out');
                sessionStorage.setItem('hasSeenPreloader', 'true');
                
                // Remove from DOM after fade-out completes
                setTimeout(() => {
                    preloader.remove();
                }, 800);
            }, 500); // short pause at 100% before fading
        }
    }, 40); // 40ms interval
});

// ==========================================================================
// Modern Custom Cursor & Magnetic Buttons
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Cursor Elements
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    const follower = document.createElement('div');
    follower.classList.add('custom-cursor-follower');
    
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // 2. Track Mouse Movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant movement for small dot
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth movement for follower ring
    function animateFollower() {
        // Linear interpolation for smooth trailing
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // 3. Hover Effects on Links and Buttons
    const interactables = document.querySelectorAll('a, button, input, .magnetic, .hover-lift, .nft-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    // 4. Magnetic Buttons Logic
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly towards cursor
            btn.style.transform = "translate(" + (x * 0.3) + "px, " + (y * 0.3) + "px)";
        });
        btn.addEventListener('mouseleave', () => {
            // Reset position
            btn.style.transform = 'translate(0px, 0px)';
            btn.style.transition = 'transform 0.3s ease-out';
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });
});

