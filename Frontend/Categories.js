

var allProducts = [
  { id:1,  name:'Handcrafted Ceramic Mug',      category:'Art & Crafts',      price:220,  seller:'Emma Wilson',     rating:4.8, reviews:12, badge:'New',  color:'#e2e8f0', img:'assets/images/product-1.jpg'  },
  { id:2,  name:'Vintage Style Tote Bag',        category:'Fashion',            price:285,  seller:'Marcus Chen',     rating:4.9, reviews:8,  badge:'New',  color:'#fde68a', img:'assets/images/product-2.jpg'  },
  { id:3,  name:'Custom Illustrated Notebook',   category:'Stationery',         price:150,  seller:'Sofia Rodriguez', rating:5.0, reviews:21, badge:'New',  color:'#ddd6fe', img:'assets/images/product-3.jpg'  },
  { id:4,  name:'Macrame Wall Hanging',           category:'Home Decor',         price:410,  seller:'Olivia Martinez', rating:4.7, reviews:5,  badge:'New',  color:'#d1fae5', img:'assets/images/product-4.jpg'  },
  { id:5,  name:'Wooden Phone Stand',             category:'Tech Accessories',   price:198,  seller:'James Anderson',  rating:4.6, reviews:3,  badge:'New',  color:'#fee2e2', img:'assets/images/product-5.jpg'  },
  { id:6,  name:'Handmade Soap Set',              category:'Beauty & Wellness',  price:260,  seller:'Ava Thompson',    rating:4.9, reviews:14, badge:'New',  color:'#fce7f3', img:'assets/images/product-6.jpg'  },
  { id:7,  name:'Leather Bookmark Set',           category:'Stationery',         price:170,  seller:'Liam Foster',     rating:4.8, reviews:9,  badge:'New',  color:'#fef3c7', img:'assets/images/product-7.jpg'  },
  { id:8,  name:'Watercolor Art Print',           category:'Art & Crafts',       price:330,  seller:'Isabella Clark',  rating:5.0, reviews:17, badge:'New',  color:'#ede9fe', img:'assets/images/product-8.jpg'  },
  { id:9,  name:'Crochet Plant Hanger',           category:'Home Decor',         price:145,  seller:'Mia Johnson',     rating:4.5, reviews:6,  badge:'New',  color:'#d1fae5', img:'assets/images/product-9.jpg'  },
  { id:10, name:'Hand-painted Tote Bag',          category:'Fashion',            price:310,  seller:'Noah Williams',   rating:4.7, reviews:11, badge:'New',  color:'#fde68a', img:'assets/images/product-10.jpg' },
  { id:11, name:'Embroidered Bookmark',           category:'Stationery',         price:90,   seller:'Ella Brown',      rating:4.6, reviews:4,  badge:'New',  color:'#fef3c7', img:'assets/images/product-11.jpg' },
  { id:12, name:'Scented Soy Candle',             category:'Beauty & Wellness',  price:185,  seller:'Lucas Davis',     rating:4.8, reviews:22, badge:'New',  color:'#fce7f3', img:'assets/images/product-12.jpg' },
  { id:13, name:'Resin Earrings Set',             category:'Fashion',            price:120,  seller:'Grace Osei',      rating:4.7, reviews:7,  badge:'New',  color:'#fde68a', img:'assets/images/product-13.jpg' },
  { id:14, name:'Linocut Art Print',              category:'Art & Crafts',       price:240,  seller:'Felix Mensah',    rating:4.9, reviews:3,  badge:'New',  color:'#ede9fe', img:'assets/images/product-14.jpg' },
  { id:15, name:'Phone Case with Dried Flowers',  category:'Tech Accessories',   price:160,  seller:'Amara Owusu',     rating:4.5, reviews:8,  badge:'New',  color:'#fee2e2', img:'assets/images/product-15.jpg' },
];

var filtered     = allProducts.slice();
var currentSort  = 'featured';
var currentPage  = 1;
var PER_PAGE     = 9;

