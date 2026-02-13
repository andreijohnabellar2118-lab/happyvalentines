const envelope = document.getElementById('envelope');
const confettiCanvas = document.getElementById('confettiCanvas');
const titleEl = document.getElementById('title');
const messageEl = document.getElementById('message');
const letterSection = document.getElementById('letterSection');
const letterTitle = document.getElementById('letterTitle');
const letterMessage = document.getElementById('letterMessage');

let isAnimating = false;
const ANIMATION_DURATION = 2000;
let confettiParticles = [];
let confettiAnimId = null;
let typingTimer = null;

function setOpenState(open) {
  if (open) {
    envelope.classList.add('open');
  } else {
    envelope.classList.remove('open');
  }
}

function resetMessage() {
  if (typingTimer) clearInterval(typingTimer);
  titleEl.textContent = 'HAPPY VALENTINES RIERIE KO!!';
  messageEl.textContent = 'You are special to me. Thank you for being part of my life. ♡';
}

function typeText(el, text, speed = 24) {
  el.textContent = '';
  let i = 0;
  return new Promise((resolve) => {
    typingTimer = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(typingTimer);
        typingTimer = null;
        resolve();
      }
    }, speed);
  });
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.8);
  } catch (e) { }
}

function initConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function confettiBurst() {
  if (!confettiCanvas) return;
  const ctx = confettiCanvas.getContext('2d');
  const colors = ['#e91e63', '#ff1744', '#ff69b4', '#d81b60', '#c2185b', '#d4af37'];
  const W = confettiCanvas.width;
  const H = confettiCanvas.height;
  confettiParticles = [];
  const count = 120;
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: W / 2 + (Math.random() - 0.5) * 300,
      y: H / 3 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 7,
      vy: Math.random() * -7 - 3,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      life: 1
    });
  }
  const start = performance.now();
  function render(t) {
    const dt = (t - start) / 1000;
    ctx.clearRect(0, 0, W, H);
    for (const p of confettiParticles) {
      p.vy += 0.24;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - dt / 1.8);
      ctx.save();
      ctx.globalAlpha = p.life * p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();
    }
    if (t - start < 2000) {
      confettiAnimId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }
  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  confettiAnimId = requestAnimationFrame(render);
}

function toggleEnvelope() {
  if (isAnimating) return;
  
  isAnimating = true;
  const isCurrentlyOpen = envelope.classList.contains('open');
  const willOpen = !isCurrentlyOpen;
  
  setOpenState(willOpen);
  
  if (willOpen) {
    playChime();
    setTimeout(() => {
      confettiBurst();
    }, 200);
    
    // Hide envelope after letter appears
    setTimeout(() => {
      envelope.classList.add('hidden');
      letterSection.classList.add('visible');
      letterTitle.textContent = 'HAPPY VALENTINES RIERIE KO!!';
      letterMessage.textContent = 'You are special to me. Thank you for being part of my life. ♡';
    }, 1400);
  } else {
    // Button will be hidden when closing the letter
  }
  
  setTimeout(() => {
    isAnimating = false;
  }, ANIMATION_DURATION);
}

envelope.addEventListener('click', (e) => {
  if (e.target.closest('.letter') || e.target.closest('.content')) return;
  toggleEnvelope();
});

letterSection.addEventListener('click', (e) => {
  if (e.target === letterSection) {
    if (isAnimating) return;
    isAnimating = true;
    
    letterSection.classList.add('closing');
    
    setTimeout(() => {
      letterSection.classList.remove('visible', 'closing');
      envelope.classList.remove('hidden');
      envelope.classList.remove('open');

      isAnimating = false;
    }, 1000);
  }
});

envelope.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleEnvelope();
  }
});

window.addEventListener('resize', () => {
  if (confettiCanvas) initConfetti();
});

window.addEventListener('load', () => {
  initConfetti();
  resetMessage();
  
  // Bouquet button functionality
  const bouquetBtn = document.getElementById('bouquetBtn');
  const bouquetDisplay = document.getElementById('bouquetDisplay');
  const heartImageDisplay = document.getElementById('heartImageDisplay');
  const petalhHearts = document.querySelectorAll('.petal-heart');
  
  if (bouquetBtn) {
    bouquetBtn.addEventListener('click', () => {
      bouquetDisplay.classList.add('visible');
      confettiBurst();
    });
  }
  
  if (bouquetDisplay) {
    bouquetDisplay.addEventListener('click', (e) => {
      if (e.target === bouquetDisplay || e.target === document.getElementById('bouquetOverlay')) {
        bouquetDisplay.classList.remove('visible');
      }
    });
  }
  
  // Petal heart click functionality
  petalhHearts.forEach(heart => {
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      // Show heart image (user will add the image sources in the src attributes)
      heartImageDisplay.classList.add('visible');
      confettiBurst();
    });
  });
  
  if (heartImageDisplay) {
    heartImageDisplay.addEventListener('click', () => {
      heartImageDisplay.classList.remove('visible');
    });
  }
});

