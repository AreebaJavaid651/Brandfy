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
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('brandfy-theme-v2', theme);
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

  if (reduceMotion) {
    revealElements.forEach((el) => el.classList.add('visible'));
  } else {
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
  }

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

  const approachRoot = document.querySelector('[data-approach-steps]');
  if (approachRoot && !reduceMotion) {
    const steps = Array.from(approachRoot.querySelectorAll('.about-approach__step'));
    const section = approachRoot.closest('.about-approach');
    let activeIndex = 0;
    let timer = null;
    let scrollLocked = false;
    let cycleDone = false;
    let started = false;
    const INTERVAL = 1600;
    const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar']);

    function setActive(index) {
      activeIndex = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach((step, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        step.classList.toggle('is-active', isActive);
        step.classList.toggle('is-done', isDone);
        step.setAttribute('aria-pressed', String(isActive));
        const bar = step.querySelector('.about-approach__progress i');
        if (!bar) return;
        bar.style.animation = 'none';
        bar.style.width = isDone ? '100%' : '0';
        if (isActive) {
          void bar.offsetWidth;
          bar.style.animation = '';
          bar.style.width = '';
        }
      });
    }

    function blockScroll(e) {
      if (!scrollLocked) return;
      e.preventDefault();
    }

    function blockKeyScroll(e) {
      if (!scrollLocked) return;
      if (scrollKeys.has(e.key)) e.preventDefault();
    }

    function lockScroll() {
      if (scrollLocked) return;
      scrollLocked = true;
      document.documentElement.classList.add('approach-scroll-lock');
      document.body.classList.add('approach-scroll-lock');
      window.addEventListener('wheel', blockScroll, { passive: false });
      window.addEventListener('touchmove', blockScroll, { passive: false });
      window.addEventListener('keydown', blockKeyScroll, { passive: false });
    }

    function unlockScroll() {
      if (!scrollLocked) return;
      scrollLocked = false;
      document.documentElement.classList.remove('approach-scroll-lock');
      document.body.classList.remove('approach-scroll-lock');
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
      window.removeEventListener('keydown', blockKeyScroll);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function finishCycle() {
      cycleDone = true;
      stop();
      unlockScroll();
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i === steps.length - 1);
        step.classList.toggle('is-done', i < steps.length - 1);
        step.setAttribute('aria-pressed', String(i === steps.length - 1));
        const bar = step.querySelector('.about-approach__progress i');
        if (bar) {
          bar.style.animation = 'none';
          bar.style.width = '100%';
        }
      });
      activeIndex = steps.length - 1;
    }

    function play() {
      stop();
      timer = window.setInterval(() => {
        if (activeIndex >= steps.length - 1) {
          finishCycle();
          return;
        }
        setActive(activeIndex + 1);
      }, INTERVAL);
    }

    function startSequence() {
      if (cycleDone || started) return;
      started = true;
      setActive(0);
      lockScroll();
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      play();
    }

    steps.forEach((step, i) => {
      const activate = () => {
        if (scrollLocked || !cycleDone) return;
        setActive(i);
      };
      step.addEventListener('click', activate);
      step.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });

    if (section) {
      const approachObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !cycleDone) {
              startSequence();
            }
          });
        },
        { threshold: 0.45 }
      );
      approachObserver.observe(section);
    }
  } else if (approachRoot && reduceMotion) {
    approachRoot.querySelectorAll('.about-approach__step').forEach((step) => {
      step.classList.add('is-active');
      step.classList.remove('is-done');
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
