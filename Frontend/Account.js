/* ─── account.js ─────────────────────────────────────────
   Logic:
   • Not signed in → show #guestView (two buttons to auth.html)
   • Signed in as buyer  → show #buyerDash + buyer tabs
   • Signed in as seller → show #sellerDash + seller tabs
   • Signed in as both   → show role-switch toggle + correct dash
   • Sign Out button → goes to signout.html (separate page)
   ───────────────────────────────────────────────────────── */

/* ══════════════════
   STATIC DATA
   ══════════════════ */

var AVAIL_DAYS = [
  { day:'Monday',    hours:'08:00 – 19:00', closed:false },
  { day:'Tuesday',   hours:'08:00 – 19:00', closed:false },
  { day:'Wednesday', hours:'08:00 – 19:00', closed:false },
  { day:'Thursday',  hours:'08:00 – 19:00', closed:false },
  { day:'Friday',    hours:'08:00 – 20:00', closed:false },
  { day:'Saturday',  hours:'10:00 – 15:00', closed:false },
  { day:'Sunday',    hours:'',              closed:true  },
];

var SELLER_ORDERS = [
  { id:'#ORD-014', buyer:'Kwame A.',  product:'Ceramic Mug',   amount:'₵220', status:'completed'  },
  { id:'#ORD-013', buyer:'Abena M.',  product:'Soap Set',      amount:'₵260', status:'shipped'    },
  { id:'#ORD-012', buyer:'Kofi B.',   product:'Tote Bag',      amount:'₵285', status:'processing' },
  { id:'#ORD-011', buyer:'Ama S.',    product:'Notebook',      amount:'₵150', status:'completed'  },
];

