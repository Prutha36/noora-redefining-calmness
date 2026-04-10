/* ============================================================
   js/email.js — Customer confirmation + Owner notification
   ============================================================ */

   const EMAILJS_CONFIG = {
    serviceId:       'service_bggoc8i',
    templateId:      'template_4ggghel',
    ownerTemplateId: 'template_bmzfgrm',
    publicKey:       'LeDOm2Sc6lPwDTI0B',
    ownerEmail:      'noorascandles@gmail.com',
  };
  
  function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    }
  }
  
  function buildOrderItemsHTML(cartItems) {
    return cartItems.map(item => {
      const p = products.find(x => x.id === item.pid);
      const imgSrc = p?.fragrances[item.fragIdx]?.image || p?.image || '';
      const absoluteImg = imgSrc
        ? `https://noora-redefining-calmness.vercel.app/${imgSrc}`
        : '';
      const parts  = item.name.split(' — ');
      const title  = parts[0];
      const variant = parts[1] || '';
      return `
        <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem 0;border-bottom:1px solid rgba(196,104,122,0.1);">
          ${absoluteImg
            ? `<img src="${absoluteImg}" alt="${title}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid rgba(196,104,122,0.2);"/>`
            : `<div style="width:60px;height:60px;background:#fdf0f4;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">${p?.emoji || '🕯️'}</div>`
          }
          <div style="flex:1;">
            <div style="font-weight:600;color:#7a3048;font-size:0.9rem;">${title}</div>
            ${variant ? `<div style="color:#9c7a6d;font-size:0.78rem;">${variant}</div>` : ''}
            <div style="color:#c4687a;font-size:0.82rem;margin-top:2px;">₹${(item.price * item.qty).toFixed(2)} × ${item.qty}</div>
          </div>
        </div>`;
    }).join('');
  }
  
  async function sendConfirmationEmail(customerEmail, customerName, cartItems, total, discount) {
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS not loaded');
      return;
    }
    const orderItemsHTML = buildOrderItemsHTML(cartItems);
    const discountLine = discount > 0
      ? `<div style="color:#3d6b4f;font-size:0.85rem;margin-top:0.5rem;">Discount applied: − ₹${discount.toFixed(2)}</div>`
      : '';
    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        customer_name:  customerName || 'Valued Customer',
        customer_email: customerEmail,
        order_items:    orderItemsHTML,
        order_total:    '₹' + total.toFixed(2),
        discount_line:  discountLine,
      });
      console.log('✓ Customer confirmation email sent to', customerEmail);
    } catch (err) {
      console.error('✗ Customer email failed:', err);
    }
  }
  
  async function sendOwnerNotificationEmail(customerName, phone, city, customerEmail, cartItems, total, discount, paymentMethod) {
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS not loaded');
      return;
    }
    const orderItemsHTML = buildOrderItemsHTML(cartItems);
    const discountLine = discount > 0
      ? `<div style="color:#3d6b4f;margin-top:0.5rem;">Discount: − ₹${discount.toFixed(2)}</div>`
      : '';
    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.ownerTemplateId, {
        owner_email:    EMAILJS_CONFIG.ownerEmail,
        customer_name:  customerName || 'Unknown',
        customer_phone: phone || 'Not provided',
        customer_city:  city || 'Not provided',
        customer_email: customerEmail || 'Not provided',
        payment_method: paymentMethod || 'UPI',
        order_items:    orderItemsHTML,
        order_total:    '₹' + total.toFixed(2),
        discount_line:  discountLine,
      });
      console.log('✓ Owner notification email sent');
    } catch (err) {
      console.error('✗ Owner email failed:', err);
    }
  }