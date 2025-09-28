(function () {
  const KEY = 'theme';
  const btn = document.getElementById('themeToggle');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let theme = localStorage.getItem(KEY) || 'auto';

  function useDark(t) {
    return t === 'dark' || (t === 'auto' && media.matches);
  }

  function label(t) {
    return t === 'dark'  ? '⏾ Gelap'
         : t === 'light' ? '☀︎ Terang'
         : '⚙︎ Otomatis';
  }

  function apply(t) {
    document.body.classList.toggle('darkmode', useDark(t));
    if (btn) {
      btn.textContent = label(t);
      btn.setAttribute('aria-pressed', String(t !== 'light'));
      btn.setAttribute('aria-label', `Theme: ${t}`);
    }
    localStorage.setItem(KEY, t);
    theme = t;
  }

  function next(t) {
    return t === 'auto' ? 'dark' : t === 'dark' ? 'light' : 'auto';
  }

  apply(theme);

  if (btn) {
    btn.addEventListener('click', () => {
      apply(next(theme));
    });
  }

  media.addEventListener('change', () => {
    if (theme === 'auto') apply('auto');
  });
})();

window.addEventListener("scroll", () => {
  const arrow = document.querySelector(".arrow");
  const bgVideo = document.getElementById("bgVideo");
  const triggerPoint = window.innerHeight * 0.5;

  if (arrow) {
    if (window.scrollY > triggerPoint) {
      arrow.classList.add("hide");
      bgVideo.classList.add("scrolled");
    } else {
      bgVideo.classList.remove("scrolled");
      arrow.classList.remove("hide");
    }
  }
});

const overlay = document.getElementById("loading");
const bgm = document.getElementById("bgm");
window.addEventListener("load", () => {
  overlay.classList.add("hidden");
});

document.addEventListener('DOMContentLoaded', () => {
 
document.querySelectorAll(".pindahPage").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    let fade = setInterval(() => {
      if (bgm.volume > 0.05) {
        bgm.volume -= 0.05;
      } else {
        bgm.pause();
        clearInterval(fade);
      }
    }, 20);

    overlay.classList.remove("hidden");
    setTimeout(() => { location.href = a.href; }, 150);
  });
});

  const carousel = document.querySelector('.carousel');
  const track = carousel?.querySelector('.carousel-track');
  const slides = track ? Array.from(track.querySelectorAll('.slide')) : [];

  if (!carousel || !track || slides.length === 0) return;

  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let index = 0;
  let slideWidth = carousel.clientWidth;

  function measure() {
    slideWidth = carousel.clientWidth;
    slides.forEach(slide => (slide.style.minWidth = `${slideWidth}px`));
    snap();
  }

  function snap() {
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  function goTo(i) {
  if (i < 0) i = 0;
  if (i > slides.length - 1) i = slides.length - 1;
  index = i;
  snap();
}

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  let isDown = false;
  let startX = 0;
  let startTx = 0;

  function getTx() {
    const s = getComputedStyle(track).transform;
    if (s && s !== 'none') {
      const m = new DOMMatrixReadOnly(s);
      return m.m41;
    }
    return 0;
  }

  const onPointerDown = (clientX) => {
    isDown = true;
    startX = clientX;
    startTx = getTx();
    track.style.transition = 'none';
  };

  const onPointerMove = (clientX) => {
    if (!isDown) return;
    const delta = clientX - startX;
    track.style.transform = `translateX(${startTx + delta}px)`;
  };

  const onPointerUp = (clientX) => {
    if (!isDown) return;
    isDown = false;
    const delta = clientX - startX;
    const threshold = slideWidth * 0.15;
    if (delta > threshold) goTo(index - 1);
    else if (delta < -threshold) goTo(index + 1);
    else snap();
  };

  track.addEventListener('mousedown', (e) => {
    e.preventDefault();
    onPointerDown(e.clientX);
  });
  window.addEventListener('mousemove', (e) => onPointerMove(e.clientX));
  window.addEventListener('mouseup', (e) => onPointerUp(e.clientX));

  track.addEventListener('touchstart', (e) => onPointerDown(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove', (e) => onPointerMove(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', (e) => onPointerUp(e.changedTouches[0].clientX));
  window.addEventListener('resize', measure);
  measure();
});
