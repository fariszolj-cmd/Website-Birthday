// ===== CONFIG =====
const VALID_NAMES = ['azra', 'azra cokoja', 'cokoja azra', 'cokoja'];

// ===== ELEMENTS =====
const screenName = document.getElementById('screen-name');
const screenChoice = document.getElementById('screen-choice');
const screenCelebration = document.getElementById('screen-celebration');
const nameInput = document.getElementById('nameInput');
const errorMsg = document.getElementById('errorMsg');
const btnEnter = document.getElementById('btnEnter');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const burstOverlay = document.getElementById('burstOverlay');
const confettiCanvas = document.getElementById('confetti-canvas');

// ===== NAME ENTRY =====
function normalizeAndCheckName(input) {
  const cleaned = input.trim().toLowerCase().replace(/\s+/g, ' ');
  return VALID_NAMES.some(name => cleaned === name);
}

function handleNameEntry() {
  const val = nameInput.value;
  if (normalizeAndCheckName(val)) {
    errorMsg.textContent = '';
    screenName.classList.add('hidden');
    screenChoice.classList.remove('hidden');
  } else {
    errorMsg.textContent = 'wrong baby try again ❤️';
  }
}

btnEnter.addEventListener('click', handleNameEntry);
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleNameEntry();
});

// ===== NAW BUTTON EVASION =====
let evadeCount = 0;

function evadeButton() {
  evadeCount++;
  const btn = btnNo;
  const card = document.querySelector('.card');
  const cardRect = card.getBoundingClientRect();
  const btnW = btn.offsetWidth || 100;
  const btnH = btn.offsetHeight || 40;

  const overflow = 0.2;
  const rangeX = cardRect.width * (1 + overflow * 2);
  const rangeY = cardRect.height * (1 + overflow * 2);
  const newX = -cardRect.width * overflow + Math.random() * rangeX;
  const newY = -cardRect.height * overflow + Math.random() * rangeY;

  // Move button to card-level so it can roam freely
  if (btn.parentElement !== card) {
    card.appendChild(btn);
  }
  btn.style.position = 'absolute';
  btn.style.left = newX + 'px';
  btn.style.top = newY + 'px';
  btn.style.zIndex = '5';

  const messages = [
    'nice try 😘',
    'stop it 🤭',
    'not today 💅',
    'keep trying ❤️',
    'just give up 💀',
    'too slow 😏',
    'never gonna catch me 🏃',
    'lmaoo okay you win 🏆',
    'still going? 😂',
    'you never learn 💀',
    'give up already 🙄',
    'persistent huh 😏',
    'ok you got me 🥹',
  ];
  const idx = (evadeCount - 1) % messages.length;
  btn.textContent = messages[idx];
}

// Reset button position when going back to choice screen
function resetNoButton() {
  const parent = document.querySelector('.choice-buttons');
  if (btnNo.parentElement !== parent) {
    parent.appendChild(btnNo);
  }
  btnNo.style.position = '';
  btnNo.style.left = '';
  btnNo.style.top = '';
  btnNo.style.zIndex = '';
  btnNo.textContent = 'naw';
  evadeCount = 0;
}

btnNo.addEventListener('mouseover', evadeButton);
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  evadeButton();
}, { passive: false });
btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  evadeButton();
});

// ===== HELL YEAH =====
btnYes.addEventListener('click', function() {
  playBirthdaySong();
  burstOverlay.classList.add('show');
  startConfetti();
  createHeartRain();

  setTimeout(() => {
    burstOverlay.classList.remove('show');
    resetNoButton();
    screenChoice.classList.add('hidden');
    screenCelebration.classList.remove('hidden');
    document.body.classList.add('gallery-open');
    intensifySparkles();
  }, 1200);
});

btnYes.addEventListener('touchend', (e) => {
  e.preventDefault();
  btnYes.click();
});

// ===== CONFETTI =====
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;
let confettiRAF;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function startConfetti() {
  confettiPieces = [];
  const colors = ['#ff2d55', '#ff6b8a', '#ff9a9e', '#fad0c4', '#fbc2eb', '#a18cd1', '#ffd700', '#ff69b4'];
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
    });
  }
  confettiRunning = true;
  animateConfetti();
}

