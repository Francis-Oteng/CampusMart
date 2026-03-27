/* ─── seller.js — Seller Dashboard (API-integrated) ────────────────────── */

var listings = [
  { id:1, name:'Handcrafted Ceramic Mug',    cat:'Art & Crafts',     price:220, stock:4, status:'active',  img:'assets/images/product-1.jpg' },
  { id:2, name:'Vintage Style Tote Bag',      cat:'Fashion',           price:285, stock:2, status:'active',  img:'assets/images/product-2.jpg' },
  { id:3, name:'Custom Illustrated Notebook', cat:'Stationery',        price:150, stock:8, status:'active',  img:'assets/images/product-3.jpg' },
  { id:4, name:'Macrame Wall Hanging',         cat:'Home Decor',        price:410, stock:1, status:'pending', img:'assets/images/product-4.jpg' },
  { id:5, name:'Watercolor Art Print',         cat:'Art & Crafts',      price:330, stock:0, status:'sold',    img:'assets/images/product-8.jpg' },
  { id:6, name:'Leather Bookmark Set',         cat:'Stationery',        price:170, stock:5, status:'active',  img:'assets/images/product-7.jpg' },
];

/* ── Load real data from API ── */
function loadSellerDataFromAPI() {
  if (!window.api || !window.api.isLoggedIn()) return;

  window.api.getMyProducts()
    .then(function(data) {
      if (data.products && data.products.length > 0) {
        listings = data.products.map(function(p) {
          return {
            id: p._id, name: p.name, cat: p.category,
            price: p.price, stock: p.stock,
            status: p.status || 'pending', description: p.description || '',
            img: p.images && p.images.length ? p.images[0] : ''
          };
        });
        renderListings();
        updateOverviewStats();
      }
    })
    .catch(function() {});

  window.api.getSellerOrders()
    .then(function(data) {
      if (data.orders && data.orders.length > 0) {
        orders = data.orders.map(function(o) {
          var d = new Date(o.createdAt);
          var dateStr = d.toLocaleDateString('en-GB', { month:'short', day:'numeric' });
          var buyerName = o.buyer ? o.buyer.name : 'Unknown';
          var ini = buyerName.split(' ').filter(Boolean).map(function(n){return n[0];}).join('').slice(0,2).toUpperCase();
          return {
            id: '#' + o._id.slice(-6).toUpperCase(),
            buyer: buyerName, initials: ini,
            product: o.items && o.items[0] ? o.items[0].name : 'Order',
            amount: 'GH\u20b3' + (o.total || 0).toFixed(0),
            date: dateStr, status: o.status || 'processing'
          };
        });
        renderRecentOrders();
        renderAllOrders();
        updateOverviewStats();
      }
    })
    .catch(function() {});
}

var orders = [
  { id:'#ORD-001', buyer:'Kwame A.',  initials:'KA', product:'Ceramic Mug',    amount:'GH\u20b3220', date:'Mar 12', status:'completed'  },
  { id:'#ORD-002', buyer:'Abena M.',  initials:'AM', product:'Tote Bag',        amount:'GH\u20b3285', date:'Mar 10', status:'shipped'    },
  { id:'#ORD-003', buyer:'Kofi B.',   initials:'KB', product:'Notebook',        amount:'GH\u20b3150', date:'Mar 09', status:'completed'  },
  { id:'#ORD-004', buyer:'Ama S.',    initials:'AS', product:'Art Print',        amount:'GH\u20b3330', date:'Mar 07', status:'processing' },
  { id:'#ORD-005', buyer:'Yaw D.',    initials:'YD', product:'Bookmark Set',    amount:'GH\u20b3170', date:'Mar 05', status:'completed'  },
  { id:'#ORD-006', buyer:'Efua K.',   initials:'EK', product:'Ceramic Mug',     amount:'GH\u20b3220', date:'Mar 03', status:'completed'  },
];

