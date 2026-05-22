/* ==========================================================================
   Mood Telephone - Core Interaction & Sound Logic
   ========================================================================== */

// 1. Mood Config & Data Map (Matches the exact 10 emojis in the uploaded image)
const MOODS = [
  { name: 'excited', emoji: '🤩', angle: 30, color: '#e09f3e', image: 'excited.png' },
  { name: 'grateful', emoji: '🥹', angle: 0, color: '#d97706', image: 'confident.png' },
  { name: 'relaxed', emoji: '😌', angle: 330, color: '#b567ff', image: 'relaxed.png' },
  { name: 'okay', emoji: '🙂', angle: 300, color: '#52b788', image: 'okay.png' },
  { name: 'meh', emoji: '😑', angle: 270, color: '#94a3b8', image: 'meh.png' },
  { name: 'tired', emoji: '😮‍💨', angle: 240, color: '#00b4d8', image: 'sleepy.png' },
  { name: 'angry', emoji: '🤬', angle: 210, color: '#ef4444', image: 'overstimulated.png' },
  { name: 'sad', emoji: '😔', angle: 180, color: '#475569', image: 'suprised.png' },
  { name: 'anxious', emoji: '😰', angle: 150, color: '#0284c7', image: 'melting.png' },
  { name: 'having fun', emoji: '🥳', angle: 120, color: '#ff4d6d', image: 'having fun.png' }
];

// Physical Stop Angle (bottom right at ~5:30)
const STOP_ANGLE = 75;

// GIPHY API Configuration
let giphyApiKey = ""; // Loaded dynamically via loadGiphyKey()
const GIPHY_TAGS = {
  'sleepy': 'sleepy tired reaction',
  'meh': 'bored meh reaction',
  'okay': 'okay thumbs up reaction',
  'relaxed': 'chill relaxed reaction',
  'confident': 'confident cool reaction',
  'excited': 'excited happy reaction',
  'having fun': 'party celebrating reaction',
  'angry': 'angry mad reaction',
  'cry': 'sad crying reaction',
  'suprised': 'shocked gasp reaction',
  'anxious': 'anxiety stressed reaction',
  'sad': 'sad crying reaction',
  'tired': 'tired exhausted reaction',
  'grateful': 'grateful happy reaction'
};

// Reddit Subreddit mapping for keyless fallback meme search (using meme-api.com)
const MOOD_SUBREDDITS = {
  'excited': 'dankmemes',
  'grateful': 'wholesomememes',
  'relaxed': 'me_irl',
  'okay': 'memes',
  'meh': 'me_irl',
  'tired': 'me_irl',
  'angry': 'dankmemes',
  'sad': 'wholesomememes',
  'anxious': 'me_irl',
  'having fun': 'dankmemes'
};

