/**
 * AISHWARYA-WEBSITE — JAVASCRIPT NARRATIVE ENGINE
 * Handles Starfield Canvas, Audio Vinyl Player, Rigged Love Calculator,
 * Relationship Live Counter, Quiz Engine, Love Letter, and Finale Typewriter
 */

document.addEventListener('DOMContentLoaded', function () {
  
  // =========================================================================
  // 1. INITIALIZE AOS ANIMATIONS
  // =========================================================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 900,
      once: true,
      offset: 50,
    });
  }

  // =========================================================================
  // 2. BACKGROUND STARFIELD & ROSE PETAL CANVAS
  // =========================================================================
  const canvas = document.getElementById('universe-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Stars
    const stars = [];
    const starCount = Math.min(Math.floor(window.innerWidth / 12), 120);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    // Floating Rose Petals
    const petals = [];
    const petalCount = 20;
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        w: 12 + Math.random() * 8,
        h: 9 + Math.random() * 6,
        alpha: 0.3 + Math.random() * 0.4,
        speedX: 0.5 + Math.random() * 0.8,
        speedY: 0.6 + Math.random() * 0.9,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw Twinkling Stars (Warm Champagne Starlight)
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.speed = -star.speed;
        }
        ctx.fillStyle = `rgba(255, 244, 214, ${Math.abs(star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Floating Stardust & Rose-Gold Petals
      petals.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rot += p.rotSpeed;

        if (p.y > height + 20 || p.x > width + 20) {
          p.x = Math.random() * width - 50;
          p.y = -20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(229, 193, 88, ${p.alpha})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w, p.h, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  // =========================================================================
  // 3. BACKGROUND MUSIC & VINYL DISK CONTROLLER
  // =========================================================================
  const audio = document.getElementById('bg-audio');
  const vinylDisc = document.getElementById('vinyl-disc');
  const trackDrawer = document.getElementById('track-drawer');
  const nowPlayingLabel = document.getElementById('now-playing-label');
  const trackButtons = document.querySelectorAll('.track-select-btn');
  const trackCards = document.querySelectorAll('.track-card');

  const tracks = {
    perfect: { src: 'audio/perfect.mp3', title: 'Perfect' },
    'thousand-years': { src: 'audio/thousand-years.mp3', title: 'A Thousand Years' },
    'all-of-me': { src: 'audio/all-of-me.mp3', title: 'All of Me' },
  };

  function playTrack(trackKey) {
    if (!audio || !tracks[trackKey]) return;
    audio.src = tracks[trackKey].src;
    audio.play().then(() => {
      vinylDisc?.classList.add('playing');
      if (nowPlayingLabel) nowPlayingLabel.textContent = tracks[trackKey].title;
    }).catch((err) => console.log('Audio autoplay prevented:', err));
  }

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        vinylDisc?.classList.add('playing');
      }).catch(console.error);
    } else {
      audio.pause();
      vinylDisc?.classList.remove('playing');
    }
  }

  if (vinylDisc) {
    vinylDisc.addEventListener('click', (e) => {
      e.stopPropagation();
      trackDrawer?.classList.toggle('open');
      toggleAudio();
    });
  }

  // Close track drawer on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#music-widget')) {
      trackDrawer?.classList.remove('open');
    }
  });

  // Track switching via drawer buttons
  trackButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const trackKey = btn.getAttribute('data-track');
      playTrack(trackKey);
    });
  });

  // Track switching via cards in Act 7
  trackCards.forEach((card) => {
    card.addEventListener('click', () => {
      const trackKey = card.getAttribute('data-track');
      playTrack(trackKey);
      card.classList.add('ring-2', 'ring-pink-500');
      setTimeout(() => card.classList.remove('ring-2', 'ring-pink-500'), 1500);
    });
  });

  // =========================================================================
  // 4. ACT 0: ENTER THE UNIVERSE GATE & 9-BOX PUZZLE GATE TRANSITION
  // =========================================================================
  const enterBtn = document.getElementById('enter-universe-btn');
  const prologueGate = document.getElementById('prologue-gate');
  const puzzleGate = document.getElementById('puzzle-gate');
  const bgVideo = document.getElementById('bg-video');
  // --- Smooth Video Audio Fade In / Out Helpers ---
  function fadeInVideoAudio(videoEl, targetVolume = 0.85, durationMs = 2500) {
    if (!videoEl) return;
    videoEl.volume = 0;
    const intervalMs = 50;
    const steps = durationMs / intervalMs;
    const stepVolume = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      if (videoEl.volume + stepVolume >= targetVolume || currentStep >= steps) {
        videoEl.volume = targetVolume;
        clearInterval(fadeInterval);
      } else {
        videoEl.volume = Math.min(targetVolume, videoEl.volume + stepVolume);
      }
    }, intervalMs);
  }

  function fadeOutVideoAudio(videoEl, durationMs = 1400, onComplete) {
    if (!videoEl) {
      if (onComplete) onComplete();
      return;
    }
    const intervalMs = 50;
    const steps = durationMs / intervalMs;
    const startVolume = videoEl.volume;
    const stepVolume = startVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      if (videoEl.volume - stepVolume <= 0.01 || currentStep >= steps) {
        videoEl.volume = 0;
        clearInterval(fadeInterval);
        videoEl.pause();
        if (onComplete) onComplete();
      } else {
        videoEl.volume = Math.max(0, videoEl.volume - stepVolume);
      }
    }, intervalMs);
  }

  // Background Video Audio ON by default with smooth Fade-In!
  if (bgVideo) {
    bgVideo.muted = false;
    bgVideo.volume = 0;

    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        fadeInVideoAudio(bgVideo, 0.85, 2500);
      }).catch((err) => {
        // If browser blocks unmuted autoplay without user gesture, start muted
        // and immediately unmute with smooth fade-in on the very first touch/click anywhere!
        console.log('Autoplay with sound waiting for user gesture:', err);
        bgVideo.muted = true;
        bgVideo.play().catch(() => {});

        const unmuteOnFirstGesture = () => {
          bgVideo.muted = false;
          bgVideo.volume = 0;
          bgVideo.play().then(() => {
            fadeInVideoAudio(bgVideo, 0.85, 2500);
          }).catch(() => {});
          window.removeEventListener('click', unmuteOnFirstGesture);
          window.removeEventListener('touchstart', unmuteOnFirstGesture);
          window.removeEventListener('scroll', unmuteOnFirstGesture);
        };
        window.addEventListener('click', unmuteOnFirstGesture, { once: true });
        window.addEventListener('touchstart', unmuteOnFirstGesture, { once: true });
        window.addEventListener('scroll', unmuteOnFirstGesture, { once: true });
      });
    }
  }

  // Lock body scroll while gates are active
  document.body.classList.add('gate-active');

  // =========================================================================
  // THE 9-BOX MEMORY PICTURE PUZZLE ENGINE (3x3 Grid)
  // =========================================================================
  const puzzleBoard = document.getElementById('puzzle-board');
  const puzzleMovesCountEl = document.getElementById('puzzle-moves-count');
  const togglePeekBtn = document.getElementById('toggle-peek-btn');
  const closePeekBtn = document.getElementById('close-peek-btn');
  const peekPreview = document.getElementById('puzzle-peek-preview');
  const toggleNumbersBtn = document.getElementById('toggle-numbers-btn');
  const autoSolveBtn = document.getElementById('auto-solve-btn');
  const puzzleVictoryBanner = document.getElementById('puzzle-victory-banner');
  const puzzleContinueBtn = document.getElementById('puzzle-continue-btn');

  // State: 8 tiles (indices 0..7) + 1 blank space (null)
  let puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, null];
  let movesCount = 0;
  let showNumbers = false;
  let puzzleSolved = false;
  let puzzleInitialized = false;

  // Background position for 3x3 tile id (0 to 8)
  function getTileBgPos(tileId) {
    const col = tileId % 3;
    const row = Math.floor(tileId / 3);
    return `${col * 50}% ${row * 50}%`;
  }

  // Find all slots directly adjacent (up, down, left, right) to the empty space
  function getMovableSlots() {
    const blankSlot = puzzleState.indexOf(null);
    if (blankSlot === -1) return [];

    const bRow = Math.floor(blankSlot / 3);
    const bCol = blankSlot % 3;
    const movables = [];

    if (bRow > 0) movables.push(blankSlot - 3); // Up
    if (bRow < 2) movables.push(blankSlot + 3); // Down
    if (bCol > 0) movables.push(blankSlot - 1); // Left
    if (bCol < 2) movables.push(blankSlot + 1); // Right

    return movables;
  }

  function renderPuzzleTiles() {
    if (!puzzleBoard) return;
    puzzleBoard.innerHTML = '';
    const movables = puzzleSolved ? [] : getMovableSlots();

    puzzleState.forEach((tileId, slotIndex) => {
      const tileEl = document.createElement('div');

      if (tileId === null) {
        // Blank / Empty Slot
        tileEl.className = 'puzzle-tile empty-slot flex items-center justify-center';
        tileEl.setAttribute('data-slot', slotIndex);
        tileEl.style.backgroundImage = 'none';
        const blankHint = document.createElement('span');
        blankHint.className = 'text-amber-400/40 text-[11px] font-mono select-none tracking-widest';
        blankHint.textContent = 'OPEN';
        tileEl.appendChild(blankHint);
      } else {
        // Image Tile (0 to 7, or 8 on completion)
        tileEl.className = 'puzzle-tile';
        if (movables.includes(slotIndex)) {
          tileEl.classList.add('movable');
          tileEl.title = 'Click to slide into empty space';
        }
        tileEl.setAttribute('data-slot', slotIndex);
        tileEl.setAttribute('data-tile-id', tileId);
        tileEl.style.backgroundImage = "url('img/imagees.jpg')";
        tileEl.style.backgroundSize = "300% 300%";
        tileEl.style.backgroundPosition = getTileBgPos(tileId);

        if (showNumbers) {
          const numBadge = document.createElement('span');
          numBadge.className = 'tile-number';
          numBadge.textContent = tileId + 1;
          tileEl.appendChild(numBadge);
        }

        tileEl.addEventListener('click', (e) => {
          e.stopPropagation();
          handleTileClick(slotIndex);
        });
      }

      puzzleBoard.appendChild(tileEl);
    });

    if (puzzleMovesCountEl) {
      puzzleMovesCountEl.textContent = movesCount;
    }
  }

  function handleTileClick(slotIndex) {
    if (puzzleSolved) return;
    const blankSlot = puzzleState.indexOf(null);
    if (blankSlot === -1) return;

    const movables = getMovableSlots();

    if (movables.includes(slotIndex)) {
      // Valid slide! Slide clicked tile into blank space
      puzzleState[blankSlot] = puzzleState[slotIndex];
      puzzleState[slotIndex] = null;

      movesCount++;
      renderPuzzleTiles();
      checkPuzzleSolved();
    } else {
      // Not adjacent: gentle playful shake
      const tileEl = puzzleBoard?.children[slotIndex];
      if (tileEl && puzzleState[slotIndex] !== null) {
        tileEl.classList.remove('shake');
        void tileEl.offsetWidth; // Trigger reflow for animation
        tileEl.classList.add('shake');
      }
    }
  }

  function checkPuzzleSolved() {
    // Solved if tiles 0..7 are in slots 0..7 and slot 8 is null
    for (let i = 0; i < 8; i++) {
      if (puzzleState[i] !== i) return false;
    }
    if (puzzleState[8] !== null) return false;

    onPuzzleCompleted();
    return true;
  }

  function onPuzzleCompleted() {
    puzzleSolved = true;
    // Fill the missing 9th piece (tileId 8) to show the full completed picture!
    puzzleState[8] = 8;
    renderPuzzleTiles();

    if (puzzleBoard) {
      puzzleBoard.classList.add('solved');
    }
    const puzzleCard = document.querySelector('.romantic-puzzle-card');
    if (puzzleCard) {
      puzzleCard.classList.add('puzzle-completed');
    }
    const puzzleTitle = document.getElementById('puzzle-title');
    if (puzzleTitle) {
      puzzleTitle.textContent = "Our Picture Is Complete! ✨";
    }
    const puzzleBadgeText = document.getElementById('puzzle-badge-text');
    if (puzzleBadgeText) {
      puzzleBadgeText.textContent = "Memory Complete 💖";
    }
    if (puzzleVictoryBanner) {
      puzzleVictoryBanner.classList.remove('hidden');
    }

    // Celebration Confetti Explosion (Gold & Starlight)
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#e5c158', '#facc15', '#f59e0b', '#fbbf24', '#ffffff', '#fb7185'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 80,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 80,
          origin: { x: 1 },
        });
      }, 350);
    }
  }

  function unlockPuzzleGate() {
    if (!puzzleGate) return;
    puzzleGate.classList.add('unlocked');
    document.body.classList.remove('gate-active');
    document.body.classList.add('pre-story-locked');
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Reset Yes/No interactive gate state so it is freshly visible and centered
    resetYesNoGate();

    // 1. Smoothly fade out the background video container opacity over 2000ms
    const bgVideoContainer = document.getElementById('bg-video-container');
    if (bgVideoContainer) {
      bgVideoContainer.style.transition = 'opacity 2000ms cubic-bezier(0.4, 0, 0.2, 1)';
      bgVideoContainer.style.opacity = '0';
    }

    // 2. Concurrently fade out video audio over 2000ms
    if (bgVideo) {
      fadeOutVideoAudio(bgVideo, 2000, () => {
        bgVideo.pause();
        if (bgVideoContainer) {
          bgVideoContainer.classList.add('hidden-video');
          bgVideoContainer.style.display = 'none';
        }
      });
    } else if (bgVideoContainer) {
      bgVideoContainer.classList.add('hidden-video');
      bgVideoContainer.style.display = 'none';
    }

    // 3. Immediately hide the puzzle gate modal without delay or lingering fade
    if (puzzleGate) {
      puzzleGate.classList.add('hidden');
      puzzleGate.classList.remove('flex');
      puzzleGate.style.display = 'none';
      puzzleGate.style.opacity = '0';
      puzzleGate.style.transition = 'none';
    }

    // 4. Reveal main narrative content immediately
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.classList.remove('hidden');
      mainContent.style.opacity = '1';
      mainContent.style.transition = 'none';
    }
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }

    // 5. Cross-fade the romantic audio in from volume 0 up to 0.75 over 2000ms
    if (audio) {
      audio.volume = 0;
      audio.play().then(() => {
        vinylDisc?.classList.add('playing');
        if (nowPlayingLabel) nowPlayingLabel.textContent = tracks['perfect']?.title || 'Perfect';
        let vol = 0;
        const volInterval = setInterval(() => {
          vol += 0.05;
          if (vol >= 0.75) {
            audio.volume = 0.75;
            clearInterval(volInterval);
          } else {
            audio.volume = vol;
          }
        }, 120);
      }).catch((err) => {
        console.log('Audio playback initiated:', err);
      });
    }

    // 6. Ensure screen is neatly pinned at top with zero scroll
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (puzzleContinueBtn) {
    puzzleContinueBtn.addEventListener('click', unlockPuzzleGate);
  }

  function initPuzzle() {
    if (puzzleInitialized) return;
    puzzleInitialized = true;
    movesCount = 0;
    puzzleSolved = false;

    // Start with solved state: 8 tiles (0..7) and 1 blank space (null) at slot 8
    puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, null];

    // Scramble by performing 60 valid random slides (guarantees 100% solvable puzzle)
    let lastBlankSlot = 8;
    for (let i = 0; i < 60; i++) {
      const movables = getMovableSlots().filter((s) => s !== lastBlankSlot);
      const pickSlot = movables.length > 0
        ? movables[Math.floor(Math.random() * movables.length)]
        : getMovableSlots()[0];
      const blankSlot = puzzleState.indexOf(null);
      puzzleState[blankSlot] = puzzleState[pickSlot];
      puzzleState[pickSlot] = null;
      lastBlankSlot = blankSlot;
    }

    // Ensure it's not accidentally in the solved state
    if (puzzleState.every((v, i) => (i < 8 ? v === i : v === null))) {
      const movables = getMovableSlots();
      const pickSlot = movables[0];
      const blankSlot = puzzleState.indexOf(null);
      puzzleState[blankSlot] = puzzleState[pickSlot];
      puzzleState[pickSlot] = null;
    }

    renderPuzzleTiles();
  }

  // Initialize and build puzzle tiles so they are ready
  initPuzzle();

  // First Landing Page: "LET'S BEGIN OUR JOURNEY" -> reveals 9-box puzzle
  if (enterBtn && prologueGate) {
    enterBtn.addEventListener('click', () => {
      prologueGate.classList.add('unlocked');
      setTimeout(() => {
        prologueGate.style.display = 'none';
      }, 700);

      if (bgVideo) {
        if (bgVideo.muted) {
          bgVideo.muted = false;
        }
        if (bgVideo.paused) {
          bgVideo.play().then(() => {
            if (bgVideo.volume < 0.2) fadeInVideoAudio(bgVideo, 0.85, 2000);
          }).catch(console.error);
        } else if (bgVideo.volume < 0.2) {
          fadeInVideoAudio(bgVideo, 0.85, 2000);
        }
      }

      if (puzzleGate) {
        puzzleGate.classList.remove('hidden');
        puzzleGate.classList.add('flex');
        renderPuzzleTiles();
      }

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#e5c158', '#facc15', '#f59e0b', '#ffffff'],
        });
      }
    });
  }

  // Toggle Peek preview
  if (togglePeekBtn && peekPreview) {
    togglePeekBtn.addEventListener('click', () => {
      peekPreview.classList.toggle('hidden');
    });
  }
  if (closePeekBtn && peekPreview) {
    closePeekBtn.addEventListener('click', () => {
      peekPreview.classList.add('hidden');
    });
  }

  // Toggle numbers
  if (toggleNumbersBtn) {
    toggleNumbersBtn.addEventListener('click', () => {
      showNumbers = !showNumbers;
      toggleNumbersBtn.classList.toggle('bg-pink-800', showNumbers);
      renderPuzzleTiles();
    });
  }

  // Auto solve bypass
  if (autoSolveBtn) {
    autoSolveBtn.addEventListener('click', () => {
      puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, null];
      renderPuzzleTiles();
      onPuzzleCompleted();
    });
  }

  // =========================================================================
  // 5. LIVE RELATIONSHIP COUNTER (From 03-01-2025)
  // =========================================================================
  // Start date: January 3, 2025 (03-01-2025)
  const relationshipStart = new Date('2025-01-03T00:00:00');

  function updateRelationshipCounter() {
    const now = new Date();
    const diff = now - relationshipStart;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const dEl = document.getElementById('counter-days');
      const hEl = document.getElementById('counter-hours');
      const mEl = document.getElementById('counter-minutes');
      const sEl = document.getElementById('counter-seconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }
  }

  setInterval(updateRelationshipCounter, 1000);
  updateRelationshipCounter();

  // =========================================================================
  // INTERACTIVE GATE: "ARE YOU READY TO STEP INTO OUR MEMORIES?"
  // =========================================================================
  const askYesBtn = document.getElementById('ask-yes-btn');
  const askCatImg = document.getElementById('ask-cat-img');
  const askQuestionText = document.getElementById('ask-question-text');
  const askButtonsWrap = document.getElementById('ask-buttons-wrap');
  const askSuccessMsg = document.getElementById('ask-success-msg');
  const heroScrollIndicator = document.getElementById('hero-scroll-indicator');
  const unlockedStoryContent = document.getElementById('unlocked-story-content');

  function resetYesNoGate() {
    if (askYesBtn) {
      askYesBtn.style.transform = 'scale(1)';
      askYesBtn.style.boxShadow = '';
    }
    if (askCatImg) {
      askCatImg.style.opacity = '1';
      askCatImg.src = 'img/ready-for-memories.jpg';
      askCatImg.alt = 'Are you ready to step into our memories?';
    }
    if (askQuestionText) {
      askQuestionText.style.opacity = '1';
      askQuestionText.textContent = '"Are you ready to step into our world of memories? ✨"';
    }
    if (askButtonsWrap) {
      askButtonsWrap.classList.remove('hidden');
    }
    if (askSuccessMsg) {
      askSuccessMsg.classList.add('hidden');
    }
    if (heroScrollIndicator) {
      heroScrollIndicator.classList.add('hidden', 'opacity-0');
      heroScrollIndicator.classList.remove('opacity-100');
    }
  }

  // Initialize gate state
  resetYesNoGate();

  if (askYesBtn && unlockedStoryContent) {
    askYesBtn.addEventListener('click', () => {
      // Unlock page scrolling and let footer move to bottom of full story
      document.body.classList.remove('pre-story-locked');
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';

      // 1. Celebration romantic couple image with smooth crossfade
      if (askCatImg) {
        askCatImg.style.opacity = '0';
        setTimeout(() => {
          askCatImg.src = 'img/memories-unlocked.jpg';
          askCatImg.alt = 'Our memories unlocked';
          askCatImg.style.opacity = '1';
        }, 150);
      }
      if (askQuestionText) {
        askQuestionText.style.opacity = '0';
        setTimeout(() => {
          askQuestionText.textContent = '"Then take my hand... let\'s relive every magical second together 💖✨"';
          askQuestionText.style.opacity = '1';
        }, 150);
      }

      // 2. Hide buttons wrap and reveal success message smoothly
      if (askButtonsWrap) {
        askButtonsWrap.classList.add('hidden');
      }
      if (askSuccessMsg) {
        askSuccessMsg.classList.remove('hidden');
      }

      // Reveal gentle scroll down indicator with fade-in
      if (heroScrollIndicator) {
        heroScrollIndicator.classList.remove('hidden');
        requestAnimationFrame(() => {
          heroScrollIndicator.classList.remove('opacity-0');
          heroScrollIndicator.classList.add('opacity-100');
        });
      }

      // 3. Trigger Confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
          colors: ['#ff2a70', '#ff69b4', '#ffd700', '#ffffff', '#ff85a2'],
        });
      }

      // 4. Reveal story content smoothly (no layout jump or movement)
      unlockedStoryContent.classList.remove('hidden');
      requestAnimationFrame(() => {
        unlockedStoryContent.classList.remove('opacity-0');
        unlockedStoryContent.classList.add('opacity-100');
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    });
  }

  // =========================================================================
  // 6. RIGGED LOVE CALCULATOR (99.9999% GUARANTEED)
  // =========================================================================
  const calcBtn = document.getElementById('calc-trigger-btn');
  const calcScanning = document.getElementById('calc-scanning-wrap');
  const calcMeterFill = document.getElementById('calc-meter-fill');
  const calcStatusText = document.getElementById('calc-status-text');
  const calcResultBox = document.getElementById('calc-result-box');

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const name1Input = document.getElementById('calc-name1');
      const name2Input = document.getElementById('calc-name2');
      const name1 = name1Input?.value.trim() || 'You';
      const name2 = name2Input?.value.trim() || 'Your Soulmate';

      calcBtn.disabled = true;
      calcBtn.classList.add('opacity-50', 'cursor-not-allowed');

      calcResultBox?.classList.add('hidden');
      calcScanning?.classList.remove('hidden');
      if (calcMeterFill) calcMeterFill.style.width = '0%';

      const scanPhases = [
        { progress: '25%', text: `Scanning heart-rate telemetry for ${name1} & ${name2}... 💓` },
        { progress: '50%', text: 'Measuring tolerance to terrible dad jokes... 😂' },
        { progress: '75%', text: 'Detecting stolen hoodies and missing french fries... 🍟' },
        { progress: '95%', text: 'Computing cosmic destiny and eternal alignment... ✨' },
        { progress: '100%', text: 'CALCULATION COMPLETE! 🎉' },
      ];

      scanPhases.forEach((phase, index) => {
        setTimeout(() => {
          if (calcMeterFill) calcMeterFill.style.width = phase.progress;
          if (calcStatusText) calcStatusText.textContent = phase.text;
        }, index * 650);
      });

      // Reveal Result + Explosion
      setTimeout(() => {
        calcScanning?.classList.add('hidden');
        calcResultBox?.classList.remove('hidden');
        calcBtn.disabled = false;
        calcBtn.classList.remove('opacity-50', 'cursor-not-allowed');

        const calcResultSub = calcResultBox?.querySelector('.font-romantic');
        if (calcResultSub) {
          calcResultSub.textContent = `"${name1} + ${name2} = Mathematically, Astronomically & Eternally Destined"`;
        }

        // Confetti Fireworks Blast
        if (typeof confetti === 'function') {
          // Central Explosion
          confetti({
            particleCount: 180,
            spread: 360,
            startVelocity: 50,
            origin: { x: 0.5, y: 0.6 },
            colors: ['#ff2a70', '#ff69b4', '#ffd700', '#00ffff', '#9b51e0', '#ffffff'],
            zIndex: 9999,
          });

          // Star Shower
          setTimeout(() => {
            confetti({
              particleCount: 80,
              spread: 120,
              origin: { x: 0.5, y: 0.5 },
              shapes: ['star'],
              colors: ['#ffd700', '#ffffff', '#ff69b4'],
              scalar: 1.5,
              zIndex: 9999,
            });
          }, 250);
        }
      }, scanPhases.length * 650 + 400);
    });
  }

  // =========================================================================
  // 7. ACT 6: QUIZ ENGINE & RUNAWAY BUTTON
  // =========================================================================
  const quizButtons = document.querySelectorAll('.quiz-option-btn:not(#runaway-quiz-btn)');
  quizButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.quiz-item');
      if (!parent) return;

      // Unselect siblings
      parent.querySelectorAll('.quiz-option-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Show Feedback
      const feedbackBox = parent.querySelector('.quiz-feedback-box');
      const response = btn.getAttribute('data-response');
      if (feedbackBox && response) {
        feedbackBox.textContent = response;
        feedbackBox.classList.remove('hidden');
      }
    });
  });

  // Runaway "No" Button on Question 3
  const runawayBtn = document.getElementById('runaway-quiz-btn');
  if (runawayBtn) {
    let dodgeCount = 0;
    const playfulTexts = ['No', 'Nope 😜', 'Wait 💨', 'Oops! 🙈', 'Can\'t! 😉', 'Try again 🏃'];

    // Safe, bounded coordinates that stay neatly inside the card and never overlap the question title above
    const safeOffsets = [
      { x: -50, y: 15 },
      { x: -25, y: -10 },
      { x: -70, y: 12 },
      { x: -10, y: 20 },
      { x: -55, y: -8 },
      { x: -35, y: 22 },
    ];

    const dodge = (e) => {
      if (e) e.preventDefault();
      dodgeCount++;

      // Playfully change text
      const span = runawayBtn.querySelector('span') || runawayBtn;
      span.textContent = playfulTexts[dodgeCount % playfulTexts.length];

      const offset = safeOffsets[dodgeCount % safeOffsets.length];
      runawayBtn.style.setProperty('transform', `translate(${offset.x}px, ${offset.y}px)`, 'important');
    };

    runawayBtn.addEventListener('mouseenter', dodge);
    runawayBtn.addEventListener('pointerenter', dodge);
    runawayBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodge(e);
    }, { passive: false });
    runawayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dodge(e);

      // Playful feedback if they manage to click it
      const parent = runawayBtn.closest('.quiz-item');
      const feedbackBox = parent?.querySelector('.quiz-feedback-box');
      if (feedbackBox) {
        feedbackBox.textContent = "Nice try! But this button is strictly decorative. Only YES is accepted! 😉💖";
        feedbackBox.classList.remove('hidden');
      }
    });
  }

  // =========================================================================
  // 8. ACT 8: WAX-SEALED ROMANTIC LOVE LETTER
  // =========================================================================
  window.toggleLoveLetter = function () {
    const paper = document.getElementById('letter-paper');
    if (!paper) return;

    paper.classList.toggle('revealed');
    if (paper.classList.contains('revealed')) {
      setTimeout(() => {
        paper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ff85a2', '#ff2a70', '#ffd1dc'],
        });
      }
    }
  };

  // =========================================================================
  // 9. ACT 9: FUTURE BUCKET LIST PROMISE TOASTS
  // =========================================================================
  const checkboxes = document.querySelectorAll('.future-checkbox');
  const promiseToast = document.getElementById('promise-toast');

  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        const promiseText = cb.getAttribute('data-promise');
        if (promiseToast && promiseText) {
          promiseToast.textContent = promiseText;
          promiseToast.classList.remove('hidden');
          promiseToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          if (typeof confetti === 'function') {
            confetti({
              particleCount: 30,
              spread: 50,
              origin: { y: 0.8 },
              colors: ['#ff2a70', '#ffd166'],
            });
          }
        }
      } else {
        // When deselected, update to remaining checked item or hide completely
        const remainingChecked = Array.from(checkboxes).filter((c) => c.checked);
        if (remainingChecked.length > 0) {
          const lastPromise = remainingChecked[remainingChecked.length - 1].getAttribute('data-promise');
          if (promiseToast && lastPromise) {
            promiseToast.textContent = lastPromise;
          }
        } else {
          if (promiseToast) {
            promiseToast.classList.add('hidden');
            promiseToast.textContent = '';
          }
        }
      }
    });
  });

  // =========================================================================
  // 10. ACT 10: FINALE FADE-TO-BLACK TYPEWRITER EXPERIENCE
  // =========================================================================
  const triggerFinaleBtn = document.getElementById('trigger-finale-btn');
  const curtain = document.getElementById('finale-curtain');
  const typewriter = document.getElementById('typewriter-container');
  const finalSurpriseBox = document.getElementById('final-surprise-box');

  const typewriterLines = [
    'So...',
    'I could have bought you flowers.',
    'I could have bought you expensive gifts.',
    'But I wanted to build you a world that lasts forever.',
    'So I present you....',
  ];

  function runTypewriter(callback) {
    if (!typewriter) return;
    typewriter.innerHTML = '';
    typewriter.classList.remove('hidden');
    typewriter.style.opacity = '1';
    typewriter.style.transform = 'none';
    let lineIdx = 0;

    function typeLine() {
      if (lineIdx < typewriterLines.length) {
        const line = typewriterLines[lineIdx];
        const p = document.createElement('p');
        p.className = 'mb-4 transition opacity-0 duration-700';
        typewriter.appendChild(p);

        // Fade line in
        setTimeout(() => p.classList.remove('opacity-0'), 50);

        let charIdx = 0;
        const charInterval = setInterval(() => {
          p.textContent += line.charAt(charIdx);
          charIdx++;
          if (charIdx >= line.length) {
            clearInterval(charInterval);
            lineIdx++;
            setTimeout(typeLine, 750);
          }
        }, 45);
      } else {
        if (callback) callback();
      }
    }

    typeLine();
  }

  if (triggerFinaleBtn && curtain) {
    triggerFinaleBtn.addEventListener('click', () => {
      // 1. Strictly guarantee certificate and actions are hidden before curtain opens
      const certActions = document.getElementById('certificate-actions');
      if (finalSurpriseBox) {
        finalSurpriseBox.classList.add('hidden');
        finalSurpriseBox.style.display = 'none';
        finalSurpriseBox.style.opacity = '0';
      }
      if (certActions) {
        certActions.classList.add('hidden');
        certActions.style.display = 'none';
        certActions.style.opacity = '0';
      }
      if (typewriter) {
        typewriter.classList.remove('hidden');
        typewriter.style.display = 'block';
        typewriter.style.opacity = '1';
        typewriter.style.transform = 'none';
        typewriter.innerHTML = '';
      }

      curtain.classList.add('active');
      curtain.scrollIntoView({ behavior: 'smooth' });

      // 2. Run emotional typewriter sequence (ONLY typewriter lines appear on screen)
      setTimeout(() => {
        runTypewriter(() => {
          setTimeout(() => {
            // 3. Smoothly fade out and remove typewriter lines once all lines finished
            if (typewriter) {
              typewriter.style.transition = 'opacity 700ms ease, transform 700ms ease';
              typewriter.style.opacity = '0';
              typewriter.style.transform = 'translateY(-15px)';
            }

            setTimeout(() => {
              if (typewriter) {
                typewriter.classList.add('hidden');
                typewriter.style.display = 'none';
                typewriter.innerHTML = '';
              }

              // 4. Switch the screen to reveal the Certificate and Action Buttons!
              if (finalSurpriseBox) {
                finalSurpriseBox.classList.remove('hidden');
                finalSurpriseBox.style.display = 'flex';
                finalSurpriseBox.style.opacity = '0';
                finalSurpriseBox.style.transition = 'opacity 800ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)';
                finalSurpriseBox.style.transform = 'scale(0.96) translateY(12px)';
                requestAnimationFrame(() => {
                  finalSurpriseBox.style.opacity = '1';
                  finalSurpriseBox.style.transform = 'scale(1) translateY(0)';
                });
              }

              if (certActions) {
                certActions.classList.remove('hidden');
                certActions.style.display = 'flex';
                certActions.style.opacity = '0';
                certActions.style.transition = 'opacity 600ms ease 300ms';
                requestAnimationFrame(() => {
                  certActions.style.opacity = '1';
                });
              }

              // 5. Grand Sparkles & Twin Sprinklers Celebration!
              launchConfettiAndSprinklers();
            }, 750);
          }, 1200);
        });
      }, 800);
    });
  }

  // Sparkles & Golden Stars Blasting from the Certificate Box
  function blastSparklesAndHearts() {
    const curtain = document.getElementById('finale-curtain');
    if (!curtain) return;

    const sparkles = ['✨', '⭐', '🌟', '💫', '💛', '💖', '👑', '🎉', '🌹'];
    const count = 48;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'finale-sparkle';
      el.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];

      // Centered around the certificate
      const startX = 50 + (Math.random() - 0.5) * 45;
      const startY = 46 + (Math.random() - 0.5) * 35;
      el.style.left = `${startX}%`;
      el.style.top = `${startY}%`;

      const angle = Math.random() * Math.PI * 2;
      const distance = 130 + Math.random() * 260;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const r = (Math.random() - 0.5) * 720;
      const size = 18 + Math.random() * 24;

      el.style.fontSize = `${size}px`;
      el.style.setProperty('--tx', `${tx}px`);
      el.style.setProperty('--ty', `${ty}px`);
      el.style.setProperty('--r', `${r}deg`);
      el.style.animationDelay = `${Math.random() * 0.35}s`;

      curtain.appendChild(el);
      setTimeout(() => el.remove(), 2600);
    }
  }

  // Dual Sprinklers & Fireworks Celebration Cannon
  function launchConfettiAndSprinklers() {
    // 1. Guaranteed DOM Sparkle Cannon (Works regardless of network or canvas support)
    blastSparklesAndHearts();

    // 2. Canvas Confetti Fireworks & Continuous Twin Sprinklers
    if (typeof confetti === 'function') {
      const finaleCanvas = document.getElementById('finale-confetti-canvas');
      let myConfetti = confetti;
      if (finaleCanvas) {
        try {
          myConfetti = confetti.create(finaleCanvas, { resize: true, useWorker: true });
        } catch (e) {
          myConfetti = confetti;
        }
      }

      // Initial Grand Central Fireworks Blast
      myConfetti({
        particleCount: 180,
        spread: 140,
        startVelocity: 55,
        origin: { x: 0.5, y: 0.45 },
        colors: ['#ffd700', '#ff2a70', '#ff69b4', '#ffffff', '#e5c158', '#f59e0b', '#fb7185'],
        zIndex: 99999
      });

      // Second central starburst
      setTimeout(() => {
        myConfetti({
          particleCount: 90,
          spread: 100,
          startVelocity: 45,
          origin: { x: 0.5, y: 0.35 },
          colors: ['#ffd700', '#ffffff', '#fbbf24', '#ff69b4'],
          zIndex: 99999
        });
      }, 350);

      // Continuous Twin Sprinklers shooting from left and right corners for 4.5 seconds!
      const duration = 4500;
      const end = Date.now() + duration;

      (function frame() {
        // Left Corner Sprinkler (Shooting Up-Right)
        myConfetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          startVelocity: 52,
          origin: { x: 0.02, y: 0.88 },
          colors: ['#ffd700', '#ff69b4', '#ff2a70', '#ffffff', '#fbbf24'],
          zIndex: 99999
        });
        // Right Corner Sprinkler (Shooting Up-Left)
        myConfetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          startVelocity: 52,
          origin: { x: 0.98, y: 0.88 },
          colors: ['#ffd700', '#ff69b4', '#ff2a70', '#ffffff', '#fbbf24'],
          zIndex: 99999
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }

  const downloadCertBtn = document.getElementById('download-cert-btn');
  if (downloadCertBtn) {
    downloadCertBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const homePageBtn = document.getElementById('home-page-btn') || document.getElementById('replay-btn');
  const closeTabBtn = document.getElementById('close-tab-btn');

  if (homePageBtn && curtain) {
    homePageBtn.addEventListener('click', () => {
      curtain.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset typewriter and certificate after fade out for clean replay
      setTimeout(() => {
        if (finalSurpriseBox) {
          finalSurpriseBox.classList.add('hidden');
          finalSurpriseBox.style.display = 'none';
        }
        const certActions = document.getElementById('certificate-actions');
        if (certActions) {
          certActions.classList.add('hidden');
          certActions.style.display = 'none';
        }
        if (typewriter) {
          typewriter.classList.remove('hidden');
          typewriter.style.display = 'block';
          typewriter.style.opacity = '1';
          typewriter.style.transform = 'none';
          typewriter.innerHTML = '';
        }
        const fallback = document.getElementById('close-fallback-tip');
        if (fallback) fallback.remove();
      }, 800);
    });
  }

  if (closeTabBtn) {
    closeTabBtn.addEventListener('click', () => {
      // Confetti farewell burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.7 },
          colors: ['#ff2a70', '#ffd700', '#ffffff'],
          zIndex: 99999,
        });
      }

      // Attempt to close window
      window.open('', '_self', '');
      window.close();

      // Graceful fallback if browser security prevents closing the tab
      setTimeout(() => {
        let fallback = document.getElementById('close-fallback-tip');
        if (!fallback) {
          fallback = document.createElement('div');
          fallback.id = 'close-fallback-tip';
          fallback.className = 'w-full text-center mt-3 animate-fade-in';
          fallback.innerHTML = `
            <div class="inline-block px-4 py-2.5 rounded-xl bg-pink-950/80 border border-pink-500/40 text-xs sm:text-sm text-pink-200 shadow-xl leading-relaxed">
              ✨ <em>Your browser prevented this tab from auto-closing.</em><br>
              You can safely close this tab, or tap <strong>Home Page</strong> to relive our memories! 💕
            </div>
          `;
          closeTabBtn.parentElement?.appendChild(fallback);
        }
      }, 400);
    });
  }


  // =========================================================================
  // 12. CLICK PARTICLES: CLICK ANYWHERE TO SPAWN FLOATING HEARTS
  // =========================================================================
  const heartSymbols = ['💖', '💕', '✨', '🌸', '💘', '🤍', '🌹'];
  document.addEventListener('click', (e) => {
    // Ignore clicks on buttons/inputs/interactive tiles to avoid cluttering UI interaction
    if (e.target.closest('button, input, a, .flip-card, .envelope, .puzzle-tile')) return;

    const heart = document.createElement('div');
    heart.className = 'floating-particle-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;

    const dx = (Math.random() - 0.5) * 80;
    const rot = (Math.random() - 0.5) * 60;
    heart.style.setProperty('--dx', `${dx}px`);
    heart.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1400);
  });

});
