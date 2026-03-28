/* shared.js — common functionality for every page */
document.addEventListener('DOMContentLoaded', function () {

  /* 1. FOOTER YEAR */
  var yr = document.getElementById('current-year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* 2. MOBILE MENU */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuClose  = document.getElementById('menuClose');
  if (hamburger && mobileMenu && menuClose) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
    menuClose.addEventListener('click', closeMobile);
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMobile();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobile();
    });
  }
  function closeMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* 3. STICKY NAV SHADOW */
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 4px 12px rgba(0,0,0,0.08)'
        : '0 1px 2px rgba(0,0,0,0.05)';
    }, { passive: true });
  }

  /* 4. CART — persisted in sessionStorage */
  var cartBadge = document.querySelector('.cart-badge');
  var cartCount = parseInt(sessionStorage.getItem('cm_cart') || '0');
  if (cartBadge && cartCount > 0) cartBadge.textContent = String(cartCount);

  function updateCartBadge() {
    if (cartBadge) {
      cartBadge.textContent = String(cartCount);
      cartBadge.style.transform = 'scale(1.35)';
      setTimeout(function () { cartBadge.style.transform = 'scale(1)'; }, 200);
    }
    sessionStorage.setItem('cm_cart', String(cartCount));
  }

  window.addToCart = function (btn, productName) {
    cartCount++;
    updateCartBadge();
    if (btn) {
      var orig = btn.textContent;
      btn.textContent = 'Added!';
      btn.style.background = '#0D9488';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 1500);
    }
    window.showToast((productName ? '"' + productName + '" added to cart!' : 'Item added to cart!'));
  };

  /* 5. WISHLIST — persisted in localStorage */
  var wishlisted = JSON.parse(localStorage.getItem('cm_wishlist') || '[]');

  window.toggleWishlist = function (btn) {
    var svg      = btn.querySelector('svg');
    var card     = btn.closest('.product-card, .approval-card');
    var nameEl   = card ? card.querySelector('.product-name, .approval-name') : null;
    var name     = nameEl ? nameEl.textContent.trim() : '';
    var isActive = svg && svg.getAttribute('fill') === '#14B8A6';
    if (svg) {
      svg.setAttribute('fill',   isActive ? 'none'         : '#14B8A6');
      svg.setAttribute('stroke', isActive ? 'currentColor' : '#14B8A6');
    }
    if (isActive) {
      wishlisted = wishlisted.filter(function (n) { return n !== name; });
      window.showToast('Removed from wishlist.');
    } else {
      if (name && !wishlisted.includes(name)) wishlisted.push(name);
      window.showToast(name ? '"' + name + '" saved to wishlist!' : 'Saved to wishlist!');
    }
    localStorage.setItem('cm_wishlist', JSON.stringify(wishlisted));
  };

  /* 6. TOAST */
  var toastTimer;
  window.showToast = function (msg) {
    var toast    = document.getElementById('toast');
    var toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3500);
  };

  /* 7. SCROLL FADE-UP ANIMATIONS */
  var fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeEls.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    fadeEls.forEach(function (el) {
      el.style.animationPlayState = 'paused';
      obs.observe(el);
    });
  }

  /* 8. ACTIVE NAV LINK */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* 9. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* 10. SHARED UTILITIES */
  window.validateEmail  = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
  window.sanitize       = function (s) { return String(s).replace(/[<>&"']/g, function (c) { return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]; }); };
  window.formatCedis    = function (n) { return '\u20b5' + parseFloat(n).toFixed(2); };

  window.starsHTML = function (rating) {
    var full = Math.floor(rating);
    return Array.from({ length: 5 }, function (_, i) {
      var c = i < full ? '#FACC15' : '#E5E7EB';
      return '<svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:' + c + '"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>';
    }).join('');
  };

  window.renderProductCard = function (p) {
    var imgSrc = p.img || '';
    if (imgSrc.startsWith('/uploads/')) {
      imgSrc = 'http://localhost:5000' + imgSrc;
    }
    
    var img = imgSrc
      ? '<img src="' + imgSrc + '" alt="' + window.sanitize(p.name) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;">'
      : '<div class="product-img-placeholder" style="background:' + (p.color || '#F3F4F6') + ';"><span style="font-size:.65rem;color:#64748b;">' + window.sanitize(p.category) + '</span></div>';
    return (
      '<div class="product-card">' +
        '<div class="product-img-wrap">' + img +
          '<span class="product-badge">' + (p.badge || 'New') + '</span>' +
          '<button class="wishlist-btn" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></button>' +
        '</div>' +
        '<div class="product-info">' +
          '<p class="product-category">' + window.sanitize(p.category) + '</p>' +
          '<h3 class="product-name">' + window.sanitize(p.name) + '</h3>' +
          '<div class="product-stars"><div class="stars">' + window.starsHTML(p.rating) + '</div><span class="rating-txt">' + p.rating + ' (' + (p.reviews || 0) + ')</span></div>' +
          '<div class="product-footer"><div><div class="product-price">' + (p.price || '') + '</div><div class="product-seller">by ' + window.sanitize(p.seller) + '</div></div>' +
          '<button class="add-to-cart-btn">Add to Cart</button></div>' +
        '</div>' +
      '</div>'
    );
  };

  window.bindCards = function () {
    document.querySelectorAll('.add-to-cart-btn:not([data-bound])').forEach(function (btn) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', function () {
        var card = this.closest('.product-card');
        var name = card ? (card.querySelector('.product-name') || {}).textContent : '';
        window.addToCart(this, name);
      });
    });
    document.querySelectorAll('.wishlist-btn:not([data-bound])').forEach(function (btn) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', function () { window.toggleWishlist(this); });
    });
  };

  /* Bind any cards already in the DOM */
  window.bindCards();
});