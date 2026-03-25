/* ─── account.js ─────────────────────────────────────────
   Powers account.html with three distinct states:
   • Guest view  → simple redirect buttons to auth.html
   • Buyer dash  → profile, orders, wishlist (no listings/hours)
   • Seller dash → overview, listings, add-listing, orders, profile+hours
   Role read from sessionStorage cm_user.role
   ───────────────────────────────────────────────────────── */

/* ══ STATIC DATA ══════════════════════════════════════════ */

var AVAIL_DAYS = [
  { day:'Monday',    hours:'08:00 – 19:00', closed:false },
  { day:'Tuesday',   hours:'08:00 – 19:00', closed:false },
  { day:'Wednesday', hours:'08:00 – 19:00', closed:false },
  { day:'Thursday',  hours:'08:00 – 19:00', closed:false },
  { day:'Friday',    hours:'08:00 – 20:00', closed:false },
  { day:'Saturday',  hours:'10:00 – 15:00', closed:false },
  { day:'Sunday',    hours:'',              closed:true  },
];

var SELLER_LISTINGS = [
  { id:1, name:'Handcrafted Ceramic Mug',    cat:'Art & Crafts',  price:220, stock:4, status:'active'  },
  { id:2, name:'Vintage Style Tote Bag',     cat:'Fashion',       price:285, stock:2, status:'active'  },
  { id:3, name:'Custom Illustrated Notebook',cat:'Stationery',    price:150, stock:8, status:'active'  },
  { id:4, name:'Macrame Wall Hanging',       cat:'Home Decor',    price:410, stock:1, status:'pending' },
  { id:5, name:'Watercolor Art Print',       cat:'Art & Crafts',  price:330, stock:0, status:'sold'    },
  { id:6, name:'Leather Bookmark Set',       cat:'Stationery',    price:170, stock:5, status:'active'  },
];
var sellerListings = SELLER_LISTINGS.slice(); // working copy

var SELLER_ORDERS = [
  { id:'#ORD-001', buyer:'Kwame A.',  ini:'KA', product:'Ceramic Mug',  amount:'GH₵220', date:'Mar 12', status:'completed'  },
  { id:'#ORD-002', buyer:'Abena M.',  ini:'AM', product:'Tote Bag',     amount:'GH₵285', date:'Mar 10', status:'shipped'    },
  { id:'#ORD-003', buyer:'Kofi B.',   ini:'KB', product:'Notebook',     amount:'GH₵150', date:'Mar 09', status:'completed'  },
  { id:'#ORD-004', buyer:'Ama S.',    ini:'AS', product:'Art Print',    amount:'GH₵330', date:'Mar 07', status:'processing' },
  { id:'#ORD-005', buyer:'Yaw D.',    ini:'YD', product:'Bookmark Set', amount:'GH₵170', date:'Mar 05', status:'completed'  },
  { id:'#ORD-006', buyer:'Efua K.',   ini:'EK', product:'Ceramic Mug',  amount:'GH₵220', date:'Mar 03', status:'completed'  },
];

var editListingId = null;

