/* Advanced Hair Clinics · Before & after gallery: procedure nav, show more, lightbox */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const links = $$('.gnav a');
  const secs = $$('.ba-sec');
  const gallery = $('#gallery');

  const show = (id, scroll) => {
    if (!secs.some((s) => s.id === id)) return;
    secs.forEach((s) => { s.hidden = s.id !== id; });
    links.forEach((a) => a.setAttribute('aria-current', a.dataset.c === id));
    const a = links.find((x) => x.dataset.c === id);
    a.parentElement.parentElement.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
    if (scroll) {
      const head = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 92;
      const extra = innerWidth <= 1120 ? 70 : 24;
      scrollTo({ top: gallery.getBoundingClientRect().top + scrollY - head - extra + (innerWidth <= 1120 ? 0 : 0), behavior: 'smooth' });
    }
  };
  links.forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    history.replaceState(null, '', `#${a.dataset.c}`);
    show(a.dataset.c, true);
  }));
  const fromHash = () => show(location.hash.slice(1), false);
  addEventListener('hashchange', fromHash);
  fromHash();

  /* ---------- Show more ---------- */
  $$('.ba-more').forEach((btn) => btn.addEventListener('click', () => {
    const next = $$('.bac[data-more][hidden]', btn.closest('.ba-sec')).slice(0, 12);
    next.forEach((li) => { li.hidden = false; li.classList.add('is-entering'); });
    const left = $$('.bac[data-more][hidden]', btn.closest('.ba-sec')).length;
    if (!left) btn.remove(); else btn.querySelector('span').textContent = `(${left} more)`;
  }));

  /* ---------- Lightbox ---------- */
  const lb = $('#lb');
  const img = $('#lb-img');
  const cap = $('#lb-cap');
  let list = [];
  let idx = 0;
  const open = (i) => {
    idx = (i + list.length) % list.length;
    const card = list[idx];
    const src = $('img', card);
    img.src = src.src; img.alt = src.alt;
    cap.innerHTML = $$('dl > div', card).map((d) => `<p>${$('dt', d).textContent}<strong>${$('dd', d).textContent}</strong></p>`).join('');
    if (!lb.open) lb.showModal();
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.bac-img');
    if (!b) return;
    list = $$('.bac:not([hidden])', b.closest('.ba-sec'));
    open(list.indexOf(b.closest('.bac')));
  });
  $('.lb-prev').addEventListener('click', () => open(idx - 1));
  $('.lb-next').addEventListener('click', () => open(idx + 1));
  $('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') open(idx - 1);
    if (e.key === 'ArrowRight') open(idx + 1);
  });
})();
