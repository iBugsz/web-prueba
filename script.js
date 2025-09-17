const btn = document.getElementById('btnFetch');
const apiData = document.getElementById('apiData');

btn.addEventListener('click', () => {
  fetch(
    'https://raw.githubusercontent.com/samp-comunity/plujin-manager/refs/heads/main/assets/scripts.json',
  )
    .then((res) => {
      if (!res.ok) throw new Error('No se pudo cargar el JSON');
      return res.json();
    })
    .then((data) => {
      // Mostrar los datos en el <pre>
      apiData.textContent = JSON.stringify(data, null, 2);
    })
    .catch((err) => {
      apiData.textContent = 'Error al cargar la API: ' + err;
    });
});
