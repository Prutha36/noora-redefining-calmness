/* ============================================================
   js/main.js
   ============================================================ */

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
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

/* ── PRICE HELPERS ── */
function computePrice(p, fragIdx, sizeIdx) {
  const base = p.fragrances[fragIdx]?.price ?? p.fragrances[0].price;
  const add  = p.sizes[sizeIdx]?.priceAdd ?? 0;
  return base + add;
}

/* ── COLOUR GROUPS ── */
function getColourGroups(p) {
  if (!p.imageMap || Object.keys(p.imageMap).length === 0) return null;
  const map = {};
  p.fragrances.forEach(f => {
    const img = f.image || p.image;
    if (!map[img]) map[img] = { image: img, fragrances: [] };
    map[img].fragrances.push(f);
  });
  const groups = Object.values(map);
  return groups.length > 1 ? groups : null;
}

/* ── CLEAN PRODUCT CARD ── */
function buildProductCard(p) {
  const colourGroups = getColourGroups(p);
  const prices = p.fragrances.map(f => f.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay = minPrice === maxPrice ? `₹${minPrice}` : `from ₹${minPrice}`;
  const swatchDots = colourGroups
    ? colourGroups.slice(0, 6).map(g =>
        `<span class="pcard-swatch" style="background-image:url('${g.image}')"></span>`
      ).join('')
    : '';
  return `
  <div class="product-card reveal" onclick="openProductModal(${p.id})">
    <div class="product-img">
      ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
      <button class="wishlist-btn" data-pid="${p.id}"
        onclick="event.stopPropagation();toggleWishlist(${p.id},this)">🤍</button>
      <img src="${p.image}" alt="${p.name}"
        loading="lazy" decoding="async"
        onerror="this.outerHTML='<div class=\'product-img-placeholder\'><span>${p.emoji}</span></div>'"/>
    </div>
    <div class="product-info">
      <div class="product-name">${p.name}</div>
      ${swatchDots ? `<div class="pcard-swatches">${swatchDots}</div>` : ''}
      <div class="product-footer">
        <div class="product-price">${priceDisplay}</div>
        <button class="add-to-cart"
          onclick="event.stopPropagation();openProductModal(${p.id})">
          Customise ✿
        </button>
      </div>
    </div>
  </div>`;
}

/* ── PRODUCT GRID ── */
let activeFilter = 'all';

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const list = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter || p.tag === activeFilter);
  grid.innerHTML = list.map(buildProductCard).join('');
  const obs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('#productsGrid .product-card.reveal').forEach(el => obs.observe(el));
  if (typeof renderWishlistHearts === 'function') renderWishlistHearts();
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
  document.getElementById('categoryView').style.display  = mode === 'category'  ? 'block' : 'none';
  document.getElementById('fragranceView').style.display = mode === 'fragrance' ? 'block' : 'none';
  if (mode === 'fragrance') {
    renderShopScentGrid('all');
    const r = document.getElementById('shopFragResults');
    if (r) r.style.display = 'none';
  }
}

/* ── SHOP FRAGRANCE BROWSER ── */
let activeShopFragFamily = 'all';
let activeShopScent = null;

function setShopFragFamily(fam, btn) {
  document.querySelectorAll('#shopFragTabs .frag-family-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  activeShopFragFamily = fam;
  activeShopScent = null;
  const r = document.getElementById('shopFragResults');
  if (r) r.style.display = 'none';
  renderShopScentGrid(fam);
}

function renderShopScentGrid(fam) {
  const grid = document.getElementById('shopScentGrid');
  if (!grid) return;
  const list = fam === 'all'
    ? Object.values(SCENT_FAMILIES).flatMap(f => f.scents)
    : SCENT_FAMILIES[fam]?.scents || [];
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
  const r = document.getElementById('shopFragResults');
  const l = document.getElementById('shopFragLabel');
  if (r) r.style.display = 'block';
  if (l) l.textContent = matched.length + ' candle' + (matched.length !== 1 ? 's' : '') + ' available in ' + scent;
  renderFragProducts('fragProductsGrid', matched);
}

function renderFragProducts(gridId, list) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  if (!list || !list.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);font-style:italic;padding:2rem 0;grid-column:1/-1">No products found 🌸</p>';
    return;
  }
  grid.innerHTML = list.map(buildProductCard).join('');
  const obs = new IntersectionObserver(entries =>
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
    { threshold: 0.08 }
  );
  grid.querySelectorAll('.product-card.reveal').forEach(el => obs.observe(el));
  if (typeof renderWishlistHearts === 'function') renderWishlistHearts();
}

/* ── PRODUCT MODAL ── */
let modalState = { pid: null, colourIdx: 0, fragIdx: 0, sizeIdx: 0, qty: 1 };