// Memories modal JavaScript
(function(){
  const memoriesOpenBtn = document.getElementById('memoriesOpenBtn');
  const saveMemoriesBtn = document.getElementById('saveMemoriesBtn');
  const memoriesModal = document.getElementById('memoriesModal');
  const memoriesInput = document.getElementById('memoriesInput');
  const addMemoriesBtn = document.getElementById('addMemoriesBtn');
  const memoriesGrid = document.getElementById('memoriesGrid');
  const closeMemories = document.getElementById('closeMemories');
  const memoriesCapacity = document.getElementById('memoriesCapacity');
  const MAX_CAPACITY = 20;

  function updateCapacityDisplay() {
    const itemCount = memoriesGrid.querySelectorAll('.memories-item').length;
    if (memoriesCapacity) memoriesCapacity.textContent = `${itemCount}/${MAX_CAPACITY}`;
    if (addMemoriesBtn) addMemoriesBtn.disabled = itemCount >= MAX_CAPACITY;
  }

  // Predefined heart-layout positions (grid column, grid row)
  const heartPositions = [];

  function openMemories() {
    if (memoriesModal) memoriesModal.classList.add('visible');
  }
  function closeMemoriesModal() {
    if (memoriesModal) memoriesModal.classList.remove('visible');
  }

  if (memoriesOpenBtn) memoriesOpenBtn.addEventListener('click', openMemories);
  if (saveMemoriesBtn) saveMemoriesBtn.addEventListener('click', () => {
    const saveMemoriesModal = document.getElementById('saveMemoriesModal');
    if (saveMemoriesModal) saveMemoriesModal.classList.add('visible');
  });
  if (addMemoriesBtn && memoriesInput) addMemoriesBtn.addEventListener('click', () => memoriesInput.click());


  if (memoriesInput && memoriesGrid) {
    memoriesInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      const currentCount = memoriesGrid.querySelectorAll('.memories-item').length;
      let added = 0;
      
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        if (currentCount + added >= MAX_CAPACITY) return;
        
        added++;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const div = document.createElement('div');
          div.className = 'memories-item';

          const imgWrap = document.createElement('div');
          imgWrap.className = 'img-wrap';

          const img = document.createElement('img');
          img.src = ev.target.result;
          img.alt = 'memory';

          img.addEventListener('click', (e) => {
            e.stopPropagation();
            openImageEditDialog(div, img, ev.target.result);
          });

          imgWrap.appendChild(img);

          const caption = document.createElement('div');
          caption.className = 'memories-caption';
          caption.contentEditable = 'true';
          caption.setAttribute('aria-label', 'Image caption');

          div.appendChild(imgWrap);
          div.appendChild(caption);
          memoriesGrid.appendChild(div);
          updateCapacityDisplay();
        };
        reader.readAsDataURL(file);
      });
      memoriesInput.value = '';
    });
  }

  if (memoriesModal) {
    memoriesModal.addEventListener('click', (e) => {
      if (e.target === memoriesModal || e.target.id === 'memoriesOverlay') closeMemoriesModal();
    });
  }
  if (closeMemories) closeMemories.addEventListener('click', closeMemoriesModal);

  const imageEditModal = document.getElementById('imageEditModal');
  const closeEditModal = document.getElementById('closeEditModal');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const replaceImageBtn = document.getElementById('replaceImageBtn');
  const deleteImageBtn = document.getElementById('deleteImageBtn');
  const editDayInput = document.getElementById('editDay');
  const editMonthInput = document.getElementById('editMonth');
  const editYearInput = document.getElementById('editYear');
  const editTimeInput = document.getElementById('editTime');

  let currentEditItem = null;
  let currentEditImg = null;

  function openImageEditDialog(item, img, src) {
    currentEditItem = item;
    currentEditImg = img;
    editDayInput.value = item.dataset.day || '';
    editMonthInput.value = item.dataset.month || '';
    editYearInput.value = item.dataset.year || '';
    editTimeInput.value = item.dataset.time || '';
    imageEditModal.classList.add('visible');
  }

  function closeImageEditDialog() {
    imageEditModal.classList.remove('visible');
    currentEditItem = null;
    currentEditImg = null;
  }

  if (closeEditModal) closeEditModal.addEventListener('click', closeImageEditDialog);

  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', () => {
      if (!currentEditItem) return;
      currentEditItem.dataset.day = editDayInput.value || '';
      currentEditItem.dataset.month = editMonthInput.value || '';
      currentEditItem.dataset.year = editYearInput.value || '';
      currentEditItem.dataset.time = editTimeInput.value || '';
      closeImageEditDialog();
    });
  }

  if (replaceImageBtn) {
    replaceImageBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (currentEditImg) currentEditImg.src = ev.target.result;
            closeImageEditDialog();
          };
          reader.readAsDataURL(file);
        }
      });
      input.click();
    });
  }

  if (deleteImageBtn) {
    deleteImageBtn.addEventListener('click', () => {
      if (currentEditItem) {
        currentEditItem.remove();
        updateCapacityDisplay();
        closeImageEditDialog();
      }
    });
  }

  if (imageEditModal) {
    imageEditModal.addEventListener('click', (e) => {
      if (e.target === imageEditModal) closeImageEditDialog();
    });
  }
})();

