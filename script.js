const btn = document.getElementById('btnFetch');
const apiData = document.getElementById('apiData');

btn.addEventListener('click', () => {
  console.log('Botón presionado, iniciando fetch...');

  fetch(
    'https://raw.githubusercontent.com/samp-comunity/plujin-manager/main/assets/scripts.json',
  )
    .then((res) => {
      console.log('Respuesta recibida:', res);
      if (!res.ok) throw new Error('No se pudo cargar el JSON');
      return res.json();
    })
    .then((data) => {
      console.log('JSON cargado:', data);

      // Acceder al array dentro de "mods"
      const names = data.mods.map((mod) => {
        console.log('Nombre del mod:', mod.name);
        return mod.name;
      });

      // Mostrar separados por coma
      apiData.textContent = names.join(', ');
      console.log('Todos los nombres concatenados:', names.join(', '));
    })
    .catch((err) => {
      console.error('Error al cargar la API:', err);
      apiData.textContent = 'Error al cargar la API: ' + err;
    });
});
