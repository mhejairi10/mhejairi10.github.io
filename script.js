// ---------------------------------------------------------------
// Mohammed Ahmed Hejairi — Portfolio interactivity
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
  typeTerminal();
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

// ---------------- Animate impact bars on scroll ----------------
const bars = document.querySelectorAll('.impact-bar-fill');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.w + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => observer.observe(bar));
} else {
  bars.forEach(bar => bar.style.width = bar.dataset.w + '%');
}
