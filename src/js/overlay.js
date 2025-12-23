document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const backdrop = document.getElementById('overlay-backdrop');
  const panel = document.getElementById('overlay-nav');
  const focusableSelector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  if (!hamburger || !backdrop || !panel) return;

  const closeBtn = panel.querySelector('.overlay-close');
  const links = panel.querySelectorAll('a');

  function openOverlay() {
    lastFocused = document.activeElement;
    backdrop.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = panel.querySelector(focusableSelector);
    if (first) first.focus();
  }

  function closeOverlay() {
    backdrop.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  hamburger.addEventListener('click', function () {
    if (backdrop.classList.contains('open')) closeOverlay(); else openOverlay();
  });

  closeBtn && closeBtn.addEventListener('click', closeOverlay);

  // clicking on the backdrop (outside panel) closes
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeOverlay();
  });

  // close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeOverlay();
  });

  // close when clicking a link (navigate)
  links.forEach(l => l.addEventListener('click', closeOverlay));

  // trap focus inside panel when open
  document.addEventListener('focus', function (e) {
    if (!backdrop.classList.contains('open')) return;
    if (!panel.contains(e.target)) {
      e.stopPropagation();
      const first = panel.querySelector(focusableSelector);
      if (first) first.focus();
    }
  }, true);
});