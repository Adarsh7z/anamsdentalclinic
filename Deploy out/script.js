/**
 * Dr. Chandra Sekar Anam, MDS - Premium Dental Clinic Logic & Mobile Performance Optimizations
 */

document.addEventListener('DOMContentLoaded', () => {
  /* Check if device is Apple/Android Mobile or Touch Device */
  const isTouchOrMobile = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          window.matchMedia('(pointer: coarse)').matches || 
                          window.innerWidth <= 768;

  /* 0. Subtle Card Hover Micro-Interactions on Desktop (Non-Touch) devices */
  if (!isTouchOrMobile) {
    const tiltCards = document.querySelectorAll('.spec-card, .reason-item, .doctor-frame');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -1.5;
        const rotateY = ((x - centerX) / centerX) * 1.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* 1. Optimized Sticky Navbar & Mobile Menu */
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* 2. Rebuilt Mobile / Tablet Burger Menu & Nested Accordion (Pure CSS Engine & Sync) */
  function initMobileMenu() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Detect path depth for relative links (root vs subpages)
    const isSubDir = window.location.pathname.includes('/specialisations/') || 
                     window.location.pathname.includes('/locations/');
    const prefix = isSubDir ? '../' : '';

    // Replace old #menuToggle with animated checkbox hamburger
    const oldToggle = document.getElementById('menuToggle');
    let toggleLabel = document.querySelector('.hamburger');
    
    if (oldToggle && !toggleLabel) {
      toggleLabel = document.createElement('label');
      toggleLabel.className = 'hamburger';
      toggleLabel.setAttribute('aria-label', 'Toggle Navigation Menu');
      toggleLabel.innerHTML = `
        <input class="checkbox" type="checkbox" id="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
        <svg fill="none" viewBox="0 0 50 50" height="50" width="50" aria-hidden="true" focusable="false">
          <path class="lineTop line" stroke-linecap="round" stroke-width="4" d="M6 11L44 11"></path>
          <path class="lineMid line" stroke-linecap="round" stroke-width="4" d="M6 24H43"></path>
          <path class="lineBottom line" stroke-linecap="round" stroke-width="4" d="M6 37H43"></path>
        </svg>
      `;
      oldToggle.parentNode.replaceChild(toggleLabel, oldToggle);
    }

    const toggle = document.getElementById('menu-toggle');
    if (!toggle) return;

    // Create or locate the mobile menu container directly beneath navbar
    let menu = document.getElementById('mobile-menu');
    if (!menu) {
      menu = document.createElement('nav');
      menu.className = 'mobile-menu';
      menu.id = 'mobile-menu';
      menu.setAttribute('aria-label', 'Mobile Navigation');
      menu.innerHTML = `
        <ul class="nav-list">
          <!-- 1. About Dr. Anam (Level 1 -> Level 2) -->
          <li class="acc-item">
            <button class="pill" type="button" id="t-about" aria-expanded="false" aria-controls="p-about" data-acc-trigger>
              <span>About Dr. Anam</span>
              <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="acc-panel" id="p-about" role="region" aria-labelledby="t-about">
              <div class="acc-clip">
                <div class="acc-body card">
                  <a class="row row--overview stagger" href="${prefix}about.html">About Dr. Anam</a>
                  <a class="row stagger" href="${prefix}about.html#about">Academic &amp; Clinical Leadership</a>
                  <a class="row stagger" href="${prefix}about.html#why">Evidence-Based Care &amp; Longevity</a>
                  <a class="row stagger" href="${prefix}about.html#experience">Sterile Suite &amp; Technology</a>
                  <a class="row stagger" href="${prefix}about.html#philosophy">Patient Philosophy &amp; Pillars</a>
                </div>
              </div>
            </div>
          </li>

          <!-- 2. Specialisations (Level 1 -> Level 2 -> Level 3 Nested) -->
          <li class="acc-item">
            <button class="pill" type="button" id="t-specs" aria-expanded="false" aria-controls="p-specs" data-acc-trigger>
              <span>Specialisations</span>
              <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="acc-panel" id="p-specs" role="region" aria-labelledby="t-specs">
              <div class="acc-clip">
                <div class="acc-body card">
                  <a class="row row--overview stagger" href="${prefix}specialisations.html">All Specialisations</a>

                  <!-- Category 1: Dental Implants -->
                  <div class="acc-item acc-item--nested stagger">
                    <button class="row" type="button" id="t-implants" aria-expanded="false" aria-controls="p-implants" data-acc-trigger>
                      <span>Dental Implants</span>
                      <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div class="acc-panel" id="p-implants" role="region" aria-labelledby="t-implants">
                      <div class="acc-clip">
                        <div class="acc-body sublist">
                          <a class="row row--overview stagger" href="${prefix}specialisations/dental-implants.html">Dental Implants Overview</a>
                          <a class="row stagger" href="${prefix}specialisations/dental-implants.html#single-tooth">Single Tooth Implants</a>
                          <a class="row stagger" href="${prefix}specialisations/dental-implants.html#all-on-4">All-on-4 &amp; All-on-6 Implants</a>
                          <a class="row stagger" href="${prefix}specialisations/dental-implants.html#implant-prostheses">Custom Implant Prostheses</a>
                          <a class="row stagger" href="${prefix}specialisations/dental-implants.html#cbct-planning">3D CBCT Surgical Planning</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Category 2: Prosthodontics -->
                  <div class="acc-item acc-item--nested stagger">
                    <button class="row" type="button" id="t-prostho" aria-expanded="false" aria-controls="p-prostho" data-acc-trigger>
                      <span>Prosthodontics</span>
                      <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div class="acc-panel" id="p-prostho" role="region" aria-labelledby="t-prostho">
                      <div class="acc-clip">
                        <div class="acc-body sublist">
                          <a class="row row--overview stagger" href="${prefix}specialisations/prosthodontics.html">Prosthodontics Overview</a>
                          <a class="row stagger" href="${prefix}specialisations/prosthodontics.html#crowns-bridges">Custom Crowns &amp; Bridges</a>
                          <a class="row stagger" href="${prefix}specialisations/prosthodontics.html#dentures">Complete &amp; Partial Dentures</a>
                          <a class="row stagger" href="${prefix}specialisations/prosthodontics.html#rehabilitation">Full Smile Rejuvenation</a>
                          <a class="row stagger" href="${prefix}specialisations/prosthodontics.html#overdentures">Overdentures &amp; Attachments</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Category 3: Advanced Restorative -->
                  <div class="acc-item acc-item--nested stagger">
                    <button class="row" type="button" id="t-restorative" aria-expanded="false" aria-controls="p-restorative" data-acc-trigger>
                      <span>Advanced Restorative</span>
                      <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div class="acc-panel" id="p-restorative" role="region" aria-labelledby="t-restorative">
                      <div class="acc-clip">
                        <div class="acc-body sublist">
                          <a class="row row--overview stagger" href="${prefix}specialisations/advanced-restorative-dentistry.html">Advanced Restorative Overview</a>
                          <a class="row stagger" href="${prefix}specialisations/advanced-restorative-dentistry.html#wear-erosion">Tooth Wear &amp; Acid Erosion</a>
                          <a class="row stagger" href="${prefix}specialisations/advanced-restorative-dentistry.html#bite-correction">Complex Bite Correction</a>
                          <a class="row stagger" href="${prefix}specialisations/advanced-restorative-dentistry.html#tmj-harmony">TMJ Harmony &amp; Equilibration</a>
                          <a class="row stagger" href="${prefix}specialisations/advanced-restorative-dentistry.html#biomimetic-bonding">Biomimetic Enamel Preservation</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Category 4: Precision Crowns & Bridges -->
                  <div class="acc-item acc-item--nested stagger">
                    <button class="row" type="button" id="t-crowns" aria-expanded="false" aria-controls="p-crowns" data-acc-trigger>
                      <span>Crowns &amp; Bridges</span>
                      <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div class="acc-panel" id="p-crowns" role="region" aria-labelledby="t-crowns">
                      <div class="acc-clip">
                        <div class="acc-body sublist">
                          <a class="row row--overview stagger" href="${prefix}specialisations/crowns-and-bridges.html">Crowns &amp; Bridges Overview</a>
                          <a class="row stagger" href="${prefix}specialisations/crowns-and-bridges.html#zirconia-emax">Monolithic Zirconia &amp; E-max</a>
                          <a class="row stagger" href="${prefix}specialisations/crowns-and-bridges.html#precision-margins">Precision Microscopic Margins</a>
                          <a class="row stagger" href="${prefix}specialisations/crowns-and-bridges.html#fixed-bridges">Fixed Bridgework Solutions</a>
                          <a class="row stagger" href="${prefix}specialisations/crowns-and-bridges.html#shade-matching">Natural Aesthetic Shade Matching</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Category 5: Full Mouth Rehabilitation -->
                  <div class="acc-item acc-item--nested stagger">
                    <button class="row" type="button" id="t-fullmouth" aria-expanded="false" aria-controls="p-fullmouth" data-acc-trigger>
                      <span>Full Mouth Rehabilitation</span>
                      <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div class="acc-panel" id="p-fullmouth" role="region" aria-labelledby="t-fullmouth">
                      <div class="acc-clip">
                        <div class="acc-body sublist">
                          <a class="row row--overview stagger" href="${prefix}specialisations/full-mouth-rehabilitation.html">Full Mouth Rehab Overview</a>
                          <a class="row stagger" href="${prefix}specialisations/full-mouth-rehabilitation.html#full-arch">Full Arch Reconstruction</a>
                          <a class="row stagger" href="${prefix}specialisations/full-mouth-rehabilitation.html#collapsed-bite">Collapsed Bite Elevation</a>
                          <a class="row stagger" href="${prefix}specialisations/full-mouth-rehabilitation.html#multidisciplinary">Multi-Stage Coordinated Care</a>
                          <a class="row stagger" href="${prefix}specialisations/full-mouth-rehabilitation.html#occlusal-stability">Long-Term Occlusal Stability</a>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </li>

          <!-- 3. Locate Clinic (Plain link with NO chevron) -->
          <li>
            <a class="pill" href="${prefix}index.html#contact">Locate Clinic</a>
          </li>
        </ul>
      `;
      navbar.parentNode.insertBefore(menu, navbar.nextSibling);
    }

    const desktop = window.matchMedia('(min-width: 769px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function updateHeaderH() {
      if (navbar) {
        document.documentElement.style.setProperty('--header-h', navbar.offsetHeight + 'px');
      }
    }
    updateHeaderH();
    window.addEventListener('resize', updateHeaderH, { passive: true });

    /* Stagger indexes (CSS reads --i for staggered glide animation) */
    menu.querySelectorAll('.nav-list > li').forEach((li, i) => li.style.setProperty('--i', i));
    menu.querySelectorAll('.acc-body').forEach(body =>
      [...body.children].forEach((el, i) => el.style.setProperty('--i', i))
    );

    /* Open / close the entire mobile menu */
    function setMenu(open) {
      if (open) updateHeaderH();
      toggle.checked = open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('menu-lock', open);
      document.body.classList.toggle('menu-lock', open);
      if (!open) {
        menu.querySelectorAll('.acc-item.is-open').forEach(item => setItem(item, false));
      }
    }
    toggle.addEventListener('change', () => setMenu(toggle.checked));

    /* Accordion item toggling (works at any nesting depth) */
    function setItem(item, open) {
      const trigger = item.querySelector(':scope > [data-acc-trigger]');
      if (!trigger) return;
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      if (!open) {
        // Closing a parent also closes all nested child accordions
        item.querySelectorAll('.acc-item.is-open').forEach(child => {
          child.classList.remove('is-open');
          child.querySelector(':scope > [data-acc-trigger]')?.setAttribute('aria-expanded', 'false');
        });
      }
    }

    menu.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-acc-trigger]');
      if (trigger) {
        const item = trigger.closest('.acc-item');
        if (!item) return;
        const willOpen = !item.classList.contains('is-open');

        if (willOpen) {
          // Accordion Rule: Only one item open per level (close siblings)
          [...item.parentElement.children]
            .filter(el => el !== item && el.classList.contains('acc-item'))
            .forEach(sibling => setItem(sibling, false));
        }
        setItem(item, willOpen);

        if (willOpen) {
          const isTopLevel = trigger.classList.contains('pill');
          setTimeout(() => {
            trigger.scrollIntoView({
              block: isTopLevel ? 'start' : 'nearest',
              behavior: reduceMotion.matches ? 'auto' : 'smooth'
            });
          }, 260);
        }
        return;
      }

      // Navigating via any anchor link automatically closes the menu
      if (e.target.closest('a[href]')) {
        setMenu(false);
      }
    });

    /* Escape closes menu and returns focus to burger checkbox */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    /* Leaving the mobile breakpoint resets menu state */
    desktop.addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && menu.classList.contains('is-open')) {
        setMenu(false);
      }
    }, { passive: true });
  }

  initMobileMenu();



  /* 3. Interactive Before & After Slider optimized with RequestAnimationFrame */
  const baSlider = document.getElementById('baSlider');
  const baBefore = document.getElementById('baBefore');
  const baHandle = document.getElementById('baHandle');

  if (baSlider) {
    let isDragging = false;
    let sliderTicking = false;

    const updateSlider = (xPos) => {
      if (!sliderTicking) {
        window.requestAnimationFrame(() => {
          const rect = baSlider.getBoundingClientRect();
          let pos = ((xPos - rect.left) / rect.width) * 100;
          if (pos < 5) pos = 5;
          if (pos > 95) pos = 95;
          
          baBefore.style.clipPath = `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`;
          baHandle.style.left = `${pos}%`;
          sliderTicking = false;
        });
        sliderTicking = true;
      }
    };

    baSlider.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    baSlider.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    }, { passive: true });

    baSlider.addEventListener('touchstart', () => isDragging = true, { passive: true });
    window.addEventListener('touchend', () => isDragging = false, { passive: true });
    baSlider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    baSlider.addEventListener('click', (e) => {
      updateSlider(e.clientX);
    });
  }

  /* 4. Interactive FAQ Accordion */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.faq-card');
      if (!card) return;
      const isOpen = card.classList.contains('active');
      const parentList = card.closest('.faq-list');

      // Close other cards in the same list
      if (parentList) {
        parentList.querySelectorAll('.faq-card').forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('active');
            const otherBtn = otherCard.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            const otherAns = otherCard.querySelector('.faq-answer');
            if (otherAns) otherAns.style.display = 'none';
          }
        });
      }

      // Toggle current card
      if (isOpen) {
        card.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        const ans = card.querySelector('.faq-answer');
        if (ans) ans.style.display = 'none';
      } else {
        card.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        const ans = card.querySelector('.faq-answer');
        if (ans) ans.style.display = 'block';
      }
    });
  });

  /* 5. Full-Screen Overlay Menu & Nested Accordion Navigation */
  const landingHamburger = document.getElementById('landingHamburger');
  const landingMenuOverlay = document.getElementById('landingMenuOverlay');
  const menuCloseBtn = document.getElementById('menuCloseBtn');

  if (landingHamburger && landingMenuOverlay) {
    const accButtons = landingMenuOverlay.querySelectorAll('.menu-overlay-acc-btn');

    const setAccordion = (btn, expand) => {
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      btn.setAttribute('aria-expanded', String(expand));
      if (panel) {
        panel.classList.toggle('is-expanded', expand);
      }
    };

    const closeAllAccordions = () => {
      accButtons.forEach(btn => setAccordion(btn, false));
    };

    const toggleOverlay = (open) => {
      landingMenuOverlay.classList.toggle('is-active', open);
      landingHamburger.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('menu-lock', open);
      document.body.classList.toggle('menu-lock', open);
      if (!open) {
        closeAllAccordions();
      }
    };

    landingHamburger.addEventListener('click', () => toggleOverlay(true));
    if (menuCloseBtn) {
      menuCloseBtn.addEventListener('click', () => toggleOverlay(false));
    }

    // Accordion toggle events with single-open logic
    accButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyExpanded = btn.getAttribute('aria-expanded') === 'true';
        closeAllAccordions();
        if (!isCurrentlyExpanded) {
          setAccordion(btn, true);
        }
      });
    });

    // Navigation and smooth scrolling for in-page anchors
    landingMenuOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('tel:')) return;

        try {
          const url = new URL(href, window.location.href);
          const isSamePage = url.pathname === window.location.pathname;

          if (isSamePage && url.hash) {
            e.preventDefault();
            toggleOverlay(false);
            const targetEl = document.querySelector(url.hash);
            if (targetEl) {
              setTimeout(() => {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', url.hash);
              }, 120);
            }
          } else {
            toggleOverlay(false);
          }
        } catch (err) {
          toggleOverlay(false);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && landingMenuOverlay.classList.contains('is-active')) {
        toggleOverlay(false);
        landingHamburger.focus();
      }
    });
  }

  /* Tasteful GSAP Animation Choreography for Landing Page */
  if (typeof gsap !== 'undefined' && document.body.classList.contains('landing-page')) {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window.location.hostname.includes('localhost');

    if (!isReducedMotion) {
      const runHeroEntrance = () => {
        // 1. Hero image subtle cinematic settling (scale 1.06 to 1 over 2s)
        const heroImg = document.querySelector('.hero-bg-img');
        if (heroImg) {
          gsap.fromTo(heroImg, { scale: 1.06 }, { scale: 1, duration: 2, ease: 'power2.out' });
        }

        // 2. Navigation fades down 20px over 0.8s
        const navbar = document.querySelector('.landing-navbar');
        if (navbar) {
          gsap.from(navbar, { y: -20, opacity: 0, duration: 0.8, ease: 'power2.out' });
        }

        // 3. Headline reveals line by line (translateY 40px and opacity 0 to final, .9s, power3.out, .12s stagger)
        const heroLines = document.querySelectorAll('.hero-line');
        if (heroLines.length) {
          gsap.from(heroLines, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            delay: 0.15
          });
        }

        // 4. Subtext and existing CTA buttons fade up in sequence
        const heroSub = document.querySelector('.landing-hero-content .hero-subtitle');
        const heroCtas = document.querySelector('.landing-hero-content .hero-ctas');
        if (heroSub && heroCtas) {
          gsap.from([heroSub, heroCtas], {
            y: 25,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            delay: 0.45
          });
        }
      };

      if (window.__welcomeCurtainActive) {
        window.addEventListener('welcome:opening', runHeroEntrance, { once: true });
      } else {
        runHeroEntrance();
      }
    }

    // 5. Clinical Specialisations Responsive Choreography
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      // Mode A: Desktop & Tablet (>= 768px), Landscape Phones
      // Preserves original vertical/grid layout with elegant scroll entrance stagger
      mm.add({
        isDesktopOrTablet: "(min-width: 768px)",
        isLandscape: "(orientation: landscape)"
      }, (context) => {
        const { isDesktopOrTablet, isLandscape } = context.conditions;
        if (isDesktopOrTablet || isLandscape) {
          gsap.from('.service-item', {
            scrollTrigger: {
              trigger: '.services-columns',
              start: 'top 85%',
              once: true
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1
          });
        }
      });
    }

    // 6. Mobile Clinical Specialisations: Premium Seamless Infinite-Loop Carousel
    // Scope: Mobile portrait phones (<= 767px) only. Operates independently of vertical page scroll.
    initMobileSpecialisationsCarousel();
  }

  /* ==================== MOBILE SPECIALISATIONS INFINITE-LOOP CAROUSEL ==================== */
  function initMobileSpecialisationsCarousel() {
    const section = document.querySelector('.services-section#specialisations');
    if (!section) return;

    const viewport = section.querySelector('.services-carousel-viewport') || section;
    const track = section.querySelector('.services-columns');
    if (!viewport || !track) return;

    const mql = window.matchMedia('(max-width: 767px) and (orientation: portrait)');
    let rafId = null;
    let resumeTimer = null;
    let sequenceWidth = 0;
    let currentX = 0;
    const speedPxPerSec = 24; // Calm, continuous, elegant speed (~24 CSS px/sec)
    let isPaused = false;
    let isInteracting = false;
    let lastTimestamp = performance.now();
    let cleanupFns = [];

    function setupClones() {
      // Remove any existing clones first
      track.querySelectorAll('.service-item-clone').forEach(el => el.remove());

      const originalCards = Array.from(track.querySelectorAll('.service-item:not(.service-item-clone)'));
      if (originalCards.length === 5) {
        originalCards.forEach((card) => {
          const clone = card.cloneNode(true);
          clone.classList.add('service-item-clone');
          clone.setAttribute('aria-hidden', 'true');
          clone.setAttribute('tabindex', '-1');
          clone.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
          track.appendChild(clone);
        });
      }
    }

    function getSequenceWidth() {
      const allCards = track.querySelectorAll('.service-item');
      if (allCards.length >= 10) {
        return allCards[5].offsetLeft - allCards[0].offsetLeft;
      }
      return 0;
    }

    function tick(now) {
      if (!lastTimestamp) {
        lastTimestamp = now;
        rafId = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (sequenceWidth <= 0) {
        sequenceWidth = getSequenceWidth();
      }

      if (!isPaused && !isInteracting && sequenceWidth > 0) {
        currentX -= speedPxPerSec * dt;
        if (currentX <= -sequenceWidth) {
          currentX += sequenceWidth;
        }
        track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    function startCarousel() {
      stopCarousel();
      setupClones();

      // Ensure width calculation after rendering and fonts
      sequenceWidth = getSequenceWidth();
      if (sequenceWidth <= 0) {
        setTimeout(() => { sequenceWidth = getSequenceWidth(); }, 150);
      }

      // Check reduced motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
                             !window.location.search.includes('motion') &&
                             !window.location.hostname.includes('localhost');
      if (prefersReduced) {
        track.style.transform = 'none';
        return;
      }

      lastTimestamp = performance.now();
      rafId = requestAnimationFrame(tick);

      // Touch & Pointer Gesture Handling
      let startX = 0;
      let startY = 0;
      let touchStartX = 0;
      let isDragging = false;
      let hasDraggedSignificantly = false;

      const onPointerDown = (e) => {
        isInteracting = true;
        clearTimeout(resumeTimer);
        startX = e.clientX;
        startY = e.clientY;
        touchStartX = currentX;
        isDragging = false;
        hasDraggedSignificantly = false;
      };

      const onPointerMove = (e) => {
        if (!isInteracting) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!isDragging) {
          if (Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) {
            isDragging = true;
          } else if (Math.abs(dy) > 7) {
            // Vertical page scrolling takes priority
            isInteracting = false;
            return;
          }
        }

        if (isDragging) {
          hasDraggedSignificantly = true;
          currentX = touchStartX + dx;
          if (sequenceWidth > 0) {
            while (currentX <= -sequenceWidth) currentX += sequenceWidth;
            while (currentX > 0) currentX -= sequenceWidth;
          }
          track.style.transform = `translate3d(${currentX}px, 0, 0)`;
        }
      };

      const onPointerEnd = () => {
        if (!isInteracting) return;
        isInteracting = false;
        isDragging = false;
        lastTimestamp = performance.now();
        clearTimeout(resumeTimer);
        setTimeout(() => { hasDraggedSignificantly = false; }, 80);
        // Resume continuous movement gently after 1.5s of inactivity
        resumeTimer = setTimeout(() => {
          isPaused = false;
          lastTimestamp = performance.now();
        }, 1500);
      };

      const onClick = (e) => {
        if (hasDraggedSignificantly) {
          e.preventDefault();
          e.stopPropagation();
          hasDraggedSignificantly = false;
        }
      };

      const onMouseEnter = () => { isPaused = true; };
      const onMouseLeave = () => {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => { isPaused = false; lastTimestamp = performance.now(); }, 1200);
      };

      const onFocusIn = () => { isPaused = true; };
      const onFocusOut = () => {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => { isPaused = false; lastTimestamp = performance.now(); }, 1500);
      };

      const onVisibilityChange = () => {
        if (document.hidden) {
          isPaused = true;
        } else {
          isPaused = false;
          lastTimestamp = performance.now();
        }
      };

      const onResize = () => {
        sequenceWidth = getSequenceWidth();
      };

      viewport.addEventListener('pointerdown', onPointerDown, { passive: true });
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerEnd, { passive: true });
      window.addEventListener('pointercancel', onPointerEnd, { passive: true });
      track.addEventListener('click', onClick, true);
      viewport.addEventListener('mouseenter', onMouseEnter);
      viewport.addEventListener('mouseleave', onMouseLeave);
      viewport.addEventListener('focusin', onFocusIn);
      viewport.addEventListener('focusout', onFocusOut);
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('resize', onResize);

      cleanupFns.push(() => {
        viewport.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerEnd);
        window.removeEventListener('pointercancel', onPointerEnd);
        track.removeEventListener('click', onClick, true);
        viewport.removeEventListener('mouseenter', onMouseEnter);
        viewport.removeEventListener('mouseleave', onMouseLeave);
        viewport.removeEventListener('focusin', onFocusIn);
        viewport.removeEventListener('focusout', onFocusOut);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('resize', onResize);
      });
    }

    function stopCarousel() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      clearTimeout(resumeTimer);
      cleanupFns.forEach(fn => fn());
      cleanupFns = [];
      track.querySelectorAll('.service-item-clone').forEach(el => el.remove());
      track.style.transform = '';
      currentX = 0;
      isPaused = false;
      isInteracting = false;
    }

    mql.addEventListener('change', (e) => {
      if (e.matches) {
        startCarousel();
      } else {
        stopCarousel();
      }
    });

    if (mql.matches) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startCarousel);
      } else {
        startCarousel();
      }
    }
  }

  /* ==================== IN-FLOW BROWSER BACK BUTTON ==================== */
  const backButtons = document.querySelectorAll('.back-btn');
  backButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (document.referrer) {
        try {
          const refUrl = new URL(document.referrer);
          if (refUrl.origin === window.location.origin) {
            e.preventDefault();
            window.history.back();
          }
        } catch (err) {
          // If URL parsing fails, allow standard anchor navigation to fallback href
        }
      }
    });
  });

  /* ==================== UNIVERSAL FLOATING BACK BUTTON & PORTAL STACKING ==================== */
  const backWrappers = document.querySelectorAll('.back-btn-wrapper');
  const mainNav = document.querySelector('#navbar') || document.querySelector('.landing-navbar') || document.querySelector('.navbar');

  backWrappers.forEach(wrapper => {
    const btn = wrapper.querySelector('.back-btn');
    if (!btn) return;

    let isCurrentlyFloating = false;

    function updateMeasurements() {
      const navHeight = mainNav ? mainNav.offsetHeight : 84;
      document.documentElement.style.setProperty('--header-height', navHeight + 'px');

      const rect = wrapper.getBoundingClientRect();
      if (rect.left > 0) {
        document.documentElement.style.setProperty('--back-btn-left', rect.left + 'px');
      } else {
        const container = wrapper.closest('.container') || document.querySelector('.container');
        if (container) {
          const cRect = container.getBoundingClientRect();
          const cStyle = window.getComputedStyle(container);
          const pLeft = parseFloat(cStyle.paddingLeft) || 16;
          document.documentElement.style.setProperty('--back-btn-left', (cRect.left + pLeft) + 'px');
        }
      }
    }

    function setFloating(floating) {
      if (floating) {
        if (!isCurrentlyFloating) {
          isCurrentlyFloating = true;
          // Mount directly to document.body: escapes any ancestor stacking contexts (.container z-index: 1)
          if (btn.parentElement !== document.body) {
            document.body.appendChild(btn);
          }
          btn.classList.add('is-floating');
        }
      } else {
        if (isCurrentlyFloating) {
          isCurrentlyFloating = false;
          // Return to original in-flow wrapper
          if (btn.parentElement !== wrapper) {
            wrapper.appendChild(btn);
          }
          btn.classList.remove('is-floating');
        }
      }
    }

    // Ensure 1px sentinel exists directly before button inside wrapper
    let sentinel = wrapper.querySelector('.back-btn-sentinel');
    if (!sentinel) {
      sentinel = document.createElement('div');
      sentinel.className = 'back-btn-sentinel';
      sentinel.setAttribute('aria-hidden', 'true');
      wrapper.insertBefore(sentinel, btn);
    }

    if (window.ResizeObserver && mainNav) {
      const ro = new ResizeObserver(() => updateMeasurements());
      ro.observe(mainNav);
    }
    window.addEventListener('resize', updateMeasurements, { passive: true });

    // Instant scroll listener: guarantees 60/120fps sync and immediate return to resting at top
    window.addEventListener('scroll', () => {
      if (window.scrollY < 20) {
        setFloating(false);
        return;
      }
      const navHeight = mainNav ? mainNav.offsetHeight : 84;
      const threshold = navHeight + 20;
      const sentinelRect = sentinel.getBoundingClientRect();
      if (sentinelRect.top < threshold || window.scrollY > 100) {
        setFloating(true);
      } else {
        setFloating(false);
      }
    }, { passive: true });

    updateMeasurements();

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (window.scrollY < 20) {
          setFloating(false);
          return;
        }
        entries.forEach(entry => {
          const navHeight = mainNav ? mainNav.offsetHeight : 84;
          const offset = navHeight + 16;
          if ((!entry.isIntersecting && entry.boundingClientRect.top < offset) || window.scrollY > 100) {
            setFloating(true);
          } else if (entry.isIntersecting || window.scrollY < 20) {
            setFloating(false);
          }
        });
      }, {
        rootMargin: '-100px 0px 0px 0px'
      });
      observer.observe(sentinel);
    } else {
      setFloating(true);
    }
  });
});
