/* ─── auth.js — Sign In / Sign Up (2-step flows) ────────── */

/* ── STATE ── */
var siRole     = 'buyer';   /* selected role during sign-in step 2  */
var suRole     = 'buyer';   /* selected role during sign-up step 2  */
var siEmail_v  = '';        /* verified email from step 1            */

/* ══════════════════════════════════════
   TOP-LEVEL TAB SWITCHER
   ══════════════════════════════════════ */
window.switchTab = function(tab) {
  var isSI = tab === 'signin';
  document.getElementById('tabSignin').classList.toggle('active',  isSI);
  document.getElementById('tabSignup').classList.toggle('active', !isSI);
  document.getElementById('flowSignin').style.display = isSI ? '' : 'none';
  document.getElementById('flowSignup').style.display = isSI ? 'none' : '';
  clearErrors();
};

/* ══════════════════════════════════════
   SIGN-IN  —  STEP 1  (credentials)
   ══════════════════════════════════════ */
window.siGoStep2 = function() {
  clearErrors();
  var email = g('siEmail').value.trim();
  var pw    = g('siPassword').value;
  var ok    = true;

  if (!window.validateEmail(email)) { markErr('siEmail','siEmailErr'); ok = false; }
  if (!pw.trim())                   { markErr('siPassword','siPwErr'); ok = false; }
  if (!ok) return;

  siEmail_v = email;

  /* Fill welcome chip */
  var namePart = email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  var initials = namePart.split(' ').map(function(n){ return n[0]||''; }).join('').slice(0,2).toUpperCase();
  setText('siAvatar',      initials);
  setText('siWelcomeName', 'Hello, ' + namePart.split(' ')[0] + '!');
  setText('siWelcomeEmail', email);

  /* Switch to step 2 with slide animation */
  hide('siStep1');
  show('siStep2', 'slide-in');
};

window.siBackToStep1 = function() {
  hide('siStep2');
  show('siStep1', 'slide-back');
};

/* ══════════════════════════════════════
   SIGN-IN  —  STEP 2  (role selection)
   ══════════════════════════════════════ */
window.siSelectRole = function(role) {
  siRole = role;
  ['siRoleBuyer','siRoleSeller','siRoleBoth'].forEach(function(id) {
    var el = g(id); if (el) el.classList.remove('selected');
  });
  var map = { buyer:'siRoleBuyer', seller:'siRoleSeller', both:'siRoleBoth' };
  if (map[role]) g(map[role]).classList.add('selected');
};

window.doSignIn = function() {
  var btn = g('siEnterBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;animation:spin .8s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Signing in...'; }
  addSpinStyle();

  setTimeout(function() {
    var email    = siEmail_v || g('siEmail').value.trim();
    var namePart = email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
    var initials = namePart.split(' ').map(function(n){ return n[0]||''; }).join('').slice(0,2).toUpperCase();

    /* Save session + profile */
    var profile = {};
    try { profile = JSON.parse(localStorage.getItem('cm_profile') || '{}'); } catch(e){}
    if (!profile.name)  profile.name     = namePart;
    if (!profile.email) profile.email    = email;
    profile.role     = siRole;
    profile.initials = initials;
    localStorage.setItem('cm_profile', JSON.stringify(profile));

    sessionStorage.setItem('cm_user', JSON.stringify({
      name: namePart, email: email, role: siRole, initials: initials, loggedIn: true
    }));

    window.showToast('Welcome back, ' + namePart.split(' ')[0] + '!');

    /* Route based on role */
    setTimeout(function() {
      var dest = siRole === 'seller' ? 'seller-dashboard.html' : 'buyer-dashboard.html';
      window.location.href = dest;
    }, 700);
  }, 1200);
};

/* ══════════════════════════════════════
   SIGN-UP  —  STEP 1  (details)
   ══════════════════════════════════════ */
window.suGoStep2 = function() {
  clearErrors();
  var first = g('suFirst').value.trim();
  var last  = g('suLast').value.trim();
  var email = g('suEmail').value.trim();
  var uni   = g('suUniversity').value;
  var pw    = g('suPassword').value;
  var ok    = true;

  if (!first) { markErr('suFirst','suFirstErr'); ok = false; }
  if (!last)  { markErr('suLast','suLastErr');   ok = false; }
  if (!window.validateEmail(email)) { markErr('suEmail','suEmailErr'); ok = false; }
  if (!uni)   { markErr('suUniversity','suUniErr'); ok = false; }
  if (pw.length < 8) { markErr('suPassword','suPwErr'); ok = false; }
  if (!ok) return;

  hide('suStep1');
  show('suStep2', 'slide-in');
};

window.suBackToStep1 = function() {
  hide('suStep2');
  show('suStep1', 'slide-back');
};

/* ══════════════════════════════════════
   SIGN-UP  —  STEP 2  (role)
   ══════════════════════════════════════ */
