/* ============================================================
   js/coupons.js — Coupon codes
   ============================================================ */

   const COUPONS = {
    'NOORA10': {
      type: 'percent',
      value: 10,
      description: '10% off your order'
    },
    'NOORA20': {
      type: 'percent',
      value: 20,
      description: '20% off your order'
    },
    'WELCOME100': {
      type: 'fixed',
      value: 100,
      description: '₹100 off your order'
    },
    'FREESHIP': {
      type: 'fixed',
      value: 50,
      description: '₹50 off your order'
    },
    'FREECANDLE': {
      type: 'free_product',
      productId: 7, // Minted Roses — change to any product id
      description: 'Free Minted Roses candle added to your cart!'
    },
  };
  
  let appliedCoupon = null;
  
  function applyCoupon(code) {
    const coupon = COUPONS[code.trim().toUpperCase()];
    if (!coupon) {
      setCouponError('Invalid coupon code. Please try again.');
      return;
    }
    appliedCoupon = { code: code.trim().toUpperCase(), ...coupon };
  
    if (coupon.type === 'free_product') {
      const p = products.find(x => x.id === coupon.productId);
      if (p) {
        const existing = cart.find(i => i.pid === p.id && i.fragIdx === 0 && i.sizeIdx === 0);
        if (!existing) {
          cart.push({
            pid: p.id, fragIdx: 0, sizeIdx: 0,
            name: `${p.name} — ${p.fragrances[0].name}, ${p.sizes[0].label} (FREE)`,
            emoji: p.emoji, price: 0, qty: 1, isFreeGift: true
          });
          saveCart();
          updateCartUI();
        }
      }
    }
  
    setCouponSuccess(`✿ ${coupon.description}`);
    updateCheckoutTotal();
  }
  
  function removeCoupon() {
    if (appliedCoupon?.type === 'free_product') {
      cart = cart.filter(i => !i.isFreeGift);
      saveCart();
      updateCartUI();
    }
    appliedCoupon = null;
    const input = document.getElementById('couponInput');
    if (input) input.value = '';
    setCouponError('');
    setCouponSuccess('');
    updateCheckoutTotal();
  }
  
  function getCouponDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return (subtotal * appliedCoupon.value) / 100;
    if (appliedCoupon.type === 'fixed') return Math.min(appliedCoupon.value, subtotal);
    return 0;
  }
  
  function setCouponError(msg) {
    const el = document.getElementById('couponError');
    const ok = document.getElementById('couponSuccess');
    if (el) el.textContent = msg;
    if (ok) ok.textContent = '';
  }
  
  function setCouponSuccess(msg) {
    const el = document.getElementById('couponSuccess');
    const err = document.getElementById('couponError');
    if (el) el.textContent = msg;
    if (err) err.textContent = '';
  }
  
  function updateCheckoutTotal() {
    const subtotal = getCartTotal();
    const discount = getCouponDiscount(subtotal);
    const total = Math.max(0, subtotal - discount);
  
    const summaryEl = document.getElementById('orderSummary');
    if (!summaryEl) return;
  
    const rows = cart.map(i =>
      `<div class="stripe-order-row">
        <span>${i.name}</span>
        <span>${i.price === 0 ? 'FREE' : '₹' + (i.price * i.qty).toFixed(2)}</span>
      </div>`
    ).join('');
  
    const discountRow = discount > 0 ? `
      <div class="stripe-order-row" style="color:var(--leaf)">
        <span>Discount (${appliedCoupon.code})</span>
        <span>− ₹${discount.toFixed(2)}</span>
      </div>` : '';
  
    summaryEl.innerHTML = `
      ${rows}
      ${discountRow}
      <div class="stripe-order-row total">
        <span>Total</span>
        <span>₹${total.toFixed(2)}</span>
      </div>
    `;
  
    const upiTotal = document.getElementById('upiPayTotal');
    if (upiTotal) upiTotal.textContent = '₹' + total.toFixed(2);
  }