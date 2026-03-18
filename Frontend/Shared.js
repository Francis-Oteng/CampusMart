/* ── shared.js — common functionality for every page ── */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Footer year ── */
  var yr = document.getElementById('current-year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── Mobile menu ── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuClose  = document.getElementById('menuClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    menuClose.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Sticky nav shadow on scroll ── */
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 4px 12px rgba(0,0,0,0.08)'
        : '0 1px 2px rgba(0,0,0,0.05)';
    });
  }

  /* ── Cart counter ── */
  var cartBadge = document.querySelector('.cart-badge');
  window.addToCart = function (btn) {
    if (cartBadge) cartBadge.textContent = String(parseInt(cartBadge.textContent) + 1);
    if (btn) {
      btn.textContent = 'Added!';
      btn.style.background = '#0D9488';
      setTimeout(function () {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
      }, 1500);
    }
  };

  /* ── Add to cart buttons ── */
  document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { window.addToCart(this); });
  });

  /* ── Wishlist toggle ── */
  document.querySelectorAll('.wishlist-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var svg    = this.querySelector('svg');
      var active = svg.getAttribute('fill') === '#14B8A6';
      svg.setAttribute('fill',   active ? 'none'         : '#14B8A6');
      svg.setAttribute('stroke', active ? 'currentColor' : '#14B8A6');
    });
  });

  /* ── Toast ── */
  var toastTimer;
  window.showToast = function (msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3000);
  };

  /* ── Scroll fade-up animations ── */
  var fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(function (el) {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

});