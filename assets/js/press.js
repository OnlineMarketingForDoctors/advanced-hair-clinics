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
        if (innerWidth <= 1120) return;
        let end;
        if (card && getComputedStyle(card).position === 'absolute') end = card.getBoundingClientRect().left - 40;
        // data-reach="edge": run to the right-hand content edge, mirroring the hero's left margin
        else if (press.dataset.reach === 'edge') end = innerWidth - document.querySelector('.hero-content').getBoundingClientRect().left;
        else return;
        const w = end - press.getBoundingClientRect().left;
        if (w > 160) { press.style.flex = 'none'; press.style.width = `${w}px`; }
      };
      addEventListener('resize', fit);
      addEventListener('load', fit);
      fit();
    }
  }
})();
