/* ============================================================
   js/main.js
   ============================================================ */

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── ACTIVE NAV ── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

/* ── HELPERS ── */
function getSelectedFragrance(pid) {
  if (window.innerWidth < 768) {
    const sel = document.getElementById(`frag-select-${pid}`);
    return sel ? parseInt(sel.value) : 0;
  }
  const active = document.querySelector(`#frag-chips-${pid} .frag-chip.active`);
  return active ? parseInt(active.dataset.idx) : 0;
}

function getSelectedSize(pid) {
  const active = document.querySelector(`#size-chips-${pid} .size-chip.active`);
  return active ? parseInt(active.dataset.idx) : 0;
}

function computePrice(p, fragIdx, sizeIdx) {
  const base = p.fragrances[fragIdx]?.price ?? p.fragrances[0].price;
  const add  = p.sizes[sizeIdx]?.priceAdd ?? 0;
  return base + add;
}

function updateCardPrice(pid, fragIdx, sizeIdx) {
  const p = products.find(x => x.id === pid);
  if (!p) return;
  const fi = fragIdx ?? getSelectedFragrance(pid);
  const si = sizeIdx ?? getSelectedSize(pid);
  const el = document.getElementById(`price-${pid}`);
  if (el) el.textContent = '₹' + computePrice(p, fi, si);
}

/* ── PRODUCT GRID ── */
let activeFilter = 'all';

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = activeFilter === 'all'
  ? products
  : products.filter(p =>
      p.category === activeFilter ||
      p.tag === activeFilter
    );

  grid.innerHTML = filtered.map(p => {
    const defaultPrice = p.fragrances[0].price;

    const fragChips = p.fragrances.map((f, i) => `
      <button class="frag-chip${i === 0 ? ' active' : ''}"
              data-idx="${i}"
              onclick="selectFrag(${p.id}, ${i}, this)">
        ${f.name}
      </button>`).join('');

    const fragOptions = p.fragrances.map((f, i) =>
      `<option value="${i}">${f.name} — ₹${f.price}</option>`
    ).join('');

    const sizeChips = p.sizes.map((s, i) => `
      <button class="size-chip${i === 0 ? ' active' : ''}"
              data-idx="${i}"
              onclick="selectSize(${p.id}, ${i}, this)">
        ${s.label}
      </button>`).join('');

    return `
    <div class="product-card reveal">
      <div class="product-img">
  ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
  <button class="wishlist-btn" data-pid="${p.id}" onclick="toggleWishlist(${p.id}, this)">🤍</button>
        <img src="${p.image}" alt="${p.name}"
          onerror="this.outerHTML='<div class=\'product-img-placeholder\'><span>${p.emoji}</span><p>Add image to<br>${p.image}</p></div>'"
        />
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>

        <div class="frag-selector">
          <div class="frag-label">Fragrance</div>
          <div class="frag-chips" id="frag-chips-${p.id}">${fragChips}</div>
          <select class="frag-dropdown" id="frag-select-${p.id}"
                  onchange="selectFragMobile(${p.id}, this.value, this)">
            ${fragOptions}
          </select>
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

  /* re-observe for scroll reveal */
  const revealObs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.product-card.reveal').forEach(el => revealObs.observe(el));
}

/* ── FRAGRANCE / SIZE SELECTORS ── */
function selectFrag(pid, idx, btn) {
  btn.parentElement.querySelectorAll('.frag-chip').forEach((c, i) =>
    c.classList.toggle('active', i === idx)
  );
  const sel = document.getElementById(`frag-select-${pid}`);
  if (sel) sel.value = idx;
  updateCardPrice(pid, idx, getSelectedSize(pid));

  // update image if fragrance has one
  const p = products.find(x => x.id === pid);
  const fragImage = p?.fragrances[idx]?.image;
  if (fragImage) {
    const imgEl = document.querySelector(`#frag-chips-${pid}`)
      ?.closest('.product-card')
      ?.querySelector('.product-img img');
    if (imgEl) imgEl.src = fragImage;
  }
}

function selectFragMobile(pid, idx, sel) {
  const container = document.getElementById(`frag-chips-${pid}`);
  if (container) {
    container.querySelectorAll('.frag-chip').forEach((c, i) =>
      c.classList.toggle('active', i === parseInt(idx))
    );
  }
  updateCardPrice(pid, parseInt(idx), getSelectedSize(pid));
}

