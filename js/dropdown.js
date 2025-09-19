// dropdown.js
export function initDropdown({ buttonId, dropdownId, selectedId, onSelect }) {
  const button = document.getElementById(buttonId);
  const dropdown = document.getElementById(dropdownId);
  const selected = document.getElementById(selectedId);
  const items = dropdown.querySelectorAll('.dropdown-item');

  button.addEventListener('click', () => {
    if (dropdown.classList.contains('hidden')) {
      dropdown.classList.remove('hidden');
      setTimeout(() => {
        dropdown.classList.remove('scale-95', 'opacity-0');
        dropdown.classList.add('scale-100', 'opacity-100');
      }, 10);
    } else {
      cerrarDropdown();
    }
  });

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const orderType = item.id;
      const label = item.querySelector('span').textContent;

      selected.textContent = label;
      document.getElementById('selectedOrderHeader').textContent = label;

      if (typeof onSelect === 'function') onSelect(orderType);
      cerrarDropdown();
    });
  });

  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !dropdown.contains(e.target))
      cerrarDropdown();
  });

  function cerrarDropdown() {
    dropdown.classList.remove('scale-100', 'opacity-100');
    dropdown.classList.add('scale-95', 'opacity-0');
    setTimeout(() => dropdown.classList.add('hidden'), 200);
  }
}
