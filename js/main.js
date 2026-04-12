/* ============================================================
   js/main.js
   ============================================================ */

/* ── PREVENT iOS PULL-TO-REFRESH ── */
(function(){
  var lastY = 0;
  document.addEventListener('touchstart', function(e){ lastY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    if ((document.scrollingElement||document.documentElement).scrollTop === 0 && e.touches[0].clientY > lastY + 4) {
      e.preventDefault();
    }
  }, { passive: false });
})();

/* ── TOAST ── */
function showToast(msg) {
  var t = document.getElementById('toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 2800);
}

/* ── SCROLL REVEAL (section headings only, NOT product cards) ── */
function initScrollReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.05 });
  /* only apply reveal to non-product-card .reveal elements */
  document.querySelectorAll('.reveal:not(.product-card)').forEach(function(el){ obs.observe(el); });
  /* product cards: always visible immediately */
  document.querySelectorAll('.product-card.reveal').forEach(function(el){ el.classList.add('visible'); });
}

/* ── ACTIVE NAV ── */
function setActiveNav() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function(a) {
    a.classList.toggle('active', a.getAttribute('href') === page || (page==='' && a.getAttribute('href')==='index.html'));
  });
}

/* ── HAMBURGER ── */
function toggleMobileMenu() {
  var m = document.getElementById('mobileMenu'); var o = document.getElementById('mobileMenuOverlay');
  if (m) m.classList.toggle('open'); if (o) o.classList.toggle('open');
}
function closeMobileMenu() {
  var m = document.getElementById('mobileMenu'); if (m) m.classList.remove('open');
  var o = document.getElementById('mobileMenuOverlay'); if (o) o.classList.remove('open');
}

/* ── PRICE HELPERS ── */
function computePrice(p, fragIdx, sizeIdx) {
  var base = (p.fragrances[fragIdx] || p.fragrances[0]).price;
  var add  = (p.sizes[sizeIdx] && p.sizes[sizeIdx].priceAdd) ? p.sizes[sizeIdx].priceAdd : 0;
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

/* ── SWIPE ── */
var _swipeBlocked = false;
function blockNextClick() { _swipeBlocked = true; setTimeout(function(){ _swipeBlocked = false; }, 500); }

function swipeCardColour(pid, dir) {
  var p = products.find(function(x){ return x.id === pid; }); if (!p) return;
  var cg = getColourGroups(p); if (!cg) return;
  var card = document.getElementById('pcard-' + pid); if (!card) return;
  var idx = ((parseInt(card.dataset.ci)||0) + dir + cg.length) % cg.length;
  card.dataset.ci = idx;
  var img = card.querySelector('.product-card-img'); if (img) img.src = cg[idx].image;
  card.querySelectorAll('.pcdot').forEach(function(d,i){ d.classList.toggle('active', i===idx); });
  blockNextClick();
}

function attachCardSwipes(containerId) {
  var el = document.getElementById(containerId);
  if (!el || el._swipeBound) return;
  el._swipeBound = true;
  var sx, sy, moved;
  el.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.product-img')) return;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; moved = false;
  }, { passive: true });
  el.addEventListener('touchmove', function(e) {
    if (sx===undefined) return;
    if (Math.abs(e.touches[0].clientX-sx) > Math.abs(e.touches[0].clientY-sy)+5) moved = true;
  }, { passive: true });
  el.addEventListener('touchend', function(e) {
    if (!moved || sx===undefined) { sx=undefined; return; }
    var card = e.target.closest('.product-card');
    if (card) {
      var dx = e.changedTouches[0].clientX-sx, dy = e.changedTouches[0].clientY-sy;
      if (Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)) swipeCardColour(parseInt(card.id.replace('pcard-','')), dx>0?-1:1);
    }
    sx=undefined; moved=false;
  }, { passive: true });
}

