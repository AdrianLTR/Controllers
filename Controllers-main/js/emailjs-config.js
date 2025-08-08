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
    publicKey: 'TU_PUBLIC_KEY_AQUI',
    
    // Tu Service ID (se encuentra en Email Services)
    serviceID: 'TU_SERVICE_ID_AQUI',
    
    // Tu Template ID (se encuentra en Email Templates)
    templateID: 'TU_TEMPLATE_ID_AQUI',
    
    // Correo donde quieres recibir los mensajes
    toEmail: 'servicios@controllersrd.com'
};

// Función para inicializar EmailJS
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized successfully');
        return true;
    } else {
        console.error('EmailJS library not loaded');
        return false;
    }
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
