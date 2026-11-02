/* Advanced Hair Clinics · shared content blocks: reviews ticker, before & after gallery, video testimonials */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Reviews ---------- */
  if ($('#reviews-track')) {
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

  }

  /* ---------- Before & After ---------- */
  if ($('#ba-main')) {
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
        <img src="/assets/img/ba/${c.f}.webp" alt="" loading="lazy" width="1000" height="625"><span class="t-label">${c.label}</span>
      </button></li>`).join('');
    const baMain = $('#ba-main');
    const showCase = (i) => {
      const c = cases[i];
      $$('button', thumbs).forEach((b) => b.setAttribute('aria-pressed', b.dataset.i == i));
      baMain.classList.add('is-swapping');
      setTimeout(() => {
        baMain.src = `/assets/img/ba/${c.f}.webp`;
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

  }

  /* ---------- Video testimonials ---------- */
  const vids = [
    { id: 'GztrgiQqlYM', img: 'real-results', name: 'Real results: hair transplant at Advanced Hair Clinics', t: 'FUE Hair Transplant', g: '3,850', h: '8,565', d: '2' },
    { id: 'nj68iQf_e6Q', img: 'steve-tesser', name: 'Hair transplant: Steve Tesser', t: 'FUE Hair Transplant', g: '2,543', h: '5,403', d: '2' },
    { id: 'adFcivrSJjg', img: 'my-experience', name: 'Hair transplant: my experience at Advanced Hair Clinics', t: 'FUE Hair Transplant', g: '2,287', h: '5,511', d: '1' },
    { id: '_lF3QzLdcqQ', img: 'dimos-beke', name: 'Dimos Beke: my experience at Advanced Hair Clinics', t: 'Unshaven FUE Hair Transplant', g: '1,820', h: '4,145', d: '1' },
    { id: 'g4F6fGoYw1A', img: 'result-after', name: 'Result after hair transplant', t: 'FUE Hair Transplant', g: '2,318', h: '4,103', d: '1' },
  ];
  const vtPlayer = $('#vt-player');
  const vtList = $('#vt-list');
  if (vtPlayer && vtList) {
    let vCur = 0;
    const vSrc = (v) => `/assets/img/testimonials/${v.img}.webp`;
    vtList.innerHTML = vids.map((v, i) => `<li><button type="button" data-i="${i}" aria-current="${i === 0}">
      <span class="vt-thumb"><img src="${vSrc(v)}" alt="" loading="lazy" width="640" height="360"></span>
      <span><strong>${v.name}</strong><span>${v.g} grafts</span></span></button></li>`).join('');
    const showVid = (i, play) => {
      vCur = i;
      const v = vids[i];
      $$('button', vtList).forEach((b) => b.setAttribute('aria-current', b.dataset.i == i));
      $('#vt-name').textContent = v.name;
      $('#vt-stats').innerHTML = [['Treatment', v.t], ['Grafts', v.g], ['Hairs', v.h], ['Treatment days', v.d]]
        .filter(([, val]) => val).map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join('');
      if (play) {
        vtPlayer.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1" title="${v.name}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
        return;
      }
      vtPlayer.innerHTML = `<button type="button" class="vt-poster" aria-label="Play video: ${v.name}"><img src="${vSrc(v)}" alt="${v.name}" width="1600" height="900"><span class="vt-play" aria-hidden="true"></span></button>`;
    };
    vtPlayer.addEventListener('click', (e) => { if (e.target.closest('.vt-poster')) showVid(vCur, true); });
    vtList.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      showVid(+b.dataset.i, false);
      if (innerWidth <= 1120) vtPlayer.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    showVid(0, false);
  }

})();
