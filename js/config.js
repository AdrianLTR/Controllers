// Configuración del sitio web
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

// Log de configuración en desarrollo
if (SITE_CONFIG.isDevelopment && SITE_CONFIG.debug.enableConsoleLogging) {
    console.log('🔧 Site configuration loaded:', SITE_CONFIG);
}
