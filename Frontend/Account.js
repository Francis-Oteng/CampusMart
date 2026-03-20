/* ─── account.js — Unified Buyer + Seller Account ─────── */

/* ══════════════════════════════════════
   DATA
   ══════════════════════════════════════ */

var availDays = [
  { day:'Monday',    hours:'08:00 – 19:00', closed:false },
  { day:'Tuesday',   hours:'08:00 – 19:00', closed:false },
  { day:'Wednesday', hours:'08:00 – 19:00', closed:false },
  { day:'Thursday',  hours:'08:00 – 19:00', closed:false },
  { day:'Friday',    hours:'08:00 – 20:00', closed:false },
  { day:'Saturday',  hours:'10:00 – 15:00', closed:false },
  { day:'Sunday',    hours:'',              closed:true  },
];

/* Seed with recent orders from checkout + some demo orders */
function getOrders() {
  var stored = [];
  try { stored = JSON.parse(localStorage.getItem('cm_orders') || '[]'); } catch(e){}
  if (stored.length) return stored;
  /* Demo orders if none exist */
  return [
    { id:'#ORD-008', items:[{name:'Watercolor Art Print'}], total:330, status:'completed',  date:'Mar 12', payment:'momo' },
    { id:'#ORD-007', items:[{name:'Handmade Soap Set'}],    total:260, status:'shipped',    date:'Mar 10', payment:'card' },
    { id:'#ORD-006', items:[{name:'Leather Bookmark Set'}], total:170, status:'completed',  date:'Mar 07', payment:'wallet' },
    { id:'#ORD-005', items:[{name:'Ceramic Mug'}],          total:220, status:'processing', date:'Mar 05', payment:'momo' },
  ];
}

/* ══════════════════════════════════════
   PROFILE  (localStorage key: cm_profile)
   Full schema:
   {
     name, email, phone, campus, bio,
     initials, role,
     deliveryAddr, preferredPay, notifyOrders, favCat,
     storeName, payoutMethod, payoutNumber, listingCat, storeDesc
   }
   ══════════════════════════════════════ */

var PROFILE_KEY = 'cm_profile';

function loadStoredProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  } catch(e) { return {}; }
}

function saveStoredProfile(data) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

/* Map: field id → profile key */
var FIELD_MAP = [
  /* Personal */
  { id:'fullName',      key:'name' },
  { id:'email',         key:'email' },
  { id:'phone',         key:'phone' },
  { id:'campus',        key:'campus' },
  { id:'bio',           key:'bio' },
  /* Buyer */
  { id:'deliveryAddr',  key:'deliveryAddr' },
  { id:'preferredPay',  key:'preferredPay' },
  { id:'notifyOrders',  key:'notifyOrders' },
  { id:'favCat',        key:'favCat' },
  /* Seller */
  { id:'storeName',     key:'storeName' },
  { id:'payoutMethod',  key:'payoutMethod' },
  { id:'payoutNumber',  key:'payoutNumber' },
  { id:'listingCat',    key:'listingCat' },
  { id:'storeDesc',     key:'storeDesc' },
];

function loadProfileIntoForm() {
  var data = loadStoredProfile();

  /* Also try pulling from session (set during sign-in/sign-up) */
  var session = {};
  try { session = JSON.parse(sessionStorage.getItem('cm_user') || '{}'); } catch(e){}

  /* Merge session into data (session wins for name/email) */
  if (session.name  && !data.name)   data.name   = session.name;
  if (session.email && !data.email)  data.email  = session.email;
  if (session.campus && !data.campus) data.campus = session.campus;

  /* Populate form fields */
  FIELD_MAP.forEach(function(m) {
    var el = document.getElementById(m.id);
    if (!el) return;
    var val = data[m.key];
    if (val !== undefined && val !== null && val !== '') {
      el.value = val;
    }
  });

  /* Update profile header display */
  updateProfileDisplay(data);
}