var availDays = [
  { day:'Monday',    hours:'08:00 \u2013 19:00', closed:false },
  { day:'Tuesday',   hours:'08:00 \u2013 19:00', closed:false },
  { day:'Wednesday', hours:'08:00 \u2013 19:00', closed:false },
  { day:'Thursday',  hours:'08:00 \u2013 19:00', closed:false },
  { day:'Friday',    hours:'08:00 \u2013 20:00', closed:false },
  { day:'Saturday',  hours:'10:00 \u2013 15:00', closed:false },
  { day:'Sunday',    hours:'',                   closed:true  },
];

var editingId = null; /* tracks which listing is being edited */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Tab switching ── */
  window.switchTab = function (id) {
    document.querySelectorAll('.tab-btn, [data-tab]').forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-panel, [id^="panel-"]').forEach(function (p) { p.classList.remove('active'); });
    var btn   = document.querySelector('[data-tab="' + id + '"]');
    var panel = document.getElementById('panel-' + id);
    if (btn)   btn.classList.add('active');
    if (panel) panel.classList.add('active');

    if (id === 'overview')  { renderRecentOrders(); updateOverviewStats(); }
    if (id === 'listings')  renderListings();
    if (id === 'orders')    renderAllOrders();
    if (id === 'profile')   { renderTodayHours(); renderAvailability(); renderRating(); }
  };

  document.querySelectorAll('.tab-btn, [data-tab]').forEach(function (btn) {
    if (btn.dataset.tab) {
      btn.addEventListener('click', function () { window.switchTab(this.dataset.tab); });
    }
  });

  /* ── Overview stats ── */
  function updateOverviewStats() {
    var activeCount  = listings.filter(function (l) { return l.status === 'active'; }).length;
    var totalSales   = orders.filter(function (o) { return o.status === 'completed'; }).length;
    var totalRevenue = orders.filter(function (o) { return o.status === 'completed'; })
      .reduce(function (sum, o) { return sum + parseInt(o.amount.replace(/[^\d]/g, '')); }, 0);

    var statEls = {
      statListings: activeCount,
      statSales:    totalSales,
      statRevenue:  'GH\u20b3' + totalRevenue.toLocaleString(),
    };
    Object.keys(statEls).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = statEls[id];
    });
  }

  /* ── Recent orders (overview tab, max 3) ── */
  function renderRecentOrders() {
    var tbody = document.getElementById('recentOrdersBody');
    if (!tbody) return;
    tbody.innerHTML = orders.slice(0, 3).map(function (o) {
      var sc = { completed:'completed', processing:'processing', shipped:'shipped' }[o.status] || 'pending';
      return '<tr>' +
        '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
        '<td><div style="display:flex;align-items:center;gap:.5rem;"><div style="width:28px;height:28px;border-radius:50%;background:var(--teal-light);color:var(--teal);display:grid;place-items:center;font-size:.6875rem;font-weight:700;">' + o.initials + '</div>' + window.sanitize(o.buyer) + '</div></td>' +
        '<td>' + window.sanitize(o.product) + '</td>' +
        '<td style="font-weight:700;color:#0284C7;">' + o.amount + '</td>' +
        '<td><span class="order-status ' + sc + '">' + o.status.charAt(0).toUpperCase() + o.status.slice(1) + '</span></td>' +
        '</tr>';
    }).join('');
  }

  /* ── All orders (orders tab) ── */
  function renderAllOrders() {
    var tbody = document.getElementById('allOrdersBody');
    if (!tbody) return;
    tbody.innerHTML = orders.map(function (o) {
      var sc = { completed:'completed', processing:'processing', shipped:'shipped' }[o.status] || 'pending';
      return '<tr>' +
        '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
        '<td><div style="display:flex;align-items:center;gap:.5rem;"><div style="width:28px;height:28px;border-radius:50%;background:var(--teal-light);color:var(--teal);display:grid;place-items:center;font-size:.6875rem;font-weight:700;">' + o.initials + '</div>' + window.sanitize(o.buyer) + '</div></td>' +
        '<td>' + window.sanitize(o.product) + '</td>' +
        '<td style="font-weight:700;color:#0284C7;">' + o.amount + '</td>' +
        '<td style="color:var(--muted);">' + o.date + '</td>' +
        '<td><span class="order-status ' + sc + '">' + o.status.charAt(0).toUpperCase() + o.status.slice(1) + '</span></td>' +
        '<td><button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="window.showToast(\'Viewing order ' + o.id + '\')">View</button></td>' +
        '</tr>';
    }).join('');
  }

  /* ── Listings table ── */
  function renderListings() {
    var tbody = document.getElementById('listingsBody');
    if (!tbody) return;
    if (!listings.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">No listings yet. <button onclick="window.switchTab(\'add\')" style="color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);">Add your first listing</button></td></tr>';
      return;
    }
    tbody.innerHTML = listings.map(function (l) {
      var sc = { active:'active', pending:'pending', sold:'sold' }[l.status] || 'pending';
      return '<tr>' +
        '<td><div style="display:flex;align-items:center;gap:.625rem;"><div style="width:40px;height:40px;border-radius:8px;background:var(--light);flex-shrink:0;display:grid;place-items:center;font-size:.5rem;color:var(--muted);">IMG</div><div><div style="font-size:.8125rem;font-weight:600;color:var(--dark);">' + window.sanitize(l.name) + '</div><div style="font-size:.6875rem;color:var(--muted);">' + l.cat + '</div></div></div></td>' +
        '<td>' + l.cat + '</td>' +
        '<td style="font-weight:700;color:#0284C7;">GH\u20b3' + l.price.toFixed(2) + '</td>' +
        '<td>' + (l.stock > 0 ? l.stock + ' left' : '<span style="color:var(--red);font-weight:600;">Out</span>') + '</td>' +
        '<td><span class="status-pill ' + sc + '">' + l.status.charAt(0).toUpperCase() + l.status.slice(1) + '</span></td>' +
        '<td><div style="display:flex;gap:.375rem;">' +
          '<button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="editListing(' + l.id + ')">Edit</button>' +
          '<button style="font-size:.75rem;color:var(--red);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="deleteListing(' + l.id + ')">Delete</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
  }

  /* ── Edit listing ── */
  window.editListing = function (id) {
    var l = listings.find(function (x) { return x.id === id; });
    if (!l) return;
    editingId = id;
    window.switchTab('add');
    setTimeout(function () {
      var fields = {
        listingName: l.name, listingCategory: l.cat,
        listingPrice: l.price, listingStock: l.stock,
        listingDescription: l.description || '',
      };
      Object.keys(fields).forEach(function (fid) {
        var el = document.getElementById(fid);
        if (el) el.value = fields[fid];
      });
      /* Update submit button text */
      var btn = document.querySelector('#addListingForm button[type="submit"], #addListingForm .btn-submit');
      if (btn) btn.textContent = 'Update Listing';
      var heading = document.querySelector('#panel-add h2, #panel-add .section-title');
      if (heading) heading.textContent = 'Edit Listing';
    }, 80);
    window.showToast('Editing "' + l.name + '"');
  };

  /* ── Delete listing (with API) ── */
  window.deleteListing = function (id) {
    var l = listings.find(function (x) { return String(x.id) === String(id); });
    if (!l) return;
    if (!confirm('Remove "' + l.name + '" from your listings? This cannot be undone.')) return;

    if (window.api && window.api.isLoggedIn()) {
      window.api.deleteProduct(id)
        .then(function() {
          listings = listings.filter(function (x) { return String(x.id) !== String(id); });
          renderListings(); updateOverviewStats();
          window.showToast('"' + l.name + '" removed successfully.');
        })
        .catch(function() {
          listings = listings.filter(function (x) { return String(x.id) !== String(id); });
          renderListings(); updateOverviewStats();
          window.showToast('"' + l.name + '" removed locally.');
        });
    } else {
      listings = listings.filter(function (x) { return x.id !== id; });
      renderListings(); updateOverviewStats();
      window.showToast('"' + l.name + '" removed successfully.');
    }
  };

  /* ── Add / edit listing form (API-integrated) ── */
  var addForm = document.getElementById('addListingForm');
  if (addForm) {
    addForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name  = (document.getElementById('listingName')        || {}).value || '';
      var cat   = (document.getElementById('listingCategory')     || {}).value || '';
      var price = parseFloat((document.getElementById('listingPrice') || {}).value);
      var stock = parseInt((document.getElementById('listingStock')   || {}).value);
      var desc  = (document.getElementById('listingDescription') || {}).value || '';

      name = name.trim();
      if (!name) { window.showToast('Please enter a product name.'); return; }
      if (!cat)  { window.showToast('Please select a category.'); return; }
      if (isNaN(price) || price <= 0) { window.showToast('Please enter a valid price.'); return; }
      if (isNaN(stock) || stock < 0)  { window.showToast('Please enter a valid stock quantity.'); return; }

      /* Build FormData for API */
      var formData = new FormData();
      formData.append('name', name);
      formData.append('category', cat);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', desc);

      var imgInput = document.getElementById('listingImage') || document.querySelector('input[type="file"][accept*="image"]');
      if (imgInput && imgInput.files && imgInput.files.length > 0) {
        for (var fi = 0; fi < imgInput.files.length; fi++) {
          formData.append('images', imgInput.files[fi]);
        }
      }

      function resetForm() {
        addForm.reset();
        var btn = addForm.querySelector('button[type="submit"]');
        if (btn) btn.textContent = 'Submit Listing';
        var heading = document.querySelector('#panel-add h2, #panel-add .section-title');
        if (heading) heading.textContent = 'Add New Listing';
        window.switchTab('listings');
      }

      if (window.api && window.api.isLoggedIn()) {
        if (editingId) {
          window.api.updateProduct(editingId, formData)
            .then(function() {
              var idx = listings.findIndex(function (l) { return String(l.id) === String(editingId); });
              if (idx > -1) listings[idx] = Object.assign(listings[idx], { name:name, cat:cat, price:price, stock:stock, description:desc });
              window.showToast('"' + name + '" updated!');
              editingId = null; resetForm();
            })
            .catch(function() {
              var idx = listings.findIndex(function (l) { return String(l.id) === String(editingId); });
              if (idx > -1) listings[idx] = Object.assign(listings[idx], { name:name, cat:cat, price:price, stock:stock, description:desc });
              window.showToast('"' + name + '" updated locally.');
              editingId = null; resetForm();
            });
        } else {
          window.api.createProduct(formData)
            .then(function(product) {
              listings.push({ id: product._id, name:name, cat:cat, price:price, stock:stock, status:'pending', description:desc });
              window.showToast('"' + name + '" submitted for review!');
              resetForm();
            })
            .catch(function() {
              var newId = listings.reduce(function (max, l) { return Math.max(max, typeof l.id === 'number' ? l.id : 0); }, 0) + 1;
              listings.push({ id: newId, name:name, cat:cat, price:price, stock:stock, status:'pending', description:desc });
              window.showToast('"' + name + '" saved locally.');
              resetForm();
            });
        }
      } else {
        if (editingId) {
          var idx = listings.findIndex(function (l) { return l.id === editingId; });
          if (idx > -1) listings[idx] = Object.assign(listings[idx], { name:name, cat:cat, price:price, stock:stock, description:desc });
          window.showToast('"' + name + '" updated!');
          editingId = null;
        } else {
          var newId = listings.reduce(function (max, l) { return Math.max(max, l.id); }, 0) + 1;
          listings.push({ id: newId, name:name, cat:cat, price:price, stock:stock, status:'pending', description:desc });
          window.showToast('"' + name + '" submitted for review!');
        }
        resetForm();
      }
    });
  }

  /* ── Image preview for listing form ── */
  var imgInput = document.getElementById('listingImage') || document.querySelector('input[type="file"][accept*="image"]');
  if (imgInput) {
    imgInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var preview = document.getElementById('imagePreview');
        if (preview) {
          preview.src = ev.target.result;
          preview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /* ── Profile form ── */
  var profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = document.getElementById('fullName');
      var emailEl = document.getElementById('email');
      if (nameEl && !nameEl.value.trim()) { window.showToast('Full name is required.'); return; }
      if (emailEl && !window.validateEmail(emailEl.value)) { window.showToast('Please enter a valid email.'); return; }
      var name = nameEl ? nameEl.value.trim() : '';
      var initials = name.split(' ').map(function (n) { return n[0]; }).join('').slice(0,2).toUpperCase();
      var dispName = document.getElementById('displayName') || document.querySelector('.profile-name');
      var dispInit = document.getElementById('avatarInitials') || document.querySelector('.avatar-placeholder');
      if (dispName) dispName.textContent = name;
      if (dispInit) dispInit.textContent = initials;
      localStorage.setItem('cm_seller_profile', JSON.stringify({ name: name, email: emailEl ? emailEl.value : '' }));
      window.showToast('Profile saved!');
    });
  }
  window.resetForm = function () {
    var f = document.getElementById('profileForm');
    if (f) f.reset();
    window.showToast('Changes discarded.');
  };

  /* ── Availability ── */
  function renderAvailability() {
    var tbody = document.getElementById('availBody');
    if (!tbody) return;
    var dayNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var todayName = dayNames[new Date().getDay()];
    tbody.innerHTML = availDays.map(function (d) {
      var isToday = d.day === todayName;
      return '<tr' + (isToday ? ' class="avail-row-today"' : '') + '>' +
        '<td>' + (isToday ? '<span class="avail-dot"></span>' : '') + d.day +
        (isToday ? ' <span style="font-size:.6875rem;color:var(--teal);">(Today)</span>' : '') + '</td>' +
        '<td>' + (d.closed ? '<span class="avail-closed">Closed</span>' : d.hours) + '</td>' +
        '</tr>';
    }).join('');
  }

  function renderTodayHours() {
    var dayNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var shortNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var today      = new Date().getDay();
    var badge   = document.getElementById('todayBadge');
    var hoursEl = document.getElementById('todayHours');
    if (badge)   badge.textContent = shortNames[today];
    var d = availDays.find(function (x) { return x.day === dayNames[today]; });
    if (hoursEl && d) hoursEl.textContent = d.closed ? 'Closed today' : d.hours;
  }

  /* ── Rating bars ── */
  function renderRating() {
    var starsEl = document.getElementById('ratingStars');
    var barsEl  = document.getElementById('ratingBars');
    var rating  = 4.9;
    var bars    = [{s:5,c:28},{s:4,c:5},{s:3,c:2},{s:2,c:1},{s:1,c:0}];
    var total   = bars.reduce(function (sum, b) { return sum + b.c; }, 0);

    if (starsEl) {
      starsEl.innerHTML = Array.from({length:5}, function (_, i) {
        return '<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:' + (i < Math.floor(rating) ? '#FACC15' : '#E5E7EB') + '"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>';
      }).join('');
    }
    if (barsEl) {
      barsEl.innerHTML = bars.map(function (b) {
        var pct = Math.round((b.c / total) * 100);
        return '<div class="rating-bar-row"><span class="rating-bar-label">' + b.s + '</span>' +
          '<div class="rating-bar-track"><div class="rating-bar-fill" style="width:' + pct + '%"></div></div>' +
          '<span class="rating-bar-count">' + b.c + '</span></div>';
      }).join('');
    }
  }

  /* ── Security buttons ── */
  document.querySelectorAll('.security-action').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var txt = (this.textContent || '').trim().toLowerCase();
      if (txt.includes('change') || txt.includes('password')) {
        window.showToast('Password reset email sent! Check your inbox.');
      } else {
        window.showToast('Setting updated.');
      }
    });
  });

  /* ── INIT ── */
  updateOverviewStats();
  renderRecentOrders();
  renderTodayHours();
  renderRating();

  /* Load real data from API */
  loadSellerDataFromAPI();
});