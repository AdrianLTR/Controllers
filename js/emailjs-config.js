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
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey && !EMAILJS_CONFIG.isDevelopment) {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized successfully');
        return true;
    } else {
        console.warn('EmailJS not configured or in development mode');
        return false;
    }
}

// Función para validar la configuración
function validateEmailJSConfig() {
    const requiredKeys = ['publicKey', 'serviceID', 'templateID'];
    const missing = requiredKeys.filter(key => !EMAILJS_CONFIG[key]);
    
    if (missing.length > 0 && !EMAILJS_CONFIG.isDevelopment) {
        console.warn('EmailJS configuration missing:', missing);
        return false;
    }
    return true;
}

// Template de ejemplo para EmailJS:
/*
Template Name: contact_form
Template Subject: Nuevo mensaje de contacto - {{from_name}}
Template Content:
Hola,

Has recibido un nuevo mensaje desde el formulario de contacto de Controllers RD:

Nombre: {{from_name}}
Email: {{from_email}}
Mensaje: {{message}}

Fecha: {{reply_to}}

Saludos,
Sistema de Controllers RD
*/
