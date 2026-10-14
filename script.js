// ---------------------------------------------------------------
// Mohammed Ahmed Hejairi — Portfolio interactivity
// Motion powered by StringTune (https://string-tune.fiddle.digital)
// ---------------------------------------------------------------

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Respect reduced motion preference
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// ---------------- StringTune: smooth scroll + effects ----------------
let stringTune = null;

if (!reduceMotion && window.StringTune) {
  const ST = window.StringTune;
  stringTune = ST.StringTune.getInstance();
  stringTune.scrollDesktopMode = 'smooth';
  stringTune.scrollMobileMode = 'default';
  stringTune.speed = 0.1;

  stringTune.use(ST.StringSplit);
  stringTune.use(ST.StringProgress);
  stringTune.use(ST.StringParallax);
  if (finePointer) {
    stringTune.use(ST.StringMagnetic);
    stringTune.use(ST.StringTilt);
  }
  stringTune.start(60);
} else {
  // No motion: show everything immediately
  document.documentElement.classList.remove('js');
}

// Stagger reveal delays among siblings in the same grid/list
document.querySelectorAll('.reveal').forEach(el => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.setProperty('--i', siblings.indexOf(el));
});

// Anchor links go through StringTune so they glide with smooth scroll
const NAV_OFFSET = 62;
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = id === '#top' ? document.body : document.querySelector(id);
    if (!target || !stringTune) return;
    e.preventDefault();
    const y = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    stringTune.scrollTo(Math.max(0, y));
    history.replaceState(null, '', id);
  });
});

// ---------------- Scroll progress bar + active nav link ----------------
const progressBar = document.getElementById('scrollProgress');
const navAnchors = [...navLinks.querySelectorAll('a')];
const sections = navAnchors
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.setProperty('--p', max > 0 ? window.scrollY / max : 0);

    const mark = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach(sec => { if (sec.offsetTop <= mark) current = sec.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------------- Pointer-follow glow on cards ----------------
if (finePointer) {
  document.querySelectorAll('.glow').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// ---------------- Terminal typing effect ----------------
const terminalLines = [
  { type: 'cmd', text: './load_profile.py' },
  { type: 'out', text: 'name        : Mohammed Ahmed Hejairi' },
  { type: 'out', text: 'role        : Quant Research · Financial Data Science' },
  { type: 'out', text: 'model       : real_estate_valuation.xgb' },
  { type: 'out', text: 'accuracy_gain: +70%  (SHAP-validated)' },
  { type: 'out', text: 'status      : open_to_work = True' },
];

const terminalBody = document.getElementById('terminalBody');

function renderStatic() {
  terminalBody.innerHTML = '';
  terminalLines.forEach((line, i) => {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    if (i === 0) {
      div.innerHTML = `<span class="prompt">&gt;</span> <span class="path">${line.text}</span>`;
    } else {
      div.textContent = line.text;
    }
    terminalBody.appendChild(div);
  });
}

function typeTerminal() {
  terminalBody.innerHTML = '';
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= terminalLines.length) return;
    const line = terminalLines[lineIndex];
    const div = document.createElement('div');
    div.className = 'terminal-line';
    terminalBody.appendChild(div);

    const prefix = lineIndex === 0 ? '> ' : '';
    const full = prefix + line.text;
    let charIndex = 0;
    const speed = lineIndex === 0 ? 45 : 12;

    const interval = setInterval(() => {
      charIndex++;
      const shown = full.slice(0, charIndex);
      if (lineIndex === 0) {
        div.innerHTML = `<span class="prompt">&gt;</span> <span class="path">${shown.slice(2)}</span><span class="cursor"></span>`;
      } else {
        div.innerHTML = `${shown}<span class="cursor"></span>`;
      }
      if (charIndex >= full.length) {
        clearInterval(interval);
        div.querySelector('.cursor')?.remove();
        lineIndex++;
        setTimeout(typeLine, lineIndex === 1 ? 260 : 90);
      }
    }, speed);
  }

  typeLine();
}

if (reduceMotion) {
  renderStatic();
} else {
  // wait for the hero intro to settle before typing
  setTimeout(typeTerminal, 700);
}

// ---------------- Ticker tape ----------------
const tickerItems = [
  'CAP RATE', 'NPV', 'CASH-ON-CASH RETURN', 'XGBOOST', 'SHAP ANALYSIS',
  'ECONOMETRICS', 'PREDICTIVE MODELING', '+70% ACCURACY', 'PYTHON', 'SQL',
  'R', 'TABLEAU', 'POWER BI', 'BAYANATI', 'QUANT SOCIETY',
];

function buildTicker() {
  const track = document.getElementById('tickerTrack');
  const set = tickerItems.map((item, i) => {
    const marker = i % 3 === 0 ? '<span class="up">▲</span>' : '<span class="flat">▪</span>';
    return `<span class="ticker-item mono">${marker} ${item}</span>`;
  }).join('');
  // duplicate for seamless loop
  track.innerHTML = set + set;
}
buildTicker();

// ---------------- In-view triggers: impact bars + stat counters ----------------
function countUp(el) {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = prefix + Math.round(target * eased).toLocaleString('en-US') + suffix;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const bars = document.querySelectorAll('.impact-bar-fill');
const counters = document.querySelectorAll('[data-count]');

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.w) el.style.width = el.dataset.w + '%';
      if (el.dataset.count) countUp(el);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => observer.observe(bar));
  counters.forEach(c => observer.observe(c));
} else {
  bars.forEach(bar => bar.style.width = bar.dataset.w + '%');
}
