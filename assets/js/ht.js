/* Advanced Hair Clinics · Hair transplant: best-practice tabs and background videos */
(() => {
  const box = document.querySelector('.bps');
  if (box) {
    box.classList.add('js');
    const links = [...box.querySelectorAll('.bps-nav a')];
    const panels = [...box.querySelectorAll('.bp')];
    const show = (id, scroll) => {
      panels.forEach((p) => {
        const on = p.id === id;
        p.classList.toggle('is-active', on);
        const v = p.querySelector('video');
        if (v) { if (on) v.play().catch(() => {}); else v.pause(); }
      });
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
      const a = links.find((x) => x.getAttribute('href') === `#${id}`);
      a.parentElement.parentElement.scrollTo({ left: a.offsetLeft - 20, behavior: 'smooth' });
      if (scroll && innerWidth <= 1120) document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    links.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); show(a.getAttribute('href').slice(1), true); }));
  }
  // Play the experience video and the visible practice video only while on screen.
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting && (!v.closest('.bp') || v.closest('.bp').classList.contains('is-active'))) v.play().catch(() => {});
    else v.pause();
  }), { threshold: 0.25 });
  document.querySelectorAll('.exp-video, .bp video').forEach((v) => io.observe(v));
})();
