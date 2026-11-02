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

  /* ---------- Mega menu ---------- */
  const mega = $('#mega');
  const tops = $$('.mm-top');
  if (mega) {
    let closeT;
    const openMega = (g) => {
      clearTimeout(closeT);
      mega.hidden = false;
      mega.dataset.active = g;
      tops.forEach((b) => b.setAttribute('aria-expanded', b.dataset.g === g));
      $$('.mm-group', mega).forEach((el) => el.classList.toggle('is-active', el.dataset.g === g));
    };
    const closeMega = () => {
      mega.hidden = true;
      tops.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    };
    const later = () => { clearTimeout(closeT); closeT = setTimeout(closeMega, 220); };
    const canHover = matchMedia('(hover: hover)').matches;
    tops.forEach((b) => {
      if (canHover) b.addEventListener('mouseenter', () => openMega(b.dataset.g));
      b.addEventListener('click', () => (b.getAttribute('aria-expanded') === 'true' && !canHover ? closeMega() : openMega(b.dataset.g)));
    });
    if (canHover) {
      $$('.main-nav > ul > li:not(.has-mega)').forEach((li) => li.addEventListener('mouseenter', later));
      header.addEventListener('mouseleave', later);
      mega.addEventListener('mouseenter', () => clearTimeout(closeT));
    }
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mega.hidden) { closeMega(); tops[0].focus(); } });
    document.addEventListener('click', (e) => { if (!mega.hidden && !e.target.closest('.site-header')) closeMega(); });
    mega.addEventListener('click', (e) => { if (e.target.closest('a')) closeMega(); });
  }

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