document.addEventListener('DOMContentLoaded', function () {

  var params   = new URLSearchParams(window.location.search);
  var urlCat   = params.get('category') || '';
  var urlQ     = params.get('q') || '';
  var catEl    = document.getElementById('categoryFilter');
  var searchEl = document.getElementById('searchInput');
  if (urlCat && catEl) {
    catEl.value = urlCat;
  }
  if (urlQ && searchEl) {
    searchEl.value = urlQ;
  }

  function applyFilters() {
    var q   = searchEl ? (searchEl.value || '').toLowerCase().trim() : '';
    var cat = catEl    ? (catEl.value    || '') : '';
    var min = parseInt((document.getElementById('priceMin') || {}).value) || 0;
    var max = parseInt((document.getElementById('priceMax') || {}).value) || 999999;

    filtered = allProducts.filter(function (p) {
      return (
        (!q   || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q)) &&
        (!cat || p.category === cat) &&
        (p.price >= min && p.price <= max)
      );
    });

    if (currentSort === 'price-low')  filtered.sort(function (a, b) { return a.price - b.price; });
    if (currentSort === 'price-high') filtered.sort(function (a, b) { return b.price - a.price; });
    if (currentSort === 'rating')     filtered.sort(function (a, b) { return b.rating - a.rating; });
    if (currentSort === 'newest')     filtered.sort(function (a, b) { return b.id - a.id; });

    currentPage = 1;
    renderGrid();
  }

  function renderGrid() {
    var grid  = document.getElementById('catalogGrid');
    var empty = document.getElementById('emptyState');
    if (!grid) return;

    var start = (currentPage - 1) * PER_PAGE;
    var page  = filtered.slice(start, start + PER_PAGE);

    Array.from(grid.children).forEach(function (c) {
      if (!c.id || c.id !== 'emptyState') c.remove();
    });

    if (!filtered.length) {
      if (empty) empty.style.display = 'flex';
    } else {
      if (empty) empty.style.display = 'none';
      var html = page.map(function (p) {
        return window.renderProductCard(Object.assign({}, p, {
          price: '\u20b5' + p.price.toFixed(2)
        }));
      }).join('');
      grid.insertAdjacentHTML('beforeend', html);
      window.bindCards();
    }


    var rc = document.getElementById('resultCount');
    var tc = document.getElementById('totalCount');
    if (rc) rc.textContent = filtered.length;
    if (tc) tc.textContent = allProducts.length;

    renderPagination();
  }

  
  function renderPagination() {
    var pg    = document.getElementById('pagination');
    var total = Math.ceil(filtered.length / PER_PAGE);
    if (!pg) return;
    if (total <= 1) { pg.innerHTML = ''; return; }

    var arr = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">';
    var prev = arr + '<polyline points="15,18 9,12 15,6"/></svg>';
    var next = arr + '<polyline points="9,18 15,12 9,6"/></svg>';

    var html = '<button class="page-btn" onclick="goPage(' + (currentPage - 1) + ')" ' + (currentPage === 1 ? 'disabled' : '') + '>' + prev + '</button>';

    var start = Math.max(1, currentPage - 2);
    var end   = Math.min(total, start + 4);
    if (start > 1) html += '<button class="page-btn" onclick="goPage(1)">1</button>' + (start > 2 ? '<span style="padding:0 .25rem;color:var(--muted);">…</span>' : '');
    for (var i = start; i <= end; i++) {
      html += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" onclick="goPage(' + i + ')">' + i + '</button>';
    }
    if (end < total) html += (end < total - 1 ? '<span style="padding:0 .25rem;color:var(--muted);">…</span>' : '') + '<button class="page-btn" onclick="goPage(' + total + ')">' + total + '</button>';
    html += '<button class="page-btn" onclick="goPage(' + (currentPage + 1) + ')" ' + (currentPage === total ? 'disabled' : '') + '>' + next + '</button>';

    pg.innerHTML = html;
  }

  window.goPage = function (n) {
    var total = Math.ceil(filtered.length / PER_PAGE);
    if (n < 1 || n > total) return;
    currentPage = n;
    renderGrid();
    var grid = document.getElementById('catalogGrid');
    if (grid) window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };


  function validatePrices() {
    var minEl = document.getElementById('priceMin');
    var maxEl = document.getElementById('priceMax');
    if (!minEl || !maxEl) return;
    var min = parseInt(minEl.value) || 0;
    var max = parseInt(maxEl.value) || 999999;
    if (min > max) { var tmp = minEl.value; minEl.value = maxEl.value; maxEl.value = tmp; }
    applyFilters();
  }

  var applyBtn = document.getElementById('priceApply');
  if (applyBtn) applyBtn.addEventListener('click', validatePrices);
  ['priceMin', 'priceMax'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function (e) { if (e.key === 'Enter') validatePrices(); });
  });

  var searchTimer;
  if (searchEl) {
    searchEl.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(applyFilters, 300);
    });
  }

  
  if (catEl) catEl.addEventListener('change', applyFilters);

  
  document.querySelectorAll('.chip[data-sort]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip[data-sort]').forEach(function (c) { c.classList.remove('active'); });
      this.classList.add('active');
      currentSort = this.dataset.sort;
      applyFilters();
    });
  });

  applyFilters();
});