

var orders = [
  { id:'#ORD-001', customer:'Kwame Asante',    product:'Handcrafted Ceramic Mug',    amount:'GH\u20b3220', status:'Completed',  date:'2024-03-12' },
  { id:'#ORD-002', customer:'Abena Mensah',    product:'Vintage Style Tote Bag',      amount:'GH\u20b3285', status:'Shipped',    date:'2024-03-10' },
  { id:'#ORD-003', customer:'Kofi Boateng',    product:'Custom Illustrated Notebook', amount:'GH\u20b3150', status:'Completed',  date:'2024-03-09' },
  { id:'#ORD-004', customer:'Ama Sarpong',     product:'Watercolor Art Print',        amount:'GH\u20b3330', status:'Processing', date:'2024-03-08' },
  { id:'#ORD-005', customer:'Yaw Darko',       product:'Leather Bookmark Set',        amount:'GH\u20b3170', status:'Completed',  date:'2024-03-07' },
  { id:'#ORD-006', customer:'Efua Kusi',       product:'Macrame Wall Hanging',        amount:'GH\u20b3410', status:'Pending',    date:'2024-03-06' },
  { id:'#ORD-007', customer:'Nana Osei',       product:'Handmade Soap Set',           amount:'GH\u20b3260', status:'Shipped',    date:'2024-03-05' },
  { id:'#ORD-008', customer:'Akosua Frimpong', product:'Wooden Phone Stand',          amount:'GH\u20b3198', status:'Cancelled',  date:'2024-03-04' },
];

var pendingProducts = [
  { id:1, name:'Hand-knitted Scarf',     seller:'by Ama Asante',    price:'GH\u20b385',  cat:'Fashion',           color:'#FDF4FF' },
  { id:2, name:'Digital Art Commission', seller:'by Kwesi Mensah',  price:'GH\u20b3320', cat:'Art & Crafts',      color:'#FFF7ED' },
  { id:3, name:'Organic Lip Balm Set',   seller:'by Abena Kusi',    price:'GH\u20b3120', cat:'Beauty & Wellness', color:'#FEF3C7' },
  { id:4, name:'Leather Wallet',         seller:'by Nana Darko',    price:'GH\u20b3280', cat:'Fashion',           color:'#FDE8D8' },
  { id:5, name:'Soy Wax Candle Set',     seller:'by Efua Osei',     price:'GH\u20b3150', cat:'Home Decor',        color:'#F0FDF4' },
  { id:6, name:'Ceramic Plant Pot',      seller:'by Kofi Frimpong', price:'GH\u20b3190', cat:'Home Decor',        color:'#EFF6FF' },
];

var allProducts = [
  { id:1, name:'Handcrafted Ceramic Mug',    seller:'Emma Wilson',     cat:'Art & Crafts',     price:'GH\u20b3220', stock:4, status:'active'  },
  { id:2, name:'Vintage Style Tote Bag',      seller:'Marcus Chen',     cat:'Fashion',           price:'GH\u20b3285', stock:2, status:'active'  },
  { id:3, name:'Custom Illustrated Notebook', seller:'Sofia Rodriguez', cat:'Stationery',        price:'GH\u20b3150', stock:8, status:'active'  },
  { id:4, name:'Macrame Wall Hanging',         seller:'Olivia Martinez', cat:'Home Decor',        price:'GH\u20b3410', stock:1, status:'active'  },
  { id:5, name:'Wooden Phone Stand',           seller:'James Anderson',  cat:'Tech Accessories',  price:'GH\u20b3198', stock:6, status:'active'  },
  { id:6, name:'Handmade Soap Set',            seller:'Ava Thompson',    cat:'Beauty & Wellness', price:'GH\u20b3260', stock:3, status:'active'  },
  { id:7, name:'Leather Bookmark Set',         seller:'Liam Foster',     cat:'Stationery',        price:'GH\u20b3170', stock:5, status:'active'  },
  { id:8, name:'Watercolor Art Print',         seller:'Isabella Clark',  cat:'Art & Crafts',      price:'GH\u20b3330', stock:0, status:'inactive' },
  { id:9, name:'Hand-knitted Scarf',           seller:'Ama Asante',      cat:'Fashion',           price:'GH\u20b385',  stock:0, status:'pending' },
  { id:10,name:'Digital Art Commission',       seller:'Kwesi Mensah',    cat:'Art & Crafts',      price:'GH\u20b3320', stock:0, status:'pending' },
  { id:11,name:'Organic Lip Balm Set',         seller:'Abena Kusi',      cat:'Beauty & Wellness', price:'GH\u20b3120', stock:0, status:'pending' },
  { id:12,name:'Leather Wallet',               seller:'Nana Darko',      cat:'Fashion',           price:'GH\u20b3280', stock:0, status:'pending' },
];

