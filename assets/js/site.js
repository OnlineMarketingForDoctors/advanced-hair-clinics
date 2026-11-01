/* Advanced Hair Clinics · shared interactions (header, counters, clinic tabs, reveal, parallax) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Load sequence ---------- */
  requestAnimationFrame(() => document.body.classList.add('is-loaded'));

  /* ---------- Header ---------- */
  const header = $('.site-header');
  const toTop = $('.to-top');
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > innerHeight * 0.9);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const menuBtn = $('.menu-toggle');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      countIO.unobserve(target);
      const end = +target.dataset.count;
      if (reduceMotion) return;
      const t0 = performance.now();
      const dur = 1600;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        target.textContent = v.toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => countIO.observe(c));

  /* ---------- Clinic tabs ---------- */
  const rTabs = $$('.region-tabs [role="tab"]');
  rTabs.forEach((t) => t.addEventListener('click', () => {
    rTabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', on);
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
  }));

  /* ---------- Editorial image reveal + gentle parallax ---------- */
  if (!reduceMotion) {
    const revealTargets = $$('.ba-frame, .why-media, .clinics-media img, .post-feature .post-img, [data-reveal]');
    revealTargets.forEach((el) => el.classList.add('reveal'));
    // Observe the parent: a fully clipped element reports no intersection.
    const owner = new Map();
    const rIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      (owner.get(e.target) || []).forEach((el) => el.classList.add('is-in'));
      rIO.unobserve(e.target);
    }), { threshold: 0.1 });
    revealTargets.forEach((el) => {
      const host = el.parentElement;
      owner.set(host, [...(owner.get(host) || []), el]);
      rIO.observe(host);
    });

    const par = $$('.services-bg img, .cta-bg img');
    const doPar = () => {
      par.forEach((img) => {
        const r = img.parentElement.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translate3d(0, ${p * -40}px, 0) scale(1.08)${'flip' in img.dataset ? ' scaleX(-1)' : ''}`;
      });
    };
    addEventListener('scroll', doPar, { passive: true });
    doPar();
  }
})();
