// Cursor effect
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';

  // パーティクル生成
  if (Math.random() > 0.6) {
    const p = document.createElement('div');
    p.className = 'cursor-particle';
    p.style.left = mouseX + 'px';
    p.style.top = mouseY + 'px';
    p.style.opacity = '0.8';
    document.body.appendChild(p);
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 30 + 10;
    const duration = Math.random() * 600 + 400;
    p.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 0.8 },
      { transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`, opacity: 0 }
    ], { duration, easing: 'ease-out' }).onfinish = () => p.remove();
  }
});

// リングは遅延追従
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// ホバー時にリング拡大
document.querySelectorAll('a, button, .gallery-item, .exp-step').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width = '56px';
    cursorRing.style.height = '56px';
    cursorRing.style.borderColor = 'rgba(201,168,76,0.9)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width = '32px';
    cursorRing.style.height = '32px';
    cursorRing.style.borderColor = 'rgba(201,168,76,0.5)';
  });
});

// Loader
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

// Hero slideshow
const heroSlides = document.querySelectorAll('.hero-slide');
let heroIndex = 0;
setInterval(() => {
  heroSlides[heroIndex].classList.remove('active');
  heroIndex = (heroIndex + 1) % heroSlides.length;
  heroSlides[heroIndex].classList.add('active');
}, 3000);

// Nav toggle
const toggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  nav.classList.add('nav-open');
  document.body.style.overflow = 'hidden';
});

navClose.addEventListener('click', () => {
  nav.classList.remove('nav-open');
  document.body.style.overflow = '';
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('nav-open');
    document.body.style.overflow = '';
  });
});

// Nav scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// Parallax hero
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (heroImg) {
    const scrolled = window.scrollY;
    heroImg.style.transform = `translateY(${scrolled * 0.35}px)`;
  }
}, { passive: true });

// Scroll reveal using IntersectionObserver
const revealEls = document.querySelectorAll('.reveal, .reveal-left');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// Spec rows stagger reveal
const specRows = document.querySelectorAll('.spec-row');
const specObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      specObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

specRows.forEach(row => specObserver.observe(row));

// Lightbox — アルバム対応
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentPhotos = [];
let currentPhotoIndex = 0;

function openLightbox(item) {
  const photos = JSON.parse(item.dataset.photos || '[]');
  const caption = item.dataset.caption || '';
  currentPhotos = photos;
  currentPhotoIndex = 0;
  lightboxCaption.textContent = caption;
  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
  lightboxImg.src = currentPhotos[currentPhotoIndex];
  lightboxCounter.textContent = currentPhotos.length > 1
    ? `${currentPhotoIndex + 1} / ${currentPhotos.length}`
    : '';
  lightboxPrev.style.display = currentPhotos.length > 1 ? 'flex' : 'none';
  lightboxNext.style.display = currentPhotos.length > 1 ? 'flex' : 'none';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
  updateLightboxImage();
}

function showNext() {
  currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
  updateLightboxImage();
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// スワイプ対応
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
}, { passive: true });
