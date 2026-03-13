/* ============================================================
   js/checkout.js  —  UPI + WhatsApp payment modal
   ============================================================ */

   const UPI_CONFIG = {
    upiId:    'archana.khandelwal-rediffmail.com@okhdfcbank',
    name:     'Noora Candles',
    qrImage:  '/Users/pruthatrivedi/Desktop/noora-site/images/UPI Id.jpeg',
    whatsapp: '917506060321',  // ✅ removed the + sign
  };
  
  function openCheckout() {
    if (cart.length === 0) return;
    closeCart();
  
    const total = getCartTotal();
  
    document.getElementById('orderSummary').innerHTML =
      cart.map(i => `
        <div class="stripe-order-row">
          <span>${i.emoji} ${i.name} × ${i.qty}</span>
          <span>₹${(i.price * i.qty).toFixed(2)}</span>
        </div>`).join('') +
      `<div class="stripe-order-row total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>`;
  
    document.getElementById('upiPayTotal').textContent = '₹' + total.toFixed(2);
    document.getElementById('upiIdValue').textContent  = UPI_CONFIG.upiId;
    document.getElementById('upiName').textContent     = UPI_CONFIG.name;
  
    const qrImg = document.getElementById('upiQrImg');
    if (UPI_CONFIG.qrImage) {
      qrImg.innerHTML = `<img src="${UPI_CONFIG.qrImage}" alt="UPI QR Code"
        onerror="this.parentElement.innerHTML='<span style=\\'font-size:2rem\\'>📷</span><small>Add your QR to<br>images/upi-qr.jpeg</small>'"/>`;
    } else {
      qrImg.innerHTML = '<span style="font-size:2rem">📷</span><small>Add your QR to<br>images/upi-qr.jpeg</small>';
    }
  
    document.getElementById('checkoutOverlay').classList.add('open');
    document.getElementById('checkoutModal').classList.add('open');
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
  
  function confirmUpiPayment() {
    showToast('🌸 Order received! We\'ll confirm once we see your payment.');
    closeCheckoutModal();
    cart = []; saveCart(); updateCartUI();
  }
  
  function orderViaWhatsApp() {
    const fname = document.getElementById('sf-fname').value.trim();
    const city  = document.getElementById('sf-city').value.trim();
    const total = getCartTotal();
  
    const itemLines = cart.map(i =>
      `• ${i.emoji} ${i.name} × ${i.qty} = ₹${(i.price * i.qty).toFixed(2)}`
    ).join('\n');
  
    const name = fname ? `Hi, I'm ${fname}${city ? ' from ' + city : ''}.\n\n` : '';
  
    const msg = encodeURIComponent(
      `${name}I'd like to place an order from Noora Candles 🕯️\n\n` +
      `${itemLines}\n\n` +
      `*Total: ₹${total.toFixed(2)}*\n\n` +
      `Please share payment details. Thank you! 🌸`
    );
  
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