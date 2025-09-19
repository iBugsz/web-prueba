const apiData = document.getElementById('apiData');
const searchInput = document.getElementById('searchInput');

let modsData = [];
let filtrados = [];
let paginaActual = 1;
const modsPorPagina = 8;

import { cargarModsAPI } from './api.js';
import { renderPaginacion } from './pagination.js';

async function cargarMods() {
  const result = await cargarModsAPI();
  if (result.error) {
    apiData.innerHTML = `<p>Error al cargar la API: ${result.error}</p>`;
    return;
  }
  modsData = result;
  filtrados = modsData;
  paginaActual = 1;
  sortByDownloads(); // mantener el orden inicial
}

function mostrarMods() {
  apiData.innerHTML = '';

  if (!filtrados.length) {
    apiData.innerHTML = '<p>No se encontraron mods.</p>';
    return;
  }

  const inicio = (paginaActual - 1) * modsPorPagina;
  const fin = inicio + modsPorPagina;
  const paginaMods = filtrados.slice(inicio, fin);

  paginaMods.forEach((mod) => {
    const nameWithoutExt = mod.name?.includes('.')
      ? mod.name.substring(0, mod.name.lastIndexOf('.'))
      : mod.name || 'Desconocido';

    const modCard = document.createElement('div');
    modCard.className =
      'flex items-center gap-4 bg-[#222] rounded-lg p-4 transition-colors duration-200';

    // Imagen
    const imgBox = document.createElement('div');
    imgBox.className =
      'w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden';

    const loader = document.createElement('img');
    loader.src = 'https://i.gifer.com/XOsX.gif';
    loader.className = 'w-12 h-12';
    imgBox.appendChild(loader);

    if (mod.icon) {
      const img = document.createElement('img');
      img.src = mod.icon;
      img.alt = nameWithoutExt;
      img.className =
        'w-full h-full object-cover rounded-md transition-transform duration-200 ease-in-out hidden';
      img.onload = () => {
        loader.remove();
        img.classList.remove('hidden');
      };
      img.onerror = () => img.remove();
      imgBox.appendChild(img);
    }

    modCard.appendChild(imgBox);

    // Info básica
    const infoBasic = document.createElement('div');
    infoBasic.className = 'flex-1 space-y-1';

    const title = document.createElement('h4');
    title.textContent = nameWithoutExt;
    title.className =
      'text-lg font-bold text-white transition-colors duration-200 cursor-pointer';

    const author = document.createElement('p');
    author.textContent = `${mod.author || 'Desconocido'}`;
    author.className = 'text-sm text-yellow-400';

    const desc = document.createElement('p');
    desc.textContent = mod.description || 'No hay descripción';
    desc.className = 'text-sm text-gray-300';

    infoBasic.appendChild(title);
    infoBasic.appendChild(author);
    infoBasic.appendChild(desc);

    modCard.appendChild(infoBasic);

    // Stats
    if (
      mod.total_downloads !== undefined ||
      mod.latest_version ||
      mod.created
    ) {
      const stats = document.createElement('div');
      stats.className =
        'space-y-1 text-sm ml-auto text-right flex flex-col gap-1';

      if (mod.latest_version) {
        const version = document.createElement('p');
        version.innerHTML = `<i class="fa-solid fa-code-branch text-purple-400 mr-1.5"></i> <span class="text-white">${mod.latest_version}</span>`;
        stats.appendChild(version);
      }

      function formatNumber(num) {
        if (num >= 1_000_000)
          return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (num >= 1_000)
          return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        return num.toString();
      }

      if (mod.total_downloads !== undefined) {
        const downloads = document.createElement('p');
        downloads.innerHTML = `<i class="fa-solid fa-download text-purple-400 mr-1.5"></i> <span class="text-white">${formatNumber(
          mod.total_downloads,
        )}</span>`;
        stats.appendChild(downloads);
      }

      if (mod.last_update) {
        const createdDate = new Date(mod.last_update);
        const now = new Date();
        const diffTime = now - createdDate;

        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

        let number = 0;
        let timeText = '';

        if (diffYears > 0) {
          number = diffYears;
          timeText = `año${diffYears > 1 ? 's' : ''}`;
        } else if (diffMonths > 0) {
          number = diffMonths;
          timeText = `mes${diffMonths > 1 ? 'es' : ''}`;
        } else if (diffDays > 0) {
          number = diffDays;
          timeText = `día${diffDays > 1 ? 's' : ''}`;
        } else {
          number = diffHours;
          timeText = `hora${diffHours > 1 ? 's' : ''}`;
        }

        const created = document.createElement('p');
        created.innerHTML = `<i class="fa-solid fa-clock text-purple-400 mr-1.5"></i> <span class="text-white">Hace ${number}</span> ${timeText}`;
        stats.appendChild(created);
      }

      modCard.appendChild(stats);
    }

    apiData.appendChild(modCard);

    [imgBox, title].forEach((el) => {
      el.addEventListener('mouseenter', () => {
        imgBox.style.transform = 'scale(1.2)';
        imgBox.style.transition = 'transform 0.3s ease';
        title.style.color = '#1de9b6';
        modCard.style.backgroundColor = '#2d2d3d';
      });
      el.addEventListener('mouseleave', () => {
        imgBox.style.transform = 'scale(1)';
        title.style.color = 'white';
        title.style.textDecoration = 'none';
        modCard.style.backgroundColor = '#222';
      });
    });

    title.addEventListener('click', () => {
      const modName = encodeURIComponent(mod.name);
      window.open(`mod-detail.html?mod=${modName}`, '_self');
    });

    imgBox.addEventListener('click', () => {
      const modName = encodeURIComponent(mod.name);
      window.open(`mod-detail.html?mod=${modName}`, '_self');
    });
  });

  renderPaginacionWrapper();
}

