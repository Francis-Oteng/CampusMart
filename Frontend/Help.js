
var KB = {
  'getting-started': {
    title: 'Getting Started',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px;"><circle cx="12" cy="12" r="10"/><polyline points="12,8 12,12 16,14"/></svg>',
    items: [
      { q:'What is CampusMarket?', a:'CampusMarket is a student-to-student marketplace where university students buy and sell handmade items, custom designs, artwork, stationery, and fashion — exclusively within campus communities.', tip:'CampusMarket is available at all partner universities. Check your campus portal to confirm your institution is registered.' },
      { q:'How do I create an account?', a:'Click <strong>Sign up</strong> in the top navigation, enter your campus email, choose a strong password, and verify your email. Your account is active within seconds.' },
      { q:'Is CampusMarket free to use?', a:'Browsing and buying is completely free. Sellers pay a <strong>5% fee per completed sale</strong> — no listing fees, no monthly subscriptions.' },
      { q:'Can I use CampusMarket on mobile?', a:'Yes — CampusMarket is fully responsive and works on all modern smartphones and tablets through your browser. No app download required.' },
      { q:'When can new students start selling?', a:'As soon as your campus email is verified. Go to your Account page, click <strong>Become a Seller</strong>, fill in your profile, and submit. Most applications are approved within 24 hours.' },
    ]
  },
  'orders': {
    title: 'Orders & Delivery',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px;"><path d="M21 10V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="18" cy="18" r="3"/><path d="M18 15v2l1 1"/></svg>',
    items: [
      { q:'How do I place an order?', a:'Browse the Catalog, click <strong>Add to Cart</strong> on any product, proceed to checkout, enter your delivery address, choose a payment method, and confirm. You\'ll receive a confirmation email immediately.', tip:'Save your order number — you\'ll need it if you contact support about a purchase.' },
      { q:'How long does delivery take?', a:'Since most sellers are on the same campus, typical delivery is <strong>1–3 business days</strong>. Some sellers offer same-day campus pickup. Each listing shows the seller\'s estimated dispatch time.' },
      { q:'How do I track my order?', a:'Log in and visit <strong>My Orders</strong> from your profile. Each order shows its current status: Confirmed, Processing, Dispatched, or Delivered. If the seller provided a tracking number, it appears here.' },
      { q:'My order hasn\'t arrived. What should I do?', a:'Check your order status in My Orders and message the seller directly. If the order is more than 5 days past the estimated delivery date and the seller is unresponsive, open a support ticket — we resolve these within 48 hours.' },
      { q:'Can I cancel an order?', a:'You can cancel free of charge within <strong>2 hours</strong> of placing it, provided the seller hasn\'t started processing. After this window, contact the seller. Once dispatched, you\'ll need to follow the returns process.' },
    ]
  },
  'returns': {
    title: 'Returns & Refunds',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px;"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>',
    items: [
      { q:'What is the return policy?', a:'Buyers have <strong>7 days from delivery</strong> to request a return if the item is significantly different from the listing, arrives damaged, or is the wrong item. Custom/personalised items and digital products are non-refundable unless faulty.', tip:'Photograph items immediately on arrival — you\'ll need evidence if you open a return request.' },
      { q:'How do I request a refund?', a:'Go to <strong>My Orders</strong>, find the order, and click <strong>Request Refund</strong>. Select a reason, upload up to 4 photos, and add a description. The seller has 48 hours to respond. If they don\'t, the refund is automatically approved.' },
      { q:'How long does a refund take?', a:'Once approved, refunds process within <strong>3–5 business days</strong>. Mobile Money refunds typically arrive within 24 hours; card refunds can take up to 5 business days depending on your bank.' },
      { q:'What if the seller disputes my refund?', a:'Both parties provide evidence (photos, messages, order details). Our support team reviews the case and makes a final decision within <strong>5 business days</strong>.' },
      { q:'The item is not what was advertised. What are my rights?', a:'You are fully protected. If an item is materially different from its listing, you are entitled to a <strong>full refund including delivery costs</strong>. Request a return within 7 days and select "Not as described".' },
    ]
  },
  'payments': {
    title: 'Payments',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    items: [
      { q:'What payment methods are accepted?', a:'CampusMarket accepts <strong>Mobile Money</strong> (MTN MoMo, Vodafone Cash, AirtelTigo Money), <strong>Debit & Credit Cards</strong> (Visa and Mastercard), and <strong>Campus Wallet</strong>. All payments use 256-bit SSL encryption.' },
      { q:'Is it safe to pay on CampusMarket?', a:'Yes — all payments go through our <strong>secure escrow system</strong>. Your money is held by CampusMarket and only released to the seller once you confirm receipt (or after 3 days with no dispute).', tip:'Never pay a seller outside the platform. If a seller asks you to pay via WhatsApp or bank transfer, report them immediately.' },
      { q:'Are there any hidden fees for buyers?', a:'No hidden fees. The price shown is exactly what you pay, plus any delivery fees set by the seller. These are clearly displayed before you confirm checkout.' },
      { q:'My payment failed. What should I do?', a:'Common causes: insufficient Mobile Money balance, expired card, or bank fraud prevention. Try the same method after a few minutes, or switch payment methods. If the problem persists after two attempts, contact your bank or our support team.' },
      { q:'Can I pay in Ghana Cedis (GH₵)?', a:'Yes — all prices are displayed and charged in <strong>Ghana Cedis (GH₵)</strong>. Campus Wallet and Mobile Money are processed entirely in GH₵ with no conversion fees.' },
    ]
  },
  'selling': {
    title: 'Selling',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px;"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
    items: [
      { q:'How do I become a seller?', a:'Any verified student can apply. Go to your Seller Dashboard or click <strong>Start Selling</strong>. Fill in your store name, bio, campus, and payout method. Applications are reviewed within <strong>24 hours</strong>.', tip:'A complete profile with a real photo and detailed bio gets approved faster and attracts more buyers.' },
      { q:'What can I sell?', a:'You can sell original student-made products: arts & crafts, custom illustrations, jewellery, stationery, fashion, beauty products, tech accessories, home décor, and digital products. <strong>Reselling mass-produced commercial goods is not permitted.</strong>' },
      { q:'How do I list a product?', a:'From your Seller Dashboard, click <strong>Add Listing</strong>. Fill in the name, category, description, price, stock quantity, and upload 2–6 photos. Submit and it goes live after admin review (usually a few hours).', tip:'Natural lighting and a clean background dramatically increase your conversion rate.' },
      { q:'How and when do I get paid?', a:'Payouts happen every <strong>Friday</strong>, covering sales completed in the previous 7 days. Funds go to your registered Mobile Money wallet or bank account. A <strong>minimum payout of GH₵50</strong> applies.', tip:'Make sure your payout details are correct before your first sale to avoid delays.' },
      { q:'How many listings can I have?', a:'New sellers (less than 30 days) can have up to <strong>10 active listings</strong>. After 30 days in good standing, this increases to <strong>50 listings</strong>. Established sellers with good reviews can apply for unlimited listings.' },
    ]
  },
  'account': {
    title: 'Account & Safety',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
    items: [
      { q:'How do I reset my password?', a:'Click <strong>Sign in</strong>, then <strong>Forgot password?</strong>. Enter your campus email and we\'ll send a reset link. The link expires after 30 minutes. Check your spam folder if it doesn\'t arrive.', tip:'Use a strong password with at least 8 characters, uppercase letters, numbers, and a symbol.' },
      { q:'How is my personal data protected?', a:'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never sell your data. You can request a copy of your data or permanent account deletion at any time.' },
      { q:'How do I report a suspicious listing or user?', a:'On a listing: scroll down and click <strong>Report this listing</strong>. On a profile: click <strong>Report User</strong>. All reports are reviewed within <strong>24 hours</strong>.', tip:'Reports are completely anonymous. The reported user will never know who submitted it.' },
      { q:'What should I do if I think I\'ve been scammed?', a:'(1) Do not transfer more money. (2) Screenshot all conversations and the listing. (3) Contact support immediately with your order number. CampusMarket\'s escrow system protects all on-platform payments.' },
      { q:'How do I permanently delete my account?', a:'Go to Account Settings, scroll to the bottom, and click <strong>Delete Account</strong>. Pending payouts are processed first. Deletion is permanent — allow up to 30 days for all data to be fully purged from our systems.' },
    ]
  },
};

