// search.js

export function filtrarMods(modsData, query) {
  const filtrados = modsData.filter((mod) => {
    const name = mod.name?.toLowerCase() || '';
    const author = mod.author?.toLowerCase() || '';
    return (
      name.includes(query.toLowerCase().trim()) ||
      author.includes(query.toLowerCase().trim())
    );
  });
  return filtrados;
}
