// Watch Mart <-> Supabase bridge (plain fetch, no library).
// Only the URL and PUBLISHABLE key belong here. Never put a secret key in this file.
(function () {
  const URL_ = 'https://inivgumsxcexngeztnhb.supabase.co';
  const KEY = 'sb_publishable_lr_BoerCQluui8HErmK8Vw_kuXDpKPr';
  const S = window.store;
  const SESSION_KEY = 'wm_admin_session';
  const PENDING_KEY = 'wm_pending_orders';
  const CONFIG_KEYS = ['settings', 'categories', 'coupons', 'shippingRates'];
  let applyingRemote = false, inOrder = false;

  // ---------- session ----------
  const getSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; } };
  const setSession = (r) => localStorage.setItem(SESSION_KEY, JSON.stringify({
    access_token: r.access_token, refresh_token: r.refresh_token,
    expires_at: Date.now() + (r.expires_in || 3600) * 1000
  }));
  async function authCall(grant, body) {
    const res = await fetch(`${URL_}/auth/v1/token?grant_type=${grant}`, {
      method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.msg || j.error_description || 'Login failed');
    setSession(j); return j;
  }
  async function token() {
    let s = getSession();
    if (!s) return null;
    if (s.expires_at - Date.now() < 60000) {
      try { s = await authCall('refresh_token', { refresh_token: s.refresh_token }); s = getSession(); }
      catch (e) { localStorage.removeItem(SESSION_KEY); return null; }
    }
    return s.access_token;
  }
  const isAdmin = () => !!getSession();

  // ---------- REST ----------
  async function rest(method, path, body, opts = {}) {
    const h = { apikey: KEY, 'Content-Type': 'application/json' };
    if (opts.auth) { const t = await token(); if (!t) throw new Error('Not logged in'); h.Authorization = 'Bearer ' + t; }
    if (opts.prefer) h.Prefer = opts.prefer;
    const res = await fetch(`${URL_}/rest/v1/${path}`, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
    const txt = await res.text();
    return txt ? JSON.parse(txt) : null;
  }
  const upsert = (table, rows) => rest('POST', `${table}?on_conflict=${table === 'store_config' ? 'key' : 'id'}`, rows, { auth: true, prefer: 'resolution=merge-duplicates' });
  const guard = (p) => p.catch(e => { console.error(e); alert('Could not save to the online database. Check your internet and try again.'); });

  // ---------- load public data ----------
  async function loadRemote() {
    try {
      const cfg = await rest('GET', 'store_config?select=key,value');
      const c = {}; cfg.forEach(r => c[r.key] = r.value);
      applyingRemote = true;
      if (c.seeded) {
        const rows = await rest('GET', 'products?select=data&order=updated_at.desc');
        S.data.products = rows.map(r => r.data);
      }
      CONFIG_KEYS.forEach(k => { if (c[k] !== undefined) S.data[k] = k === 'settings' ? { ...S.data.settings, ...c[k] } : c[k]; });
      S.saveDatabase();
      S.emitChange('settings_updated');
      ['renderHeaderCategoryNav', 'renderCategoryChips', 'renderFeaturedShowcases'].forEach(f => { try { window[f](); } catch (e) {} });
    } catch (e) { console.error('Could not load online data, using saved copy:', e); }
    applyingRemote = false;
  }

  // ---------- push (admin) ----------
  const pushConfig = () => upsert('store_config', CONFIG_KEYS.map(k => ({ key: k, value: S.data[k] })));
  const pushProduct = (p) => upsert('products', [{ id: p.id, data: p, updated_at: new Date().toISOString() }]);
  function wrap(name, after) {
    const orig = S[name].bind(S);
    S[name] = function (...a) { const r = orig(...a); if (!applyingRemote && !inOrder && isAdmin()) guard(after(r, ...a)); return r; };
  }
  wrap('saveProduct', (r) => pushProduct(r));
  wrap('updateStock', (r, id) => pushProduct(S.getProductById(id)));
  wrap('deleteProduct', (r, id) => rest('DELETE', `products?id=eq.${encodeURIComponent(id)}`, undefined, { auth: true }));
  ['saveCategory', 'deleteCategory', 'saveCoupon', 'deleteCoupon', 'updateShippingRate', 'updateSettings'].forEach(n => wrap(n, () => pushConfig()));
  wrap('updateOrderStatus', (r, id) => { const o = S.getOrderById(id); return rest('PATCH', `orders?id=eq.${encodeURIComponent(id)}`, { status: o.status, data: o }, { auth: true }); });

  // ---------- customer orders ----------
  const origCreate = S.createOrder.bind(S);
  S.createOrder = function (data) {
    inOrder = true; let o;
    try { o = origCreate(data); } finally { inOrder = false; }
    sendOrder(o);
    return o;
  };
  async function sendOrder(o) {
    try { await rest('POST', 'rpc/place_order', { o }); }
    catch (e) {
      console.error(e);
      const q = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); q.push(o);
      localStorage.setItem(PENDING_KEY, JSON.stringify(q));
    }
  }
  async function retryPending() {
    const q = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); if (!q.length) return;
    const left = [];
    for (const o of q) { try { await rest('POST', 'rpc/place_order', { o }); } catch (e) { if (!/duplicate|23505/.test(String(e))) left.push(o); } }
    localStorage.setItem(PENDING_KEY, JSON.stringify(left));
  }

  // ---------- order tracking (customer) ----------
  const origTrack = window.handleSearchOrderTracking;
  window.handleSearchOrderTracking = async function (e) {
    e.preventDefault();
    const q = document.getElementById('tracking-search-input').value.trim();
    try {
      const found = await rest('POST', 'rpc/track_order', { q });
      (found || []).forEach(o => { const i = S.data.orders.findIndex(x => x.id === o.id); if (i >= 0) S.data.orders[i] = o; else S.data.orders.unshift(o); });
    } catch (err) { console.error(err); }
    return origTrack(e);
  };

  // ---------- admin: login, orders, seed, photo upload ----------
  function showLogin() {
    return new Promise((resolve) => {
      const d = document.createElement('div');
      d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:1rem';
      d.innerHTML = `<form style="background:#14161c;border:1px solid #D4AF37;border-radius:12px;padding:1.5rem;width:100%;max-width:340px;color:#fff;font-family:sans-serif">
        <h3 style="margin:0 0 1rem;color:#D4AF37">Admin Login</h3>
        <input id="wm-em" type="email" placeholder="Email" required style="width:100%;padding:.7rem;margin-bottom:.6rem;border-radius:6px;border:1px solid #333;background:#0A0B0E;color:#fff">
        <input id="wm-pw" type="password" placeholder="Password" required style="width:100%;padding:.7rem;margin-bottom:.6rem;border-radius:6px;border:1px solid #333;background:#0A0B0E;color:#fff">
        <p id="wm-err" style="color:#f87171;font-size:.8rem;min-height:1em;margin:0 0 .6rem"></p>
        <button type="submit" style="width:100%;padding:.7rem;background:#D4AF37;border:0;border-radius:6px;font-weight:700;cursor:pointer">Login</button>
        <button type="button" id="wm-x" style="width:100%;padding:.5rem;margin-top:.4rem;background:none;border:0;color:#94A3B8;cursor:pointer">Cancel</button></form>`;
      document.body.appendChild(d);
      d.querySelector('#wm-x').onclick = () => { d.remove(); resolve(false); };
      d.querySelector('form').onsubmit = async (ev) => {
        ev.preventDefault();
        try { await authCall('password', { email: d.querySelector('#wm-em').value.trim(), password: d.querySelector('#wm-pw').value }); d.remove(); resolve(true); }
        catch (err) { d.querySelector('#wm-err').textContent = err.message; }
      };
    });
  }
  async function seedIfEmpty() {
    const c = await rest('GET', 'store_config?key=eq.seeded&select=value', undefined, { auth: true });
    if (c.length) return;
    if (!confirm('Online database is empty. Upload the current watches, categories and settings so you can edit them from here?')) return;
    await rest('POST', 'products?on_conflict=id', S.data.products.map(p => ({ id: p.id, data: p })), { auth: true, prefer: 'resolution=merge-duplicates' });
    await pushConfig();
    await upsert('store_config', [{ key: 'seeded', value: true }]);
    alert('Done. Your store is now live from the online database.');
  }
  async function loadOrders() {
    const rows = await rest('GET', 'orders?select=status,data&order=created_at.desc', undefined, { auth: true });
    applyingRemote = true; S.data.orders = rows.map(r => ({ ...r.data, status: r.status })); S.saveDatabase(); applyingRemote = false;
  }
  window.SB_adminSignIn = async function () {
    if (!(await token())) { if (!(await showLogin())) return false; }
    try { await seedIfEmpty(); await loadOrders(); } catch (e) { console.error(e); alert('Login worked but loading data failed: ' + e.message); }
    return true;
  };
  window.uploadProductImage = async function (input, targetId) {
    const f = input.files[0]; if (!f) return;
    const status = input.nextElementSibling; if (status) status.textContent = 'Uploading...';
    try {
      const img = await createImageBitmap(f);
      const sc = Math.min(1, 1200 / Math.max(img.width, img.height));
      const cv = document.createElement('canvas'); cv.width = img.width * sc; cv.height = img.height * sc;
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.85));
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
      const res = await fetch(`${URL_}/storage/v1/object/product-images/${name}`, {
        method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + (await token()), 'Content-Type': 'image/jpeg' }, body: blob
      });
      if (!res.ok) throw new Error(await res.text());
      document.getElementById(targetId).value = `${URL_}/storage/v1/object/public/product-images/${name}`;
      if (status) status.textContent = 'Uploaded ✓';
    } catch (e) { console.error(e); if (status) status.textContent = 'Upload failed'; }
  };

  document.addEventListener('DOMContentLoaded', () => { loadRemote(); retryPending(); });
})();