// Premium Curated fallbacks mapping to 100% relevant and highly optimized reaction GIFs
const CURATED_GIFS = {
  'sleepy': [
    'https://i.giphy.com/d0SEaj53UXVXG.gif',
    'https://i.giphy.com/1018QWki8r08c8.gif',
    'https://i.giphy.com/Zg7clvqHE3yWk.gif'
  ],
  'meh': [
    'https://i.giphy.com/129OnZ9Qn2i0IE.gif',
    'https://i.giphy.com/3o7TKnOqEY2giAm9Lq.gif',
    'https://i.giphy.com/Fjr6v88OPk7U4.gif'
  ],
  'okay': [
    'https://i.giphy.com/26gJzZ426J9a1ESyc.gif',
    'https://i.giphy.com/BPjPvgQ909Q1W.gif',
    'https://i.giphy.com/nXxXxTo7Ut3mo.gif'
  ],
  'relaxed': [
    'https://i.giphy.com/3o7TKDzH7VN5fRy1nW.gif',
    'https://i.giphy.com/j6qyW5vU5HqMw.gif',
    'https://i.giphy.com/o0bcZ3r1FLZTO.gif'
  ],
  'confident': [
    'https://i.giphy.com/3o7TKu5UZIShyEJuOk.gif',
    'https://i.giphy.com/l2R013mIf1S5qp46A.gif',
    'https://i.giphy.com/l1J9LXPPgLvetagdG.gif'
  ],
  'excited': [
    'https://i.giphy.com/l3q2zVr6cu95nF6O4.gif',
    'https://i.giphy.com/14fnGKoWg1S44U.gif',
    'https://i.giphy.com/ckeHl52mNtoq87cr6a.gif'
  ],
  'having fun': [
    'https://i.giphy.com/l3V0lsG3Js9N1a8Le.gif',
    'https://i.giphy.com/ku5y1DQRCA76.gif',
    'https://i.giphy.com/l2JHZkNHxHKvoTj44.gif'
  ],
  'angry': [
    'https://i.giphy.com/11tI5s0n48AlHO.gif',
    'https://i.giphy.com/ksV59coBSnh5K.gif',
    'https://i.giphy.com/ntjBjvafcHqnC.gif'
  ],
  'cry': [
    'https://i.giphy.com/2WxWlkKWPI2OI.gif',
    'https://i.giphy.com/9PxJ1MRgYSQVOPs5qg.gif',
    'https://i.giphy.com/AauJT0w8cJoSQ.gif'
  ],
  'suprised': [
    'https://i.giphy.com/BcMJ586X2nLPy.gif',
    'https://i.giphy.com/3kzJvEciJa94SMW3hN.gif',
    'https://i.giphy.com/ebPX2g217Ic8M.gif'
  ],
  'anxious': [
    'https://i.giphy.com/32mC2kXYDRuxO.gif',
    'https://i.giphy.com/LRV5iWqHaVKlllczDY.gif',
    'https://i.giphy.com/xU9BHoQbLOtx4tReNz.gif'
  ],
  'sad': [
    'https://i.giphy.com/2WxWlkKWPI2OI.gif',
    'https://i.giphy.com/9PxJ1MRgYSQVOPs5qg.gif',
    'https://i.giphy.com/AauJT0w8cJoSQ.gif'
  ],
  'tired': [
    'https://i.giphy.com/d0SEaj53UXVXG.gif',
    'https://i.giphy.com/1018QWki8r08c8.gif',
    'https://i.giphy.com/Zg7clvqHE3yWk.gif'
  ],
  'grateful': [
    'https://i.giphy.com/26vUxArWImnKV30GI.gif',
    'https://i.giphy.com/BPjPvgQ909Q1W.gif',
    'https://i.giphy.com/l2JHZkNHxHKvoTj44.gif'
  ]
};

// Sound Control States
let soundsEnabled = true;
let audioCtx = null;

// Rotary Dialer Interactions State
let isDragging = false;
let startMouseAngle = 0;
let lastMouseAngle = 0;
let currentRotation = 0;
let activeHoleIndex = null;
let lastClickAngle = 0;
const CLICK_THRESHOLD_DEGS = 12; // Click sound spacing

// DOM Cache (Only active views and controls)
const body = document.body;
const dialView = document.getElementById('view-dial');
const memeView = document.getElementById('view-meme');

const btnShare = document.getElementById('btn-share');
const btnRedial = document.getElementById('btn-redial');

const interactiveDial = document.getElementById('interactive-dial');
const dialRotor = document.getElementById('dial-rotor');
const moodSlotsContainer = document.getElementById('mood-slots-container');
const rotorHolesContainer = document.getElementById('rotor-holes-container');

const dialHoverEmoji = document.getElementById('dial-hover-emoji');
const dialHoverLabel = document.getElementById('dial-hover-label');

const resultBadge = document.getElementById('result-badge');
const resultMoodName = document.getElementById('result-mood-name');
const resultCardGlow = document.getElementById('result-card-glow');
const memeImage = document.getElementById('meme-image');
const memeSpinner = document.getElementById('meme-spinner');
const currentDateSpan = document.getElementById('current-date');

const soundToggle = document.getElementById('sound-toggle');
const soundOnIcon = soundToggle.querySelector('.icon-on');
const soundOffIcon = soundToggle.querySelector('.icon-off');
const soundToggleText = soundToggle.querySelector('.sound-badge-text');

// Local Meme Database Cache
let cachedMemes = null;

// Load local harvested memes.json database
async function loadMemeDatabase() {
  try {
    const response = await fetch('./memes.json');
    if (response.ok) {
      cachedMemes = await response.json();
      console.log("Cached local meme database loaded successfully.");
    } else {
      console.error("Failed to load local meme database:", response.statusText);
    }
  } catch (e) {
    console.error("Error loading local meme database:", e);
  }
}

