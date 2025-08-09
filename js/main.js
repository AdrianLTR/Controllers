// ========== RESOURCE VALIDATION ==========
class ResourceValidator {
    constructor() {
        this.criticalResources = [
            { type: 'css', url: 'css/styles.css' },
            { type: 'js', url: 'js/emailjs-config.js' },
            { type: 'font', name: 'Poppins' },
            { type: 'font', name: 'Cinzel' }
        ];
        this.init();
    }

    init() {
        this.validateResources();
        this.checkEmailJSStatus();
        this.validateImages();
    }

    validateResources() {
        // Check if CSS is loaded
        const cssLoaded = Array.from(document.styleSheets).some(sheet => 
            sheet.href && sheet.href.includes('styles.css')
        );
        
        if (!cssLoaded) {
            console.warn('Custom CSS not loaded properly');
        }

        // Check if fonts are loaded
        this.validateFonts();
    }

    async validateFonts() {
        try {
            await document.fonts.load('16px Poppins');
            await document.fonts.load('16px Cinzel');
            console.log('Fonts loaded successfully');
        } catch (error) {
            console.warn('Some fonts failed to load:', error);
        }
    }

    checkEmailJSStatus() {
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not loaded - contact form will show error messages');
            this.showEmailJSWarning();
        } else if (typeof EMAILJS_CONFIG !== 'undefined' && EMAILJS_CONFIG.isDevelopment) {
            console.info('EmailJS in development mode');
        }
    }

    validateImages() {
        const images = document.querySelectorAll('img[src]');
        let brokenImageCount = 0;

    // iOS specific workaround: force decode after load to avoid false 'failed' alerts in some WKWebView contexts
    const isiOS = /ipad|iphone|ipod/i.test(navigator.userAgent);
        
        images.forEach((img, index) => {
            // Create a test image to check if it loads
            const testImg = new Image();
            
            testImg.onload = () => {
                console.log(`✅ Image loaded successfully: ${img.src}`);
                img.classList.remove('broken');
                img.style.opacity = '1';
                if (isiOS && img.decode) {
                    img.decode().catch(()=>{});
                }
            };
            
            testImg.onerror = () => {
                brokenImageCount++;
                console.warn(`❌ Image failed to load: ${img.src}`);
                this.handleBrokenImage(img);
            };
            
            // Set initial opacity to 0 while loading
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            // Test the image
            testImg.src = img.src;
            
            // Fallback timeout
            setTimeout(() => {
                if (img.style.opacity === '0' && !img.classList.contains('broken')) {
                    console.warn(`⏱️ Image load timeout: ${img.src}`);
                    this.handleBrokenImage(img);
                }
            }, 5000);
        });
        
        // Show summary after all images are processed
        setTimeout(() => {
            if (brokenImageCount > 0) {
                console.warn(`🖼️ ${brokenImageCount} image(s) failed to load`);
                this.showImageLoadingWarning(brokenImageCount);
            } else {
                console.log('🎉 All images loaded successfully');
            }
        }, 6000);
    }

    handleBrokenImage(img) {
        img.classList.add('broken');
        img.style.opacity = '1';
        img.style.backgroundColor = '#f3f4f6';
        img.style.border = '2px dashed #d1d5db';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.style.color = '#9ca3af';
        img.style.fontSize = '14px';
        img.style.fontWeight = '500';
        img.title = 'Imagen no disponible';
        
        // Add text content for broken images
        if (!img.getAttribute('data-fallback-added')) {
            const fallbackText = document.createElement('span');
            fallbackText.textContent = 'Imagen no disponible';
            fallbackText.style.padding = '20px';
            fallbackText.style.textAlign = 'center';
            
            // Create a wrapper if the image is not already wrapped
            if (img.parentNode.tagName !== 'DIV' || !img.parentNode.classList.contains('img-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'img-wrapper relative';
                wrapper.style.cssText = img.style.cssText;
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'center';
                
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
                wrapper.appendChild(fallbackText);
                
                img.style.display = 'none';
                img.setAttribute('data-fallback-added', 'true');
            }
        }
    }

    showImageLoadingWarning(count) {
        if (window.SITE_CONFIG && window.SITE_CONFIG.isDevelopment) {
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: #f59e0b;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 9999;
                max-width: 300px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;
            warning.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Imágenes no cargan</strong><br>
                        ${count} imagen(es) no se pudieron cargar.<br>
                        <small>Ejecuta desde un servidor HTTP.</small>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>
                </div>
            `;
            document.body.appendChild(warning);
            
            setTimeout(() => {
                if (warning.parentElement) {
                    warning.remove();
                }
            }, 10000);
        }
    }

    showEmailJSWarning() {
        // Only show in development
        if (window.location.protocol === 'file:' || window.location.hostname === 'localhost') {
            console.warn('EmailJS not configured - please check js/emailjs-config.js');
        }
    }
}

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

// ========== VIDEO BACKGROUND HANDLER WITH IMPROVED FALLBACKS ==========
class VideoBackgroundHandler {
    constructor() {
        this.video = document.getElementById('hero-video');
        this.videoLoading = document.getElementById('video-loading');
        this.videoFallback = document.getElementById('video-fallback');
        this.videoLoadTimeout = 10000; // 10 seconds timeout
        this.init();
    }

    init() {
        if (!this.video) {
            this.showFallback();
            return;
        }

        // Do not load video for users who prefer reduced motion or data saving
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const saveData = connection?.saveData === true;
        const slowConnection = connection && /^(2g|slow-2g)$/i.test(connection.effectiveType || '');

        if (prefersReducedMotion || saveData || slowConnection) {
            // Avoid loading the video altogether
            this.showFallback();
            return;
        }

        // Lazy-load the video only when hero enters the viewport
        const sourceEl = document.getElementById('hero-video-source');
        const assignSrcIfNeeded = () => {
            if (sourceEl && sourceEl.dataset.src && !sourceEl.src) {
                sourceEl.src = sourceEl.dataset.src;
                this.video.load();
            }
        };
        const heroSection = document.getElementById('inicio');
        const onceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    assignSrcIfNeeded();
                    this.startLoadLifecycle();
                    onceObserver.disconnect();
                }
            });
        }, { rootMargin: '100px' });
        if (heroSection) {
            onceObserver.observe(heroSection);
        } else {
            // Fallback: assign immediately
            assignSrcIfNeeded();
            this.startLoadLifecycle();
        }

        // Set preload strategy
        if (connection && connection.effectiveType === '4g') {
            this.video.preload = 'auto';
        } else {
            this.video.preload = 'metadata';
        }

        // Show loading indicator initially (it will hide on loadeddata or fallback path)
        this.showLoading();
    }

    startLoadLifecycle() {
        // Set up timeout for video loading
        const loadingTimeout = setTimeout(() => {
            console.warn('Video loading timeout - switching to fallback image');
            this.showFallback();
        }, this.videoLoadTimeout);

        // Handle video loading events
        this.video.addEventListener('loadeddata', () => {
            clearTimeout(loadingTimeout);
            this.hideLoading();
            this.optimizeVideo();
        });

        this.video.addEventListener('error', (e) => {
            clearTimeout(loadingTimeout);
            console.error('Video failed to load:', e);
            this.showFallback();
        });

        // Handle network connectivity issues
        this.video.addEventListener('stalled', () => {
            console.warn('Video stalled - switching to fallback');
            this.showFallback();
        });

    // Autoplay policy handling
    this.video.muted = true;
    }

    showLoading() {
        if (this.videoLoading) {
            this.videoLoading.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.videoLoading) {
            this.videoLoading.style.display = 'none';
        }
    }

    showFallback() {
        this.hideLoading();
        
        if (this.video) {
            this.video.style.opacity = '0';
        }
        
        if (this.videoFallback) {
            this.videoFallback.style.opacity = '1';
        }
    }

    optimizeVideo() {
    // Keep default CSS opacity on all devices; no extra dimming on mobile

        // Pause video when not in viewport to save resources
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.video.play().catch(() => {
                        console.warn('Video autoplay blocked - showing tap-to-play overlay');
                        this.showPlayOverlay();
                    });
                } else {
                    this.video.pause();
                }
            });
        });

        observer.observe(this.video);
    }

    showPlayOverlay() {
        // Ensure video is visible
        if (this.video) {
            this.video.style.opacity = '';
        }
        // Hide loading and fallback if any
        this.hideLoading();
        if (this.videoFallback) {
            this.videoFallback.style.opacity = '0';
        }

        // Avoid duplicating overlay
        if (document.getElementById('video-play-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'video-play-overlay';
        overlay.innerHTML = `
            <button type="button" aria-label="Reproducir video" class="video-play-button">
                <i class="fas fa-play"></i> Ver video
            </button>
        `;
        // Position overlay inside hero section
        const hero = document.getElementById('inicio') || document.body;
        hero.appendChild(overlay);

        const btn = overlay.querySelector('button');
        btn.addEventListener('click', async () => {
            try {
                this.video.muted = true;
                await this.video.play();
                overlay.remove();
            } catch (e) {
                console.warn('Manual play failed, keeping fallback overlay', e);
            }
        });
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
                    
                    // Create loading indicator
                    this.addLoadingIndicator(img);
                    
                    // Test if image can load
                    const testImg = new Image();
                    
                    testImg.onload = () => {
                        this.removeLoadingIndicator(img);
                        img.classList.add('loaded');
                        img.style.opacity = '1';
                        console.log(`✅ Lazy loaded: ${img.src}`);
                    };
                    
                    testImg.onerror = () => {
                        this.removeLoadingIndicator(img);
                        this.handleBrokenImage(img);
                        console.warn(`❌ Failed to lazy load: ${img.src}`);
                    };
                    
                    testImg.src = img.src;
                    
                    imageObserver.unobserve(img);
                }
            });
        }, { 
            rootMargin: '50px',
            threshold: 0.1 
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    addLoadingIndicator(img) {
        const wrapper = img.parentElement;
        if (!wrapper.querySelector('.img-loading')) {
            const loader = document.createElement('div');
            loader.className = 'img-loading';
            wrapper.style.position = 'relative';
            wrapper.appendChild(loader);
        }
    }

    removeLoadingIndicator(img) {
        const wrapper = img.parentElement;
        const loader = wrapper.querySelector('.img-loading');
        if (loader) {
            loader.remove();
        }
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
        // Validate resources first
        new ResourceValidator();
        
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
        
        // Show success notification only in development
        if (window.location.protocol === 'file:' || window.location.hostname === 'localhost') {
            setTimeout(() => {
                console.log('🎉 Website loaded and optimized for Controllers RD');
            }, 1000);
        }
        
    } catch (error) {
        console.error('Error initializing website:', error);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 9999;
            max-width: 300px;
            font-size: 14px;
        `;
        errorDiv.innerHTML = `
            <strong>Error de carga</strong><br>
            Algunos elementos pueden no funcionar correctamente.
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
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