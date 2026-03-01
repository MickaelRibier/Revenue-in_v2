document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Navigation Toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const navOverlay = document.getElementById('navOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = () => {
    mobileNav.classList.toggle('open');
    navOverlay.classList.toggle('open');
    // Change icon between burger and close
    if (mobileNav.classList.contains('open')) {
      menuBtn.innerHTML = '&times;'; // close icon
    } else {
      menuBtn.innerHTML = '&#9776;'; // burger icon
    }
  };

  menuBtn.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // 2. Intersection Observer for Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  revealElements.forEach(el => observer.observe(el));

  // 3. Optional: Dynamic active link highlighting on scroll
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-accent');
      if (link.getAttribute('href').includes(current)) {
        // Basic highlight style
        link.style.color = 'var(--color-accent)';
      } else {
        link.style.color = 'var(--color-text-light)';
      }
    });
  });
  // 4. AJAX Contact Form Submission
  const contactForm = document.getElementById('mainContactForm');
  const contactModal = document.getElementById('contactModal');

  if (contactForm && contactModal) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const formData = new FormData(contactForm);
        const body = Object.fromEntries(formData.entries());

        const res = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          contactForm.reset();
          contactModal.style.display = 'flex';
        } else {
          alert('Something went wrong. Please try again.');
        }
      } catch (err) {
        console.error(err);
        alert('Network error. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    // Close modal when clicking outside the card
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.style.display = 'none';
      }
    });
  }

  // 5. Testimonials Slider
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (track) {
    const slides = track.querySelectorAll('.slide');
    let current = 0;
    let autoplayTimer;

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    };

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
      dotsContainer.appendChild(dot);
    });

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(current + 1), 5000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

    // Hide arrows if only 1 slide
    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }

    if (slides.length > 1) resetAutoplay();
  }
});
