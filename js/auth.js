/* ============================================================
   js/auth.js — Supabase Auth + User Features
   ============================================================ */

const SUPABASE_URL = 'https://dokvlkvrhpsgrktmzojf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRva3Zsa3ZyaHBzZ3JrdG16b2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzM5NTAsImV4cCI6MjA4OTcwOTk1MH0.TRAk8PjDhcilyhgUvu-Wdc6y5Jn2HsRFhmVUayV1944';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

var currentUser = null;
let wishlistIds = new Set();

/* ── SESSION ── */
async function initAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) {
    currentUser = session.user;
    await onSignedIn();
  }
  sb.auth.onAuthStateChange(async (event, session) => {
    currentUser = session?.user ?? null;
    if (currentUser) await onSignedIn();
    else onSignedOut();
  });
}

async function onSignedIn() {
  updateNavUser();
  await loadWishlist();
  renderWishlistHearts();
  updateCartUI();
}

function onSignedOut() {
  currentUser = null;
  wishlistIds.clear();
  updateNavUser();
  renderWishlistHearts();
  updateCartUI();
}

/* ── NAV USER ── */
function updateNavUser() {
  const btn = document.getElementById('navAuthBtn');
  if (!btn) return;
  if (currentUser) {
    const initials = (currentUser.user_metadata?.full_name || currentUser.email)
      .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    btn.innerHTML = `<div class="nav-avatar" id="navAvatar" onclick="toggleUserMenu()">${initials}</div>`;
  } else {
    btn.innerHTML = `<button class="nav-signin-btn" onclick="openAuthModal('signin')">Sign In</button>`;
  }
}

function toggleUserMenu() {
  let menu = document.getElementById('userDropMenu');
  if (menu) { menu.remove(); return; }
  menu = document.createElement('div');
  menu.id = 'userDropMenu';
  menu.className = 'user-drop-menu';
  menu.innerHTML = `
    <div class="user-drop-email">${currentUser.email}</div>
    <a href="#" onclick="openOrderHistory();return false">📦 My Orders</a>
    <a href="#" onclick="openSavedAddress();return false">📍 Saved Address</a>
    <a href="#" onclick="openWishlistPanel();return false">🤍 Wishlist</a>
    <div class="user-drop-divider"></div>
    <a href="#" onclick="signOut();return false" class="signout-link">Sign Out</a>
  `;
  document.getElementById('navAuthBtn').appendChild(menu);
  setTimeout(() => document.addEventListener('click', closeUserMenuOutside, { once: true }), 10);
}

function closeUserMenuOutside(e) {
  const menu = document.getElementById('userDropMenu');
  if (menu && !menu.contains(e.target)) menu.remove();
}

