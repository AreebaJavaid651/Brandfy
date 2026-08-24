document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-ready');

  const heroWords = document.querySelectorAll('.hero__title-word');
  heroWords.forEach((word) => {
    word.addEventListener('animationend', () => {
      word.style.willChange = 'auto';
    }, { once: true });
  });

  const particlesHost = document.getElementById('heroParticles');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (particlesHost && !reduceMotion) {
    const count = window.innerWidth < 768 ? 18 : 36;
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'hero__particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = `${Math.random() * 20}%`;
      particle.style.animationDuration = `${6 + Math.random() * 10}s`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.width = particle.style.height = `${2 + Math.random() * 3}px`;
      particlesHost.appendChild(particle);
    }
  }

  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contactForm');
  const themeToggle = document.getElementById('themeToggle');

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('brandfy-theme', theme);
    } catch (e) {}
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
      );
    }
  }

  applyTheme(currentTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
    });
  }

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (hamburger && nav) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'nav');

    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();
      const whatsappMessage = encodeURIComponent(
        `*New Inquiry from Website*\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || 'Not provided'}\n` +
        `Service: ${service}\n\n` +
        `Message:\n${message}`
      );
      window.open(`https://wa.me/923008653044?text=${whatsappMessage}`, '_blank');
      contactForm.reset();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
