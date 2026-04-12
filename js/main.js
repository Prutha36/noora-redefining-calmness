/* ============================================================
   js/main.js
   ============================================================ */

/* ── TOAST ── */
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2800);
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
}

/* ── ACTIVE NAV ── */
function setActiveNav() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.toggle('active', a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html'));
  });
}

/* ── HAMBURGER MENU ── */
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('mobileMenuOverlay').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('mobileMenuOverlay').classList.remove('open');
  document.body.classList.remove('menu-open');
}

/* ── PRICE HELPERS ── */
function computePrice(p, fragIdx, sizeIdx) {
  var base = p.fragrances[fragIdx] ? p.fragrances[fragIdx].price : p.fragrances[0].price;
  var add  = p.sizes[sizeIdx] ? (p.sizes[sizeIdx].priceAdd || 0) : 0;
  return base + add;
}

/* ── COLOUR GROUPS ── */
function getColourGroups(p) {
  if (!p.imageMap || Object.keys(p.imageMap).length === 0) return null;
  var map = {};
  p.fragrances.forEach(function(f) {
    var img = f.image || p.image;
    if (!map[img]) map[img] = { image: img, fragrances: [] };
    map[img].fragrances.push(f);
  });
  var groups = Object.values(map);
  return groups.length > 1 ? groups : null;
}

/* ── CARD SWIPE ── */
var _swipePid = null;
var _swipeTX  = 0;
var _swipeTY  = 0;

function cardTouchStart(e, pid) {
  _swipePid = pid;
  _swipeTX  = e.touches[0].clientX;
  _swipeTY  = e.touches[0].clientY;
}

function cardTouchEnd(e, pid) {
  var dx = e.changedTouches[0].clientX - _swipeTX;
  var dy = e.changedTouches[0].clientY - _swipeTY;
  if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy)) {
    swipeCardColour(pid, dx > 0 ? -1 : 1);
    e.preventDefault();
  }
  _swipePid = null;
}

function swipeCardColour(pid, dir) {
  var p  = products.find(function(x){ return x.id === pid; });
  var cg = getColourGroups(p);
  if (!cg) return;
  var card = document.getElementById('pcard-' + pid);
  if (!card) return;
  var idx = parseInt(card.dataset.ci || '0');
  idx = (idx + dir + cg.length) % cg.length;
  card.dataset.ci = idx;
  var img = card.querySelector('.product-card-img');
  if (img) { img.src = cg[idx].image; }
  card.querySelectorAll('.pcdot').forEach(function(d, i){ d.classList.toggle('active', i === idx); });
  // Update price
  var priceEl = card.querySelector('.product-price');
  if (priceEl) {
    var prices = cg[idx].fragrances.map(function(f){ return f.price; });
    var min = Math.min.apply(null, prices);
    priceEl.textContent = 'from ₹' + min;
  }
}