window.suSelectRole = function(role) {
  suRole = role;
  ['suRoleBuyer','suRoleSeller','suRoleBoth'].forEach(function(id) {
    var el = g(id); if (el) el.classList.remove('selected');
  });
  var map = { buyer:'suRoleBuyer', seller:'suRoleSeller', both:'suRoleBoth' };
  if (map[role]) g(map[role]).classList.add('selected');
};

window.doSignUp = function() {
  var btn = g('suCreateBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;animation:spin .8s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Creating account...'; }
  addSpinStyle();

  setTimeout(function() {
    var first    = g('suFirst').value.trim();
    var last     = g('suLast').value.trim();
    var email    = g('suEmail').value.trim();
    var uni      = g('suUniversity').value;
    var fullName = first + ' ' + last;
    var initials = (first[0]||'') + (last[0]||'');

    /* Save profile */
    localStorage.setItem('cm_profile', JSON.stringify({
      name: fullName, email: email, campus: uni,
      role: suRole, initials: initials.toUpperCase(),
    }));
    sessionStorage.setItem('cm_user', JSON.stringify({
      name: fullName, email: email, role: suRole,
      campus: uni, initials: initials.toUpperCase(), loggedIn: true
    }));

    window.showToast('Welcome to CampusMarket, ' + first + '! 🎉');

    /* Route based on role */
    setTimeout(function() {
      window.location.href = suRole === 'seller' ? 'seller-dashboard.html' : 'buyer-dashboard.html';
    }, 800);
  }, 1400);
};

/* ══════════════════════════════════════
   PASSWORD HELPERS
   ══════════════════════════════════════ */
window.togglePw = function(inputId, btn) {
  var inp  = g(inputId); if (!inp) return;
  var show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  var svg  = btn.querySelector('svg');
  if (svg) svg.innerHTML = show
    ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
};

window.checkPwStrength = function(pw) {
  var fill  = g('pwFill');
  var label = g('pwLabel');
  if (!fill || !label) return;
  var score = 0;
  if (pw.length >= 8)       score++;
  if (/[A-Z]/.test(pw))    score++;
  if (/[0-9]/.test(pw))    score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  var levels = [
    { w:'0%',   bg:'var(--border)', text:'Enter a password (min 8 characters)' },
    { w:'25%',  bg:'#EF4444',       text:'Weak — add uppercase letters' },
    { w:'50%',  bg:'#F59E0B',       text:'Fair — add a number or symbol' },
    { w:'75%',  bg:'#0284C7',       text:'Good — nearly there!' },
    { w:'100%', bg:'#16A34A',       text:'Strong password ✓' },
  ];
  var l = levels[pw.length === 0 ? 0 : score] || levels[0];
  fill.style.width      = l.w;
  fill.style.background = l.bg;
  label.textContent     = l.text;
  label.style.color     = score < 1 ? 'var(--muted)' : l.bg;
};

window.forgotPassword = function() {
  var email = (g('siEmail')||{}).value || '';
  if (!email || !window.validateEmail(email)) {
    window.showToast('Enter your email address first, then click Forgot password.');
    if (g('siEmail')) g('siEmail').focus();
    return;
  }
  window.showToast('Password reset link sent to ' + email + '. Check your inbox.');
};

/* ══════════════════════════════════════
   DOM HELPERS
   ══════════════════════════════════════ */
function g(id)  { return document.getElementById(id); }
function setText(id, text) { var el = g(id); if (el) el.textContent = text; }

function show(id, animClass) {
  var el = g(id); if (!el) return;
  el.style.display = '';
  if (animClass) {
    el.classList.remove('slide-in','slide-back');
    void el.offsetWidth; /* force reflow */
    el.classList.add(animClass);
  }
}
function hide(id) { var el = g(id); if (el) el.style.display = 'none'; }

function markErr(inputId, errId) {
  var inp = g(inputId); if (inp) inp.classList.add('error');
  var err = g(errId);   if (err) err.classList.add('show');
}
function clearErrors() {
  document.querySelectorAll('.fc.error').forEach(function(e){ e.classList.remove('error'); });
  document.querySelectorAll('.ferr.show').forEach(function(e){ e.classList.remove('show'); });
}

function addSpinStyle() {
  if (g('authSpinStyle')) return;
  var s = document.createElement('style');
  s.id = 'authSpinStyle';
  s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
}

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  /* Open correct tab from URL param: auth.html?tab=signup */
  var params = new URLSearchParams(window.location.search);
  if (params.get('tab') === 'signup') switchTab('signup');

  /* If already logged in → skip straight to account */
  try {
    var u = JSON.parse(sessionStorage.getItem('cm_user') || '{}');
    if (u.loggedIn) {
      var dest = u.role === 'seller' ? 'seller-dashboard.html' : 'buyer-dashboard.html';
      window.location.href = dest; return;
    }
  } catch(e){}

  /* Clear field errors on input */
  document.querySelectorAll('.fc').forEach(function(inp) {
    inp.addEventListener('input', function() {
      this.classList.remove('error');
    });
  });
});