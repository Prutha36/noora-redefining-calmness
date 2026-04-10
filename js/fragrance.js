/* ============================================================
   js/fragrance.js — Fragrance browser page + shop filter
   ============================================================ */

   const SCENT_FAMILIES = {
    floral: {
      label: 'Floral',
      scents: [
        'French Lavender','Lavender Fresh','Rose & Lotus','Pink Rose',
        'Red Rose','Jasmine','Mogra','Sakura','Orchid','White Tea',
        'Butterfly Pea','Ylang Ylang','Sweet Osmanthus','Lotus',
        'Pear & Freesia','Cherry Blossom',
      ],
    },
    fresh: {
      label: 'Fresh & Green',
      scents: [
        'Eucalyptus','Peppermint','Lemongrass','Lemongrass & Chamomile',
        'Rosemary','Ocean Breeze','Orange & Eucalyptus','Orange & Jasmine',
      ],
    },
    woody: {
      label: 'Woody & Arabic',
      scents: [
        'Agarwood','Sandalwood','Patchouli','Cinnamon',
        'Opium','Suede','Midnight',
      ],
    },
    fruity: {
      label: 'Fruity',
      scents: [
        'Mango','Peach','Strawberry','Watermelon','Green Apple',
        'Pomegranate','Mix Fruit','Coconut','Passion Fruit','Lemon','Orange',
      ],
    },
    cafe: {
      label: 'Café',
      scents: ['Coffee','Sweet Caramel','Vanilla','Chocolate','Pandan','Coconut'],
    },
  };
  
  /* Map every scent to the product IDs it works with */
  const SCENT_TO_PRODUCTS = {
    'French Lavender':        [1,2,8,9,11,20],
    'Lavender Fresh':         [1,2,8,9,11,20],
    'Rose & Lotus':           [1,2,7,8,9,11,13,6],
    'Pink Rose':              [1,2,8,9,11],
    'Red Rose':               [1,2,8,9,11],
    'Jasmine':                [1,2,7,9,11,13,6],
    'Mogra':                  [1,2,7,9,11,13,6],
    'Sakura':                 [1,2,9,11],
    'Orchid':                 [1,2,9,11],
    'White Tea':              [1,2,9,11,20],
    'Butterfly Pea':          [1,2,9,11,20],
    'Ylang Ylang':            [1,2,9,13],
    'Sweet Osmanthus':        [1,2,8,9],
    'Lotus':                  [1,9],
    'Pear & Freesia':         [6,8],
    'Cherry Blossom':         [6,8],
    'Eucalyptus':             [7,14,16],
    'Peppermint':             [7,14],
    'Lemongrass':             [6,7,11,14],
    'Lemongrass & Chamomile': [7,14],
    'Rosemary':               [7,14],
    'Ocean Breeze':           [16],
    'Orange & Eucalyptus':    [7,19],
    'Orange & Jasmine':       [7,13],
    'Agarwood':               [17,18],
    'Sandalwood':             [6,17,18],
    'Patchouli':              [17,18],
    'Cinnamon':               [17,18],
    'Opium':                  [17,18],
    'Suede':                  [17,18],
    'Midnight':               [17,18],
    'Mango':                  [12,15,20],
    'Peach':                  [12,15],
    'Strawberry':             [3,10,15],
    'Watermelon':             [10,12],
    'Green Apple':            [10,19],
    'Pomegranate':            [10],
    'Mix Fruit':              [10,15],
    'Coconut':                [4,5,12],
    'Passion Fruit':          [10,19],
    'Lemon':                  [19],
    'Orange':                 [19],
    'Coffee':                 [4,5],
    'Sweet Caramel':          [4,5],
    'Vanilla':                [3,4,6],
    'Chocolate':              [4,5],
    'Pandan':                 [3,4],
  };
  
  let activeScentFamily = 'all';
  let activeScent = null;
  
  function setFragFamily(fam, btn) {
    document.querySelectorAll('.frag-family-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    activeScentFamily = fam;
    activeScent = null;
    const results = document.getElementById('fragranceResults');
    if (results) results.style.display = 'none';
    renderScentGrid();
  }
  
  function renderScentGrid() {
    const grid = document.getElementById('fragranceScentGrid');
    if (!grid) return;
    let list = [];
    if (activeScentFamily === 'all') {
      list = Object.values(SCENT_FAMILIES).flatMap(f => f.scents);
    } else {
      list = SCENT_FAMILIES[activeScentFamily]?.scents || [];
    }
    grid.innerHTML = list.map(s =>
      `<button class="fragrance-scent-pill${activeScent===s?' active':''}"
        onclick="selectScentFromBrowser('${s}', this)">${s}</button>`
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
    const grid    = document.getElementById('fragranceProductsGrid');
    const shopBtn = document.getElementById('viewInShopBtn');
  
    if (results) results.style.display = 'block';
    if (label) label.textContent =
      matched.length + ' candle' + (matched.length !== 1 ? 's' : '') +
      ' available in ' + scent;
  
    /* update "View in Shop" link to pre-filter by scent */
    if (shopBtn) shopBtn.href = `shop.html?scent=${encodeURIComponent(scent)}`;
  
    if (!grid) return;
    if (!matched.length) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-light);font-style:italic;padding:2rem 0;grid-column:1/-1">No candles found for this scent</p>';
      return;
    }
  
    grid.innerHTML = matched.map(p => {
      const defaultPrice = p.fragrances[0].price;
      const fragChips = p.fragrances.map((f, i) =>
        `<button class="frag-chip${i===0?' active':''}" data-idx="${i}"
          onclick="selectFrag(${p.id},${i},this)">${f.name}</button>`
      ).join('');
      const fragOptions = p.fragrances.map((f, i) =>
        `<option value="${i}">${f.name} — ₹${f.price}</option>`
      ).join('');
      const sizeChips = p.sizes.map((s, i) =>
        `<button class="size-chip${i===0?' active':''}" data-idx="${i}"
          onclick="selectSize(${p.id},${i},this)">${s.label}</button>`
      ).join('');
      return `
      <div class="product-card reveal">
        <div class="product-img">
          ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
          <button class="wishlist-btn" data-pid="${p.id}" onclick="toggleWishlist(${p.id},this)">🤍</button>
          <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async"
            onerror="this.outerHTML='<div class=\'product-img-placeholder\'><span>${p.emoji}</span></div>'"/>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="frag-selector">
            <div class="frag-label">Fragrance</div>
            <div class="frag-chips" id="frag-chips-${p.id}">${fragChips}</div>
            <select class="frag-dropdown" id="frag-select-${p.id}"
              onchange="selectFragMobile(${p.id},this.value,this)">${fragOptions}</select>
          </div>
          <div class="size-selector">
            <div class="frag-label">Size</div>
            <div class="size-chips" id="size-chips-${p.id}">${sizeChips}</div>
          </div>
          <div class="product-footer">
            <div class="product-price" id="price-${p.id}">₹${defaultPrice}</div>
            <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
    }).join('');
  
    document.querySelectorAll('#fragranceProductsGrid .product-card.reveal').forEach(el => {
      const obs = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
        { threshold: 0.08 }
      );
      obs.observe(el);
    });
    if (typeof renderWishlistHearts === 'function') renderWishlistHearts();
  }
  
  /* Called from shop.html when ?scent= param is present */
  function initFragranceFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const scent = params.get('scent');
    if (!scent) return;
  
    /* switch to fragrance mode tab in shop */
    const fragTab = document.querySelector('.shop-mode-tab:nth-child(2)');
    if (fragTab) setShopMode('fragrance', fragTab);
  
    /* find and click the matching pill */
    setTimeout(() => {
      const pills = document.querySelectorAll('.frag-scent-pill');
      pills.forEach(p => {
        if (p.textContent === scent) p.click();
      });
      /* if on fragrance.html */
      const fpills = document.querySelectorAll('.fragrance-scent-pill');
      fpills.forEach(p => {
        if (p.textContent === scent) p.click();
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
    if (!d.name) { showToast('Please enter your name 🌸'); return null; }
    if (!d.phone && !d.email) { showToast('Please enter your phone or email 🌸'); return null; }
    if (!d.desc) { showToast('Please describe your fragrance idea 🌸'); return null; }
    return d;
  }
  
  async function sendCustomFragEmail() {
    const d = validateCustomFrag();
    if (!d) return;
    if (!d.email) { showToast('Please enter your email to send by email 🌸'); return; }
  
    if (typeof emailjs === 'undefined') {
      showToast('Email service not loaded. Please try WhatsApp.');
      return;
    }
  
    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.ownerTemplateId,
        {
          owner_email:    EMAILJS_CONFIG.ownerEmail,
          customer_name:  d.name,
          customer_phone: d.phone || 'Not provided',
          customer_city:  'Custom Request',
          customer_email: d.email,
          payment_method: 'Custom Fragrance Request',
          order_items:    `
            <div style="padding:1rem 0;font-size:0.9rem;color:#6b4a3d;line-height:1.8;">
              <div><strong>Candle:</strong> ${d.product}</div>
              <div><strong>Fragrance idea:</strong> ${d.desc}</div>
              <div><strong>Quantity:</strong> ${d.qty}</div>
            </div>`,
          order_total:   'Custom pricing',
          discount_line: '',
        }
      );
      showCustomFragSuccess();
    } catch (err) {
      showToast('Failed to send. Please try WhatsApp instead.');
      console.error(err);
    }
  }
  
  function sendCustomFragWhatsApp() {
    const d = validateCustomFrag();
    if (!d) return;
  
    const msg = encodeURIComponent(
      `Hi Noora Candles!\n\n` +
      `I'd like to request a custom fragrance.\n\n` +
      `─────────────────────\n` +
      `Name: ${d.name}\n` +
      `${d.phone ? 'Phone: ' + d.phone + '\n' : ''}` +
      `${d.email ? 'Email: ' + d.email + '\n' : ''}` +
      `Candle: ${d.product}\n` +
      `Quantity: ${d.qty}\n` +
      `─────────────────────\n` +
      `Fragrance idea:\n${d.desc}\n` +
      `─────────────────────\n` +
      `Looking forward to hearing from you!`
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
        <p>We'll get back to you within 24 hours with a custom fragrance recommendation and pricing.</p>
        <button class="btn-secondary" onclick="resetCustomFragForm()" style="margin-top:1.5rem">
          Submit another request
        </button>
      </div>
    `;
  }
  
  function resetCustomFragForm() {
    const form = document.getElementById('customFragForm');
    if (!form) return;
    location.reload();
  }