document.addEventListener('DOMContentLoaded', () => {
  const FORM_KEY = 'formulario_respuestas_v1';
  const form = document.querySelector('main form') || document.querySelector('form');
  if (!form) return;

  function serializeForm() {
    const data = {};

    // Obtener todos los elementos con nombre
    const elements = Array.from(form.querySelectorAll('[name]'));

    // Agrupar por nombre para manejar radios/checkboxes con el mismo name
    const byName = elements.reduce((acc, el) => {
      (acc[el.name] = acc[el.name] || []).push(el);
      return acc;
    }, {});

    Object.keys(byName).forEach((name) => {
      const group = byName[name];

      // Si es un grupo de radios
      if (group[0].type === 'radio') {
        const checked = group.find((g) => g.checked);
        data[name] = checked ? checked.value : null;
        return;
      }

      // Si es un grupo de checkboxes (varios con mismo name)
      if (group[0].type === 'checkbox' && group.length > 1) {
        data[name] = group.filter((g) => g.checked).map((g) => g.value);
        return;
      }

      // Si es un solo checkbox
      if (group[0].type === 'checkbox') {
        data[name] = group[0].checked;
        return;
      }

      // Si es un select multiple
      if (group[0].tagName.toLowerCase() === 'select' && group[0].multiple) {
        data[name] = Array.from(group[0].selectedOptions).map((o) => o.value);
        return;
      }

      // Por defecto input, select simple, textarea
      data[name] = group[0].value;
    });

    return data;
  }

  // Guarda el formulario en localStorage
  function saveForm() {
    try {
      const data = serializeForm();
      localStorage.setItem(FORM_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error guardando formulario', err);
    }
  }

  // Restaura valores desde localStorage
  function restoreForm() {
    try {
      const raw = localStorage.getItem(FORM_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      Object.keys(data).forEach((name) => {
        const value = data[name];
        const elems = Array.from(form.querySelectorAll(`[name="${name}"]`));
        if (!elems.length) return;

        const first = elems[0];

        // Radios
        if (first.type === 'radio') {
          const toCheck = elems.find((e) => e.value === value);
          if (toCheck) toCheck.checked = true;
          return;
        }

        // Checkbox grupo
        if (first.type === 'checkbox' && elems.length > 1) {
          elems.forEach((e) => {
            e.checked = Array.isArray(value) && value.includes(e.value);
          });
          return;
        }

        // Single checkbox
        if (first.type === 'checkbox') {
          first.checked = !!value;
          return;
        }

        // Select multiple
        if (first.tagName.toLowerCase() === 'select' && first.multiple) {
          const values = Array.isArray(value) ? value : [value];
          Array.from(first.options).forEach((opt) => {
            opt.selected = values.includes(opt.value);
          });
          return;
        }

        // Default
        first.value = value;
      });

      // console.log('Formulario restaurado', data);
    } catch (err) {
      console.error('Error restaurando formulario', err);
    }
  }

  // Escuchar cambios y guardar
  form.addEventListener('input', saveForm);
  form.addEventListener('change', saveForm);

  // Restaurar al cargar la página
  restoreForm();
});