var users = [
  { id:1, name:'Alex Johnson',    email:'alex.j@campus.edu',   role:'Both',   campus:'State University',  joined:'Jan 2024', orders:12, status:'active'    },
  { id:2, name:'Kwame Asante',    email:'k.asante@campus.edu', role:'Buyer',  campus:'KNUST',             joined:'Feb 2024', orders:4,  status:'active'    },
  { id:3, name:'Emma Wilson',     email:'emma.w@campus.edu',   role:'Seller', campus:'UG Legon',          joined:'Jan 2024', orders:0,  status:'active'    },
  { id:4, name:'Marcus Chen',     email:'m.chen@campus.edu',   role:'Seller', campus:'Ashesi University', joined:'Mar 2024', orders:0,  status:'active'    },
  { id:5, name:'Abena Mensah',    email:'a.mensah@campus.edu', role:'Buyer',  campus:'KNUST',             joined:'Jan 2024', orders:7,  status:'active'    },
  { id:6, name:'Sofia Rodriguez', email:'sofia.r@campus.edu',  role:'Seller', campus:'UCC',               joined:'Feb 2024', orders:0,  status:'inactive'  },
  { id:7, name:'James Anderson',  email:'james.a@campus.edu',  role:'Both',   campus:'UG Legon',          joined:'Mar 2024', orders:2,  status:'active'    },
  { id:8, name:'Olivia Martinez', email:'olivia.m@campus.edu', role:'Seller', campus:'State University',  joined:'Jan 2024', orders:0,  status:'suspended' },
];


function pill(status) {
  return '<span class="pill ' + status.toLowerCase() + '">' + status + '</span>';
}


function switchTab(id) {
  document.querySelectorAll('.atab').forEach(function (b) { b.classList.remove('active'); });
  document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
  var btn   = document.querySelector('[data-tab="' + id + '"]');
  var panel = document.getElementById('panel-' + id);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
  if (id === 'orders')   renderOrders();
  if (id === 'products') renderProducts();
  if (id === 'users')    renderUsers();
}


function renderRecentOrders() {
  var tbody = document.getElementById('recentOrdersTbody');
  if (!tbody) return;
  tbody.innerHTML = orders.slice(0, 5).map(function (o) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
      '<td>' + o.customer + '</td>' +
      '<td>' + o.product + '</td>' +
      '<td style="font-weight:700;color:#0284C7;">' + o.amount + '</td>' +
      '<td>' + pill(o.status) + '</td>' +
      '<td style="color:var(--muted);">' + o.date + '</td>' +
      '</tr>';
  }).join('');
}


function renderPending() {
  var list = document.getElementById('pendingList');
  if (!list) return;
  if (!pendingProducts.length) {
    list.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:.875rem;">All caught up! No pending approvals.</div>';
    return;
  }
  list.innerHTML = pendingProducts.slice(0, 5).map(function (p) {
    return '<div style="display:flex;align-items:center;gap:.75rem;padding:.875rem 1.5rem;border-bottom:1px solid var(--light);">' +
      '<div style="width:40px;height:40px;border-radius:8px;background:' + p.color + ';flex-shrink:0;display:grid;place-items:center;font-size:.6rem;color:var(--muted);font-weight:600;">IMG</div>' +
      '<div><div style="font-size:.8125rem;font-weight:600;color:var(--dark);">' + p.name + '</div>' +
      '<div style="font-size:.6875rem;color:var(--muted);">' + p.seller + '</div></div>' +
      '<div style="display:flex;gap:.25rem;margin-left:auto;">' +
        '<button onclick="approveProduct(' + p.id + ')" title="Approve" style="width:26px;height:26px;background:var(--teal-light);color:var(--teal);border:none;border-radius:6px;cursor:pointer;display:grid;place-items:center;">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg></button>' +
        '<button onclick="rejectProduct(' + p.id + ')"  title="Reject"  style="width:26px;height:26px;background:#FEE2E2;color:var(--red);border:none;border-radius:6px;cursor:pointer;display:grid;place-items:center;">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '</div>' +
    '</div>';
  }).join('');
}


