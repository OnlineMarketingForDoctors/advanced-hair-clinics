/* Advanced Hair Clinics · hero "As featured in" press ticker (homepage and hair transplant page) */
(() => {
  /* ---------- Hero press ticker ---------- */
  {
    const press = document.querySelector('.hero-press');
    const list = document.querySelector('.hero-press-list');
    if (press && list) {
      // A second, hidden copy of the logos makes the loop seamless.
      [...list.children].forEach((li) => {
        const c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
        list.append(c);
      });
      // On desktop the before and after card floats beside the hero text:
      // the ticker runs from the button up to the card, with a small gap.
      const card = document.querySelector('.hero-ba');
      const fit = () => {
        press.style.width = '';
        press.style.flex = '';
        if (!card || getComputedStyle(card).position !== 'absolute') return;
        const w = card.getBoundingClientRect().left - 40 - press.getBoundingClientRect().left;
        if (w > 160) { press.style.flex = 'none'; press.style.width = `${w}px`; }
      };
      addEventListener('resize', fit);
      addEventListener('load', fit);
      fit();
    }
  }
})();
