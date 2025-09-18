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

// 🔹 Función de búsqueda
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();

  filtrados = modsData.filter((mod) => {
    const name = mod.name?.toLowerCase() || '';
    const author = mod.author?.toLowerCase() || '';
    const desc = mod.description?.toLowerCase() || '';
    return (
      name.includes(query) || author.includes(query) || desc.includes(query)
    );
  });

  paginaActual = 1; // resetear página al buscar
  mostrarMods();
});

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
    // ↑ cambiamos items-start → items-center para centrar verticalmente

    // 1️⃣ Bloque Logo
    const imgBox = document.createElement('div');
    imgBox.className =
      'w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden';
    // ↑ overflow-hidden para que las imágenes no se salgan

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

    // ------------------------------
    // 2️⃣ Bloque Info Básica
    // ------------------------------
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

    // ------------------------------
    // 3️⃣ Bloque Info Adicional / Stats
    // ------------------------------
    // Solo crear el contenedor si hay algo que mostrar
    if (
      mod.total_downloads !== undefined ||
      mod.latest_version ||
      mod.created
    ) {
      const stats = document.createElement('div');
      stats.className =
        'space-y-1 text-sm ml-auto text-right flex flex-col gap-1';

      // Versión
      if (mod.latest_version) {
        const version = document.createElement('p');
        version.innerHTML = `<i class="fa-solid fa-code-branch text-purple-500"></i> <span class="text-white">${mod.latest_version}</span>`;
        stats.appendChild(version);
      }

      // Descargas
      if (mod.total_downloads !== undefined) {
        const downloads = document.createElement('p');
        downloads.innerHTML = `<i class="fa-solid fa-download text-purple-500"></i> <span class="text-white">${mod.total_downloads}</span>`;
        stats.appendChild(downloads);
      }

      // Fecha relativa
      if (mod.created) {
        const createdDate = new Date(mod.created);
        const now = new Date();
        const diffTime = now - createdDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

        let timeText = '';
        let number = 0;
        if (diffDays > 0) {
          number = diffDays;
          timeText = `día${diffDays > 1 ? 's' : ''}`;
        } else {
          number = diffHours;
          timeText = `hora${diffHours > 1 ? 's' : ''}`;
        }

        const created = document.createElement('p');
        created.innerHTML = `<i class="fa-solid fa-clock text-purple-500"></i> <span class="text-white">Hace ${number}</span> ${timeText}`;
        stats.appendChild(created);
      }

      modCard.appendChild(stats);
    }

    apiData.appendChild(modCard);

    // 🔹 Eventos hover / click como antes
    [imgBox, title].forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (imgBox.firstChild) imgBox.firstChild.style.transform = 'scale(1.2)';
        title.style.color = '#1de9b6';
        modCard.style.backgroundColor = '#2d2d3d';
      });
      el.addEventListener('mouseleave', () => {
        if (imgBox.firstChild) imgBox.firstChild.style.transform = 'scale(1)';
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

    title.addEventListener('mouseenter', () => {
      title.style.color = '#1de9b6';
      title.style.textDecoration = 'underline';
    });
    title.addEventListener('mouseleave', () => {
      title.style.color = 'white';
      title.style.textDecoration = 'none';
    });
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

  apiData.insertAdjacentElement('beforebegin', pagination);
}

// Ejecutar apenas cargue la página
document.addEventListener('DOMContentLoaded', cargarMods);
