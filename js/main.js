// ============================================================
//   SATVAT - Premium JavaScript v3.0
//   Animations, Interactions & Effects
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ==================== PARTICLE CANVAS ====================
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.55;';
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    const heroBg = heroEl.querySelector('.hero-bg');
    if (heroBg) heroBg.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animFrameId;

    function resizeCanvas() {
      W = canvas.width  = heroEl.offsetWidth;
      H = canvas.height = heroEl.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.8 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.color = Math.random() > 0.5 ? '29,142,196' : '224,90,30';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.floor((W * H) / 14000);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(29,142,196,${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      animFrameId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 200);
    });
  }

  // ==================== HEADER SCROLL ====================
  const header = document.getElementById('header');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    // Hide header on fast downscroll, show on upscroll
    if (sy > 300) {
      if (sy > lastScrollY + 8) {
        header.style.transform = 'translateY(-100%)';
      } else if (lastScrollY > sy + 2) {
        header.style.transform = 'translateY(0)';
      }
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScrollY = sy;
  }, { passive: true });

  // ==================== MOBILE MENU ====================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==================== RIPPLE EFFECT ON BUTTONS ====================
  document.querySelectorAll('.btn, .form-submit, .product-tab').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left - 5) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - 5) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // ==================== MAGNETIC BUTTON EFFECT ====================
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
      btn.style.transform = `translateY(-3px) translate(${x}px, ${y}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ==================== COUNTER ANIMATION ====================
  function animateCounter(el) {
    const target   = parseFloat(el.getAttribute('data-target'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 2200;
    const start    = performance.now();
    el.style.transform = 'scale(1)';

    function update(time) {
      const elapsed  = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quartic
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = eased * target;

      if (target % 1 !== 0) {
        el.textContent = value.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(value).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
        // Pop effect at end
        el.style.transform = 'scale(1.08)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
      }
    }
    requestAnimationFrame(update);
  }

  // ==================== SCROLL ANIMATIONS ====================
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        if (entry.target.classList.contains('stat-number')) {
          setTimeout(() => animateCounter(entry.target), 200);
        }
        animObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .stat-number').forEach(el => {
    animObserver.observe(el);
  });

  // Staggered children animation
  document.querySelectorAll('.solutions-grid, .testimonials-grid, .products-grid, .steps-grid').forEach(grid => {
    const children = grid.querySelectorAll(':scope > *');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // ==================== TILT EFFECT ON CARDS ====================
  document.querySelectorAll('.solution-card, .testimonial-card, .product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const rotX  = (y - cy) / cy * -6;
      const rotY  = (x - cx) / cx *  6;
      card.style.transform   = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.01)`;
      card.style.transition  = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease, border-color 0.4s ease';
    });
  });

  // ==================== PRODUCTS TABS ====================
  const tabs = document.querySelectorAll('.product-tab');
  const panels = document.querySelectorAll('.products-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => {
        p.classList.add('hidden');
        p.style.opacity = '0';
        p.style.transform = 'translateY(16px)';
      });
      tab.classList.add('active');
      const target = document.getElementById(`panel-${tab.dataset.tab}`);
      if (target) {
        target.classList.remove('hidden');
        target.style.opacity = '0';
        target.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => {
          target.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
          // Re-trigger card animations
          target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
            el.classList.remove('animated');
            el.style.transitionDelay = `${i * 0.1}s`;
            setTimeout(() => el.classList.add('animated'), 50);
          });
        });
      }
    });
  });

  // ==================== BACK TO TOP ====================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 450);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== SMOOTH ANCHOR LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==================== TYPING EFFECT IN HERO ====================
  const gradientText = document.querySelector('.hero-title .gradient-text');
  if (gradientText) {
    const words = ['Better Outcomes.', 'Smarter Decisions.', 'Deeper Learning.', 'Faster Growth.'];
    let wordIdx = 0, charIdx = 0, deleting = false;
    const originalWord = words[0];

    function type() {
      const current = words[wordIdx];
      if (!deleting) {
        charIdx++;
        gradientText.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 2200);
          return;
        }
      } else {
        charIdx--;
        gradientText.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 55 : 80);
    }
    setTimeout(type, 2500);
  }

  // ==================== CONTACT FORM ====================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('.form-submit');
      const orig = btn.innerHTML;
      btn.innerHTML = '&#10003; Sent! We\'ll be in touch within 24 hours.';
      btn.style.background = 'linear-gradient(135deg, #0A2463, #1B4FD8)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 4000);
    });
  }

  // ==================== NEWSLETTER FORM ====================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button');
      const input = this.querySelector('input');
      btn.textContent = '&#10003; Done!';
      input.value = '';
      setTimeout(() => { btn.textContent = 'Subscribe'; }, 3000);
    });
  }

  // ==================== ACTIVE NAV HIGHLIGHT ====================
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 130) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
  }, { passive: true });

  // ==================== STATS SECTION GLOW ON HOVER ====================
  document.querySelectorAll('.stat-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.background = 'rgba(0,216,255,0.08)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = '';
    });
  });

  // ==================== CURSOR GLOW (DESKTOP) ====================
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed;width:300px;height:300px;
      border-radius:50%;pointer-events:none;z-index:0;
      background:radial-gradient(circle,rgba(0,216,255,0.06) 0%,transparent 70%);
      transform:translate(-50%,-50%);
      transition:left 0.15s ease,top 0.15s ease;
      will-change:left,top;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  // ==================== SECTION REVEAL WITH COUNTER ====================
  // Make stat-number elements visible before observer triggers
  document.querySelectorAll('.stat-number').forEach(el => {
    el.textContent = '0';
  });

});
