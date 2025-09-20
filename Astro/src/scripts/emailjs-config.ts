// emailjs-config.ts - Configuración de EmailJS

// EmailJS Configuration
// INSTRUCCIONES PARA CONFIGURAR EMAILJS:
// 1. Ve a https://www.emailjs.com/
// 2. Crea una cuenta gratuita
// 3. Crea un servicio de email (Gmail, Outlook, etc.)
// 4. Crea un template de email
// 5. Obtén tu Public Key, Service ID y Template ID
// 6. Reemplaza los valores de abajo

const EMAILJS_CONFIG = {
  // Tu Public Key de EmailJS (se encuentra en Account -> API Keys)
  publicKey: '', // Deja vacío hasta configurar EmailJS
  
  // Tu Service ID (se encuentra en Email Services)
  serviceID: '', // Deja vacío hasta configurar EmailJS
  
  // Tu Template ID (se encuentra en Email Templates)
  templateID: '', // Deja vacío hasta configurar EmailJS
  
  // Correo donde quieres recibir los mensajes
  toEmail: 'servicios@controllersrd.com',
  
  // Configuración para desarrollo/testing
  isDevelopment: true
};

// Función para inicializar EmailJS
function initializeEmailJS(): boolean {
  if (typeof window.emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey && !EMAILJS_CONFIG.isDevelopment) {
    window.emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS initialized successfully');
    return true;
  } else {
    console.warn('EmailJS not configured or in development mode');
    return false;
  }
}

// Función para validar la configuración
function validateEmailJSConfig(): boolean {
  const requiredKeys = ['publicKey', 'serviceID', 'templateID'];
  const missing = requiredKeys.filter(key => !EMAILJS_CONFIG[key as keyof typeof EMAILJS_CONFIG]);
  
  if (missing.length > 0 && !EMAILJS_CONFIG.isDevelopment) {
    console.warn('EmailJS configuration missing:', missing);
    return false;
  }
  return true;
}

// Función para enviar mensaje de prueba
function sendTestEmail(): Promise<any> {
  if (!validateEmailJSConfig()) {
    return Promise.reject('EmailJS not properly configured');
  }

  const templateParams = {
    from_name: 'Test User',
    from_email: 'test@example.com',
    company: 'Test Company',
    phone: '123-456-7890',
    message: 'This is a test message from the Controllers RD website.',
    to_email: EMAILJS_CONFIG.toEmail
  };

  return window.emailjs.send(
    EMAILJS_CONFIG.serviceID,
    EMAILJS_CONFIG.templateID,
    templateParams
  );
}

// Hacer la configuración disponible globalmente
window.EMAILJS_CONFIG = EMAILJS_CONFIG;

// Inicializar EmailJS cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que EmailJS se cargue
  const checkEmailJS = () => {
    if (typeof window.emailjs !== 'undefined') {
      initializeEmailJS();
      validateEmailJSConfig();
    } else {
      setTimeout(checkEmailJS, 100);
    }
  };
  
  checkEmailJS();
});

export { EMAILJS_CONFIG, initializeEmailJS, validateEmailJSConfig, sendTestEmail };