/* Advanced Hair Clinics · homepage interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Hero before & after widget ---------- */
  // Graft and month figures are placeholders, matching the results gallery.
  const heroCases = [
    { f: 'hair-transplant-085-a', meta: '3,800 grafts, 12 months' },
    { f: 'hair-transplant-042-a', meta: '3,500 grafts, 12 months' },
    { f: 'hair-transplant-107-a', meta: '4,500 grafts, 15 months' },
    { f: 'hair-transplant-089-c', meta: '4,200 grafts, 14 months' },
  ];
  const hba = $('.hero-ba');
  if (hba) {
    const stage = $('.hba-stage', hba);
    const range = $('.hba-range', hba);
    const imgB = $('.hba-before', hba);
    const imgA = $('.hba-after', hba);
    const dots = $('.hba-dots', hba);
    let hIdx = 0;
    let hTimer;
    let sweepRaf;
    let touched = false;
    const setPos = (v) => { stage.style.setProperty('--pos', `${v}%`); range.value = v; };
    range.addEventListener('input', () => {
      touched = true; cancelAnimationFrame(sweepRaf); clearInterval(hTimer);
      stage.style.setProperty('--pos', `${range.value}%`);
    });
    // One slow sweep after each case appears shows the result without any input.
    const sweep = () => {
      if (reduceMotion || touched) return;
      const t0 = performance.now();
      const dur = 2600;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        setPos(50 + 35 * Math.sin(p * Math.PI * 2)); // centre → after → before → centre
        if (p < 1) sweepRaf = requestAnimationFrame(step); else setPos(50);
      };
      sweepRaf = requestAnimationFrame(step);
    };
    dots.innerHTML = heroCases.map((c, i) => `<button type="button" aria-pressed="${i === 0}" aria-label="Case ${i + 1}" data-i="${i}"></button>`).join('');
    const showHero = (i) => {
      hIdx = i;
      $$('button', dots).forEach((b) => b.setAttribute('aria-pressed', b.dataset.i == i));
      const c = heroCases[i];
      stage.classList.add('is-swapping');
      setTimeout(() => {
        imgB.src = `assets/img/ba-split/${c.f}-before.webp`;
        imgA.src = `assets/img/ba-split/${c.f}-after.webp`;
        $('#hba-meta').textContent = c.meta;
        setPos(50);
        Promise.all([imgA, imgB].map((im) => (im.decode ? im.decode() : Promise.resolve()).catch(() => {})))
          .then(() => { stage.classList.remove('is-swapping'); sweep(); });
      }, reduceMotion ? 0 : 350);
    };
    const rotate = () => {
      clearInterval(hTimer);
      if (!reduceMotion && !touched) hTimer = setInterval(() => showHero((hIdx + 1) % heroCases.length), 7000);
    };
    dots.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      touched = true; clearInterval(hTimer); cancelAnimationFrame(sweepRaf);
      showHero(+b.dataset.i);
    });
    heroCases.forEach((c) => ['before', 'after'].forEach((k) => { const im = new Image(); im.src = `assets/img/ba-split/${c.f}-${k}.webp`; }));
    setTimeout(() => { sweep(); rotate(); }, reduceMotion ? 0 : 2400);
  }

  /* ---------- Services ---------- */
  const services = [
    { n: 'FUE Hair Transplant', img: 'svc-fue', d: 'Individual hair follicles are extracted from the donor area and implanted one by one, exclusively by doctors, for a permanent, natural-looking result that follows the direction of your natural hair growth.' },
    { n: 'Unshaven FUE Hair Transplant', img: 'svc-unshaven', d: 'Follicles are extracted by trimming only the donor area and placed without shaving the recipient area. A discreet procedure with an immediate return to everyday life.' },
    { n: 'Hair Transplant in Women', img: 'svc-women', d: 'Personalised planning for female hair loss, including Long Hair FUE, where follicles are extracted and implanted without cutting the existing hair, regardless of its length.' },
    { n: 'FUE Beard Transplant', img: 'svc-beard', d: 'Fuller, even beard density with follicles placed at the correct angle and direction, designed around the shape of your face.' },
    { n: 'FUE Eyebrow Transplant', img: 'svc-eyebrow', d: 'Natural eyebrow shape and density restored with single hair follicles, implanted with precision for a result that frames the face.' },
    { n: 'FUT Strip Scars Restoration', img: 'svc-scar', d: 'Scars from previous strip (FUT) hair transplant surgery are covered with FUE grafts, restoring a natural appearance to the donor area.' },
    { n: 'Hair Loss Treatment With Autologous Growth Factors', img: 'svc-growth', d: 'A regenerative treatment using growth factors from your own blood to strengthen existing hair, slow hair loss and support transplanted hair.' },
    { n: 'Hair Loss DNA Test', img: 'svc-diagnosis', d: 'Our medical team evaluates the degree of hair loss and determines its causes with modern diagnostic tools, so we can recommend the right treatment plan for you.' },
  ];
  const sList = $('#service-list');
  sList.setAttribute('role', 'tablist');
  sList.setAttribute('aria-label', 'Services');
  sList.innerHTML = services.map((s, i) => `<li><button type="button" role="tab" aria-selected="${i === 0}" data-i="${i}">${s.n}</button></li>`).join('');
  const sImg = $('#service-img');
  let sCur = -1;
  const showService = (i) => {
    if (i === sCur) return;
    sCur = i;
    const s = services[i];
    $$('button', sList).forEach((b) => b.setAttribute('aria-selected', b.dataset.i == i));
    $('#service-name').textContent = s.n;
    $('#service-desc').textContent = s.d;
    $('#service-link').textContent = `Discover ${s.n}`;
    sImg.classList.add('is-swapping');
    setTimeout(() => {
      sImg.src = `assets/img/gen/${s.img}.webp`;
      sImg.alt = s.n;
      const done = () => sImg.classList.remove('is-swapping');
      (sImg.decode ? sImg.decode() : Promise.resolve()).then(done, done);
    }, reduceMotion ? 0 : 220);
  };
  sList.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showService(+b.dataset.i); });
  if (matchMedia('(hover: hover)').matches) {
    sList.addEventListener('mouseover', (e) => { const b = e.target.closest('button'); if (b) showService(+b.dataset.i); });
  }
  // Lock the text box to the tallest service so hovering never shifts the layout
  const sBody = $('.service-card-body');
  const fitServiceBody = () => {
    const name = $('#service-name'), desc = $('#service-desc'), link = $('#service-link');
    const keep = [name.textContent, desc.textContent, link.textContent];
    sBody.style.minHeight = '';
    let max = 0;
    services.forEach((s) => {
      name.textContent = s.n; desc.textContent = s.d; link.textContent = `Discover ${s.n}`;
      max = Math.max(max, sBody.offsetHeight);
    });
    [name.textContent, desc.textContent, link.textContent] = keep;
    sBody.style.minHeight = `${max}px`;
  };
  showService(0);
  fitServiceBody();
  if (document.fonts) document.fonts.ready.then(fitServiceBody);
  let sFitT;
  addEventListener('resize', () => { clearTimeout(sFitT); sFitT = setTimeout(fitServiceBody, 150); });
  // Warm the cache so swaps feel instant
  addEventListener('load', () => services.forEach((s) => { const im = new Image(); im.src = `assets/img/gen/${s.img}.webp`; }));

  /* ---------- Why choose us ---------- */
  // Full copy from the original homepage, lightly edited. The first paragraph shows;
  // the rest opens with Read more.
  const why = [
    { t: 'Hair transplantation exclusively by doctors', media: { video: 'timelapse' },
      p: ['At Advanced Hair Clinics, hair transplantation is a very serious matter that concerns only doctors. The head of the Advanced Hair Clinics medical team is Plastic Surgeon Dr. Anastasios Vekris, with experience in thousands of FUE hair transplant procedures in Greece and in many foreign countries (USA, Great Britain, France, Turkey, Cyprus, Israel, India, Saudi Arabia, Kuwait).',
        'Dr. Anastasios Vekris is one of the few Greek physicians who is a regular member of ISHRS (International Society of Hair Restoration Surgery) and is invited every year to the world hair transplantation conferences to train physicians from all over the globe in the new methods of Follicular Unit Excision.',
        'Dr. Vekris is one of the world\u2019s leading physicians specialising in FUE hair transplantation. He has many years of experience in this technique and has personally trained Advanced Hair Clinics medical team members, as well as dozens of other physicians and their team members in numerous countries abroad. All transplantation procedures involving the transfer of individual hair follicles are performed by his team and under his supervision, with the aim of achieving a natural-looking, individualised result.'] },
    { t: 'Direct graft placement with Sharp Implanter', media: { video: 'sharp-implanter' },
      p: ['One reason Advanced Hair Clinics excels on both a European and an international level is our use of high-precision medical instruments, such as the Sharp Implanter. This tool is chosen for its unparalleled precision during the crucial hair follicle implantation stage. Here\u2019s why we prefer it:'],
      l: ['Its exceptionally thin tip, with a diameter of less than 1 mm, allows for absolute precision during implantation.',
        'The Sharp Implanter\u2019s design is intended to help reduce the risk of damage to hair follicles during the procedure, supporting their viability and growth potential.',
        'With the Sharp Implanter, we can place the grafts in the direction of natural hair growth and at the desired implantation angle. This ensures a natural result and the desired density while causing the least possible injury to the scalp.',
        'The design of the Sharp Implanter is intended to help limit tissue trauma and may reduce the likelihood of post-procedure swelling, supporting a more comfortable recovery.'] },
    { t: 'Unshaven FUE session for 100% discretion', media: { video: 'unshaven-fue' },
      p: ['The medical teams of Advanced Hair Clinics are among the few that successfully apply the very demanding Unshaven FUE method.'],
      l: ['Ability to extract and transplant hair follicles only by trimming the donor area', 'Placement of grafts without shaving the recipient area', 'A discreet hair transplantation procedure', 'Immediate return to everyday life', 'A completely natural result'] },
    { t: 'Long Hair FUE: transplantation with long hair', media: { video: 'long-hair-fue' },
      p: ['Advanced Hair Clinics is one of the few clinics in Greece, if not the only one, that successfully applies Long Hair FUE, the transplantation of long hair.'],
      l: ['The extraction and implantation of hair follicles is performed without cutting the existing hair, regardless of its length.',
        'This technique requires great skill and technical knowledge on the part of the doctor to support optimal graft placement, with the correct direction and angle of insertion, with the aim of achieving a natural-looking result.',
        'Ideal for both men and women.', 'Immediate return to daily life.'] },
    { t: 'Innovation in hair transplant planning using artificial intelligence', media: { video: 'ai-planning' },
      p: ['At Advanced Hair Clinics we are pioneers not only in the execution, but also in the planning of hair transplantation, giving you the ability to see the growth of your transplanted hair and predict your final look.',
        'Why we chose the Force HT artificial intelligence application:'],
      l: ['Better understanding: it helps the patient understand the process and gain insight into the expected outcome.',
        'Optimal graft distribution: it ensures the best use of the available hair follicles for natural density.',
        'Long-term preservation: it protects the recipient area from thinning and ensures the donor area is preserved for future needs.'] },
    { t: 'Hairline design: asymmetrically symmetrical placement', media: { video: 'hairline-distance' },
      p: ['Hairline design makes the difference between a successful, \u201cinvisible\u201d hair transplant and one with a fake, unnatural result. Our medical teams, led by the internationally renowned plastic surgeon Dr Anastasios Vekris, redesign the natural hairline and its characteristics, personalising the result by:'],
      l: ['Creating asymmetrical symmetry in graft placement, with a \u201cjagged\u201d line along the entire length of the hairline',
        'Taking into account the shape of the patient\u2019s face, gender, age and ethnicity',
        'Considering the quality of the hair, the degree of hair loss and the potential of the donor area',
        'Accounting for the natural regression of the hairline over time to ensure a natural result in the long term'] },
    { t: 'Option to extract body and face hair grafts', media: { video: 'body-hair' },
      p: ['We are likely the only clinic in Greece where our doctors have successfully applied the technique of extracting body and facial hair grafts in cases of poor donor areas. This innovative technique provides a solution for people who wish to have a hair transplant but lack sufficient donor hair on their scalp.',
        'It is a highly specialised and demanding technique, and consequently it is performed in only a few clinics by very experienced medical teams, such as those at Advanced Hair Clinics.',
        'When hair follicles from areas other than the scalp are chosen, they are selected with the utmost care, and the plan is adjusted accordingly, with hairline design and hair follicle distribution creating a better coverage effect. The result is a satisfying improvement in density and hair growth, even in cases where other medical teams would fail.'] },
    { t: 'Our relationship doesn\'t end after surgery', media: { video: 'aftercare' },
      p: ['At Advanced Hair Clinics, we stand by our patients, providing detailed information and guidance both before and after the hair transplant.',
        'Our surgeons, nurses and clinic consultants communicate regularly with patients over the following 12 months, confirming that they continue to receive the necessary conservative treatment and that the growth of the transplanted hair progresses at the expected rate.',
        'At Advanced Hair Clinics, patients who trust us become \u201cour people\u201d and know they can turn to us at any time with any questions or concerns.'] },
  ];
  const WHY_DUR = 9000;
  const tabs = $('#why-tabs');
  const media = $('#why-media');
  const panel = $('#why-panel');
  document.documentElement.style.setProperty('--why-dur', `${WHY_DUR / 1000}s`);
  tabs.innerHTML = why.map((w, i) => `<button type="button" role="tab" id="why-t${i}" aria-controls="why-panel" aria-selected="${i === 0}" data-i="${i}"><span class="bar" aria-hidden="true"></span>${w.t}</button>`).join('');
  media.innerHTML = why.map((w) => w.media.video
    ? `<video muted loop playsinline preload="none" poster="assets/video/${w.media.video}-poster.webp" aria-hidden="true"><source src="assets/video/${w.media.video}.mp4" type="video/mp4"></video>`
    : `<img src="${w.media.img}" alt="" loading="lazy">`).join('');
  const mediaEls = [...media.children];
  let wIdx = 0;
  let wTimer;
  let wStart = 0;
  let wRemain = WHY_DUR;
  let whyVisible = false;
  let wExpanded = false;
  let wHover = false;
  const stage = $('.why-stage');
  // Auto-advance pauses while the reader hovers the panel or has it expanded.
  const schedule = (ms) => {
    clearTimeout(wTimer);
    if (reduceMotion || !whyVisible) return;
    wStart = performance.now();
    wRemain = ms;
    wTimer = setTimeout(() => showWhy((wIdx + 1) % why.length), ms);
  };
  const hold = () => {
    if (tabs.classList.contains('is-held')) return;
    clearTimeout(wTimer);
    wRemain = Math.max(800, wRemain - (performance.now() - wStart));
    tabs.classList.add('is-held');
  };
  const release = () => {
    if (wExpanded || wHover || !tabs.classList.contains('is-held')) return;
    tabs.classList.remove('is-held');
    schedule(wRemain);
  };
  const showWhy = (i, user) => {
    wIdx = i;
    wExpanded = false;
    const w = why[i];
    $$('button', tabs).forEach((b) => b.setAttribute('aria-selected', b.dataset.i == i));
    mediaEls.forEach((el, k) => {
      el.classList.toggle('is-active', k === i);
      if (el.tagName === 'VIDEO') {
        if (k === i && whyVisible && !reduceMotion) { el.preload = 'auto'; el.play().catch(() => {}); } else el.pause();
      }
    });
    panel.setAttribute('aria-labelledby', `why-t${i}`);
    panel.classList.add('is-swapping');
    setTimeout(() => {
      const [first, ...rest] = w.p;
      const extra = rest.map((x) => `<p>${x}</p>`).join('') + (w.l ? `<ul>${w.l.map((x) => `<li>${x}</li>`).join('')}</ul>` : '');
      panel.innerHTML = `<h3>${w.t}</h3><p>${first}</p>`
        + (extra ? `<div class="why-more" id="why-more" hidden>${extra}</div><button type="button" class="why-toggle" aria-expanded="false" aria-controls="why-more">Read more</button>` : '');
      panel.classList.remove('is-swapping');
    }, reduceMotion ? 0 : 200);
    if (user && innerWidth <= 1120) $$('button', tabs)[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    tabs.classList.remove('is-held');
    schedule(WHY_DUR);
    if (wHover) hold();
  };
  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('.why-toggle');
    if (!btn) return;
    const more = $('#why-more', panel);
    wExpanded = more.hidden;
    more.hidden = !wExpanded;
    btn.textContent = wExpanded ? 'Show less' : 'Read more';
    btn.setAttribute('aria-expanded', wExpanded);
    if (wExpanded) hold(); else release();
  });
  stage.addEventListener('mouseenter', () => { wHover = true; hold(); });
  stage.addEventListener('mouseleave', () => { wHover = false; release(); });
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showWhy(+b.dataset.i, true); });
  tabs.addEventListener('keydown', (e) => {
    const vertical = innerWidth > 1120;
    const next = vertical ? 'ArrowDown' : 'ArrowRight';
    const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
    if (e.key !== next && e.key !== prev) return;
    e.preventDefault();
    const i = (wIdx + (e.key === next ? 1 : -1) + why.length) % why.length;
    showWhy(i, true);
    $$('button', tabs)[i].focus();
  });
  new IntersectionObserver(([en]) => {
    whyVisible = en.isIntersecting;
    if (whyVisible) { showWhy(wIdx); return; }
    clearTimeout(wTimer);
    mediaEls.forEach((el) => { if (el.tagName === 'VIDEO') el.pause(); });
  }, { threshold: 0.35 }).observe($('.why-stage'));
  showWhy(0);

  /* ---------- Meet Dr Vekris: Read more ---------- */
  const meetBtn = $('.meet-toggle');
  if (meetBtn) meetBtn.addEventListener('click', () => {
    const more = $('#meet-more');
    more.hidden = !more.hidden;
    meetBtn.textContent = more.hidden ? 'Read more' : 'Show less';
    meetBtn.setAttribute('aria-expanded', !more.hidden);
    setupJourney();
  });

  /* ---------- Journey: pinned horizontal scroll ---------- */
  const journey = $('.journey');
  const jTrack = $('#journey-track');
  const jBar = $('.journey-bar span');
  const desktopPin = matchMedia('(min-width: 1121px)');
  const setupJourney = () => {
    const native = reduceMotion || !desktopPin.matches;
    journey.classList.toggle('is-native', native);
    if (native) { journey.style.height = ''; return; }
    const dist = jTrack.scrollWidth - innerWidth;
    journey.style.height = `${innerHeight + Math.max(0, dist)}px`;
    journey.dataset.dist = Math.max(0, dist);
    moveJourney();
  };
  // Timeline nodes and arrows; the rail fills up to the middle of the window.
  const jCards = $$('.j-card', jTrack);
  jCards.forEach((c, i) => {
    const node = document.createElement('span');
    node.className = 'j-node';
    node.setAttribute('aria-hidden', 'true');
    node.textContent = i === jCards.length - 1 ? '\u2713' : i + 1;
    const arrow = document.createElement('span');
    arrow.className = 'j-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    c.prepend(node, arrow);
  });
  const fillTimeline = (shift, viewW) => {
    const start = jCards[0].offsetLeft;
    const reach = shift + viewW * 0.6;
    jTrack.style.setProperty('--fill', `${Math.max(0, reach - start)}px`);
    jCards.forEach((c) => c.classList.toggle('is-reached', c.offsetLeft <= reach));
  };
  const moveJourney = () => {
    if (journey.classList.contains('is-native')) return;
    const dist = +journey.dataset.dist || 0;
    const top = journey.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / (journey.offsetHeight - innerHeight || 1)));
    jTrack.style.transform = `translate3d(${-p * dist}px,0,0)`;
    jBar.style.width = `${p * 100}%`;
    fillTimeline(p * dist + (p > 0.98 ? innerWidth : 0), innerWidth);
  };
  addEventListener('scroll', moveJourney, { passive: true });
  addEventListener('resize', setupJourney);
  addEventListener('load', setupJourney);
  setupJourney();
  if (journey.classList.contains('is-native')) fillTimeline(0, jTrack.clientWidth);
  jTrack.addEventListener('scroll', () => {
    if (!journey.classList.contains('is-native')) return;
    const max = jTrack.scrollWidth - jTrack.clientWidth;
    jBar.style.width = `${max ? (jTrack.scrollLeft / max) * 100 : 0}%`;
    fillTimeline(jTrack.scrollLeft + (jTrack.scrollLeft >= max - 2 ? jTrack.clientWidth : 0), jTrack.clientWidth);
  }, { passive: true });

  /* ---------- Instagram ticker (recent posts linking to the profile) ---------- */
  const insta = Array.from({ length: 10 }, (_, i) => `assets/img/insta/post-${String(i + 1).padStart(2, '0')}.webp`);
  const tTrack = $('.ticker-track');
  const tile = (n) => `<li><a href="https://www.instagram.com/advanced_hair_clinics/" target="_blank" rel="noopener" aria-label="View Advanced Hair Clinics on Instagram"><img src="${n}" alt="" loading="lazy" width="396" height="527"></a></li>`;
  tTrack.innerHTML = insta.map(tile).join('') + insta.map(tile).join('').replace(/<li>/g, '<li aria-hidden="true">').replace(/<a /g, '<a tabindex="-1" ');

})();
