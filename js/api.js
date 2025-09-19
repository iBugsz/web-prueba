// api.js
export async function cargarModsAPI() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/samp-comunity/plujin-manager/main/assets/scripts.json',
    );
    if (!res.ok) throw new Error('No se pudo cargar el JSON');
    const data = await res.json();
    return data.mods || [];
  } catch (err) {
    console.error('Error al cargar la API:', err);
    return { error: err.message };
  }
}
