(function () {
  'use strict';

  // Config & Timings (tuneable)
  const WELCOME_ENABLED = true;
  const SKIP_FOR_SEARCH_REFERRALS = false;
  const TIME_TEXT_ENTER = 0.40;
  const TIME_TEXT_STAGGER = 0.08;
  const TIME_HOLD_START = 0.56;
  const TIME_TEXT_EXIT = 0.25;
  const TIME_EXIT_STAGGER = 0.03;
  const TIME_EXIT_START = 1.05;
  const TIME_PANELS_PART = 0.80;
  const TIME_PANELS_START = 1.20;
  const TIME_EVENT_OPENING = 1.45;
  const TIME_TOTAL_CLEANUP = 2.00;
  const HARD_TIMEOUT_MS = 5000;

  // 1. Skip Checks
  if (!WELCOME_ENABLED || !window.matchMedia || !window.matchMedia('(max-width: 767px)').matches) return;
  const p = window.location.pathname;
  if (p !== '/' && !p.endsWith('/index.html') && !p.endsWith('/index') && p !== '') return;
  if (window.location.hash && window.location.hash.length > 1) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const isTest = new URLSearchParams(window.location.search).get('welcome') === '1';
  if (!isTest) {
    try { if (sessionStorage.getItem('dr_anam_welcome_seen')) return; } catch (e) {}
    if (document.referrer) {
      try { if (new URL(document.referrer).origin === window.location.origin) return; } catch (e) {}
      if (SKIP_FOR_SEARCH_REFERRALS) {
        try { if (/google|bing|duckduckgo|yahoo/i.test(new URL(document.referrer).hostname)) return; } catch (e) {}
      }
    }
  }

  try { sessionStorage.setItem('dr_anam_welcome_seen', '1'); } catch (e) {}
  window.__welcomeCurtainActive = true;

  // 2. Pre-Body Injection (Zero Flash)
  const css = '#welcome-splash{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;z-index:1000000;overflow:hidden;pointer-events:auto;touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none}' +
    '.welcome-panel{position:absolute;top:0;bottom:0;width:calc(50% + 1px);height:100%;background:#11100C;overflow:hidden;z-index:1}' +
    '#welcome-panel-left{left:0}#welcome-panel-right{right:0}' +
    '.welcome-shade-l,.welcome-shade-r{position:absolute;top:0;bottom:0;width:24px;pointer-events:none}' +
    '.welcome-shade-l{right:0;background:linear-gradient(to left,rgba(0,0,0,.12),transparent)}' +
    '.welcome-shade-r{left:0;background:linear-gradient(to right,rgba(0,0,0,.12),transparent)}' +
    '#welcome-text{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2;pointer-events:none;text-align:center;padding:env(safe-area-inset-top,24px) 24px env(safe-area-inset-bottom,24px);box-sizing:border-box}' +
    '.welcome-mask{overflow:hidden;display:block;padding:8px 16px;margin:-8px -16px}' +
    '.welcome-line{display:block;line-height:1.08;transform:translate3d(0,120%,0);opacity:0;will-change:transform,opacity}' +
    '.welcome-eyebrow{font-family:"DM Sans",sans-serif;font-weight:300;font-size:clamp(.95rem,3.8vw,1.15rem);letter-spacing:.12em;color:rgba(243,239,236,.72);margin-bottom:.5rem}' +
    '.welcome-name{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;letter-spacing:-.01em;text-transform:uppercase;color:#FFF;font-size:clamp(2.1rem,9.8vw,3.1rem);line-height:1.05}';

  const styleEl = document.createElement('style');
  styleEl.id = 'welcome-styles';
  styleEl.textContent = css;

  const overlay = document.createElement('div');
  overlay.id = 'welcome-splash';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div id="welcome-panel-left" class="welcome-panel"><div class="welcome-shade-l"></div></div>' +
    '<div id="welcome-panel-right" class="welcome-panel"><div class="welcome-shade-r"></div></div>' +
    '<div id="welcome-text">' +
      '<div class="welcome-mask"><span class="welcome-line welcome-eyebrow">Welcome to</span></div>' +
      '<div class="welcome-mask"><span class="welcome-line welcome-name">Dr. Anam\u2019s</span></div>' +
      '<div class="welcome-mask"><span class="welcome-line welcome-name">Dental</span></div>' +
    '</div>';

  const root = document.documentElement;
  root.appendChild(styleEl);
  root.appendChild(overlay);
  root.style.overflow = 'hidden';

  const lockBody = () => { if (document.body) document.body.style.overflow = 'hidden'; };
  if (document.body) lockBody();
  else document.addEventListener('DOMContentLoaded', lockBody, { once: true });
  overlay.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  // 3. Cleanup
  let isCleanedUp = false;
  function cleanup() {
    if (isCleanedUp) return;
    isCleanedUp = true;
    root.style.overflow = '';
    if (document.body) document.body.style.overflow = '';
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    if (window.lenis && typeof window.lenis.start === 'function') {
      try { window.lenis.start(); } catch (e) {}
    }
    if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
      try { window.ScrollTrigger.refresh(); } catch (e) {}
    }
    try { window.dispatchEvent(new CustomEvent('welcome:done')); } catch (e) {}
  }

  setTimeout(cleanup, HARD_TIMEOUT_MS);
  window.addEventListener('pageshow', (e) => { if (e.persisted) cleanup(); });

  // 4. Waiting & Timeline
  function waitForFont() {
    return (document.fonts && document.fonts.load)
      ? Promise.race([document.fonts.load('500 1rem "Cormorant Garamond"'), new Promise((r) => setTimeout(r, 600))])
      : Promise.resolve();
  }

  function waitForGSAP() {
    return new Promise((resolve) => {
      if (window.gsap) return resolve(window.gsap);
      const start = Date.now(), iv = setInterval(() => {
        if (window.gsap) { clearInterval(iv); resolve(window.gsap); }
        else if (Date.now() - start > 3000) { clearInterval(iv); resolve(null); }
      }, 50);
    });
  }

  async function initAnimation() {
    try {
      await waitForFont();
      const gsap = await waitForGSAP();
      const lines = overlay.querySelectorAll('.welcome-line');
      const pLeft = overlay.querySelector('#welcome-panel-left');
      const pRight = overlay.querySelector('#welcome-panel-right');
      const shades = overlay.querySelectorAll('.welcome-shade-l, .welcome-shade-r');

      if (!gsap) {
        runFallback(lines, pLeft, pRight, shades);
        return;
      }

      gsap.set(lines, { yPercent: 120, y: 0, opacity: 0 });
      gsap.set([pLeft, pRight], { xPercent: 0, x: 0 });
      pLeft.style.willChange = 'transform';
      pRight.style.willChange = 'transform';

      const tl = gsap.timeline({ onComplete: cleanup });
      tl.to(lines, { yPercent: 0, opacity: 1, duration: TIME_TEXT_ENTER, stagger: TIME_TEXT_STAGGER, ease: 'power3.out' }, 0)
        .to(lines, { yPercent: -120, opacity: 0, duration: TIME_TEXT_EXIT, stagger: TIME_EXIT_STAGGER, ease: 'power2.in' }, TIME_EXIT_START)
        .to(pLeft, { xPercent: -101, duration: TIME_PANELS_PART, ease: 'power4.inOut' }, TIME_PANELS_START)
        .to(pRight, { xPercent: 101, duration: TIME_PANELS_PART, ease: 'power4.inOut' }, TIME_PANELS_START)
        .to(shades, { opacity: 0, duration: 0.40, ease: 'power2.out' }, TIME_PANELS_START)
        .call(() => {
          try { window.dispatchEvent(new CustomEvent('welcome:opening')); } catch (e) {}
        }, null, TIME_EVENT_OPENING);

      let skipped = false;
      const skip = () => {
        if (skipped || isCleanedUp) return;
        if (tl.time() < TIME_PANELS_START) {
          skipped = true;
          gsap.killTweensOf(lines);
          gsap.to(lines, {
            yPercent: -120, opacity: 0, duration: 0.12, ease: 'power2.in', overwrite: true,
            onComplete: () => { tl.seek(TIME_PANELS_START); tl.play(); }
          });
        }
      };
      overlay.addEventListener('click', skip);
      overlay.addEventListener('touchend', skip, { passive: true });
    } catch (e) {
      cleanup();
    }
  }

  function runFallback(lines, pLeft, pRight, shades) {
    try {
      const anim = (el, kf, opt) => el.animate(kf, Object.assign({ fill: 'forwards' }, opt));
      lines.forEach((l, i) => anim(l, [{ transform: 'translate3d(0,120%,0)', opacity: 0 }, { transform: 'translate3d(0,0,0)', opacity: 1 }], { duration: 400, delay: i * 80, easing: 'cubic-bezier(.215,.61,.355,1)' }));
      setTimeout(() => {
        lines.forEach((l, i) => anim(l, [{ transform: 'translate3d(0,0,0)', opacity: 1 }, { transform: 'translate3d(0,-120%,0)', opacity: 0 }], { duration: 250, delay: i * 30, easing: 'cubic-bezier(.55,.055,.675,.19)' }));
      }, 1050);
      setTimeout(() => {
        anim(pLeft, [{ transform: 'none' }, { transform: 'translate3d(-101%,0,0)' }], { duration: 800, easing: 'cubic-bezier(.77,0,.175,1)' });
        anim(pRight, [{ transform: 'none' }, { transform: 'translate3d(101%,0,0)' }], { duration: 800, easing: 'cubic-bezier(.77,0,.175,1)' });
        shades.forEach(s => anim(s, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 }));
      }, 1200);
      setTimeout(() => { try { window.dispatchEvent(new CustomEvent('welcome:opening')); } catch (e) {} }, 1450);
      setTimeout(cleanup, 2000);
    } catch (e) {
      cleanup();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAnimation, { once: true });
  else initAnimation();
})();
