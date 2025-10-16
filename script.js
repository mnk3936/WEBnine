// Performance-optimized JavaScript with Sidebar Support

// Debounce utility
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// RAF throttle
function rafThrottle(callback) {
    let requestId = null;
    let lastArgs;

    const later = (context) => () => {
        requestId = null;
        callback.apply(context, lastArgs);
    };

    const throttled = function(...args) {
        lastArgs = args;
        if (requestId === null) {
            requestId = requestAnimationFrame(later(this));
        }
    };

    throttled.cancel = () => {
        cancelAnimationFrame(requestId);
        requestId = null;
    };

    return throttled;
}

// Lazy Loading Images
const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
};

// Lazy Loading Background Images
const lazyLoadBackgrounds = () => {
    const bgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const bgUrl = element.getAttribute('data-bg');
                
                if (bgUrl) {
                    element.style.backgroundImage = `url('${bgUrl}')`;
                    element.classList.remove('lazy-bg');
                    observer.unobserve(element);
                }
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.01
    });

    const lazyBgs = document.querySelectorAll('.lazy-bg');
    lazyBgs.forEach(bg => bgObserver.observe(bg));
};

// Mobile Sidebar Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const sidebar = document.querySelector('.sidebar');

if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    }, { passive: true });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Active Navigation Link Highlighting
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', rafThrottle(highlightNav), { passive: true });

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target && targetId !== '#') {
            e.preventDefault();
            
            // Close mobile sidebar
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Sidebar scroll effect - enhanced transparency
const handleSidebarScroll = rafThrottle(() => {
    if (window.scrollY > 100) {
        sidebar.style.background = 'rgba(10, 31, 15, 0.85)';
        sidebar.style.backdropFilter = 'blur(20px)';
    } else {
        sidebar.style.background = 'rgba(10, 31, 15, 0.75)';
        sidebar.style.backdropFilter = 'blur(15px)';
    }
});

window.addEventListener('scroll', handleSidebarScroll, { passive: true });

// Section fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    sectionObserver.observe(section);
});

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        lazyLoadImages();
        lazyLoadBackgrounds();
        highlightNav();
    });
} else {
    lazyLoadImages();
    lazyLoadBackgrounds();
    highlightNav();
}
