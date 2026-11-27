/**
 * Vishal's Birthday Surprise — Interactive Logic
 * - Classic Happy Birthday song via audio/happy-birthday.mp3 (no replacement if missing)
 * - Screen 1 (Welcome) -> Screen 2 (Birthday Page + Letter Trigger)
 *   -> Screen 3 (Special Gift + Secret Question)
 *   -> Screen 4 (Horizontal Photo Carousel + Envelope + Official Funny Contract + Signature)
 */
(function () {
  /* ========================================================
     1. VISHAL'S ACTUAL PHOTOGRAPHS (img/ + gi/)
     ======================================================== */
  const CARD_PHOTOS = [
    {
      file: 'img/WhatsApp Image 2026-11-27 at 09.27.25.jpeg',
      caption: 'Vishal The Legend 😎',
      frame: 'style-polaroid',
      sticker: '💖'
    },
    {
      file: 'img/WhatsApp Image 2026-11-27 at 12.27.18.jpeg',
      caption: 'Memories That Stay Forever 🫂',
      frame: 'style-circle',
      sticker: '💛'
    }
  ];

  // All 10 real photos across img/ and gi/ with requested captions (no duplicates in set)
  const CAROUSEL_PHOTOS = [
    { file: 'img/WhatsApp Image 2026-11-27 at 09.27.25.jpeg', caption: 'Vishal The Legend 😎', size: 'size-md', tilt: 'tilt-left', heart: '💖' },
    { file: 'gi/WhatsApp Image 2026-11-27 at 09.25.05.jpeg', caption: 'Beautiful Memories ❤️', size: 'size-sm', tilt: 'tilt-right', heart: '💛' },
    { file: 'gi/WhatsApp Image 2026-11-27 at 09.25.06.jpeg', caption: 'Memories That Stay Forever 🫂', size: 'size-wide', tilt: 'tilt-soft', heart: '🩷' },
    { file: 'img/WhatsApp Image 2026-11-27 at 12.27.18.jpeg', caption: 'Memories That Stay Forever 🫂', size: 'size-md', tilt: 'tilt-right', heart: '💖' },
    { file: 'gi/WhatsApp Image 2026-11-27 at 09.25.06 (1).jpeg', caption: 'Beautiful Memories ❤️', size: 'size-wide', tilt: 'tilt-left', heart: '💛' },
    { file: 'gi/WhatsApp Image 2026-11-27 at 09.25.07.jpeg', caption: 'Vishal The Legend 😎', size: 'size-sm', tilt: 'tilt-soft', heart: '🩷' },
    { file: 'gi/WhatsApp Image 2026-11-27 at 09.25.06 (2).jpeg', caption: 'Beautiful Memories ❤️', size: 'size-wide', tilt: 'tilt-right', heart: '💖' },
    { file: 'gi/WhatsApp Image 2026-11-27 at 09.25.07 (1).jpeg', caption: 'Vishal The Legend 😎', size: 'size-sm', tilt: 'tilt-left', heart: '💛' },
    { file: 'gi/WhatsApp Image 2026-11-27 at 09.25.09 (1).jpeg', caption: 'Memories That Stay Forever 🫂', size: 'size-wide', tilt: 'tilt-soft', heart: '🩷' },
    { file: 'gi/WhatsApp Image 2026-11-27 at 09.25.09.jpeg', caption: 'Beautiful Memories ❤️', size: 'size-md', tilt: 'tilt-right', heart: '💖' }
  ];

  const SECRET_ANSWER = 'samne wali khidki';

  /* ========================================================
     2. DOM ELEMENTS & STATE
     ======================================================== */
  const screenSurprise = document.getElementById('screen-surprise');
  const screenCelebration = document.getElementById('screen-celebration');
  const screenGift = document.getElementById('screen-gift');
  const screenCarousel = document.getElementById('screen-carousel');

  const giftIllustration = document.getElementById('gift-illustration');
  const openBtn = document.getElementById('open-btn');

  const specialLetterBtn = document.getElementById('special-letter-btn');
  const specialGiftBox = document.getElementById('special-gift-box');
  const secretForm = document.getElementById('secret-question-form');
  const secretInput = document.getElementById('secret-answer-input');
  const checkAnswerBtn = document.getElementById('check-answer-btn');
  const secretFeedback = document.getElementById('secret-feedback');
  const openSpecialGiftBtn = document.getElementById('open-special-gift-btn');
  const backToCardBtn = document.getElementById('back-to-card-btn');

  const photosLeft = document.getElementById('photos-left');
  const photosRight = document.getElementById('photos-right');
  const carouselViewport = document.getElementById('carousel-viewport');
  const carouselTrack = document.getElementById('carousel-track');
  const letterParagraphs = document.querySelectorAll('#letter-content p');

  const contractEnvelope = document.getElementById('contract-envelope');
  const envelopeTapHint = document.getElementById('envelope-tap-hint');
  const contractSection = document.getElementById('contract-section');
  const yesBtn1 = document.getElementById('yes-btn-1');
  const yesBtn2 = document.getElementById('yes-btn-2');
  const contractAccepted = document.getElementById('contract-accepted');

  const sigCanvas = document.getElementById('signature-canvas');
  const sigPadWrap = sigCanvas ? sigCanvas.parentElement : null;
  const clearSigBtn = document.getElementById('clear-sig-btn');
  const signContractBtn = document.getElementById('sign-contract-btn');
  const sigFeedback = document.getElementById('sig-feedback');
  const signedStatus = document.getElementById('signed-status');

  const floatingDecor = document.getElementById('floating-decor');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicText = document.getElementById('music-text');

  const photoModal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasOpenedFirst = false;
  let isTransitioning = false;
  let questionSolved = false;
  let envelopeOpened = false;

  /* ========================================================
     3. DUAL-MODE MUSIC CONTROLLER
     - Mode 'birthday': audio/happy-birthday.mp3 or classic Happy Birthday melody
     - Mode 'romantic': audio/romantic-proposal.mp3 or dreamy romantic proposal piano
     - Switches smoothly to romantic proposal music when Special Gift appears
     ======================================================== */
  const BIRTHDAY_NOTES = [
    // "Happy birthday to you"
    { f: 392.00, d: 0.34, h: 261.63 }, { f: 392.00, d: 0.24 }, { f: 440.00, d: 0.56, h: 196.00 },
    { f: 392.00, d: 0.56 }, { f: 523.25, d: 0.56, h: 261.63 }, { f: 493.88, d: 1.05, h: 196.00 },
    // "Happy birthday to you"
    { f: 392.00, d: 0.34, h: 196.00 }, { f: 392.00, d: 0.24 }, { f: 440.00, d: 0.56, h: 246.94 },
    { f: 392.00, d: 0.56 }, { f: 587.33, d: 0.56, h: 196.00 }, { f: 523.25, d: 1.05, h: 261.63 },
    // "Happy birthday dear Vishal"
    { f: 392.00, d: 0.34, h: 261.63 }, { f: 392.00, d: 0.24 }, { f: 783.99, d: 0.56, h: 329.63 },
    { f: 659.25, d: 0.56 }, { f: 523.25, d: 0.56, h: 174.61 }, { f: 493.88, d: 0.56 }, { f: 440.00, d: 0.92, h: 220.00 },
    // "Happy birthday to you!"
    { f: 698.46, d: 0.34, h: 174.61 }, { f: 698.46, d: 0.24 }, { f: 659.25, d: 0.56, h: 261.63 },
    { f: 523.25, d: 0.56 }, { f: 587.33, d: 0.56, h: 196.00 }, { f: 523.25, d: 1.25, h: 261.63 }
  ];

  // Bollywood-style romantic ballad melody (Raag Yaman / D-major expressive flute + warm chords)
  const ROMANTIC_NOTES = [
    // Phrase 1 (Dmaj7): Pa -> Dha -> Ni -> Sa' -> Ni -> Dha -> Pa
    { f: 440.00, d: 0.62, h: 146.83, slideFrom: 392.00 },
    { f: 493.88, d: 0.58, h: 220.00 },
    { f: 554.37, d: 0.62, h: 293.66 },
    { f: 587.33, d: 1.15, h: 369.99, slideFrom: 554.37 },
    { f: 554.37, d: 0.58 },
    { f: 493.88, d: 0.58 },
    { f: 440.00, d: 1.15, h: 220.00 },

    // Phrase 2 (Bm7 -> Gmaj7): Ma# -> Pa -> Dha -> Sa' -> Re' -> Sa' -> Ni -> Dha
    { f: 392.00, d: 0.58, h: 123.47 },
    { f: 440.00, d: 0.58, h: 246.94 },
    { f: 493.88, d: 0.64, h: 293.66 },
    { f: 587.33, d: 0.68, h: 196.00 },
    { f: 659.25, d: 1.10, h: 246.94, slideFrom: 587.33 },
    { f: 587.33, d: 0.58 },
    { f: 554.37, d: 0.62 },
    { f: 493.88, d: 1.15, h: 196.00 },

    // Phrase 3 (A6sus4 -> A -> Dmaj7): Pa -> Dha -> Sa' -> Ni -> Dha -> Pa -> Ga -> Re -> Sa
    { f: 440.00, d: 0.58, h: 110.00 },
    { f: 493.88, d: 0.58, h: 220.00 },
    { f: 587.33, d: 0.72, h: 329.63, slideFrom: 493.88 },
    { f: 554.37, d: 0.62 },
    { f: 493.88, d: 0.62 },
    { f: 440.00, d: 0.68, h: 164.81 },
    { f: 369.99, d: 0.62 },
    { f: 329.63, d: 0.64, h: 220.00 },
    { f: 293.66, d: 1.45, h: 146.83, slideFrom: 329.63 }
  ];

  const MUSIC_TRACKS = {
    birthday: 'audio/happy-birthday.mp3',
    romantic: 'audio/romantic-bollywood.mp3'
  };

  const musicState = {
    started: false,
    playing: false,
    mode: 'birthday',
    usingSynth: false,
    audio: null,
    ctx: null,
    masterGain: null,
    noteTimer: null,
    noteIndex: 0
  };

  function updateMusicButton() {
    if (!musicBtn) return;
    musicBtn.hidden = false;
    musicBtn.setAttribute('aria-pressed', String(musicState.playing));
    const activeIcon = musicState.mode === 'romantic' ? '💞' : '🎵';
    if (musicIcon) musicIcon.textContent = musicState.playing ? activeIcon : '🔇';
    if (musicText) musicText.textContent = musicState.playing ? 'Music On' : 'Music Off';
  }

  function ensureAudioContext() {
    if (!musicState.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      musicState.ctx = new AudioCtx();
      musicState.masterGain = musicState.ctx.createGain();
      musicState.masterGain.gain.value = 0.34;
      musicState.masterGain.connect(musicState.ctx.destination);
    }
    if (musicState.ctx.state === 'suspended') {
      musicState.ctx.resume().catch(() => {});
    }
    return musicState.ctx;
  }

  function playPianoKey(freq, durationSec, peak = 0.28, warm = false, slideFrom = null) {
    const ctx = ensureAudioContext();
    if (!ctx || !musicState.masterGain || !musicState.playing) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const env = ctx.createGain();

    osc.type = warm ? 'sine' : 'triangle';
    if (slideFrom) {
      osc.frequency.setValueAtTime(slideFrom, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.14);
    } else {
      osc.frequency.setValueAtTime(freq, now);
    }

    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(warm ? 1450 : 1750, now);
    filter.frequency.exponentialRampToValueAtTime(warm ? 420 : 520, now + durationSec);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.value = warm ? 0.14 : 0.18;

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(peak, now + (warm ? 0.07 : 0.025));
    env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(filter);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(filter);
    filter.connect(env);
    env.connect(musicState.masterGain);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + durationSec + 0.05);
    harmonic.stop(now + durationSec + 0.05);
  }

  function stopSynthLoop() {
    if (musicState.noteTimer) {
      clearTimeout(musicState.noteTimer);
      musicState.noteTimer = null;
    }
  }

  function scheduleNextNote() {
    if (!musicState.playing || !musicState.usingSynth) return;

    const isRomantic = musicState.mode === 'romantic';
    const notes = isRomantic ? ROMANTIC_NOTES : BIRTHDAY_NOTES;
    const note = notes[musicState.noteIndex % notes.length];

    playPianoKey(
      note.f,
      note.d * (isRomantic ? 1.85 : 1.35),
      isRomantic ? 0.25 : 0.28,
      isRomantic,
      isRomantic ? note.slideFrom || null : null
    );
    if (note.h) {
      playPianoKey(note.h, note.d * (isRomantic ? 2.4 : 1.8), 0.14, true);
    }

    musicState.noteIndex++;
    const loopEnd = musicState.noteIndex % notes.length === 0;
    const gap = isRomantic ? (loopEnd ? 600 : 70) : (loopEnd ? 850 : 40);
    musicState.noteTimer = setTimeout(scheduleNextNote, note.d * 1000 + gap);
  }

  function startBuiltinSynth() {
    stopSynthLoop();
    musicState.usingSynth = true;
    if (!musicState.playing) return;
    updateMusicButton();
    ensureAudioContext();
    scheduleNextNote();
  }

  async function loadAndPlayMode(mode) {
    musicState.mode = mode;
    musicState.noteIndex = 0;
    stopSynthLoop();

    if (musicState.audio) {
      musicState.audio.pause();
      musicState.audio = null;
    }
    musicState.usingSynth = false;
    updateMusicButton();

    if (!musicState.playing) return;

    ensureAudioContext();

    const audio = new Audio();
    audio.src = MUSIC_TRACKS[mode];
    audio.loop = true;
    audio.volume = 0.48;
    audio.preload = 'auto';

    audio.addEventListener('error', () => {
      if (musicState.mode === mode && !musicState.usingSynth && musicState.playing) {
        startBuiltinSynth();
      }
    }, { once: true });

    musicState.audio = audio;

    try {
      await audio.play();
      updateMusicButton();
    } catch (_err) {
      if (musicState.mode === mode && musicState.playing) {
        startBuiltinSynth();
      }
    }
  }

  function startBirthdayMusic() {
    if (musicState.started) return;
    musicState.started = true;
    musicState.playing = true;
    ensureAudioContext();
    loadAndPlayMode('birthday');
  }

  function setMusicMode(newMode) {
    if (musicState.mode === newMode) return;
    musicState.mode = newMode;
    musicState.noteIndex = 0;
    if (!musicState.started) return;
    if (musicState.playing) {
      loadAndPlayMode(newMode);
    } else {
      stopSynthLoop();
      if (musicState.audio) {
        musicState.audio.pause();
        musicState.audio = null;
      }
      musicState.usingSynth = false;
      updateMusicButton();
    }
  }

  function toggleMusic() {
    if (!musicState.started) {
      startBirthdayMusic();
      return;
    }

    musicState.playing = !musicState.playing;
    updateMusicButton();

    if (musicState.playing) {
      ensureAudioContext();
      if (musicState.audio && !musicState.usingSynth) {
        musicState.audio.play().catch(() => startBuiltinSynth());
      } else {
        loadAndPlayMode(musicState.mode);
      }
    } else {
      stopSynthLoop();
      if (musicState.audio) {
        musicState.audio.pause();
      }
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }

  /* ========================================================
     4. PASTEL CONFETTI & FLOATING DECORATIONS
     ======================================================== */
  const CONFETTI_COLORS = ['#F68AA8', '#F3C178', '#CDB4EC', '#F8B195', '#FFF0B8', '#FAD2E1'];
  let confettiPieces = [];
  let gentleRainActive = false;

  function resizeConfetti() {
    if (!confettiCanvas || !confettiCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    confettiCanvas.width = Math.floor(window.innerWidth * dpr);
    confettiCanvas.height = Math.floor(window.innerHeight * dpr);
    confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burstConfetti(count = 70) {
    if (reducedMotion) return;
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.46;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6.2 + 2.2;
      confettiPieces.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.6,
        w: Math.random() * 7 + 5,
        h: Math.random() * 4 + 3,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.18,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 150 + Math.random() * 60
      });
    }
  }

  function tickConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (gentleRainActive && !reducedMotion && Math.random() < 0.2) {
      confettiPieces.push({
        x: Math.random() * window.innerWidth,
        y: -12,
        vx: (Math.random() - 0.5) * 1.1,
        vy: Math.random() * 1.6 + 1.2,
        w: Math.random() * 6 + 4,
        h: Math.random() * 4 + 3,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.12,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 260
      });
    }

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.vx *= 0.992;
      p.rot += p.vRot;
      p.life--;

      if (p.life <= 0 || p.y > window.innerHeight + 25) {
        confettiPieces.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.globalAlpha = p.life < 35 ? p.life / 35 : 0.92;
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
    }

    requestAnimationFrame(tickConfetti);
  }

  function spawnFloatingItem(isBalloon, burstSymbols = null) {
    if (reducedMotion || !floatingDecor) return;
    if (floatingDecor.childElementCount > 16) return;

    const el = document.createElement('div');
    if (isBalloon) {
      const colors = ['pink', 'lavender', 'peach', 'gold'];
      el.className = `decor-balloon ${colors[Math.floor(Math.random() * colors.length)]}`;
    } else {
      const symbols = burstSymbols || ['💖', '✨', '🌸', '⭐', '💛', '🎈'];
      el.className = 'decor-float';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }

    el.style.left = `${Math.random() * 90 + 4}%`;
    el.style.animationDuration = `${8.5 + Math.random() * 6}s`;
    el.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`);

    el.addEventListener('animationend', () => el.remove(), { once: true });
    floatingDecor.appendChild(el);
  }

  function startFloatingAtmosphere() {
    if (reducedMotion) return;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => spawnFloatingItem(i % 2 === 0), i * 500);
    }
    setInterval(() => spawnFloatingItem(Math.random() < 0.55), 1800);
  }

  function celebrateBurst(symbols = ['💖', '✨', '🎉', '🎂', '🥳', '🫂']) {
    burstConfetti(80);
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnFloatingItem(false, symbols), i * 90);
    }
  }

  /* ========================================================
     5. PHOTO MODAL & SCREEN 2 PHOTOS
     ======================================================== */
  function openPhotoModal(src, alt, caption) {
    if (!photoModal || !modalImg || !modalCaption) return;
    modalImg.src = encodeURI(src);
    modalImg.alt = alt;
    modalCaption.textContent = caption;
    photoModal.hidden = false;
  }

  function renderCardPhotos() {
    if (!photosLeft || !photosRight) return;
    photosLeft.innerHTML = '';
    photosRight.innerHTML = '';

    CARD_PHOTOS.forEach((photo, idx) => {
      const figure = document.createElement('figure');
      figure.className = `photo-card ${photo.frame}`;
      figure.tabIndex = 0;
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', `View photo: ${photo.caption}`);

      const sticker = document.createElement('span');
      sticker.className = 'photo-sticker';
      sticker.setAttribute('aria-hidden', 'true');
      sticker.textContent = photo.sticker;

      const inner = document.createElement('div');
      inner.className = 'photo-inner';

      const img = document.createElement('img');
      img.src = encodeURI(photo.file);
      img.alt = `Vishal — ${photo.caption}`;
      img.loading = 'eager';
      img.addEventListener('error', () => figure.remove());
      inner.appendChild(img);

      const caption = document.createElement('figcaption');
      caption.className = 'photo-caption';
      caption.textContent = photo.caption;

      figure.appendChild(sticker);
      figure.appendChild(inner);
      figure.appendChild(caption);

      const openFn = () => openPhotoModal(photo.file, img.alt, photo.caption);
      figure.addEventListener('click', openFn);
      figure.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFn();
        }
      });

      if (idx % 2 === 0) photosLeft.appendChild(figure);
      else photosRight.appendChild(figure);
    });
  }

  function setupModal() {
    const close = () => {
      if (photoModal) photoModal.hidden = true;
    };
    if (modalClose) modalClose.addEventListener('click', close);
    if (photoModal) {
      photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) close();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && photoModal && !photoModal.hidden) {
        close();
      }
    });
  }

  /* ========================================================
     6. CONTINUOUS RIGHT-TO-LEFT HORIZONTAL CAROUSEL
     (Supports auto-scroll, desktop hover pause, & mobile swipe)
     ======================================================== */
  const carouselState = {
    isHovered: false,
    isTouching: false,
    resumeTimer: null,
    rafId: null
  };

  function buildCarouselItem(photo) {
    const figure = document.createElement('figure');
    figure.className = `carousel-polaroid ${photo.size} ${photo.tilt}`;
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', `View memory: ${photo.caption}`);

    const heart = document.createElement('span');
    heart.className = 'carousel-deco-heart';
    heart.setAttribute('aria-hidden', 'true');
    heart.textContent = photo.heart || '💖';

    const sparkle = document.createElement('span');
    sparkle.className = 'carousel-deco-sparkle';
    sparkle.setAttribute('aria-hidden', 'true');
    sparkle.textContent = '✨';

    const box = document.createElement('div');
    box.className = 'carousel-img-box';

    const img = document.createElement('img');
    img.src = encodeURI(photo.file);
    img.alt = `Vishal — ${photo.caption}`;
    img.loading = 'eager';
    img.addEventListener('error', () => figure.remove());
    box.appendChild(img);

    const caption = document.createElement('figcaption');
    caption.className = 'carousel-caption';
    caption.textContent = photo.caption;

    figure.appendChild(heart);
    figure.appendChild(sparkle);
    figure.appendChild(box);
    figure.appendChild(caption);

    const openFn = () => openPhotoModal(photo.file, img.alt, photo.caption);
    figure.addEventListener('click', openFn);
    figure.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFn();
      }
    });

    return figure;
  }

  function renderCarousel() {
    if (!carouselTrack) return;
    carouselTrack.innerHTML = '';

    // Two identical sets allow seamless infinite wrapping without duplicating visible cards in one view
    const items = [...CAROUSEL_PHOTOS, ...CAROUSEL_PHOTOS];
    items.forEach((photo) => {
      carouselTrack.appendChild(buildCarouselItem(photo));
    });
  }

  function startCarouselAutoScroll() {
    if (!carouselViewport || !carouselTrack || reducedMotion) return;
    if (carouselState.rafId) return;

    const step = () => {
      if (
        screenCarousel &&
        !screenCarousel.hidden &&
        !carouselState.isHovered &&
        !carouselState.isTouching
      ) {
        const halfWidth = carouselTrack.scrollWidth / 2;
        if (halfWidth > 0) {
          carouselViewport.scrollLeft += 0.75;
          if (carouselViewport.scrollLeft >= halfWidth) {
            carouselViewport.scrollLeft -= halfWidth;
          }
        }
      }
      carouselState.rafId = requestAnimationFrame(step);
    };

    carouselViewport.addEventListener('mouseenter', () => {
      carouselState.isHovered = true;
    });
    carouselViewport.addEventListener('mouseleave', () => {
      carouselState.isHovered = false;
    });
    carouselViewport.addEventListener('touchstart', () => {
      carouselState.isTouching = true;
      if (carouselState.resumeTimer) clearTimeout(carouselState.resumeTimer);
    }, { passive: true });
    carouselViewport.addEventListener('touchend', () => {
      if (carouselState.resumeTimer) clearTimeout(carouselState.resumeTimer);
      carouselState.resumeTimer = setTimeout(() => {
        carouselState.isTouching = false;
      }, 1500);
    }, { passive: true });

    carouselState.rafId = requestAnimationFrame(step);
  }

  /* ========================================================
     7. SECRET QUESTION VALIDATION
     ======================================================== */
  if (secretForm) {
    secretForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (questionSolved || !secretInput || !secretFeedback) return;

      const userValue = secretInput.value.trim().toLowerCase();
      if (userValue === SECRET_ANSWER) {
        questionSolved = true;
        secretFeedback.textContent = 'YAYYY! You know the answer! 🥹❤️';
        secretFeedback.className = 'secret-feedback is-success';
        secretInput.readOnly = true;
        if (checkAnswerBtn) checkAnswerBtn.disabled = true;
        if (openSpecialGiftBtn) openSpecialGiftBtn.hidden = false;
        celebrateBurst(['💖', '✨', '🥹', '❤️']);
      } else {
        secretFeedback.textContent = 'Oops! Try again! 😂❤️';
        secretFeedback.className = 'secret-feedback is-error';
        secretForm.classList.remove('shake');
        void secretForm.offsetWidth;
        secretForm.classList.add('shake');
        secretInput.focus();
      }
    });
  }

  /* ========================================================
     8. ENVELOPE, CONTRACT YES BUTTONS & SIGNATURE CANVAS
     ======================================================== */
  if (contractEnvelope) {
    contractEnvelope.addEventListener('click', () => {
      if (envelopeOpened) {
        if (contractSection) {
          contractSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
      envelopeOpened = true;
      contractEnvelope.classList.add('is-open');
      contractEnvelope.setAttribute('aria-expanded', 'true');
      if (envelopeTapHint) envelopeTapHint.textContent = 'Opening a special letter for you... 💌';

      setTimeout(() => {
        if (contractSection) {
          contractSection.hidden = false;
          resizeSignatureCanvas();
          setTimeout(() => {
            contractSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      }, reducedMotion ? 80 : 560);
    });
  }

  function handleAcceptContract() {
    if (contractAccepted) contractAccepted.hidden = false;
    celebrateBurst(['❤️', '💖', '✨', '💌', '🥹']);
  }

  if (yesBtn1) yesBtn1.addEventListener('click', handleAcceptContract);
  if (yesBtn2) yesBtn2.addEventListener('click', handleAcceptContract);

  // Signature Canvas Drawing (Desktop Mouse + Mobile Touch via Pointer Events)
  const sigState = {
    ctx: sigCanvas ? sigCanvas.getContext('2d') : null,
    drawing: false,
    hasInk: false,
    lastX: 0,
    lastY: 0,
    signedSession: false
  };

  function resizeSignatureCanvas() {
    if (!sigCanvas || !sigState.ctx) return;
    const rect = sigCanvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);
    if (sigCanvas.width === targetW && sigCanvas.height === targetH) return;

    let backup = null;
    if (sigState.hasInk && sigCanvas.width > 0 && sigCanvas.height > 0) {
      backup = document.createElement('canvas');
      backup.width = sigCanvas.width;
      backup.height = sigCanvas.height;
      backup.getContext('2d').drawImage(sigCanvas, 0, 0);
    }

    sigCanvas.width = targetW;
    sigCanvas.height = targetH;
    sigState.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sigState.ctx.lineCap = 'round';
    sigState.ctx.lineJoin = 'round';
    sigState.ctx.lineWidth = 3.2;
    sigState.ctx.strokeStyle = '#5a3848';

    if (backup) {
      sigState.ctx.drawImage(backup, 0, 0, rect.width, rect.height);
    }
  }

  function getCanvasCoords(e) {
    const rect = sigCanvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  if (sigCanvas && sigState.ctx) {
    sigCanvas.addEventListener('pointerdown', (e) => {
      if (sigState.signedSession) return;
      e.preventDefault();
      resizeSignatureCanvas();
      sigCanvas.setPointerCapture(e.pointerId);
      const pt = getCanvasCoords(e);
      sigState.drawing = true;
      sigState.lastX = pt.x;
      sigState.lastY = pt.y;

      sigState.ctx.beginPath();
      sigState.ctx.arc(pt.x, pt.y, 1.3, 0, Math.PI * 2);
      sigState.ctx.fillStyle = '#5a3848';
      sigState.ctx.fill();

      sigState.hasInk = true;
      if (sigPadWrap) sigPadWrap.classList.add('has-ink');
      if (sigFeedback) sigFeedback.textContent = '';
    });

    sigCanvas.addEventListener('pointermove', (e) => {
      if (!sigState.drawing || sigState.signedSession) return;
      e.preventDefault();
      const pt = getCanvasCoords(e);
      sigState.ctx.beginPath();
      sigState.ctx.moveTo(sigState.lastX, sigState.lastY);
      sigState.ctx.lineTo(pt.x, pt.y);
      sigState.ctx.stroke();
      sigState.lastX = pt.x;
      sigState.lastY = pt.y;
    });

    const stopDraw = () => {
      sigState.drawing = false;
    };
    sigCanvas.addEventListener('pointerup', stopDraw);
    sigCanvas.addEventListener('pointercancel', stopDraw);
  }

  if (clearSigBtn) {
    clearSigBtn.addEventListener('click', () => {
      if (!sigCanvas || !sigState.ctx) return;
      sigState.ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
      sigState.hasInk = false;
      sigState.signedSession = false;
      if (sigPadWrap) sigPadWrap.classList.remove('has-ink');
      if (sigFeedback) sigFeedback.textContent = '';
      if (signedStatus) signedStatus.hidden = true;
      try {
        sessionStorage.removeItem('vishal_promise_sealed');
      } catch (_err) { /* ignore storage restrictions */ }
    });
  }

  if (signContractBtn) {
    signContractBtn.addEventListener('click', () => {
      if (!sigState.hasInk) {
        if (sigFeedback) {
          sigFeedback.textContent = 'Please draw your signature above first! ✍️❤️';
        }
        return;
      }

      sigState.signedSession = true;
      if (sigFeedback) sigFeedback.textContent = '';
      if (signedStatus) signedStatus.hidden = false;
      try {
        sessionStorage.setItem('vishal_promise_sealed', 'true');
      } catch (_err) { /* session-only save */ }

      celebrateBurst(['💌', '❤️', '✨', '💖', '🥹']);
    });
  }

  /* ========================================================
     9. SCREEN NAVIGATION
     ======================================================== */
  function switchScreen(fromEl, toEl, onReady) {
    if (isTransitioning || !toEl) return;
    isTransitioning = true;

    if (fromEl) fromEl.classList.add('is-leaving');

    setTimeout(() => {
      if (fromEl) {
        fromEl.hidden = true;
        fromEl.classList.remove('is-leaving');
      }
      toEl.hidden = false;
      window.scrollTo({ top: 0, behavior: 'instant' });
      isTransitioning = false;
      if (onReady) onReady();
    }, reducedMotion ? 80 : 440);
  }

  function revealLetter() {
    letterParagraphs.forEach((p, idx) => {
      setTimeout(() => {
        p.classList.add('is-visible');
      }, reducedMotion ? 0 : 110 + idx * 140);
    });
  }

  // Screen 1 -> Screen 2
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (hasOpenedFirst || isTransitioning) return;
      hasOpenedFirst = true;

      if (giftIllustration) giftIllustration.classList.add('is-popped');
      startBirthdayMusic();
      celebrateBurst(['💖', '✨', '🎂', '🎈', '💛']);

      setTimeout(() => {
        switchScreen(screenSurprise, screenCelebration, () => {
          gentleRainActive = true;
          revealLetter();
        });
      }, reducedMotion ? 60 : 380);
    });
  }

  // Screen 2 (Letter Icon) -> Screen 3 (Special Gift & Secret Question)
  if (specialLetterBtn) {
    specialLetterBtn.addEventListener('click', () => {
      if (specialGiftBox) specialGiftBox.classList.remove('is-popped');
      // Switch to romantic proposal music as soon as the Special Gift appears
      setMusicMode('romantic');
      switchScreen(screenCelebration, screenGift, () => {
        if (secretInput && !questionSolved) secretInput.focus();
      });
    });
  }

  // Screen 3 (Open Special Gift after correct answer) -> Screen 4 (Carousel + Envelope + Contract)
  if (openSpecialGiftBtn) {
    openSpecialGiftBtn.addEventListener('click', () => {
      if (isTransitioning || !questionSolved) return;
      if (specialGiftBox) specialGiftBox.classList.add('is-popped');
      celebrateBurst(['💖', '✨', '🎉', '🎂', '🥳', '🫂']);

      setTimeout(() => {
        switchScreen(screenGift, screenCarousel, () => {
          startCarouselAutoScroll();
        });
      }, reducedMotion ? 80 : 420);
    });
  }

  // Screen 4 -> Back to Screen 2
  if (backToCardBtn) {
    backToCardBtn.addEventListener('click', () => {
      setMusicMode('birthday');
      switchScreen(screenCarousel, screenCelebration);
    });
  }

  /* ========================================================
     10. INITIALIZE
     ======================================================== */
  resizeConfetti();
  window.addEventListener('resize', () => {
    resizeConfetti();
    if (contractSection && !contractSection.hidden) {
      resizeSignatureCanvas();
    }
  });
  requestAnimationFrame(tickConfetti);
  startFloatingAtmosphere();
  renderCardPhotos();
  renderCarousel();
  setupModal();
})();
