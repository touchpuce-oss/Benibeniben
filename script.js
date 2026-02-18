/**
 * ONEG PIZZA - Interactive Functionality
 * Mobile-first, accessible, performance-optimized
 */

(function() {
  'use strict';

  // ========================================
  // Language Toggle
  // ========================================
  const langToggle = document.getElementById('langToggle');
  let currentLang = 'fr';

  if (langToggle) {
    langToggle.addEventListener('click', function() {
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      updateLanguage();
    });
  }

  function updateLanguage() {
    const elements = document.querySelectorAll('[data-fr][data-en]');
    elements.forEach(el => {
      el.textContent = el.getAttribute('data-' + currentLang);
    });

    // Update lang switch UI
    const currentSpan = langToggle.querySelector('.lang-current');
    const altSpan = langToggle.querySelector('.lang-alt');
    if (currentSpan && altSpan) {
      currentSpan.textContent = currentLang.toUpperCase();
      altSpan.textContent = (currentLang === 'fr' ? 'en' : 'fr').toUpperCase();
    }

    // Update html lang attribute
    document.documentElement.lang = currentLang;
  }

  // ========================================
  // Navigation
  // ========================================
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Sticky nav background on scroll
  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================
  // Smooth Scroll & Active Section
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  // Smooth scroll for anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const navHeight = nav.offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active section highlighting
  function highlightActiveSection() {
    const scrollPos = window.scrollY + nav.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });

  // ========================================
  // Quote Form - WhatsApp Integration
  // ========================================
  const quoteForm = document.getElementById('quoteForm');

  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(quoteForm);
      const data = Object.fromEntries(formData);

      // Build WhatsApp message
      const message = buildWhatsAppMessage(data);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/33784760145?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
    });
  }

  function buildWhatsAppMessage(data) {
    const lang = currentLang;
    
    if (lang === 'fr') {
      return `Bonjour ONEG PIZZA,

Je souhaite recevoir un devis pour un événement.

📅 Date : ${data.date || 'À définir'}
📍 Ville/Lieu : ${data.city || 'À préciser'}
👥 Nombre d'invités : ${data.guests || 'À préciser'}
🎉 Type d'événement : ${data.type || 'À préciser'}
🏡 Espace extérieur : ${data.outdoor || 'À préciser'}
🏢 Type de lieu : ${data.venue || 'À préciser'}

📝 Notes : ${data.notes || 'Aucune'}

Merci et à bientôt !`;
    } else {
      return `Hello ONEG PIZZA,

I would like to request a quote for an event.

📅 Date: ${data.date || 'To be determined'}
📍 City/Location: ${data.city || 'To be specified'}
👥 Number of guests: ${data.guests || 'To be specified'}
🎉 Event type: ${data.type || 'To be specified'}
🏡 Outdoor space: ${data.outdoor || 'To be determined'}
🏢 Venue type: ${data.venue || 'To be specified'}

📝 Notes: ${data.notes || 'None'}

Thank you and see you soon!`;
    }
  }

  // ========================================
  // Testimonials Slider
  // ========================================
  const slider = document.getElementById('testimonialsSlider');
  
  if (slider) {
    const track = slider.querySelector('.testimonials-track');
    const slides = slider.querySelectorAll('.testimonial');
    const prevBtn = slider.querySelector('.testimonial-prev');
    const nextBtn = slider.querySelector('.testimonial-next');
    const dotsContainer = slider.querySelector('.testimonials-dots');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayInterval;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      dot.setAttribute('aria-label', `Témoignage ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function updateSlider() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    function goToSlide(index) {
      currentSlide = index;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      if (currentSlide >= totalSlides) currentSlide = 0;
      updateSlider();
      resetAutoplay();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Initialize
    updateSlider();
    startAutoplay();

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    slider.addEventListener('mouseleave', startAutoplay);
  }

  // ========================================
  // Gallery Lightbox
  // ========================================
  const lightbox = document.getElementById('lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    const galleryImages = Array.from(galleryItems).map(item => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt
    }));

    function openLightbox(index) {
      currentImageIndex = index;
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightboxImage() {
      const image = galleryImages[currentImageIndex];
      lightboxImg.src = image.src;
      lightboxImg.alt = image.alt;
    }

    function nextImage() {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      updateLightboxImage();
    }

    function prevImage() {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    }

    // Event listeners
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
      }
    });
  }

  // ========================================
  // FAQ Accordion
  // ========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ========================================
  // Scroll Reveal Animation
  // ========================================
  const revealElements = document.querySelectorAll('.pillar, .experience-card, .package, .menu-category, .gallery-item, .faq-item');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });

  // Add revealed styles
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // Mobile Sticky CTA Hide/Show on Scroll
  // ========================================
  const mobileStickyCta = document.getElementById('mobileStickyCta');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function handleMobileCtaScroll() {
    if (!mobileStickyCta) return;

    const currentScrollY = window.scrollY;
    
    // Hide when scrolling down, show when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      mobileStickyCta.style.transform = 'translateY(100%)';
    } else {
      mobileStickyCta.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(handleMobileCtaScroll);
      ticking = true;
    }
  }, { passive: true });

  // Add transition for smooth hide/show
  if (mobileStickyCta) {
    mobileStickyCta.style.transition = 'transform 0.3s ease';
  }

  // ========================================
  // Form Input Date Min (Today)
  // ========================================
  const dateInput = document.getElementById('eventDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ========================================
  // Performance: Lazy Load Images
  // ========================================
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ========================================
  // Console Welcome Message
  // ========================================
  console.log('%c ONEG PIZZA ', 'background: #C45C3E; color: #F5F0E8; font-size: 20px; font-weight: bold; padding: 10px 20px;');
  console.log('%c L\'Art du Feu. L\'Âme de Naples. ', 'color: #C45C3E; font-size: 14px; font-style: italic;');

})();
