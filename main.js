// Language management
function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyLang(lang);
}

function applyLang(lang) {
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active-lang'));
  const activeBtn = document.getElementById('btn-' + lang);
  if (activeBtn) activeBtn.classList.add('active-lang');

  document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lang') || 'ru';
  applyLang(saved);
  initSlider();
  initNavbar();
});

// Navbar: прозрачный на hero, белый после скролла
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const hasHero = document.querySelector('.hero, .plants-hero, .animals-hero, .parkinfo-hero, .news-hero, .contact-hero, .page-hero, .gallery-hero');

  if (hasHero) {
    // Есть hero — навбар прозрачный сверху, белый после скролла
    const updateNav = () => {
      if (window.scrollY > 10) {
        navbar.classList.remove('hero-nav');
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.add('hero-nav');
        navbar.classList.remove('scrolled');
      }
    };
    updateNav();
    window.addEventListener('scroll', updateNav);
  } else {
    // Нет hero — навбар сразу белый
    navbar.classList.add('scrolled');
  }
}

// ===== 3D SLIDER =====
let currentSlide = 0;
let slides = [];
let autoSlideTimer = null;

function initSlider() {
  slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  const dotsContainer = document.getElementById('sliderDots');
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    });
  }

  startAutoSlide();
}

function goToSlide(index) {
  const prev = currentSlide;
  slides[prev].classList.remove('active');
  slides[prev].classList.add('prev-slide');

  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.remove('prev-slide', 'next-enter');
  slides[currentSlide].classList.add('active');

  // Remove prev-slide class after animation
  setTimeout(() => {
    slides[prev].classList.remove('prev-slide');
  }, 1400);

  // Update dots
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function changeSlide(direction) {
  resetAutoSlide();
  goToSlide(currentSlide + direction);
}

function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

// Touch/swipe support
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
document.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    resetAutoSlide();
    goToSlide(currentSlide + (diff > 0 ? 1 : -1));
  }
});
