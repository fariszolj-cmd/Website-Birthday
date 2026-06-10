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
  const card = document.getElementById('app-card');
  const cardRect = card.getBoundingClientRect();
  const btnW = btn.offsetWidth || 100;
  const btnH = btn.offsetHeight || 40;

  const overflow = 0.2;
  const rangeX = cardRect.width * (1 + overflow * 2);
  const rangeY = cardRect.height * (1 + overflow * 2);
  const newX = -cardRect.width * overflow + Math.random() * rangeX;
  const newY = -cardRect.height * overflow + Math.random() * rangeY;

  if (btn.parentElement !== card) {
    card.appendChild(btn);
  }
  btn.style.position = 'absolute';
  btn.style.left = newX + 'px';
  btn.style.top = newY + 'px';
  btn.style.zIndex = '5';

  const messages = [
    'nice try',
    'stop it',
    'not today',
    'keep trying',
    'just give up',
    'too slow',
    'never gonna catch me',
    'lmaoo okay you win',
    'still going?',
    'you never learn',
    'give up already',
    'persistent huh',
    'ok you got me',
  ];
  const idx = (evadeCount - 1) % messages.length;
  btn.textContent = messages[idx];
}

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

  setTimeout(() => {
    burstOverlay.classList.remove('show');
    resetNoButton();
    screenChoice.classList.add('hidden');
    screenCelebration.classList.remove('hidden');
    document.body.classList.add('gallery-open');
    setupGalleryObserver();
    revealCards();
    document.getElementById('scroll-arrow').style.display = 'none';
  }, 1200);
});

btnYes.addEventListener('touchend', (e) => {
  e.preventDefault();
  btnYes.click();
});

// ===== BACKGROUND AUDIO =====
function playBirthdaySong() {
  const audio = document.getElementById('birthdaySong');
  if (audio) {
    audio.currentTime = 96;
    audio.play().catch(() => {
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

// ===== AUTO-SCROLL GALLERY =====
const galleryItems = [
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

let autoScrollId = null;
let scrollPaused = false;

function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';
  galleryItems.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-slide';
    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.src;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.preload = 'metadata';
      div.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.loading = 'lazy';
      div.appendChild(img);
    }
    div.addEventListener('click', () => {
      scrollPaused = !scrollPaused;
    });
    grid.appendChild(div);
  });
}

function startAutoScroll() {
  stopAutoScroll();
  const speed = 1;
  autoScrollId = setInterval(() => {
    if (scrollPaused) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const current = window.scrollY;
    if (current >= maxScroll - 5) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy(0, speed);
    }
  }, 16);
}

function stopAutoScroll() {
  if (autoScrollId) clearInterval(autoScrollId);
}

function setupGalleryObserver() {
  const cards = document.querySelectorAll('.gallery-slide');
  cards.forEach((c, i) => {
    setTimeout(() => c.classList.add('visible'), i * 60);
  });
}

function revealCards() {
  setupGalleryObserver();
  startAutoScroll();
}

buildGallery();
