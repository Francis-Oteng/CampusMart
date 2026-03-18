/* ─── index.js — Homepage ─────────────────────────────── */

var featuredProducts = [
  { id:1, name:'Handcrafted Ceramic Mug',    category:'Art & Crafts',     price:'\u20b5220.00', seller:'Emma Wilson',     rating:4.8, reviews:12, badge:'Featured', color:'#e2e8f0', img:'assets/images/product-1.jpg' },
  { id:2, name:'Vintage Style Tote Bag',      category:'Fashion',           price:'\u20b5285.00', seller:'Marcus Chen',     rating:4.9, reviews:8,  badge:'Popular',  color:'#fde68a', img:'assets/images/product-2.jpg' },
  { id:3, name:'Custom Illustrated Notebook', category:'Stationery',        price:'\u20b5150.00', seller:'Sofia Rodriguez', rating:5.0, reviews:21, badge:'Top Rated',color:'#ddd6fe', img:'assets/images/product-3.jpg' },
  { id:4, name:'Macrame Wall Hanging',         category:'Home Decor',        price:'\u20b5410.00', seller:'Olivia Martinez', rating:4.7, reviews:5,  badge:'New',      color:'#d1fae5', img:'assets/images/product-4.jpg' },
];

var newArrivals = [
  { id:5, name:'Wooden Phone Stand',    category:'Tech Accessories',  price:'\u20b5198.00', seller:'James Anderson', rating:4.6, reviews:3,  badge:'New', color:'#fee2e2', img:'assets/images/product-5.jpg' },
  { id:6, name:'Handmade Soap Set',     category:'Beauty & Wellness', price:'\u20b5260.00', seller:'Ava Thompson',   rating:4.9, reviews:14, badge:'New', color:'#fce7f3', img:'assets/images/product-6.jpg' },
  { id:7, name:'Leather Bookmark Set',  category:'Stationery',        price:'\u20b5170.00', seller:'Liam Foster',    rating:4.8, reviews:9,  badge:'New', color:'#fef3c7', img:'assets/images/product-7.jpg' },
  { id:8, name:'Watercolor Art Print',  category:'Art & Crafts',      price:'\u20b5330.00', seller:'Isabella Clark', rating:5.0, reviews:17, badge:'New', color:'#ede9fe', img:'assets/images/product-8.jpg' },
];

document.addEventListener('DOMContentLoaded', function () {

  /* ── Render product grids ── */
  function renderGrid(id, products) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = products.map(function (p) { return window.renderProductCard(p); }).join('');
    window.bindCards();
  }
  renderGrid('featured-grid', featuredProducts);
  renderGrid('arrivals-grid', newArrivals);

  /* ── Newsletter ── */
  var nlForm = document.getElementById('newsletterForm') || document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = this.querySelector('input[type="email"]');
      var btn   = this.querySelector('button');
      if (!input || !window.validateEmail(input.value)) {
        window.showToast('Please enter a valid email address.');
        return;
      }
      var orig = btn.textContent;
      btn.textContent = 'Subscribed! \u2713';
      btn.style.background = '#0D9488';
      btn.disabled = true;
      input.value  = '';
      window.showToast('You\u2019re subscribed! Welcome to CampusMarket.');
      setTimeout(function () {
        btn.textContent = orig; btn.style.background = ''; btn.disabled = false;
      }, 4000);
    });
  }

  /* ── Category card clicks ── */
  document.querySelectorAll('.cat-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () { this.style.transform = 'translateY(-4px)'; });
    card.addEventListener('mouseleave', function () { this.style.transform = ''; });
    card.addEventListener('click', function () {
      var cat = this.dataset.category;
      if (!cat) {
        var h = this.querySelector('h3,h4,.cat-name,.cat-title');
        if (h) cat = h.textContent.trim();
      }
      if (cat) window.location.href = 'catalog.html?category=' + encodeURIComponent(cat);
    });
  });

  /* ── Stat counters ── */
  document.querySelectorAll('.stat-value, [data-count]').forEach(function (el) {
    var raw    = el.dataset.count ? el.dataset.count : el.textContent;
    var target = parseFloat(String(raw).replace(/[^\d.]/g, ''));
    var prefix = String(raw).match(/^[^\d]*/)[0];
    var suffix = String(raw).match(/[^\d.]*$/)[0];
    if (!target || target < 10) return;
    var current = 0; var step = target / 45;
    var timer = setInterval(function () {
      current = Math.min(current + step, target);
      el.textContent = prefix + (target % 1 === 0 ? Math.floor(current) : current.toFixed(1)) + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
  });

  /* ── Back-to-top button ── */
  var btt = document.createElement('button');
  btt.id = 'backToTop';
  btt.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18,15 12,9 6,15"/></svg>';
  btt.setAttribute('aria-label', 'Back to top');
  btt.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;width:44px;height:44px;border-radius:50%;background:var(--teal);color:#fff;border:none;cursor:pointer;display:grid;place-items:center;box-shadow:0 4px 12px rgba(20,184,166,.4);opacity:0;transform:translateY(12px);transition:opacity .3s,transform .3s;z-index:999;';
  document.body.appendChild(btt);
  window.addEventListener('scroll', function () {
    var show = window.scrollY > 400;
    btt.style.opacity   = show ? '1' : '0';
    btt.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
    btt.style.pointerEvents = show ? 'auto' : 'none';
  }, { passive: true });
  btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

});