/* Advanced Hair Clinics · Who we are interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Medical team filter ---------- */
  const filter = $('.team-filter');
  const members = $$('.team-lead, .team-grid .doc');
  if (filter) filter.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('button', filter).forEach((x) => x.setAttribute('aria-pressed', x === b));
    const f = b.dataset.f;
    members.forEach((m) => {
      const show = f === 'all' || !m.dataset.s || m.dataset.s === f;
      m.hidden = !show;
      m.classList.remove('is-entering');
      if (show) { void m.offsetWidth; m.classList.add('is-entering'); }
    });
  });

  /* ---------- Training gallery arrows ---------- */
  const track = $('#training-track');
  $$('.training-nav button').forEach((b) => b.addEventListener('click', () => {
    const step = track.firstElementChild.getBoundingClientRect().width + 20;
    track.scrollBy({ left: step * +b.dataset.dir, behavior: 'smooth' });
  }));
})();
