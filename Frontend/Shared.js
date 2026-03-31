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
      imgSrc = 'https://campusmart-jr8p.onrender.com' + imgSrc;
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

  /* 11. CART BUTTON — inject "Cart" label text for desktop visibility */
  var cartBtn = document.querySelector('.cart-btn');
  if (cartBtn && !cartBtn.querySelector('.cart-btn-label')) {
    var lbl = document.createElement('span');
    lbl.className = 'cart-btn-label';
    lbl.textContent = 'Cart';
    cartBtn.insertBefore(lbl, cartBtn.querySelector('.cart-badge'));
  }

  /* 13. MOBILE BOTTOM NAVIGATION */
  var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  function mbnActive(p) {
    if (p === 'index.html'      && (page === 'index.html' || page === '')) return true;
    if (p === 'categories.html' && (page === 'categories.html' || page === 'catalog.html')) return true;
    if (p === 'cart.html'       && page === 'cart.html') return true;
    if (p === 'account.html'    && (page === 'account.html' || page === 'buyerdashboard.html' || page === 'sellerdashboard.html')) return true;
    return false;
  }
  var mbn = document.createElement('nav');
  mbn.className = 'mbn';
  mbn.setAttribute('aria-label', 'Quick navigation');
  var cartC = parseInt(sessionStorage.getItem('cm_cart') || '0');
  mbn.innerHTML =
    '<div class="mbn-inner">' +
      '<a href="index.html" class="mbn-item' + (mbnActive('index.html') ? ' active' : '') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>' +
        '<span>Home</span>' +
      '</a>' +
      '<a href="Categories.html" class="mbn-item' + (mbnActive('categories.html') ? ' active' : '') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' +
        '<span>Shop</span>' +
      '</a>' +
      '<a href="cart.html" class="mbn-item' + (mbnActive('cart.html') ? ' active' : '') + '">' +
        '<div class="mbn-cart-wrap">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' +
          (cartC > 0 ? '<span class="mbn-cbadge" id="mbnBadge">' + cartC + '</span>' : '<span class="mbn-cbadge" id="mbnBadge" style="display:none">' + cartC + '</span>') +
        '</div>' +
        '<span>Cart</span>' +
      '</a>' +
      '<a href="account.html" class="mbn-item' + (mbnActive('account.html') ? ' active' : '') + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
        '<span>Account</span>' +
      '</a>' +
    '</div>';
  document.body.appendChild(mbn);

  /* Keep mobile nav cart badge in sync */
  var _origUpdate = window.addToCart;
  window.addToCart = function (btn, productName) {
    _origUpdate(btn, productName);
    var mb = document.getElementById('mbnBadge');
    if (mb) { mb.textContent = sessionStorage.getItem('cm_cart') || '0'; mb.style.display = ''; }
  };

  /* 14. FOOTER GUIDE STRIP */
  var footer = document.querySelector('footer');
  if (footer) {
    var guide = document.createElement('div');
    guide.className = 'footer-guide';
    var isLoggedIn = false;
    try { isLoggedIn = !!(JSON.parse(sessionStorage.getItem('cm_user') || 'null') || {}).loggedIn; } catch (e) {}
    var links = [
      { href: 'Categories.html', icon: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>', label: 'Browse Products' },
      { href: 'cart.html',       icon: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>', label: 'View Cart' },
      { href: isLoggedIn ? 'account.html' : 'Signin.html', icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>', label: isLoggedIn ? 'My Account' : 'Sign In' },
      { href: 'Help.html',       icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>', label: 'Help Center' }
    ];
    guide.innerHTML =
      '<div class="container footer-guide-inner">' +
        '<span class="footer-guide-lbl">Quick Links</span>' +
        '<div class="footer-guide-links">' +
          links.map(function (l) {
            return '<a href="' + l.href + '" class="fgl-link">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + l.icon + '</svg>' +
              l.label + '</a>';
          }).join('') +
        '</div>' +
      '</div>';
    footer.parentNode.insertBefore(guide, footer);
  }

});