function animateConfetti() {
  if (!confettiRunning) return;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  let allDone = true;
  for (const p of confettiPieces) {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.rotSpeed;
    if (p.y < confettiCanvas.height + 20) allDone = false;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  if (!allDone) {
    confettiRAF = requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
  }
}

// ===== HEART RAIN =====
function createHeartRain() {
  const container = document.getElementById('sparkleContainer');
  const emojis = ['❤️', '💖', '💗', '💕', '✨', '🎂', '🥳'];
  for (let i = 0; i < 40; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 4 + 3) + 's';
    heart.style.animationDelay = (Math.random() * 5) + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
  }
}

// ===== SPARKLES =====
function initSparkles() {
  const container = document.getElementById('sparkleContainer');
  for (let i = 0; i < 50; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.width = (Math.random() * 4 + 2) + 'px';
    sparkle.style.height = sparkle.style.width;
    sparkle.style.animationDuration = (Math.random() * 6 + 4) + 's';
    sparkle.style.animationDelay = (Math.random() * 8) + 's';
    const colors = ['#ff6b8a', '#ff9a9e', '#fad0c4', '#fbc2eb', '#a18cd1'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(sparkle);
  }
}

function intensifySparkles() {
  const container = document.getElementById('sparkleContainer');
  for (let i = 0; i < 80; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.width = (Math.random() * 6 + 3) + 'px';
    sparkle.style.height = sparkle.style.width;
    sparkle.style.animationDuration = (Math.random() * 4 + 2) + 's';
    sparkle.style.animationDelay = (Math.random() * 3) + 's';
    const colors = ['#ff2d55', '#ff6b8a', '#ffd700', '#ff9a9e', '#fbc2eb', '#a18cd1', '#ff69b4'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.boxShadow = '0 0 12px ' + sparkle.style.background;
    container.appendChild(sparkle);
  }
}

initSparkles();

// ===== BACKGROUND AUDIO =====
function playBirthdaySong() {
  const audio = document.getElementById('birthdaySong');
  if (audio) {
    audio.currentTime = 96;
    audio.play().catch(() => {
      // Autoplay blocked - play on first user tap
      const tapPlay = () => {
        audio.play();
        document.removeEventListener('click', tapPlay);
        document.removeEventListener('touchstart', tapPlay);
      };
      document.addEventListener('click', tapPlay);
      document.addEventListener('touchstart', tapPlay);
    });
  }
}

// ===== REEL =====
const mediaFiles = [
  { src: 'Azra/0A710B1C-5134-427E-80C8-E94E2B35373A.JPG', type: 'img' },
  { src: 'Azra/2FE8DF4B-F46F-4E56-93C8-93C74C68EFB8.JPG', type: 'img' },
  { src: 'Azra/3119ff38-ef75-436b-9007-ae454ed4464f.JPG', type: 'img' },
  { src: 'Azra/324461B2-DFAA-43AC-BB1E-BCDF17905E52.JPG', type: 'img' },
  { src: 'Azra/5F63873F-42F9-47E5-9B10-49C8F649E871.JPG', type: 'img' },
  { src: 'Azra/70DFC1EC-E48C-411C-AFF7-171BBEF792FD.JPG', type: 'img' },
  { src: 'Azra/7EBE1CCD-B870-432B-B3C1-F55D34CDA9F9.JPG', type: 'img' },
  { src: 'Azra/98633d3b-9081-4b31-8df0-a82cf5bb1ce0.JPG', type: 'img' },
  { src: 'Azra/C7A69E74-7443-4939-9AA1-BB1D77BF7FFF.JPG', type: 'img' },
  { src: 'Azra/IMG_1794.JPG', type: 'img' },
  { src: 'Azra/IMG_8829.jpg', type: 'img' },
  { src: 'Azra/355345b4421d4a76a35e80fb1950da72.MOV', type: 'video' },
];

function buildReel() {
  const reel = document.getElementById('reel');
  reel.innerHTML = '';
  mediaFiles.forEach((file) => {
    const div = document.createElement('div');
    div.className = 'reel-slide';
    if (file.type === 'video') {
      const vid = document.createElement('video');
      vid.src = file.src;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.preload = 'metadata';
      div.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = file.src;
      img.loading = 'lazy';
      div.appendChild(img);
    }
    reel.appendChild(div);
  });
}

function updateReelProgress() {
  const reel = document.getElementById('reel');
  const bar = document.getElementById('reel-progress');
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const reelTop = reel.getBoundingClientRect().top + window.scrollY;
  const reelHeight = reel.scrollHeight;
  const viewH = window.innerHeight;
  const maxScroll = reelHeight - viewH;
  const currentScroll = scrollTop - reelTop;
  const pct = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
  bar.style.width = pct + '%';
}

window.addEventListener('scroll', updateReelProgress);
buildReel();
