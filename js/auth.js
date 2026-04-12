/* ============================================================
   js/auth.js — Supabase Auth + Google + Guest Wishlist
   ============================================================ */

   var SUPABASE_URL = 'https://dokvlkvrhpsgrktmzojf.supabase.co';
   var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRva3Zsa3ZyaHBzZ3JrdG16b2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzM5NTAsImV4cCI6MjA4OTcwOTk1MH0.TRAk8PjDhcilyhgUvu-Wdc6y5Jn2HsRFhmVUayV1944';
   var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
   
   var currentUser = null;
   var wishlistIds = new Set();
   
   /* ── GUEST WISHLIST ── */
   function getGuestWishlist() {
     try { return new Set(JSON.parse(localStorage.getItem('noora-wishlist')||'[]').map(Number)); }
     catch(e) { return new Set(); }
   }
   function saveGuestWishlist(set) {
     localStorage.setItem('noora-wishlist', JSON.stringify([...set]));
   }
   
   /* ── WISHLIST COUNT ── */
   function updateWishlistCount() {
     var count = currentUser ? wishlistIds.size : getGuestWishlist().size;
     var el = document.getElementById('wishlistCount');
     if (!el) return;
     el.textContent = count > 0 ? count : '';
     el.classList.toggle('visible', count > 0);
   }
   
   /* ── SESSION ── */
   async function initAuth() {
     var res = await sb.auth.getSession();
     if (res.data.session && res.data.session.user) { currentUser = res.data.session.user; await onSignedIn(); }
     sb.auth.onAuthStateChange(async function(event, session) {
       currentUser = (session && session.user) ? session.user : null;
       if (currentUser) await onSignedIn(); else onSignedOut();
     });
   }
   
   async function onSignedIn() {
     updateNavUser();
     await loadWishlist();
     var guest = getGuestWishlist();
     for (var pid of guest) {
       if (!wishlistIds.has(pid)) {
         await sb.from('wishlist').insert({ user_id: currentUser.id, product_id: pid });
         wishlistIds.add(pid);
       }
     }
     if (guest.size) localStorage.removeItem('noora-wishlist');
     renderWishlistHearts();
     updateWishlistCount();
     updateCartUI();
   }
   
   function onSignedOut() {
     currentUser = null; wishlistIds.clear();
     updateNavUser(); renderWishlistHearts(); updateWishlistCount(); updateCartUI();
   }
   
   /* ── NAV USER ── */
   function updateNavUser() {
     var btn = document.getElementById('navAuthBtn'); if (!btn) return;
     if (currentUser) {
       var name = (currentUser.user_metadata && currentUser.user_metadata.full_name) ? currentUser.user_metadata.full_name : currentUser.email;
       var initials = name.split(' ').map(function(w){ return w[0]||''; }).join('').toUpperCase().slice(0,2);
       btn.innerHTML = '<div class="nav-avatar" id="navAvatar" onclick="toggleUserMenu()">' + initials + '</div>';
     } else {
       btn.innerHTML = '<button class="nav-signin-btn" onclick="openAuthModal(\'signin\')">Sign In</button>';
     }
   }
   
   function toggleUserMenu() {
     var ex = document.getElementById('userDropMenu'); if (ex) { ex.remove(); return; }
     var menu = document.createElement('div'); menu.id = 'userDropMenu'; menu.className = 'user-drop-menu';
     menu.innerHTML =
       '<div class="user-drop-email">' + currentUser.email + '</div>' +
       '<a href="#" onclick="openOrderHistory();return false">📦 My Orders</a>' +
       '<a href="#" onclick="openSavedAddress();return false">📍 Saved Address</a>' +
       '<a href="#" onclick="openWishlistPanel();return false">🤍 Wishlist</a>' +
       '<div class="user-drop-divider"></div>' +
       '<a href="#" onclick="signOut();return false" class="signout-link">Sign Out</a>';
     document.getElementById('navAuthBtn').appendChild(menu);
     setTimeout(function(){ document.addEventListener('click', closeUserMenuOutside, { once: true }); }, 10);
   }
   function closeUserMenuOutside(e) { var m = document.getElementById('userDropMenu'); if (m && !m.contains(e.target)) m.remove(); }
   
   /* ── AUTH MODAL ── */
   function openAuthModal(tab) {
     tab = tab || 'signin';
     var ex = document.getElementById('authModal'); if (ex) ex.remove();
     var modal = document.createElement('div'); modal.id = 'authModal';
     modal.innerHTML =
       '<div class="auth-overlay" onclick="closeAuthModal()"></div>' +
       '<div class="auth-box">' +
         '<button class="auth-close" onclick="closeAuthModal()">✕</button>' +
         '<div class="auth-logo"><img src="images/logo.png" alt="Noora" class="auth-logo-img"/>Noora</div>' +
         '<div class="auth-tabs">' +
           '<button class="auth-tab ' + (tab==='signin'?'active':'') + '" onclick="switchAuthTab(\'signin\')">Sign In</button>' +
           '<button class="auth-tab ' + (tab==='signup'?'active':'') + '" onclick="switchAuthTab(\'signup\')">Sign Up</button>' +
         '</div>' +
         '<div id="authTabContent"></div>' +
         '<div class="auth-or-divider"><span>or</span></div>' +
         '<button class="google-signin-btn" onclick="signInWithGoogle()">' +
           '<svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0">' +
           '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
           '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>' +
           '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>' +
           '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>' +
           '</svg>' +
           'Continue with Google' +
         '</button>' +
         '<div id="authError" class="auth-error"></div>' +
       '</div>';
     document.body.appendChild(modal);
     renderAuthTab(tab);
   }
   
   function closeAuthModal() { var m = document.getElementById('authModal'); if (m) m.remove(); }
   
   function switchAuthTab(tab) {
     document.querySelectorAll('.auth-tab').forEach(function(t){
       t.classList.toggle('active', t.textContent.toLowerCase().replace(/\s/g,'') === tab.replace(/\s/g,''));
     });
     renderAuthTab(tab);
   }
   
   function renderAuthTab(tab) {
     var el = document.getElementById('authTabContent'); if (!el) return;
     if (tab === 'signin') {
       el.innerHTML =
         '<div class="auth-field"><label>Email</label><input type="email" id="authEmail" placeholder="you@email.com"/></div>' +
         '<div class="auth-field"><label>Password</label><input type="password" id="authPassword" placeholder="••••••••"/></div>' +
         '<button class="auth-submit-btn" onclick="doSignIn()">Sign In ✿</button>' +
         '<p class="auth-switch">Don\'t have an account? <a href="#" onclick="switchAuthTab(\'signup\');return false">Sign Up</a></p>';
     } else {
       el.innerHTML =
         '<div class="auth-field"><label>Full Name</label><input type="text" id="authName" placeholder="Noora Al-Farsi"/></div>' +
         '<div class="auth-field"><label>Email</label><input type="email" id="authEmail" placeholder="you@email.com"/></div>' +
         '<div class="auth-field"><label>Password</label><input type="password" id="authPassword" placeholder="Min 6 characters"/></div>' +
         '<button class="auth-submit-btn" onclick="doSignUp()">Create Account ✿</button>' +
         '<p class="auth-switch">Already have an account? <a href="#" onclick="switchAuthTab(\'signin\');return false">Sign In</a></p>';
     }
   }
   
   function setAuthError(msg) { var el = document.getElementById('authError'); if (el) el.textContent = msg; }
   
   async function doSignIn() {
     var email    = document.getElementById('authEmail') ? document.getElementById('authEmail').value.trim() : '';
     var password = document.getElementById('authPassword') ? document.getElementById('authPassword').value : '';
     if (!email || !password) return setAuthError('Please fill in all fields.');
     var res = await sb.auth.signInWithPassword({ email: email, password: password });
     if (res.error) {
       setAuthError('No account found or incorrect password.');
       setTimeout(function() {
         var ev = document.getElementById('authEmail') ? document.getElementById('authEmail').value : '';
         switchAuthTab('signup');
         setTimeout(function() { var ei=document.getElementById('authEmail'); if(ei) ei.value=ev; var er=document.getElementById('authError'); if(er) er.textContent=''; }, 50);
       }, 2000);
       return;
     }
     closeAuthModal(); showToast('Welcome back! 🌸');
   }
   
   async function doSignUp() {
     var name     = document.getElementById('authName') ? document.getElementById('authName').value.trim() : '';
     var email    = document.getElementById('authEmail') ? document.getElementById('authEmail').value.trim() : '';
     var password = document.getElementById('authPassword') ? document.getElementById('authPassword').value : '';
     if (!name || !email || !password) return setAuthError('Please fill in all fields.');
     if (password.length < 6) return setAuthError('Password must be at least 6 characters.');
     var res = await sb.auth.signUp({ email: email, password: password, options: { data: { full_name: name } } });
     if (res.error) return setAuthError(res.error.message);
     if (res.data && res.data.user) await sb.from('profiles').upsert({ id: res.data.user.id, full_name: name, email: email });
     closeAuthModal(); showToast('Account created! Check your email to confirm 🌸');
   }
   
   async function signInWithGoogle() {
     var res = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } });
     if (res.error) setAuthError('Google sign in failed. Please try email instead.');
   }
   
   async function signOut() {
     await sb.auth.signOut();
     var m = document.getElementById('userDropMenu'); if (m) m.remove();
     showToast('Signed out. See you soon 🌸');
   }
   
   /* ── WISHLIST ── */
   async function loadWishlist() {
     if (!currentUser) return;
     var res = await sb.from('wishlist').select('product_id').eq('user_id', currentUser.id);
     wishlistIds = new Set((res.data || []).map(function(r){ return r.product_id; }));
   }
   
   async function toggleWishlist(pid, btn) {
     if (currentUser) {
       if (wishlistIds.has(pid)) {
         await sb.from('wishlist').delete().eq('user_id', currentUser.id).eq('product_id', pid);
         wishlistIds.delete(pid); btn.classList.remove('wishlisted'); btn.textContent = '🤍';
       } else {
         await sb.from('wishlist').insert({ user_id: currentUser.id, product_id: pid });
         wishlistIds.add(pid); btn.classList.add('wishlisted'); btn.textContent = '❤️';
       }
     } else {
       var gw = getGuestWishlist();
       if (gw.has(pid)) { gw.delete(pid); btn.classList.remove('wishlisted'); btn.textContent = '🤍'; }
       else             { gw.add(pid);    btn.classList.add('wishlisted');    btn.textContent = '❤️'; }
       saveGuestWishlist(gw);
     }
     updateWishlistCount();
   }
   
   function renderWishlistHearts() {
     var ids = currentUser ? wishlistIds : getGuestWishlist();
     document.querySelectorAll('.wishlist-btn').forEach(function(btn) {
       var pid = parseInt(btn.dataset.pid);
       var on = ids.has(pid);
       btn.textContent = on ? '❤️' : '🤍';
       btn.classList.toggle('wishlisted', on);
     });
     updateWishlistCount();
   }
   
   async function saveOrder(items, total, paymentMethod, address) {
     if (!currentUser) return;
     await sb.from('orders').insert({ user_id: currentUser.id, items: items, total: total, payment_method: paymentMethod, address: address });
   }
   
   async function openOrderHistory() {
     var m = document.getElementById('userDropMenu'); if (m) m.remove();
     var res = await sb.from('orders').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
     var orders = res.data;
     var panel = document.createElement('div'); panel.id = 'orderHistoryPanel';
     panel.innerHTML = '<div class="side-panel-overlay" onclick="document.getElementById(\'orderHistoryPanel\').remove()"></div>' +
       '<div class="side-panel"><div class="side-panel-header"><h3>My Orders</h3><button onclick="document.getElementById(\'orderHistoryPanel\').remove()">✕</button></div>' +
       '<div class="side-panel-body">' +
       (!orders||!orders.length ? '<p class="panel-empty">No orders yet 🌸</p>' :
         orders.map(function(o){ return '<div class="order-card"><div class="order-card-top"><span class="order-date">'+new Date(o.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})+'</span><span class="order-status '+(o.status||'pending')+'">'+(o.status||'pending')+'</span></div>'+(o.items||[]).map(function(i){ return '<div class="order-item">• '+i.name+' × '+i.qty+'</div>'; }).join('')+'<div class="order-total">Total: ₹'+(o.total?o.total.toFixed(2):'—')+'</div></div>'; }).join('')) +
       '</div></div>';
     document.body.appendChild(panel);
   }
   
   async function openSavedAddress() {
     var m = document.getElementById('userDropMenu'); if (m) m.remove();
     var res = await sb.from('addresses').select('*').eq('user_id', currentUser.id).order('is_default', { ascending: false });
     var addrs = res.data;
     var panel = document.createElement('div'); panel.id = 'addressPanel';
     panel.innerHTML = '<div class="side-panel-overlay" onclick="document.getElementById(\'addressPanel\').remove()"></div>' +
       '<div class="side-panel"><div class="side-panel-header"><h3>Saved Addresses</h3><button onclick="document.getElementById(\'addressPanel\').remove()">✕</button></div>' +
       '<div class="side-panel-body">' +
       (!addrs||!addrs.length ? '<p class="panel-empty">No saved addresses yet 🌸</p>' :
         addrs.map(function(a){ return '<div class="address-card '+(a.is_default?'default':'')+'">'+
           (a.is_default?'<span class="default-badge">Default</span>':'')+
           '<div class="address-name">'+a.full_name+'</div>'+
           '<div class="address-line">'+a.address_line+', '+a.city+', '+a.state+' — '+a.pincode+'</div>'+
           '<div class="address-phone">'+a.phone+'</div></div>'; }).join('')) +
       '<button class="add-address-btn" onclick="openAddAddressForm()">+ Add New Address</button>' +
       '</div></div>';
     document.body.appendChild(panel);
   }
   
   function openAddAddressForm() {
     var body = document.querySelector('#addressPanel .side-panel-body'); if (!body) return;
     body.innerHTML =
       '<div class="auth-field"><label>Full Name</label><input type="text" id="addrName" placeholder="Noora Al-Farsi"/></div>'+
       '<div class="auth-field"><label>Phone</label><input type="tel" id="addrPhone" placeholder="+91 98765 43210"/></div>'+
       '<div class="auth-field"><label>Address</label><input type="text" id="addrLine" placeholder="House no, Street, Area"/></div>'+
       '<div class="auth-field"><label>City</label><input type="text" id="addrCity" placeholder="Mumbai"/></div>'+
       '<div class="auth-field"><label>State</label><input type="text" id="addrState" placeholder="Maharashtra"/></div>'+
       '<div class="auth-field"><label>Pincode</label><input type="text" id="addrPin" placeholder="400001"/></div>'+
       '<button class="auth-submit-btn" onclick="saveAddress()">Save Address ✿</button>';
   }
   
   async function saveAddress() {
     var addr = { user_id: currentUser.id, full_name: document.getElementById('addrName')?document.getElementById('addrName').value.trim():'', phone: document.getElementById('addrPhone')?document.getElementById('addrPhone').value.trim():'', address_line: document.getElementById('addrLine')?document.getElementById('addrLine').value.trim():'', city: document.getElementById('addrCity')?document.getElementById('addrCity').value.trim():'', state: document.getElementById('addrState')?document.getElementById('addrState').value.trim():'', pincode: document.getElementById('addrPin')?document.getElementById('addrPin').value.trim():'', is_default: true };
     var res = await sb.from('addresses').insert(addr);
     if (res.error) { showToast('Error saving address'); return; }
     showToast('Address saved! 🌸');
     var p = document.getElementById('addressPanel'); if (p) p.remove();
   }
   
   /* ── WISHLIST PANEL — shows product images ── */
   async function openWishlistPanel() {
     var m = document.getElementById('userDropMenu'); if (m) m.remove();
     var ids = currentUser ? wishlistIds : getGuestWishlist();
     var wishProducts = (typeof products !== 'undefined') ? products.filter(function(p){ return ids.has(p.id); }) : [];
     var panel = document.createElement('div'); panel.id = 'wishlistPanel';
     var itemsHTML = !wishProducts.length
       ? '<p class="panel-empty">Your wishlist is empty 🌸<br><br><a href="shop.html" style="color:var(--rose);text-decoration:none">Browse candles →</a></p>'
       : wishProducts.map(function(p){
           return '<div class="wishlist-item">' +
             '<div class="wl-img-wrap"><img src="' + p.image + '" alt="' + p.name + '" class="wl-img" onerror="this.parentElement.innerHTML=\'<span style=\\\"font-size:1.8rem\\\">' + p.emoji + '</span>\'"/></div>' +
             '<div class="wishlist-item-info">' +
               '<div class="wishlist-item-name">' + p.name + '</div>' +
               '<div class="wishlist-item-price">from ₹' + p.fragrances[0].price + '</div>' +
               '<button class="wl-shop-btn" onclick="document.getElementById(\'wishlistPanel\').remove();openProductModal(' + p.id + ')">Customise ✿</button>' +
             '</div>' +
             '<button class="wishlist-remove" onclick="removeFromWishlistPanel(' + p.id + ',this)">✕</button>' +
           '</div>';
         }).join('');
     panel.innerHTML =
       '<div class="side-panel-overlay" onclick="document.getElementById(\'wishlistPanel\').remove()"></div>' +
       '<div class="side-panel">' +
         '<div class="side-panel-header"><h3>Wishlist 🤍 (' + wishProducts.length + ')</h3><button onclick="document.getElementById(\'wishlistPanel\').remove()">✕</button></div>' +
         '<div class="side-panel-body">' + itemsHTML + '</div>' +
       '</div>';
     document.body.appendChild(panel);
   }
   
   async function removeFromWishlistPanel(pid, btn) {
     if (currentUser) {
       await sb.from('wishlist').delete().eq('user_id', currentUser.id).eq('product_id', pid);
       wishlistIds.delete(pid);
     } else {
       var gw = getGuestWishlist(); gw.delete(pid); saveGuestWishlist(gw);
     }
     var item = btn.closest('.wishlist-item'); if (item) item.remove();
     renderWishlistHearts(); updateWishlistCount();
   }
   
   document.addEventListener('DOMContentLoaded', function() {
     initAuth().then(function(){ updateCartUI(); updateWishlistCount(); });
   });