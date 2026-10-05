# Service Worker de MediCore

Documentación del Subproducto No. 3 "Service Worker" — Aplicaciones Web Progresivas, 10° D.

- **Página en la nube (Railway):** https://medicore-producto1-production.up.railway.app/
- **Repositorio del proyecto MediCore:** https://github.com/AlexAP1115web/MediCore
- **Repositorio de esta página (el que despliega Railway):** https://github.com/AlexAP1115web/Medicore-producto1

## ¿Qué es?

Un service worker es un archivo de JavaScript que el navegador ejecuta en segundo plano,
separado de la página. Funciona como un intermediario entre la aplicación y la red: puede
interceptar cada petición y decidir si la responde desde internet o desde una copia guardada
en el cache. Es la pieza que, junto con el `manifest.json`, convierte una página web en una
PWA: permite que cargue más rápido y que siga abriendo sin conexión.

Requisitos: solo funciona en HTTPS (o en `localhost`), no tiene acceso al DOM y trabaja con
promesas (eventos asíncronos).

## Archivos involucrados

| Archivo | Para qué sirve |
|---|---|
| `sw.js` | El service worker (en la raíz para que su alcance sea todo el sitio `/`). |
| `script.js` | Registra el service worker cuando la página termina de cargar. |
| `assets/manifest.json` | Manifest de la PWA (Subproducto 2). |
| `serve.json` | Hace que el servidor envíe `sw.js` con `Cache-Control: no-cache`, para que el navegador detecte rápido una versión nueva. |

## Registro (`script.js`)

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(function (registro) {
        console.log('Service Worker registrado. Alcance:', registro.scope);
      })
      .catch(function (error) {
        console.log('No se pudo registrar el Service Worker:', error);
      });
  });
}
```

Primero se revisa que el navegador soporte service workers. Se registra en el evento `load`
para no competir con la carga inicial de la página.

## Ciclo de vida

1. **install** — abre el cache `medicore-v1` y guarda el *app shell* (la página, CSS, JS,
   manifest, logo, iconos y la miniatura del video). `skipWaiting()` hace que la versión nueva
   se active sin esperar a que se cierren las pestañas.
2. **activate** — borra los caches de versiones anteriores (todo lo que no se llame igual que
   `VERSION`) y con `clients.claim()` toma el control de las pestañas abiertas.
3. **fetch** — intercepta las peticiones y aplica una estrategia según el tipo de recurso.

## Estrategias de cache

| Recurso | Estrategia | Motivo |
|---|---|---|
| La página (navegación) | *Network first*: red y, si falla, la copia guardada de `/` | Siempre se ve la versión más nueva, pero si no hay internet la página igual abre. |
| CSS, JS, imágenes propias | *Cache first* | No cambian seguido; salen del cache al instante. |
| Fuentes de Google y foto de Unsplash | *Stale-while-revalidate* | Se usa lo guardado y se actualiza en segundo plano. |
| Video `.mp4` | No se cachea | Pesa casi 2 MB y el navegador lo pide por partes (peticiones *Range*). |
| Peticiones que no son GET | No se tocan | Solo se cachean lecturas. |

## Cómo comprobarlo

1. Abrir la página en Chrome → F12 → pestaña **Application** → **Service workers**: debe
   aparecer `sw.js` con estado *activated and is running*.
2. En **Application → Cache storage → medicore-v1** se ven los archivos guardados.
3. Marcar **Offline** (en Service workers o en la pestaña Network) y recargar: la página sigue
   cargando.
4. En la consola aparece `Service Worker registrado. Alcance: https://.../`.

## Cómo publicar una versión nueva

Cambiar la constante `VERSION` en `sw.js` (por ejemplo `medicore-v2`), hacer commit y push.
Railway vuelve a desplegar desde GitHub; el navegador detecta el `sw.js` nuevo, lo instala y
en `activate` se borra el cache anterior.
