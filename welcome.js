(function () {
  'use strict';

  // Config & Timings (tuneable)
  const WELCOME_ENABLED = true;
  const INCLUDE_DR = true; // Official name: "Dr. Anam’s Dental"
  const SKIP_FOR_SEARCH_REFERRALS = false;
  // Shortened Nov 2026: about 1.6 s in total (was 2.0 s plus up to 0.6 s font wait).
  // Same choreography (name rises, holds, curtains part), just tighter.
  const TIME_TEXT_ENTER = 0.34;
  const TIME_TEXT_STAGGER = 0.05;
  const TIME_HOLD_START = 0.49;
  const TIME_TEXT_EXIT = 0.20;
  const TIME_EXIT_STAGGER = 0.025;
  const TIME_EXIT_START = 0.85;
  const TIME_PANELS_PART = 0.66;
  const TIME_PANELS_START = 0.95;
  const TIME_EVENT_OPENING = 1.10;
  const TIME_TOTAL_CLEANUP = 1.62;
  const FONT_WAIT_MS = 400;
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
    '.welcome-icon-mask{padding:4px 16px;margin:-4px -16px}' +
    '.welcome-line{display:block;line-height:1.08;transform:translate3d(0,120%,0);opacity:0;will-change:transform,opacity}' +
    '.welcome-tooth-icon{width:clamp(42px,12vw,52px);height:clamp(48px,14vw,60px);display:block;margin:0 auto clamp(.85rem,2.2vh,1.35rem);filter:drop-shadow(0 2px 10px rgba(0,0,0,.45))}' +
    '.welcome-eyebrow{font-family:"DM Sans",sans-serif;font-weight:300;font-size:clamp(.95rem,3.8vw,1.15rem);letter-spacing:.12em;color:rgba(243,239,236,.72);margin-bottom:.45rem}' +
    '.welcome-name{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;letter-spacing:-.01em;text-transform:uppercase;color:#FFF;font-size:clamp(1.85rem,8.2vw,2.85rem);line-height:1.08}';

  const styleEl = document.createElement('style');
  styleEl.id = 'welcome-styles';
  styleEl.textContent = css;

  const brandName = INCLUDE_DR ? 'Dr. Anam\u2019s' : 'Anam\u2019s';

  const overlay = document.createElement('div');
  overlay.id = 'welcome-splash';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div id="welcome-panel-left" class="welcome-panel"><div class="welcome-shade-l"></div></div>' +
    '<div id="welcome-panel-right" class="welcome-panel"><div class="welcome-shade-r"></div></div>' +
    '<div id="welcome-text">' +
      '<div class="welcome-mask welcome-icon-mask">' +
        '<div class="welcome-line">' +
          '<svg class="welcome-tooth-icon" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<path d="M19 5.5C14.5 3 7.5 5 7.5 13C7.5 19.5 9.5 25 11.5 31C13 35.5 15.5 38.5 17 38.5C18.5 38.5 18 31 19 28C20 31 19.5 38.5 21 38.5C22.5 38.5 25 35.5 26.5 31C28.5 25 30.5 19.5 30.5 13C30.5 5 23.5 3 19 5.5Z" stroke="#F3EFEC" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M13 14C15 16 17 16.8 19 16.8C21 16.8 23 16 25 14" stroke="#F3EFEC" stroke-width="1.3" stroke-linecap="round"/>' +
          '</svg>' +
        '</div>' +
      '</div>' +
      '<div class="welcome-mask"><span class="welcome-line welcome-eyebrow">Welcome to</span></div>' +
      '<div class="welcome-mask"><span class="welcome-line welcome-name">' + brandName + '</span></div>' +
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
      ? Promise.race([document.fonts.load('500 1rem "Cormorant Garamond"'), new Promise((r) => setTimeout(r, FONT_WAIT_MS))])
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
        .to(shades, { opacity: 0, duration: 0.34, ease: 'power2.out' }, TIME_PANELS_START)
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
      lines.forEach((l, i) => anim(l, [{ transform: 'translate3d(0,120%,0)', opacity: 0 }, { transform: 'translate3d(0,0,0)', opacity: 1 }], { duration: TIME_TEXT_ENTER * 1000, delay: i * TIME_TEXT_STAGGER * 1000, easing: 'cubic-bezier(.215,.61,.355,1)' }));
      setTimeout(() => {
        lines.forEach((l, i) => anim(l, [{ transform: 'translate3d(0,0,0)', opacity: 1 }, { transform: 'translate3d(0,-120%,0)', opacity: 0 }], { duration: TIME_TEXT_EXIT * 1000, delay: i * TIME_EXIT_STAGGER * 1000, easing: 'cubic-bezier(.55,.055,.675,.19)' }));
      }, TIME_EXIT_START * 1000);
      setTimeout(() => {
        anim(pLeft, [{ transform: 'none' }, { transform: 'translate3d(-101%,0,0)' }], { duration: TIME_PANELS_PART * 1000, easing: 'cubic-bezier(.77,0,.175,1)' });
        anim(pRight, [{ transform: 'none' }, { transform: 'translate3d(101%,0,0)' }], { duration: TIME_PANELS_PART * 1000, easing: 'cubic-bezier(.77,0,.175,1)' });
        shades.forEach(s => anim(s, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 }));
      }, TIME_PANELS_START * 1000);
      setTimeout(() => { try { window.dispatchEvent(new CustomEvent('welcome:opening')); } catch (e) {} }, TIME_EVENT_OPENING * 1000);
      setTimeout(cleanup, TIME_TOTAL_CLEANUP * 1000);
    } catch (e) {
      cleanup();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAnimation, { once: true });
  else initAnimation();
})();
