/* ============================================================
   js/cart.js  —  Cart state, drawer UI, localStorage sync
   ============================================================ */

   let cart = JSON.parse(localStorage.getItem('noora-cart') || '[]');
   

   /* ── SAVE ── */
   function saveCart() {
     localStorage.setItem('noora-cart', JSON.stringify(cart));
   }
   
   /* ── REMOVE by index ── */
   function removeFromCart(idx) {
     cart.splice(idx, 1);
     saveCart();
     updateCartUI();
   }
   
   /* ── QTY by index ── */
   function changeQty(idx, delta) {
     if (!cart[idx]) return;
     cart[idx].qty += delta;
     if (cart[idx].qty <= 0) {
       cart.splice(idx, 1);
     }
     saveCart();
     updateCartUI();
   }
   
   /* ── TOTALS ── */
   function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
   function getCartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
   
   /* ── UPDATE UI ── */
   function updateCartUI() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartFooter  = document.getElementById('cartFooter');
    const cartCountEl = document.getElementById('cartCount');
    if (!cartItemsEl) return;
  
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<div class="cart-empty"><span>🌸</span>Your cart is beautifully empty</div>';
      if (cartFooter) cartFooter.style.display = 'none';
      if (cartCountEl) { cartCountEl.textContent = '0'; cartCountEl.classList.remove('visible'); }
      return;
    }
  
    cart.forEach(item => {
      const p = products.find(x => x.id === item.pid);
      if (p) {
        item.price = computePrice(p, item.fragIdx, item.sizeIdx);
        const frag = p.fragrances[item.fragIdx];
        const size = p.sizes[item.sizeIdx];
        if (frag && size) item.name = `${p.name} — ${frag.name}, ${size.label}`;
      }
    });
    saveCart();
  
    cartItemsEl.innerHTML = cart.map((item, idx) => {
      const p = products.find(x => x.id === item.pid);
      const imgSrc = p?.fragrances[item.fragIdx]?.image || p?.image || '';
      const parts  = item.name.split(' — ');
      const title  = parts[0];
      const variant = parts[1] || '';
      return `
      <div class="cart-item">
        <div class="cart-item-img-wrap">
          ${imgSrc
            ? `<img src="${imgSrc}" alt="${title}" class="cart-item-img"/>`
            : `<div class="cart-item-img-ph">${p?.emoji || '🕯️'}</div>`
          }
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${title}</div>
          ${variant ? `<div class="cart-item-variant">${variant}</div>` : ''}
          <div class="cart-item-price">₹${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
            <button class="cart-remove-pill" onclick="removeFromCart(${idx})">remove</button>
          </div>
        </div>
      </div>`;
    }).join('');
  
    const total = getCartTotal();
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) cartTotalEl.textContent = '₹' + total.toFixed(2);
    if (cartFooter) cartFooter.style.display = 'block';
  
    const isLoggedIn = (typeof currentUser !== 'undefined' && currentUser !== null);
    let nudge = document.getElementById('cartSigninNudge');
    if (isLoggedIn) {
      if (nudge) nudge.remove();
    } else {
      if (!nudge) {
        nudge = document.createElement('div');
        nudge.id = 'cartSigninNudge';
        nudge.className = 'cart-signin-nudge';
        cartFooter.insertBefore(nudge, cartFooter.firstChild);
      }
      nudge.innerHTML = `<span>🌸 <a href="#" onclick="openAuthModal('signin');return false">Sign in</a> to save your cart</span>`;
    }
  
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    if (cartCountEl) {
      cartCountEl.textContent = totalQty;
      totalQty > 0 ? cartCountEl.classList.add('visible') : cartCountEl.classList.remove('visible');
    }
  }
   
   /* ── TOGGLE DRAWER ── */
   function toggleCart() {
     document.getElementById('cartOverlay').classList.toggle('open');
     document.getElementById('cartDrawer').classList.toggle('open');
   }
   function closeCart() {
     document.getElementById('cartOverlay').classList.remove('open');
     document.getElementById('cartDrawer').classList.remove('open');
   }