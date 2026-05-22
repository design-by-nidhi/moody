/* ==========================================================================
   Mood Telephone - Core Interaction & Sound Logic
   ========================================================================== */

// 1. Mood Config & Data Map (Matches the exact 10 emojis in the uploaded image)
const MOODS = [
  { name: 'excited', emoji: '🤩', angle: 30, color: '#e09f3e', image: 'excited.png' },
  { name: 'confident', emoji: '😎', angle: 0, color: '#2ec4b6', image: 'confident.png' },
  { name: 'relaxed', emoji: '😌', angle: 330, color: '#b567ff', image: 'relaxed.png' },
  { name: 'okay', emoji: '🙂', angle: 300, color: '#52b788', image: 'okay.png' },
  { name: 'meh', emoji: '😑', angle: 270, color: '#94a3b8', image: 'meh.png' },
  { name: 'sleepy', emoji: '😴', angle: 240, color: '#00b4d8', image: 'sleepy.png' },
  { name: 'angry', emoji: '😡', angle: 210, color: '#ef4444', image: 'overstimulated.png' },
  { name: 'suprised', emoji: '😮', angle: 180, color: '#ff85a1', image: 'suprised.png' }, // Exact filename spelling matching "suprised.png"
  { name: 'cry', emoji: '😭', angle: 150, color: '#0284c7', image: 'melting.png' },
  { name: 'having fun', emoji: '🥳', angle: 120, color: '#ff4d6d', image: 'having fun.png' }
];

// Physical Stop Angle (bottom right at ~5:30)
const STOP_ANGLE = 75;

// GIPHY API Configuration
let giphyApiKey = "ncPJZIopUbyDU1R3KfSFqP2TR2shfx4L"; // High-reliability default owner key fallback
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
  'suprised': 'shocked gasp reaction'
};

