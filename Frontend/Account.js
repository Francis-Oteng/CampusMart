/* ─── account.js — Unified Buyer + Seller Dashboard ─────────────────────────
   Single page. Three states:
     guestView    — not logged in: two buttons → auth.html
     buyerDash    — overview | orders | saved | profile
     sellerDash   — overview (chart) | listings | orders | add | profile
   Role switch bar lets users with "both" toggle between dashboards live.
   ──────────────────────────────────────────────────────────────────────────── */

/* ══════════════════════════════════════
   SAMPLE DATA
══════════════════════════════════════ */
var BUYER_ORDERS = (function () {
  try {
    var real = JSON.parse(localStorage.getItem('cm_orders') || '[]');
    if (real.length) return real.slice(0, 8).map(function (o) {
      return { id: o.id, product: (o.items && o.items[0]) ? o.items[0].name : 'Order',
               total: o.total || 0, date: o.date || '', status: o.status || 'pending' };
    });
  } catch (e) {}
  return [
    { id:'#ORD-008', product:'Watercolor Art Print',  total:330, date:'Mar 12', status:'completed'  },
    { id:'#ORD-007', product:'Handmade Soap Set',      total:260, date:'Mar 10', status:'shipped'    },
    { id:'#ORD-006', product:'Leather Bookmark Set',   total:170, date:'Mar 07', status:'completed'  },
    { id:'#ORD-005', product:'Ceramic Mug',            total:220, date:'Mar 05', status:'processing' },
  ];
}());

var SELLER_ORDERS = [
  { id:'#ORD-001', buyer:'Kwame A.',  ini:'KA', product:'Ceramic Mug',   amount:'GH₵220', date:'Mar 12', status:'completed'  },
  { id:'#ORD-002', buyer:'Abena M.',  ini:'AM', product:'Tote Bag',       amount:'GH₵285', date:'Mar 10', status:'shipped'    },
  { id:'#ORD-003', buyer:'Kofi B.',   ini:'KB', product:'Notebook',       amount:'GH₵150', date:'Mar 09', status:'completed'  },
  { id:'#ORD-004', buyer:'Ama S.',    ini:'AS', product:'Art Print',      amount:'GH₵330', date:'Mar 07', status:'processing' },
  { id:'#ORD-005', buyer:'Yaw D.',    ini:'YD', product:'Bookmark Set',   amount:'GH₵170', date:'Mar 05', status:'completed'  },
  { id:'#ORD-006', buyer:'Efua K.',   ini:'EK', product:'Ceramic Mug',    amount:'GH₵220', date:'Mar 03', status:'completed'  },
];

var LISTINGS = [
  { id:1, name:'Handcrafted Ceramic Mug',    cat:'Art & Crafts', price:220, stock:4, status:'active'  },
  { id:2, name:'Vintage Style Tote Bag',     cat:'Fashion',      price:285, stock:2, status:'active'  },
  { id:3, name:'Custom Illustrated Notebook',cat:'Stationery',   price:150, stock:8, status:'active'  },
  { id:4, name:'Macrame Wall Hanging',       cat:'Home Decor',   price:410, stock:1, status:'pending' },
  { id:5, name:'Watercolor Art Print',       cat:'Art & Crafts', price:330, stock:0, status:'sold'    },
  { id:6, name:'Leather Bookmark Set',       cat:'Stationery',   price:170, stock:5, status:'active'  },
];

var AVAIL = [
  { day:'Monday',   hours:'08:00 – 19:00', closed:false },
  { day:'Tuesday',  hours:'08:00 – 19:00', closed:false },
  { day:'Wednesday',hours:'08:00 – 19:00', closed:false },
  { day:'Thursday', hours:'08:00 – 19:00', closed:false },
  { day:'Friday',   hours:'08:00 – 20:00', closed:false },
  { day:'Saturday', hours:'10:00 – 15:00', closed:false },
  { day:'Sunday',   hours:'',              closed:true  },
];

