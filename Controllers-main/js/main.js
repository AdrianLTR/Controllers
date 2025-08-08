// ========== MOBILE MENU FUNCTIONALITY ==========
class MobileMenu {
    constructor() {
        this.button = document.getElementById('mobile-menu-button');
        this.menu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
        if (!this.button || !this.menu) return;
        
        // Toggle menu on button click
        this.button.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on links
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('header')) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.menu.classList.toggle('hidden');
        
        // Update button icon
        const icon = this.button.querySelector('i');
        if (this.menu.classList.contains('hidden')) {
            icon.className = 'fas fa-bars text-2xl';
        } else {
            icon.className = 'fas fa-times text-2xl';
        }
    }

    closeMenu() {
        this.menu.classList.add('hidden');
        const icon = this.button.querySelector('i');
        icon.className = 'fas fa-bars text-2xl';
    }
}

// ========== VIDEO BACKGROUND HANDLER ==========
class VideoBackgroundHandler {
    constructor() {
        this.video = document.querySelector('.video-background');
        this.loadingIndicator = document.getElementById('video-loading');
        this.init();
    }

    init() {
        if (!this.video) return;

        // Handle video loading
        this.video.addEventListener('loadstart', () => this.showLoading());
        this.video.addEventListener('canplay', () => this.hideLoading());
        this.video.addEventListener('error', () => this.handleError());
        
        // Ensure video plays on mobile devices
        this.video.addEventListener('loadedmetadata', () => {
            this.video.play().catch(e => {
                console.log('Video autoplay failed:', e);
                this.hideLoading();
            });
        });

        // Optimize video performance
        this.optimizeVideo();
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    handleError() {
        console.log('Video failed to load, hiding video element');
        if (this.video) {
            this.video.style.display = 'none';
        }
        this.hideLoading();
    }

    optimizeVideo() {
        // Reduce video quality on mobile devices
        if (window.innerWidth < 768) {
            this.video.style.opacity = '0.1';
        }

        // Pause video when not in viewport to save resources
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.video.play().catch(() => {});
                } else {
                    this.video.pause();
                }
            });
        });

        observer.observe(this.video);
    }
}

// ========== ENHANCED SCROLL ANIMATIONS ==========
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { 
                threshold: 0.1, 
                rootMargin: '0px 0px -50px 0px' 
            }
        );
        this.init();
    }

    init() {
        // Observe all elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
            // Add staggered delay for multiple elements
            el.style.transitionDelay = `${index * 100}ms`;
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing once animated to improve performance
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ========== ENHANCED SCROLL TO TOP BUTTON ==========
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scroll-to-top');
        this.init();
    }

    init() {
        if (!this.button) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));
        
        // Scroll to top when clicked
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        if (window.scrollY > 300) {
            this.showButton();
        } else {
            this.hideButton();
        }
    }

    showButton() {
        this.button.classList.remove('opacity-0', 'translate-y-4');
        this.button.classList.add('opacity-100');
    }

    hideButton() {
        this.button.classList.add('opacity-0', 'translate-y-4');
        this.button.classList.remove('opacity-100');
    }

    scrollToTop() {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    }
}

// ========== ENHANCED SMOOTH SCROLLING ==========
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to all navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            // Calculate offset for sticky header
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight - 20; // Extra padding
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL without triggering scroll
            history.pushState(null, null, href);
        }
    }
}