// Load Giphy API Key from either serverless function or local file
async function loadGiphyKey() {
  // 1. Try Vercel Serverless Function proxy first
  try {
    const res = await fetch('/api/giphy-key');
    if (res.ok) {
      const data = await res.json();
      if (data && data.key) {
        giphyApiKey = data.key;
        console.log("Loaded Giphy API key via serverless bridge.");
        return;
      }
    }
  } catch (e) {
    // Silent ignore
  }

  // 2. Try fetching local .env.local file directly (for local dev)
  try {
    const res = await fetch('/.env.local');
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/NEXT_PUBLIC_GIPHY_KEY\s*=\s*([^\s#]+)/);
      if (match && match[1]) {
        giphyApiKey = match[1].replace(/['"]/g, "").trim();
        console.log("Loaded Giphy API key via local environment config.");
        return;
      }
    }
  } catch (e) {
    // Silent ignore
  }

  giphyApiKey = "";
}

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
  loadMemeDatabase();
  loadGiphyKey();
  setupRotaryDialHoles();
  setupEventListeners();
  updatePolaroidDate();
  
  // Ensure the dialer positions adapt instantly when rotating iPads or resizing windows
  window.addEventListener('resize', setupRotaryDialHoles);
});

// Set current date in Polaroid caption
function updatePolaroidDate() {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const today = new Date();
  currentDateSpan.textContent = today.toLocaleDateString('en-US', options).toUpperCase();
}

/* ==========================================================================
   2. SYNTHESIZED VINTAGE SOUNDS (Web Audio API)
   ========================================================================== */

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Toggle audio settings
soundToggle.addEventListener('click', () => {
  soundsEnabled = !soundsEnabled;
  if (soundsEnabled) {
    initAudio();
    soundOnIcon.style.display = 'block';
    soundOffIcon.style.display = 'none';
    soundToggleText.textContent = "Sounds On";
    showToast("Sounds enabled 🔊");
  } else {
    soundOnIcon.style.display = 'none';
    soundOffIcon.style.display = 'block';
    soundToggleText.textContent = "Muted";
    showToast("Sounds muted 🔇");
  }
});

// Synthesize a retro physical mechanical clicking sound
function playMechanicalClick() {
  if (!soundsEnabled) return;
  initAudio();
  
  const ctx = audioCtx;
  const now = ctx.currentTime;
  
  // Click consists of a fast frequency envelope sweep and a noise impulse
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.008);
  
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.008);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.01);
}

// Synthesize physical vintage handset lift "clang"
function playHandsetLift() {
  if (!soundsEnabled) return;
  initAudio();
  
  const ctx = audioCtx;
  const now = ctx.currentTime;
  
  // High metal chimes
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(440, now);
  osc1.frequency.linearRampToValueAtTime(420, now + 0.1);
  
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1100, now);
  osc2.frequency.exponentialRampToValueAtTime(800, now + 0.15);
  
  filter.type = 'bandpass';
  filter.frequency.value = 900;
  
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.16);
  osc2.stop(now + 0.16);
}

// Double brass bell telephone ring for selection confirmation
function playRetroDoubleRing() {
  if (!soundsEnabled) return;
  initAudio();
  
  const ctx = audioCtx;
  const now = ctx.currentTime;
  
  // Metallic bell is generated by overlapping chimes with rapid volume trilling LFO
  function ringSingleBell(startTime, duration) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    
    const bellGain = ctx.createGain();
    const modGain = ctx.createGain();
    
    // Metallic chime frequencies
    osc1.frequency.value = 1650;
    osc2.frequency.value = 2100;
    
    // Triller
    modulator.frequency.value = 15; // 15Hz volume trill
    modGain.gain.value = 0.5;
    
    bellGain.gain.setValueAtTime(0, startTime);
    bellGain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    modulator.connect(modGain);
    modGain.connect(bellGain.gain);
    
    osc1.connect(bellGain);
    osc2.connect(bellGain);
    bellGain.connect(ctx.destination);
    
    osc1.start(startTime);
    osc2.start(startTime);
    modulator.start(startTime);
    
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    modulator.stop(startTime + duration);
  }
  
  // Ring-ring!
  ringSingleBell(now, 0.45);
  ringSingleBell(now + 0.6, 0.45);
}

/* ==========================================================================
   3. ROTARY DIAL MATH & CONSTRUCTION
   ========================================================================== */