function updateProfileDisplay(data) {
  var name     = data.name || 'Your Name';
  var initials = name.split(' ').filter(Boolean).map(function(n){ return n[0]; }).join('').slice(0,2).toUpperCase() || 'CM';

  var dispName = document.querySelector('.profile-name, #displayName');
  var dispInit = document.querySelector('.avatar-placeholder, #avatarInitials');
  var dispEmail= document.querySelector('.profile-email, #displayEmail');

  if (dispName)  dispName.textContent  = name;
  if (dispInit)  dispInit.textContent  = initials;
  if (dispEmail && data.email) dispEmail.textContent = data.email;

  /* Update role badge if role changed */
  if (data.role) {
    var badge = document.querySelector('.badge-seller');
    if (badge) {
      var roleLabels = { buyer:'Buyer', seller:'Seller', both:'Buyer & Seller' };
      badge.textContent = roleLabels[data.role] || data.role;
    }
  }

  /* Update stat counts */
  var orders = getOrders();
  var ordersCount = document.querySelector('.pstat-val, [data-orders]');
  /* Only update the first stat (Orders) */
  var statVals = document.querySelectorAll('.pstat-val');
  if (statVals[0]) statVals[0].textContent = orders.length;

  /* Wishlist count */
  var wishlist = [];
  try { wishlist = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e){}
  if (statVals[1]) statVals[1].textContent = wishlist.length;

  /* Total spent */
  var spent = orders.reduce(function(s, o){ return s + (parseFloat(o.total)||0); }, 0);
  if (statVals[2]) {
    statVals[2].textContent = 'GH₵' + spent.toFixed(0);
  }
}

/* ── Save profile (called from onclick="saveProfile()") ── */
window.saveProfile = function() {
  /* Basic validation */
  var nameEl  = document.getElementById('fullName');
  var emailEl = document.getElementById('email');

  if (nameEl && !nameEl.value.trim()) {
    window.showToast('Please enter your full name.');
    nameEl.focus();
    nameEl.style.borderColor = 'var(--red)';
    setTimeout(function(){ nameEl.style.borderColor = ''; }, 2000);
    return;
  }
  if (emailEl && !window.validateEmail(emailEl.value.trim())) {
    window.showToast('Please enter a valid email address.');
    emailEl.focus();
    emailEl.style.borderColor = 'var(--red)';
    setTimeout(function(){ emailEl.style.borderColor = ''; }, 2000);
    return;
  }

  /* Collect all form values */
  var existing = loadStoredProfile();
  FIELD_MAP.forEach(function(m) {
    var el = document.getElementById(m.id);
    if (el) existing[m.key] = el.value.trim ? el.value.trim() : el.value;
  });

  /* Recompute initials */
  var name = existing.name || '';
  existing.initials = name.split(' ').filter(Boolean).map(function(n){ return n[0]; }).join('').slice(0,2).toUpperCase();

  saveStoredProfile(existing);
  updateProfileDisplay(existing);

  /* Sync session */
  try {
    var session = JSON.parse(sessionStorage.getItem('cm_user') || '{}');
    session.name  = existing.name;
    session.email = existing.email;
    sessionStorage.setItem('cm_user', JSON.stringify(session));
  } catch(e){}

  window.showToast('All changes saved successfully! ✓');
};

/* ── Reset form ── */
window.resetForm = function() {
  loadProfileIntoForm();
  window.showToast('Changes discarded.');
};

/* ══════════════════════════════════════
   AVAILABILITY TABLE
   ══════════════════════════════════════ */

function renderAvailability() {
  var tbody = document.getElementById('availBody');
  if (!tbody) return;
  var dayNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var todayName = dayNames[new Date().getDay()];

  tbody.innerHTML = availDays.map(function(d) {
    var isToday = d.day === todayName;
    return '<tr' + (isToday ? ' class="avail-row-today"' : '') + '>' +
      '<td>' + (isToday ? '<span class="avail-dot"></span>' : '') +
        d.day + (isToday ? ' <span style="font-size:.6875rem;color:var(--teal);font-weight:600;">(Today)</span>' : '') +
      '</td>' +
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
  if (badge)   badge.textContent   = shortNames[today];
  var d = availDays.find(function(x){ return x.day === dayNames[today]; });
  if (hoursEl && d) hoursEl.textContent = d.closed ? 'Closed today' : d.hours;
}

window.editAvailability = function() {
  window.showToast('Availability editor coming soon!');
};

/* ══════════════════════════════════════
   RECENT ORDERS  (from localStorage)
   ══════════════════════════════════════ */

function renderRecentOrders() {
  var tbody = document.getElementById('recentOrdersBody') || document.getElementById('ordersBody');
  if (!tbody) return;

  var orders = getOrders().slice(0, 5);
  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:1.5rem;">No orders yet. <a href="catalog.html" style="color:var(--teal);font-weight:600;">Start shopping</a></td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(function(o) {
    var statusMap = { completed:'completed', shipped:'shipped', processing:'processing', pending:'pending', cancelled:'cancelled' };
    var sc = statusMap[o.status] || 'pending';
    var productName = o.items && o.items[0] ? o.items[0].name : (o.product || 'Order');
    return '<tr>' +
      '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
      '<td>' + productName + (o.items && o.items.length > 1 ? ' <span style="font-size:.6875rem;color:var(--muted);">+' + (o.items.length-1) + ' more</span>' : '') + '</td>' +
      '<td style="font-weight:700;color:#0284C7;">₵' + (parseFloat(o.total)||0).toFixed(2) + '</td>' +
      '<td style="color:var(--muted);">' + (o.date || '') + '</td>' +
      '<td><span class="status-pill ' + sc + '">' + sc.charAt(0).toUpperCase() + sc.slice(1) + '</span></td>' +
    '</tr>';
  }).join('');
}