// Save Memories modal JavaScript
(function(){
  const saveMemoriesInput = document.getElementById('saveMemoriesInput');
  const addSaveMemoriesBtn = document.getElementById('addSaveMemoriesBtn');
  const saveMemoriesGrid = document.getElementById('saveMemoriesGrid');
  const saveMemoriesModal = document.getElementById('saveMemoriesModal');
  const closeSaveMemories = document.getElementById('closeSaveMemories');
  const imageEditModal = document.getElementById('imageEditModal');
  const editDayInput = document.getElementById('editDay');
  const editMonthInput = document.getElementById('editMonth');
  const editYearInput = document.getElementById('editYear');
  const editTimeInput = document.getElementById('editTime');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const replaceImageBtn = document.getElementById('replaceImageBtn');
  const deleteImageBtn = document.getElementById('deleteImageBtn');
  const closeEditModal = document.getElementById('closeEditModal');

  function closeSaveMemoriesModal() {
    if (saveMemoriesModal) saveMemoriesModal.classList.remove('visible');
  }

  if (addSaveMemoriesBtn && saveMemoriesInput) addSaveMemoriesBtn.addEventListener('click', () => saveMemoriesInput.click());

  let currentEditItem = null;
  let currentEditImg = null;

  function openImageEditDialog(item, img, src) {
    currentEditItem = item;
    currentEditImg = img;
    editDayInput.value = item.dataset.day || '';
    editMonthInput.value = item.dataset.month || '';
    editYearInput.value = item.dataset.year || '';
    editTimeInput.value = item.dataset.time || '';
    imageEditModal.classList.add('visible');
  }

  function closeImageEditDialog() {
    imageEditModal.classList.remove('visible');
    currentEditItem = null;
    currentEditImg = null;
  }

  if (saveMemoriesInput && saveMemoriesGrid) {
    saveMemoriesInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const div = document.createElement('div');
          div.className = 'memories-item';

          const imgWrap = document.createElement('div');
          imgWrap.className = 'img-wrap';

          const img = document.createElement('img');
          img.src = ev.target.result;
          img.alt = 'memory';

          img.addEventListener('click', (e) => {
            e.stopPropagation();
            openImageEditDialog(div, img, ev.target.result);
          });

          imgWrap.appendChild(img);

          const caption = document.createElement('div');
          caption.className = 'memories-caption';
          caption.contentEditable = 'true';
          caption.setAttribute('aria-label', 'Image caption');

          div.appendChild(imgWrap);
          div.appendChild(caption);
          saveMemoriesGrid.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
      saveMemoriesInput.value = '';
    });
  }

  if (saveMemoriesModal) {
    saveMemoriesModal.addEventListener('click', (e) => {
      if (e.target === saveMemoriesModal || e.target.id === 'saveMemoriesOverlay') closeSaveMemoriesModal();
    });
  }
  if (closeSaveMemories) closeSaveMemories.addEventListener('click', closeSaveMemoriesModal);

  if (closeEditModal && !closeEditModal.dataset.saveMemoriesAttached) {
    closeEditModal.dataset.saveMemoriesAttached = 'true';
    const originalClick = closeEditModal.onclick;
    closeEditModal.addEventListener('click', closeImageEditDialog);
  }

  if (saveEditBtn && !saveEditBtn.dataset.saveMemoriesAttached) {
    saveEditBtn.dataset.saveMemoriesAttached = 'true';
    saveEditBtn.addEventListener('click', () => {
      if (!currentEditItem) return;
      currentEditItem.dataset.day = editDayInput.value || '';
      currentEditItem.dataset.month = editMonthInput.value || '';
      currentEditItem.dataset.year = editYearInput.value || '';
      currentEditItem.dataset.time = editTimeInput.value || '';
      closeImageEditDialog();
    });
  }

  if (replaceImageBtn && !replaceImageBtn.dataset.saveMemoriesAttached) {
    replaceImageBtn.dataset.saveMemoriesAttached = 'true';
    replaceImageBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (currentEditImg) currentEditImg.src = ev.target.result;
            closeImageEditDialog();
          };
          reader.readAsDataURL(file);
        }
      });
      input.click();
    });
  }

  if (deleteImageBtn && !deleteImageBtn.dataset.saveMemoriesAttached) {
    deleteImageBtn.dataset.saveMemoriesAttached = 'true';
    deleteImageBtn.addEventListener('click', () => {
      if (currentEditItem) {
        currentEditItem.remove();
        closeImageEditDialog();
      }
    });
  }
})();