function selectSize(pid, idx, btn) {
  /* toggle active using btn's siblings — no DOM search */
  btn.parentElement.querySelectorAll('.size-chip').forEach((c, i) =>
    c.classList.toggle('active', i === idx)
  );
  updateCardPrice(pid, getSelectedFragrance(pid), idx);
}

/* ── ADD TO CART ── */
function addToCart(pid) {
  const p = products.find(x => x.id === pid);
  if (!p) return;

  const fragIdx = getSelectedFragrance(pid);
  const sizeIdx = getSelectedSize(pid);
  const frag    = p.fragrances[fragIdx];
  const size    = p.sizes[sizeIdx];
  const price   = computePrice(p, fragIdx, sizeIdx);
  const variantName = `${p.name} — ${frag.name}, ${size.label}`;

  const existing = cart.find(i => i.pid === pid && i.fragIdx === fragIdx && i.sizeIdx === sizeIdx);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ pid, fragIdx, sizeIdx, name: variantName, emoji: p.emoji, price, qty: 1 });
  }

  saveCart();
  updateCartUI();

  const btn = document.querySelector(`#size-chips-${pid}`)
    ?.closest('.product-card')
    ?.querySelector('.add-to-cart');
  if (btn) {
    btn.textContent = 'Added ✓';
    setTimeout(() => btn.textContent = 'Add to Cart', 1500);
  }
  showToast(`🌸 ${frag.name} (${size.label}) added to cart!`);
}