var BUYER_TABS = [
  { id:'profile',  label:'My Profile',  icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id:'orders',   label:'My Orders',   icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' },
  { id:'wishlist', label:'Saved Items', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' },
];

var SELLER_TABS = [
  { id:'overview',     label:'Overview',    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { id:'listings',     label:'My Listings', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' },
  { id:'add-listing',  label:'Add Listing', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' },
  { id:'orders',       label:'Orders In',   icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' },
  { id:'profile',      label:'My Profile',  icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
];

/* ══ HELPERS ═══════════════════════════════════════════════ */
<<<<<<< HEAD

function getUser()    { try { return JSON.parse(sessionStorage.getItem('cm_user') || 'null'); } catch(e) { return null; } }
function getProfile() { try { return JSON.parse(localStorage.getItem('cm_profile') || '{}');  } catch(e) { return {}; }  }
function putProfile(data) { var p = getProfile(); localStorage.setItem('cm_profile', JSON.stringify(Object.assign(p, data))); }
function getOrders()  { try { return JSON.parse(localStorage.getItem('cm_orders') || '[]'); } catch(e) { return []; } }
function txt(id,v)    { var e = document.getElementById(id); if (e) e.textContent = v; }
function gv(id)       { return (document.getElementById(id) || {}).value || ''; }
function sv(id, v)    { var e = document.getElementById(id); if (e) e.value = v || ''; }
function show(id, d)  { var e = document.getElementById(id); if (e) e.style.display = d || 'block'; }
function hide(id)     { var e = document.getElementById(id); if (e) e.style.display = 'none'; }
function flash(id)    { var e = document.getElementById(id); if (!e) return; e.style.borderColor = 'var(--red)'; setTimeout(function(){ e.style.borderColor = ''; }, 2500); }
function pill(s)      { return '<span class="status-pill ' + s + '">' + s.charAt(0).toUpperCase() + s.slice(1) + '</span>'; }

/* ══ INIT ══════════════════════════════════════════════════ */

function init() {
  var user = getUser();
  if (!user || !user.loggedIn) {
    show('guestView');
    hide('loggedInView');
    return;
  }
  hide('guestView');
  show('loggedInView');

  /* When logged in: hide Sign In/Sign Up, show Sign Out */
  var si = document.getElementById('navSignin');
  var su = document.getElementById('navSignup');
  if (si) {
    si.textContent = 'Sign Out';
    si.href = 'signout.html';
    si.className = 'btn-outline';
    si.removeAttribute('onclick');
  }
  if (su) su.style.display = 'none';

  /* Also hide from mobile menu */
  document.querySelectorAll('.mobile-menu a[href="auth.html"], .mobile-menu a[href="auth.html?tab=signup"]').forEach(function(a) {
    a.style.display = 'none';
  });

  var role    = (getProfile().role || user.role || 'buyer').toLowerCase();
  var profile = getProfile();
  var name    = profile.name  || user.name  || 'Student';
  var email   = profile.email || user.email || '';
  var ini     = name.split(' ').filter(Boolean).map(function(n){ return n[0]; }).join('').slice(0,2).toUpperCase() || 'CM';
  var join    = profile.joinDate || new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric'});

  txt('displayName',    name);
  txt('displayEmail',   email);
  txt('avatarInitials', ini);
  txt('memberSince',    'Member since ' + join);

  var badge = document.getElementById('roleBadge');
  var roleTag = document.getElementById('roleTag');
  var labels = { buyer:'Buyer', seller:'Seller', both:'Buyer & Seller' };
  if (badge)   { badge.textContent = labels[role] || role; badge.className = 'role-badge ' + (role === 'both' ? 'both' : role); }
  if (roleTag) { var sp = roleTag.querySelector('span'); if (sp) sp.textContent = labels[role] || role; }

  /* Stats */
  var orders   = getOrders();
  var wishlist = []; try { wishlist = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e){}
  var spent    = orders.reduce(function(s,o){ return s + parseFloat(o.total || 0); }, 0);
  txt('statOrders', orders.length);
  txt('statSaved',  wishlist.length);
  txt('statSpent',  'GH₵' + Math.round(spent));

  /* Role switch bar (for "both") */
  var rsBar = document.getElementById('roleSwitchBar');
  if (rsBar) rsBar.style.display = role === 'both' ? 'flex' : 'none';

  activateDash(role === 'seller' ? 'seller' : 'buyer');

=======

function getUser()    { try { return JSON.parse(sessionStorage.getItem('cm_user') || 'null'); } catch(e) { return null; } }
function getProfile() { try { return JSON.parse(localStorage.getItem('cm_profile') || '{}');  } catch(e) { return {}; }  }
function putProfile(data) { var p = getProfile(); localStorage.setItem('cm_profile', JSON.stringify(Object.assign(p, data))); }
function getOrders()  { try { return JSON.parse(localStorage.getItem('cm_orders') || '[]'); } catch(e) { return []; } }
function txt(id,v)    { var e = document.getElementById(id); if (e) e.textContent = v; }
function gv(id)       { return (document.getElementById(id) || {}).value || ''; }
function sv(id, v)    { var e = document.getElementById(id); if (e) e.value = v || ''; }
function show(id, d)  { var e = document.getElementById(id); if (e) e.style.display = d || 'block'; }
function hide(id)     { var e = document.getElementById(id); if (e) e.style.display = 'none'; }
function flash(id)    { var e = document.getElementById(id); if (!e) return; e.style.borderColor = 'var(--red)'; setTimeout(function(){ e.style.borderColor = ''; }, 2500); }
function pill(s)      { return '<span class="status-pill ' + s + '">' + s.charAt(0).toUpperCase() + s.slice(1) + '</span>'; }

/* ══ INIT ══════════════════════════════════════════════════ */

function init() {
  var user = getUser();
  if (!user || !user.loggedIn) {
    show('guestView');
    hide('loggedInView');
    return;
  }
  hide('guestView');
  show('loggedInView');

  /* Swap nav buttons → Sign out */
  var si = document.getElementById('navSignin');
  var su = document.getElementById('navSignup');
  if (si) { si.textContent = 'Sign out'; si.href = 'signout.html'; }
  if (su)   su.style.display = 'none';

  var role    = (getProfile().role || user.role || 'buyer').toLowerCase();
  var profile = getProfile();
  var name    = profile.name  || user.name  || 'Student';
  var email   = profile.email || user.email || '';
  var ini     = name.split(' ').filter(Boolean).map(function(n){ return n[0]; }).join('').slice(0,2).toUpperCase() || 'CM';
  var join    = profile.joinDate || new Date().toLocaleDateString('en-GB',{month:'long',year:'numeric'});

  txt('displayName',    name);
  txt('displayEmail',   email);
  txt('avatarInitials', ini);
  txt('memberSince',    'Member since ' + join);

  var badge = document.getElementById('roleBadge');
  var roleTag = document.getElementById('roleTag');
  var labels = { buyer:'Buyer', seller:'Seller', both:'Buyer & Seller' };
  if (badge)   { badge.textContent = labels[role] || role; badge.className = 'role-badge ' + (role === 'both' ? 'both' : role); }
  if (roleTag) { var sp = roleTag.querySelector('span'); if (sp) sp.textContent = labels[role] || role; }

  /* Stats */
  var orders   = getOrders();
  var wishlist = []; try { wishlist = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e){}
  var spent    = orders.reduce(function(s,o){ return s + parseFloat(o.total || 0); }, 0);
  txt('statOrders', orders.length);
  txt('statSaved',  wishlist.length);
  txt('statSpent',  'GH₵' + Math.round(spent));

  /* Role switch bar (for "both") */
  var rsBar = document.getElementById('roleSwitchBar');
  if (rsBar) rsBar.style.display = role === 'both' ? 'flex' : 'none';

  activateDash(role === 'seller' ? 'seller' : 'buyer');

>>>>>>> 54e29d4cc97a9af0952c226ff1b365dc18104516
  /* Welcome toast from auth */
  if (document.referrer && document.referrer.includes('auth')) {
    window.showToast('Welcome, ' + name.split(' ')[0] + '! Your dashboard is ready. 👋');
  }
}

/* ══ DASH ACTIVATION ═══════════════════════════════════════ */

window.activateDash = function(which, tab) {
  hide('buyerDash');
  hide('sellerDash');
  var rb = document.getElementById('rsBuyer');
  var rs = document.getElementById('rsSeller');
  if (rb) rb.classList.toggle('active', which === 'buyer');
  if (rs) rs.classList.toggle('active', which === 'seller');

  if (which === 'buyer') {
    show('buyerDash');
    buildTabs('b', BUYER_TABS, tab || 'profile');
    loadBuyer();
    renderBuyerOrders();
    renderWishlist();
  } else {
    show('sellerDash');
    buildTabs('s', SELLER_TABS, tab || 'overview');
    loadSeller();
    renderSellerOverview();
    renderSellerListings();
    renderSellerOrders();
    renderAvailability();
    renderTodayHours();
    initSellerChart();
    initListingForm();
  }
};

window.switchView = function(which) { activateDash(which); };

/* ══ TAB BUILDER ════════════════════════════════════════════ */

function buildTabs(prefix, tabs, activeId) {
  var container = document.getElementById('profileTabs');
  if (!container) return;
  activeId = activeId || tabs[0].id;
  container.innerHTML = tabs.map(function(t) {
    var isActive = t.id === activeId;
    return '<button class="tab-btn' + (isActive ? ' active' : '') + '" data-prefix="' + prefix + '" data-tab="' + t.id + '">' + t.icon + t.label + '</button>';
  }).join('');
  /* Activate the right panel immediately */
  activatePanel(prefix, activeId);
  container.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      container.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      this.classList.add('active');
      activatePanel(this.dataset.prefix, this.dataset.tab);
    });
  });
}

function activatePanel(prefix, id) {
  var dash = prefix === 'b' ? 'buyerDash' : 'sellerDash';
  document.querySelectorAll('#' + dash + ' .tab-panel').forEach(function(p){ p.classList.remove('active'); });
  var panel = document.getElementById(prefix + '-tab-' + id);
  if (panel) panel.classList.add('active');
}

/* ══ BUYER PROFILE ══════════════════════════════════════════ */

window.loadBuyer = function() {
  var p = getProfile();
  sv('bName',   p.name         || '');
  sv('bEmail',  p.email        || '');
  sv('bPhone',  p.phone        || '');
  sv('bCampus', p.campus       || '');
  sv('bBio',    p.bio          || '');
  sv('bAddr',   p.deliveryAddr || '');
  sv('bPay',    p.preferredPay || '');
  sv('bNotify', p.notifyOrders || '');
  sv('bFavCat', p.favCat       || '');
};

window.saveBuyer = function() {
  var name = gv('bName'), email = gv('bEmail');
  if (!name.trim())             { flash('bName');  window.showToast('Please enter your full name.'); return; }
  if (!window.validateEmail(email)) { flash('bEmail'); window.showToast('Please enter a valid email.'); return; }
  putProfile({ name:name.trim(), email:email.trim(), phone:gv('bPhone'), campus:gv('bCampus'), bio:gv('bBio'), deliveryAddr:gv('bAddr'), preferredPay:gv('bPay'), notifyOrders:gv('bNotify'), favCat:gv('bFavCat') });
  txt('displayName', name.trim());
  txt('avatarInitials', name.trim().split(' ').filter(Boolean).map(function(n){ return n[0]; }).join('').slice(0,2).toUpperCase());
  var user = getUser(); if (user) { user.name = name.trim(); user.email = email.trim(); sessionStorage.setItem('cm_user', JSON.stringify(user)); }
  window.showToast('Profile saved! ✓');
};

/* ══ BUYER ORDERS ═══════════════════════════════════════════ */

function renderBuyerOrders() {
  var tbody = document.getElementById('bOrdersBody');
  if (!tbody) return;
  var orders = getOrders().slice(0, 10);
  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2.5rem;">No orders yet. <a href="catalog.html" style="color:var(--teal);font-weight:600;">Start shopping →</a></td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(function(o) {
    var nm = o.items && o.items[0] ? o.items[0].name : (o.product || 'Order');
    var more = o.items && o.items.length > 1 ? ' <span style="font-size:.6875rem;color:var(--muted);">+' + (o.items.length - 1) + '</span>' : '';
    return '<tr><td style="font-weight:700;color:var(--teal);">' + o.id + '</td><td>' + nm + more + '</td><td style="font-weight:700;color:#0284C7;">₵' + parseFloat(o.total||0).toFixed(2) + '</td><td style="color:var(--muted);">' + (o.date||'') + '</td><td>' + pill(o.status||'pending') + '</td></tr>';
  }).join('');
}

/* ══ WISHLIST ═══════════════════════════════════════════════ */

function renderWishlist() {
  var container = document.getElementById('bWishlistBody');
  if (!container) return;
  var list = []; try { list = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e){}
  if (!list.length) {
    container.innerHTML = '<div style="text-align:center;padding:3.5rem 1rem;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:44px;height:44px;color:var(--soft);margin:0 auto .875rem;"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg><p style="font-size:.9375rem;color:var(--muted);">Nothing saved yet. <a href="catalog.html" style="color:var(--teal);font-weight:600;">Browse products →</a></p></div>';
    return;
  }
  container.innerHTML = list.map(function(name) {
    return '<div style="display:flex;align-items:center;gap:.875rem;padding:.875rem 0;border-bottom:1px solid var(--light);">' +
      '<div style="width:34px;height:34px;border-radius:var(--r-sm);background:var(--teal-bg);display:grid;place-items:center;flex-shrink:0;"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2" style="width:16px;height:16px;"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>' +
      '<span style="font-size:.875rem;font-weight:600;color:var(--dark);flex:1;">' + window.sanitize(name) + '</span>' +
      '<button style="font-size:.75rem;font-weight:600;color:var(--red);background:none;border:none;cursor:pointer;font-family:var(--font-body);" onclick="removeWish(\'' + window.sanitize(name).replace(/'/g, "\\'") + '\')">Remove</button>' +
    '</div>';
  }).join('');
}

window.removeWish = function(name) {
  var list = []; try { list = JSON.parse(localStorage.getItem('cm_wishlist') || '[]'); } catch(e){}
  list = list.filter(function(n){ return n !== name; });
  localStorage.setItem('cm_wishlist', JSON.stringify(list));
  renderWishlist();
  txt('statSaved', list.length);
  window.showToast('"' + name + '" removed.');
};

/* ══ SELLER PROFILE ═════════════════════════════════════════ */

window.loadSeller = function() {
  var p = getProfile();
  sv('sName',      p.name          || '');
  sv('sEmail',     p.email         || '');
  sv('sPhone',     p.phone         || '');
  sv('sCampus',    p.campus        || '');
  sv('sStoreName', p.storeName     || '');
  sv('sListCat',   p.listingCat    || '');
  sv('sPayout',    p.payoutMethod  || '');
  sv('sPayoutNum', p.payoutNumber  || '');
  sv('sStoreDesc', p.storeDesc     || '');
};

window.saveSeller = function() {
  var name = gv('sName'), email = gv('sEmail');
  if (!name.trim())             { flash('sName');  window.showToast('Please enter your name.'); return; }
  if (!window.validateEmail(email)) { flash('sEmail'); window.showToast('Please enter a valid email.'); return; }
  putProfile({ name:name.trim(), email:email.trim(), phone:gv('sPhone'), campus:gv('sCampus'), storeName:gv('sStoreName'), listingCat:gv('sListCat'), payoutMethod:gv('sPayout'), payoutNumber:gv('sPayoutNum'), storeDesc:gv('sStoreDesc') });
  txt('displayName', name.trim());
  txt('avatarInitials', name.trim().split(' ').filter(Boolean).map(function(n){ return n[0]; }).join('').slice(0,2).toUpperCase());
  var user = getUser(); if (user) { user.name = name.trim(); sessionStorage.setItem('cm_user', JSON.stringify(user)); }
  window.showToast('Seller profile saved! ✓');
};

/* ══ SELLER OVERVIEW ════════════════════════════════════════ */

function renderSellerOverview() {
  var active  = sellerListings.filter(function(l){ return l.status === 'active'; }).length;
  var revenue = SELLER_ORDERS.filter(function(o){ return o.status === 'completed'; })
    .reduce(function(s,o){ return s + parseInt(o.amount.replace(/[^\d]/g,'')); }, 0);
  txt('sStatListings', active);
  txt('sStatOrders',   SELLER_ORDERS.length);
  txt('sStatRevenue',  'GH₵' + revenue.toLocaleString());
  /* Recent orders */
  var tbody = document.getElementById('sRecentOrdersBody');
  if (tbody) {
    tbody.innerHTML = SELLER_ORDERS.slice(0,4).map(function(o) {
      return '<tr>' +
        '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
        '<td><div style="display:flex;align-items:center;gap:.5rem;"><div style="width:26px;height:26px;border-radius:50%;background:#F5F3FF;color:#9333EA;display:grid;place-items:center;font-size:.625rem;font-weight:700;flex-shrink:0;">' + o.ini + '</div>' + o.buyer + '</div></td>' +
        '<td>' + o.product + '</td>' +
        '<td style="font-weight:700;color:#0284C7;">' + o.amount + '</td>' +
        '<td>' + pill(o.status) + '</td>' +
      '</tr>';
    }).join('');
  }
}

/* ══ SELLER LISTINGS ════════════════════════════════════════ */

function renderSellerListings() {
  var tbody = document.getElementById('sListingsBody');
  if (!tbody) return;
  if (!sellerListings.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2.5rem;">No listings yet. <button onclick="activateDash(\'seller\',\'add-listing\')" style="color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);">Add your first →</button></td></tr>';
    return;
  }
  tbody.innerHTML = sellerListings.map(function(l) {
    return '<tr>' +
      '<td><div style="display:flex;align-items:center;gap:.625rem;"><div style="width:40px;height:40px;border-radius:8px;background:var(--light);display:grid;place-items:center;font-size:.5rem;color:var(--muted);flex-shrink:0;">IMG</div><div><div style="font-size:.8125rem;font-weight:600;color:var(--dark);">' + window.sanitize(l.name) + '</div><div style="font-size:.6875rem;color:var(--muted);">' + l.cat + '</div></div></div></td>' +
      '<td>' + l.cat + '</td>' +
      '<td style="font-weight:700;color:#0284C7;">GH₵' + l.price.toFixed(2) + '</td>' +
      '<td>' + (l.stock > 0 ? l.stock + ' left' : '<span style="color:var(--red);font-weight:600;">Out</span>') + '</td>' +
      '<td>' + pill(l.status) + '</td>' +
      '<td><div style="display:flex;gap:.375rem;">' +
        '<button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="editListing(' + l.id + ')">Edit</button>' +
        '<button style="font-size:.75rem;color:var(--red);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="deleteListing(' + l.id + ')">Delete</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

/* ── Edit listing ── */
window.editListing = function(id) {
  var l = sellerListings.find(function(x){ return x.id === id; });
  if (!l) return;
  editListingId = id;
  activateDash('seller', 'add-listing');
  setTimeout(function() {
    sv('lName', l.name); sv('lCat', l.cat); sv('lPrice', l.price); sv('lStock', l.stock); sv('lDesc', l.description || '');
    txt('addListingTitle', 'Edit Listing');
    var btn = document.getElementById('lSubmitBtn');
    if (btn) btn.textContent = 'Update Listing';
  }, 60);
  window.showToast('Editing "' + l.name + '"');
};

/* ── Delete listing ── */
window.deleteListing = function(id) {
  var l = sellerListings.find(function(x){ return x.id === id; });
  if (!l) return;
  if (!confirm('Remove "' + l.name + '"? This cannot be undone.')) return;
  sellerListings = sellerListings.filter(function(x){ return x.id !== id; });
  renderSellerListings();
  renderSellerOverview();
  window.showToast('"' + l.name + '" removed.');
};

/* ── Listing form ── */
window.resetListingForm = function() {
  var f = document.getElementById('addListingForm');
  if (f) f.reset();
  var prev = document.getElementById('lImgPreview');
  if (prev) prev.style.display = 'none';
  txt('addListingTitle', 'Add New Listing');
  var btn = document.getElementById('lSubmitBtn');
  if (btn) btn.textContent = 'Submit Listing';
  editListingId = null;
};

function initListingForm() {
  var form = document.getElementById('addListingForm');
  if (!form || form._bound) return;
  form._bound = true;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name  = gv('lName').trim();
    var cat   = gv('lCat');
    var price = parseFloat(gv('lPrice'));
    var stock = parseInt(gv('lStock'));
    var desc  = gv('lDesc').trim();
    if (!name)                      { window.showToast('Please enter a product name.'); return; }
    if (!cat)                       { window.showToast('Please select a category.'); return; }
    if (isNaN(price) || price <= 0) { window.showToast('Please enter a valid price.'); return; }
    if (isNaN(stock) || stock < 0)  { window.showToast('Please enter a valid stock quantity.'); return; }
    if (editListingId) {
      var idx = sellerListings.findIndex(function(l){ return l.id === editListingId; });
      if (idx > -1) Object.assign(sellerListings[idx], { name:name, cat:cat, price:price, stock:stock, description:desc });
      window.showToast('"' + name + '" updated! ✓');
    } else {
      var newId = sellerListings.reduce(function(m,l){ return Math.max(m,l.id); }, 0) + 1;
      sellerListings.push({ id:newId, name:name, cat:cat, price:price, stock:stock, status:'pending', description:desc });
      window.showToast('"' + name + '" submitted for review! ✓');
    }
    resetListingForm();
    activateDash('seller', 'listings');
  });
  /* Image preview */
  var imgInp = document.getElementById('lImg');
  if (imgInp) {
    imgInp.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        var prev = document.getElementById('lImgPreview');
        if (prev) { prev.src = ev.target.result; prev.style.display = 'block'; }
      };
      reader.readAsDataURL(file);
    });
  }
}

/* ══ SELLER ORDERS ══════════════════════════════════════════ */

function renderSellerOrders() {
  var tbody = document.getElementById('sOrdersBody');
  if (!tbody) return;
  tbody.innerHTML = SELLER_ORDERS.map(function(o) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:.5rem;"><div style="width:26px;height:26px;border-radius:50%;background:#F5F3FF;color:#9333EA;display:grid;place-items:center;font-size:.625rem;font-weight:700;">' + o.ini + '</div>' + o.buyer + '</div></td>' +
      '<td>' + o.product + '</td>' +
      '<td style="font-weight:700;color:#0284C7;">' + o.amount + '</td>' +
      '<td>' + pill(o.status) + '</td>' +
    '</tr>';
  }).join('');
}

/* ══ AVAILABILITY ════════════════════════════════════════════ */

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
  var b = document.getElementById('todayBadge'), h = document.getElementById('todayHours');
  if (b) b.textContent = short[today];
  var d = AVAIL_DAYS.find(function(x){ return x.day === days[today]; });
  if (h && d) h.textContent = d.closed ? 'Closed today' : d.hours;
}