// ========== ENHANCED FORM HANDLER ==========
class FormHandler {
    constructor() {
        this.form = document.querySelector('#contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.btnText = this.submitBtn?.querySelector('.btn-text');
        this.btnLoading = this.submitBtn?.querySelector('.btn-loading');
        
        // EmailJS configuration
        this.emailJSConfig = window.EMAILJS_CONFIG || {
            publicKey: 'TU_PUBLIC_KEY',
            serviceID: 'TU_SERVICE_ID', 
            templateID: 'TU_TEMPLATE_ID'
        };
        
        this.init();
    }

    init() {
        if (!this.form) return;

        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.emailJSConfig.publicKey);
        }
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Add character counter for textarea
        this.addCharacterCounter();
    }

    addCharacterCounter() {
        const textarea = this.form.querySelector('textarea[name="message"]');
        if (textarea) {
            const counter = document.createElement('div');
            counter.className = 'text-sm text-gray-500 mt-1 text-right';
            counter.textContent = '0 caracteres';
            textarea.parentNode.appendChild(counter);

            textarea.addEventListener('input', () => {
                const length = textarea.value.length;
                counter.textContent = `${length} caracteres`;
                
                if (length > 500) {
                    counter.classList.add('text-red-500');
                    counter.classList.remove('text-gray-500');
                } else {
                    counter.classList.remove('text-red-500');
                    counter.classList.add('text-gray-500');
                }
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields first
        const isValid = this.validateForm();
        if (!isValid) {
            this.showValidationError();
            return;
        }

        this.setLoadingState(true);

        try {
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS no está disponible. Por favor, verifica la configuración.');
            }

            // Prepare form data
            const formData = new FormData(this.form);
            const templateParams = {
                from_name: formData.get('from_name') || 'Sin nombre',
                from_email: formData.get('from_email'),
                company: formData.get('company') || 'No especificada',
                message: formData.get('message') || 'Sin mensaje',
                reply_to: formData.get('from_email'),
                to_email: this.emailJSConfig.toEmail || 'servicios@controllersrd.com'
            };

            // Send email using EmailJS
            const result = await emailjs.send(
                this.emailJSConfig.serviceID,
                this.emailJSConfig.templateID,
                templateParams
            );

            console.log('Email sent successfully:', result);
            this.showSuccessMessage();
            this.form.reset();
            
            // Reset character counter
            const counter = this.form.querySelector('.text-sm.text-gray-500');
            if (counter) {
                counter.textContent = '0 caracteres';
            }
            
        } catch (error) {
            console.error('Error sending email:', error);
            this.showErrorMessage(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm() {
        let isValid = true;
        const formData = new FormData(this.form);
        
        // Clear previous errors
        this.form.querySelectorAll('.error-message').forEach(error => error.remove());
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.classList.remove('border-red-500');
        });
        
        // Validate required fields
        const email = formData.get('from_email');
        const name = formData.get('from_name');
        const message = formData.get('message');

        if (!email || !email.trim()) {
            this.showFieldError(this.form.querySelector('[name="from_email"]'), 'El correo electrónico es requerido');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError(this.form.querySelector('[name="from_email"]'), 'Por favor, ingresa un email válido');
            isValid = false;
        }

        if (!name || name.trim().length === 0) {
            this.showFieldError(this.form.querySelector('[name="from_name"]'), 'El nombre es requerido');
            isValid = false;
        }

        if (!message || message.trim().length === 0) {
            this.showFieldError(this.form.querySelector('[name="message"]'), 'El mensaje es requerido');
            isValid = false;
        } else if (message.length > 500) {
            this.showFieldError(this.form.querySelector('[name="message"]'), 'El mensaje no puede exceder 500 caracteres');
            isValid = false;
        }

        return isValid;
    }

    setLoadingState(loading) {
        if (!this.submitBtn || !this.btnText || !this.btnLoading) return;
        
        this.submitBtn.disabled = loading;
        
        if (loading) {
            this.btnText.classList.add('hidden');
            this.btnLoading.classList.remove('hidden');
            this.submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            this.btnText.classList.remove('hidden');
            this.btnLoading.classList.add('hidden');
            this.submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    showSuccessMessage() {
        this.showNotification(
            '¡Mensaje enviado correctamente! Te contactaremos pronto.',
            'success',
            'fas fa-check-circle'
        );
    }

    showErrorMessage(error) {
        const errorMessage = error.text || error.message || 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.';
        this.showNotification(
            errorMessage,
            'error',
            'fas fa-exclamation-triangle'
        );
    }

    showValidationError() {
        this.showNotification(
            'Por favor, corrige los errores en el formulario.',
            'warning',
            'fas fa-exclamation-triangle'
        );
    }

    showNotification(message, type = 'info', icon = 'fas fa-info-circle') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <i class="${icon} flex-shrink-0 mt-0.5"></i>
                <span class="text-sm leading-relaxed">${message}</span>
                <button class="ml-2 text-white hover:text-gray-200 flex-shrink-0" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after delay
        const delay = type === 'error' ? 7000 : 5000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, delay);
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Este campo es requerido');
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Por favor, ingresa un email válido');
        } else if (field.name === 'message' && value.length > 500) {
            this.showFieldError(field, 'El mensaje no puede exceder 500 caracteres');
        } else {
            this.clearFieldError(field);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1 flex items-center';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${message}`;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize scroll events
        this.optimizeScrollEvents();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add fade-in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload hero video
        const videoSources = [
            'https://videos.pexels.com/video-files/3196036/3196036-uhd_2560_1440_25fps.mp4',
            'https://videos.pexels.com/video-files/6774/6774-hd_1920_1080_25fps.mp4'
        ];

        videoSources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    optimizeScrollEvents() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Update header background on scroll
                    this.updateHeaderOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateHeaderOnScroll() {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
}

// ========== ACCESSIBILITY ENHANCEMENTS ==========
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard navigation support
        this.addKeyboardNavigation();
        
        // Respect user's motion preferences
        this.respectMotionPreferences();
        
        // Add focus management
        this.addFocusManagement();
        
        // Add ARIA labels
        this.addAriaLabels();
    }

    addKeyboardNavigation() {
        // Make mobile menu button keyboard accessible
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    mobileMenuButton.click();
                }
            });
        }

        // Add focus styles for better keyboard navigation
        const focusableElements = document.querySelectorAll('a, button, input, textarea, [tabindex]');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid #3b82f6';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }

    respectMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--animation-duration', '0s');
            
            // Hide video background
            const video = document.querySelector('.video-background');
            if (video) {
                video.style.display = 'none';
            }
        }
    }

    addFocusManagement() {
        // Trap focus in mobile menu when open
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        
        if (mobileMenu && mobileMenuButton) {
            const focusableElements = mobileMenu.querySelectorAll('a, button, [tabindex]');
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            mobileMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            });
        }
    }

    addAriaLabels() {
        // Add ARIA labels to interactive elements
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (scrollToTopBtn) {
            scrollToTopBtn.setAttribute('aria-label', 'Volver al inicio de la página');
        }

        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.setAttribute('aria-label', 'Abrir menú de navegación');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }

        // Add ARIA labels to form fields
        const formFields = document.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            const label = field.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                field.setAttribute('aria-describedby', `${field.name}-help`);
            }
        });
    }
}

// ========== UTILITY FUNCTIONS ==========
const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Format phone number
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize all components
        new MobileMenu();
        new VideoBackgroundHandler();
        new ScrollAnimations();
        new ScrollToTop();
        new SmoothScroll();
        new FormHandler();
        new PerformanceOptimizer();
        new AccessibilityEnhancer();
        
        console.log('Controllers RD website initialized successfully! 🚀');
        
        // Add loading complete class to body
        document.body.classList.add('loaded');
        
    } catch (error) {
        console.error('Error initializing website:', error);
    }
});

// ========== ERROR HANDLING ==========
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // In a production environment, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ========== SERVICE WORKER REGISTRATION ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for better performance (optional)
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ========== ANALYTICS INTEGRATION ==========
// Add Google Analytics or other analytics here if needed
// Example:
// gtag('config', 'GA_MEASUREMENT_ID');

// ========== EXPORT FOR TESTING ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileMenu,
        VideoBackgroundHandler,
        ScrollAnimations,
        ScrollToTop,
        SmoothScroll,
        FormHandler,
        PerformanceOptimizer,
        AccessibilityEnhancer,
        Utils
    };
}