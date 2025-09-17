const btn = document.getElementById('btnFetch');
const apiData = document.getElementById('apiData');

btn.addEventListener('click', () => {
  fetch(
    'https://raw.githubusercontent.com/samp-comunity/plujin-manager/refs/heads/main/assets/scripts.json',
  )
    .then((res) => res.json())
    .then((data) => {
      apiData.textContent = JSON.stringify(data, null, 2);
    })
    .catch((err) => {
      apiData.textContent = 'Error al cargar la API: ' + err;
    });
});
