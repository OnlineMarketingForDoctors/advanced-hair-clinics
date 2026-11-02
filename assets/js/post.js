/* Advanced Hair Clinics · Blog post: reading progress, contents, share */
(() => {
  const body = document.querySelector('.post-body');
  if (!body) return;
  const bar = document.querySelector('.read-progress span');
  const links = [...document.querySelectorAll('.toc a')];
  const heads = links.map((a) => document.querySelector(a.getAttribute('href')));

  const onScroll = () => {
    const r = body.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight * 0.6)));
    bar.style.transform = `scaleX(${p})`;
    let cur = -1;
    heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * 0.3) cur = i; });
    links.forEach((a, i) => a.classList.toggle('is-active', i === cur));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Sidebar: keep its bottom in view when taller than the window ---------- */
  const aside = document.querySelector('.post-aside');
  const fitAside = () => {
    if (!aside) return;
    const head = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 92;
    aside.style.top = `${Math.min(head + 24, innerHeight - aside.offsetHeight - 24)}px`;
  };
  addEventListener('resize', fitAside);
  addEventListener('load', fitAside);
  fitAside();

  /* ---------- Before & after banner ---------- */
  // Graft and month figures are placeholders, matching the homepage results gallery.
  const cases = [
    { f: 'hair-transplant-085-a', meta: '3,800 grafts, 12 months' },
    { f: 'hair-transplant-042-a', meta: '3,500 grafts, 12 months' },
    { f: 'hair-transplant-107-a', meta: '4,500 grafts, 15 months' },
    { f: 'hair-transplant-089-c', meta: '4,200 grafts, 14 months' },
  ];
  const promo = document.querySelector('.ba-promo');
  if (promo) {
    const stage = promo.querySelector('.hba-stage');
    const range = promo.querySelector('.hba-range');
    const imgB = promo.querySelector('.hba-before');
    const imgA = promo.querySelector('.hba-after');
    const meta = promo.querySelector('.bp-meta');
    const dots = promo.querySelector('.hba-dots');
    range.addEventListener('input', () => stage.style.setProperty('--pos', `${range.value}%`));
    dots.innerHTML = cases.map((c, i) => `<button type="button" aria-pressed="${i === 0}" aria-label="Case ${i + 1}" data-i="${i}"></button>`).join('');
    dots.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const c = cases[+b.dataset.i];
      dots.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      stage.classList.add('is-swapping');
      setTimeout(() => {
        imgB.src = `/assets/img/ba-split/${c.f}-before.webp`;
        imgA.src = `/assets/img/ba-split/${c.f}-after.webp`;
        meta.textContent = c.meta;
        stage.style.setProperty('--pos', '50%'); range.value = 50;
        Promise.all([imgA, imgB].map((im) => (im.decode ? im.decode() : Promise.resolve()).catch(() => {})))
          .then(() => stage.classList.remove('is-swapping'));
      }, 300);
    });
  }

  const copy = document.querySelector('.share-copy');
  const done = document.querySelector('.share-done');
  if (copy) copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); done.hidden = false; setTimeout(() => { done.hidden = true; }, 2200); } catch (e) { /* clipboard unavailable */ }
  });
})();