/* ── FILTERS ── */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProducts();
    })
  );
}
/* ── SHOP MODE ── */
function setShopMode(mode, btn) {
  document.querySelectorAll('.shop-mode-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('categoryView').style.display = mode === 'category' ? 'block' : 'none';
  document.getElementById('fragranceView').style.display = mode === 'fragrance' ? 'block' : 'none';
  if (mode === 'fragrance') {
    document.getElementById('fragProductsGrid').innerHTML = '';
    document.getElementById('fragFamilyDetail').style.display = 'none';
  }
}

/* ── SHOP MODE ── */
function setShopMode(mode, btn) {
  document.querySelectorAll('.shop-mode-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('categoryView').style.display = mode === 'category' ? 'block' : 'none';
  document.getElementById('fragranceView').style.display = mode === 'fragrance' ? 'block' : 'none';
  if (mode === 'fragrance') {
    renderShopScentGrid('all');
    document.getElementById('shopFragResults').style.display = 'none';
  }
}

let activeShopFragFamily = 'all';
let activeShopScent = null;

function setShopFragFamily(fam, btn) {
  document.querySelectorAll('#shopFragTabs .frag-family-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  activeShopFragFamily = fam;
  activeShopScent = null;
  document.getElementById('shopFragResults').style.display = 'none';
  renderShopScentGrid(fam);
}

function renderShopScentGrid(fam) {
  const grid = document.getElementById('shopScentGrid');
  if (!grid) return;
  let list = [];
  if (fam === 'all') {
    list = Object.values(SCENT_FAMILIES).flatMap(f => f.scents);
  } else {
    list = SCENT_FAMILIES[fam]?.scents || [];
  }
  grid.innerHTML = list.map(s =>
    `<button class="fragrance-scent-pill${activeShopScent===s?' active':''}"
      onclick="selectShopScent('${s}',this)">${s}</button>`
  ).join('');
}

function selectShopScent(scent, btn) {
  document.querySelectorAll('#shopScentGrid .fragrance-scent-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  activeShopScent = scent;

  const ids = SCENT_TO_PRODUCTS[scent] || [];
  const matched = products.filter(p => ids.includes(p.id));

  document.getElementById('shopFragResults').style.display = 'block';
  document.getElementById('shopFragLabel').textContent =
    matched.length + ' candle' + (matched.length !== 1 ? 's' : '') + ' available in ' + scent;

  renderFragProducts(matched);
}

function searchByFragrance(val) {
  if (!val.trim()) {
    document.getElementById('shopFragResults').style.display = 'none';
    return;
  }
  const ids = new Set();
  Object.entries(SCENT_TO_PRODUCTS).forEach(([scent, productIds]) => {
    if (scent.toLowerCase().includes(val.toLowerCase())) {
      productIds.forEach(id => ids.add(id));
    }
  });
  const matched = products.filter(p => ids.has(p.id));
  document.getElementById('shopFragResults').style.display = 'block';
  document.getElementById('shopFragLabel').textContent =
    matched.length + ' candle' + (matched.length !== 1 ? 's' : '') + ' matching "' + val + '"';
  renderFragProducts(matched);
}

function renderFragProducts(list) {
  const grid = document.getElementById('fragProductsGrid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);font-style:italic;padding:2rem 0;grid-column:1/-1">No products found for this scent 🌸</p>';
    return;
  }
  grid.innerHTML = list.map(p => {
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

  document.querySelectorAll('#fragProductsGrid .product-card.reveal').forEach(el => {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }), { threshold: 0.08 }
    );
    obs.observe(el);
  });
  if (typeof renderWishlistHearts === 'function') renderWishlistHearts();
}
function filterByScent(scent, btn) {
  document.querySelectorAll('.frag-scent-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const matched = products.filter(p =>
    p.fragrances.some(f => f.name.toLowerCase().includes(scent.toLowerCase().slice(0, 6)))
  );
  renderFragProducts(matched.length ? matched : products.filter(p =>
    p.fragranceFamily && p.fragranceFamily.some(f =>
      Object.keys(fragFamilies).some(k => fragFamilies[k].scents.includes(scent) && f === k)
    )
  ));
}

function searchByFragrance(val) {
  document.getElementById('fragFamilyDetail').style.display = 'none';
  document.querySelectorAll('.frag-family-card').forEach(c => c.classList.remove('active'));
  if (!val.trim()) { document.getElementById('fragProductsGrid').innerHTML = ''; return; }
  const matched = products.filter(p =>
    p.fragrances.some(f => f.name.toLowerCase().includes(val.toLowerCase())) ||
    p.name.toLowerCase().includes(val.toLowerCase())
  );
  renderFragProducts(matched);
}

function renderFragProducts(list) {
  const grid = document.getElementById('fragProductsGrid');
  if (!list.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);font-style:italic;padding:2rem 0;grid-column:1/-1">No products found for this scent 🌸</p>';
    return;
  }
  grid.innerHTML = list.map(p => {
    const defaultPrice = p.fragrances[0].price;
    const fragChips = p.fragrances.map((f, i) =>
      `<button class="frag-chip${i===0?' active':''}" data-idx="${i}" onclick="selectFrag(${p.id},${i},this)">${f.name}</button>`
    ).join('');
    const fragOptions = p.fragrances.map((f, i) =>
      `<option value="${i}">${f.name} — ₹${f.price}</option>`
    ).join('');
    const sizeChips = p.sizes.map((s, i) =>
      `<button class="size-chip${i===0?' active':''}" data-idx="${i}" onclick="selectSize(${p.id},${i},this)">${s.label}</button>`
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
          <select class="frag-dropdown" id="frag-select-${p.id}" onchange="selectFragMobile(${p.id},this.value,this)">${fragOptions}</select>
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
  document.querySelectorAll('#fragProductsGrid .product-card.reveal').forEach(el => {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    obs.observe(el);
  });
  if (typeof renderWishlistHearts === 'function') renderWishlistHearts();
}
/* ── ABOUT / HERO IMAGES ── */
function loadAboutImages() {
  const map = { aboutImg1: siteImages.about1, aboutImg2: siteImages.about2, aboutImg3: siteImages.about3 };
  Object.entries(map).forEach(([id, src]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<img src="${src}" alt="" onerror="this.parentElement.innerHTML=this.parentElement.dataset.fallback"/>`;
  });
}

function loadHeroImage() {
  const wrap = document.getElementById('heroImgWrap');
  if (!wrap) return;
  wrap.innerHTML = `<img src="${siteImages.hero}" alt="Noora Candles"
    onerror="this.outerHTML='<div class=\'hero-placeholder\'><span class=\'candle-icon\'>🕯️</span><p>Add your image to<br>images/hero/hero.jpg</p></div>'"/>`;
}

/* ── CONTACT FORM ── */
function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Message sent! We'll be in touch soon 🌸");
  e.target.reset();
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  setActiveNav();
  renderProducts();
  initFilters();
  loadHeroImage();
  loadAboutImages();
  initAuth().then(() => updateCartUI());
  if (typeof initEmailJS === 'function') initEmailJS();
  if (typeof initFragranceFromUrl === 'function') initFragranceFromUrl();
  if (typeof renderShopScentGrid === 'function') renderShopScentGrid('all');
  if (typeof renderScentGrid === 'function') renderScentGrid();
});

window.computePrice = computePrice;