/* ── BUILD PRODUCT CARD ── */
function buildProductCard(p) {
  var cg = getColourGroups(p);
  var prices = p.fragrances.map(function(f){ return f.price; });
  var minP   = Math.min.apply(null, prices);
  var maxP   = Math.max.apply(null, prices);
  var priceDisplay = minP === maxP ? '₹' + minP : 'from ₹' + minP;

  var dots = '';
  if (cg && cg.length > 1) {
    dots = '<div class="pcard-colour-dots">' +
      cg.slice(0,8).map(function(g, i){
        return '<span class="pcdot' + (i===0?' active':'') + '" style="background-image:url(\'' + g.image + '\')"></span>';
      }).join('') +
    '</div>';
  }

  var wishClass = (typeof wishlistIds !== 'undefined' && wishlistIds.has(p.id)) ? 'wishlist-btn wishlisted' : 'wishlist-btn';
  var wishHeart = (typeof wishlistIds !== 'undefined' && wishlistIds.has(p.id)) ? '❤️' : '🤍';

  return '<div class="product-card reveal" id="pcard-' + p.id + '" data-ci="0">' +
    // invisible full-card tap target (sits behind everything)
    '<div class="pcard-tap-area" onclick="openProductModal(' + p.id + ')"></div>' +
    '<div class="product-img"' +
      ' ontouchstart="cardTouchStart(event,' + p.id + ')"' +
      ' ontouchend="cardTouchEnd(event,' + p.id + ')">' +
      (p.tag ? '<span class="product-tag">' + p.tag + '</span>' : '') +
      '<button class="' + wishClass + '" data-pid="' + p.id + '"' +
        ' onclick="event.stopPropagation();toggleWishlist(' + p.id + ',this)">' + wishHeart + '</button>' +
      '<img src="' + p.image + '" alt="' + p.name + '" class="product-card-img"' +
        ' loading="lazy" decoding="async"' +
        ' onerror="this.outerHTML=\'<div class=\\\'product-img-placeholder\\\'><span>' + p.emoji + '</span></div>\'">' +
      dots +
    '</div>' +
    '<div class="product-info">' +
      '<div class="product-name">' + p.name + '</div>' +
      '<div class="product-footer">' +
        '<div class="product-price">' + priceDisplay + '</div>' +
        '<button class="add-to-cart" onclick="event.stopPropagation();openProductModal(' + p.id + ')">Customise ✿</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

/* ── PRODUCT GRID ── */
var activeFilter = 'all';

function renderProducts() {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;
  var list = activeFilter === 'all' ? products :
    products.filter(function(p){ return p.category === activeFilter || p.tag === activeFilter; });
  grid.innerHTML = list.map(buildProductCard).join('');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.05 });
  grid.querySelectorAll('.product-card.reveal').forEach(function(el){ obs.observe(el); });
  if (typeof renderWishlistHearts === 'function') renderWishlistHearts();
}

/* ── FILTERS ── */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProducts();
    });
  });
}

/* ── SHOP MODE ── */
function setShopMode(mode, btn) {
  document.querySelectorAll('.shop-mode-tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('categoryView').style.display  = mode === 'category'  ? 'block' : 'none';
  document.getElementById('fragranceView').style.display = mode === 'fragrance' ? 'block' : 'none';
  if (mode === 'fragrance') {
    renderShopScentGrid('all');
    var r = document.getElementById('shopFragResults');
    if (r) r.style.display = 'none';
  }
}

/* ── SHOP FRAGRANCE BROWSER ── */
var activeShopFragFamily = 'all';
var activeShopScent = null;

function setShopFragFamily(fam, btn) {
  document.querySelectorAll('#shopFragTabs .frag-family-tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  activeShopFragFamily = fam; activeShopScent = null;
  var r = document.getElementById('shopFragResults');
  if (r) r.style.display = 'none';
  renderShopScentGrid(fam);
}

function renderShopScentGrid(fam) {
  var grid = document.getElementById('shopScentGrid');
  if (!grid) return;
  var list = fam === 'all'
    ? Object.values(SCENT_FAMILIES).flatMap(function(f){ return f.scents; })
    : (SCENT_FAMILIES[fam] ? SCENT_FAMILIES[fam].scents : []);
  grid.innerHTML = list.map(function(s){
    return '<button class="fragrance-scent-pill' + (activeShopScent===s?' active':'') + '"' +
      ' onclick="selectShopScent(\'' + s.replace(/'/g,"\\'") + '\',this)">' + s + '</button>';
  }).join('');
}

function selectShopScent(scent, btn) {
  document.querySelectorAll('#shopScentGrid .fragrance-scent-pill').forEach(function(p){ p.classList.remove('active'); });
  btn.classList.add('active');
  activeShopScent = scent;
  var ids     = SCENT_TO_PRODUCTS[scent] || [];
  var matched = products.filter(function(p){ return ids.includes(p.id); });
  var r = document.getElementById('shopFragResults');
  var l = document.getElementById('shopFragLabel');
  if (r) r.style.display = 'block';
  if (l) l.textContent = matched.length + ' candle' + (matched.length!==1?'s':'') + ' available in ' + scent;
  renderFragProducts('fragProductsGrid', matched);
}

function renderFragProducts(gridId, list) {
  var grid = document.getElementById(gridId);
  if (!grid) return;
  if (!list || !list.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);font-style:italic;padding:2rem 0;grid-column:1/-1">No products found 🌸</p>';
    return;
  }
  grid.innerHTML = list.map(buildProductCard).join('');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.05 });
  grid.querySelectorAll('.product-card.reveal').forEach(function(el){ obs.observe(el); });
  if (typeof renderWishlistHearts === 'function') renderWishlistHearts();
}