function renderApprovalGrid() {
  var container = document.getElementById('approvalGrid');
  var badge     = document.getElementById('pending-count-badge');
  var tabBadge  = document.getElementById('badge-products');
  if (badge)    badge.textContent    = pendingProducts.length;
  if (tabBadge) tabBadge.textContent = pendingProducts.length;

  if (!container) return;
  if (!pendingProducts.length) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted);"><p style="font-weight:700;color:var(--dark);font-size:1.125rem;">All caught up!</p><p style="font-size:.875rem;margin-top:.5rem;">No pending product approvals.</p></div>';
    return;
  }
  container.innerHTML = pendingProducts.map(function (p) {
    return '<div class="approval-card" id="acard-' + p.id + '">' +
      '<div class="approval-img-placeholder" style="background:' + p.color + ';">' + p.cat + '</div>' +
      '<div class="approval-body">' +
        '<div class="approval-seller">' + p.seller + '</div>' +
        '<div class="approval-name">' + p.name + '</div>' +
        '<div class="approval-price-row"><span class="approval-price">' + p.price + '</span><span class="approval-cat">' + p.cat + '</span></div>' +
        '<div class="approval-actions">' +
          '<button class="btn-approve" onclick="approveProduct(' + p.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:10px;height:10px;"><polyline points="20,6 9,17 4,12"/></svg>Approve</button>' +
          '<button class="btn-reject"  onclick="rejectProduct(' + p.id + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:10px;height:10px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Reject</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}


function approveProduct(id) {
  var card = document.getElementById('acard-' + id);
  if (card) { card.style.opacity = '.4'; card.style.pointerEvents = 'none'; }
  var p = pendingProducts.find(function (x) { return x.id === id; });
  pendingProducts = pendingProducts.filter(function (x) { return x.id !== id; });
  setTimeout(function () {
    renderApprovalGrid();
    renderPending();
    if (p) window.showToast('"' + p.name + '" approved and now live!');
  }, 400);
}

function rejectProduct(id) {
  var card = document.getElementById('acard-' + id);
  if (card) { card.style.opacity = '.4'; card.style.pointerEvents = 'none'; }
  var p = pendingProducts.find(function (x) { return x.id === id; });
  pendingProducts = pendingProducts.filter(function (x) { return x.id !== id; });
  setTimeout(function () {
    renderApprovalGrid();
    renderPending();
    if (p) window.showToast('"' + p.name + '" rejected.');
  }, 400);
}

function approveAll() {
  var count = pendingProducts.length;
  pendingProducts = [];
  renderApprovalGrid();
  renderPending();
  window.showToast(count + ' product' + (count !== 1 ? 's' : '') + ' approved!');
}

function renderOrders() {
  var s  = ((document.getElementById('orderSearch') || {}).value || '').toLowerCase();
  var st = ((document.getElementById('orderStatusFilter') || {}).value || '').toLowerCase();
  var f  = orders.filter(function (o) {
    return (!s  || o.id.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s) || o.product.toLowerCase().includes(s)) &&
           (!st || o.status.toLowerCase() === st);
  });
  var countEl = document.getElementById('ordersCount');
  var tbody   = document.getElementById('allOrdersTbody');
  if (countEl) countEl.textContent = f.length;
  if (!tbody) return;
  tbody.innerHTML = f.map(function (o) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--teal);">' + o.id + '</td>' +
      '<td>' + o.customer + '</td>' +
      '<td>' + o.product + '</td>' +
      '<td style="font-weight:700;color:#0284C7;">' + o.amount + '</td>' +
      '<td>' + pill(o.status) + '</td>' +
      '<td style="color:var(--muted);">' + o.date + '</td>' +
      '<td><button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="window.showToast(\'Viewing \' + \'' + o.id + '\')">View</button></td>' +
      '</tr>';
  }).join('');
}