var activeTab = 'all';
var searchQ   = '';


function esc(s) {
  return String(s).replace(/[<>&"']/g, function (c) {
    return { '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#39;' }[c];
  });
}


function renderFAQ() {
  var grid = document.getElementById('faqGrid');
  if (!grid) return;

  var cats  = Object.keys(KB);
  var items = [];

  if (searchQ) {
    var q = searchQ.toLowerCase();
    cats.forEach(function (k) {
      KB[k].items.forEach(function (item) {
        if (item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)) {
          items.push({ cat: k, item: item });
        }
      });
    });

    if (!items.length) {
      grid.innerHTML = '<div class="no-results">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<h3>No results for \u201c' + esc(searchQ) + '\u201d</h3>' +
        '<p>Try different keywords, or browse the categories below.</p></div>';
      return;
    }

    var mid = Math.ceil(items.length / 2);
    grid.innerHTML =
      colHTML('Search Results', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        items.slice(0, mid).map(function (e, i) { return accHTML(e.item, 'SL' + i); })) +
      colHTML('', '', items.slice(mid).map(function (e, i) { return accHTML(e.item, 'SR' + i); }));
    bindAcc();
    return;
  }

  var source = activeTab === 'all' ? cats : [activeTab];
  var colsHTML = [];
  source.forEach(function (k) {
    var sec  = KB[k];
    var html = '<div class="faq-col-head">' + sec.icon + '<span>' + sec.title + '</span></div>' +
               '<div class="acc">' + sec.items.map(function (item, i) { return accHTML(item, k + i); }).join('') + '</div>';
    colsHTML.push(html);
  });

  if (activeTab === 'all') {
    var left = '', right = '';
    colsHTML.forEach(function (col, i) {
      var wrapped = '<div style="margin-bottom:2.5rem;">' + col + '</div>';
      if (i % 2 === 0) left  += wrapped;
      else             right += wrapped;
    });
    grid.innerHTML = '<div>' + left + '</div><div>' + right + '</div>';
  } else {
    var sec  = KB[activeTab];
    var itms = sec.items;
    var mid  = Math.ceil(itms.length / 2);
    grid.innerHTML =
      colHTML(sec.title, sec.icon, itms.slice(0, mid).map(function (item, i) { return accHTML(item, activeTab + 'L' + i); })) +
      '<div><div class="faq-col-head" style="opacity:0;">' + sec.icon + '<span>' + sec.title + '</span></div>' +
      '<div class="acc">' + itms.slice(mid).map(function (item, i) { return accHTML(item, activeTab + 'R' + i); }).join('') + '</div></div>';
  }

  bindAcc();
}

