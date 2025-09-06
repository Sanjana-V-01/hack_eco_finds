
const API_BASE = import.meta.env.VITE_API || 'http://localhost:4000';

export function getToken() { return localStorage.getItem('token') || ''; }
export function setToken(t) { localStorage.setItem('token', t); }
export function clearToken() { localStorage.removeItem('token'); }

async function req(path, opts = {}) {
  const headers = { 'Content-Type':'application/json', ...(opts.headers||{}) };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) throw new Error((await res.json().catch(()=>({}))).error || res.statusText);
  return res.json();
}

export const api = {
  // auth
  register: (email, password, username) => req('/api/auth/register', { method:'POST', body: JSON.stringify({ email, password, username }) }),
  login: (email, password) => req('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password }) }),
  me: () => req('/api/users/me'),
  updateMe: (username) => req('/api/users/me', { method:'PUT', body: JSON.stringify({ username }) }),
  categories: () => req('/api/users/categories'),
  // products
  list: (params={}) => {
    const u = new URL(API_BASE + '/api/products');
    if (params.category) u.searchParams.set('category', params.category);
    if (params.q) u.searchParams.set('q', params.q);
    return fetch(u.toString()).then(async r => {
      if (!r.ok) throw new Error((await r.json().catch(()=>({}))).error || r.statusText);
      return r.json();
    });
  },
  product: (id) => req('/api/products/' + id),
  createProduct: (p) => req('/api/products', { method:'POST', body: JSON.stringify(p) }),
  updateProduct: (id, p) => req('/api/products/' + id, { method:'PUT', body: JSON.stringify(p) }),
  deleteProduct: (id) => req('/api/products/' + id, { method:'DELETE' }),
  myListings: () => req('/api/products/me/listings/all'),
  // cart & orders
  cart: () => req('/api/cart'),
  addToCart: (productId, qty=1) => req('/api/cart/add', { method:'POST', body: JSON.stringify({ productId, qty }) }),
  removeFromCart: (productId) => req('/api/cart/remove', { method:'POST', body: JSON.stringify({ productId }) }),
  checkout: () => req('/api/cart/checkout', { method:'POST' }),
  orders: () => req('/api/orders')
}
