document.addEventListener('DOMContentLoaded', () => {
  const newsList = document.getElementById('news-list');
  const SEARCH_API = 'https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=Real%20Madrid&format=json&origin=*&srlimit=6&srprop=snippet';
  const ARTICLE_URL = 'https://es.wikipedia.org/wiki/Real_Madrid';

  function setLoading() {
    newsList.innerHTML = '<li class="news-loading">Cargando información desde Wikipedia (ES)...</li>';
  }

  function showError(message) {
    newsList.innerHTML = `<li class="news-error">${message} <button id="news-retry">Reintentar</button> <a class="open-link" href="${ARTICLE_URL}" target="_blank" rel="noopener">Abrir en Wikipedia</a></li>`;
    const btn = document.getElementById('news-retry');
    if (btn) btn.addEventListener('click', () => loadNews());
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  }

  function renderDetails(pages) {
    newsList.innerHTML = '';

    // pages: array de objetos {title, extract, thumbnail, link}
    pages.slice(0,4).forEach(p => {
      const li = document.createElement('li');
      li.className = 'news-item';

      if (p.thumbnail) {
        const img = document.createElement('img');
        img.src = p.thumbnail;
        img.alt = p.title;
        img.className = 'thumb';
        li.appendChild(img);
      }

      const content = document.createElement('div');
      content.className = 'news-content';

      const a = document.createElement('a');
      a.href = p.link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = p.title;

      const excerpt = document.createElement('p');
      excerpt.textContent = (p.extract || '').slice(0, 300) + (p.extract && p.extract.length > 300 ? '...' : '');

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = 'Fuente: Wikipedia (es)';

      content.appendChild(a);
      if (p.extract) content.appendChild(excerpt);
      content.appendChild(meta);

      li.appendChild(content);
      newsList.appendChild(li);
    });

    const liLink = document.createElement('li');
    liLink.innerHTML = `<a href="${ARTICLE_URL}" target="_blank" rel="noopener">Ver artículo principal en Wikipedia</a>`;
    newsList.appendChild(liLink);
  }

  async function fetchSearch() {
    const res = await fetch(SEARCH_API);
    if (!res.ok) throw new Error('Búsqueda en Wikipedia falló');
    const data = await res.json();
    return data.query?.search || [];
  }

  async function fetchDetailsFor(pageIds) {
    if (!pageIds.length) return [];
    const API = `https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=320&pageids=${pageIds.join('|')}`;
    const res = await fetch(API);
    if (!res.ok) throw new Error('Detalles en Wikipedia falló');
    const data = await res.json();
    const pages = data.query?.pages || {};
    return Object.values(pages).map(pg => ({
      title: pg.title,
      extract: pg.extract || '',
      thumbnail: pg.thumbnail?.source || null,
      link: 'https://es.wikipedia.org/wiki/' + encodeURIComponent(pg.title.replace(/ /g, '_'))
    }));
  }

  async function loadNews() {
    setLoading();
    try {
      const results = await fetchSearch();
      if (!results.length) throw new Error('No se encontraron resultados');

      // seleccionar los primeros resultados (incluye la página principal), tomar sus pageids
      const top = results.slice(0,6);
      const pageIds = top.map(r => r.pageid).filter(Boolean);
      const details = await fetchDetailsFor(pageIds);
      if (details && details.length) {
        renderDetails(details);
        return;
      }

      throw new Error('No hay detalles disponibles');
    } catch (e) {
      console.warn('Carga Wikipedia (ES) falló:', e);
      showError('No se pudo cargar la información desde Wikipedia.');
    }
  }

  loadNews();
});