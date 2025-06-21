// ========== MOBILE MENU FUNCTIONALITY ==========
class MobileMenu {
    constructor() {
        this.button = document.getElementById('mobile-menu-button');
        this.menu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
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
    }

    toggleMenu() {
        this.menu.classList.toggle('hidden');
    }

    closeMenu() {
        this.menu.classList.add('hidden');
    }
}

// ========== SCROLL ANIMATIONS ==========
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        this.init();
    }

    init() {
        // Observe all elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing once animated
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ========== SCROLL TO TOP BUTTON ==========
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scroll-to-top');
        this.init();
    }

    init() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => this.handleScroll());
        
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

// ========== SMOOTH SCROLLING FOR NAVIGATION LINKS ==========
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
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ========== FORM ENHANCEMENTS ==========
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
        if (this.form) {
            // Initialize EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.emailJSConfig.publicKey);
            }
            
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Add input validation feedback
            this.form.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields first
        const isValid = this.validateForm();
        if (!isValid) {
            return;
        }

        this.setLoadingState(true);

        try {
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS no está disponible');
            }

            // Send email using EmailJS
            const result = await emailjs.sendForm(
                this.emailJSConfig.serviceID,
                this.emailJSConfig.templateID,
                this.form
            );

            console.log('Email sent successfully:', result);
            this.showSuccessMessage();
            this.form.reset();
            
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
        
        // Validate required fields
        const email = formData.get('from_email');
        const name = formData.get('from_name');
        const message = formData.get('message');

        if (!email) {
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
        }

        return isValid;
    }

    setLoadingState(loading) {
        if (this.submitBtn && this.btnText && this.btnLoading) {
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
    }

    showSuccessMessage() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>¡Mensaje enviado correctamente! Te contactaremos pronto.</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    showErrorMessage(error) {
        const errorMessage = error.text || error.message || 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.';
        
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${errorMessage}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 7 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 7000);
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Este campo es requerido');
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Por favor, ingresa un email válido');
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
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
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
        
        // Debounce scroll events
        this.debounceScrollEvents();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('fade-in');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    debounceScrollEvents() {
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                if (originalScrollHandler) {
                    originalScrollHandler();
                }
            }, 10);
        });
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
        const focusableElements = document.querySelectorAll('a, button, input, textarea');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('outline-2', 'outline-blue-500');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('outline-2', 'outline-blue-500');
            });
        });
    }

    respectMotionPreferences() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--animation-duration', '0s');
        }
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileMenu();
    new ScrollAnimations();
    new ScrollToTop();
    new SmoothScroll();
    new FormHandler();
    new PerformanceOptimizer();
    new AccessibilityEnhancer();
    
    console.log('Controllers RD website initialized successfully! 🚀');
});

// ========== ERROR HANDLING ==========
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // In a production environment, you might want to send this to an error tracking service
});

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
    }
};
