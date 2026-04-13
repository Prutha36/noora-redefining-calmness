/* ============================================================
   js/checkout.js  —  UPI + WhatsApp payment modal
   ============================================================ */
   const UPI_CONFIG = {
    upiId:    'archana.khandelwal-rediffmail.com@okhdfcbank',
    name:     'Noora Candles',
    qrImage:  'images/UPI Id.jpeg',
    whatsapp: '917506060321',
  };
  
  function openCheckout() {
    if (cart.length === 0) return;
    closeCart();
  
    if (typeof appliedCoupon !== 'undefined') appliedCoupon = null;
    const couponInput = document.getElementById('couponInput');
    if (couponInput) couponInput.value = '';
    const couponErr = document.getElementById('couponError');
    if (couponErr) couponErr.textContent = '';
    const couponOk = document.getElementById('couponSuccess');
    if (couponOk) couponOk.textContent = '';
  
    document.getElementById('upiIdValue').textContent = UPI_CONFIG.upiId;
    document.getElementById('upiName').textContent    = UPI_CONFIG.name;
  
    const qrImg = document.getElementById('upiQrImg');
    if (UPI_CONFIG.qrImage) {
      qrImg.innerHTML = `<img src="${UPI_CONFIG.qrImage}" alt="UPI QR Code"
        onerror="this.parentElement.innerHTML='<span style=\\'font-size:2rem\\'>📷</span><small>QR not found</small>'"/>`;
    } else {
      qrImg.innerHTML = '<span style="font-size:2rem">📷</span><small>Add your QR image</small>';
    }
  
    document.getElementById('checkoutOverlay').classList.add('open');
    document.getElementById('checkoutModal').classList.add('open');
    updateCheckoutTotal();
  }
  
  function closeCheckoutModal() {
    document.getElementById('checkoutOverlay').classList.remove('open');
    document.getElementById('checkoutModal').classList.remove('open');
  }
  
  function copyUpiId() {
    navigator.clipboard.writeText(UPI_CONFIG.upiId).then(() => {
      const btn = document.getElementById('upiCopyBtn');
      btn.textContent = 'Copied ✓';
      setTimeout(() => btn.textContent = 'Copy', 2000);
    });
  }
  
  async function confirmUpiPayment() {
    const fname = document.getElementById('sf-fname')?.value.trim() || '';
    const lname = document.getElementById('sf-lname')?.value.trim() || '';
    const phone = document.getElementById('sf-phone')?.value.trim() || '';
    const address  = document.getElementById('sf-address')?.value.trim() || '';
    const email = document.getElementById('sf-email')?.value.trim() || '';
    const customerName = [fname, lname].filter(Boolean).join(' ') || 'Customer';
  
    const subtotal = getCartTotal();
    const discount = typeof getCouponDiscount === 'function' ? getCouponDiscount(subtotal) : 0;
    const total = Math.max(0, subtotal - discount);
  
    // disable confirm button to prevent double submit
    const confirmBtn = document.querySelector('.upi-confirm-btn');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Processing...';
    }
  
    // 1. save to Supabase
    if (typeof saveOrder === 'function') {
      saveOrder([...cart], total, 'UPI', { name: customerName, city, phone, email });
    }
  
    // 2. send both emails simultaneously
    const emailPromises = [];
  
    if (email && typeof sendConfirmationEmail === 'function') {
      emailPromises.push(sendConfirmationEmail(email, customerName, [...cart], total, discount));
    }
  
    if (typeof sendOwnerNotificationEmail === 'function') {
      emailPromises.push(sendOwnerNotificationEmail(customerName, phone, city, email, [...cart], total, discount, 'UPI'));
    }
  
    // wait for emails to send before clearing cart
    await Promise.allSettled(emailPromises);
  
    // 3. clear cart
    if (typeof removeCoupon === 'function') removeCoupon();
    cart = []; saveCart(); updateCartUI();
  
    // 4. show thank you screen — absolutely no WhatsApp
    showThankYouScreen();
  }
  
  function orderViaWhatsApp() {
    const fname = document.getElementById('sf-fname').value.trim();
    const lname = document.getElementById('sf-lname').value.trim();
    const phone = document.getElementById('sf-phone').value.trim();
    const address  = document.getElementById('sf-address').value.trim();
    const email = document.getElementById('sf-email')?.value.trim() || '';
  
    const subtotal = getCartTotal();
    const discount = typeof getCouponDiscount === 'function' ? getCouponDiscount(subtotal) : 0;
    const total = Math.max(0, subtotal - discount);
  
    const itemLines = cart.map((i, idx) =>
      `${idx + 1}. ${i.name} x ${i.qty} = Rs.${(i.price * i.qty).toFixed(2)}`
    ).join('\n');
  
    const fullName = [fname, lname].filter(Boolean).join(' ');
    const couponLine = (typeof appliedCoupon !== 'undefined' && appliedCoupon)
      ? `Coupon: ${appliedCoupon.code} (- Rs.${discount.toFixed(2)})\n`
      : '';
  
    const msg = encodeURIComponent(
      `Hi, I'd like to place an order from Noora Candles.\n\n` +
      `Name: ${fullName || 'Customer'}\n` +
      `${phone ? 'Phone: ' + phone + '\n' : ''}` +
      `${city ? 'City: ' + city + '\n' : ''}` +
      `─────────────────────\n` +
      `ORDER ITEMS\n` +
      `${itemLines}\n` +
      `─────────────────────\n` +
      `${couponLine}` +
      `Total: Rs.${total.toFixed(2)}\n` +
      `─────────────────────\n` +
      `Please share payment details. Thank you!`
    );
  
    // send emails in background
    if (typeof sendOwnerNotificationEmail === 'function') {
      sendOwnerNotificationEmail(fullName, phone, address, email, [...cart], total, discount, 'WhatsApp');
    }
    if (email && typeof sendConfirmationEmail === 'function') {
      sendConfirmationEmail(email, fullName, [...cart], total, discount);
    }
  
    // open WhatsApp for customer to send their order message to you
    window.open(`https://wa.me/${UPI_CONFIG.whatsapp}?text=${msg}`, '_blank');
  }
  
  /* ── QR LIGHTBOX ── */
  function openQrLightbox() {
    if (!UPI_CONFIG.qrImage) return;
    let overlay = document.getElementById('qrLightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'qr-lightbox-overlay';
      overlay.id = 'qrLightbox';
      overlay.innerHTML = `<img src="${UPI_CONFIG.qrImage}" alt="UPI QR Code"/>`;
      overlay.onclick = () => overlay.classList.remove('open');
      document.body.appendChild(overlay);
    }
    overlay.classList.add('open');
  }
  
  /* ── THANK YOU SCREEN ── */
  function showThankYouScreen() {
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('checkoutOverlay');
    if (!modal) return;
  
    // keep overlay and modal open but replace content
    modal.style.maxHeight = '90vh';
    modal.innerHTML = `
      <div class="thankyou-screen">
        <div class="thankyou-icon">🌸</div>
        <h2 class="thankyou-title">Thank You!</h2>
        <p class="thankyou-subtitle">Your order has been placed successfully.</p>
        <p class="thankyou-message">
          We've received your payment and will verify it shortly.
          You will receive an order confirmation on your email within a few minutes.
          We'll reach out with shipping details within 24 hours.
        </p>
        <div class="thankyou-divider">❀ ✿ ❀</div>
        <p class="thankyou-redirect">Redirecting to home in <span id="countdownNum">120</span> seconds...</p>
        <button class="thankyou-home-btn" onclick="window.location.href='index.html'">
          Continue Shopping
        </button>
      </div>
    `;
  
    // remove the overlay click-to-close so user can't accidentally close
    if (overlay) overlay.onclick = null;
  
    let seconds = 120;
    const countdown = setInterval(() => {
      seconds--;
      const el = document.getElementById('countdownNum');
      if (el) el.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(countdown);
        window.location.href = 'index.html';
      }
    }, 1000);
  }