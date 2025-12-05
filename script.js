// While You Were Sleeping — interaction + starry sky

// Star field using Canvas with gentle parallax and twinkle
(function initStars() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;
  let stars = [];
  const STAR_COUNT = 200; // keep light for performance

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.4, 1.4),
      a: rand(0.4, 0.9), // alpha base
      tw: rand(0.5, 1.5), // twinkle speed
      off: rand(0, Math.PI * 2), // phase offset
    }));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // soft sky noise
    const grad = ctx.createRadialGradient(width*0.7, height*0.2, 0, width*0.7, height*0.2, Math.max(width, height));
    grad.addColorStop(0, 'rgba(177,140,255,0.05)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // stars
    ctx.save();
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(255, 200, 255, 0.35)';

    for (const s of stars) {
      const twinkle = s.a + Math.sin(t * s.tw + s.off) * 0.25; // 0.15-0.35 swing
      ctx.globalAlpha = Math.max(0.1, Math.min(1, twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
    ctx.restore();

    t += 0.01;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// Reveal message toggle
(function messageToggle() {
  const btn = document.getElementById('revealBtn');
  const panel = document.getElementById('message');
  if (!btn || !panel) return;

  function toggle() {
    const show = panel.hasAttribute('hidden');
    if (show) {
      panel.removeAttribute('hidden');
      requestAnimationFrame(() => panel.classList.add('show'));
    } else {
      panel.classList.remove('show');
      // wait for transition then hide for a11y
      setTimeout(() => panel.setAttribute('hidden', ''), 320);
    }
    btn.setAttribute('aria-expanded', String(show));
    btn.textContent = show ? 'Hide message' : 'Tap for a message';
  }

  btn.addEventListener('click', toggle);
})();

// Subtle entrance parallax on scroll for depth
(function parallaxScroll(){
  let ticking = false;
  const maxShift = 10; // px
  const sky = document.getElementById('sky');
  if (!sky) return;

  function onScroll(){
    if (!ticking){
      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const shift = Math.max(-maxShift, Math.min(maxShift, y * 0.05));
        sky.style.transform = `translateY(${shift}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