/* ══ SELLER CHART ════════════════════════════════════════════ */

var sellerChartInst = null;
function initSellerChart() {
  var ctx = document.getElementById('sellerChart');
  if (!ctx || typeof Chart === 'undefined') return;
  if (sellerChartInst) { sellerChartInst.destroy(); }
  sellerChartInst = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [{
        label: 'Revenue (GH₵)',
        data: [320, 580, 460, 840, 620, 980],
        borderColor: '#14B8A6',
        backgroundColor: 'rgba(20,184,166,.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#14B8A6',
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{ display:false }, tooltip:{ backgroundColor:'#0F172A', padding:10, cornerRadius:8 }},
      scales: {
        x: { grid:{ color:'#F3F4F6' }, ticks:{ color:'#6B7280', font:{ size:11 }}},
        y: { grid:{ color:'#F3F4F6' }, ticks:{ color:'#14B8A6', callback: function(v){ return 'GH₵'+v; }, font:{ size:11 }}},
      }
    }
  });
}

/* ══ UPGRADE BUYER → BOTH ═══════════════════════════════════ */

window.upgradeToSeller = function() {
  var user = getUser();
  if (!user) return;
  user.role = 'both';
  sessionStorage.setItem('cm_user', JSON.stringify(user));
  putProfile({ role: 'both' });
  window.showToast('Seller access activated! ✓');
  setTimeout(init, 600);
};

/* ══ BOOT ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  init();
  /* Clear red borders on input */
  document.querySelectorAll('.form-input, .form-select').forEach(function(el) {
    el.addEventListener('input', function(){ this.style.borderColor = ''; });
  });
});