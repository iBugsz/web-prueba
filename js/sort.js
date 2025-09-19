// sort.js
export function initSort({ filtrados, mostrarMods, setPage }) {
  return {
    sortByNameAZ() {
      filtrados.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '', 'es', {
          sensitivity: 'base',
        }),
      );
      setPage(1);
      mostrarMods();
    },
    sortByNameZA() {
      filtrados.sort((a, b) =>
        (b.name || '').localeCompare(a.name || '', 'es', {
          sensitivity: 'base',
        }),
      );
      setPage(1);
      mostrarMods();
    },
    sortByOldest() {
      filtrados.sort(
        (a, b) => new Date(a.last_update || 0) - new Date(b.last_update || 0),
      );
      setPage(1);
      mostrarMods();
    },
    sortByDownloads() {
      filtrados.sort(
        (a, b) => (b.total_downloads || 0) - (a.total_downloads || 0),
      );
      setPage(1);
      mostrarMods();
    },
    sortByUpdated() {
      filtrados.sort(
        (a, b) => new Date(b.last_update || 0) - new Date(a.last_update || 0),
      );
      setPage(1);
      mostrarMods();
    },
  };
}
