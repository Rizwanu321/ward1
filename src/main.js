import './style.css'
import candidateImg from './assets/candidate.png'
import gasImg from './assets/gas.jpg'

// Data
const candidates = Array.from({ length: 10 }, (_, i) => {
  const id = i + 1;
  if (id === 1) {
    return {
      id,
      name: 'പി. വി. മുഹമ്മദ്',
      symbol: gasImg,
      party: 'Welfare Party',
      symbolName: 'ഗ്യാസ് സിലിണ്ടർ'
    };
  }
  return {
    id,
    name: '',
    symbol: '',
    party: '',
    symbolName: ''
  };
});

// App State
let hasVoted = false;

// DOM Elements
const app = document.querySelector('#app');

// Audio Context for Beep
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(duration = 2000) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'square'; // Harsh buzzer like sound
  oscillator.frequency.setValueAtTime(2000, audioCtx.currentTime); // High pitch

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
  }, duration);
}

// Render EVM View
function renderEVM() {
  const evmView = document.createElement('div');
  evmView.className = 'evm-container';
  evmView.innerHTML = `
    <div class="evm-header">
      <div class="ready-indicator">
        <span>Ready</span>
        <div id="ready-lamp" class="led-green active"></div>
      </div>
      <div class="unit-label">Amarambalam Ward 1</div>
    </div>
    <div class="candidates-list">
      ${candidates.map(c => `
        <div class="candidate-row">
          <div class="col-serial">${c.id}</div>
          <div class="col-name-symbol">
            <span class="candidate-name">${c.name}</span>
            ${c.symbol ? `<img src="${c.symbol}" class="candidate-symbol" alt="symbol" />` : ''}
          </div>
          <div class="col-action">
            <div id="led-${c.id}" class="led-red"></div>
            <button class="btn-vote" data-id="${c.id}" aria-label="Vote for candidate ${c.id}"></button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="evm-footer">
       Educational Purpose Only
    </div>
  `;
  return evmView;
}

// Render VVPAT Overlay (Exact Replica Design)
function renderVVPAT(candidate) {
  const overlay = document.getElementById('vvpat-overlay') || document.createElement('div');
  overlay.className = 'vvpat-overlay';
  overlay.id = 'vvpat-overlay';

  const serial = candidate ? (candidate.id < 10 ? `0${candidate.id}` : candidate.id) : '00';
  const name = candidate ? candidate.name : 'NAME';
  const symbol = candidate ? candidate.symbol : '';

  overlay.innerHTML = `
    <div class="vvpat-real-machine">
      <!-- Blue Top Housing -->
      <div class="vvpat-blue-top">
        <div class="vvpat-header-group">
           <div class="vvpat-brand-label">Bharat Electronics</div>
           <div class="vvpat-model-label">VVPAT</div>
        </div>
        
        <div class="vvpat-window-shell">
          <div class="vvpat-glass-window">
             <div class="vvpat-internal-chamber">
                <div class="vvpat-internal-light"></div>
                <!-- Paper Slip -->
                <div id="vvpat-slip" class="vvpat-paper-slip">
                  ${symbol ? `<img src="${symbol}" class="slip-symbol" alt="s">` : ''}
                </div>
             </div>
          </div>
        </div>

        <div class="vvpat-mid-shelf">
          <div class="vvpat-barcode-sticker">
            <div class="barcode-lines">|| ||||| || |||</div>
            <span class="barcode-text">BVT15074</span>
          </div>
          <div class="vvpat-power-led active"></div> 
        </div>
      </div>

      <!-- Grey Bottom Bin -->
      <div class="vvpat-grey-bottom">
        <div class="vvpat-eci-label">Election Commission of India</div>
      </div>
    </div>
  `;
  return overlay;
}

// Render Success View (Grand Victory Theme)
function renderSuccess(candidate) {
  const view = document.createElement('div');
  view.className = 'success-container hidden';
  view.id = 'success-view';

  // SVG Icons
  const checkIcon = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const refreshIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;

  view.innerHTML = `
    <!-- Background Animated Shapes -->
    <div class="bg-shape"></div>
    <div class="bg-shape"></div>
    <div class="bg-shape"></div>
    <div class="bg-shape"></div>
    <div class="bg-shape"></div>

    <!-- Top Ribbon Notification -->
    <div class="top-ribbon">
      ${checkIcon}
      <span>VOTE VERIFIED</span>
    </div>

    <!-- Confetti Canvas -->
    <canvas id="confetti-canvas"></canvas>

    <div class="success-card">
      <div class="success-content-pad">
        <div class="vote-verified-icon">
          ${checkIcon}
        </div>
        
        <h2 class="success-title">ജനമനസ്സുകളിൽ<br>ഒന്നാമത്</h2>
        <div class="success-subtitle">OFFICIAL ELECTION RECORD</div>

        <div class="candidate-profile-section">
          <div class="card-inner-content">
            <div class="profile-circle">
              <img src="${candidateImg}" alt="Candidate" />
            </div>
            
            <h3 class="candidate-name-large">${candidate.name}</h3>
            
            <div class="info-badges">
              <span class="badge badge-id">ID: #${candidate.id}</span>
              <span class="badge badge-party">${candidate.party}</span>
              <span class="badge badge-symbol">
                <img src="${candidate.symbol}" style="width:16px;height:16px;" alt="s"/>
                ${candidate.symbolName}
              </span>
            </div>
          </div>
        </div>

        <button id="reset-btn" class="btn-new-vote">
          ${refreshIcon}
          CAST NEW VOTE
        </button>
      </div>
    </div>
  `;
  return view;
}

// Simple Canvas Confetti Implementation
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 150;
  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2, // Start from center
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 2) * 15,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100,
      gravity: 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = false;

    particles.forEach(p => {
      if (p.life > 0) {
        activeParticles = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life--;
        p.size *= 0.99; // Shrink slowly

        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Draw confetti shape (rect or circle)
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Optional: add rotation logic if using rects, but circles are cheaper
      }
    });

    if (activeParticles) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// Initialize
function init() {
  app.innerHTML = '';

  const evm = renderEVM();
  const vvpat = renderVVPAT();
  const success = renderSuccess(candidates[0]); // Setup success wrapper

  app.appendChild(evm);
  app.appendChild(vvpat);
  app.appendChild(success);

  // Event Listeners
  const voteBtns = document.querySelectorAll('.btn-vote');

  voteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (hasVoted) return;

      const id = parseInt(e.target.dataset.id);
      const candidate = candidates.find(c => c.id === id);

      // If candidate has no name (is blank/invalid), do nothing
      if (!candidate || !candidate.name) return;

      handleVote(id);
    });
  });

  document.getElementById('reset-btn').addEventListener('click', resetEVM);
}

function handleVote(id) {
  hasVoted = true;

  // 1. Resume Audio Context
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // 2. Visual Feedback on EVM
  const redLed = document.getElementById(`led-${id}`);
  const readyLamp = document.getElementById('ready-lamp');

  if (redLed) redLed.classList.add('active');
  if (readyLamp) readyLamp.classList.remove('active'); // Ready light off

  // 3. Audio Feedback
  playBeep(2000); // 2 second beep

  // 4. Trigger VVPAT Animation
  const candidate = candidates.find(c => c.id === id) || candidates[0];

  // Re-render VVPAT with specific candidate details to update the slip
  const overlay = renderVVPAT(candidate);
  // Ensure overlay exists in DOM
  if (!document.getElementById('vvpat-overlay')) app.appendChild(overlay);

  // Show VVPAT Overlay
  const vvpatOverlay = document.getElementById('vvpat-overlay');
  vvpatOverlay.classList.add('visible');

  // Start Animation
  const slip = document.getElementById('vvpat-slip');
  if (slip) {
    slip.classList.remove('animate-vote');
    void slip.offsetWidth; // Trigger reflow
    slip.classList.add('animate-vote');
  }

  // 5. Play Cut Sound when slip drops (approx 3s into animation)
  setTimeout(() => {
    playCutSound();
  }, 3000);

  // 6. Navigate to Success Page after VVPAT animation (approx 4s)
  setTimeout(() => {
    // Hide VVPAT
    vvpatOverlay.classList.remove('visible');

    // Show Success
    showSuccess(candidate);
  }, 4100); // 4s animation + 0.1s buffer
}

function playCutSound() {
  const t = audioCtx.currentTime;

  // 1. Mechanical "Cluster" / Solenoid Thud
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(80, t);
  osc.frequency.exponentialRampToValueAtTime(10, t + 0.1);
  gain.gain.setValueAtTime(0.8, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.15);

  // 2. Paper "Snip" / Friction Noise
  const bufferSize = audioCtx.sampleRate * 0.1; // 0.1 seconds
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.5, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
  noise.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start(t);
}

function showSuccess(candidate) {
  const evmView = document.querySelector('.evm-container');

  // Remove old success view if any
  const oldView = document.getElementById('success-view');
  if (oldView) oldView.remove();

  // Create new one
  const newSuccessView = renderSuccess(candidate);
  newSuccessView.classList.remove('hidden'); // Make it visible immediately
  app.appendChild(newSuccessView);

  // Re-attach listener
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetEVM);
  }

  evmView.style.display = 'none';

  // Trigger Celebration
  triggerConfetti();
}

function resetEVM() {
  hasVoted = false;

  // Reset EVM UI
  document.querySelectorAll('.led-red').forEach(el => el.classList.remove('active'));
  document.getElementById('ready-lamp').classList.add('active');

  // Reset VVPAT
  document.getElementById('vvpat-overlay').classList.remove('visible');
  document.getElementById('vvpat-slip').classList.remove('animate-vote');

  // Show EVM
  document.querySelector('.evm-container').style.display = 'flex';

  // Remove Success View
  const successView = document.getElementById('success-view');
  if (successView) successView.remove();
}

init();
