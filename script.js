document.getElementById('copyright').textContent =
  '© ' + new Date().getFullYear() + ' Perrin Linasy. Tous droits réservés.';

// Header au scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Menu mobile
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('mobile-open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
mainNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mainNav.classList.remove('mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal au scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// FAQ — accessible
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.getAttribute('data-open') === 'true';
    item.setAttribute('data-open', isOpen ? 'false' : 'true');
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });
});

// ===== Offres : dossier de fiches =====
const dossier = document.getElementById('dossier');
const fiches = Array.from(dossier.querySelectorAll('.fiche'));

function openFiche(fiche) {
  fiches.forEach(f => {
    const face = f.querySelector('.fiche-face');
    if (f === fiche) {
      f.classList.add('is-open');
      f.classList.remove('is-dimmed');
      face.setAttribute('aria-expanded', 'true');
    } else {
      f.classList.remove('is-open');
      f.classList.add('is-dimmed');
      f.querySelector('.fiche-face').setAttribute('aria-expanded', 'false');
    }
  });
  dossier.classList.add('has-open');
  // amène la fiche ouverte en tête visuellement dans le flux
  dossier.prepend(fiche);
  // remet l'ordre naturel des cartes dimmées par référence
  const others = fiches.filter(f => f !== fiche).sort((a, b) => a.dataset.ref.localeCompare(b.dataset.ref));
  others.forEach(f => dossier.appendChild(f));
}

function closeFiches() {
  fiches.forEach(f => {
    f.classList.remove('is-open', 'is-dimmed');
    f.querySelector('.fiche-face').setAttribute('aria-expanded', 'false');
  });
  dossier.classList.remove('has-open');
  // restaure l'ordre d'origine par référence
  fiches.sort((a, b) => a.dataset.ref.localeCompare(b.dataset.ref)).forEach(f => dossier.appendChild(f));
}

fiches.forEach(fiche => {
  const face = fiche.querySelector('.fiche-face');
  const closeBtn = fiche.querySelector('.fiche-fermer');

  face.addEventListener('click', () => {
    const isOpen = fiche.classList.contains('is-open');
    if (isOpen) {
      closeFiches();
    } else {
      openFiche(fiche);
      fiche.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeFiches();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFiches();
});
