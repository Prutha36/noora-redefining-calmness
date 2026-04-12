/* ============================================================
   js/fragrance.js — Fragrance browser + custom request
   ============================================================ */

   const SCENT_FAMILIES = {
    floral: {
      label: 'Floral',
      scents: [
        'French Lavender','Rose & Lotus','Pink Rose','Red Rose',
        'Black Rose','Jasmine','Sakura','Orchid','White Tea','Lily', 
        'Lotus','Frangipani','Champaka','Sweet Osmanthus',
        'Pear & Freesia','Cherry Blossom', 'Mogra'
      ],
    },
    fresh: {
      label: 'Fresh & Green',
      scents: [
        'Eucalyptus','Peppermint','Lemongrass','Lemongrass & Chamomile',
        'Rosemary','Ocean Breeze','Bergamot','Lemon',
        'Orange & Eucalyptus','White Mask','Vanilla & Mint',
      ],
    },
    woody: {
      label: 'Woody & Arabic',
      scents: [
        'Agarwood','Agarwood & Rose','Sandalwood','Patchouli',
        'Cinnamon','Suede','Midnight','Opium',
      ],
    },
    fruity: {
      label: 'Fruity',
      scents: [
        'Strawberry','Peach','Watermelon','Candy Melon','Mango',
        'Green Apple','Pomegranate','Mix Fruit','Lemon','Orange',
        'Coconut','Passion Fruit',
      ],
    },
    cafe: {
      label: 'Café',
      scents: [
        'Coffee','Vanilla','Chocolate','Caramel','Pistachio',
        'Matcha','Coconut','Pandan',
      ],
    },
  };
  
  /* ── SCENT → PRODUCT ID MAPPING ── */
  const SCENT_TO_PRODUCTS = {
    /* Floral */
    'French Lavender':   [1,2,6,7,8,9,11,21,22,23,24,25,26,27,28,29],
    'Rose & Lotus':      [1,2,7,8,9,11,13,14,15,16,19,20,24,25,26,30],
    'Pink Rose':         [1,2,8,9,11,24,25,26,28],
    'Red Rose':          [1,2,7,24,25,26],
    'Black Rose':        [24],
    'Jasmine':           [1,2,13,24],
    'Sakura':            [1,2,9,11,21,24],
    'Orchid':            [1,2,6,9,21,27],
    'White Tea':         [6,21,22,23,27,29],
    'Lily':              [1,2,6,9,27,29],
    'Lotus':             [1,2,9,24,27],
    'Frangipani':        [1,2,24,27],
    'Champaka':          [1,2,9,24,27],
    'Sweet Osmanthus':   [8,28],
    'Cherry Blossom':    [1,2,8,11,24,25,26],
    'Pear & Freesia':    [1],
    'Mogra':             [2],
    
  
    /* Fresh & Green */
    'Eucalyptus':            [7,22,23],
    'Peppermint':            [7],
    'Lemongrass':            [6,11,14],
    'Lemongrass & Chamomile':[14],
    'Rosemary':              [7],
    'Ocean Breeze':          [6,7,16,21,22,23,27,29],
    'Bergamot':              [21,22,23,29],
    'Lemon':                 [21,23,29],
    'White Mask':            [22,23],
    'Vanilla & Mint':        [7,23,28],
  
    /* Woody & Arabic */
    'Agarwood':        [6,17,18],
    'Agarwood & Rose': [17,18],
    'Sandalwood':      [6,7,17,18,21,22,23,29],
    'Patchouli':       [7,17,18,21,22,23],
    'Cinnamon':        [17,18,23],
    'Suede':           [17,18,23],
    'Midnight':        [17,18],
    'Opium':           [17,18],
  
    /* Fruity */
    'Strawberry':   [3,4,5,8,10,11,12,26,28],
    'Peach':        [8,11],
    'Watermelon':   [11],
    'Candy Melon':  [8,11],
    'Mango':        [12,15,20],
    'Lemon':        [21,23,29],
    'Orange':       [19],
    'Mix Fruit':    [10,15,21],
    'Coconut':      [4,5,12],
    'Passion Fruit':[10,19],
  
    /* Café */
    'Vanilla':   [3,4,5,8,12,26,28,29,33],
    'Coffee':    [3,4,5,12,28,37],
    'Chocolate': [3,4,5,12,28,35,36],
    'Caramel':   [3,4,5,12,31,32],
    'Matcha':    [3,4,5,12],
    'Coconut':   [4,5,12],
    'Milk': [34],
  };
  
  let activeScentFamily = 'all';
  let activeScent = null;
  
  function setFragFamily(fam, btn) {
    document.querySelectorAll('.frag-family-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    activeScentFamily = fam;
    activeScent = null;
    const r = document.getElementById('fragranceResults');
    if (r) r.style.display = 'none';
    renderScentGrid();
  }
  
  function renderScentGrid() {
    const grid = document.getElementById('fragranceScentGrid');
    if (!grid) return;
    const list = activeScentFamily === 'all'
      ? Object.values(SCENT_FAMILIES).flatMap(f => f.scents)
      : SCENT_FAMILIES[activeScentFamily]?.scents || [];
    grid.innerHTML = list.map(s =>
      `<button class="fragrance-scent-pill${activeScent===s?' active':''}"
        onclick="selectScentFromBrowser('${s.replace(/'/g,"\\'")}',this)">${s}</button>`
    ).join('');
  }
  
  function selectScentFromBrowser(scent, btn) {
    document.querySelectorAll('.fragrance-scent-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    activeScent = scent;
    const ids = SCENT_TO_PRODUCTS[scent] || [];
    const matched = products.filter(p => ids.includes(p.id));
    const results = document.getElementById('fragranceResults');
    const label   = document.getElementById('fragranceResultsLabel');
    const shopBtn = document.getElementById('viewInShopBtn');
    if (results) results.style.display = 'block';
    if (label) label.textContent = matched.length + ' candle' + (matched.length!==1?'s':'') + ' available in ' + scent;
    if (shopBtn) shopBtn.href = `shop.html?scent=${encodeURIComponent(scent)}`;
    if (typeof renderFragProducts === 'function') renderFragProducts('fragranceProductsGrid', matched);
  }
  
  function initFragranceFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const scent = params.get('scent');
    if (!scent) return;
    const fragTab = document.querySelector('.shop-mode-tab:nth-child(2)');
    if (fragTab && typeof setShopMode === 'function') setShopMode('fragrance', fragTab);
    setTimeout(() => {
      document.querySelectorAll('.fragrance-scent-pill,.frag-scent-pill').forEach(p => {
        if (p.textContent.trim() === scent) p.click();
      });
    }, 200);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    renderScentGrid();
    initFragranceFromUrl();
  });
  
  /* ── CUSTOM FRAGRANCE REQUEST ── */
  function getCustomFragData() {
    return {
      name:    document.getElementById('cf-name')?.value.trim() || '',
      phone:   document.getElementById('cf-phone')?.value.trim() || '',
      email:   document.getElementById('cf-email')?.value.trim() || '',
      product: document.getElementById('cf-product')?.value || 'Not specified',
      desc:    document.getElementById('cf-desc')?.value.trim() || '',
      qty:     document.getElementById('cf-qty')?.value || '1 candle',
    };
  }
  
  function validateCustomFrag() {
    const d = getCustomFragData();
    if (!d.name)              { showToast('Please enter your name 🌸'); return null; }
    if (!d.phone && !d.email) { showToast('Please enter your phone or email 🌸'); return null; }
    if (!d.desc)              { showToast('Please describe your fragrance idea 🌸'); return null; }
    return d;
  }
  
  async function sendCustomFragEmail() {
    const d = validateCustomFrag();
    if (!d) return;
    if (!d.email) { showToast('Please enter your email 🌸'); return; }
    if (typeof emailjs === 'undefined') { showToast('Email not loaded. Try WhatsApp.'); return; }
    try {
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.ownerTemplateId, {
        owner_email:    EMAILJS_CONFIG.ownerEmail,
        customer_name:  d.name,
        customer_phone: d.phone || 'Not provided',
        customer_city:  'Custom Fragrance Request',
        customer_email: d.email,
        payment_method: 'Custom Fragrance Request',
        order_items: `
          <div style="padding:1rem 0;font-size:0.9rem;color:#6b4a3d;line-height:1.8;">
            <div><strong>Candle:</strong> ${d.product}</div>
            <div><strong>Fragrance idea:</strong> ${d.desc}</div>
            <div><strong>Quantity:</strong> ${d.qty}</div>
          </div>`,
        order_total:   'Custom pricing',
        discount_line: '',
      });
      showCustomFragSuccess();
    } catch (err) {
      showToast('Failed to send. Please try WhatsApp.');
      console.error(err);
    }
  }
  
  function sendCustomFragWhatsApp() {
    const d = validateCustomFrag();
    if (!d) return;
    const msg = encodeURIComponent(
      `Hi Noora Candles!\n\nI'd like to request a custom fragrance.\n\n` +
      `Name: ${d.name}\n` +
      `${d.phone ? 'Phone: ' + d.phone + '\n' : ''}` +
      `${d.email ? 'Email: ' + d.email + '\n' : ''}` +
      `Candle: ${d.product}\n` +
      `Quantity: ${d.qty}\n\n` +
      `Fragrance idea:\n${d.desc}`
    );
    window.open(`https://wa.me/917506060321?text=${msg}`, '_blank');
    showCustomFragSuccess();
  }
  
  function showCustomFragSuccess() {
    const form = document.getElementById('customFragForm');
    if (!form) return;
    form.innerHTML = `
      <div class="custom-frag-success">
        <div style="font-size:3rem;margin-bottom:1rem;">🌸</div>
        <h3>Request received!</h3>
        <p>We'll get back to you within 24 hours with a custom recommendation.</p>
        <button class="btn-secondary" onclick="location.reload()" style="margin-top:1.5rem">Submit another</button>
      </div>`;
  }