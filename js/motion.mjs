const header = document.getElementById('site-header');
const studio = document.getElementById('practice');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');

let scrollFrame;
function markScroll() {
  scrollFrame = null;
  header.classList.toggle('is-scrolled', scrollY > 24);
}
markScroll();
addEventListener('scroll', () => { scrollFrame ??= requestAnimationFrame(markScroll); }, { passive: true });

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('[data-reveal]')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function reveal(section) {
    section.classList.add('is-visible');
    observer.unobserve(section);
  }
  function syncMotion() {
    document.documentElement.classList.toggle('js-motion', !motionPreference.matches);
    observer.disconnect();
    if (!motionPreference.matches) sections.filter(section => !section.classList.contains('is-visible')).forEach(section => observer.observe(section));
  }
  // Keyboard focus and deep links must not land inside invisible content.
  document.addEventListener('focusin', event => {
    const section = event.target.closest('[data-reveal]');
    if (section) reveal(section);
  });
  function revealAnchor() {
    const section = document.getElementById(location.hash.slice(1))?.closest('[data-reveal]');
    if (section) reveal(section);
  }
  addEventListener('hashchange', revealAnchor);
  revealAnchor();
  syncMotion();
  motionPreference.addEventListener('change', syncMotion);
}

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const action = event.target.closest('[data-focus-board], [data-jump-print], [data-open-print]');
  if (!action || document.getElementById('board').getAttribute('aria-busy') === 'true') return;
  const view = action.hasAttribute('data-focus-board') ? 'practice' : 'print';
  event.preventDefault();
  studio.dispatchEvent(new CustomEvent('studio:navigate', { detail: { view, size: Number(action.dataset.startSize) } }));
  studio.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth' });
});

function followPrintLink() {
  if (location.hash === '#print') requestAnimationFrame(() => studio.scrollIntoView({ behavior: 'instant' }));
}
addEventListener('hashchange', followPrintLink);
followPrintLink();
