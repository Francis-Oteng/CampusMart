
var listings = [
  { id:1, name:'Handcrafted Ceramic Mug',    cat:'Art & Crafts',     price:220, stock:4, status:'active',  img:'assets/images/product-1.jpg' },
  { id:2, name:'Vintage Style Tote Bag',      cat:'Fashion',           price:285, stock:2, status:'active',  img:'assets/images/product-2.jpg' },
  { id:3, name:'Custom Illustrated Notebook', cat:'Stationery',        price:150, stock:8, status:'active',  img:'assets/images/product-3.jpg' },
  { id:4, name:'Macrame Wall Hanging',         cat:'Home Decor',        price:410, stock:1, status:'pending', img:'assets/images/product-4.jpg' },
  { id:5, name:'Watercolor Art Print',         cat:'Art & Crafts',      price:330, stock:0, status:'sold',    img:'assets/images/product-8.jpg' },
  { id:6, name:'Leather Bookmark Set',         cat:'Stationery',        price:170, stock:5, status:'active',  img:'assets/images/product-7.jpg' },
];

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

var editingId = null; 

document.addEventListener('DOMContentLoaded', function () {


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
     
      var btn = document.querySelector('#addListingForm button[type="submit"], #addListingForm .btn-submit');
      if (btn) btn.textContent = 'Update Listing';
      var heading = document.querySelector('#panel-add h2, #panel-add .section-title');
      if (heading) heading.textContent = 'Edit Listing';
    }, 80);
    window.showToast('Editing "' + l.name + '"');
  };

 
  window.deleteListing = function (id) {
    var l = listings.find(function (x) { return x.id === id; });
    if (!l) return;
    if (!confirm('Remove "' + l.name + '" from your listings? This cannot be undone.')) return;
    listings = listings.filter(function (x) { return x.id !== id; });
    renderListings();
    updateOverviewStats();
    window.showToast('"' + l.name + '" removed successfully.');
  };

  
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

      if (editingId) {
       
        var idx = listings.findIndex(function (l) { return l.id === editingId; });
        if (idx > -1) {
          listings[idx] = Object.assign(listings[idx], { name: name, cat: cat, price: price, stock: stock, description: desc });
          window.showToast('"' + name + '" updated!');
        }
        editingId = null;
      } else {
      
        var newId = listings.reduce(function (max, l) { return Math.max(max, l.id); }, 0) + 1;
        listings.push({ id: newId, name: name, cat: cat, price: price, stock: stock, status: 'pending', description: desc });
        window.showToast('"' + name + '" submitted for review!');
      }

      addForm.reset();
     
      var btn = addForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Submit Listing';
      var heading = document.querySelector('#panel-add h2, #panel-add .section-title');
      if (heading) heading.textContent = 'Add New Listing';

      window.switchTab('listings');
    });
  }

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

  updateOverviewStats();
  renderRecentOrders();
  renderTodayHours();
  renderRating();
});