function renderProducts() {
  renderApprovalGrid();
  var s   = ((document.getElementById('prodSearch') || {}).value || '').toLowerCase();
  var cat = ((document.getElementById('prodCatFilter') || {}).value || '');
  var f   = allProducts.filter(function (p) {
    return (!s   || p.name.toLowerCase().includes(s) || p.seller.toLowerCase().includes(s)) &&
           (!cat || p.cat === cat);
  });
  var countEl = document.getElementById('prodCount');
  var tbody   = document.getElementById('allProductsTbody');
  if (countEl) countEl.textContent = f.length;
  if (!tbody) return;
  tbody.innerHTML = f.map(function (p) {
    return '<tr>' +
      '<td><div class="prod-cell"><div class="prod-thumb">IMG</div><div><div class="prod-name">' + p.name + '</div><div class="prod-cat">' + p.cat + '</div></div></div></td>' +
      '<td>' + p.seller + '</td>' +
      '<td>' + p.cat + '</td>' +
      '<td style="font-weight:700;color:#0284C7;">' + p.price + '</td>' +
      '<td>' + (p.stock > 0 ? p.stock + ' left' : '<span style="color:var(--red);font-weight:600;">Out</span>') + '</td>' +
      '<td>' + pill(p.status.charAt(0).toUpperCase() + p.status.slice(1)) + '</td>' +
      '<td><div class="action-btns">' +
        '<button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="window.showToast(\'Editing ' + p.name + '\')">Edit</button>' +
        '<button style="font-size:.75rem;color:var(--red);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="window.showToast(\'' + p.name + ' removed.\')">Remove</button>' +
      '</div></td>' +
      '</tr>';
  }).join('');
}

function renderUsers() {
  var s  = ((document.getElementById('userSearch') || {}).value || '').toLowerCase();
  var r  = ((document.getElementById('userRoleFilter') || {}).value || '');
  var st = ((document.getElementById('userStatusFilter') || {}).value || '').toLowerCase();
  var f  = users.filter(function (u) {
    return (!s  || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)) &&
           (!r  || u.role === r) &&
           (!st || u.status === st);
  });
  var countEl = document.getElementById('usersCount');
  var tbody   = document.getElementById('usersTbody');
  if (countEl) countEl.textContent = f.length;
  if (!tbody) return;
  tbody.innerHTML = f.map(function (u) {
    var ini = u.name.split(' ').map(function (n) { return n[0]; }).join('').slice(0,2).toUpperCase();
    return '<tr>' +
      '<td><div class="user-cell"><div class="user-avatar">' + ini + '</div><div><div class="user-name">' + u.name + '</div><div class="user-email">' + u.email + '</div></div></div></td>' +
      '<td><span style="font-size:.75rem;font-weight:600;color:var(--teal);">' + u.role + '</span></td>' +
      '<td style="color:var(--muted);font-size:.8125rem;">' + u.campus + '</td>' +
      '<td style="color:var(--muted);font-size:.8125rem;">' + u.joined + '</td>' +
      '<td style="font-weight:600;text-align:center;">' + u.orders + '</td>' +
      '<td>' + pill(u.status.charAt(0).toUpperCase() + u.status.slice(1)) + '</td>' +
      '<td><div class="action-btns">' +
        '<button style="font-size:.75rem;color:var(--teal);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="window.showToast(\'Viewing ' + u.name + '\')">View</button>' +
        (u.status === 'suspended'
          ? '<button style="font-size:.75rem;color:#16A34A;background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="toggleUser(' + u.id + ')">Activate</button>'
          : '<button style="font-size:.75rem;color:var(--red);background:none;border:none;cursor:pointer;font-weight:600;font-family:var(--font-body);" onclick="toggleUser(' + u.id + ')">Suspend</button>') +
      '</div></td>' +
      '</tr>';
  }).join('');
}