function colHTML(title, icon, itemHTMLs) {
  var head = title
    ? '<div class="faq-col-head">' + icon + '<span>' + esc(title) + '</span></div>'
    : '<div style="height:30px;"></div>';
  return '<div>' + head + '<div class="acc">' + itemHTMLs.join('') + '</div></div>';
}

function accHTML(item, id) {
  var tip = item.tip
    ? '<div class="tip" style="display:flex;align-items:flex-start;gap:.5rem;margin-top:.75rem;padding:.75rem 1rem;background:var(--teal-bg);border-radius:8px;border-left:3px solid var(--teal);font-size:.8125rem;color:var(--teal-dark);line-height:1.6;">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        item.tip + '</div>'
    : '';
  return '<div class="acc-item">' +
    '<button class="acc-btn" data-id="' + id + '">' +
      '<span class="acc-q">' + item.q + '</span>' +
      '<span class="acc-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:10px;height:10px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>' +
    '</button>' +
    '<div class="acc-body" data-id="' + id + '"><p>' + item.a + tip + '</p></div>' +
  '</div>';
}

function bindAcc() {
  document.querySelectorAll('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id   = this.dataset.id;
      var body = document.querySelector('.acc-body[data-id="' + id + '"]');
      var was  = this.classList.contains('open');
      document.querySelectorAll('.acc-btn').forEach(function (b) { b.classList.remove('open'); });
      document.querySelectorAll('.acc-body').forEach(function (b) { b.classList.remove('open'); });
      if (!was) { this.classList.add('open'); if (body) body.classList.add('open'); }
    });
  });
}


