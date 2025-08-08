# 🖼️ Solución para Imágenes que No Cargan

## ❌ Problema Identificado
Las imágenes no se están viendo porque estás abriendo el archivo HTML directamente desde el explorador de archivos (protocolo `file://`). Los navegadores modernos bloquean el acceso a archivos locales por seguridad.

## ✅ Soluciones

### Opción 1: Servidor HTTP Local (Recomendada)

1. **Usar el archivo batch incluido:**
   - Haz doble clic en `iniciar-servidor.bat`
   - Se abrirá una ventana de comandos
   - Abre tu navegador y ve a: `http://localhost:8000`

2. **Si no tienes Python instalado:**
   - Descarga Python desde [python.org](https://python.org)
   - Durante la instalación, marca "Add Python to PATH"
   - Reinicia tu computadora
   - Ejecuta `iniciar-servidor.bat`

### Opción 2: Live Server en VS Code

1. **Instala la extensión Live Server:**
   - Abre VS Code
   - Ve a Extensiones (Ctrl+Shift+X)
   - Busca "Live Server" por Ritwick Dey
   - Instala la extensión

2. **Usar Live Server:**
   - Abre la carpeta del proyecto en VS Code
   - Haz clic derecho en `index.html`
   - Selecciona "Open with Live Server"

### Opción 3: Otros Servidores HTTP

1. **Node.js con http-server:**
   ```bash
   npm install -g http-server
   cd "ruta/a/tu/proyecto"
   http-server -p 8000
   ```

2. **PHP (si lo tienes instalado):**
   ```bash
   cd "ruta/a/tu/proyecto"
   php -S localhost:8000
   ```

## 🔍 Verificar que Funciona

1. Abre `diagnostico-imagenes.html` desde el servidor HTTP
2. Deberías ver todas las imágenes con estado "✅ Cargada"
3. Si ves errores, verifica que los archivos de imagen existen

## 📁 Estructura de Archivos Correcta

```
Controllers-main/
├── index.html
├── diagnostico-imagenes.html
├── iniciar-servidor.bat
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── config.js
│   └── emailjs-config.js
└── images/
    ├── Logo.png
    ├── personas-en-equipos-de-seguridad-en-su-lugar-de-trabajo.jpg
    ├── entrevista-de-trabajo-y-seleccion-de-candidatos-para-el-empleo.jpg
    ├── gente-trabajo-estetoscopio-pensativo.jpg
    ├── hombre-sonriente-de-tiro-medio-con-casco.jpg
    └── de-cerca-las-personas-que-trabajan-desde-casa.jpg
```

## ⚠️ Problemas Comunes

### Error: "Python no encontrado"
- Instala Python desde python.org
- Asegúrate de marcar "Add to PATH" durante la instalación

### Error: "Puerto 8000 en uso"
- Cierra otras aplicaciones que usen el puerto 8000
- O cambia el puerto en `iniciar-servidor.bat`: `python -m http.server 8080`

### Las imágenes siguen sin cargar
1. Verifica que las imágenes están en la carpeta `images/`
2. Confirma que los nombres de archivo coinciden exactamente
3. Usa `diagnostico-imagenes.html` para identificar problemas específicos

## 📞 Necesitas Ayuda?

Si sigues teniendo problemas:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network" 
3. Recarga la página
4. Busca errores en rojo (404, CORS, etc.)

¡Una vez que uses un servidor HTTP, todas las imágenes deberían cargar perfectamente! 🚀
