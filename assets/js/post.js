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

  const copy = document.querySelector('.share-copy');
  const done = document.querySelector('.share-done');
  if (copy) copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); done.hidden = false; setTimeout(() => { done.hidden = true; }, 2200); } catch (e) { /* clipboard unavailable */ }
  });
})();