function initTabs() {
  var tabsEl = document.getElementById('faqTabs');
  if (!tabsEl) return;
  tabsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.ftab');
    if (!btn) return;
    document.querySelectorAll('.ftab').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    activeTab = btn.dataset.cat;
    searchQ   = '';
    var si = document.getElementById('searchInput');
    if (si) si.value = '';
    renderFAQ();
    var faq = document.getElementById('faq');
    if (faq) faq.scrollIntoView({ behavior:'smooth', block:'start' });
  });
}


function initSearch() {
  var input = document.getElementById('searchInput');
  if (!input) return;
  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    var val = this.value.trim();
    timer = setTimeout(function () {
      searchQ = val;
      if (val) {
        document.querySelectorAll('.ftab').forEach(function (b) { b.classList.remove('active'); });
      } else {
        var active = document.querySelector('[data-cat="' + activeTab + '"]');
        if (active) active.classList.add('active');
      }
      renderFAQ();
      if (val) {
        var faq = document.getElementById('faq');
        if (faq) faq.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    }, 280);
  });
}


window.quickSearch = function (term) {
  var input = document.getElementById('searchInput');
  if (input) input.value = term;
  searchQ = term;
  document.querySelectorAll('.ftab').forEach(function (b) { b.classList.remove('active'); });
  renderFAQ();
  var faq = document.getElementById('faq');
  if (faq) faq.scrollIntoView({ behavior:'smooth', block:'start' });
  return false;
};


window.setTab = function (cat) {
  searchQ = '';
  var input = document.getElementById('searchInput');
  if (input) input.value = '';
  activeTab = cat;
  document.querySelectorAll('.ftab').forEach(function (b) { b.classList.remove('active'); });
  var tab = document.querySelector('[data-cat="' + cat + '"]');
  if (tab) tab.classList.add('active');
  renderFAQ();
  var faq = document.getElementById('faq');
  if (faq) faq.scrollIntoView({ behavior:'smooth', block:'start' });
};


function initCharCounter() {
  var msg     = document.getElementById('cMsg');
  var counter = document.getElementById('charCount');
  if (msg && counter) {
    msg.addEventListener('input', function () { counter.textContent = this.value.length; });
  }
}


function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = document.getElementById('sendBtn');

   
    var name    = (document.getElementById('cName')    || {}).value || '';
    var email   = (document.getElementById('cEmail')   || {}).value || '';
    var topic   = (document.getElementById('cTopic')   || {}).value || '';
    var subject = (document.getElementById('cSubject') || {}).value || '';
    var msg     = (document.getElementById('cMsg')     || {}).value || '';

    if (!name.trim())  { window.showToast('Please enter your full name.');    return; }
    if (!window.validateEmail(email)) { window.showToast('Please enter a valid email.'); return; }
    if (!topic)        { window.showToast('Please select a topic.');          return; }
    if (!subject.trim()){ window.showToast('Please enter a subject line.');   return; }
    if (msg.trim().length < 10) { window.showToast('Please provide more detail in your message.'); return; }

  
    if (btn) {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><polyline points="20,6 9,17 4,12"/></svg> Sent!';
      btn.style.background = '#16A34A';
      btn.disabled = true;
    }
    window.showToast('Message received! We\u2019ll reply within 2\u20134 hours.');

    setTimeout(function () {
      form.reset();
      var counter = document.getElementById('charCount');
      if (counter) counter.textContent = '0';
      if (btn) {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg> Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }
    }, 4000);
  });
}


document.addEventListener('DOMContentLoaded', function () {
  initTabs();
  initSearch();
  initCharCounter();
  initContactForm();
  renderFAQ();
});