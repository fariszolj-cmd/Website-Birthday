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
      openViewer(i);
    });
    grid.appendChild(div);
  });
}

let viewerIndex = 0;

function openViewer(index) {
  scrollPaused = true;
  viewerIndex = index;
  const item = galleryItems[index];
  const content = document.getElementById('viewer-content');
  content.innerHTML = '';
  if (item.type === 'video') {
    const vid = document.createElement('video');
    vid.src = item.src;
    vid.controls = true;
    vid.autoplay = true;
    content.appendChild(vid);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    content.appendChild(img);
  }
  document.getElementById('viewer').classList.remove('hidden');
  document.getElementById('viewer-counter').textContent = (index + 1) + ' / ' + galleryItems.length;
}

function closeViewer() {
  document.getElementById('viewer').classList.add('hidden');
  document.getElementById('viewer-content').innerHTML = '';
  scrollPaused = false;
}

document.getElementById('viewer-close').addEventListener('click', closeViewer);
document.getElementById('viewer-prev').addEventListener('click', () => {
  if (viewerIndex > 0) openViewer(viewerIndex - 1);
});
document.getElementById('viewer-next').addEventListener('click', () => {
  if (viewerIndex < galleryItems.length - 1) openViewer(viewerIndex + 1);
});
document.addEventListener('keydown', (e) => {
  if (document.getElementById('viewer').classList.contains('hidden')) return;
  if (e.key === 'Escape') closeViewer();
  if (e.key === 'ArrowLeft' && viewerIndex > 0) openViewer(viewerIndex - 1);
  if (e.key === 'ArrowRight' && viewerIndex < galleryItems.length - 1) openViewer(viewerIndex + 1);
});

function startAutoScroll() {
  stopAutoScroll();
  const speed = 2;
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
    setTimeout(() => c.classList.add('visible'), i * 30);
  });
}

function revealCards() {
  setupGalleryObserver();
  startAutoScroll();
}

// ===== SIDE BIRTHDAY COMMENTS =====
const sideMessages = [
  'Happy birthday gorgeous ❤️',
  'Another year of being perfect ✨',
  "You're the cutest 🎂",
  'Birthday queen 👑',
  'So glad you were born 🎉',
  'You make life better 💕',
  'The prettiest girl alive 😍',
  'My favorite person 🥰',
  'Born to be amazing 🌟',
  "World's cutest birthday girl 🎈",
  'A whole year older, still fine 🔥',
  'Made for greatness 💫',
  'My everything 💖',
  'You were born to shine 🌸',
  'Best thing that happened to me 💗',
];

function spawnSideComment() {
  const container = document.getElementById('side-comments');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'side-comment';
  el.textContent = sideMessages[Math.floor(Math.random() * sideMessages.length)];

  const isLeft = Math.random() > 0.5;
  const top = Math.random() * 80 + 5;

  el.style.left = isLeft ? '8px' : '';
  el.style.right = isLeft ? '' : '8px';
  el.style.top = top + '%';
  el.style.textAlign = isLeft ? 'left' : 'right';
  el.style.fontSize = (0.75 + Math.random() * 0.3) + 'rem';

  container.appendChild(el);
  setTimeout(() => el.remove(), 8000);
}

let sideCommentInterval = null;

function startSideComments() {
  stopSideComments();
  sideCommentInterval = setInterval(spawnSideComment, 3000);
}

function stopSideComments() {
  if (sideCommentInterval) {
    clearInterval(sideCommentInterval);
    sideCommentInterval = null;
  }
}

// Patch revealCards to also start side comments
const originalReveal = revealCards;
revealCards = function() {
  originalReveal();
  startSideComments();
  observeSections();
};

// ===== SCROLL REVEAL SECTIONS =====
function observeSections() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

buildGallery();
