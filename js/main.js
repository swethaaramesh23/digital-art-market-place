// main.js
document.addEventListener('DOMContentLoaded', () => {
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
            
            elem.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        elem.addEventListener('mouseleave', () => {
            elem.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. Reveal on scroll (Fallback if GSAP isn't used for simple elements)
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    
    // 5. Theme Switcher (Dark / Light)
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if(currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Restore theme
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    // 6. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

// --- Auth & Session Management Mock ---
window.checkAuth = function() {
    const isLoggedIn = localStorage.getItem('stackly_auth');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
};

window.loginUser = function(email, role) {
    localStorage.setItem('stackly_auth', 'true');
    localStorage.setItem('stackly_role', role || 'user');
    localStorage.setItem('stackly_email', email);
};

window.logoutUser = function(e) {
    if(e) e.preventDefault();
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('stackly_auth');
        localStorage.removeItem('stackly_role');
        localStorage.removeItem('stackly_email');
        window.location.href = 'index.html';
    }
};

// --- Toast Notification System ---
window.showToast = function(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
};

// --- Global Interactivity (Make every button work) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle all empty links (href="#")
    const emptyLinks = document.querySelectorAll('a[href="#"]');
    emptyLinks.forEach(link => {
        // Skip links that already have onclick handlers (like logout)
        if (!link.hasAttribute('onclick')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const text = link.innerText.trim();
                if (text) {
                    showToast(`${text} - Coming Soon!`, 'success');
                } else {
                    showToast('Action processed!', 'success');
                }
            });
        }
    });

    // 2. Handle generic buttons without specific actions
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        // Skip buttons that submit forms, toggle menus, or have explicit onclicks
        if (btn.type !== 'submit' && !btn.hasAttribute('onclick') && !btn.id && !btn.classList.contains('menu-toggle') && !btn.classList.contains('page-btn') && !btn.classList.contains('close-modal')) {
            btn.addEventListener('click', (e) => {
                const text = btn.innerText.trim();
                
                // Specific Button Logics
                if (text.toLowerCase() === 'follow') {
                    btn.innerText = 'Following';
                    btn.classList.remove('btn-glass');
                    btn.classList.add('btn-primary');
                    showToast('Successfully followed!', 'success');
                } else if (text.toLowerCase() === 'following') {
                    btn.innerText = 'Follow';
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-glass');
                    showToast('Unfollowed.', 'success');
                } else if (text.toLowerCase().includes('load more')) {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> All items loaded';
                    btn.classList.remove('btn-glass');
                    btn.classList.add('btn-primary');
                    showToast('All items have been loaded.', 'success');
                } else if (text.toLowerCase().includes('bid') || text.toLowerCase().includes('offer')) {
                    showToast('Transaction initiated. Awaiting wallet confirmation.', 'success');
                } else if (text) {
                    // Fallback
                    showToast('Action processed!', 'success');
                } else {
                    // Icon only buttons (like hearts, shares)
                    const icon = btn.querySelector('i');
                    if (icon) {
                        if (icon.classList.contains('fa-heart')) {
                            icon.classList.toggle('fa-solid');
                            icon.classList.toggle('fa-regular');
                            icon.style.color = icon.classList.contains('fa-solid') ? 'var(--accent-pink)' : '';
                            showToast(icon.classList.contains('fa-solid') ? 'Added to favorites!' : 'Removed from favorites.', 'success');
                        } else if (icon.classList.contains('fa-share-nodes')) {
                            showToast('Link copied to clipboard!', 'success');
                        } else {
                            showToast('Action processed!', 'success');
                        }
                    }
                }
            });
        }
    });

    // 3. Handle Pagination Buttons
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
            if (!btn.innerHTML.includes('chevron')) {
                btn.classList.add('active');
            }
            showToast('Loading page...', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // 4. Handle Global Forms (Newsletter Subscriptions)
    document.addEventListener('submit', (e) => {
        // If it's not the explicit auth forms (loginForm/signupForm)
        if (e.target.id !== 'loginForm' && e.target.id !== 'signupForm') {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            if (btn && btn.innerText.toLowerCase().includes('subscribe')) {
                showToast('Successfully subscribed to the newsletter!', 'success');
                e.target.reset();
            } else {
                showToast('Form submitted successfully!', 'success');
                e.target.reset();
            }
        }
    });

    // 5. Handle Dashboard Sidebar
    const dashboardSidebar = document.querySelector('.sidebar');
    const dashboardOverlay = document.querySelector('.sidebar-overlay');
    const dashboardMenuBtn = document.querySelector('.mobile-menu-btn');
    const collapseSidebarBtn = document.getElementById('collapseSidebarBtn');

    if (dashboardSidebar) {
        const toggleSidebar = () => {
            const isActive = dashboardSidebar.classList.contains('active');
            
            if (isActive) {
                // Close it
                dashboardSidebar.classList.remove('active');
                if (dashboardOverlay) dashboardOverlay.classList.remove('active');
                if (dashboardMenuBtn) dashboardMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                document.body.style.overflow = '';
            } else {
                // Open it
                dashboardSidebar.classList.add('active');
                if (dashboardOverlay) dashboardOverlay.classList.add('active');
                if (dashboardMenuBtn) dashboardMenuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                if (window.innerWidth <= 1024) document.body.style.overflow = 'hidden';
            }
        };

        if (dashboardMenuBtn) {
            dashboardMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
            });
        }

        if (dashboardOverlay) {
            dashboardOverlay.addEventListener('click', toggleSidebar);
        }

        // Close sidebar when clicking any navigation link on mobile
        const sidebarLinks = dashboardSidebar.querySelectorAll('.sidebar-nav a, .btn');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024 && dashboardSidebar.classList.contains('active')) {
                    toggleSidebar();
                }
            });
        });

        // Desktop Collapse Feature
        if (collapseSidebarBtn) {
            collapseSidebarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dashboardSidebar.classList.toggle('collapsed');
            });
        }
    }
    // 6. Handle Dashboard Tab Switching
    const dashboardNavLinks = document.querySelectorAll('.sidebar-nav a[data-target]');
    const dashboardViews = document.querySelectorAll('.dashboard-view');

    if (dashboardNavLinks.length > 0) {
        dashboardNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 1. Remove active from all links
                dashboardNavLinks.forEach(nav => nav.classList.remove('active'));
                
                // 2. Add active to clicked link
                link.classList.add('active');
                
                // 3. Hide all views
                dashboardViews.forEach(view => {
                    view.classList.remove('active');
                });
                
                // 4. Show target view
                const targetId = link.getAttribute('data-target');
                const targetView = document.getElementById(targetId);
                if (targetView) {
                    targetView.classList.add('active');
                }
            });
        });
    }
});

