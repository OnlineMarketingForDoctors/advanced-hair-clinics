/* Advanced Hair Clinics · FUE page: section nav and events scroller */
(() => {
  const nav = document.querySelector('.page-nav');
  if (nav) {
    const links = [...nav.querySelectorAll('ul a')];
    const secs = links.map((a) => document.querySelector(a.getAttribute('href')));
    const list = nav.querySelector('ul');
    let last = -1;
    const header = document.querySelector('.site-header');
    const onScroll = () => {
      // Sit flush under the header, which shrinks once the page scrolls.
      nav.style.top = `${Math.max(0, Math.round(header.getBoundingClientRect().bottom))}px`;
      let cur = -1;
      secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.35) cur = i; });
      if (cur === last) return;  // nothing changed
      last = cur;
      links.forEach((a, i) => a.classList.toggle('is-active', i === cur));
      // Keep the active link visible in the scrollable bar.
      if (cur >= 0) {
        const a = links[cur];
        list.scrollTo({ left: a.offsetLeft - list.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    header.addEventListener('transitionend', () => { last = -2; onScroll(); });
    onScroll();
  }

  const track = document.getElementById('ev-track');
  document.querySelectorAll('.ev-nav button').forEach((b) => b.addEventListener('click', () => {
    track.scrollBy({ left: (track.firstElementChild.offsetWidth + 14) * 2 * +b.dataset.dir, behavior: 'smooth' });
  }));

  // Background videos only play while on screen.
  const vids = [...document.querySelectorAll('.wu-video video')];
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())), { threshold: 0.2 });
  vids.forEach((v) => io.observe(v));
})();
