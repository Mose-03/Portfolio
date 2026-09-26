/* ============================================================
   script.js — Developer Portfolio
   Handles: cursor, canvas, scroll effects, counters, skill bars,
            tilt cards, contact form, nav, mobile menu, reveals
============================================================ */




/* ─── HERO CANVAS — Particle field ─── */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);



const PARTICLE_COUNT = 70;
const particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.2 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232,98,26,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

const MAX_DIST = 100;
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(232,98,26,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

// Mouse interaction with particles
let heroMouseX = canvas.width / 2, heroMouseY = canvas.height / 2;
document.getElementById('hero').addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  heroMouseX = e.clientX - rect.left;
  heroMouseY = e.clientY - rect.top;
});

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  

   
  // Subtle radial gradient glow at mouse position
  const grad = ctx.createRadialGradient(heroMouseX, heroMouseY, 0, heroMouseX, heroMouseY, 300);
  grad.addColorStop(0, 'rgba(232,98,26,0.04)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  connectParticles();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();


/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});


/* ─── MOBILE MENU ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ─── INTERSECTION OBSERVER — REVEALS ─── */
function initRevealObserver () {
const revealEls = document.querySelectorAll('.reveal, .reveal-up');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));
}
window.addEventListener('load', initRevealObserver);


/* ─── COUNTER ANIMATION ─── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  (function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  })(start);
}

const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));


/* ─── SKILL BAR ANIMATION ─── */
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.w + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
bars.forEach(b => barObserver.observe(b));


/* ─── TILT CARDS ─── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-6px)`;
    card.style.boxShadow = `${-dx * 20}px ${-dy * 20}px 60px rgba(0,0,0,.4)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
    card.style.transition = 'transform .5s ease, box-shadow .5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});


/* ─── PROJECT CARD IMAGE PARALLAX ─── */
document.querySelectorAll('.project-img').forEach(img => {
  img.addEventListener('mousemove', e => {
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const gfx = img.querySelector('.project-gfx');
    if (gfx) {
      gfx.style.transform = `translate(${(x - .5) * 18}px, ${(y - .5) * 18}px)`;
    }
  });
  img.addEventListener('mouseleave', () => {
    const gfx = img.querySelector('.project-gfx');
    if (gfx) {
      gfx.style.transform = '';
      gfx.style.transition = 'transform .5s ease';
      setTimeout(() => { gfx.style.transition = ''; }, 500);
    }
  });
});


/* ─── CONTACT FORM ─── */
/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const message = form.querySelector('#message').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !email || !message) {
    shakeForm();
    return;
  }

  const submitBtn = form.querySelector('.btn-submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnIcon = submitBtn.querySelector('.btn-icon');

  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  btnIcon.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

  fetch('https://formspree.io/f/mppwyavl', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(form),
  })
    .then(response => {
      if (response.ok) {
        btnText.textContent = 'Sent!';
        btnIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
        submitBtn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        successMsg.classList.add('show');
        form.reset();
      } else {
        throw new Error('Formspree responded with an error');
      }
    })
    .catch(() => {
      btnText.textContent = 'Failed — try again';
      btnIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
      submitBtn.style.background = 'linear-gradient(135deg,#dc2626,#991b1b)';
    })
    .finally(() => {
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        submitBtn.style.background = '';
        successMsg.classList.remove('show');
      }, 4000);
    });
});

function shakeForm() {
  form.style.animation = 'shake .4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);
}

// Inject shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-6px)}
    80%{transform:translateX(6px)}
  }
`;
document.head.appendChild(shakeStyle);


/* ─── SMOOTH ACTIVE NAV LINK HIGHLIGHT ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active-link');
    }
  });
}, { passive: true });


/* ─── PAGE LOAD STAGGER ─── */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Stagger hero badge and content
  const heroEls = document.querySelectorAll('.hero-badge, .hero-sub, .hero-actions');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 600 + i * 180);
  });

  // Stats reveal
  document.querySelectorAll('.stat').forEach((s, i) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(20px)';
    setTimeout(() => {
      s.style.transition = 'opacity .6s ease, transform .6s ease';
      s.style.opacity = '1';
      s.style.transform = 'translateY(0)';
    }, 900 + i * 150);
  });
});
