# 📧 Configuración del Sistema de Correo - Controllers RD

## 🚀 Configuración de EmailJS

Para que el formulario de contacto funcione y envíe correos reales, sigue estos pasos:

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Confirma tu email

### 2. Configurar Servicio de Email
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor (Gmail, Outlook, etc.)
4. Configura con tu email: `servicios@controllersrd.com`
5. Guarda el **Service ID** (ejemplo: `service_1234567`)

### 3. Crear Template de Email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa este template:

```
Template ID: contact_form
Subject: Nuevo mensaje de contacto - {{from_name}}

Content:
Hola,

Has recibido un nuevo mensaje desde el formulario de contacto de Controllers RD:

👤 Nombre: {{from_name}}
📧 Email: {{from_email}}
📝 Mensaje: {{message}}

Fecha: {{reply_to}}

---
Sistema automatizado de Controllers RD
```

4. Guarda el **Template ID** (ejemplo: `template_1234567`)

### 4. Obtener Public Key
1. Ve a **"Account"** -> **"General"**
2. Copia tu **Public Key** (ejemplo: `abcd1234567890`)

### 5. Configurar en el código
Edita el archivo `js/emailjs-config.js`:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'tu_public_key_aqui',     // Reemplaza aquí
    serviceID: 'tu_service_id_aqui',     // Reemplaza aquí  
    templateID: 'tu_template_id_aqui',   // Reemplaza aquí
    toEmail: 'servicios@controllersrd.com'
};
```

### 6. Probar el formulario
1. Abre `index.html` en tu navegador
2. Llena el formulario de contacto
3. Envía un mensaje de prueba
4. Verifica que llegue a `servicios@controllersrd.com`

## 🎯 Destino de los mensajes

**Todos los mensajes del formulario serán enviados a:** `servicios@controllersrd.com`

## 📱 Características del sistema

✅ **Validación de campos** - Verifica que todos los campos estén llenos
✅ **Validación de email** - Verifica formato correcto del email
✅ **Estado de carga** - Muestra "Enviando..." mientras se procesa
✅ **Notificaciones** - Confirma éxito o muestra errores
✅ **Responsive** - Funciona en móviles y desktop

## 🆓 Plan gratuito de EmailJS

El plan gratuito incluye:
- 200 emails por mes
- Perfecto para una web corporativa
- Sin límite de tiempo

## 🔧 Resolución de problemas

**Error: "EmailJS no está disponible"**
- Verifica que tengas internet
- Revisa que el archivo se cargue correctamente

**Los correos no llegan:**
- Verifica las configuraciones en `emailjs-config.js`
- Revisa la carpeta de spam
- Confirma que el servicio esté activo en EmailJS

**Error 403 o 401:**
- Verifica que el Public Key sea correcto
- Asegúrate de que el servicio esté configurado

## 📞 Soporte

Para problemas técnicos, contacta al desarrollador o revisa la documentación de EmailJS.
