const btn = document.getElementById('btnFetch');
const apiData = document.getElementById('apiData');

btn.addEventListener('click', () => {
  fetch(
    'https://raw.githubusercontent.com/samp-comunity/plujin-manager/main/assets/scripts.json',
  )
    .then((res) => {
      if (!res.ok) throw new Error('No se pudo cargar el JSON');
      return res.json();
    })
    .then((data) => {
      // Extraer todos los nombres
      const names = data.map((item) => item.name);
      // Mostrar separados por coma
      apiData.textContent = names.join(', ');
    })
    .catch((err) => {
      apiData.textContent = 'Error al cargar la API: ' + err;
    });
});
