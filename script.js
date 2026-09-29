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
