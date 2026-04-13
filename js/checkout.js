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
    var ci = document.getElementById('couponInput');      if (ci) ci.value = '';
    var ce = document.getElementById('couponError');      if (ce) ce.textContent = '';
    var cs = document.getElementById('couponSuccess');    if (cs) cs.textContent = '';
    var cr = document.getElementById('couponAppliedRow'); if (cr) cr.style.display = 'none';
  
    var upiVal = document.getElementById('upiIdValue'); if (upiVal) upiVal.textContent = UPI_CONFIG.upiId;
    var upiNm  = document.getElementById('upiName');    if (upiNm)  upiNm.textContent  = UPI_CONFIG.name;
  
    var qrImg = document.getElementById('upiQrImg');
    if (qrImg) {
      qrImg.innerHTML = UPI_CONFIG.qrImage
        ? '<img src="' + UPI_CONFIG.qrImage + '" alt="UPI QR Code"' +
          ' onerror="this.parentElement.innerHTML=\'<span style=\\\'font-size:2rem\\\'>📷</span><small>QR not found</small>\'">'
        : '<span style="font-size:2rem">📷</span><small>Add your QR image</small>';
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
    navigator.clipboard.writeText(UPI_CONFIG.upiId).then(function() {
      var btn = document.getElementById('upiCopyBtn'); if (!btn) return;
      btn.textContent = 'Copied ✓';
      setTimeout(function(){ btn.textContent = 'Copy'; }, 2000);
    });
  }
  
  /* ── read form fields safely ── */
  function getCheckoutFields() {
    function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
    return {
      fname:   val('sf-fname'),
      lname:   val('sf-lname'),
      phone:   val('sf-phone'),
      address: val('sf-address'),
      email:   val('sf-email'),
    };
  }
  
  /* ── UPI confirm ── */
  async function confirmUpiPayment() {
    var f            = getCheckoutFields();
    var customerName = [f.fname, f.lname].filter(Boolean).join(' ') || 'Customer';
    var subtotal     = getCartTotal();
    var discount     = (typeof getCouponDiscount === 'function') ? getCouponDiscount(subtotal) : 0;
    var total        = Math.max(0, subtotal - discount);
  
    var confirmBtn = document.querySelector('.upi-confirm-btn');
    if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.textContent = 'Processing...'; }
  
    if (typeof saveOrder === 'function') {
      saveOrder([...cart], total, 'UPI', { name: customerName, address: f.address, phone: f.phone, email: f.email });
    }
  
    var emailPromises = [];
    if (f.email && typeof sendConfirmationEmail === 'function') {
      emailPromises.push(sendConfirmationEmail(f.email, customerName, [...cart], total, discount));
    }
    if (typeof sendOwnerNotificationEmail === 'function') {
      emailPromises.push(sendOwnerNotificationEmail(customerName, f.phone, f.address, f.email, [...cart], total, discount, 'UPI'));
    }
    await Promise.allSettled(emailPromises);
  
    if (typeof removeCoupon === 'function') removeCoupon();
    cart = []; saveCart(); updateCartUI();
    showThankYouScreen();
  }
  
  /* ── WhatsApp order ── */
  function orderViaWhatsApp() {
    var f        = getCheckoutFields();
    var subtotal = getCartTotal();
    var discount = (typeof getCouponDiscount === 'function') ? getCouponDiscount(subtotal) : 0;
    var total    = Math.max(0, subtotal - discount);
    var fullName = [f.fname, f.lname].filter(Boolean).join(' ') || 'Customer';
  
    var itemLines = cart.map(function(item, idx){
      return (idx + 1) + '. ' + item.name + ' x ' + item.qty + ' = Rs.' + (item.price * item.qty).toFixed(2);
    }).join('\n');
  
    var couponLine = (typeof appliedCoupon !== 'undefined' && appliedCoupon)
      ? 'Coupon: ' + appliedCoupon.code + ' (- Rs.' + discount.toFixed(2) + ')\n'
      : '';
  
    var divider = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500';
  
    var msg = encodeURIComponent(
      'Hi, I\'d like to place an order from Noora Candles.\n\n' +
      'Name: '    + fullName + '\n' +
      (f.phone   ? 'Phone: '   + f.phone   + '\n' : '') +
      (f.address ? 'Address: ' + f.address + '\n' : '') +
      divider + '\n' +
      'ORDER ITEMS\n' +
      itemLines  + '\n' +
      divider + '\n' +
      couponLine +
      'Total: Rs.' + total.toFixed(2) + '\n' +
      divider + '\n' +
      'Please share payment details. Thank you!'
    );
  
    if (typeof sendOwnerNotificationEmail === 'function') {
      sendOwnerNotificationEmail(fullName, f.phone, f.address, f.email, [...cart], total, discount, 'WhatsApp');
    }
    if (f.email && typeof sendConfirmationEmail === 'function') {
      sendConfirmationEmail(f.email, fullName, [...cart], total, discount);
    }
  
    window.open('https://wa.me/' + UPI_CONFIG.whatsapp + '?text=' + msg, '_blank');
  }
  
  /* ── QR lightbox ── */
  function openQrLightbox() {
    if (!UPI_CONFIG.qrImage) return;
    var overlay = document.getElementById('qrLightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'qr-lightbox-overlay';
      overlay.id = 'qrLightbox';
      overlay.innerHTML = '<img src="' + UPI_CONFIG.qrImage + '" alt="UPI QR Code"/>';
      overlay.onclick = function(){ overlay.classList.remove('open'); };
      document.body.appendChild(overlay);
    }
    overlay.classList.add('open');
  }
  
  /* ── Thank you screen ── */
  function showThankYouScreen() {
    var modal   = document.getElementById('checkoutModal');
    var overlay = document.getElementById('checkoutOverlay');
    if (!modal) return;
    modal.style.maxHeight = '90vh';
    modal.innerHTML =
      '<div class="thankyou-screen">' +
        '<div class="thankyou-icon">🌸</div>' +
        '<h2 class="thankyou-title">Thank You!</h2>' +
        '<p class="thankyou-subtitle">Your order has been placed successfully.</p>' +
        '<p class="thankyou-message">' +
          'We\'ve received your payment and will verify it shortly. ' +
          'You will receive an order confirmation on your email within a few minutes. ' +
          'We\'ll reach out with shipping details within 24 hours.' +
        '</p>' +
        '<div class="thankyou-divider">❀ ✿ ❀</div>' +
        '<p class="thankyou-redirect">Redirecting to home in <span id="countdownNum">120</span> seconds...</p>' +
        '<button class="thankyou-home-btn" onclick="window.location.href=\'index.html\'">Continue Shopping</button>' +
      '</div>';
    if (overlay) overlay.onclick = null;
    var seconds = 120;
    var countdown = setInterval(function() {
      seconds--;
      var el = document.getElementById('countdownNum'); if (el) el.textContent = seconds;
      if (seconds <= 0) { clearInterval(countdown); window.location.href = 'index.html'; }
    }, 1000);
  }