function openProductModal(pid, colourIdx) {
  colourIdx = colourIdx || 0;
  const p = products.find(x => x.id === pid);
  if (!p) return;
  const colourGroups = getColourGroups(p);
  modalState = { pid, colourIdx, fragIdx: 0, sizeIdx: 0, qty: 1 };
  const frags = colourGroups ? colourGroups[colourIdx].fragrances : p.fragrances;
  const img   = colourGroups ? colourGroups[colourIdx].image      : p.image;

  const imgEl = document.getElementById('modal-img');
  if (imgEl) { imgEl.src = img; imgEl.alt = p.name; }
  const nameEl = document.getElementById('modal-name');
  if (nameEl) nameEl.textContent = p.name;
  const priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.textContent = '₹' + frags[0].price;
  const tagEl = document.getElementById('modal-tag');
  if (tagEl) { tagEl.textContent = p.tag || ''; tagEl.style.display = p.tag ? 'inline-block' : 'none'; }

  const colourSection = document.getElementById('modal-colour-section');
  if (colourGroups && colourGroups.length > 1) {
    if (colourSection) colourSection.style.display = 'block';
    const swatchesEl = document.getElementById('modal-swatches');
    if (swatchesEl) swatchesEl.innerHTML = colourGroups.map((g, i) =>
      `<button class="modal-swatch${i===colourIdx?' active':''}"
        style="background-image:url('${g.image}')"
        title="${g.fragrances.map(f=>f.name).join(', ')}"
        onclick="selectModalColour(${i})"></button>`
    ).join('');
  } else {
    if (colourSection) colourSection.style.display = 'none';
  }

  renderModalFragrances(frags, 0);

  const sizesEl = document.getElementById('modal-sizes');
  if (sizesEl) sizesEl.innerHTML = p.sizes.map((s, i) =>
    `<button class="modal-size-chip${i===0?' active':''}" onclick="selectModalSize(${i})">${s.label}</button>`
  ).join('');

  const qtyEl = document.getElementById('modal-qty');
  if (qtyEl) qtyEl.textContent = 1;

  document.getElementById('productModal')?.classList.add('open');
  document.getElementById('productModalOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderModalFragrances(frags, activeIdx) {
  const el = document.getElementById('modal-frags');
  if (!el) return;
  el.innerHTML = frags.map((f, i) =>
    `<button class="modal-frag-pill${i===activeIdx?' active':''}"
      onclick="selectModalFrag(${i})">${f.name}</button>`
  ).join('');
}

function selectModalColour(idx) {
  const p = products.find(x => x.id === modalState.pid);
  const cg = getColourGroups(p);
  if (!cg) return;
  modalState.colourIdx = idx; modalState.fragIdx = 0;
  const imgEl = document.getElementById('modal-img');
  if (imgEl) imgEl.src = cg[idx].image;
  document.querySelectorAll('.modal-swatch').forEach((s, i) => s.classList.toggle('active', i===idx));
  renderModalFragrances(cg[idx].fragrances, 0);
  const priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.textContent = '₹' + cg[idx].fragrances[0].price;
}

function selectModalFrag(idx) {
  const p = products.find(x => x.id === modalState.pid);
  const cg = getColourGroups(p);
  const frags = cg ? cg[modalState.colourIdx].fragrances : p.fragrances;
  modalState.fragIdx = idx;
  document.querySelectorAll('.modal-frag-pill').forEach((pill, i) => pill.classList.toggle('active', i===idx));
  const priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.textContent = '₹' + frags[idx].price;
}

function selectModalSize(idx) {
  modalState.sizeIdx = idx;
  document.querySelectorAll('.modal-size-chip').forEach((s, i) => s.classList.toggle('active', i===idx));
}

function changeModalQty(delta) {
  modalState.qty = Math.max(1, modalState.qty + delta);
  const el = document.getElementById('modal-qty');
  if (el) el.textContent = modalState.qty;
}

function addToCartFromModal() {
  const p = products.find(x => x.id === modalState.pid);
  if (!p) return;
  const cg = getColourGroups(p);
  const frags = cg ? cg[modalState.colourIdx].fragrances : p.fragrances;
  const frag = frags[modalState.fragIdx];
  const size = p.sizes[modalState.sizeIdx];
  const price = frag.price + (size.priceAdd || 0);
  const itemName = `${p.name} — ${frag.name}, ${size.label}`;
  const fragIdx = p.fragrances.findIndex(f => f.name === frag.name);
  const existing = cart.find(c => c.pid === p.id && c.name === itemName);
  if (existing) {
    existing.qty += modalState.qty;
  } else {
    cart.push({
      pid: p.id, name: itemName, price,
      qty: modalState.qty,
      fragIdx: fragIdx >= 0 ? fragIdx : 0,
      sizeIdx: modalState.sizeIdx,
      image: frag.image || p.image,
    });
  }
  saveCart();
  updateCartUI();
  closeProductModal();
  showToast(`${p.name} added to cart 🌸`);
}

function closeProductModal() {
  document.getElementById('productModal')?.classList.remove('open');
  document.getElementById('productModalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── ABOUT / HERO IMAGES ── */
function loadAboutImages() {
  const map = { aboutImg1: siteImages.about1, aboutImg2: siteImages.about2, aboutImg3: siteImages.about3 };
  Object.entries(map).forEach(([id, src]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<img src="${src}" alt=""/>`;
  });
}
function loadHeroImage() {
  const wrap = document.getElementById('heroImgWrap');
  if (!wrap) return;
  wrap.innerHTML = `<img src="${siteImages.hero}" alt="Noora Candles"
    onerror="this.outerHTML='<div class=\'hero-placeholder\'><span>🕯️</span></div>'"/>`;
}

/* ── CONTACT ── */
function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Message sent! We'll be in touch soon 🌸");
  e.target.reset();
}

/* ── DEALS ── */
function initDealsPage() {
  const actions = document.getElementById('signupDealActions');
  if (!actions) return;
  if (typeof currentUser !== 'undefined' && currentUser) {
    actions.innerHTML = `<div class="deal-unlocked"><span class="deal-unlocked-icon">✓</span>You're signed in — use code <strong>WELCOME15</strong> at checkout!</div>`;
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  setActiveNav();
  renderProducts();
  initFilters();
  loadHeroImage();
  loadAboutImages();
  initAuth().then(() => {
    updateCartUI();
    if (typeof initDealsPage === 'function') initDealsPage();
  });
  if (typeof initEmailJS === 'function') initEmailJS();
  if (typeof initFragranceFromUrl === 'function') initFragranceFromUrl();
  if (typeof renderShopScentGrid === 'function') renderShopScentGrid('all');
  if (typeof renderScentGrid === 'function') renderScentGrid();
});

window.computePrice = computePrice;