/* ── BUILD PRODUCT CARD ── */
function buildProductCard(p) {
  var cg = getColourGroups(p);
  var prices = p.fragrances.map(function(f){ return f.price; });
  var minP = Math.min.apply(null,prices), maxP = Math.max.apply(null,prices);
  var priceStr = minP===maxP ? '&#8377;'+minP : 'from &#8377;'+minP;
  var gw = (typeof getGuestWishlist==='function') ? getGuestWishlist() : new Set();
  var wlIds = (typeof wishlistIds!=='undefined' && wishlistIds.size) ? wishlistIds : gw;
  var isWL = wlIds.has(p.id);
  var dots = '';
  if (cg && cg.length > 1) {
    dots = '<div class="pcard-colour-dots">' +
      cg.slice(0,8).map(function(g,i){ return '<span class="pcdot'+(i===0?' active':'')+'" style="background-image:url(\''+g.image+'\')"></span>'; }).join('') +
    '</div>';
  }
  /* Note: NO .reveal class — products show immediately */
  return '<div class="product-card" id="pcard-'+p.id+'" data-ci="0" onclick="if(!_swipeBlocked)openProductModal('+p.id+')">'+
    '<div class="product-img">'+
      (p.tag?'<span class="product-tag">'+p.tag+'</span>':'')+
      '<button class="wishlist-btn'+(isWL?' wishlisted':'')+'" data-pid="'+p.id+'" onclick="event.stopPropagation();toggleWishlist('+p.id+',this)">'+(isWL?'❤️':'🤍')+'</button>'+
      '<img src="'+p.image+'" alt="'+p.name+'" class="product-card-img" loading="lazy" decoding="async">'+
      dots+
    '</div>'+
    '<div class="product-info">'+
      '<div class="product-name">'+p.name+'</div>'+
      '<div class="product-footer">'+
        '<div class="product-price">'+priceStr+'</div>'+
        '<button class="add-to-cart" onclick="event.stopPropagation();openProductModal('+p.id+')">Customise ✿</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}

/* ── PRODUCT GRID ── */
var activeFilter = 'all';
function renderProducts() {
  var grid = document.getElementById('productsGrid'); if (!grid) return;
  var list = activeFilter==='all' ? products : products.filter(function(p){ return p.category===activeFilter||p.tag===activeFilter; });
  grid.innerHTML = list.map(buildProductCard).join('');
  attachCardSwipes('productsGrid');
  if (typeof renderWishlistHearts==='function') renderWishlistHearts();
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active'); activeFilter = btn.dataset.filter; renderProducts();
    });
  });
}

/* ── SHOP MODE ── */
function setShopMode(mode, btn) {
  document.querySelectorAll('.shop-mode-tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active');
  var cv=document.getElementById('categoryView'), fv=document.getElementById('fragranceView');
  if (cv) cv.style.display = mode==='category'  ? 'block':'none';
  if (fv) fv.style.display = mode==='fragrance' ? 'block':'none';
  if (mode==='fragrance') { if (typeof renderShopScentGrid==='function') renderShopScentGrid('all'); var r=document.getElementById('shopFragResults'); if(r) r.style.display='none'; }
}

