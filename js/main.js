import './bg-animation.js';
import './mods.js';

Dropdown.init((orderType) => {
  filtrados = Sort.sort(filtrados, orderType);
  paginaActual = 1;
  mostrarMods();
});

// Filtros adicionales
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('bg-blue-300');
    btn.classList.toggle('text-black');
  });
});
