/* ─── api.js — Central API Client for CampusMart ──────── */

var API_BASE = 'http://localhost:5000/api';

/**
 * Core fetch wrapper — auto-attaches JWT and handles errors.
 * @param {string} path   — API path, e.g. '/auth/login'
 * @param {object} opts   — { method, body, formData }
 * @returns {Promise<object>}
 */
window.apiFetch = function (path, opts) {
  opts = opts || {};
  var headers = {};
  var token = localStorage.getItem('cm_token');
  if (token) headers['Authorization'] = 'Bearer ' + token;

  var fetchOpts = {
    method: opts.method || 'GET',
    headers: headers
  };

  // If FormData (file upload), don't set Content-Type — browser will set it
  if (opts.formData) {
    fetchOpts.body = opts.formData;
  } else if (opts.body) {
    headers['Content-Type'] = 'application/json';
    fetchOpts.headers = headers;
    fetchOpts.body = JSON.stringify(opts.body);
  }

  return fetch(API_BASE + path, fetchOpts)
    .then(function (res) {
      if (!res.ok) {
        return res.json().then(function (data) {
          var err = new Error(data.msg || 'API Error');
          err.status = res.status;
          err.data = data;
          throw err;
        });
      }
      return res.json();
    });
};

/* ── AUTH helpers ── */
window.api = window.api || {};

window.api.register = function (data) {
  return window.apiFetch('/auth/register', { method: 'POST', body: data });
};

window.api.login = function (data) {
  return window.apiFetch('/auth/login', { method: 'POST', body: data });
};

window.api.getMe = function () {
  return window.apiFetch('/auth/me');
};

/* ── USER / PROFILE ── */
window.api.getProfile = function () {
  return window.apiFetch('/users/me');
};

window.api.updateProfile = function (data) {
  return window.apiFetch('/users/me', { method: 'PUT', body: data });
};

window.api.getWishlist = function () {
  return window.apiFetch('/users/wishlist');
};

window.api.updateWishlist = function (productId, action) {
  return window.apiFetch('/users/wishlist', { method: 'PUT', body: { productId: productId, action: action } });
};

/* ── PRODUCTS ── */
window.api.getProducts = function (params) {
  var qs = '';
  if (params) {
    var parts = [];
    Object.keys(params).forEach(function (k) {
      if (params[k] !== undefined && params[k] !== '') {
        parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
      }
    });
    if (parts.length) qs = '?' + parts.join('&');
  }
  return window.apiFetch('/products' + qs);
};

window.api.getMyProducts = function () {
  return window.apiFetch('/products/mine');
};

window.api.getProduct = function (id) {
  return window.apiFetch('/products/' + id);
};

window.api.createProduct = function (formData) {
  return window.apiFetch('/products', { method: 'POST', formData: formData });
};

window.api.updateProduct = function (id, formData) {
  return window.apiFetch('/products/' + id, { method: 'PUT', formData: formData });
};

window.api.deleteProduct = function (id) {
  return window.apiFetch('/products/' + id, { method: 'DELETE' });
};

/* ── CART ── */
window.api.getCart = function () {
  return window.apiFetch('/cart');
};

window.api.saveCart = function (items, promo) {
  return window.apiFetch('/cart', { method: 'POST', body: { items: items, promo: promo } });
};

window.api.addToCart = function (productId, qty) {
  return window.apiFetch('/cart/add', { method: 'POST', body: { productId: productId, qty: qty || 1 } });
};

window.api.removeFromCart = function (productId) {
  return window.apiFetch('/cart/' + productId, { method: 'DELETE' });
};

window.api.clearCart = function () {
  return window.apiFetch('/cart', { method: 'DELETE' });
};

/* ── ORDERS ── */
window.api.getOrders = function () {
  return window.apiFetch('/orders');
};

window.api.getSellerOrders = function () {
  return window.apiFetch('/orders/seller');
};

window.api.createOrder = function (data) {
  return window.apiFetch('/orders', { method: 'POST', body: data });
};

window.api.updateOrderStatus = function (orderId, status) {
  return window.apiFetch('/orders/' + orderId + '/status', { method: 'PUT', body: { status: status } });
};

/* ── TOKEN helpers ── */
window.api.isLoggedIn = function () {
  return !!localStorage.getItem('cm_token');
};

window.api.saveLogin = function (data) {
  // data = { token, user: { id, name, email, role, campus, initials } }
  localStorage.setItem('cm_token', data.token);
  localStorage.setItem('cm_profile', JSON.stringify(data.user));
  sessionStorage.setItem('cm_user', JSON.stringify({
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    campus: data.user.campus || '',
    initials: data.user.initials || '',
    loggedIn: true
  }));
};

window.api.logout = function () {
  localStorage.removeItem('cm_token');
  localStorage.removeItem('cm_profile');
  sessionStorage.removeItem('cm_user');
};

/* ── ADMIN helpers (separate session — never mixed with buyer/seller) ── */
window.api.saveAdminLogin = function (data) {
  // data = { token, user: { ..., isAdmin: true } }
  localStorage.setItem('cm_admin_token', data.token);
  localStorage.setItem('cm_admin', JSON.stringify({
    id:      data.user.id,
    name:    data.user.name,
    email:   data.user.email,
    isAdmin: data.user.isAdmin,
    initials: data.user.initials || ''
  }));
};

window.api.getAdminSession = function () {
  try { return JSON.parse(localStorage.getItem('cm_admin') || 'null'); } catch(e) { return null; }
};

window.api.isAdmin = function () {
  var a = window.api.getAdminSession();
  return !!(a && a.isAdmin);
};

window.api.adminLogout = function () {
  localStorage.removeItem('cm_admin_token');
  localStorage.removeItem('cm_admin');
};

/* Admin-authenticated fetch (uses cm_admin_token instead of cm_token) */
window.apiFetchAdmin = function (path, opts) {
  opts = opts || {};
  var headers = {};
  var token = localStorage.getItem('cm_admin_token');
  if (token) headers['Authorization'] = 'Bearer ' + token;

  var fetchOpts = { method: opts.method || 'GET', headers: headers };

  if (opts.formData) {
    fetchOpts.body = opts.formData;
  } else if (opts.body) {
    headers['Content-Type'] = 'application/json';
    fetchOpts.headers = headers;
    fetchOpts.body = JSON.stringify(opts.body);
  }

  return fetch('http://localhost:5000/api' + path, fetchOpts)
    .then(function (res) {
      if (!res.ok) {
        return res.json().then(function (data) {
          var err = new Error(data.msg || 'API Error');
          err.status = res.status;
          err.data = data;
          throw err;
        });
      }
      return res.json();
    });
};