/* ── AUTH MODAL ── */
function openAuthModal(tab = 'signin') {
  document.getElementById('authModal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.innerHTML = `
    <div class="auth-overlay" onclick="closeAuthModal()"></div>
    <div class="auth-box">
      <button class="auth-close" onclick="closeAuthModal()">✕</button>
      <div class="auth-logo"><img src="images/logo.png" alt="Noora" class="auth-logo-img"/>Noora</div>
      <div class="auth-tabs">
        <button class="auth-tab ${tab==='signin'?'active':''}" onclick="switchAuthTab('signin')">Sign In</button>
        <button class="auth-tab ${tab==='signup'?'active':''}" onclick="switchAuthTab('signup')">Sign Up</button>
      </div>
      <div id="authTabContent"></div>
      <div id="authError" class="auth-error"></div>
    </div>
  `;
  document.body.appendChild(modal);
  renderAuthTab(tab);
}

function closeAuthModal() {
  document.getElementById('authModal')?.remove();
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t =>
    t.classList.toggle('active', t.textContent.toLowerCase().replace(' ', '') === tab)
  );
  renderAuthTab(tab);
}

function renderAuthTab(tab) {
  const el = document.getElementById('authTabContent');
  if (!el) return;
  if (tab === 'signin') {
    el.innerHTML = `
      <div class="auth-field"><label>Email</label><input type="email" id="authEmail" placeholder="you@email.com"/></div>
      <div class="auth-field"><label>Password</label><input type="password" id="authPassword" placeholder="••••••••"/></div>
      <button class="auth-submit-btn" onclick="doSignIn()">Sign In ✿</button>
      <p class="auth-switch">Don't have an account? <a href="#" onclick="switchAuthTab('signup');return false">Sign Up</a></p>
    `;
  } else {
    el.innerHTML = `
      <div class="auth-field"><label>Full Name</label><input type="text" id="authName" placeholder="Noora Al-Farsi"/></div>
      <div class="auth-field"><label>Email</label><input type="email" id="authEmail" placeholder="you@email.com"/></div>
      <div class="auth-field"><label>Password</label><input type="password" id="authPassword" placeholder="Min 6 characters"/></div>
      <button class="auth-submit-btn" onclick="doSignUp()">Create Account ✿</button>
      <p class="auth-switch">Already have an account? <a href="#" onclick="switchAuthTab('signin');return false">Sign In</a></p>
    `;
  }
}

function setAuthError(msg) {
  const el = document.getElementById('authError');
  if (el) el.textContent = msg;
}

async function doSignIn() {
    const email    = document.getElementById('authEmail')?.value.trim();
    const password = document.getElementById('authPassword')?.value;
    if (!email || !password) return setAuthError('Please fill in all fields.');
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError("No account found or incorrect password.");
      setTimeout(() => {
        const emailVal = document.getElementById('authEmail')?.value;
        switchAuthTab('signup');
        setTimeout(() => {
          const emailInput = document.getElementById('authEmail');
          if (emailInput) emailInput.value = emailVal;
          const errEl = document.getElementById('authError');
          if (errEl) errEl.textContent = '';
        }, 50);
      }, 2000);
      return;
    }
    closeAuthModal();
    showToast('Welcome back! 🌸');
  }

async function doSignUp() {
  const name     = document.getElementById('authName')?.value.trim();
  const email    = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value;
  if (!name || !email || !password) return setAuthError('Please fill in all fields.');
  if (password.length < 6) return setAuthError('Password must be at least 6 characters.');
  const { data, error } = await sb.auth.signUp({
    email, password,
    options: { data: { full_name: name } }
  });
  if (error) return setAuthError(error.message);
  if (data?.user) {
    await sb.from('profiles').upsert({
      id: data.user.id,
      full_name: name,
      email: email
    });
  }
  closeAuthModal();
  showToast('Account created! Check your email to confirm 🌸');
}

async function signOut() {
  await sb.auth.signOut();
  document.getElementById('userDropMenu')?.remove();
  showToast('Signed out. See you soon 🌸');
}

/* ── WISHLIST ── */
async function loadWishlist() {
  if (!currentUser) return;
  const { data } = await sb.from('wishlist').select('product_id').eq('user_id', currentUser.id);
  wishlistIds = new Set((data || []).map(r => r.product_id));
}

async function toggleWishlist(pid, btn) {
  if (!currentUser) { openAuthModal('signin'); return; }
  if (wishlistIds.has(pid)) {
    await sb.from('wishlist').delete().eq('user_id', currentUser.id).eq('product_id', pid);
    wishlistIds.delete(pid);
    btn.classList.remove('wishlisted');
    btn.textContent = '🤍';
  } else {
    await sb.from('wishlist').insert({ user_id: currentUser.id, product_id: pid });
    wishlistIds.add(pid);
    btn.classList.add('wishlisted');
    btn.textContent = '❤️';
  }
}

function renderWishlistHearts() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const pid = parseInt(btn.dataset.pid);
    const wishlisted = wishlistIds.has(pid);
    btn.textContent = wishlisted ? '❤️' : '🤍';
    btn.classList.toggle('wishlisted', wishlisted);
  });
}

/* ── SAVE ORDER ── */
async function saveOrder(items, total, paymentMethod, address) {
  if (!currentUser) return;
  await sb.from('orders').insert({
    user_id: currentUser.id,
    items, total, payment_method: paymentMethod, address
  });
}

/* ── ORDER HISTORY ── */
async function openOrderHistory() {
  document.getElementById('userDropMenu')?.remove();
  const { data: orders } = await sb.from('orders')
    .select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });

  const panel = document.createElement('div');
  panel.id = 'orderHistoryPanel';
  panel.innerHTML = `
    <div class="side-panel-overlay" onclick="document.getElementById('orderHistoryPanel').remove()"></div>
    <div class="side-panel">
      <div class="side-panel-header">
        <h3>My Orders</h3>
        <button onclick="document.getElementById('orderHistoryPanel').remove()">✕</button>
      </div>
      <div class="side-panel-body">
        ${!orders?.length ? '<p class="panel-empty">No orders yet 🌸</p>' :
          orders.map(o => `
            <div class="order-card">
              <div class="order-card-top">
                <span class="order-date">${new Date(o.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                <span class="order-status ${o.status}">${o.status}</span>
              </div>
              ${(o.items||[]).map(i => `<div class="order-item">• ${i.name} × ${i.qty}</div>`).join('')}
              <div class="order-total">Total: ₹${o.total?.toFixed(2)}</div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
  document.body.appendChild(panel);
}

/* ── SAVED ADDRESS ── */
async function openSavedAddress() {
  document.getElementById('userDropMenu')?.remove();
  const { data: addrs } = await sb.from('addresses')
    .select('*').eq('user_id', currentUser.id).order('is_default', { ascending: false });

  const panel = document.createElement('div');
  panel.id = 'addressPanel';
  panel.innerHTML = `
    <div class="side-panel-overlay" onclick="document.getElementById('addressPanel').remove()"></div>
    <div class="side-panel">
      <div class="side-panel-header">
        <h3>Saved Addresses</h3>
        <button onclick="document.getElementById('addressPanel').remove()">✕</button>
      </div>
      <div class="side-panel-body">
        ${!addrs?.length ? '<p class="panel-empty">No saved addresses yet 🌸</p>' :
          addrs.map(a => `
            <div class="address-card ${a.is_default ? 'default' : ''}">
              ${a.is_default ? '<span class="default-badge">Default</span>' : ''}
              <div class="address-name">${a.full_name}</div>
              <div class="address-line">${a.address_line}, ${a.city}, ${a.state} — ${a.pincode}</div>
              <div class="address-phone">${a.phone}</div>
            </div>
          `).join('')
        }
        <button class="add-address-btn" onclick="openAddAddressForm()">+ Add New Address</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
}

function openAddAddressForm() {
  const body = document.querySelector('#addressPanel .side-panel-body');
  if (!body) return;
  body.innerHTML = `
    <div class="auth-field"><label>Full Name</label><input type="text" id="addrName" placeholder="Noora Al-Farsi"/></div>
    <div class="auth-field"><label>Phone</label><input type="tel" id="addrPhone" placeholder="+91 98765 43210"/></div>
    <div class="auth-field"><label>Address</label><input type="text" id="addrLine" placeholder="House no, Street, Area"/></div>
    <div class="auth-field"><label>City</label><input type="text" id="addrCity" placeholder="Mumbai"/></div>
    <div class="auth-field"><label>State</label><input type="text" id="addrState" placeholder="Maharashtra"/></div>
    <div class="auth-field"><label>Pincode</label><input type="text" id="addrPin" placeholder="400001"/></div>
    <button class="auth-submit-btn" onclick="saveAddress()">Save Address ✿</button>
  `;
}

async function saveAddress() {
  const addr = {
    user_id:      currentUser.id,
    full_name:    document.getElementById('addrName')?.value.trim(),
    phone:        document.getElementById('addrPhone')?.value.trim(),
    address_line: document.getElementById('addrLine')?.value.trim(),
    city:         document.getElementById('addrCity')?.value.trim(),
    state:        document.getElementById('addrState')?.value.trim(),
    pincode:      document.getElementById('addrPin')?.value.trim(),
    is_default:   true,
  };
  const { error } = await sb.from('addresses').insert(addr);
  if (error) { showToast('Error saving address'); return; }
  showToast('Address saved! 🌸');
  document.getElementById('addressPanel')?.remove();
}

/* ── WISHLIST PANEL ── */
async function openWishlistPanel() {
  document.getElementById('userDropMenu')?.remove();
  const wishProducts = products.filter(p => wishlistIds.has(p.id));
  const panel = document.createElement('div');
  panel.id = 'wishlistPanel';
  panel.innerHTML = `
    <div class="side-panel-overlay" onclick="document.getElementById('wishlistPanel').remove()"></div>
    <div class="side-panel">
      <div class="side-panel-header">
        <h3>My Wishlist</h3>
        <button onclick="document.getElementById('wishlistPanel').remove()">✕</button>
      </div>
      <div class="side-panel-body">
        ${!wishProducts.length ? '<p class="panel-empty">Your wishlist is empty 🌸</p>' :
          wishProducts.map(p => `
            <div class="wishlist-item">
              <div class="wishlist-item-emoji">${p.emoji}</div>
              <div class="wishlist-item-info">
                <div class="wishlist-item-name">${p.name}</div>
                <div class="wishlist-item-price">from ₹${p.fragrances[0].price}</div>
              </div>
              <button class="wishlist-remove" onclick="removeFromWishlistPanel(${p.id}, this)">✕</button>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
  document.body.appendChild(panel);
}

async function removeFromWishlistPanel(pid, btn) {
  await sb.from('wishlist').delete().eq('user_id', currentUser.id).eq('product_id', pid);
  wishlistIds.delete(pid);
  btn.closest('.wishlist-item').remove();
  renderWishlistHearts();
}

// re-render cart after auth loads
document.addEventListener('DOMContentLoaded', () => {
    initAuth().then(() => updateCartUI());
  });