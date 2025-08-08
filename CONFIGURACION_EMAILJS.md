# Configuración de EmailJS para Controllers RD

## ¿Qué es EmailJS?
EmailJS es un servicio que permite enviar emails directamente desde JavaScript sin necesidad de un servidor backend.

## Pasos para configurar EmailJS:

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate con tu email o utiliza Gmail/GitHub
3. Confirma tu email

### 2. Configurar un servicio de email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail recomendado)
4. Configura los datos de tu cuenta de email
5. Guarda el **Service ID** que se genera

### 3. Crear un template de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa esta plantilla:

```
Asunto: Nuevo mensaje desde Controllers RD

Contenido:
Nombre: {{from_name}}
Email: {{from_email}}
Empresa: {{company}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde el formulario de contacto de Controllers RD.
```

4. Guarda el **Template ID**

### 4. Obtener tu Public Key
1. Ve a "Account" → "General"
2. Copia tu **Public Key**

### 5. Configurar el archivo emailjs-config.js
Abre el archivo `js/emailjs-config.js` y reemplaza:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'TU_PUBLIC_KEY_AQUI',        // Pega tu Public Key aquí
    serviceID: 'TU_SERVICE_ID_AQUI',        // Pega tu Service ID aquí  
    templateID: 'TU_TEMPLATE_ID_AQUI',      // Pega tu Template ID aquí
    toEmail: 'servicios@controllersrd.com', // Email donde recibirás los mensajes
    isDevelopment: false                     // Cambia a false cuando esté configurado
};
```

### 6. Probar la configuración
1. Abre el sitio web
2. Ve a la sección de contacto
3. Completa el formulario y envía un mensaje de prueba
4. Verifica que llegue a tu email

## Ejemplo de configuración completa:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'user_abc123def456',
    serviceID: 'service_xyz789',
    templateID: 'template_123abc',
    toEmail: 'servicios@controllersrd.com',
    isDevelopment: false
};
```

## Solución de problemas:

### El formulario no envía emails:
- Verifica que todos los IDs estén correctos
- Revisa la consola del navegador para errores
- Asegúrate de que EmailJS esté cargado correctamente

### Los emails no llegan:
- Verifica la carpeta de spam
- Revisa la configuración del servicio de email en EmailJS
- Confirma que el template esté activo

### Errores de configuración:
- Si ves errores en la consola, verifica que:
  - El Public Key sea correcto
  - El Service ID y Template ID existan
  - No haya espacios extra en los valores

## Contacto de soporte:
Si tienes problemas con la configuración, contacta al desarrollador del sitio web.
