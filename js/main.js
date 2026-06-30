// main.js
document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Logic (Only show once per session)
    const preloader = document.getElementById('premium-preloader');
    if (preloader) {
        if (sessionStorage.getItem('preloaderShown')) {
            preloader.style.display = 'none';
        } else {
            // Simulate loading
            let progress = 0;
            const bar = document.getElementById('preloader-bar');
            const perc = document.getElementById('preloader-percentage');
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 15) + 5;
                if(progress > 100) progress = 100;
                if(bar) bar.style.width = progress + '%';
                if(perc) perc.innerText = progress + '%';
                if(progress === 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        preloader.style.opacity = '0';
                        setTimeout(() => {
                            preloader.style.display = 'none';
                            sessionStorage.setItem('preloaderShown', 'true');
                        }, 500);
                    }, 500);
                }
            }, 200);
        }
    }

    // 1. Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 2. Navbar Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Magnetic Buttons (Hover Lift effect)
    const magneticElements = document.querySelectorAll('.btn-primary, .magnetic');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            elem.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0, 0)';
        });
    });

    // 4. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // 5. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', target);
            const icon = themeToggle.querySelector('i');
            if(target === 'light') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // 6. Scroll Animations (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve if we only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.gsap-reveal, .reveal').forEach(el => {
        observer.observe(el);
    });

    // 7. Ripple Effect on Buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

    // 8. Hero Slider Logic
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
        let currentSlide = 0;
        const totalSlides = 3;
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            heroSlider.style.transform = "translateX(-" + (currentSlide * 100) + "%)";
        }, 4000);
    }

    // 9. Dashboard Sidebar Toggle
    const collapseBtn = document.getElementById('collapseSidebarBtn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    // Desktop Collapse
    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', () => {
            if (window.innerWidth > 1024) {
                sidebar.classList.toggle('collapsed');
                if (mainContent) mainContent.classList.toggle('expanded');
                
                const icon = collapseBtn.querySelector('i');
                if (sidebar.classList.contains('collapsed')) {
                    icon.classList.remove('fa-angles-left');
                    icon.classList.add('fa-angles-right');
                } else {
                    icon.classList.remove('fa-angles-right');
                    icon.classList.add('fa-angles-left');
                }
            } else {
                // Mobile close
                sidebar.classList.remove('active');
                if(sidebarOverlay) sidebarOverlay.classList.remove('active');
            }
        });
    }

    // Mobile Open
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            if(sidebarOverlay) sidebarOverlay.classList.add('active');
        });
    }

    // Overlay click close
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    // 10. Dashboard Tab Switching
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[data-target]');
    const dashboardViews = document.querySelectorAll('.dashboard-view');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked link
            e.currentTarget.classList.add('active');

            // Hide all views
            dashboardViews.forEach(view => {
                view.classList.remove('active');
                view.style.display = 'none';
            });

            // Show target view
            const targetId = e.currentTarget.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.style.display = 'block';
                // Small timeout to allow display:block to apply before adding class for opacity transition
                setTimeout(() => {
                    targetView.classList.add('active');
                }, 10);
            }

            // Close mobile sidebar on click
            if (window.innerWidth <= 1024 && sidebar) {
                sidebar.classList.remove('active');
                if(sidebarOverlay) sidebarOverlay.classList.remove('active');
            }
        });
    });

    // 11. Animated Statistics (Number Counter)
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.stat-card h3');
        numbers.forEach(num => {
            const targetText = num.innerText;
            const targetVal = parseFloat(targetText.replace(/[^\d.]/g, ''));
            const suffix = targetText.replace(/[\d.]/g, '').trim();
            if(!isNaN(targetVal)) {
                let start = 0;
                const duration = 2000;
                const increment = targetVal / (duration / 16);
                
                const updateNumber = () => {
                    start += increment;
                    if(start < targetVal) {
                        num.innerText = start.toFixed(targetText.includes('.') ? 1 : 0) + (suffix ? ' ' + suffix : '');
                        requestAnimationFrame(updateNumber);
                    } else {
                        num.innerText = targetText;
                    }
                };
                updateNumber();
            }
        });
    };
    
    // Run once on load
    setTimeout(animateNumbers, 500);


    // 12. Global Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, var(--accent-neon-blue), var(--accent-purple))';
    progressBar.style.zIndex = '999999';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);

    // 13. Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTopBtn.className = 'btn btn-primary magnetic';
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.bottom = '30px';
    backToTopBtn.style.right = '30px';
    backToTopBtn.style.width = '50px';
    backToTopBtn.style.height = '50px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.padding = '0';
    backToTopBtn.style.zIndex = '999';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.transform = 'translateY(20px)';
    backToTopBtn.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    backToTopBtn.style.pointerEvents = 'none';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';

        // Back to Top Visibility
        if (winScroll > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.transform = 'translateY(0)';
            backToTopBtn.style.pointerEvents = 'auto';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px)';
            backToTopBtn.style.pointerEvents = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

// 14. Global Logout Function
window.logoutUser = function(e) {
    if(e) e.preventDefault();
    localStorage.removeItem('stackly_auth');
    window.location.href = 'login.html';
};

    // 15. Smooth Page Exit Transition
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            // Only animate for internal links
            if (target && !target.startsWith('#') && !target.startsWith('http') && target !== '404.html') {
                e.preventDefault();
                document.body.style.transition = 'opacity 0.4s ease-out';
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = target;
                }, 400);
            }
        });
    });

// ==========================================================================
// 16. Form Handling & Button Functionality (Global Sweep)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Make forms functional (Newsletter, Contact, etc.)
    document.querySelectorAll('form').forEach(form => {
        if(form.id !== 'loginForm' && form.id !== 'signupForm') {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
                if(btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
                    btn.style.backgroundColor = '#00f0ff';
                    btn.style.color = '#000';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style = '';
                        form.reset();
                    }, 3000);
                }
            });
        }
    });

    // Prevent default on empty links
    document.querySelectorAll('a[href="404.html"], a[href="#"]').forEach(link => {
        if(!link.hasAttribute('onclick')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }
    });
});

// Global Action Functions for Buttons (Like, Share)
window.toggleLike = function(btn) {
    const icon = btn.querySelector('i');
    if(icon && icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        icon.style.color = '#ff0055';
    } else if (icon) {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        icon.style.color = '';
    }
};

window.shareNFT = function() {
    alert("Link copied to clipboard!");
};
