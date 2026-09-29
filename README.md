# MediCore — Producto 1 (individual)

Página sencilla, responsiva, hecha con HTML + CSS + un poco de JS, para la materia
**Aplicaciones Web Progresivas** (10° D, docente Mather Xóchitl Mendoza Píscil).

## Archivos

- `index.html` — estructura de la página (encabezado, cuerpo, pie de página).
- `style.css` — hoja de estilos (máximo 3 colores: verde `#1E7D3C`, tinta `#12283F`, coral `#FF6B4A`, sobre fondos claros).
- `script.js` — abre/cierra el menú de navegación en móvil.
- `package.json` — solo para poder desplegar en Railway (sirve los archivos estáticos).
- `assets/demo-medicore.mp4` y `assets/demo-poster.jpg` — grabación real de pantalla del sistema MediCore (sin audio) y su miniatura.

## Cómo publicarlo en Railway

1. Crea un repositorio en GitHub y sube estos archivos (`index.html`, `style.css`, `script.js`, `package.json`, este `README.md`).
2. En Railway: **New Project → Deploy from GitHub repo** y elige ese repositorio.
3. Railway detecta el `package.json` (Nixpacks/Node), instala `serve` y ejecuta `npm start`, que sirve la página en el puerto que Railway asigna.
4. Cuando termine el deploy, entra a **Settings → Networking → Generate Domain** para obtener la URL pública (algo como `tuproyecto.up.railway.app`).
5. Copia esa URL: es la que entregas para revisión el miércoles.

No hace falta configurar nada más (no hay base de datos ni backend); es un sitio estático.

## Notas de contenido

- El video es una grabación real de pantalla del sistema MediCore corriendo en local (dashboard, expedientes, verificación en dos pasos, catálogo de enfermedades), sin audio.
- La imagen del hero viene de Unsplash (uso libre).