// Build the dial wheel and slots dynamically
function setupRotaryDialHoles() {
  moodSlotsContainer.innerHTML = '';
  rotorHolesContainer.innerHTML = '';
  
  // Calculate radius dynamically based on current clientWidth of the dial (perfect responsiveness)
  const dialWidth = interactiveDial.clientWidth || 390;
  // A standard 135px radius on a 390px dial translates to 135 / 390 = ~34.6% of the dial size!
  const radius = dialWidth * 0.346;
  const centerOffset = 50; // % offset
  
  MOODS.forEach((mood, idx) => {
    // Math to map degrees into coordinates
    const rad = (mood.angle * Math.PI) / 180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    
    // a. Create static underlay item containing the standard emoji
    const slot = document.createElement('div');
    slot.className = 'mood-slot';
    slot.setAttribute('data-mood-idx', idx);
    slot.setAttribute('data-mood', mood.name);
    // Align in circle
    slot.style.left = `calc(${centerOffset}% + ${x}px)`;
    slot.style.top = `calc(${centerOffset}% + ${y}px)`;
    
    slot.innerHTML = `<div class="slot-emoji">${mood.emoji}</div>`;
    moodSlotsContainer.appendChild(slot);
    
    // b. Create moving transparent hole mask in the Glass Rotor Wheel
    const hole = document.createElement('div');
    hole.className = 'finger-hole-interactive';
    hole.setAttribute('data-index', idx);
    // Align in exact same starting circle coords
    hole.style.left = `calc(${centerOffset}% + ${x}px)`;
    hole.style.top = `calc(${centerOffset}% + ${y}px)`;
    
    // Bind mouseenter and mouseleave to preview mood details in the center cap
    hole.addEventListener('mouseenter', () => {
      if (!isDragging) {
        highlightSlot(idx, true);
        showActiveState(mood.emoji, mood.name);
      }
    });
    
    hole.addEventListener('mouseleave', () => {
      if (!isDragging) {
        highlightSlot(idx, false);
        resetCenterCap();
      }
    });
    
    rotorHolesContainer.appendChild(hole);
  });
}

// Convert angle to normal positive coordinates 0-360
function normalizeAngle(angle) {
  return (angle + 360) % 360;
}

// Calculate the maximum possible rotation distance for a hole to stop
function getHoleLimits(index) {
  const startAngle = MOODS[index].angle;
  // Rotation is clockwise. Max angle allowed is where hole angle + rotation = Stop Angle
  const maxRot = normalizeAngle(STOP_ANGLE - startAngle);
  return maxRot;
}

/* ==========================================================================
   4. SPA NAVIGATIONS (View Transitions)
   ========================================================================== */

function navigateTo(targetView) {
  const updateDOM = () => {
    // Hide all views
    dialView.style.display = 'none';
    memeView.style.display = 'none';
    
    // Enable target
    if (targetView === 'dial') {
      dialView.style.display = 'flex';
      body.className = 'view-dial-active';
      dialHoverEmoji.textContent = '📞';
      dialHoverLabel.textContent = 'Dial Mood';
    } 
    else if (targetView === 'meme') {
      memeView.style.display = 'flex';
      body.className = 'view-meme-active';
    }
  };

  // Trigger Native View Transition (SPA morph zoom effect)
  if (!document.startViewTransition) {
    updateDOM();
  } else {
    document.startViewTransition(() => updateDOM());
  }
}

// Helper to clean/convert Giphy URLs to robust, embeddable, CORS-friendly i.giphy.com format
function convertToEmbeddableGiphyUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('giphy.com')) return url;
  
  // Strip any query parameters
  const cleanUrl = url.split('?')[0];
  
  // If there's /media/ in the URL
  const mediaIndex = cleanUrl.indexOf('/media/');
  if (mediaIndex !== -1) {
    const afterMedia = cleanUrl.substring(mediaIndex + 7);
    const parts = afterMedia.split('/');
    if (parts.length >= 2) {
      // The segment before the last one is the Giphy ID
      const id = parts[parts.length - 2];
      return `https://i.giphy.com/${id}.gif`;
    } else if (parts.length === 1 && parts[0]) {
      const id = parts[0].replace(/\.[a-zA-Z0-9]+$/, '');
      return `https://i.giphy.com/${id}.gif`;
    }
  }
  
  // If it's already an i.giphy.com URL like https://i.giphy.com/media/ID/giphy.gif
  if (cleanUrl.includes('i.giphy.com/')) {
    const parts = cleanUrl.split('/');
    const lastPart = parts[parts.length - 1];
    const id = lastPart.replace(/\.[a-zA-Z0-9]+$/, '');
    return `https://i.giphy.com/${id}.gif`;
  }
  
  return url;
}

