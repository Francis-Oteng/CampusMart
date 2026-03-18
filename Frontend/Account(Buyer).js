

var availDays = [
  { day:'Monday',    hours:'08:00 \u2013 19:00', closed:false },
  { day:'Tuesday',   hours:'08:00 \u2013 19:00', closed:false },
  { day:'Wednesday', hours:'08:00 \u2013 19:00', closed:false },
  { day:'Thursday',  hours:'08:00 \u2013 19:00', closed:false },
  { day:'Friday',    hours:'08:00 \u2013 20:00', closed:false },
  { day:'Saturday',  hours:'10:00 \u2013 15:00', closed:false },
  { day:'Sunday',    hours:'',                   closed:true  },
];

var recentOrders = [
  { id:'#ORD-008', product:'Watercolor Art Print',  amount:'\u20b5330', status:'completed',  date:'Mar 12' },
  { id:'#ORD-007', product:'Handmade Soap Set',      amount:'\u20b5260', status:'shipped',    date:'Mar 10' },
  { id:'#ORD-006', product:'Leather Bookmark Set',   amount:'\u20b5170', status:'completed',  date:'Mar 07' },
  { id:'#ORD-005', product:'Ceramic Mug',            amount:'\u20b5220', status:'processing', date:'Mar 05' },
];