/* ── PRODUCT MODAL ── */
var modalState = { pid: null, colourIdx: 0, fragIdx: 0, sizeIdx: 0, qty: 1 };

function openProductModal(pid, colourIdx) {
  colourIdx = colourIdx || 0;
  var p = products.find(function(x){ return x.id === pid; });
  if (!p) return;
  var cg = getColourGroups(p);
  modalState = { pid: pid, colourIdx: colourIdx, fragIdx: 0, sizeIdx: 0, qty: 1 };

  var frags = cg ? cg[colourIdx].fragrances : p.fragrances;
  var img   = cg ? cg[colourIdx].image      : p.image;

  var imgEl = document.getElementById('modal-img');
  if (imgEl) { imgEl.src = img; imgEl.alt = p.name; }
  var nameEl = document.getElementById('modal-name');
  if (nameEl) nameEl.textContent = p.name;
  var priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.textContent = '₹' + frags[0].price;
  var tagEl = document.getElementById('modal-tag');
  if (tagEl) { tagEl.textContent = p.tag || ''; tagEl.style.display = p.tag ? 'inline-block' : 'none'; }

  var colourSection = document.getElementById('modal-colour-section');
  if (cg && cg.length > 1) {
    if (colourSection) colourSection.style.display = 'block';
    var sw = document.getElementById('modal-swatches');
    if (sw) sw.innerHTML = cg.map(function(g, i){
      return '<button class="modal-swatch' + (i===colourIdx?' active':'') + '"' +
        ' style="background-image:url(\'' + g.image + '\')"' +
        ' title="' + g.fragrances.map(function(f){ return f.name; }).join(', ') + '"' +
        ' onclick="selectModalColour(' + i + ')"></button>';
    }).join('');
  } else {
    if (colourSection) colourSection.style.display = 'none';
  }

  renderModalFragrances(frags, 0);

  var sizesEl = document.getElementById('modal-sizes');
  if (sizesEl) sizesEl.innerHTML = p.sizes.map(function(s, i){
    return '<button class="modal-size-chip' + (i===0?' active':'') + '" onclick="selectModalSize(' + i + ')">' + s.label + '</button>';
  }).join('');

  var qtyEl = document.getElementById('modal-qty');
  if (qtyEl) qtyEl.textContent = 1;

  document.getElementById('productModal').classList.add('open');
  document.getElementById('productModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderModalFragrances(frags, activeIdx) {
  var el = document.getElementById('modal-frags');
  if (!el) return;
  el.innerHTML = frags.map(function(f, i){
    return '<button class="modal-frag-pill' + (i===activeIdx?' active':'') + '" onclick="selectModalFrag(' + i + ')">' + f.name + '</button>';
  }).join('');
}

function selectModalColour(idx) {
  var p  = products.find(function(x){ return x.id === modalState.pid; });
  var cg = getColourGroups(p);
  if (!cg) return;
  modalState.colourIdx = idx; modalState.fragIdx = 0;
  var imgEl = document.getElementById('modal-img');
  if (imgEl) imgEl.src = cg[idx].image;
  document.querySelectorAll('.modal-swatch').forEach(function(s, i){ s.classList.toggle('active', i===idx); });
  renderModalFragrances(cg[idx].fragrances, 0);
  var priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.textContent = '₹' + cg[idx].fragrances[0].price;
}

function selectModalFrag(idx) {
  var p  = products.find(function(x){ return x.id === modalState.pid; });
  var cg = getColourGroups(p);
  var frags = cg ? cg[modalState.colourIdx].fragrances : p.fragrances;
  modalState.fragIdx = idx;
  document.querySelectorAll('.modal-frag-pill').forEach(function(pill, i){ pill.classList.toggle('active', i===idx); });
  var priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.textContent = '₹' + frags[idx].price;
}

function selectModalSize(idx) {
  modalState.sizeIdx = idx;
  document.querySelectorAll('.modal-size-chip').forEach(function(s, i){ s.classList.toggle('active', i===idx); });
}

function changeModalQty(delta) {
  modalState.qty = Math.max(1, modalState.qty + delta);
  var el = document.getElementById('modal-qty');
  if (el) el.textContent = modalState.qty;
}

function addToCartFromModal() {
  var p = products.find(function(x){ return x.id === modalState.pid; });
  if (!p) return;
  var cg    = getColourGroups(p);
  var frags = cg ? cg[modalState.colourIdx].fragrances : p.fragrances;
  var frag  = frags[modalState.fragIdx];
  var size  = p.sizes[modalState.sizeIdx];
  var price = frag.price + (size.priceAdd || 0);
  var itemName = p.name + ' — ' + frag.name + ', ' + size.label;
  var fragIdx  = p.fragrances.findIndex(function(f){ return f.name === frag.name; });
  var existing = cart.find(function(c){ return c.pid === p.id && c.name === itemName; });
  if (existing) {
    existing.qty += modalState.qty;
  } else {
    cart.push({ pid: p.id, name: itemName, price: price, qty: modalState.qty,
      fragIdx: fragIdx >= 0 ? fragIdx : 0, sizeIdx: modalState.sizeIdx, image: frag.image || p.image });
  }
  saveCart(); updateCartUI(); closeProductModal();
  showToast(p.name + ' added to cart 🌸');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('productModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── ABOUT / HERO IMAGES ── */
function loadAboutImages() {
  var map = { aboutImg1: siteImages.about1, aboutImg2: siteImages.about2, aboutImg3: siteImages.about3 };
  Object.entries(map).forEach(function(entry) {
    var el = document.getElementById(entry[0]);
    if (el) el.innerHTML = '<img src="' + entry[1] + '" alt=""/>';
  });
}
function loadHeroImage() {
  var wrap = document.getElementById('heroImgWrap');
  if (!wrap) return;
  wrap.innerHTML = '<img src="' + siteImages.hero + '" alt="Noora Candles"' +
    ' onerror="this.outerHTML=\'<div class=\\\'hero-placeholder\\\'><span>🕯️</span></div>\'">';
}

/* ── CONTACT ── */
function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Message sent! We'll be in touch soon 🌸");
  e.target.reset();
}

/* ── DEALS ── */
function initDealsPage() {
  var actions = document.getElementById('signupDealActions');
  if (!actions) return;
  if (typeof currentUser !== 'undefined' && currentUser) {
    actions.innerHTML = '<div class="deal-unlocked"><span class="deal-unlocked-icon">✓</span>You\'re signed in — use code <strong>WELCOME15</strong> at checkout!</div>';
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function() {
  initScrollReveal();
  setActiveNav();
  renderProducts();
  initFilters();
  loadHeroImage();
  loadAboutImages();
  initAuth().then(function() {
    updateCartUI();
    updateWishlistCount();
    if (typeof initDealsPage === 'function') initDealsPage();
  });
  if (typeof initEmailJS     === 'function') initEmailJS();
  if (typeof initFragranceFromUrl === 'function') initFragranceFromUrl();
  if (typeof renderShopScentGrid  === 'function') renderShopScentGrid('all');
  if (typeof renderScentGrid      === 'function') renderScentGrid();
});

window.computePrice = computePrice;