var BUYER_TABS = [
  { id:'profile',  label:'My Profile',  icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id:'orders',   label:'My Orders',   icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' },
  { id:'wishlist', label:'Saved Items', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' },
];

var SELLER_TABS = [
  { id:'profile',  label:'My Profile',  icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id:'listings', label:'My Listings', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' },
  { id:'orders',   label:'Orders In',   icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' },
];

/* ══════════════════
   HELPERS
   ══════════════════ */

function getUser()    { try { return JSON.parse(sessionStorage.getItem('cm_user') || 'null'); } catch(e) { return null; } }
function getProfile() { try { return JSON.parse(localStorage.getItem('cm_profile') || '{}'); } catch(e) { return {}; } }
function saveProfile(data) { var p = getProfile(); localStorage.setItem('cm_profile', JSON.stringify(Object.assign(p, data))); }
function getOrders()  { try { return JSON.parse(localStorage.getItem('cm_orders') || '[]'); } catch(e) { return []; } }
function txt(id, v)   { var e = document.getElementById(id); if(e) e.textContent = v; }
function val(id)      { return (document.getElementById(id)||{}).value || ''; }
function setVal(id,v) { var e = document.getElementById(id); if(e) e.value = v || ''; }
function hide(id)     { var e = document.getElementById(id); if(e) e.style.display = 'none'; }
function show(id, d)  { var e = document.getElementById(id); if(e) e.style.display = d || 'block'; }
function flashErr(id) { var e = document.getElementById(id); if(!e) return; e.style.borderColor='var(--red)'; setTimeout(function(){ e.style.borderColor=''; },2500); }

/* ══════════════════
   MAIN INIT
   ══════════════════ */

function init() {
  var user = getUser();

  /* Not signed in */
  if (!user || !user.loggedIn) {
    show('guestView');
    hide('loggedInView');
    return;
  }

  /* Signed in */
  hide('guestView');
  show('loggedInView');

  /* Update nav buttons: replace Sign In/Sign Up with Sign Out link */
  var si = document.getElementById('navSignin');
  var su = document.getElementById('navSignup');
  if(si){ si.textContent='Sign out'; si.href='signout.html'; }
  if(su) su.style.display='none';

  var role    = (getProfile().role || user.role || 'buyer').toLowerCase();
  var profile = getProfile();
  var name    = profile.name || user.name || 'My Account';
  var email   = profile.email || user.email || '';
  var initials= name.split(' ').filter(Boolean).map(function(n){return n[0];}).join('').slice(0,2).toUpperCase() || 'CM';

  /* Header */
  txt('displayName',    name);
  txt('displayEmail',   email);
  txt('avatarInitials', initials);
  txt('memberSince',    'Member since ' + (profile.joinDate || new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric'})));

  /* Role badge */
  var badge = document.getElementById('roleBadge');
  var roleTag = document.getElementById('roleTag');
  var labels = { buyer:'Buyer', seller:'Seller', both:'Buyer & Seller' };
  if(badge){ badge.textContent = labels[role]||role; badge.className = 'role-badge ' + (role==='both'?'both':role); }
  if(roleTag){ var sp = roleTag.querySelector('span'); if(sp) sp.textContent = labels[role]||role; }

  /* Stats */
  var orders   = getOrders();
  var wishlist = []; try{ wishlist = JSON.parse(localStorage.getItem('cm_wishlist')||'[]'); }catch(e){}
  var spent    = orders.reduce(function(s,o){ return s + (parseFloat(o.total)||0); }, 0);
  txt('statOrders', orders.length);
  txt('statSaved',  wishlist.length);
  txt('statSpent',  'GH₵' + Math.round(spent));

  /* Role switch (only for "both") */
  var rsBar = document.getElementById('roleSwitchBar');
  if(rsBar) rsBar.style.display = role === 'both' ? 'flex' : 'none';

  /* Render based on role */
  if (role === 'seller') {
    activateDash('seller');
  } else if (role === 'both') {
    activateDash('buyer'); /* default to buyer view */
  } else {
    activateDash('buyer');
  }

  /* Welcome toast from auth */
  if (document.referrer && document.referrer.includes('signin.html')) {
    window.showToast('Welcome' + (name ? ', ' + name.split(' ')[0] : '') + '! Your dashboard is ready.');
  }
}

/* ══════════════════
   DASH ACTIVATION
   ══════════════════ */

function activateDash(which) {
  hide('buyerDash');
  hide('sellerDash');

  /* Update role-switch buttons */
  var rb = document.getElementById('rsBuyer');
  var rs = document.getElementById('rsSeller');
  if(rb) rb.classList.toggle('active', which === 'buyer');
  if(rs) rs.classList.toggle('active', which === 'seller');

  if (which === 'buyer') {
    show('buyerDash');
    buildTabs('b', BUYER_TABS);
    loadBuyer();
    renderBuyerOrders();
    renderWishlist();
  } else {
    show('sellerDash');
    buildTabs('s', SELLER_TABS);
    loadSeller();
    renderAvailability();
    renderTodayHours();
    renderSellerOrders();
  }
}

window.switchView = function(which) { activateDash(which); };

/* ══════════════════
   TAB BUILDER
   ══════════════════ */

function buildTabs(prefix, tabs) {
  var container = document.getElementById('profileTabs');
  if (!container) return;
  container.innerHTML = tabs.map(function(t, i) {
    return '<button class="tab-btn' + (i===0?' active':'') + '" data-prefix="' + prefix + '" data-tab="' + t.id + '">' + t.icon + t.label + '</button>';
  }).join('');

  container.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      container.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      this.classList.add('active');
      var p = this.dataset.prefix;
      var t = this.dataset.tab;
      /* Hide all panels in this dash */
      document.querySelectorAll('#' + (p==='b'?'buyer':'seller') + 'Dash .tab-panel').forEach(function(el){ el.classList.remove('active'); });
      var panel = document.getElementById(p + '-tab-' + t);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ══════════════════
   BUYER PROFILE
   ══════════════════ */

window.loadBuyer = function() {
  var p = getProfile();
  setVal('bName',   p.name         || '');
  setVal('bEmail',  p.email        || '');
  setVal('bPhone',  p.phone        || '');
  setVal('bCampus', p.campus       || '');
  setVal('bBio',    p.bio          || '');
  setVal('bAddr',   p.deliveryAddr || '');
  setVal('bPay',    p.preferredPay || '');
  setVal('bNotify', p.notifyOrders || '');
  setVal('bFavCat', p.favCat       || '');
};

window.saveBuyer = function() {
  var name  = val('bName');
  var email = val('bEmail');
  if (!name.trim())                    { flashErr('bName');  window.showToast('Please enter your full name.'); return; }
  if (!window.validateEmail(email))    { flashErr('bEmail'); window.showToast('Please enter a valid email.'); return; }
  saveProfile({ name:name.trim(), email:email.trim(), phone:val('bPhone'), campus:val('bCampus'), bio:val('bBio'), deliveryAddr:val('bAddr'), preferredPay:val('bPay'), notifyOrders:val('bNotify'), favCat:val('bFavCat') });
  txt('displayName', name.trim());
  txt('avatarInitials', name.trim().split(' ').filter(Boolean).map(function(n){return n[0];}).join('').slice(0,2).toUpperCase());
  var user = getUser(); if(user){ user.name=name.trim(); user.email=email.trim(); sessionStorage.setItem('cm_user',JSON.stringify(user)); }
  window.showToast('Profile saved! ✓');
};

/* ══════════════════
   SELLER PROFILE
   ══════════════════ */

window.loadSeller = function() {
  var p = getProfile();
  setVal('sName',       p.name         || '');
  setVal('sEmail',      p.email        || '');
  setVal('sPhone',      p.phone        || '');
  setVal('sCampus',     p.campus       || '');
  setVal('sStoreName',  p.storeName    || '');
  setVal('sListCat',    p.listingCat   || '');
  setVal('sPayout',     p.payoutMethod || '');
  setVal('sPayoutNum',  p.payoutNumber || '');
  setVal('sStoreDesc',  p.storeDesc    || '');
};

window.saveSeller = function() {
  var name  = val('sName');
  var email = val('sEmail');
  if (!name.trim())                 { flashErr('sName');  window.showToast('Please enter your full name.'); return; }
  if (!window.validateEmail(email)) { flashErr('sEmail'); window.showToast('Please enter a valid email.'); return; }
  saveProfile({ name:name.trim(), email:email.trim(), phone:val('sPhone'), campus:val('sCampus'), storeName:val('sStoreName'), listingCat:val('sListCat'), payoutMethod:val('sPayout'), payoutNumber:val('sPayoutNum'), storeDesc:val('sStoreDesc') });
  txt('displayName', name.trim());
  txt('avatarInitials', name.trim().split(' ').filter(Boolean).map(function(n){return n[0];}).join('').slice(0,2).toUpperCase());
  var user = getUser(); if(user){ user.name=name.trim(); sessionStorage.setItem('cm_user',JSON.stringify(user)); }
  window.showToast('Seller profile saved! ✓');
};

/* ══════════════════
   UPGRADE BUYER → BOTH
   ══════════════════ */

window.upgradeToSeller = function() {
  var user = getUser();
  if (!user) return;
  user.role = 'both';
  sessionStorage.setItem('cm_user', JSON.stringify(user));
  saveProfile({ role: 'both' });
  window.showToast('Seller access activated! ✓');
  setTimeout(init, 600);
};

/* ══════════════════
   ORDERS
   ══════════════════ */

function renderBuyerOrders() {
  var tbody = document.getElementById('bOrdersBody');
  if (!tbody) return;
  var orders = getOrders().slice(0, 8);
  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2.5rem;">No orders yet. <a href="catalog.html" style="color:var(--teal);font-weight:600;">Start shopping →</a></td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(function(o) {
    var sc  = o.status || 'pending';
    var nm  = (o.items && o.items[0]) ? o.items[0].name : (o.product || 'Order');
    var more = (o.items && o.items.length > 1) ? ' <span style="font-size:.6875rem;color:var(--muted);">+' + (o.items.length-1) + '</span>' : '';
    return '<tr><td style="font-weight:700;color:var(--teal);">' + o.id + '</td><td>' + nm + more + '</td><td style="font-weight:700;color:#0284C7;">₵' + parseFloat(o.total||0).toFixed(2) + '</td><td style="color:var(--muted);">' + (o.date||'') + '</td><td><span class="status-pill ' + sc + '">' + sc.charAt(0).toUpperCase() + sc.slice(1) + '</span></td></tr>';
  }).join('');
}

function renderSellerOrders() {
  var tbody = document.getElementById('sOrdersBody');
  if (!tbody) return;
  tbody.innerHTML = SELLER_ORDERS.map(function(o) {
    return '<tr><td style="font-weight:700;color:var(--teal);">' + o.id + '</td><td>' + o.buyer + '</td><td>' + o.product + '</td><td style="font-weight:700;color:#0284C7;">' + o.amount + '</td><td><span class="status-pill ' + o.status + '">' + o.status.charAt(0).toUpperCase() + o.status.slice(1) + '</span></td></tr>';
  }).join('');
}

/* ══════════════════
   WISHLIST
   ══════════════════ */

function renderWishlist() {
  var container = document.getElementById('bWishlistBody');
  if (!container) return;
  var list = []; try { list = JSON.parse(localStorage.getItem('cm_wishlist')||'[]'); } catch(e){}
  if (!list.length) {
    container.innerHTML = '<div class="empty-inline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg><p>Nothing saved yet. <a href="catalog.html">Browse products</a> and tap the ♥ icon.</p></div>';
    return;
  }
  container.innerHTML = list.map(function(name) {
    return '<div class="wl-item"><span class="wl-name">' + window.sanitize(name) + '</span><button class="wl-remove" onclick="removeWish(\'' + window.sanitize(name).replace(/'/g,"\\'") + '\')">Remove</button></div>';
  }).join('');
}

window.removeWish = function(name) {
  var list = []; try { list = JSON.parse(localStorage.getItem('cm_wishlist')||'[]'); } catch(e){}
  list = list.filter(function(n){ return n !== name; });
  localStorage.setItem('cm_wishlist', JSON.stringify(list));
  renderWishlist();
  txt('statSaved', list.length);
  window.showToast('"' + name + '" removed.');
};

/* ══════════════════
   AVAILABILITY (seller only)
   ══════════════════ */

function renderAvailability() {
  var tbody = document.getElementById('availBody');
  if (!tbody) return;
  var days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var today = days[new Date().getDay()];
  tbody.innerHTML = AVAIL_DAYS.map(function(d) {
    var isToday = d.day === today;
    return '<tr' + (isToday ? ' class="avail-row-today"' : '') + '>' +
      '<td>' + (isToday ? '<span class="avail-dot"></span>' : '') + d.day + (isToday ? ' <span style="font-size:.6875rem;color:var(--teal);">(Today)</span>' : '') + '</td>' +
      '<td>' + (d.closed ? '<span class="avail-closed">Closed</span>' : d.hours) + '</td>' +
    '</tr>';
  }).join('');
}

function renderTodayHours() {
  var days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var short = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var today = new Date().getDay();
  var badge = document.getElementById('todayBadge');
  var hours = document.getElementById('todayHours');
  if(badge) badge.textContent = short[today];
  var d = AVAIL_DAYS.find(function(x){ return x.day === days[today]; });
  if(hours && d) hours.textContent = d.closed ? 'Closed today' : d.hours;
}

/* ══════════════════
   BOOT
   ══════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  init();
  document.querySelectorAll('.form-input, .form-select').forEach(function(el) {
    el.addEventListener('input', function(){ this.style.borderColor = ''; });
  });
});