document.addEventListener('DOMContentLoaded', function () {

  
  document.querySelectorAll('.tab-btn, [data-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = this.dataset.tab;
      if (!tab) return;

     
      document.querySelectorAll('.tab-btn, [data-tab]').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel, [id^="panel-"]').forEach(function (p) { p.classList.remove('active'); });

      this.classList.add('active');
      var panel = document.getElementById('panel-' + tab) || document.getElementById(tab);
      if (panel) panel.classList.add('active');
    });
  });

 
  function renderAvailability() {
    var tbody = document.getElementById('availBody');
    if (!tbody) return;
    var dayNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var todayName = dayNames[new Date().getDay()];
    tbody.innerHTML = availDays.map(function (d) {
      var isToday = d.day === todayName;
      return '<tr' + (isToday ? ' class="avail-row-today"' : '') + '>' +
        '<td>' + (isToday ? '<span class="avail-dot"></span>' : '') + d.day +
        (isToday ? ' <span style="font-size:.6875rem;color:var(--teal);font-weight:600;">(Today)</span>' : '') + '</td>' +
        '<td>' + (d.closed ? '<span class="avail-closed">Closed</span>' : d.hours) + '</td>' +
        '</tr>';
    }).join('');
  }

  
  function renderTodayHours() {
    var dayNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var shortNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var today      = new Date().getDay();
    var badge      = document.getElementById('todayBadge');
    var hoursEl    = document.getElementById('todayHours');
    if (badge)  badge.textContent = shortNames[today];
    var data = availDays.find(function (d) { return d.day === dayNames[today]; });
    if (hoursEl && data) hoursEl.textContent = data.closed ? 'Closed today' : data.hours;
  }

  
  function renderRecentOrders() {
    var tbody = document.getElementById('recentOrdersBody') || document.getElementById('ordersBody');
    if (!tbody) return;
    tbody.innerHTML = recentOrders.map(function (o) {
      var sc = { completed:'completed', shipped:'shipped', processing:'processing', pending:'pending' }[o.status] || 'pending';
      return '<tr>' +
        '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
        '<td>' + o.product + '</td>' +
        '<td style="font-weight:700;color:#0284C7;">' + o.amount + '</td>' +
        '<td style="color:var(--muted);">' + o.date + '</td>' +
        '<td><span class="status-pill ' + sc + '">' + o.status.charAt(0).toUpperCase() + o.status.slice(1) + '</span></td>' +
        '</tr>';
    }).join('');
  }

  
  var profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl  = document.getElementById('fullName');
      var emailEl = document.getElementById('email');
      var bioEl   = document.getElementById('bio');
      var campusEl = document.getElementById('campus');

      if (nameEl && !nameEl.value.trim()) {
        window.showToast('Please enter your full name.');
        if (nameEl.focus) nameEl.focus();
        return;
      }
      if (emailEl && !window.validateEmail(emailEl.value)) {
        window.showToast('Please enter a valid email address.');
        if (emailEl.focus) emailEl.focus();
        return;
      }

      
      var name = nameEl ? nameEl.value.trim() : '';
      var initials = name.split(' ').map(function (n) { return n[0]; }).join('').slice(0, 2).toUpperCase();
      var dispName = document.querySelector('.profile-name, #displayName');
      var dispInit = document.querySelector('.avatar-placeholder, #avatarInitials');
      if (dispName) dispName.textContent = name;
      if (dispInit) dispInit.textContent = initials;

     
      localStorage.setItem('cm_profile', JSON.stringify({
        name:   name,
        email:  emailEl   ? emailEl.value   : '',
        bio:    bioEl     ? bioEl.value     : '',
        campus: campusEl  ? campusEl.value  : '',
      }));

      window.showToast('Profile saved successfully!');
    });
  }

  
  function loadProfile() {
    var saved = localStorage.getItem('cm_profile');
    if (!saved) return;
    try {
      var data = JSON.parse(saved);
      var nameEl   = document.getElementById('fullName');
      var emailEl  = document.getElementById('email');
      var bioEl    = document.getElementById('bio');
      var campusEl = document.getElementById('campus');
      if (nameEl   && data.name)   nameEl.value   = data.name;
      if (emailEl  && data.email)  emailEl.value  = data.email;
      if (bioEl    && data.bio)    bioEl.value     = data.bio;
      if (campusEl && data.campus) campusEl.value  = data.campus;

     
      var dispName = document.querySelector('.profile-name, #displayName');
      var dispInit = document.querySelector('.avatar-placeholder, #avatarInitials');
      if (dispName && data.name) dispName.textContent = data.name;
      if (dispInit && data.name) {
        dispInit.textContent = data.name.split(' ').map(function (n) { return n[0]; }).join('').slice(0,2).toUpperCase();
      }
    } catch (e) { /* ignore parse errors */ }
  }

  window.resetForm = function () {
    var f = document.getElementById('profileForm');
    if (f) f.reset();
    window.showToast('Changes discarded.');
  };

  
  window.editAvailability = function () {
    window.showToast('Availability settings coming soon!');
  };

 
  document.querySelectorAll('.security-action').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row   = this.closest('.security-row, tr, li, div');
      var label = row ? (row.querySelector('.security-label, td, span') || {}).textContent : '';
      if (label.toLowerCase().includes('password')) {
        window.showToast('Password reset email sent! Check your inbox.');
      } else if (label.toLowerCase().includes('notification')) {
        window.showToast('Notification preferences updated.');
      } else {
        window.showToast('Setting updated.');
      }
    });
  });

  
  document.querySelectorAll('.btn-list, [href="seller.html"]').forEach(function (el) {
    if (el.tagName === 'BUTTON') {
      el.addEventListener('click', function () { window.location.href = 'seller.html'; });
    }
  });

 
  function renderWishlist() {
    var container = document.getElementById('wishlistContainer');
    if (!container) return;
    var list = JSON.parse(localStorage.getItem('cm_wishlist') || '[]');
    if (!list.length) {
      container.innerHTML = '<p style="color:var(--muted);font-size:.875rem;text-align:center;padding:2rem 0;">Your wishlist is empty. <a href="catalog.html" style="color:var(--teal);font-weight:600;">Browse products</a></p>';
      return;
    }
    container.innerHTML = list.map(function (name) {
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid var(--border);">' +
        '<span style="font-size:.875rem;font-weight:600;">' + window.sanitize(name) + '</span>' +
        '<button onclick="removeWishItem(\'' + window.sanitize(name) + '\')" style="font-size:.75rem;color:var(--red);background:none;border:none;cursor:pointer;font-family:var(--font-body);">Remove</button>' +
        '</div>';
    }).join('');
  }

  window.removeWishItem = function (name) {
    var list = JSON.parse(localStorage.getItem('cm_wishlist') || '[]');
    list = list.filter(function (n) { return n !== name; });
    localStorage.setItem('cm_wishlist', JSON.stringify(list));
    renderWishlist();
    window.showToast('"' + name + '" removed from wishlist.');
  };

  function updateOrdersBadge() {
    var badge = document.querySelector('.orders-count, [data-orders]');
    if (badge) badge.textContent = recentOrders.length;
  }


  loadProfile();
  renderTodayHours();
  renderAvailability();
  renderRecentOrders();
  renderWishlist();
  updateOrdersBadge();
});