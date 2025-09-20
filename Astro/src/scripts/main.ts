// main.ts - Script principal para funcionalidades del sitio

// Configuración del sitio
declare global {
  interface Window {
    SITE_CONFIG: any;
    EMAILJS_CONFIG: any;
    emailjs: any;
  }
}

const SITE_CONFIG = {
  // Configuración del entorno
  isDevelopment: window.location.protocol === 'file:' || window.location.hostname === 'localhost',
  
  // Configuración de recursos
  resources: {
    // URLs de respaldo para el video
    videoSources: [
      'https://cdn.pixabay.com/video/2025/04/23/273922_large.mp4',
      // Fuentes de respaldo se pueden agregar aquí
    ],
    
    // Configuración de imágenes
    images: {
      placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhZiI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+',
      lazyLoadOffset: '50px'
    }
  },
  
  // Configuración de performance
  performance: {
    videoLoadTimeout: 10000, // 10 segundos
    imageLoadTimeout: 5000,  // 5 segundos
    enableLazyLoading: true,
    enableResourceValidation: true
  },
  
  // Configuración de animaciones
  animations: {
    respectReducedMotion: true,
    defaultDuration: 300,
    enableScrollAnimations: true
  },
  
  // Configuración de contacto
  contact: {
    fallbackEmail: 'servicios@controllersrd.com',
    whatsappNumber: '18495170202',
    phone: '8495170202'
  },
  
  // Configuración de debug
  debug: {
    enableConsoleLogging: true,
    showResourceStatus: true,
    showPerformanceMetrics: false
  }
};

// Hacer la configuración disponible globalmente
window.SITE_CONFIG = SITE_CONFIG;

// Validador de recursos
class ResourceValidator {
  private criticalResources = [
    { type: 'font', name: 'Poppins' },
    { type: 'font', name: 'Cinzel' }
  ];

  constructor() {
    this.init();
  }

  private init(): void {
    this.validateResources();
    this.checkEmailJSStatus();
    this.validateImages();
  }

  private validateResources(): void {
    this.validateFonts();
  }

  private async validateFonts(): Promise<void> {
    try {
      await document.fonts.load('16px Poppins');
      await document.fonts.load('16px Cinzel');
      console.log('Fonts loaded successfully');
    } catch (error) {
      console.warn('Some fonts failed to load:', error);
    }
  }

  private checkEmailJSStatus(): void {
    if (typeof window.emailjs === 'undefined') {
      console.warn('EmailJS not loaded - contact form will show error messages');
    } else if (typeof window.EMAILJS_CONFIG !== 'undefined' && window.EMAILJS_CONFIG.isDevelopment) {
      console.info('EmailJS in development mode');
    }
  }

  private validateImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;
      const src = imageElement.getAttribute('data-src');
      if (src) {
        const testImage = new Image();
        testImage.onload = () => {
          imageElement.src = src;
          imageElement.removeAttribute('data-src');
        };
        testImage.onerror = () => {
          console.warn('Failed to load image:', src);
          imageElement.src = SITE_CONFIG.resources.images.placeholder;
        };
        testImage.src = src;
      }
    });
  }
}

// Manejador de animaciones en scroll
class ScrollAnimations {
  private elements: NodeListOf<Element>;
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.elements = document.querySelectorAll('.animate-on-scroll');
    this.init();
  }

  private init(): void {
    if (!SITE_CONFIG.animations.enableScrollAnimations) return;

    // Respetar preferencias de movimiento reducido
    if (SITE_CONFIG.animations.respectReducedMotion && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.elements.forEach(el => el.classList.add('animate'));
      return;
    }

    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, options);

    this.elements.forEach(el => {
      this.observer?.observe(el);
    });
  }
}

// Lazy loading de imágenes
class LazyImageLoader {
  private images: NodeListOf<HTMLImageElement>;
  private imageObserver: IntersectionObserver | null = null;

  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  private init(): void {
    if (!SITE_CONFIG.performance.enableLazyLoading) {
      this.loadAllImages();
      return;
    }

    this.setupImageObserver();
  }

  private setupImageObserver(): void {
    const options = {
      rootMargin: SITE_CONFIG.resources.images.lazyLoadOffset
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target as HTMLImageElement);
          this.imageObserver?.unobserve(entry.target);
        }
      });
    }, options);

    this.images.forEach(img => {
      this.imageObserver?.observe(img);
    });
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  }

  private loadAllImages(): void {
    this.images.forEach(img => {
      this.loadImage(img);
    });
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar validador de recursos
  new ResourceValidator();
  
  // Inicializar animaciones en scroll
  new ScrollAnimations();
  
  // Inicializar lazy loading
  new LazyImageLoader();

  // Log de configuración en desarrollo
  if (SITE_CONFIG.isDevelopment && SITE_CONFIG.debug.enableConsoleLogging) {
    console.log('🔧 Site configuration loaded:', SITE_CONFIG);
  }
});

export { SITE_CONFIG };