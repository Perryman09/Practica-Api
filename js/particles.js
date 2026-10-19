/**
 * APEX // DRIVE - Animated Particle & Speedlines Canvas
 */
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 40 + 10,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '#00f2fe' : '#ff0055'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.length, p.y);
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.lineWidth = 1;
      ctx.stroke();

      p.x += p.speed;
      if (p.x > width) {
        p.x = -p.length;
        p.y = Math.random() * height;
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
