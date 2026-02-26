    // navigation
    function showPage(id) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      const el = document.getElementById('nav-' + id);
      if (el) el.classList.add('active');
      window.scrollTo(0, 0);
      setTimeout(initReveal, 80);
    }

    // scroll reveal
    function initReveal() {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.08 });
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    }
    initReveal();

    // particle canvas
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function mkParticle() {
      return { x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 
        0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.5 + 0.4, a: Math.random() * 0.5 + 0.1 };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < 90; i++) particles.push(mkParticle());
    }

    let animId;
    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      // radial glow
      const g = ctx.createRadialGradient(W * 0.6, H * 0.42, 0, W * 0.6, H * 0.42, W * 0.65);
      g.addColorStop(0, 'rgba(0,80,160,0.09)');
      g.addColorStop(1, 'rgba(2,4,8,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.a})`; ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,144,255,${0.07 * (1 - d / 130)})`; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(drawParticles);
    }

    resize(); initParticles(); drawParticles();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    // nav scroll effect
    window.addEventListener('scroll', () => {
      document.getElementById('main-nav').style.background = window.scrollY > 40 ? 'rgba(2,4,8,0.98)' : 'rgba(2,4,8,0.88)';
    });

    // form
    function submitForm(e) {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Sent Successfully!';
      btn.style.background = '#00ffb3';
      e.target.reset();
      setTimeout(() => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        btn.style.background = '';
      }, 4000);
    }