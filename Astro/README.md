# Controllers RD - Sitio Web Corporativo

Este es el sitio web corporativo de Controllers RD, una empresa especializada en el suministro de personal temporal y contratación especializada en República Dominicana.

## 🚀 Características

- **Framework**: Astro 5.x con renderizado estático (SSG)
- **Estilos**: Tailwind CSS 4.x para diseño responsivo
- **TypeScript**: Tipado estático para mejor desarrollo
- **Optimización**: Imágenes WebP, lazy loading, y minificación automática
- **SEO**: Meta tags optimizados y estructura semántica
- **Contacto**: Integración con EmailJS para formularios
- **Rendimiento**: Lighthouse score 95+ en todas las métricas

## 📁 Estructura del Proyecto

```
/
├── public/
│   ├── images/         # Imágenes optimizadas (WebP + fallbacks)
│   ├── videos/         # Videos de fondo
│   └── favicon.ico
├── src/
│   ├── components/     # Componentes Astro reutilizables
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Services.astro
│   │   ├── Values.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro # Layout principal
│   ├── pages/
│   │   └── index.astro # Página principal
│   ├── scripts/        # Scripts TypeScript
│   │   ├── main.ts
│   │   └── emailjs-config.ts
│   └── styles/
│       └── global.css  # Estilos globales + Tailwind
├── astro.config.mjs    # Configuración de Astro
├── tailwind.config.mjs # Configuración de Tailwind
└── tsconfig.json       # Configuración de TypeScript
```

## 🛠️ Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
```

### Comandos disponibles

| Comando           | Acción                                      |
|:------------------|:--------------------------------------------|
| `npm run dev`     | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build`   | Construye el sitio para producción en `./dist/` |
| `npm run preview` | Vista previa del build de producción localmente |

### Servidor de desarrollo

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:4321`

## 📧 Configuración de EmailJS

Para habilitar el formulario de contacto:

1. Ve a [EmailJS](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Configura un servicio de email
4. Crea un template de email
5. Edita `src/scripts/emailjs-config.ts`:

```typescript
const EMAILJS_CONFIG = {
  publicKey: 'tu_public_key',     // Desde Account -> API Keys
  serviceID: 'tu_service_id',     // Desde Email Services  
  templateID: 'tu_template_id',   // Desde Email Templates
  toEmail: 'servicios@controllersrd.com',
  isDevelopment: false            // Cambiar a false en producción
};
```

## 🎨 Personalización

### Colores y tipografías

Edita `tailwind.config.mjs` para personalizar:

- Colores de marca
- Fuentes personalizadas
- Animaciones
- Breakpoints responsivos

### Contenido

- **Imágenes**: Coloca en `public/images/` (preferir formato WebP)
- **Videos**: Coloca en `public/videos/`
- **Textos**: Edita directamente en los componentes `.astro`

## 🚀 Despliegue

### Build para producción

```bash
npm run build
```

El sitio compilado estará en `./dist/`

### Opciones de hosting

Este es un sitio estático que puede desplegarse en:

- **Netlify** (recomendado)
- **Vercel** 
- **GitHub Pages**
- **AWS S3 + CloudFront**
- Cualquier servidor web estático

### Variables de entorno

Para producción, configura:

- Credenciales de EmailJS
- URLs de análitics (si aplica)
- Configuración de CDN

## 📊 Rendimiento

- **Lighthouse Score**: 95+ en todas las métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## �️ SEO

- Meta tags optimizados
- Open Graph y Twitter Cards
- Schema.org markup
- Sitemap automático
- URLs semánticas
- Imágenes con alt text descriptivo

## 🔧 Tecnologías utilizadas

- [Astro](https://astro.build/) - Framework web estático
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitario
- [TypeScript](https://www.typescriptlang.org/) - JavaScript tipado
- [EmailJS](https://www.emailjs.com/) - Servicio de email
- [Sharp](https://sharp.pixelplumbing.com/) - Optimización de imágenes

## 📞 Contacto

**Controllers RD**
- Email: servicios@controllersrd.com
- WhatsApp: +1 (849) 517-0202
- Teléfono: (849) 517-0202

---

© 2025 Controllers RD. Todos los derechos reservados.
