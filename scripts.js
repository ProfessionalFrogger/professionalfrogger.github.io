/* ─────────────────────────────────────────────
   ProfessionalFrogger — scripts.js
   ───────────────────────────────────────────── */

'use strict';

/* ── MOBILE NAV TOGGLE ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is tapped
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── ACTIVE NAV LINK ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ── STICKY HEADER SHADOW ── */
const header = document.querySelector('.site-header');

function updateHeader() {
  if (window.scrollY > 20) {
    header.style.background = 'rgba(16, 7, 32, 0.92)';
    header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.4)';
  } else {
    header.style.background = 'rgba(16, 7, 32, 0.75)';
    header.style.boxShadow = 'none';
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ── SCROLL REVEAL ── */
function initReveal() {
  // Add reveal class to elements we want to animate in
  const revealTargets = [
    '.section-label',
    '.section-title',
    '.about-text',
    '.about-cards',
    '.content-card',
    '.lore-item',
    '.link-pill',
    '.contact-desc',
    '.contact-methods',
    '.contact-btn',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal');
      // Stagger children in the same parent
      el.style.transitionDelay = `${index * 0.06}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── SPARKLE PARALLAX ── */
function initParallax() {
  const sparkles = document.querySelectorAll('.sparkle');
  if (!sparkles.length) return;

  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      sparkles.forEach((el, i) => {
        const depth = (i + 1) * 6;
        el.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
      });
      ticking = false;
    });
    ticking = true;
  });
}

/* ── LINK PILL RIPPLE EFFECT ── */
function initRipples() {
  document.querySelectorAll('.link-pill, .content-card-btn, .btn').forEach(el => {
    el.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: 10px; height: 10px;
        left: ${x - 5}px; top: ${y - 5}px;
        background: rgba(168, 85, 247, 0.35);
        transform: scale(0);
        animation: rippleAnim 0.5s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;

      // Only add ripple if element has position context
      const pos = getComputedStyle(this).position;
      if (pos === 'static') this.style.position = 'relative';
      this.style.overflow = 'hidden';

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject keyframes
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(30); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ── HERO BUNNY EARS WIGGLE ON HOVER ── */
function initBunnyInteraction() {
  const heroBunny = document.querySelector('.hero-bunny');
  if (!heroBunny) return;

  heroBunny.addEventListener('mouseenter', () => {
    heroBunny.style.animationPlayState = 'paused';
    heroBunny.style.transform = 'rotate(-3deg) scale(1.05)';
    heroBunny.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    heroBunny.style.filter = 'drop-shadow(0 20px 50px rgba(168, 85, 247, 0.5))';
  });

  heroBunny.addEventListener('mouseleave', () => {
    heroBunny.style.animationPlayState = 'running';
    heroBunny.style.transform = '';
    heroBunny.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    heroBunny.style.filter = 'drop-shadow(0 20px 40px rgba(168, 85, 247, 0.3))';
  });
}

/* ── PULSING PAW TRAIL (desktop only) ── */
function initPawTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch devices

  const PAW_SVG = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="26" rx="9" ry="8" fill="rgba(168,85,247,0.35)"/>
    <circle cx="12" cy="15" r="4" fill="rgba(168,85,247,0.35)"/>
    <circle cx="20" cy="12" r="4" fill="rgba(168,85,247,0.35)"/>
    <circle cx="28" cy="15" r="4" fill="rgba(168,85,247,0.35)"/>
  </svg>`;

  let lastPaw = 0;
  let pawCount = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastPaw < 350) return; // Throttle
    lastPaw = now;
    pawCount++;

    const paw = document.createElement('div');
    paw.innerHTML = PAW_SVG;
    paw.style.cssText = `
      position: fixed;
      left: ${e.clientX - 20}px;
      top: ${e.clientY - 20}px;
      width: 28px; height: 28px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.55;
      transform: rotate(${pawCount % 2 === 0 ? -15 : 15}deg);
      transition: opacity 0.6s ease, transform 0.6s ease;
      animation: pawFade 0.8s ease forwards;
    `;

    document.body.appendChild(paw);
    setTimeout(() => paw.remove(), 800);
  });

  // Inject keyframes for paw
  if (!document.getElementById('paw-style')) {
    const style = document.createElement('style');
    style.id = 'paw-style';
    style.textContent = `
      @keyframes pawFade {
        0%   { opacity: 0.55; transform: scale(1) rotate(inherit); }
        100% { opacity: 0; transform: scale(0.5) translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ── RANDOM SPARKLE DRIFT ── */
function initRandomSparkles() {
  const heroArt = document.querySelector('.hero-art');
  if (!heroArt) return;

  function spawnSparkle() {
    const el = document.createElement('div');
    const size = Math.random() * 10 + 8;
    const colors = ['var(--pink-light)', 'var(--purple-light)', 'var(--brown-pale)', 'var(--pink-mid)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = Math.random() * 260 - 30;
    const startY = Math.random() * 260 - 10;
    const duration = Math.random() * 1500 + 1200;

    el.innerHTML = `<svg viewBox="0 0 24 24" fill="${color}"><path d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9Z"/></svg>`;
    el.style.cssText = `
      position: absolute;
      left: ${startX}px; top: ${startY}px;
      width: ${size}px; height: ${size}px;
      pointer-events: none;
      z-index: 5;
      animation: sparkleFloat ${duration}ms ease-out forwards;
      opacity: 0;
    `;

    heroArt.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  if (!document.getElementById('sparkle-float-style')) {
    const style = document.createElement('style');
    style.id = 'sparkle-float-style';
    style.textContent = `
      @keyframes sparkleFloat {
        0%   { opacity: 0; transform: translateY(0) rotate(0deg) scale(0.5); }
        20%  { opacity: 1; }
        100% { opacity: 0; transform: translateY(-50px) rotate(180deg) scale(1.2); }
      }
    `;
    document.head.appendChild(style);
  }

  // Spawn sparkles periodically
  setInterval(spawnSparkle, 600);
}

/* ── SMOOTH SCROLL OVERRIDE (for older browsers) ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── INIT ALL ── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initParallax();
  initRipples();
  initBunnyInteraction();
  initPawTrail();
  initRandomSparkles();
  initSmoothScroll();
});