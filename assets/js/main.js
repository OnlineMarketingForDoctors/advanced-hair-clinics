/* Advanced Hair Clinics · homepage interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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

  /* ---------- Reviews ---------- */
  // Ordered: male reviewers first, those naming Dr Vekris at the top.
  const reviews = [
    { n: 'Stelios Galanis', c: '#3B2A5C', t: 'I had my session 6 months ago and my result so far is absolutely amazing. I highly recommend the Clinic, Dr Vekris, Ms Agiant and the whole medical team. Thank you, you have changed my life!!' },
    { n: 'Paulos Papamichail', c: '#2E7D6B', t: 'Great job in Advanced Hair Clinics. Dr Vekris and the rest of the medical team are highly specialised and experienced. I had a two days session with great results in 12 months.' },
    { n: 'Kon Kal', c: '#4A4E9C', t: 'The Best Hair Clinic that you can find out there. Professional and highly experienced staff made me feel as comfortable as possible, by answering all of my questions from our first appointment. I had a 2 day hair implantation, the procedure was smooth and the doctors were excellent. I now know why people from all over the world prefer Mr. Vekris. If you want to look as you imagine, this is the place.' },
    { n: 'O V', c: '#C2185B', t: 'One can only recommend the clinics of Dr Anastasios Vekris, a highly professional team with high quality equipment in very secure environment. The right advise and perfect results. This is what I personally experienced and would recommend the team with no hesitation.' },
    { n: 'Zlatko Kljajic', c: '#5B6B7A', t: 'If you are looking for best clinic to do hair transplant, you do not need to waist your time exploring to whom you will give your trust. All protocols and methods for doing hair transplant in this clinic are on highest standard. Staff is very professional and they will explain you everything in details. The most important that results of hair transplants are really natural with no complication at all.' },
    { n: 'Apostolos Modas', c: '#7B5E3B', t: 'It is the second time I do a hair transplant with Advanced Hair Clinics. Both times everything was exceptional! High professionalism, personalized support/care, and excellent and natural result. Many thanks to everyone involved in my operation; namely Lilly, Alberta and Iro. Highly recommended.' },
    { n: 'Theodoros Thodas', c: '#1E88A8', t: 'I recently visited Advanced Hair Clinics, and I am truly impressed with the level of professionalism and expertise they demonstrated. From the initial consultation to the procedure itself, the team was incredibly attentive, knowledgeable, and thorough in addressing all my questions and concerns. What sets Advanced Hair Clinics apart is their personalized approach. They tailored a treatment plan specifically to my needs, ensuring optimal results. The procedure was virtually painless, and the aftercare instructions were detailed and easy to follow.' },
    { n: 'George Tsichlis', c: '#512DA8', t: 'I had my hair transplant three days ago, and the entire experience went smoothly with no pain or discomfort. Dr. Dimitris and his team were highly professional, and they made the time pass quickly in a relaxed and comfortable atmosphere. I had a great experience during the procedure. I would highly recommend them!' },
    { n: 'Marios Bompoulos', c: '#E67E22', t: 'Amazing experience. I performed hair transplant with excellent results. Extremely helpful and friendly staff. The whole processes was seamless. I highly recommend them to anyone who is looking for a hair transplant.' },
    { n: 'Jad', c: '#6A5ACD', t: 'I had my hair surgery a couple of days ago, and I must say, everything was perfect from start to finish. It was truly a 7-star experience. A huge thanks to Klodiana for her professionalism and to Dr. Alexandrios for his attention and care throughout the surgery.' },
    { n: 'Stefan Prikulovic', c: '#C0502B', t: 'Excellent experience with Advanced Hair Clinics. I chose the clinic because of my trust in Dr. Dimitris Alexandris and my expectations were fully met. Special thanks to Klodiana and Dr. Chorianopoulou for their professionalism, kindness, and support throughout the process. Highly recommended!' },
    { n: 'Eleni Theodorakopoulou', c: '#1565C0', t: 'Congratulations to the whole team of Advanced Hair Clinics. I solved my hairloss problem combining the unshaved FUE technique and conservative treatment of minoxidil and prp. My hair is now falling less and is thicker and more strong. Many thanks to Dr Anastasios Vekris and Dr Antonia Andriopoulou!' },
    { n: 'Maria Louiza Prosalenti', c: '#8E3B8A', t: 'I had my eyebrow transplant at Advanced Hair Clinics and I love it. I never thought having such a small change could do so much for my confidence. Dr. Vekris and his team were kind, confident and gave me valuable guidlines for recovery. Overall, I had an such an incredible experience and would highly recommend it.' },
    { n: 'Flora L', c: '#9C6B4E', t: 'Excellent services! The team is professional, friendly, and always makes me feel comfortable. Even with my last-minute schedule, they always find a way to accommodate me, which I truly appreciate. I have tried several clinics before, but this is one of the few places I keep coming back to. Highly recommend!' },
  ];
  const gSmall = '<svg class="g-logo" viewBox="0 0 48 48" aria-label="Google review"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const track = $('#reviews-track');
  const card = (r) => `
    <li class="review">
      <div class="review-top">
        <span class="avatar" style="background:${r.c}" aria-hidden="true">${esc(r.n[0])}</span>
        <div><p class="review-name">${esc(r.n)}</p><p class="review-meta"><span class="stars" aria-label="5 out of 5 stars">★★★★★</span></p></div>
        ${gSmall}
      </div>
      <p class="review-text is-clamped">${esc(r.t).replace(/Vekris/g, '<mark>Vekris</mark>')}</p>
    </li>`;
  track.innerHTML = reviews.map(card).join('');
  // Long reviews are capped at six lines so the cards stay a tidy, even height.
  const addReadMore = (scope) => $$('.review-text', scope).forEach((p) => {
    if (p.scrollHeight <= p.clientHeight + 2) return;
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'review-more';
    more.textContent = 'Read more';
    more.setAttribute('aria-expanded', 'false');
    more.addEventListener('click', () => {
      const open = p.classList.toggle('is-clamped') === false;
      more.textContent = open ? 'Show less' : 'Read more';
      more.setAttribute('aria-expanded', open);
    });
    p.after(more);
  });
  addReadMore(track);

  // Ticker: a second, hidden copy of the cards makes the loop seamless.
  // It runs on CSS and pauses on hover, keyboard focus or touch.
  if (!reduceMotion) {
    const copies = $$('.review', track).map((li) => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.inert = true;
      return c;
    });
    copies.forEach((c) => track.appendChild(c));
    const setSpeed = () => {
      const loop = track.scrollWidth / 2;
      track.style.setProperty('--ticker-dur', `${Math.round(loop / 45)}s`); // about 45px per second
    };
    setSpeed();
    addEventListener('resize', setSpeed);
    track.classList.add('is-ticking');
    const vp = $('.reviews-viewport');
    vp.addEventListener('touchstart', () => vp.classList.add('is-paused'), { passive: true });
    vp.addEventListener('touchend', () => setTimeout(() => vp.classList.remove('is-paused'), 2500));
  }

  /* ---------- Before & After ---------- */
  // Graft, hair and month figures are placeholders until the clinic supplies case data.
  const cases = [
    { f: 'hair-transplant-085-a', k: 'hair', label: 'FUE hair transplant', g: '3,800', h: '8,900', m: '12 months' },
    { f: 'hair-transplant-042-a', k: 'hair', label: 'FUE hair transplant', g: '3,500', h: '8,100', m: '12 months' },
    { f: 'hair-transplant-037-a', k: 'hair', label: 'Hairline restoration', g: '2,400', h: '5,300', m: '10 months' },
    { f: 'hair-transplant-089-c', k: 'hair', label: 'FUE hair transplant', g: '4,200', h: '9,800', m: '14 months' },
    { f: 'hair-transplant-107-a', k: 'hair', label: 'Crown restoration', g: '4,500', h: '10,400', m: '15 months' },
    { f: 'hair-transplant-126-e', k: 'hair', label: 'FUE hair transplant', g: '3,600', h: '8,300', m: '12 months' },
    { f: 'hair-transplant-090-a', k: 'hair', label: 'Crown restoration', g: '3,000', h: '6,900', m: '12 months' },
    { f: 'beard-transplant-009-d', k: 'beard', label: 'FUE beard transplant', g: '2,200', h: '4,100', m: '9 months' },
    { f: 'eyebrow-transplant-004-a', k: 'eyebrow', label: 'FUE eyebrow transplant', g: '450', h: '650', m: '8 months' },
  ];
  const thumbs = $('#ba-thumbs');
  thumbs.innerHTML = cases.map((c, i) => `
    <li data-kind="${c.k}"><button type="button" aria-pressed="${i === 0}" data-i="${i}" aria-label="Show ${c.label} case">
      <img src="assets/img/ba/${c.f}.webp" alt="" loading="lazy" width="1000" height="625"><span class="t-label">${c.label}</span>
    </button></li>`).join('');
  const baMain = $('#ba-main');
  const showCase = (i) => {
    const c = cases[i];
    $$('button', thumbs).forEach((b) => b.setAttribute('aria-pressed', b.dataset.i == i));
    baMain.classList.add('is-swapping');
    setTimeout(() => {
      baMain.src = `assets/img/ba/${c.f}.webp`;
      baMain.alt = `Before and after, ${c.label}`;
      $('#ba-type').textContent = c.label;
      $('#ba-grafts').textContent = c.g;
      $('#ba-hairs').textContent = c.h;
      $('#ba-months').textContent = c.m;
      const done = () => baMain.classList.remove('is-swapping');
      (baMain.decode ? baMain.decode() : Promise.resolve()).then(done, done);
    }, reduceMotion ? 0 : 260);
  };
  thumbs.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) showCase(+b.dataset.i);
  });
  showCase(0);
  $$('.filter button').forEach((btn) => btn.addEventListener('click', () => {
    $$('.filter button').forEach((b) => b.setAttribute('aria-selected', b === btn));
    const f = btn.dataset.filter;
    let first = -1;
    $$('li', thumbs).forEach((li, i) => {
      const show = f === 'all' || li.dataset.kind === f;
      li.hidden = !show;
      if (show && first < 0) first = i;
    });
    if (first >= 0) showCase(first);
  }));

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
  showService(0);
  // Warm the cache so swaps feel instant
  addEventListener('load', () => services.forEach((s) => { const im = new Image(); im.src = `assets/img/gen/${s.img}.webp`; }));

  /* ---------- Why choose us ---------- */
  // Full copy from the original homepage, lightly edited. The first paragraph shows;
  // the rest opens with Read more.
  const why = [
    { t: 'Hair transplantation exclusively by doctors', media: { img: 'assets/img/why/exclusively-doctors.webp' },
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
  const moveJourney = () => {
    if (journey.classList.contains('is-native')) return;
    const dist = +journey.dataset.dist || 0;
    const top = journey.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / (journey.offsetHeight - innerHeight || 1)));
    jTrack.style.transform = `translate3d(${-p * dist}px,0,0)`;
    jBar.style.width = `${p * 100}%`;
  };
  addEventListener('scroll', moveJourney, { passive: true });
  addEventListener('resize', setupJourney);
  addEventListener('load', setupJourney);
  setupJourney();
  jTrack.addEventListener('scroll', () => {
    if (!journey.classList.contains('is-native')) return;
    const max = jTrack.scrollWidth - jTrack.clientWidth;
    jBar.style.width = `${max ? (jTrack.scrollLeft / max) * 100 : 0}%`;
  }, { passive: true });

  /* ---------- Clinic tabs ---------- */
  const rTabs = $$('.region-tabs [role="tab"]');
  rTabs.forEach((t) => t.addEventListener('click', () => {
    rTabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', on);
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
  }));

  /* ---------- Instagram ticker (placeholder posts linking to the profile) ---------- */
  const insta = ['office', 'hair-macro', 'workshop', 'svc-beard', 'keynote', 'svc-women', 'hairline-design', 'consultation', 'award', 'svc-fue', 'ai-tablet', 'handshake'];
  const tTrack = $('.ticker-track');
  const tile = (n) => `<li><a href="https://www.instagram.com/advanced_hair_clinics/" target="_blank" rel="noopener" aria-label="View Advanced Hair Clinics on Instagram"><img src="assets/img/gen/${n}-sm.webp" alt="" loading="lazy" width="512" height="640"></a></li>`;
  tTrack.innerHTML = insta.map(tile).join('') + insta.map(tile).join('').replace(/<li>/g, '<li aria-hidden="true">').replace(/<a /g, '<a tabindex="-1" ');

  /* ---------- Editorial image reveal + gentle parallax ---------- */
  if (!reduceMotion) {
    const revealTargets = $$('.ba-frame, .why-media, .clinics-media img, .post-feature .post-img');
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

    const par = $$('.services-bg img, .cta-bg img, .reviews-bg img');
    const doPar = () => {
      par.forEach((img) => {
        const r = img.parentElement.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translate3d(0, ${p * -40}px, 0) scale(1.08)`;
      });
    };
    addEventListener('scroll', doPar, { passive: true });
    doPar();
  }
})();