var activeShopFragFamily='all', activeShopScent=null;
function setShopFragFamily(fam, btn) {
  document.querySelectorAll('#shopFragTabs .frag-family-tab').forEach(function(t){ t.classList.remove('active'); });
  btn.classList.add('active'); activeShopFragFamily=fam; activeShopScent=null;
  var r=document.getElementById('shopFragResults'); if(r) r.style.display='none';
  renderShopScentGrid(fam);
}
function renderShopScentGrid(fam) {
  var grid=document.getElementById('shopScentGrid'); if (!grid) return;
  var list = fam==='all' ? Object.values(SCENT_FAMILIES).flatMap(function(f){ return f.scents; }) : (SCENT_FAMILIES[fam]?SCENT_FAMILIES[fam].scents:[]);
  grid.innerHTML = list.map(function(s){ return '<button class="fragrance-scent-pill'+(activeShopScent===s?' active':'')+'" onclick="selectShopScent(\''+s.replace(/'/g,"\\'")+'\',this)">'+s+'</button>'; }).join('');
}
function selectShopScent(scent, btn) {
  document.querySelectorAll('#shopScentGrid .fragrance-scent-pill').forEach(function(p){ p.classList.remove('active'); });
  btn.classList.add('active'); activeShopScent=scent;
  var ids=(typeof SCENT_TO_PRODUCTS!=='undefined')?(SCENT_TO_PRODUCTS[scent]||[]):[];
  var matched=products.filter(function(p){ return ids.includes(p.id); });
  var r=document.getElementById('shopFragResults'); if(r) r.style.display='block';
  var l=document.getElementById('shopFragLabel'); if(l) l.textContent=matched.length+' candle'+(matched.length!==1?'s':'')+' available in '+scent;
  renderFragProducts('fragProductsGrid', matched);
}
function renderFragProducts(gridId, list) {
  var grid=document.getElementById(gridId); if (!grid) return;
  if (!list||!list.length) { grid.innerHTML='<p style="text-align:center;color:var(--text-light);font-style:italic;padding:2rem 0;grid-column:1/-1">No products found 🌸</p>'; return; }
  grid.innerHTML=list.map(buildProductCard).join('');
  attachCardSwipes(gridId);
  if (typeof renderWishlistHearts==='function') renderWishlistHearts();
}

/* ── PRODUCT MODAL ── */
var modalState = { pid:null, colourIdx:0, fragIdx:0, sizeIdx:0, qty:1 };
function openProductModal(pid, colourIdx) {
  if (_swipeBlocked) return;
  colourIdx = colourIdx||0;
  var p=products.find(function(x){ return x.id===pid; }); if (!p) return;
  var cg=getColourGroups(p), frags=cg?cg[colourIdx].fragrances:p.fragrances, img=cg?cg[colourIdx].image:p.image;
  modalState={pid:pid,colourIdx:colourIdx,fragIdx:0,sizeIdx:0,qty:1};
  var imgEl=document.getElementById('modal-img'); if(imgEl){imgEl.src=img;imgEl.alt=p.name;}
  var nameEl=document.getElementById('modal-name'); if(nameEl) nameEl.textContent=p.name;
  var priceEl=document.getElementById('modal-price'); if(priceEl) priceEl.textContent='₹'+frags[0].price;
  var tagEl=document.getElementById('modal-tag'); if(tagEl){tagEl.textContent=p.tag||'';tagEl.style.display=p.tag?'inline-block':'none';}
  var colSection=document.getElementById('modal-colour-section');
  if (cg && cg.length>1) {
    if(colSection) colSection.style.display='block';
    var sw=document.getElementById('modal-swatches');
    if(sw) sw.innerHTML=cg.map(function(g,i){ return '<button class="modal-swatch'+(i===colourIdx?' active':'')+'" style="background-image:url(\''+g.image+'\')" onclick="selectModalColour('+i+')"></button>'; }).join('');
  } else { if(colSection) colSection.style.display='none'; }
  renderModalFragrances(frags,0);
  var sizesEl=document.getElementById('modal-sizes');
  if(sizesEl) sizesEl.innerHTML=p.sizes.map(function(s,i){ return '<button class="modal-size-chip'+(i===0?' active':'')+'" onclick="selectModalSize('+i+')">'+s.label+'</button>'; }).join('');
  var qtyEl=document.getElementById('modal-qty'); if(qtyEl) qtyEl.textContent=1;
  document.getElementById('productModal').classList.add('open');
  document.getElementById('productModalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function renderModalFragrances(frags, activeIdx) {
  var el=document.getElementById('modal-frags'); if(!el) return;
  el.innerHTML=frags.map(function(f,i){ return '<button class="modal-frag-pill'+(i===activeIdx?' active':'')+'" onclick="selectModalFrag('+i+')">'+f.name+'</button>'; }).join('');
}
function selectModalColour(idx) {
  var p=products.find(function(x){ return x.id===modalState.pid; }), cg=getColourGroups(p); if(!cg) return;
  modalState.colourIdx=idx; modalState.fragIdx=0;
  var imgEl=document.getElementById('modal-img'); if(imgEl) imgEl.src=cg[idx].image;
  document.querySelectorAll('.modal-swatch').forEach(function(s,i){ s.classList.toggle('active',i===idx); });
  renderModalFragrances(cg[idx].fragrances,0);
  var priceEl=document.getElementById('modal-price'); if(priceEl) priceEl.textContent='₹'+cg[idx].fragrances[0].price;
}
function selectModalFrag(idx) {
  var p=products.find(function(x){ return x.id===modalState.pid; }), cg=getColourGroups(p);
  var frags=cg?cg[modalState.colourIdx].fragrances:p.fragrances;
  modalState.fragIdx=idx;
  document.querySelectorAll('.modal-frag-pill').forEach(function(pill,i){ pill.classList.toggle('active',i===idx); });
  var priceEl=document.getElementById('modal-price'); if(priceEl) priceEl.textContent='₹'+frags[idx].price;
}
function selectModalSize(idx) {
  modalState.sizeIdx=idx;
  document.querySelectorAll('.modal-size-chip').forEach(function(s,i){ s.classList.toggle('active',i===idx); });
}
function changeModalQty(delta) {
  modalState.qty=Math.max(1,modalState.qty+delta);
  var el=document.getElementById('modal-qty'); if(el) el.textContent=modalState.qty;
}
function addToCartFromModal() {
  var p=products.find(function(x){ return x.id===modalState.pid; }); if(!p) return;
  var cg=getColourGroups(p), frags=cg?cg[modalState.colourIdx].fragrances:p.fragrances;
  var frag=frags[modalState.fragIdx], size=p.sizes[modalState.sizeIdx];
  var price=frag.price+((size&&size.priceAdd)?size.priceAdd:0);
  var name=p.name+' — '+frag.name+', '+size.label;
  var fi=p.fragrances.findIndex(function(f){ return f.name===frag.name; });
  var ex=cart.find(function(c){ return c.pid===p.id&&c.name===name; });
  if(ex){ex.qty+=modalState.qty;}else{cart.push({pid:p.id,name:name,price:price,qty:modalState.qty,fragIdx:fi>=0?fi:0,sizeIdx:modalState.sizeIdx,image:frag.image||p.image});}
  saveCart(); updateCartUI(); closeProductModal(); showToast(p.name+' added to cart 🌸');
}
function closeProductModal() {
  var m=document.getElementById('productModal'); if(m) m.classList.remove('open');
  var o=document.getElementById('productModalOverlay'); if(o) o.classList.remove('open');
  document.body.style.overflow='';
}

/* ── ABOUT / HERO ── */
function loadAboutImages() {
  [{id:'aboutImg1',src:siteImages.about1},{id:'aboutImg2',src:siteImages.about2},{id:'aboutImg3',src:siteImages.about3}]
    .forEach(function(kv){ var el=document.getElementById(kv.id); if(el) el.innerHTML='<img src="'+kv.src+'" alt=""/>'; });
}
function loadHeroImage() {
  var w=document.getElementById('heroImgWrap'); if(!w) return;
  w.innerHTML='<img src="'+siteImages.hero+'" alt="Noora Candles">';
}
function handleContactSubmit(e) { e.preventDefault(); showToast("Message sent! We'll be in touch soon 🌸"); e.target.reset(); }
function initDealsPage() {
  var a=document.getElementById('signupDealActions'); if(!a) return;
  if (typeof currentUser!=='undefined'&&currentUser) a.innerHTML='<div class="deal-unlocked"><span class="deal-unlocked-icon">✓</span>You\'re signed in — use code <strong>WELCOME15</strong> at checkout!</div>';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function() {
  initScrollReveal(); setActiveNav(); renderProducts(); initFilters(); loadHeroImage(); loadAboutImages();
  initAuth().then(function() {
    updateCartUI();
    if (typeof updateWishlistCount==='function') updateWishlistCount();
    if (typeof initDealsPage==='function') initDealsPage();
  });
  if (typeof initEmailJS==='function') initEmailJS();
  if (typeof initFragranceFromUrl==='function') initFragranceFromUrl();
  if (typeof renderShopScentGrid==='function') renderShopScentGrid('all');
  if (typeof renderScentGrid==='function') renderScentGrid();
});
window.computePrice = computePrice;