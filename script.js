// Menú móvil (hamburguesa) — muestra/oculta la navegación en pantallas chicas
document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mnav');
  if (!burger || !menu) return;

  burger.addEventListener('click', function () {
    menu.hidden = !menu.hidden;
  });

  // Cierra el menú móvil al elegir una sección
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.hidden = true;
    });
  });
});

// Registro del Service Worker (sw.js)
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