// Show selection and load meme image (using local harvested database)
async function showMemeResult(index) {
  const mood = MOODS[index];
  
  // Transition to results screen
  navigateTo('meme');
  
  // 1. Format result views
  if (resultBadge) {
    resultBadge.textContent = mood.emoji;
    resultBadge.style.boxShadow = `0 10px 30px ${mood.color}70`;
  }
  resultMoodName.textContent = mood.name;
  resultMoodName.style.color = mood.color;
  
  // Set the dynamic padded mood number (e.g. MOOD #083 for index 6/Angry)
  const captionMoodNumber = document.getElementById('caption-mood-number');
  if (captionMoodNumber) {
    const serializedNumber = index + 77;
    captionMoodNumber.textContent = `MOOD #${String(serializedNumber).padStart(3, '0')}`;
  }
  
  resultCardGlow.style.background = mood.color;
  resultCardGlow.style.boxShadow = `0 10px 45px ${mood.color}60`;
  
  // 2. Clear old image and show loading spinner immediately
  memeImage.classList.remove('loaded');
  memeSpinner.style.display = 'block';
  // Use a 1x1 transparent GIF to completely avoid broken image outlines/flicker
  memeImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  
  // 3. Select random GIF from local harvested database or premium curated fallbacks
  let gifUrl = '';
  
  if (cachedMemes && cachedMemes[mood.name] && cachedMemes[mood.name].length > 0) {
    const list = cachedMemes[mood.name];
    const randomIndex = Math.floor(Math.random() * list.length);
    gifUrl = list[randomIndex];
    console.log(`Selected random harvested GIF for "${mood.name}":`, gifUrl);
  } else if (CURATED_GIFS[mood.name] && CURATED_GIFS[mood.name].length > 0) {
    // Curated fallback if memes.json fails to load/is uncached
    const list = CURATED_GIFS[mood.name];
    const randomIndex = Math.floor(Math.random() * list.length);
    gifUrl = list[randomIndex];
    console.log(`memes.json not loaded. Selected curated GIF for "${mood.name}":`, gifUrl);
  } else {
    // Ultimate local set PNG fallback
    gifUrl = `./memes/${mood.image}`;
    console.log(`Using ultimate local PNG fallback for "${mood.name}":`, gifUrl);
  }

  // Set alt text
  if (gifUrl.includes('giphy.com')) {
    memeImage.alt = `Giphy GIF representing ${mood.name} mood`;
    gifUrl = convertToEmbeddableGiphyUrl(gifUrl);
  } else {
    memeImage.alt = `Meme representing ${mood.name} mood`;
  }
  
  // 4. Load and animate image/GIF with robust CORS Blob pre-fetch to secure canvas capability
  if (gifUrl.includes('giphy.com')) {
    try {
      const response = await fetch(gifUrl);
      if (response.ok) {
        const blob = await response.blob();
        memeImage.src = URL.createObjectURL(blob);
      } else {
        console.warn("External meme fetch failed, falling back directly to local set images.");
        gifUrl = `./memes/${mood.image}`;
        memeImage.src = gifUrl;
      }
    } catch (e) {
      console.error("Failed to pre-fetch external image blob, falling back directly to local set images:", e);
      gifUrl = `./memes/${mood.image}`;
      memeImage.src = gifUrl;
    }
  } else {
    // Already using local set image
    memeImage.src = gifUrl;
  }
  
  memeImage.onload = () => {
    memeSpinner.style.display = 'none';
    memeImage.classList.add('loaded');
  };
  
  memeImage.onerror = () => {
    memeSpinner.style.display = 'none';
    // If the image rendering fails, immediately load the local set image
    if (gifUrl.includes('giphy.com')) {
      console.warn("External image failed loading on page, falling back to local image.");
      gifUrl = `./memes/${mood.image}`;
      memeImage.src = gifUrl;
      memeImage.alt = `Meme representing ${mood.name} mood (local fallback)`;
    } else {
      showToast(`Failed loading meme for: ${mood.name}`);
    }
  };
}

/* ==========================================================================
   5. ROTARY DRAG LOGIC (Rotary physics)
   ========================================================================== */

function handleDragStart(clientX, clientY, targetHole) {
  isDragging = true;
  activeHoleIndex = parseInt(targetHole.getAttribute('data-index'));
  dialRotor.classList.remove('spinning-back');
  
  // Calculate center of interactive dial
  const dialRect = interactiveDial.getBoundingClientRect();
  const centerX = dialRect.left + dialRect.width / 2;
  const centerY = dialRect.top + dialRect.height / 2;
  
  // Starting vector mouse coordinates
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  startMouseAngle = Math.atan2(dy, dx) * 180 / Math.PI;
  lastMouseAngle = startMouseAngle; // Track previous frame angle
  currentRotation = 0;
  lastClickAngle = 0;
  
  // Trigger tactile hover update on static slot
  highlightSlot(activeHoleIndex, true);
  
  // Update central emblem labels to show active state
  showActiveState(MOODS[activeHoleIndex].emoji, MOODS[activeHoleIndex].name);
}

