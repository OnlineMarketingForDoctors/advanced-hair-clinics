/* Advanced Hair Clinics · Doctor profile: YouTube facades (the player loads only on click) */
(() => {
  document.querySelectorAll('.yt-facade[data-yt]').forEach((b) => {
    b.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0&modestbranding=1`;
      f.title = b.getAttribute('aria-label') || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.className = 'yt-frame';
      b.replaceWith(f);
    });
  });
})();