import { filtrarMods } from './search.js';

searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  filtrados = filtrarMods(modsData, query);
  paginaActual = 1;
  mostrarMods();
});
function renderPaginacionWrapper() {
  renderPaginacion({
    container: apiData,
    filtrados,
    paginaActual,
    modsPorPagina,
    onPageChange: (newPage) => {
      paginaActual = newPage;
      mostrarMods();
    },
  });
}

document.addEventListener('DOMContentLoaded', cargarMods);

// Dropdown
const button = document.getElementById('orderButton');
const dropdown = document.getElementById('orderDropdown');
const selected = document.getElementById('selectedOrder');
const items = dropdown.querySelectorAll('.dropdown-item');

// Toggle
button.addEventListener('click', () => {
  if (dropdown.classList.contains('hidden')) {
    dropdown.classList.remove('hidden');
    setTimeout(() => {
      dropdown.classList.remove('scale-95', 'opacity-0');
      dropdown.classList.add('scale-100', 'opacity-100');
    }, 10);
  } else {
    cerrarDropdown();
  }
});

// Selección con ID
items.forEach((item) => {
  item.addEventListener('click', () => {
    const orderType = item.id; // <-- usamos el id directamente
    // <-- usamos ID
    const label = item.querySelector('span').textContent;

    selected.textContent = label;
    document.getElementById('selectedOrderHeader').textContent = label;

    switch (orderType) {
      case 'downloads':
        sortByDownloads();
        break;
      case 'updated':
        sortByUpdated();
        break;
      case 'oldest':
        sortByOldest();
        break;
      case 'az':
        sortByNameAZ();
        break;
      case 'za':
        sortByNameZA();
        break;
    }

    cerrarDropdown();
  });
});

document.addEventListener('click', (e) => {
  if (!button.contains(e.target) && !dropdown.contains(e.target)) {
    cerrarDropdown();
  }
});

function cerrarDropdown() {
  dropdown.classList.remove('scale-100', 'opacity-100');
  dropdown.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    dropdown.classList.add('hidden');
  }, 200);
}

// Ordenar funciones
function sortByNameAZ() {
  filtrados.sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' }),
  );
  paginaActual = 1;
  mostrarMods();
}

function sortByNameZA() {
  filtrados.sort((a, b) =>
    (b.name || '').localeCompare(a.name || '', 'es', { sensitivity: 'base' }),
  );
  paginaActual = 1;
  mostrarMods();
}

function sortByOldest() {
  filtrados.sort(
    (a, b) => new Date(a.last_update || 0) - new Date(b.last_update || 0),
  );
  paginaActual = 1;
  mostrarMods();
}

function sortByDownloads() {
  filtrados.sort((a, b) => (b.total_downloads || 0) - (a.total_downloads || 0));
  paginaActual = 1;
  mostrarMods();
}

// nuevo: actualizado recientemente
function sortByUpdated() {
  filtrados.sort(
    (a, b) => new Date(b.last_update || 0) - new Date(a.last_update || 0),
  );
  paginaActual = 1;
  mostrarMods();
}

// filtros
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('bg-blue-300');
    btn.classList.toggle('text-black');
  });
});