function handleDragMove(clientX, clientY) {
  if (!isDragging || activeHoleIndex === null) return;
  
  const dialRect = interactiveDial.getBoundingClientRect();
  const centerX = dialRect.left + dialRect.width / 2;
  const centerY = dialRect.top + dialRect.height / 2;
  
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const currentMouseAngle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Calculate change in mouse angle relative to the previous frame
  let diff = currentMouseAngle - lastMouseAngle;
  
  // Wrap to range [-180, 180] to handle boundary crossings cleanly
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;
  
  // Update last mouse angle for next frame
  lastMouseAngle = currentMouseAngle;
  
  // Accumulate the rotation (clockwise is positive)
  currentRotation += diff;
  
  // Prevent dragging backwards (counter-clockwise)
  if (currentRotation < 0) {
    currentRotation = 0;
  }
  
  // Constraint limits (finger hits metal stop)
  const maxAllowedRot = getHoleLimits(activeHoleIndex);
  if (currentRotation > maxAllowedRot) {
    currentRotation = maxAllowedRot;
  }
  
  dialRotor.style.transform = `rotate(${currentRotation}deg)`;
  
  // Synthesize mechanical ticking sound on angle thresholds
  const diffAngle = Math.abs(currentRotation - lastClickAngle);
  if (diffAngle >= CLICK_THRESHOLD_DEGS) {
    playMechanicalClick();
    lastClickAngle = currentRotation;
  }
  
  // Check if dragged close to the stop hook to add tactile glowing feel
  const closeToStop = (maxAllowedRot - currentRotation) < 15;
  const activeState = document.querySelector('.center-cap-active-state');
  if (closeToStop) {
    if (activeState) activeState.style.transform = 'scale(1.15)';
    dialHoverLabel.style.color = MOODS[activeHoleIndex].color;
  } else {
    if (activeState) activeState.style.transform = 'scale(1)';
    dialHoverLabel.style.color = '#8b7681';
  }
}

function handleDragEnd() {
  if (!isDragging || activeHoleIndex === null) return;
  
  isDragging = false;
  const maxAllowedRot = getHoleLimits(activeHoleIndex);
  
  // Successful Dial: if user released within 15 degrees of the Chrome Stop!
  const isDialedSuccessfully = (maxAllowedRot - currentRotation) < 15;
  
  highlightSlot(activeHoleIndex, false);
  
  // Animate the wheel spinning back to origin angle (0deg)
  dialRotor.classList.add('spinning-back');
  dialRotor.style.transform = `rotate(0deg)`;
  
  // Simulate clicking sounds on rebound
  const clickCount = Math.floor(currentRotation / CLICK_THRESHOLD_DEGS);
  const clickDelay = 450 / Math.max(1, clickCount); // 0.45s spin-back duration
  
  for (let i = clickCount; i > 0; i--) {
    setTimeout(() => {
      if (!isDragging) playMechanicalClick();
    }, (clickCount - i) * clickDelay);
  }
  
  setTimeout(() => {
    // Double check drag didn't resume
    if (isDragging) return;
    
    if (isDialedSuccessfully) {
      // Dial Success! Ring bell and open results card
      playRetroDoubleRing();
      showToast(`Selected: ${MOODS[activeHoleIndex].name.toUpperCase()}! 🔔`);
      
      const selectedIndex = activeHoleIndex;
      setTimeout(() => {
        showMemeResult(selectedIndex);
        resetCenterCap();
      }, 500);
    } else {
      resetCenterCap();
    }
    
    activeHoleIndex = null;
  }, 450); // Matches spin back time
}

// Helper to show active hovered/dialing state in center cap
function showActiveState(emoji, label) {
  const defaultState = document.querySelector('.center-cap-default-state');
  const activeState = document.querySelector('.center-cap-active-state');
  
  if (dialHoverEmoji) dialHoverEmoji.textContent = emoji;
  if (dialHoverLabel) {
    dialHoverLabel.textContent = label;
    dialHoverLabel.style.color = '#8b7681';
  }
  
  if (defaultState && activeState) {
    defaultState.style.opacity = '0';
    defaultState.style.transform = 'scale(0.9)';
    activeState.style.opacity = '1';
    activeState.style.transform = 'scale(1)';
    activeState.style.pointerEvents = 'auto';
  }
}

