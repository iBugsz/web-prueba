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

      const names = data.mods.map((mod, index, array) => {
        const nameWithoutExt = mod.name.includes('.')
          ? mod.name.substring(0, mod.name.lastIndexOf('.'))
          : mod.name;

        // Solo el último nombre recibe un punto
        return index === array.length - 1
          ? nameWithoutExt + '.'
          : nameWithoutExt;
      });

      // Mostrar separados por coma
      apiData.textContent = names.join(', ');
      console.log(
        'Todos los nombres concatenados con punto solo al último:',
        names.join(', '),
      );
    })
    .catch((err) => {
      console.error('Error al cargar la API:', err);
      apiData.textContent = 'Error al cargar la API: ' + err;
    });
});
