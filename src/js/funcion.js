document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.boton');
  const modal = document.getElementById('gif-modal');
  const modalImg = document.getElementById('gif-img');
  const closeBtn = modal && modal.querySelector('.gif-close');
  const GIF_COUNT = 10; // ajustar si se añaden/quitan GIFs

  if (!btn || !modal || !modalImg) return;

  function showRandomGif() {
    const n = Math.floor(Math.random() * GIF_COUNT) + 1;
    // Ruta esperada: imagenes/gifs/1.gif ... 10.gif
    modalImg.src = `gifs/gif${n}.gif`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    // liberar memoria del src para detener animación si el navegador lo soporta
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', showRandomGif);
  closeBtn && closeBtn.addEventListener('click', closeModal);

  // cerrar si clicas fuera del contenido
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // cerrar con ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
});