// Helper to reset center cap to default Russian stickers text
function resetCenterCap() {
  const defaultState = document.querySelector('.center-cap-default-state');
  const activeState = document.querySelector('.center-cap-active-state');
  
  if (defaultState && activeState) {
    defaultState.style.opacity = '1';
    defaultState.style.transform = 'scale(1)';
    activeState.style.opacity = '0';
    activeState.style.transform = 'scale(0.9)';
    activeState.style.pointerEvents = 'none';
  }
}

// Highlight the static background emoji slot on hover/press
function highlightSlot(idx, active) {
  const slot = moodSlotsContainer.querySelector(`[data-mood-idx="${idx}"]`);
  if (slot) {
    if (active) {
      slot.classList.add('active-hover');
    } else {
      slot.classList.remove('active-hover');
    }
  }
}

/* ==========================================================================
   6. ATTACH EVENTS & CANVAS GENERATION
   ========================================================================== */

// Generate a high-resolution Polaroid poster image matching the active view sentiment and design
async function generateShareableImageBlob() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1050;
  const ctx = canvas.getContext('2d');

  // 1. Soft radial premium background gradient matching the body theme
  const grad = ctx.createRadialGradient(400, 525, 0, 400, 525, 700);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(1, '#f5ecef');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1050);

  // 2. Draw "I am feeling" text
  ctx.fillStyle = '#381a20';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '400 32px "Outfit", system-ui, sans-serif';
  ctx.fillText('I am feeling', 400, 95);

  // 3. Draw Mood Name
  const currentMood = resultMoodName.textContent;
  const moodColor = resultMoodName.style.color || '#775666';
  ctx.fillStyle = moodColor;
  ctx.font = 'italic 800 84px "Playfair Display", Georgia, serif';
  ctx.fillText(currentMood.charAt(0).toUpperCase() + currentMood.slice(1), 400, 175);

  // 4. Draw Polaroid Card Background with soft drop shadow
  const cardW = 540;
  const cardH = 680;
  const cardX = (800 - cardW) / 2; // 130
  const cardY = 250;

  ctx.save();
  ctx.shadowColor = 'rgba(56, 26, 32, 0.12)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#fffdfb';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.restore();

  // Draw Polaroid Card Border
  ctx.strokeStyle = 'rgba(56, 26, 32, 0.05)';
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // 5. Draw Washi Tape at top-left
  ctx.save();
  ctx.translate(cardX - 10, cardY + 5);
  ctx.rotate(-12 * Math.PI / 180);
  ctx.fillStyle = 'rgba(243, 168, 162, 0.75)';
  ctx.fillRect(-65, -15, 130, 30);
  ctx.restore();

  // 6. Draw Meme Image (the loaded image/GIF)
  const imgW = cardW - 60; // 480
  const imgH = 480;
  const imgX = cardX + 30; // 160
  const imgY = cardY + 30; // 280

  ctx.fillStyle = '#faf6f5';
  ctx.fillRect(imgX, imgY, imgW, imgH);

  if (memeImage && memeImage.src) {
    try {
      // Use clean contain matching the CSS!
      const imgNaturalW = memeImage.naturalWidth || imgW;
      const imgNaturalH = memeImage.naturalHeight || imgH;
      const imgRatio = imgNaturalW / imgNaturalH;
      let drawW = imgW;
      let drawH = imgH;
      let drawX = imgX;
      let drawY = imgY;

      if (imgRatio > 1) {
        drawH = imgW / imgRatio;
        drawY = imgY + (imgH - drawH) / 2;
      } else {
        drawW = imgH * imgRatio;
        drawX = imgX + (imgW - drawW) / 2;
      }

      ctx.drawImage(memeImage, drawX, drawY, drawW, drawH);
    } catch (e) {
      console.error("Failed to render image to canvas:", e);
    }
  }

  // Draw media container border
  ctx.strokeStyle = 'rgba(56, 26, 32, 0.06)';
  ctx.lineWidth = 2;
  ctx.strokeRect(imgX, imgY, imgW, imgH);

  // 7. Draw Heart Charm at bottom-right corner of image container
  const heartX = imgX + imgW - 18;
  const heartY = imgY + imgH - 18;
  const heartSize = 56;

  ctx.save();
  ctx.shadowColor = 'rgba(56, 26, 32, 0.12)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = '#f48c96'; // Beautiful warm pink heart charm

  ctx.translate(heartX, heartY);
  const scale = heartSize / 24;
  ctx.scale(scale, scale);
  
  ctx.beginPath();
  ctx.moveTo(12 - 12, 21.35 - 12);
  ctx.lineTo(10.55 - 12, 20.03 - 12);
  ctx.bezierCurveTo(5.4 - 12, 15.36 - 12, 2 - 12, 12.28 - 12, 2 - 12, 8.5 - 12);
  ctx.bezierCurveTo(2 - 12, 5.42 - 12, 4.42 - 12, 3 - 12, 7.5 - 12, 3 - 12);
  ctx.bezierCurveTo(9.24 - 12, 3 - 12, 10.91 - 12, 3.81 - 12, 12 - 12, 5.09 - 12);
  ctx.bezierCurveTo(13.09 - 12, 3.81 - 12, 14.76 - 12, 3 - 12, 16.5 - 12, 3 - 12);
  ctx.bezierCurveTo(19.58 - 12, 3 - 12, 22 - 12, 5.42 - 12, 22 - 12, 8.5 - 12);
  ctx.bezierCurveTo(22 - 12, 12.28 - 12, 18.6 - 12, 15.36 - 12, 13.45 - 12, 20.04 - 12);
  ctx.lineTo(12 - 12, 21.35 - 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 8. Draw Date and Mood Number in caption
  const dateText = document.getElementById('current-date').textContent;
  const moodNumberText = document.getElementById('caption-mood-number').textContent;

  ctx.fillStyle = '#381a20';
  ctx.font = '700 26px "Outfit", system-ui, sans-serif';
  
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(dateText, cardX + 30, cardY + cardH - 50);

  ctx.textAlign = 'right';
  ctx.fillText(moodNumberText, cardX + cardW - 30, cardY + cardH - 50);

  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
}

