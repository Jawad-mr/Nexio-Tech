// ===================== REFINE HERO DOT GRID ANIMATION =====================
// Modern, human-designed interactive dot-grid canvas replacing the AI PCB circuit layout.
// Creates a responsive grid of dots that glow dynamically under the user's cursor.

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, DPR;
  let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
  let isMobile = false;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    isMobile = W < 768;
    if (isMobile) {
      mouse.targetX = W / 2;
      mouse.targetY = H / 2;
    }
  }

  window.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    if (isMobile) return;
    mouse.targetX = -1000;
    mouse.targetY = -1000;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Smooth cursor spotlight tracking
    if (mouse.targetX === -1000) {
      mouse.x += (-1000 - mouse.x) * 0.1;
      mouse.y += (-1000 - mouse.y) * 0.1;
    } else {
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;
    }

    const gridSize = 32;
    const dotRadius = 1;

    for (let x = gridSize / 2; x < W; x += gridSize) {
      for (let y = gridSize / 2; y < H; y += gridSize) {
        let dist = 1000;
        if (mouse.x !== -1000) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

        ctx.beginPath();
        if (dist < 160) {
          const intensity = 1 - dist / 160;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.06 + intensity * 0.35})`;
          ctx.arc(x, y, dotRadius + intensity * 0.6, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }

    // Interactive soft glow spotlight overlay
    if (mouse.x !== -1000) {
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.025)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
