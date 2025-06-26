// Global variables
let currentTheme = 'light';
let isScrolled = false;
let typedTextIndex = 0;
let typedCharIndex = 0;
let isDeleting = false;

// Typed text array
const typedTexts = [
    'Web Developer',
    'Programmer', 
    'Cricket Enthusiast',
    'Video Editor',
    'Problem Solver'
];

// DOM elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const nav = document.getElementById('nav');
const header = document.getElementById('header');
const scrollToTopBtn = document.getElementById('scroll-to-top');
const contactForm = document.getElementById('contact-form');
const certificateModal = document.getElementById('certificate-modal');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
const notification = document.getElementById('notification');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeParticles();
    initializeAnimations();
    initializeEventListeners();
    startTypingEffect();
    animateCounters();
    initializeScrollAnimations();
});

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    currentTheme = savedTheme || systemTheme;
    
    document.body.className = currentTheme + '-theme';
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = currentTheme + '-theme';
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function updateThemeIcon() {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (currentTheme === 'dark') {
        sunIcon.style.opacity = '0';
        sunIcon.style.transform = 'translate(-50%, -50%) rotate(180deg) scale(0)';
        moonIcon.style.opacity = '1';
        moonIcon.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
    } else {
        sunIcon.style.opacity = '1';
        sunIcon.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
        moonIcon.style.opacity = '0';
        moonIcon.style.transform = 'translate(-50%, -50%) rotate(-180deg) scale(0)';
    }
}

// Particle background
function initializeParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.6 + 0.3;
            
            // Orange colors for light theme, green colors for dark theme
            const lightColors = ['#f97316', '#ea580c', '#fb923c', '#fdba74'];
            const darkColors = ['#22c55e', '#16a34a', '#4ade80', '#86efac'];
            
            this.lightColor = lightColors[Math.floor(Math.random() * lightColors.length)];
            this.darkColor = darkColors[Math.floor(Math.random() * darkColors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
            
            this.opacity += (Math.random() - 0.5) * 0.03;
            this.opacity = Math.max(0.2, Math.min(0.9, this.opacity));
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Use different colors based on theme
            const isDark = document.body.classList.contains('dark-theme');
            ctx.fillStyle = isDark ? this.darkColor : this.lightColor;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections with theme-appropriate colors
        const isDark = document.body.classList.contains('dark-theme');
        const connectionColor = isDark ? '#22c55e' : '#f97316';
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.save();
                    ctx.globalAlpha = (150 - distance) / 150 * 0.15;
                    ctx.strokeStyle = connectionColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Typing effect
function startTypingEffect() {
    const typedTextElement = document.getElementById('typed-text');
    const currentText = typedTexts[typedTextIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, typedCharIndex - 1);
        typedCharIndex--;
        
        if (typedCharIndex === 0) {
            isDeleting = false;
            typedTextIndex = (typedTextIndex + 1) % typedTexts.length;
            setTimeout(startTypingEffect, 500);
            return;
        }
    } else {
        typedTextElement.textContent = currentText.substring(0, typedCharIndex + 1);
        typedCharIndex++;
        
        if (typedCharIndex === currentText.length) {
            isDeleting = true;
            setTimeout(startTypingEffect, 2500);
            return;
        }
    }
    
    setTimeout(startTypingEffect, isDeleting ? 50 : 120);
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 80;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 30);
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animate skill progress bars
                if (entry.target.classList.contains('skill-category')) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 400);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.skill-category, .project-card, .certificate-card, .contact-card, .text-block, .highlight-card').forEach(el => {
        observer.observe(el);
    });
}

// Event listeners
function initializeEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Update active link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Contact form
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Certificate modal
    document.querySelectorAll('.certificate-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const imageUrl = btn.getAttribute('data-image');
            showCertificateModal(imageUrl);
        });
    });
    
    modalClose.addEventListener('click', hideCertificateModal);
    modalBackdrop.addEventListener('click', hideCertificateModal);
    
    // Scroll to top
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
            hideCertificateModal();
        }
    });
}

// Scroll handler
function handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Header background
    if (scrollTop > 100 && !isScrolled) {
        header.classList.add('scrolled');
        isScrolled = true;
    } else if (scrollTop <= 100 && isScrolled) {
        header.classList.remove('scrolled');
        isScrolled = false;
    }
    
    // Scroll to top button
    if (scrollTop > 600) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
    
    // Update active navigation
    updateActiveNavigation();
}

// Update active navigation
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 300;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// Form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    
    // Simulate form submission
    try {
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        
        showNotification('Message sent successfully! I will get back to you soon.', 'success');
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.classList.remove('success');
        }, 3500);
        
    } catch (error) {
        submitBtn.classList.remove('loading');
        showNotification('Failed to send message. Please try again.', 'error');
    }
}

// Certificate modal
function showCertificateModal(imageUrl) {
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageUrl;
    certificateModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCertificateModal() {
    certificateModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Notification system
function showNotification(message, type = 'info') {
    const notificationContent = notification.querySelector('.notification-content');
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationMessage = notification.querySelector('.notification-message');
    
    // Set icon based on type
    if (type === 'success') {
        notificationIcon.className = 'notification-icon fas fa-check-circle';
        notification.className = 'notification success';
    } else if (type === 'error') {
        notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
        notification.className = 'notification error';
    } else {
        notificationIcon.className = 'notification-icon fas fa-info-circle';
        notification.className = 'notification';
    }
    
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 6000);
}

// Initialize animations
function initializeAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.hero-content > *, .about-text > *, .section-header > *');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.8s ease';
        element.style.transitionDelay = `${index * 0.15}s`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150);
    });
}

// Button ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
    
    setTimeout(() => {
        circle.remove();
    }, 700);
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
});

// Add ripple CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.7s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Performance optimization
let ticking = false;

function optimizedScrollHandler() {
    handleScroll();
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(optimizedScrollHandler);
        ticking = true;
    }
});

// Preload images
function preloadImages() {
    const images = [
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jangid.jpg-AxtKnU73sYqQ8cEN54sjQlbXhsChgc.jpeg',
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Govind.jpg-oYmDAUB1uK5nGWqsMnkfdXiy7Aqc4E.jpeg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();

// System theme change listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        currentTheme = e.matches ? 'dark' : 'light';
        document.body.className = currentTheme + '-theme';
        updateThemeIcon();
    }
});

// Touch events for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
});

function handleGesture() {
    if (touchEndY < touchStartY - 80) {
        // Swipe up - could trigger scroll to top
        if (window.pageYOffset > 1200) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Intersection Observer for lazy loading
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Service Worker registration (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you have a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Add smooth scrolling enhancement
document.documentElement.style.scrollBehavior = 'smooth';

// Enhanced theme transition
document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';