function setupEventListeners() {
  // Redial resets and takes user back to dialing dial
  btnRedial.addEventListener('click', () => {
    navigateTo('dial');
  });
  
  btnShare.addEventListener('click', async () => {
    const currentMood = resultMoodName.textContent;
    showToast("Generating your vibe poster... 🎨");

    try {
      const blob = await generateShareableImageBlob();
      const file = new File([blob], `my-mood-meme-${currentMood.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' });
      
      const shareData = {
        files: [file],
        title: 'My Mood Meme',
        text: "If you were wondering how I'm doing..."
      };

      let sharedSuccessfully = false;
      
      // Attempt native file sharing if supported
      try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          sharedSuccessfully = true;
          showToast("Shared successfully! 🚀");
        }
      } catch (e) {
        console.warn("Native sharing failed or dismissed:", e);
        if (e.name === 'AbortError') {
          // User closed/dismissed the share sheet; treat as handled
          sharedSuccessfully = true;
        }
      }

      // Fallback for desktop/unsupported browsers: copy actual PNG image & download it
      if (!sharedSuccessfully) {
        let copiedSuccessfully = false;
        
        // 1. Try to copy actual image to clipboard
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            copiedSuccessfully = true;
            showToast("Image copied! Paste in any chat. 📋✨");
          }
        } catch (err) {
          console.error("Direct image copy to clipboard failed:", err);
        }

        // 2. Automatically trigger PNG file download
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `my-mood-meme-${currentMood.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

        if (!copiedSuccessfully) {
          showToast("Direct sharing unsupported. Poster downloaded! 📥");
        }
      }

    } catch (error) {
      console.error('Error generating or sharing vibe poster:', error);
      showToast("Failed to render share card.");
    }
  });

  // Touch and Mouse drag events mapped directly to dial rotor
  interactiveDial.addEventListener('mousedown', (e) => {
    const targetHole = e.target.closest('.finger-hole-interactive');
    if (targetHole) {
      e.preventDefault();
      handleDragStart(e.clientX, e.clientY, targetHole);
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      handleDragMove(e.clientX, e.clientY);
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      handleDragEnd();
    }
  });

  // Mobile Touch Gestures support
  interactiveDial.addEventListener('touchstart', (e) => {
    const targetHole = e.target.closest('.finger-hole-interactive');
    if (targetHole && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY, targetHole);
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    if (isDragging) {
      handleDragEnd();
    }
  });
}

// Toast helper
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