// Premium Curated fallbacks mapping to 100% relevant and highly optimized reaction GIFs
const CURATED_GIFS = {
  'sleepy': [
    'https://media.giphy.com/media/d0SEaj53UXVXG/giphy.gif',
    'https://media.giphy.com/media/1018QWki8r08c8/giphy.gif',
    'https://media.giphy.com/media/Zg7clvqHE3yWk/giphy.gif'
  ],
  'meh': [
    'https://media.giphy.com/media/129OnZ9Qn2i0IE/giphy.gif',
    'https://media.giphy.com/media/3o7TKnOqEY2giAm9Lq/giphy.gif',
    'https://media.giphy.com/media/Fjr6v88OPk7U4/giphy.gif'
  ],
  'okay': [
    'https://media.giphy.com/media/26gJzZ426J9a1ESyc/giphy.gif',
    'https://media.giphy.com/media/BPjPvgQ909Q1W/giphy.gif',
    'https://media.giphy.com/media/nXxXxTo7Ut3mo/giphy.gif'
  ],
  'relaxed': [
    'https://media.giphy.com/media/3o7TKDzH7VN5fRy1nW/giphy.gif',
    'https://media.giphy.com/media/j6qyW5vU5HqMw/giphy.gif',
    'https://media.giphy.com/media/o0bcZ3r1FLZTO/giphy.gif'
  ],
  'confident': [
    'https://media.giphy.com/media/3o7TKu5UZIShyEJuOk/giphy.gif',
    'https://media.giphy.com/media/l2R013mIf1S5qp46A/giphy.gif',
    'https://media.giphy.com/media/l1J9LXPPgLvetagdG/giphy.gif'
  ],
  'excited': [
    'https://media.giphy.com/media/l3q2zVr6cu95nF6O4/giphy.gif',
    'https://media.giphy.com/media/14fnGKoWg1S44U/giphy.gif',
    'https://media.giphy.com/media/ckeHl52mNtoq87cr6a/giphy.gif'
  ],
  'having fun': [
    'https://media.giphy.com/media/l3V0lsG3Js9N1a8Le/giphy.gif',
    'https://media.giphy.com/media/ku5y1DQRCA76/giphy.gif',
    'https://media.giphy.com/media/l2JHZkNHxHKvoTj44/giphy.gif'
  ],
  'angry': [
    'https://media.giphy.com/media/11tI5s0n48AlHO/giphy.gif',
    'https://media.giphy.com/media/ksV59coBSnh5K/giphy.gif',
    'https://media.giphy.com/media/ntjBjvafcHqnC/giphy.gif'
  ],
  'cry': [
    'https://media.giphy.com/media/2WxWlkKWPI2OI/giphy.gif',
    'https://media.giphy.com/media/9PxJ1MRgYSQVOPs5qg/giphy.gif',
    'https://media.giphy.com/media/AauJT0w8cJoSQ/giphy.gif'
  ],
  'suprised': [
    'https://media.giphy.com/media/BcMJ586X2nLPy/giphy.gif',
    'https://media.giphy.com/media/3kzJvEciJa94SMW3hN/giphy.gif',
    'https://media.giphy.com/media/ebPX2g217Ic8M/giphy.gif'
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

// Show selection and load meme image (dynamic Giphy fetch with local fallback)
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
  
  // 3. Attempt to fetch dynamic Giphy GIF
  let gifUrl = '';
  const searchTag = GIPHY_TAGS[mood.name] || `${mood.name} reaction`;
  
  if (giphyApiKey) {
    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(searchTag)}&limit=30&rating=g`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json && json.data && json.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * json.data.length);
          const selectedGif = json.data[randomIndex];
          gifUrl = selectedGif.images.downsized?.url || selectedGif.images.original?.url || '';
        }
      } else {
        console.error('Giphy API error status:', response.status);
      }
    } catch (e) {
      console.error('Failed to fetch from Giphy:', e);
    }
  }
  
  // 4. Graceful local fallback using premium curated Giphy GIFs if Giphy fails or API key is not configured
  if (!gifUrl) {
    const fallbacks = CURATED_GIFS[mood.name] || [];
    if (fallbacks.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallbacks.length);
      gifUrl = fallbacks[randomIndex];
    } else {
      gifUrl = `./memes/${mood.image}`;
    }
    memeImage.alt = `Meme representing ${mood.name} mood (curated fallback)`;
  } else {
    memeImage.alt = `Giphy GIF representing ${mood.name} mood: ${searchTag}`;
  }
  
  // 5. Load and animate image/GIF
  memeImage.src = gifUrl;
  
  memeImage.onload = () => {
    memeSpinner.style.display = 'none';
    memeImage.classList.add('loaded');
  };
  
  memeImage.onerror = () => {
    memeSpinner.style.display = 'none';
    // Double fallback to alternative curated GIF if dynamic GIF URL fails at image rendering
    const fallbacks = CURATED_GIFS[mood.name] || [];
    const altFallback = fallbacks.find(url => url !== gifUrl) || `./memes/${mood.image}`;
    if (gifUrl !== altFallback) {
      gifUrl = altFallback;
      memeImage.src = gifUrl;
      memeImage.alt = `Meme representing ${mood.name} mood (double fallback)`;
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
   6. ATTACH EVENTS
   ========================================================================== */

function setupEventListeners() {
  // Redial resets and takes user back to dialing dial
  btnRedial.addEventListener('click', () => {
    navigateTo('dial');
  });
  
  // Polaroid share action
  btnShare.addEventListener('click', () => {
    const currentMood = resultMoodName.textContent;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Mood Meme',
        text: `I dialed my mood as ${currentMood.toUpperCase()} on the Retro Telephone! Check out my meme!`,
        url: window.location.href,
      })
      .then(() => showToast("Shared successfully! 🚀"))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: Copy to clipboard
      const copyText = `I am feeling ${currentMood.toUpperCase()} right now! Dial your mood on: ${window.location.href}`;
      navigator.clipboard.writeText(copyText)
        .then(() => showToast("Link copied to clipboard! 📋"))
        .catch(() => showToast("Failed to copy link."));
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
