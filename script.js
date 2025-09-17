const apiData = document.getElementById('apiData');
const searchInput = document.getElementById('searchInput');

let modsData = []; // Todos los mods cargados
let filtrados = []; // Mods después de búsqueda
let paginaActual = 1; // Página en la que estamos
const modsPorPagina = 8; // Máximo 8 mods por página

function cargarMods() {
  fetch(
    'https://raw.githubusercontent.com/samp-comunity/plujin-manager/main/assets/scripts.json',
  )
    .then((res) => {
      if (!res.ok) throw new Error('No se pudo cargar el JSON');
      return res.json();
    })
    .then((data) => {
      modsData = data.mods || [];
      filtrados = modsData; // Al inicio se muestran todos
      paginaActual = 1;
      mostrarMods();
    })
    .catch((err) => {
      console.error('Error al cargar la API:', err);
      apiData.innerHTML = '<p>Error al cargar la API: ' + err + '</p>';
    });
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
      'flex items-center gap-4 bg-[#222] rounded-lg p-4 hover:bg-[#2d2d3d] transition';

    const imgBox = document.createElement('div');
    imgBox.className = 'w-24 h-24 flex-shrink-0';

    if (mod.icon) {
      const img = document.createElement('img');
      img.src = mod.icon;
      img.alt = nameWithoutExt;
      img.className = 'w-full h-full object-cover rounded-md';
      img.onerror = () => {
        img.src = 'assets/default-icon.png'; // fallback si no carga
      };
      imgBox.appendChild(img);
    }

    const info = document.createElement('div');
    info.className = 'flex-1 space-y-1';

    const title = document.createElement('h4');
    title.textContent = nameWithoutExt;
    title.className = 'text-lg font-bold text-white';

    const author = document.createElement('p');
    author.textContent = `Autor: ${mod.author || 'Desconocido'}`;
    author.className = 'text-sm text-gray-400';

    const desc = document.createElement('p');
    desc.textContent = mod.description || 'No hay descripción';
    desc.className = 'text-sm text-gray-300';

    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(desc);

    modCard.appendChild(imgBox);
    modCard.appendChild(info);

    apiData.appendChild(modCard);
  });

  renderPaginacion();
}

function renderPaginacion() {
  const oldPagination = document.querySelector('.pagination');
  if (oldPagination) oldPagination.remove();

  const totalPaginas = Math.ceil(filtrados.length / modsPorPagina);
  if (totalPaginas <= 1) return;

  const inicio = (paginaActual - 1) * modsPorPagina + 1;
  const fin = Math.min(paginaActual * modsPorPagina, filtrados.length);

  const pagination = document.createElement('div');
  pagination.className =
    'pagination flex justify-between items-center my-3 bg-[#111] text-gray-300 px-4 py-2 rounded-md text-sm';

  const info = document.createElement('span');
  info.textContent = `Mostrando ${fin} de ${filtrados.length} mods`;

  const controls = document.createElement('div');
  controls.className = 'flex items-center gap-2';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '◀';
  prevBtn.disabled = paginaActual === 1;
  prevBtn.className =
    'px-2 py-1 rounded-md ' +
    (paginaActual === 1
      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
      : 'bg-[#222] hover:bg-gray-600 text-white');
  prevBtn.addEventListener('click', () => {
    if (paginaActual > 1) {
      paginaActual--;
      mostrarMods();
    }
  });

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '▶';
  nextBtn.disabled = paginaActual === totalPaginas;
  nextBtn.className =
    'px-2 py-1 rounded-md ' +
    (paginaActual === totalPaginas
      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
      : 'bg-[#222] hover:bg-gray-600 text-white');
  nextBtn.addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      mostrarMods();
    }
  });

  controls.appendChild(prevBtn);
  controls.appendChild(pageInfo);
  controls.appendChild(nextBtn);

  pagination.appendChild(info);
  pagination.appendChild(controls);

  // 🔹 Insertar la paginación directamente después de apiData
  apiData.insertAdjacentElement('beforebegin', pagination);
}

// Ejecutar apenas cargue la página
document.addEventListener('DOMContentLoaded', cargarMods);
