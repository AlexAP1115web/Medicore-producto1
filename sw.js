// sw.js - Service Worker de MediCore
// Guarda en cache los archivos principales de la pagina para que cargue
// mas rapido y siga abriendo aunque no haya internet.

const VERSION = 'medicore-v1';

// Archivos que se guardan desde que se instala el service worker
// (el "app shell": lo minimo para que la pagina se vea completa)
const ARCHIVOS_APP = [
  '/',
  '/style.css',
  '/script.js',
  '/assets/manifest.json',
  '/assets/favicon.png',
  '/assets/logo-icon.png',
  '/assets/demo-poster.jpg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Servidores externos que usa la pagina (fuentes de Google y la foto de Unsplash)
const EXTERNOS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://images.unsplash.com'
];

// 1. INSTALL: se ejecuta una sola vez cuando el navegador descarga el sw
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(ARCHIVOS_APP))
      .then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE: borra los caches de versiones anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== VERSION)
          .map((nombre) => caches.delete(nombre))
      )
    ).then(() => self.clients.claim())
  );
});

// 3. FETCH: decide de donde sale cada peticion (red o cache)
self.addEventListener('fetch', (event) => {
  const peticion = event.request;

  // Solo se manejan peticiones GET
  if (peticion.method !== 'GET') return;

  const url = new URL(peticion.url);

  // El video pesa casi 2 MB y el navegador lo pide por partes (Range),
  // asi que se deja pasar directo a la red.
  if (url.pathname.endsWith('.mp4')) return;

  // Navegacion (abrir la pagina): primero la red para ver siempre lo mas
  // nuevo; si no hay conexion se muestra la copia guardada de la pagina.
  if (peticion.mode === 'navigate') {
    event.respondWith(
      fetch(peticion)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(VERSION).then((cache) => cache.put('/', copia));
          return respuesta;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Fuentes y foto externa: se responde con lo guardado y se actualiza
  // en segundo plano (stale-while-revalidate)
  if (EXTERNOS.includes(url.origin)) {
    event.respondWith(
      caches.open(VERSION).then((cache) =>
        cache.match(peticion).then((guardada) => {
          const desdeRed = fetch(peticion)
            .then((respuesta) => {
              cache.put(peticion, respuesta.clone());
              return respuesta;
            })
            .catch(() => guardada);
          return guardada || desdeRed;
        })
      )
    );
    return;
  }

  // Resto de archivos propios (css, js, imagenes): primero el cache
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(peticion).then((guardada) => {
        if (guardada) return guardada;
        return fetch(peticion).then((respuesta) => {
          if (respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(VERSION).then((cache) => cache.put(peticion, copia));
          }
          return respuesta;
        });
      })
    );
  }
});
