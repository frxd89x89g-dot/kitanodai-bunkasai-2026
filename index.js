document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Menu Navigation
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('is-active');
      document.body.classList.toggle('state-menu-open', !expanded);
    });

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
        document.body.classList.remove('state-menu-open');
      });
    });
  }

  // ==========================================
  // 2. Intersection Observer (Fade-in animations)
  // ==========================================
  const fadeSections = document.querySelectorAll('.fade-in-section');
  
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      root: null,
      threshold: 0.1, // Trigger when 10% is visible
      rootMargin: '0px 0px -50px 0px' // Slightly offset trigger
    });

    fadeSections.forEach(section => {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    fadeSections.forEach(section => {
      section.classList.add('is-visible');
    });
  }

  // ==========================================
  // 3. Hero Kitanon Delay Popup
  // ==========================================
  const heroKitanon = document.getElementById('heroKitanon');
  if (heroKitanon) {
    setTimeout(() => {
      heroKitanon.classList.add('is-active');
    }, 1200); // Appear after vertical texts animation completes
  }

  // ==========================================
  // 4. Dynamic Gallery Rendering & Lightbox Modal
  // ==========================================
  const GALLERY_IMAGES = [
    { url: 'assets/images/gallery/gallery_1.jpeg', category: '会場風景', alt: '展示会場内の様子。作品鑑賞と交流を楽しめる、あたたかな空間になりました。', size: '' },
    { url: 'assets/images/gallery/gallery_2.jpeg', category: '展示会場', alt: '展示会場内の様子。地域の方の作品が会場を彩りました。', size: '' },
    { url: 'assets/images/gallery/gallery_3.jpeg', category: 'ゲストアーティスト作品', alt: 'ゲストアーティストSaoriさんの作品展示。', size: '' },
    { url: 'assets/images/gallery/gallery_4.jpeg', category: 'ワークショップ', alt: 'ワークショップの様子。子どもたちが作品づくりを楽しみました。', size: '' },
    { url: 'assets/images/gallery/gallery_5.jpeg', category: 'きたのん塗り絵チャレンジ', alt: 'きたのん塗り絵チャレンジの展示。', size: '' },
    { url: 'assets/images/gallery/gallery_6.jpeg', category: 'ミニコンサート', alt: '地域の方によるミニコンサートの様子。', size: '' }
  ];

  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  let lastActiveElement = null;

  if (galleryGrid && lightbox && lightboxImg) {
    GALLERY_IMAGES.forEach(item => {
      const div = document.createElement('div');
      div.className = `gallery-item${item.size ? ' gallery-item-' + item.size : ''}`;
      div.setAttribute('data-image', item.url);
      div.setAttribute('tabindex', '0'); // Keyboard navigation support
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', `${item.category}の写真を拡大表示する`);

      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.alt;
      img.loading = 'lazy';
      // Layout shift mitigation dimensions
      img.setAttribute('width', '400');
      img.setAttribute('height', item.size === 'tall' ? '600' : '300');

      const hoverDiv = document.createElement('div');
      hoverDiv.className = 'gallery-item-hover';

      const tagSpan = document.createElement('span');
      tagSpan.className = 'gallery-tag';
      tagSpan.textContent = item.category;

      const actionSpan = document.createElement('span');
      actionSpan.className = 'gallery-action';
      actionSpan.textContent = '拡大する';

      hoverDiv.appendChild(tagSpan);
      hoverDiv.appendChild(actionSpan);
      div.appendChild(img);
      div.appendChild(hoverDiv);

      const openLightbox = () => {
        lastActiveElement = document.activeElement; // Record the element that triggered the modal
        lightboxImg.src = item.url;
        lightboxImg.alt = item.alt;
        lightboxCaption.textContent = item.alt;

        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Auto-focus to the close button inside modal for a11y
        setTimeout(() => {
          if (lightboxClose) {
            lightboxClose.focus();
          }
        }, 50);
      };

      // Lightbox click trigger
      div.addEventListener('click', openLightbox);

      // Lightbox keyboard enter/space trigger
      div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox();
        }
      });

      galleryGrid.appendChild(div);
    });

    const closeLightbox = () => {
      lightbox.classList.remove('is-active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Return focus to the element that triggered the modal
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard controls (Escape & Focus Trap)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      }

      // Focus Trap within Modal
      if (e.key === 'Tab') {
        const focusableElements = lightbox.querySelectorAll('button, [tabindex="0"]');
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    });
  }

  // ==========================================
  // 5. Highlights Carousel Dot Indicators (Mobile)
  // ==========================================
  const carousel = document.getElementById('carousel');
  const carouselDotsContainer = document.getElementById('carouselDots');
  const cards = document.querySelectorAll('.highlight-card');

  if (carousel && carouselDotsContainer && cards.length > 0) {
    // Generate dots dynamically based on cards count
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('is-active');
      carouselDotsContainer.appendChild(dot);
    });

    const dots = carouselDotsContainer.querySelectorAll('.dot');

    // Update active dot on scroll
    carousel.addEventListener('scroll', () => {
      const carouselWidth = carousel.clientWidth;
      const scrollLeft = carousel.scrollLeft;
      
      // Calculate current card index
      const activeIndex = Math.round(scrollLeft / carouselWidth);
      
      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    });
  }

});
