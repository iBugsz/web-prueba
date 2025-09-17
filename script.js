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

    // 🔹 Card principal
    const modCard = document.createElement('div');
    modCard.className =
      'flex items-center gap-4 bg-[#222] rounded-lg p-4 transition-colors duration-200';

    // 🔹 Contenedor hoverable (imagen + título)
    const hoverContainer = document.createElement('div');
    hoverContainer.className = 'flex items-center gap-4';

    // 🔹 Imagen
    const imgBox = document.createElement('div');
    imgBox.className =
      'w-24 h-24 flex-shrink-0 flex items-center justify-center';

    // Gif de cargando / default
    const loader = document.createElement('img');
    loader.src = 'https://i.gifer.com/XOsX.gif'; // gif de cargando/default
    loader.className = 'w-12 h-12';
    imgBox.appendChild(loader);

    if (mod.icon) {
      const img = document.createElement('img');
      img.src = mod.icon;
      img.alt = nameWithoutExt;
      img.className =
        'w-full h-full object-cover rounded-md transition-transform duration-200 ease-in-out hidden'; // inicialmente oculta

      // Cuando la imagen carga correctamente
      img.onload = () => {
        loader.remove(); // quitamos el loader
        img.classList.remove('hidden'); // mostramos la imagen
      };

      // Si falla la carga
      img.onerror = () => {
        // dejamos el loader (gif) visible
        img.remove();
      };

      imgBox.appendChild(img);
    }

    // 🔹 Info
    const info = document.createElement('div');
    info.className = 'flex-1 space-y-1';

    const title = document.createElement('h4');
    title.textContent = nameWithoutExt;
    title.className =
      'text-lg font-bold text-white transition-colors duration-200 cursor-pointer';

    const author = document.createElement('p');
    author.textContent = `Autor: ${mod.author || 'Desconocido'}`;
    author.className = 'text-sm text-gray-400';

    const desc = document.createElement('p');
    desc.textContent = mod.description || 'No hay descripción';
    desc.className = 'text-sm text-gray-300';

    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(desc);

    hoverContainer.appendChild(imgBox);
    hoverContainer.appendChild(info);

    modCard.appendChild(hoverContainer);
    apiData.appendChild(modCard);

    // 🔹 Eventos de hover sobre imagen o título
    [imgBox, title].forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (imgBox.firstChild) imgBox.firstChild.style.transform = 'scale(1.1)';
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
