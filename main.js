// Language management
function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyLang(lang);
}

function applyLang(lang) {
  const t = translations[lang];
  if (!t) return;

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Update active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active-lang'));
  const activeBtn = document.getElementById('btn-' + lang);
  if (activeBtn) activeBtn.classList.add('active-lang');

  // Update html lang attribute
  document.documentElement.lang = lang;
}

// On page load, apply saved language (default: ru)
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lang') || 'ru';
  applyLang(saved);
});