function toggleUser(id) {
  var u = users.find(function (x) { return x.id === id; });
  if (!u) return;
  u.status = u.status === 'suspended' ? 'active' : 'suspended';
  renderUsers();
  window.showToast(u.name + ' ' + (u.status === 'suspended' ? 'suspended.' : 'reactivated.'));
}


function initChart() {
  var canvas = document.getElementById('salesChart');
  if (!canvas || typeof Chart === 'undefined') return;
  var ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [
        { label:'Revenue', data:[12400,19800,15600,28400,22100,32800], borderColor:'#14B8A6', backgroundColor:'rgba(20,184,166,.08)', borderWidth:2.5, pointBackgroundColor:'#14B8A6', pointRadius:4, fill:true, tension:0.4, yAxisID:'y' },
        { label:'Orders',  data:[85,134,112,198,160,242],              borderColor:'#A5B4FC', backgroundColor:'transparent',           borderWidth:2,   pointBackgroundColor:'#A5B4FC', pointRadius:3, fill:false,tension:0.4, yAxisID:'y1' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode:'index', intersect:false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor:'#0F172A', padding:10, cornerRadius:8,
          titleFont:{ family:"'Plus Jakarta Sans',sans-serif", size:12 },
          bodyFont: { family:"'Plus Jakarta Sans',sans-serif", size:12 },
          callbacks: { label: function (c) { return c.datasetIndex === 0 ? ' GH\u20b3 ' + c.raw.toLocaleString() : ' ' + c.raw + ' orders'; } },
        },
      },
      scales: {
        x:  { grid:{ color:'#F3F4F6' }, ticks:{ font:{ family:"'Plus Jakarta Sans',sans-serif", size:11 }, color:'#6B7280' } },
        y:  { position:'left',  grid:{ color:'#F3F4F6' }, ticks:{ font:{ family:"'Plus Jakarta Sans',sans-serif", size:11 }, color:'#6B7280', callback: function (v) { return 'GH\u20b3' + v.toLocaleString(); } } },
        y1: { position:'right', grid:{ drawOnChartArea:false }, ticks:{ font:{ family:"'Plus Jakarta Sans',sans-serif", size:11 }, color:'#A5B4FC' } },
      },
    },
  });
}


function showToast(msg) {
  if (window.showToast && window.showToast !== showToast) { window.showToast(msg); return; }
  var t   = document.getElementById('toast');
  var msg2 = document.getElementById('toastMsg');
  if (!t || !msg2) return;
  msg2.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._adminToastT);
  window._adminToastT = setTimeout(function () { t.classList.remove('show'); }, 3000);
}

window.showToast = showToast;
window.approveProduct = approveProduct;
window.rejectProduct  = rejectProduct;
window.approveAll     = approveAll;
window.toggleUser     = toggleUser;
window.switchTab      = switchTab;


document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.atab').forEach(function (btn) {
    btn.addEventListener('click', function () { switchTab(this.dataset.tab); });
  });

  var oSearch = document.getElementById('orderSearch');
  var oStatus = document.getElementById('orderStatusFilter');
  if (oSearch) oSearch.addEventListener('input',  renderOrders);
  if (oStatus) oStatus.addEventListener('change', renderOrders);

  var pSearch = document.getElementById('prodSearch');
  var pCat    = document.getElementById('prodCatFilter');
  if (pSearch) pSearch.addEventListener('input',  renderProducts);
  if (pCat)    pCat.addEventListener('change',    renderProducts);

 
  var uSearch = document.getElementById('userSearch');
  var uRole   = document.getElementById('userRoleFilter');
  var uStatus = document.getElementById('userStatusFilter');
  if (uSearch) uSearch.addEventListener('input',  renderUsers);
  if (uRole)   uRole.addEventListener('change',   renderUsers);
  if (uStatus) uStatus.addEventListener('change', renderUsers);

  renderRecentOrders();
  renderPending();
  initChart();
});