/* ══════════════════════════════════════
   WISHLIST
   ══════════════════════════════════════ */

function renderWishlist() {
  var container = document.getElementById('wishlistContainer');
  if (!container) return;
  var list = [];
  try { list = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e){}

  if (!list.length) {
    container.innerHTML = '<p style="color:var(--muted);font-size:.875rem;text-align:center;padding:2rem 0;">Your wishlist is empty. <a href="catalog.html" style="color:var(--teal);font-weight:600;">Browse products</a></p>';
    return;
  }
  container.innerHTML = list.map(function(name) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid var(--border);">' +
      '<span style="font-size:.875rem;font-weight:600;">' + window.sanitize(name) + '</span>' +
      '<button onclick="removeWishItem(\'' + window.sanitize(name).replace(/'/g,"\\'") + '\')" ' +
        'style="font-size:.75rem;color:var(--red);background:none;border:none;cursor:pointer;font-family:var(--font-body);">Remove</button>' +
    '</div>';
  }).join('');
}

window.removeWishItem = function(name) {
  var list = [];
  try { list = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e){}
  list = list.filter(function(n){ return n !== name; });
  localStorage.setItem('cm_wishlist', JSON.stringify(list));
  renderWishlist();
  /* Update stat */
  var statVals = document.querySelectorAll('.pstat-val');
  if (statVals[1]) statVals[1].textContent = list.length;
  window.showToast('"' + name + '" removed from wishlist.');
};

/* ══════════════════════════════════════
   TAB SWITCHING (Profile / Status)
   ══════════════════════════════════════ */

function initTabs() {
  document.querySelectorAll('.tab-btn[data-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tab = this.dataset.tab;

      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      this.classList.add('active');

      /* Show/hide panels — account uses id="tab-profile" / id="tab-status" style */
      var profilePanel = document.getElementById('tab-profile');
      var statusPanel  = document.getElementById('tab-status');

      if (tab === 'profile') {
        if (profilePanel) profilePanel.style.display = '';
        if (statusPanel)  statusPanel.style.display  = 'none';
      } else {
        if (profilePanel) profilePanel.style.display = 'none';
        if (statusPanel)  statusPanel.style.display  = '';
      }

      /* Generic panel-xxx approach */
      var panel = document.getElementById('panel-' + tab);
      if (panel) {
        document.querySelectorAll('[id^="panel-"]').forEach(function(p){ p.classList.remove('active'); });
        panel.classList.add('active');
      }
    });
  });
}

/* ══════════════════════════════════════
   SECURITY ACTIONS
   ══════════════════════════════════════ */

function initSecurityActions() {
  document.querySelectorAll('.security-action').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var row   = this.closest('.security-row');
      var label = row ? (row.querySelector('.security-label')||{}).textContent || '' : '';
      if (label.toLowerCase().includes('password')) {
        window.showToast('Password reset email sent! Check your inbox.');
      } else if (label.toLowerCase().includes('notif')) {
        window.showToast('Notification preferences updated.');
      } else {
        window.showToast('Setting updated.');
      }
    });
  });
}

/* ══════════════════════════════════════
   SELLER CARD BUTTON
   ══════════════════════════════════════ */

function initSellerCard() {
  document.querySelectorAll('.btn-list').forEach(function(btn) {
    btn.addEventListener('click', function() {
      window.location.href = 'seller.html';
    });
  });
}

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  loadProfileIntoForm();
  renderTodayHours();
  renderAvailability();
  renderRecentOrders();
  renderWishlist();
  initTabs();
  initSecurityActions();
  initSellerCard();

  /* Live border highlight on focus */
  document.querySelectorAll('.form-input, .form-select, textarea.form-input').forEach(function(el) {
    el.addEventListener('focus', function(){ this.style.borderColor = 'var(--teal)'; });
    el.addEventListener('blur',  function(){ this.style.borderColor = ''; });
  });

  /* If arrived from auth.html (just signed up), show welcome toast */
  var ref = document.referrer;
  if (ref && ref.includes('auth.html')) {
    var session = {};
    try { session = JSON.parse(sessionStorage.getItem('cm_user') || '{}'); } catch(e){}
    if (session.name) {
      window.showToast('Welcome, ' + session.name.split(' ')[0] + '! Your profile is ready.');
    }
  }
});