var BUYER_TABS = [
  { id:'overview',  label:'Overview',    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { id:'orders',    label:'My Orders',   icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' },
  { id:'wishlist',  label:'Saved Items', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' },
  { id:'profile',   label:'My Profile',  icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
];

var SELLER_TABS = [
  { id:'overview',  label:'Overview',    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { id:'listings',  label:'My Listings', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' },
  { id:'orders',    label:'Orders In',   icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>', badge:true },
  { id:'add',       label:'Add Listing', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
  { id:'profile',   label:'Profile',     icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
];

var editId     = null;
var activeRole = 'buyer';
var chartInst  = null;

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function getUser()    { try { return JSON.parse(sessionStorage.getItem('cm_user') || 'null'); } catch (e) { return null; } }
function getProfile() { try { return JSON.parse(localStorage.getItem('cm_profile') || '{}'); } catch (e) { return {}; } }
function saveProfile(data) {
  var p = getProfile();
  localStorage.setItem('cm_profile', JSON.stringify(Object.assign(p, data)));
}
function txt(id, v)   { var e = document.getElementById(id); if (e) e.textContent = v; }
function val(id)      { return ((document.getElementById(id) || {}).value || '').trim(); }
function setVal(id,v) { var e = document.getElementById(id); if (e) e.value = v || ''; }
function show(id,d)   { var e = document.getElementById(id); if (e) e.style.display = d || 'block'; }
function hide(id)     { var e = document.getElementById(id); if (e) e.style.display = 'none'; }
function pill(s)      { return '<span class="pill ' + s + '">' + s.charAt(0).toUpperCase() + s.slice(1) + '</span>'; }
function fmt(n)       { return 'GH₵' + parseFloat(n || 0).toFixed(2); }
function buyerAvi(ini){ return '<div style="width:28px;height:28px;border-radius:50%;background:var(--teal-light);color:var(--teal);display:grid;place-items:center;font-size:.6875rem;font-weight:700;flex-shrink:0;">' + ini + '</div>'; }
function flashErr(id) {
  var e = document.getElementById(id); if (!e) return;
  e.style.borderColor = 'var(--red)';
  setTimeout(function () { e.style.borderColor = ''; }, 2500);
}

/* ══════════════════════════════════════
   MAIN INIT
══════════════════════════════════════ */
function init() {
  var user = getUser();

  /* ── NOT LOGGED IN ── */
  if (!user || !user.loggedIn) {
    show('guestView', 'flex');
    hide('accountView');
    return;
  }

  /* ── LOGGED IN ── */
  hide('guestView');
  show('accountView');
  updateNavForLogin();

  var profile = getProfile();
  var role    = (profile.role || user.role || 'buyer').toLowerCase();
  var name    = profile.name  || user.name  || 'My Account';
  var email   = profile.email || user.email || '';
  var initials = name.split(' ').filter(Boolean).map(function (n) { return n[0]; }).join('').slice(0, 2).toUpperCase() || 'CM';
  var joinDate = profile.joinDate || user.joinDate || new Date().toLocaleDateString('en-GB', { month:'long', year:'numeric' });

  /* Profile header */
  txt('avIni',       initials);
  txt('dispName',    name);
  txt('dispEmail',   email);
  txt('memberSince', 'Member since ' + joinDate);

  /* Role switch tabs — show always, but only the relevant one active */
  var rtBuyer  = document.getElementById('rtBuyer');
  var rtSeller = document.getElementById('rtSeller');

  /* If role is buyer-only, dim the seller tab but keep it clickable
     (they can upgrade by clicking it) */
  activeRole = (role === 'seller') ? 'seller' : 'buyer';
  applyRole(activeRole, name, email, initials, profile, role);
}

/* ── UPDATE NAV when logged in ── */
function updateNavForLogin() {
  var si = document.getElementById('navSignin');
  var su = document.getElementById('navSignup');
  var ms = document.getElementById('mobileSignin');
  var mu = document.getElementById('mobileSignup');
  if (si) { si.textContent = 'Sign Out'; si.href = 'signout.html'; }
  if (su) su.style.display = 'none';
  if (ms) { ms.textContent = 'Sign Out'; ms.href = 'signout.html'; }
  if (mu) mu.style.display = 'none';
}

/* ── SWITCH ROLE VIEW ── */
window.setRole = function (role) {
  activeRole = role;
  var user    = getUser() || {};
  var profile = getProfile();
  var name     = profile.name  || user.name  || 'My Account';
  var email    = profile.email || user.email || '';
  var initials = name.split(' ').filter(Boolean).map(function (n) { return n[0]; }).join('').slice(0, 2).toUpperCase() || 'CM';
  applyRole(role, name, email, initials, profile, profile.role || user.role || 'buyer');
};

function applyRole(role, name, email, initials, profile, rawRole) {
  /* Role switch button states */
  var rtBuyer  = document.getElementById('rtBuyer');
  var rtSeller = document.getElementById('rtSeller');
  if (rtBuyer)  rtBuyer.classList.toggle('active',  role === 'buyer');
  if (rtSeller) rtSeller.classList.toggle('active',  role === 'seller');

  /* Banner */
  var banner = document.getElementById('acctBanner');
  var label  = document.getElementById('bannerLabel');
  if (banner) { banner.className = 'banner banner-' + role; }
  if (label)  label.textContent = role === 'seller' ? 'Seller Dashboard' : 'Buyer Dashboard';

  /* Role chip */
  var chip = document.getElementById('roleChip');
  if (chip) {
    var labels = { buyer:'Buyer', seller:'Seller', both:'Buyer & Seller' };
    chip.textContent = labels[rawRole] || rawRole;
    chip.className   = 'role-chip chip-' + (rawRole === 'both' ? 'both' : role);
  }

  /* Stats */
  if (role === 'buyer') {
    var wishlist = []; try { wishlist = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e) {}
    var spent = BUYER_ORDERS.reduce(function (s, o) { return s + parseFloat(o.total || 0); }, 0);
    txt('statA',  BUYER_ORDERS.length); txt('statAL', 'Orders');
    txt('statB',  wishlist.length);     txt('statBL', 'Saved');
    txt('statC',  'GH₵' + Math.round(spent)); txt('statCL','Spent');
    hide('statDivD'); hide('statDBox');
  } else {
    var active = LISTINGS.filter(function (l) { return l.status === 'active'; }).length;
    txt('statA',  active);       txt('statAL', 'Listings');
    txt('statB',  SELLER_ORDERS.length); txt('statBL', 'Sales');
    txt('statC',  'GH₵2,840');   txt('statCL', 'Earned');
    show('statDivD'); show('statDBox');
  }

  /* Tabs */
  buildTabs(role === 'seller' ? SELLER_TABS : BUYER_TABS, role === 'seller' ? 's' : 'b');

  /* Panels */
  hide('buyerDash'); hide('sellerDash');
  if (role === 'seller') {
    show('sellerDash');
    loadSeller();
    renderSellerOverview();
    renderTodayHours();
    initChart();
  } else {
    show('buyerDash');
    loadBuyer();
    renderBuyerOverview();
  }
}

/* ══════════════════════════════════════
   TABS
══════════════════════════════════════ */
function buildTabs(tabs, prefix) {
  var container = document.getElementById('ptabs');
  if (!container) return;
  var pending = SELLER_ORDERS.filter(function (o) { return o.status === 'processing'; }).length;
  container.innerHTML = tabs.map(function (t, i) {
    var badge = (t.badge && pending > 0) ? '<span class="nbadge">' + pending + '</span>' : '';
    return '<button class="ptab' + (i === 0 ? ' active' : '') + '" data-prefix="' + prefix + '" data-id="' + t.id + '">' +
      t.icon + '<span>' + t.label + '</span>' + badge + '</button>';
  }).join('');
  container.querySelectorAll('.ptab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchTab(this.dataset.prefix, this.dataset.id, this);
    });
  });
}

window.switchTab = function (prefix, id, btnEl) {
  /* Update active tab button */
  var container = document.getElementById('ptabs');
  if (container) container.querySelectorAll('.ptab').forEach(function (b) { b.classList.remove('active'); });
  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    var found = document.querySelector('.ptab[data-prefix="' + prefix + '"][data-id="' + id + '"]');
    if (found) found.classList.add('active');
  }
  /* Hide all panels for this dash */
  var dash = (prefix === 's') ? 'sellerDash' : 'buyerDash';
  document.querySelectorAll('#' + dash + ' .tab-panel').forEach(function (p) { p.classList.remove('active'); });
  var panel = document.getElementById(prefix + '-' + id);
  if (panel) panel.classList.add('active');
  /* On-demand renders */
  if (prefix === 'b') {
    if (id === 'overview')  renderBuyerOverview();
    if (id === 'orders')    renderBuyerOrders();
    if (id === 'wishlist')  renderWishlist();
  } else {
    if (id === 'overview')  { renderSellerOverview(); initChart(); }
    if (id === 'listings')  renderListings();
    if (id === 'orders')    renderSellerOrders();
    if (id === 'profile')   { renderAvailability(); renderRating(); }
  }
};

/* ══════════════════════════════════════
   BUYER — OVERVIEW
══════════════════════════════════════ */
function renderBuyerOverview() {
  var wishlist = []; try { wishlist = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e) {}
  var spent = BUYER_ORDERS.reduce(function (s, o) { return s + parseFloat(o.total || 0); }, 0);
  txt('bOvOrders', BUYER_ORDERS.length);
  txt('bOvSaved',  wishlist.length);
  txt('bOvSpent',  'GH₵' + Math.round(spent));
  txt('bCtComp',   BUYER_ORDERS.filter(function (o) { return o.status === 'completed';  }).length);
  txt('bCtProc',   BUYER_ORDERS.filter(function (o) { return o.status === 'processing'; }).length);
  txt('bCtShip',   BUYER_ORDERS.filter(function (o) { return o.status === 'shipped';    }).length);

  /* Recent orders preview */
  var ob = document.getElementById('bOvOrdersBody'); if (!ob) return;
  ob.innerHTML = BUYER_ORDERS.slice(0, 3).map(function (o) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
      '<td>' + o.product + '</td>' +
      '<td style="font-weight:700;color:var(--blue);">' + fmt(o.total) + '</td>' +
      '<td style="color:var(--muted);">' + o.date + '</td>' +
      '<td>' + pill(o.status) + '</td>' +
    '</tr>';
  }).join('');

  /* Saved preview */
  var wc = document.getElementById('bOvWishBody'); if (!wc) return;
  if (!wishlist.length) {
    wc.innerHTML = '<p style="font-size:.875rem;color:var(--muted);">Nothing saved yet. <a href="catalog.html" style="color:var(--teal);font-weight:600;">Browse products</a></p>';
    return;
  }
  wc.innerHTML = wishlist.slice(0, 3).map(function (n) {
    return '<div class="wl-item"><div class="wl-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>' +
      '<span class="wl-name">' + window.sanitize(n) + '</span></div>';
  }).join('');
}

/* ══════════════════════════════════════
   BUYER — ALL ORDERS
══════════════════════════════════════ */
function renderBuyerOrders() {
  var tb = document.getElementById('bAllOrdersBody'); if (!tb) return;
  if (!BUYER_ORDERS.length) {
    tb.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2.5rem;">No orders yet. <a href="catalog.html" style="color:var(--teal);font-weight:600;">Start shopping →</a></td></tr>';
    return;
  }
  tb.innerHTML = BUYER_ORDERS.map(function (o) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
      '<td>' + o.product + '</td>' +
      '<td style="font-weight:700;color:var(--blue);">' + fmt(o.total) + '</td>' +
      '<td style="color:var(--muted);">' + o.date + '</td>' +
      '<td>' + pill(o.status) + '</td>' +
      '<td><button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="window.showToast(\'Viewing ' + o.id + '\')">View</button></td>' +
    '</tr>';
  }).join('');
}

/* ══════════════════════════════════════
   WISHLIST
══════════════════════════════════════ */
function renderWishlist() {
  var container = document.getElementById('bWishlistBody'); if (!container) return;
  var list = []; try { list = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch (e) {}
  if (!list.length) {
    container.innerHTML = '<div class="empty"><div class="empty-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div><h3>Nothing saved yet</h3><p>Tap the ♥ on any product to save it here.</p><a href="catalog.html">Browse Products</a></div>';
    return;
  }
  container.innerHTML = list.map(function (n) {
    return '<div class="wl-item">' +
      '<div class="wl-dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>' +
      '<span class="wl-name">' + window.sanitize(n) + '</span>' +
      '<button class="wl-rm" onclick="removeWish(\'' + window.sanitize(n).replace(/'/g, "\\'") + '\')">Remove</button>' +
    '</div>';
  }).join('');
}

window.removeWish = function (name) {
  var list = []; try { list = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch (e) {}
  list = list.filter(function (n) { return n !== name; });
  localStorage.setItem('cm_wishlist', JSON.stringify(list));
  renderWishlist();
  txt('statB', list.length);
  txt('bOvSaved', list.length);
  window.showToast('"' + name + '" removed.');
};

/* ══════════════════════════════════════
   BUYER — PROFILE
══════════════════════════════════════ */
window.loadBuyer = function () {
  var p = getProfile(), u = getUser() || {};
  setVal('bName',   p.name   || u.name  || '');
  setVal('bEmail',  p.email  || u.email || '');
  setVal('bPhone',  p.phone  || '');
  setVal('bCampus', p.campus || u.campus|| '');
  setVal('bBio',    p.bio    || '');
  setVal('bAddr',   p.deliveryAddr || '');
  setVal('bPay',    p.preferredPay || '');
  setVal('bNotify', p.notifyOrders || '');
  setVal('bFavCat', p.favCat || '');
};

window.saveBuyer = function () {
  var name = val('bName'), email = val('bEmail');
  if (!name)  { flashErr('bName');  window.showToast('Please enter your name.'); return; }
  if (!window.validateEmail(email)) { flashErr('bEmail'); window.showToast('Valid email required.'); return; }
  saveProfile({ name:name, email:email, phone:val('bPhone'), campus:val('bCampus'),
    bio:val('bBio'), deliveryAddr:val('bAddr'), preferredPay:val('bPay'),
    notifyOrders:val('bNotify'), favCat:val('bFavCat') });
  var ini = name.split(' ').filter(Boolean).map(function(n){return n[0];}).join('').slice(0,2).toUpperCase();
  txt('avIni', ini); txt('dispName', name);
  var u = getUser(); if (u) { u.name=name; u.email=email; sessionStorage.setItem('cm_user',JSON.stringify(u)); }
  window.showToast('Profile saved! ✓');
};

/* ══════════════════════════════════════
   SELLER — OVERVIEW
══════════════════════════════════════ */
function renderSellerOverview() {
  var active = LISTINGS.filter(function (l) { return l.status === 'active'; }).length;
  var pending = SELLER_ORDERS.filter(function (o) { return o.status === 'processing'; }).length;
  txt('ssc1', active);
  txt('ssc2', SELLER_ORDERS.filter(function (o) { return o.status === 'completed'; }).length);
  txt('sQPending', pending);
  txt('sQListings', active);

  var tb = document.getElementById('sRecentOrdersBody'); if (!tb) return;
  tb.innerHTML = SELLER_ORDERS.slice(0, 4).map(function (o) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:.5rem;">' + buyerAvi(o.ini) + window.sanitize(o.buyer) + '</div></td>' +
      '<td>' + window.sanitize(o.product) + '</td>' +
      '<td style="font-weight:700;color:var(--blue);">' + o.amount + '</td>' +
      '<td>' + pill(o.status) + '</td>' +
    '</tr>';
  }).join('');
}

/* ══════════════════════════════════════
   SELLER — CHART
══════════════════════════════════════ */
function initChart() {
  var canvas = document.getElementById('salesChart'); if (!canvas) return;
  if (chartInst) { try { chartInst.destroy(); } catch(e){} chartInst = null; }
  if (typeof Chart === 'undefined') {
    setTimeout(function () { if (typeof Chart !== 'undefined') initChart(); }, 1000);
    return;
  }
  chartInst = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [
        { label:'Revenue (GH₵)', data:[320,580,460,840,620,980],
          borderColor:'#14B8A6', backgroundColor:'rgba(20,184,166,.1)',
          borderWidth:2.5, pointBackgroundColor:'#14B8A6', pointBorderColor:'#fff',
          pointBorderWidth:2, pointRadius:5, fill:true, tension:0.4, yAxisID:'y' },
        { label:'Orders', data:[4,8,6,12,9,14],
          borderColor:'#0284C7', backgroundColor:'transparent',
          borderWidth:2, pointBackgroundColor:'#0284C7', pointBorderColor:'#fff',
          pointBorderWidth:2, pointRadius:4, fill:false, tension:0.4, yAxisID:'y1' }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ backgroundColor:'#0F172A', titleFont:{family:"'Plus Jakarta Sans',sans-serif",size:12},
          bodyFont:{family:"'Plus Jakarta Sans',sans-serif",size:12}, padding:10, cornerRadius:8 } },
      scales:{
        x:{ grid:{ color:'rgba(0,0,0,.04)' }, ticks:{ font:{family:"'Plus Jakarta Sans',sans-serif",size:11},color:'#6B7280' } },
        y:{ position:'left', grid:{ color:'rgba(0,0,0,.04)' },
            ticks:{ font:{family:"'Plus Jakarta Sans',sans-serif",size:11},color:'#14B8A6',callback:function(v){return 'GH₵'+v;} } },
        y1:{ position:'right', grid:{ drawOnChartArea:false },
             ticks:{ font:{family:"'Plus Jakarta Sans',sans-serif",size:11},color:'#0284C7' } }
      }
    }
  });
}

/* ══════════════════════════════════════
   SELLER — LISTINGS
══════════════════════════════════════ */
function renderListings() {
  var tb = document.getElementById('sListingsBody'); if (!tb) return;
  var active = LISTINGS.filter(function (l) { return l.status === 'active'; }).length;
  txt('sQListings', active); txt('ssc1', active);
  if (!LISTINGS.length) {
    tb.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">No listings. <button onclick="switchTab(\'s\',\'add\')" style="color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);">Add your first →</button></td></tr>';
    return;
  }
  tb.innerHTML = LISTINGS.map(function (l) {
    return '<tr>' +
      '<td><div style="display:flex;align-items:center;gap:.625rem;">' +
        '<div style="width:40px;height:40px;border-radius:8px;background:var(--light);display:grid;place-items:center;font-size:.55rem;color:var(--muted);flex-shrink:0;text-align:center;">IMG</div>' +
        '<div><div style="font-size:.8125rem;font-weight:600;color:var(--dark);">' + window.sanitize(l.name) + '</div><div style="font-size:.6875rem;color:var(--muted);">' + l.cat + '</div></div></div></td>' +
      '<td>' + l.cat + '</td>' +
      '<td style="font-weight:700;color:var(--blue);">GH₵' + l.price.toFixed(2) + '</td>' +
      '<td>' + (l.stock > 0 ? l.stock + ' left' : '<span style="color:var(--red);font-weight:600;">Out</span>') + '</td>' +
      '<td>' + pill(l.status) + '</td>' +
      '<td><div style="display:flex;gap:.375rem;">' +
        '<button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="editListing(' + l.id + ')">Edit</button>' +
        '<button style="font-size:.75rem;color:var(--red);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="deleteListing(' + l.id + ')">Delete</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

window.editListing = function (id) {
  var l = LISTINGS.find(function (x) { return x.id === id; }); if (!l) return;
  editId = id; switchTab('s', 'add');
  setTimeout(function () {
    setVal('lName', l.name); setVal('lCat', l.cat);
    setVal('lPrice', l.price); setVal('lStock', l.stock); setVal('lDesc', l.description || '');
    txt('addFormTitle', 'Edit Listing');
    var b = document.getElementById('lSubmitBtn'); if (b) b.textContent = 'Update Listing';
  }, 50);
  window.showToast('Editing "' + l.name + '"');
};

window.deleteListing = function (id) {
  var l = LISTINGS.find(function (x) { return x.id === id; }); if (!l) return;
  if (!confirm('Remove "' + l.name + '"? This cannot be undone.')) return;
  LISTINGS.splice(LISTINGS.indexOf(l), 1);
  renderListings(); window.showToast('"' + l.name + '" removed.');
};

window.resetAddForm = function () {
  var f = document.getElementById('addListingForm'); if (f) f.reset();
  txt('addFormTitle', 'Add New Listing');
  var b = document.getElementById('lSubmitBtn'); if (b) b.textContent = 'Submit Listing';
  var p = document.getElementById('imgPreview'); if (p) { p.src = ''; p.style.display = 'none'; }
  editId = null;
};

/* ══════════════════════════════════════
   SELLER — ALL ORDERS
══════════════════════════════════════ */
function renderSellerOrders() {
  var tb = document.getElementById('sAllOrdersBody'); if (!tb) return;
  var oc = document.getElementById('sOrdersCount'); if (oc) oc.textContent = SELLER_ORDERS.length + ' orders';
  var qp = document.getElementById('sQPending'); if (qp) qp.textContent = SELLER_ORDERS.filter(function(o){return o.status==='processing';}).length;
  tb.innerHTML = SELLER_ORDERS.map(function (o) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:.5rem;">' + buyerAvi(o.ini) + window.sanitize(o.buyer) + '</div></td>' +
      '<td>' + window.sanitize(o.product) + '</td>' +
      '<td style="font-weight:700;color:var(--blue);">' + o.amount + '</td>' +
      '<td style="color:var(--muted);">' + o.date + '</td>' +
      '<td>' + pill(o.status) + '</td>' +
      '<td><button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="window.showToast(\'Viewing ' + o.id + '\')">View</button></td>' +
    '</tr>';
  }).join('');
}

/* ══════════════════════════════════════
   SELLER — PROFILE
══════════════════════════════════════ */
window.loadSeller = function () {
  var p = getProfile(), u = getUser() || {};
  setVal('sName',       p.name         || u.name  || '');
  setVal('sEmail',      p.email        || u.email || '');
  setVal('sPhone',      p.phone        || '');
  setVal('sCampus',     p.campus       || u.campus || '');
  setVal('sStoreName',  p.storeName    || '');
  setVal('sListCat',    p.listingCat   || '');
  setVal('sPayout',     p.payoutMethod || '');
  setVal('sPayoutNum',  p.payoutNumber || '');
  setVal('sStoreDesc',  p.storeDesc    || '');
};

window.saveSeller = function () {
  var name = val('sName'), email = val('sEmail');
  if (!name)  { flashErr('sName');  window.showToast('Please enter your name.'); return; }
  if (!window.validateEmail(email)) { flashErr('sEmail'); window.showToast('Valid email required.'); return; }
  saveProfile({ name:name, email:email, phone:val('sPhone'), campus:val('sCampus'),
    storeName:val('sStoreName'), listingCat:val('sListCat'), payoutMethod:val('sPayout'),
    payoutNumber:val('sPayoutNum'), storeDesc:val('sStoreDesc') });
  var ini = name.split(' ').filter(Boolean).map(function(n){return n[0];}).join('').slice(0,2).toUpperCase();
  txt('avIni', ini); txt('dispName', name);
  var u = getUser(); if (u) { u.name=name; sessionStorage.setItem('cm_user',JSON.stringify(u)); }
  window.showToast('Seller profile saved! ✓');
};

/* ══════════════════════════════════════
   SELLER — AVAILABILITY
══════════════════════════════════════ */
function renderAvailability() {
  var tb = document.getElementById('sAvailBody'); if (!tb) return;
  var days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var today = days[new Date().getDay()];
  tb.innerHTML = AVAIL.map(function (d) {
    var it = d.day === today;
    return '<tr' + (it ? ' class="avail-today"' : '') + '>' +
      '<td>' + (it ? '<span class="avail-dot"></span>' : '') + d.day +
      (it ? ' <span style="font-size:.6875rem;color:var(--teal);">(Today)</span>' : '') + '</td>' +
      '<td>' + (d.closed ? '<span class="avail-closed">Closed</span>' : d.hours) + '</td>' +
    '</tr>';
  }).join('');
}

function renderTodayHours() {
  var days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var short = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var t = new Date().getDay();
  var b = document.getElementById('todayBadge'), h = document.getElementById('todayHours');
  if (b) b.textContent = short[t];
  var d = AVAIL.find(function (x) { return x.day === days[t]; });
  if (h && d) h.textContent = d.closed ? 'Closed today' : d.hours;
}

/* ══════════════════════════════════════
   SELLER — RATING
══════════════════════════════════════ */
function renderRating() {
  var bars  = [{ s:5, c:28 }, { s:4, c:5 }, { s:3, c:2 }, { s:2, c:1 }, { s:1, c:0 }];
  var total = bars.reduce(function (s, b) { return s + b.c; }, 0);
  var se = document.getElementById('sRatingStars'), be = document.getElementById('sRatingBars');
  if (se) se.innerHTML = Array.from({ length:5 }, function (_, i) {
    return '<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:' + (i < 4 ? '#FACC15' : '#E5E7EB') + '"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>';
  }).join('');
  if (be) be.innerHTML = bars.map(function (b) {
    var pct = Math.round(b.c / total * 100);
    return '<div class="rating-bar-row"><span class="rating-bar-lbl">' + b.s + '</span>' +
      '<div class="rating-bar-track"><div class="rating-bar-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="rating-bar-cnt">' + b.c + '</span></div>';
  }).join('');
}

/* ══════════════════════════════════════
   BOOT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  init();

  /* Add listing form */
  var addForm = document.getElementById('addListingForm');
  if (addForm) {
    addForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name  = val('lName'), cat = val('lCat');
      var price = parseFloat((document.getElementById('lPrice') || {}).value);
      var stock = parseInt((document.getElementById('lStock') || {}).value);
      var desc  = val('lDesc');
      if (!name)               { window.showToast('Please enter a product name.'); return; }
      if (!cat)                { window.showToast('Please select a category.'); return; }
      if (isNaN(price)||price<=0){ window.showToast('Please enter a valid price.'); return; }
      if (isNaN(stock)||stock<0) { window.showToast('Please enter a valid stock quantity.'); return; }
      if (editId) {
        var idx = LISTINGS.findIndex(function (l) { return l.id === editId; });
        if (idx > -1) LISTINGS[idx] = Object.assign(LISTINGS[idx], { name:name, cat:cat, price:price, stock:stock, description:desc });
        window.showToast('"' + name + '" updated!'); editId = null;
      } else {
        var nid = LISTINGS.reduce(function (m, l) { return Math.max(m, l.id); }, 0) + 1;
        LISTINGS.push({ id:nid, name:name, cat:cat, price:price, stock:stock, status:'pending', description:desc });
        window.showToast('"' + name + '" submitted for review!');
      }
      resetAddForm(); switchTab('s', 'listings');
    });
  }

  /* Image preview */
  var imgInp = document.getElementById('lImg');
  if (imgInp) {
    imgInp.addEventListener('change', function (e) {
      var file = e.target.files[0]; if (!file) return;
      var r = new FileReader();
      r.onload = function (ev) { var p = document.getElementById('imgPreview'); if (p) { p.src = ev.target.result; p.style.display = 'block'; } };
      r.readAsDataURL(file);
    });
  }

  /* Clear field errors on input */
  document.querySelectorAll('.fi,.fs').forEach(function (el) {
    el.addEventListener('input', function () { this.style.borderColor = ''; });
  });
});