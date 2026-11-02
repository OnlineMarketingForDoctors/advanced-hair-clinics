/* Advanced Hair Clinics · Contact form */
(() => {
  const form = document.getElementById('cf');
  if (!form) return;

  /* ---------- Country of residence ---------- */
  const codes = 'AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VN VU WS XK YE ZA ZM ZW'.split(' ');
  let names;
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    names = codes.map((c) => ({ c, n: c === 'XK' ? 'Kosovo' : dn.of(c) }));
  } catch (e) {
    names = codes.map((c) => ({ c, n: c }));
  }
  names.sort((a, b) => a.n.localeCompare(b.n));
  const top = ['GR', 'CY', 'GB', 'DE', 'US'];
  const sel = document.getElementById('cf-country');
  const opt = ({ c, n }) => { const o = document.createElement('option'); o.value = n; o.textContent = n; return o; };
  top.forEach((c) => sel.append(opt(names.find((x) => x.c === c))));
  const sep = document.createElement('option'); sep.disabled = true; sep.textContent = '──────────'; sel.append(sep);
  names.filter((x) => !top.includes(x.c)).forEach((x) => sel.append(opt(x)));

  /* ---------- Submit ---------- */
  // No form backend yet: the message opens in the visitor's email app, addressed to the clinic.
  const err = document.getElementById('cf-error');
  const done = document.getElementById('cf-done');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      err.hidden = false; done.hidden = true;
      const bad = form.querySelector(':invalid');
      if (bad) bad.focus();
      return;
    }
    err.hidden = true;
    const f = Object.fromEntries(new FormData(form));
    const body = `Name: ${f.name} ${f.lastname}\nEmail: ${f.email}\nPhone/Mobile: ${f.phone}\nCountry of residence: ${f.country}\n\n${f.message || ''}`;
    location.href = `mailto:info@advancedhairclinics.gr?subject=${encodeURIComponent('Contact form: ' + f.name + ' ' + f.lastname)}&body=${encodeURIComponent(body)}`;
    done.hidden = false;
  });
})();
