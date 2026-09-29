// Frontend Application Logic for Watch Mart
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentPriceFilter = { min: '', max: '' };
let currentSort = 'popular';
let activeProductForModal = null;
let selectedModalVariant = null;
let selectedModalQuantity = 1;

function initApp() {
  renderHeaderCategoryNav();
  renderHeroStats();
  renderCategoryChips();
  renderProducts();
  renderFeaturedShowcases();
  renderReviews();
  updateCartBadge();
  updateWishlistBadge();
  setupEventListeners();
  initPromoCountdown();
  initSocialLinks();
  if (location.hash === '#admin') document.body.classList.add('admin-mode');
  window.addEventListener('hashchange', () => document.body.classList.toggle('admin-mode', location.hash === '#admin'));

  // Listen to store updates
  window.store.subscribe((event, payload) => {
    if (event === 'cart_updated') {
      updateCartBadge();
      renderCartDrawer();
    }
    if (event === 'wishlist_updated') {
      updateWishlistBadge();
      renderWishlistModal();
      renderProducts();
    }
    if (event === 'product_updated' || event === 'database' || event === 'reset') {
      renderProducts();
      renderFeaturedShowcases();
    }
    if (event === 'settings_updated') {
      applyStoreSettings();
    }
  });

  applyStoreSettings();
}

function applyStoreSettings() {
  const settings = window.store.getSettings();
  if (!settings) return;

  // Update announcement
  const annEl = document.getElementById('top-announcement-text');
  if (annEl) annEl.textContent = settings.announcementText;

  // Update whatsapp floating link
  const waBtn = document.getElementById('floating-whatsapp-link');
  if (waBtn) {
    waBtn.href = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Assalam-o-Alaikum, I am inquiring about watches on Watch Mart Pakistan.')}`;
  }

  // Update brand names
  document.querySelectorAll('.store-brand-name').forEach(el => el.textContent = settings.storeName);
}

// ==========================================================================
// RENDERERS
// ==========================================================================
function renderHeaderCategoryNav() {
  const cats = window.store.getCategories();
  const navContainer = document.getElementById('desktop-nav-categories');
  if (!navContainer) return;

  navContainer.innerHTML = cats.slice(0, 7).map(c => `
    <li class="nav-item">
      <a href="#shop" class="nav-link ${currentCategoryFilter === c.id ? 'active' : ''}" data-category="${c.id}">
        ${c.name}
        ${c.id === 'sale' ? '<span class="nav-badge-hot">SALE</span>' : ''}
      </a>
    </li>
  `).join('');
}

function renderCategoryChips() {
  const cats = window.store.getCategories();
  const chipsContainer = document.getElementById('category-filter-chips');
  if (!chipsContainer) return;

  chipsContainer.innerHTML = cats.map(c => `
    <button class="chip-btn ${currentCategoryFilter === c.id ? 'active' : ''}" data-category="${c.id}">
      <span>${c.name}</span>
      <span style="font-size: 0.75rem; opacity: 0.7;">(${window.store.getProducts({ category: c.id }).length})</span>
    </button>
  `).join('');
}

function renderHeroStats() {
  const products = window.store.getProducts();
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalReviews = window.store.getReviews().length;

  const statReviews = document.getElementById('stat-happy-clients');
  if (statReviews) statReviews.textContent = `${totalReviews * 300}+`;
}

function renderProducts() {
  const grid = document.getElementById('main-products-grid');
  if (!grid) return;

  const products = window.store.getProducts({
    category: currentCategoryFilter,
    search: currentSearchQuery,
    minPrice: currentPriceFilter.min,
    maxPrice: currentPriceFilter.max,
    sort: currentSort
  });

  const countEl = document.getElementById('products-count-label');
  if (countEl) countEl.textContent = `Showing ${products.length} luxury timepieces`;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-dim); margin-bottom: 1rem;">
          <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
        <h3 class="serif-title" style="margin-bottom: 0.5rem;">No Watches Found</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Try adjusting your search criteria or resetting filters.</p>
        <button class="btn-secondary" style="margin-top: 1.5rem;" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const isWishlist = window.store.isInWishlist(p.id);
    const discountPercent = p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0;
    const isLowStock = p.stock > 0 && p.stock <= (p.lowStockThreshold || 3);
    const isOutOfStock = p.stock <= 0;

    return `
      <div class="product-card" data-product-id="${p.id}">
        <div class="product-card-media">
          <div class="product-card-badges">
            ${p.isSale ? `<span class="badge badge-sale">SALE ${discountPercent}% OFF</span>` : ''}
            ${p.isNewArrival ? `<span class="badge badge-new">NEW ARRIVAL</span>` : ''}
            ${p.isBestSeller ? `<span class="badge badge-gold">BESTSELLER</span>` : ''}
            ${isLowStock ? `<span class="badge badge-sale" style="background:#B91C1C;color:#fff;">ONLY ${p.stock} LEFT</span>` : ''}
            ${isOutOfStock ? `<span class="badge" style="background:#4B5563;color:#fff;">OUT OF STOCK</span>` : ''}
          </div>

          <button class="product-card-wishlist ${isWishlist ? 'active' : ''}" onclick="handleWishlistClick(event, '${p.id}')" title="Save to Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <img src="${p.images[0]}" alt="${p.name}" class="product-card-img" loading="lazy" onclick="openProductModal('${p.id}')" />

          <div class="product-quick-actions">
            <button class="btn-primary" style="flex:1; padding:0.6rem; font-size:0.78rem;" onclick="openProductModal('${p.id}')">
              Quick View
            </button>
            <button class="btn-secondary" style="padding:0.6rem; background:rgba(10,11,14,0.9);" onclick="handleDirectAddToCart('${p.id}')" ${isOutOfStock ? 'disabled' : ''} title="Add to Cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-category-label">${p.brand}</span>
            <div class="product-rating-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>${p.rating || '5.0'} (${p.reviewCount || 10})</span>
            </div>
          </div>

          <h3 class="product-card-title" onclick="openProductModal('${p.id}')">${p.name}</h3>
          <p class="product-card-strap">${p.strapType} &bull; ${p.gender || 'Unisex'}</p>

          <div class="product-price-row">
            <span class="product-price-current">Rs. ${(p.salePrice || p.price).toLocaleString()}</span>
            ${p.salePrice ? `<span class="product-price-original">Rs. ${p.price.toLocaleString()}</span>` : ''}
            ${discountPercent > 0 ? `<span class="product-discount-pill">-${discountPercent}%</span>` : ''}
          </div>

          <div class="product-card-footer-btns">
            <button class="btn-primary" style="padding:0.65rem 0.5rem; font-size:0.75rem;" onclick="handleDirectAddToCart('${p.id}')" ${isOutOfStock ? 'disabled' : ''}>
              ${isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
            <button class="btn-whatsapp" style="padding:0.65rem 0.5rem; font-size:0.75rem;" onclick="handleDirectWhatsApp('${p.id}')">
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderFeaturedShowcases() {
  // Best Sellers Showcase
  const bestSellers = window.store.getProducts().filter(p => p.isBestSeller).slice(0, 4);
  const bestSellersContainer = document.getElementById('bestsellers-grid');
  if (bestSellersContainer) {
    bestSellersContainer.innerHTML = bestSellers.map(p => `
      <div class="product-card" onclick="openProductModal('${p.id}')">
        <div class="product-card-media" style="height:230px;">
          <img src="${p.images[0]}" alt="${p.name}" class="product-card-img" />
          <span class="badge badge-gold" style="position:absolute;top:10px;left:10px;">BESTSELLER</span>
        </div>
        <div class="product-card-body" style="padding:1rem;">
          <h4 class="product-card-title" style="font-size:0.95rem;">${p.name}</h4>
          <div class="product-price-row" style="margin-top:0.4rem;">
            <span class="product-price-current" style="font-size:1.1rem;">Rs. ${(p.salePrice || p.price).toLocaleString()}</span>
            ${p.salePrice ? `<span class="product-price-original">Rs. ${p.price.toLocaleString()}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  // New Arrivals Showcase
  const newArrivals = window.store.getProducts().filter(p => p.isNewArrival).slice(0, 4);
  const newArrivalsContainer = document.getElementById('newarrivals-grid');
  if (newArrivalsContainer) {
    newArrivalsContainer.innerHTML = newArrivals.map(p => `
      <div class="product-card" onclick="openProductModal('${p.id}')">
        <div class="product-card-media" style="height:230px;">
          <img src="${p.images[0]}" alt="${p.name}" class="product-card-img" />
          <span class="badge badge-new" style="position:absolute;top:10px;left:10px;">NEW</span>
        </div>
        <div class="product-card-body" style="padding:1rem;">
          <h4 class="product-card-title" style="font-size:0.95rem;">${p.name}</h4>
          <div class="product-price-row" style="margin-top:0.4rem;">
            <span class="product-price-current" style="font-size:1.1rem;">Rs. ${(p.salePrice || p.price).toLocaleString()}</span>
            ${p.salePrice ? `<span class="product-price-original">Rs. ${p.price.toLocaleString()}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }
}

function renderReviews() {
  const container = document.getElementById('customer-reviews-container');
  if (!container) return;

  const reviews = window.store.getReviews().filter(r => r.status === 'approved').slice(0, 6);
  container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">
        ${Array.from({ length: r.rating || 5 }).map(() => `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        `).join('')}
      </div>
      <p class="review-text">"${r.comment}"</p>
      <div class="review-author-meta">
        <div>
          <div class="reviewer-name">${r.customerName}</div>
          <div class="reviewer-city">${r.city || 'Pakistan'} &bull; <span style="color:var(--emerald-accent); font-weight:600;">Verified Buyer</span></div>
        </div>
        <span style="font-size:0.75rem; color:var(--text-dim);">${r.date || 'Recent'}</span>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// PRODUCT DETAIL MODAL & ZOOM
// ==========================================================================
function openProductModal(productId) {
  const product = window.store.getProductById(productId);
  if (!product) return;

  activeProductForModal = product;
  selectedModalVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  selectedModalQuantity = 1;

  const modalBackdrop = document.getElementById('product-modal-backdrop');
  const modalContainer = document.getElementById('product-modal-content');
  if (!modalBackdrop || !modalContainer) return;

  const discountPercent = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const isOutOfStock = product.stock <= 0;

  modalContainer.innerHTML = `
    <div class="product-detail-layout">
      <!-- Media Gallery -->
      <div class="detail-gallery">
        <div class="detail-main-img-box" id="detail-zoom-container">
          <img src="${product.images[0]}" alt="${product.name}" class="detail-main-img" id="detail-active-img" />
          <div style="position:absolute; bottom:12px; left:12px; background:rgba(0,0,0,0.6); padding:4px 8px; border-radius:4px; font-size:0.75rem; color:var(--gold-light);">
            Hover / Move mouse to zoom
          </div>
        </div>
        <div class="detail-thumbs-strip">
          ${product.images.map((img, i) => `
            <button class="detail-thumb-btn ${i === 0 ? 'active' : ''}" onclick="switchModalThumb('${img}', this)">
              <img src="${img}" alt="Angle ${i + 1}" />
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Product Meta & Actions -->
      <div class="detail-info">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
          <span class="badge badge-gold">${product.brand} &bull; ${product.category.toUpperCase()}</span>
          <span style="font-size:0.8rem; color:var(--text-dim);">SKU: ${product.sku}</span>
        </div>

        <h1 class="serif-title" style="font-size:1.85rem; margin-bottom:0.75rem; color:#fff;">${product.name}</h1>

        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem;">
          <div style="display:flex; align-items:center; gap:4px; color:var(--gold-primary);">
            ${Array.from({ length: 5 }).map(() => `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            `).join('')}
            <span style="font-weight:700; color:#fff; margin-left:4px;">${product.rating || '5.0'}</span>
          </div>
          <span style="color:var(--text-dim);">&bull;</span>
          <span style="font-size:0.85rem; color:var(--text-muted);">${product.reviewCount || 20} customer reviews</span>
          <span style="color:var(--text-dim);">&bull;</span>
          <span style="font-size:0.85rem; color:${product.stock > 0 ? 'var(--emerald-accent)' : '#EF4444'}; font-weight:700;">
            ${product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
          </span>
        </div>

        <!-- Price Showcase -->
        <div style="display:flex; align-items:baseline; gap:1rem; padding:1rem; background:rgba(212,175,55,0.06); border:1px solid var(--gold-border); border-radius:var(--radius-sm); margin-bottom:1.5rem;">
          <span style="font-size:2rem; font-weight:800; color:#fff;">Rs. ${(product.salePrice || product.price).toLocaleString()}</span>
          ${product.salePrice ? `<span style="font-size:1.15rem; color:var(--text-dim); text-decoration:line-through;">Rs. ${product.price.toLocaleString()}</span>` : ''}
          ${discountPercent > 0 ? `<span class="badge badge-sale">Save ${discountPercent}%</span>` : ''}
        </div>

        <p style="font-size:0.95rem; color:var(--text-muted); line-height:1.7; margin-bottom:1.5rem;">
          ${product.description || product.shortDesc}
        </p>

        <!-- Variants -->
        ${product.variants && product.variants.length > 0 ? `
          <div class="variant-selector-group">
            <label class="form-label" style="display:flex; justify-content:space-between;">
              <span>Select Color / Edition:</span>
              <strong id="modal-selected-variant-name" style="color:var(--gold-light);">${selectedModalVariant ? selectedModalVariant.name : ''}</strong>
            </label>
            <div class="variant-options-row">
              ${product.variants.map((v, idx) => `
                <div class="variant-pill ${idx === 0 ? 'active' : ''}" onclick="selectModalVariant('${v.name}', this)">
                  <span class="variant-dot" style="background:${v.hex || '#D4AF37'};"></span>
                  <span>${v.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Quantity & Order Buttons -->
        <div style="display:flex; align-items:center; gap:1rem; margin:1.5rem 0;">
          <div class="quantity-control">
            <button class="qty-btn" onclick="changeModalQty(-1)">&minus;</button>
            <span class="qty-val" id="modal-qty-display">1</span>
            <button class="qty-btn" onclick="changeModalQty(1)">&plus;</button>
          </div>
          <button class="btn-primary" style="flex:1;" onclick="handleAddToCartFromModal()" ${isOutOfStock ? 'disabled' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            ${isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}
          </button>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:2rem;">
          <button class="btn-secondary" style="border-color:var(--gold-primary);" onclick="handleBuyNowFromModal()" ${isOutOfStock ? 'disabled' : ''}>
            ⚡ Instant Buy Now
          </button>
          <button class="btn-whatsapp" onclick="handleWhatsAppOrderFromModal()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
            </svg>
            Order via WhatsApp
          </button>
        </div>

        <!-- Specifications Table -->
        <div style="border-top:1px solid var(--border-light); padding-top:1.5rem;">
          <h4 class="serif-title" style="font-size:1.05rem; margin-bottom:0.75rem; color:#fff;">Technical Specifications</h4>
          <table class="specs-table">
            <tbody>
              ${Object.entries(product.specs || {}).map(([key, val]) => `
                <tr>
                  <td>${formatSpecKey(key)}</td>
                  <td>${val}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Delivery & Return Accordions -->
        <div style="margin-top:1.5rem; display:flex; flex-direction:column; gap:0.75rem;">
          <div style="background:var(--bg-elevated); padding:0.85rem 1.15rem; border-radius:var(--radius-sm); border:1px solid var(--border-light); font-size:0.85rem;">
            <strong style="color:var(--gold-light);">🚚 Express Pakistan Delivery:</strong>
            <p style="color:var(--text-muted); margin-top:4px;">1-2 Days in Lahore, 2-3 Days in Karachi, Islamabad, Rawalpindi & nationwide via TCS / Leopards. Free delivery on orders above Rs. 5,000.</p>
          </div>
          <div style="background:var(--bg-elevated); padding:0.85rem 1.15rem; border-radius:var(--radius-sm); border:1px solid var(--border-light); font-size:0.85rem;">
            <strong style="color:var(--gold-light);">🛡️ 7-Day Guarantee:</strong>
            <p style="color:var(--text-muted); margin-top:4px;">Check your parcel before payment (Open parcel policy available). 7-Day hassle-free return/exchange warranty.</p>
          </div>
        </div>

        <!-- Customer Review Form -->
        <div style="margin-top:2rem; border-top:1px solid var(--border-light); padding-top:1.5rem;">
          <h4 class="serif-title" style="font-size:1.05rem; margin-bottom:1rem; color:#fff;">Write a Customer Review</h4>
          <form onsubmit="handleReviewSubmit(event, '${product.id}')" style="display:flex; flex-direction:column; gap:0.75rem;">
            <div class="form-row">
              <input type="text" id="review-name-input" class="form-control" placeholder="Your Name (e.g. Tariq Mehmood)" required />
              <input type="text" id="review-city-input" class="form-control" placeholder="City (e.g. Lahore / Karachi)" required />
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="form-label">Rating:</span>
              <select id="review-rating-input" class="form-control" style="width:140px;">
                <option value="5">★★★★★ (5/5)</option>
                <option value="4">★★★★☆ (4/5)</option>
                <option value="3">★★★☆☆ (3/5)</option>
              </select>
            </div>
            <textarea id="review-comment-input" class="form-control" rows="3" placeholder="Share your experience regarding the quality, packaging, and delivery..." required></textarea>
            <button type="submit" class="btn-outline-gold" style="align-self:flex-start;">Submit Verified Review</button>
          </form>
        </div>
      </div>
    </div>
  `;

  setupZoomEffect();
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modalBackdrop = document.getElementById('product-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function switchModalThumb(imgSrc, btn) {
  const mainImg = document.getElementById('detail-active-img');
  if (mainImg) mainImg.src = imgSrc;
  document.querySelectorAll('.detail-thumb-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectModalVariant(variantName, pill) {
  if (!activeProductForModal) return;
  selectedModalVariant = activeProductForModal.variants.find(v => v.name === variantName);
  const lbl = document.getElementById('modal-selected-variant-name');
  if (lbl) lbl.textContent = variantName;
  document.querySelectorAll('.variant-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
}

function changeModalQty(delta) {
  selectedModalQuantity = Math.max(1, selectedModalQuantity + delta);
  if (activeProductForModal && selectedModalQuantity > activeProductForModal.stock) {
    selectedModalQuantity = activeProductForModal.stock;
    showToast(`Only ${activeProductForModal.stock} units available in stock`, 'warning');
  }
  const display = document.getElementById('modal-qty-display');
  if (display) display.textContent = selectedModalQuantity;
}

function setupZoomEffect() {
  const container = document.getElementById('detail-zoom-container');
  const img = document.getElementById('detail-active-img');
  if (!container || !img) return;

  container.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = 'scale(2)';
  });

  container.addEventListener('mouseleave', () => {
    img.style.transformOrigin = 'center center';
    img.style.transform = 'scale(1)';
  });
}

function formatSpecKey(key) {
  const map = {
    movement: "Movement Mechanism",
    caseDiameter: "Case Diameter",
    caseThickness: "Case Thickness",
    caseMaterial: "Case Material",
    glass: "Dial Crystal Glass",
    waterResistance: "Water Resistance",
    strapWidth: "Strap Width & Material",
    powerReserve: "Power Reserve",
    batteryLife: "Battery Life",
    features: "Special Features",
    warranty: "Warranty Coverage",
    setContains: "Set Contents",
    durability: "Durability Standard"
  };
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

// ==========================================================================
// CART & DRAWER ACTIONS
// ==========================================================================
function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cart-drawer-backdrop');
  if (drawer) drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer-backdrop');
  if (drawer) drawer.classList.remove('open');
  document.body.style.overflow = '';
}

function updateCartBadge() {
  const count = window.store.getCartCount();
  document.querySelectorAll('.cart-counter-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function updateWishlistBadge() {
  const count = window.store.wishlist.length;
  document.querySelectorAll('.wishlist-counter-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderCartDrawer() {
  const listContainer = document.getElementById('drawer-items-list');
  const footerContainer = document.getElementById('drawer-footer-content');
  const progressContainer = document.getElementById('drawer-shipping-progress');
  if (!listContainer || !footerContainer) return;

  const cart = window.store.cart;
  const calc = window.store.getCartCalculation();

  // Progress Bar for free shipping
  if (progressContainer) {
    const threshold = window.store.getSettings().freeShippingThreshold || 5000;
    const percent = Math.min(100, Math.round((calc.subtotal / threshold) * 100));
    progressContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:600;">
        <span>${calc.isFreeShipping ? '🎉 Congratulations! You unlocked FREE Delivery' : `Add Rs. ${calc.remainingForFreeShip.toLocaleString()} more for FREE shipping`}</span>
        <span>${percent}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar" style="width: ${percent}%;"></div>
      </div>
    `;
  }

  if (cart.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text-dim); margin-bottom:1rem;">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        </svg>
        <h4 class="serif-title" style="margin-bottom:0.5rem;">Your Cart is Empty</h4>
        <p style="color:var(--text-muted); font-size:0.85rem;">Discover our collection of fine timepieces and treat yourself.</p>
        <button class="btn-primary" style="margin-top:1.5rem;" onclick="closeCartDrawer(); window.location.hash = 'shop';">Shop Now</button>
      </div>
    `;
    footerContainer.innerHTML = '';
    return;
  }

  listContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
      <div class="cart-item-details">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <h4 style="font-size:0.9rem; font-weight:700; color:#fff; line-height:1.3; max-width:200px;">${item.name}</h4>
          <button onclick="window.store.removeFromCart(${index})" style="color:var(--text-dim); padding:2px;" title="Remove">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <span style="font-size:0.75rem; color:var(--gold-light); margin-top:2px;">Edition: ${item.variant}</span>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:0.5rem;">
          <div class="quantity-control" style="transform:scale(0.85); transform-origin:left center;">
            <button class="qty-btn" onclick="window.store.updateCartQuantity(${index}, ${item.quantity - 1})">&minus;</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="window.store.updateCartQuantity(${index}, ${item.quantity + 1})">&plus;</button>
          </div>
          <span style="font-weight:800; color:#fff; font-size:0.95rem;">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join('');

  footerContainer.innerHTML = `
    <!-- Coupon input -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
      <input type="text" id="cart-coupon-input" placeholder="Coupon Code (e.g. WELCOME10)" value="${calc.activeCoupon ? calc.activeCoupon.code : ''}" style="flex:1; padding:0.65rem 0.85rem; font-size:0.82rem; text-transform:uppercase;" />
      ${calc.activeCoupon ? `
        <button class="btn-secondary" style="padding:0.65rem 0.85rem; color:#EF4444;" onclick="window.store.removeCouponFromCart()">Remove</button>
      ` : `
        <button class="btn-outline-gold" style="padding:0.65rem 0.85rem;" onclick="handleApplyCoupon()">Apply</button>
      `}
    </div>

    <!-- Calculations -->
    <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.85rem; margin-bottom:1.25rem;">
      <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
        <span>Cart Subtotal</span>
        <span>Rs. ${calc.subtotal.toLocaleString()}</span>
      </div>
      ${calc.discount > 0 ? `
        <div style="display:flex; justify-content:space-between; color:#34D399; font-weight:600;">
          <span>Discount Applied (${calc.activeCoupon.code})</span>
          <span>- Rs. ${calc.discount.toLocaleString()}</span>
        </div>
      ` : ''}
      <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
        <span>Estimated Delivery (Pakistan)</span>
        <span>${calc.isFreeShipping ? '<strong style="color:var(--emerald-accent);">FREE</strong>' : `Rs. ${calc.shipping}`}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:800; color:#fff; border-top:1px solid var(--border-light); padding-top:0.75rem; margin-top:0.25rem;">
        <span>Final Total</span>
        <span class="gold-gradient-text">Rs. ${calc.finalTotal.toLocaleString()}</span>
      </div>
    </div>

    <button class="btn-primary" style="width:100%; padding:0.95rem;" onclick="closeCartDrawer(); openCheckoutModal();">
      Proceed to Safe Checkout &rarr;
    </button>
  `;
}

function handleApplyCoupon() {
  const input = document.getElementById('cart-coupon-input');
  if (!input || !input.value.trim()) {
    showToast("Please enter a valid coupon code", "warning");
    return;
  }
  const res = window.store.applyCouponToCart(input.value);
  if (res.success) {
    showToast(res.message, "success");
  } else {
    showToast(res.message, "error");
  }
}

function handleDirectAddToCart(productId) {
  const product = window.store.getProductById(productId);
  if (!product) return;
  if (product.stock <= 0) {
    showToast("Sorry, this watch is currently out of stock.", "error");
    return;
  }
  window.store.addToCart(product, 1);
  showToast(`Added "${product.name}" to cart!`, "success");
}

function handleAddToCartFromModal() {
  if (!activeProductForModal) return;
  if (activeProductForModal.stock <= 0) {
    showToast("Item is out of stock", "error");
    return;
  }
  window.store.addToCart(activeProductForModal, selectedModalQuantity, selectedModalVariant);
  closeProductModal();
  openCartDrawer();
  showToast(`Added ${selectedModalQuantity}x "${activeProductForModal.name}" to cart!`, "success");
}

function handleBuyNowFromModal() {
  if (!activeProductForModal) return;
  window.store.addToCart(activeProductForModal, selectedModalQuantity, selectedModalVariant);
  closeProductModal();
  openCheckoutModal();
}

function handleDirectWhatsApp(productId) {
  const product = window.store.getProductById(productId);
  if (!product) return;
  const settings = window.store.getSettings();
  const text = `Assalam-o-Alaikum Watch Mart,\nI am interested in buying:\n⌚ *${product.name}*\n🏷️ SKU: ${product.sku}\n💰 Price: Rs. ${(product.salePrice || product.price).toLocaleString()}\n🔗 Image: ${product.images[0]}\n\nPlease confirm availability and Cash on Delivery details. Thank you!`;
  window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
}

function handleWhatsAppOrderFromModal() {
  if (!activeProductForModal) return;
  const settings = window.store.getSettings();
  const variantName = selectedModalVariant ? selectedModalVariant.name : 'Standard';
  const text = `Assalam-o-Alaikum Watch Mart,\nI want to place an order via WhatsApp:\n⌚ *${activeProductForModal.name}*\n🏷️ SKU: ${activeProductForModal.sku}\n🎨 Variant: ${variantName}\n🔢 Qty: ${selectedModalQuantity}\n💰 Total: Rs. ${((activeProductForModal.salePrice || activeProductForModal.price) * selectedModalQuantity).toLocaleString()}\n\nCustomer Details:\nPlease send me order confirmation form.`;
  window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
}

function handleWishlistClick(e, productId) {
  e.stopPropagation();
  const added = window.store.toggleWishlist(productId);
  const product = window.store.getProductById(productId);
  if (added) {
    showToast(`Saved "${product.name}" to your Wishlist!`, "success");
  } else {
    showToast(`Removed from your Wishlist`, "info");
  }
}

// ==========================================================================
// CHECKOUT MODAL & ORDER PLACEMENT
// ==========================================================================
let currentSelectedPaymentMethod = "Cash on Delivery (COD)";

function openCheckoutModal() {
  if (window.store.cart.length === 0) {
    showToast("Your cart is empty. Add a watch first!", "warning");
    return;
  }

  const modalBackdrop = document.getElementById('checkout-modal-backdrop');
  const modalContainer = document.getElementById('checkout-modal-content');
  if (!modalBackdrop || !modalContainer) return;

  const defaultCity = "Lahore";
  const calc = window.store.getCartCalculation(defaultCity);
  const shippingRates = window.store.getShippingRates();

  modalContainer.innerHTML = `
    <div class="checkout-grid">
      <!-- Checkout Customer Form -->
      <div class="checkout-form-section">
        <div>
          <span class="section-eyebrow">Fast & Secure Checkout</span>
          <h2 class="serif-title" style="font-size:1.6rem; color:#fff;">Delivery Information</h2>
          <p style="font-size:0.85rem; color:var(--text-muted);">Please provide your accurate shipping address for Pakistan courier delivery.</p>
        </div>

        <form id="checkout-order-form" onsubmit="handlePlaceOrder(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" id="checkout-name" class="form-control" placeholder="e.g. Muhammad Zeeshan" required />
            </div>
            <div class="form-group">
              <label class="form-label">WhatsApp / Mobile Number *</label>
              <input type="tel" id="checkout-phone" class="form-control" placeholder="0300 1234567" pattern="[0-9]{11}" title="Enter valid 11-digit Pakistani mobile number" required />
            </div>
          </div>

          <div class="form-group" style="margin-top:0.75rem;">
            <label class="form-label">Email Address (for order receipt & tracking)</label>
            <input type="email" id="checkout-email" class="form-control" placeholder="zeeshan@example.com" />
          </div>

          <div class="form-row" style="margin-top:0.75rem;">
            <div class="form-group">
              <label class="form-label">City *</label>
              <select id="checkout-city" class="form-control" onchange="handleCheckoutCityChange(this.value)" required>
                ${shippingRates.map(r => `
                  <option value="${r.city}" ${r.city === defaultCity ? 'selected' : ''}>${r.city} (${r.estDays})</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Sector / Area / Colony *</label>
              <input type="text" id="checkout-area" class="form-control" placeholder="e.g. DHA Phase 5 / Gulshan" required />
            </div>
          </div>

          <div class="form-group" style="margin-top:0.75rem;">
            <label class="form-label">Complete Street Address (House/Shop #, Street #) *</label>
            <textarea id="checkout-address" class="form-control" rows="2" placeholder="House 14-B, Street 3, Block A..." required></textarea>
          </div>

          <div class="form-group" style="margin-top:0.75rem;">
            <label class="form-label">Special Delivery Instructions / Notes (Optional)</label>
            <input type="text" id="checkout-notes" class="form-control" placeholder="e.g. Please deliver after 3 PM" />
          </div>

          <!-- Payment Methods Selection -->
          <div style="margin-top:1.5rem;">
            <label class="form-label" style="margin-bottom:0.75rem; display:block;">Select Payment Method:</label>

            <!-- Cash on Delivery -->
            <div class="payment-method-card active" onclick="selectPaymentMethod(this, 'Cash on Delivery (COD)')">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <input type="radio" name="paymentMethod" value="COD" checked />
                  <div>
                    <strong style="color:#fff; font-size:0.9rem;">Cash on Delivery (COD)</strong>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Pay with cash when your parcel arrives at your doorstep.</p>
                  </div>
                </div>
                <span class="badge badge-gold">POPULAR</span>
              </div>
            </div>

            <!-- Direct Bank Transfer -->
            <div class="payment-method-card" onclick="selectPaymentMethod(this, 'Direct Bank Transfer (Meezan Bank)')">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <input type="radio" name="paymentMethod" value="Bank" />
                <div>
                  <strong style="color:#fff; font-size:0.9rem;">Direct Bank Transfer</strong>
                  <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Meezan Bank / Alfalah / HBL account details provided at confirmation.</p>
                </div>
              </div>
            </div>

            <!-- JazzCash / EasyPaisa -->
            <div class="payment-method-card" onclick="selectPaymentMethod(this, 'JazzCash / EasyPaisa Mobile Wallet')">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <input type="radio" name="paymentMethod" value="MobileWallet" />
                <div>
                  <strong style="color:#fff; font-size:0.9rem;">JazzCash / EasyPaisa</strong>
                  <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Instant transfer to official merchant account.</p>
                </div>
              </div>
            </div>

            <!-- Credit / Debit Card -->
            <div class="payment-method-card" onclick="selectPaymentMethod(this, 'Online Card Payment (Visa / Mastercard)')">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <input type="radio" name="paymentMethod" value="Card" />
                <div>
                  <strong style="color:#fff; font-size:0.9rem;">Debit / Credit Card (Visa / Mastercard)</strong>
                  <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Encrypted 256-bit secure gateway simulation.</p>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" class="btn-primary" style="width:100%; margin-top:1.5rem; padding:1.1rem; font-size:0.95rem;">
            Confirm & Place Order &rarr;
          </button>
        </form>
      </div>

      <!-- Order Summary Column -->
      <div class="order-summary-box">
        <h3 class="serif-title" style="font-size:1.15rem; color:#fff; margin-bottom:1rem; border-bottom:1px solid var(--border-light); padding-bottom:0.75rem;">
          Order Summary (${window.store.getCartCount()} items)
        </h3>

        <div style="max-height:280px; overflow-y:auto; display:flex; flex-direction:column; gap:0.85rem; margin-bottom:1.5rem;">
          ${window.store.cart.map(item => `
            <div style="display:flex; gap:0.75rem; align-items:center;">
              <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; border:1px solid var(--border-light);" />
              <div style="flex:1;">
                <h5 style="font-size:0.82rem; color:#fff; line-height:1.2;">${item.name}</h5>
                <span style="font-size:0.72rem; color:var(--text-dim);">Qty: ${item.quantity} &bull; ${item.variant}</span>
              </div>
              <span style="font-size:0.85rem; font-weight:700; color:#fff;">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>

        <div id="checkout-pricing-summary">
          <!-- Dynamic pricing rendered below -->
        </div>

        <div style="background:rgba(212,175,55,0.06); border:1px solid var(--gold-border); border-radius:var(--radius-sm); padding:0.85rem; margin-top:1.5rem; font-size:0.78rem; color:var(--text-muted);">
          🔒 <strong>Buyer Protection Guaranteed:</strong> Your order is covered by our 7-Day Exchange & 1-Year Movement Warranty.
        </div>
      </div>
    </div>
  `;

  renderCheckoutPricing(defaultCity);
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modalBackdrop = document.getElementById('checkout-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function selectPaymentMethod(element, methodName) {
  document.querySelectorAll('.payment-method-card').forEach(c => {
    c.classList.remove('active');
    const radio = c.querySelector('input[type="radio"]');
    if (radio) radio.checked = false;
  });
  element.classList.add('active');
  const r = element.querySelector('input[type="radio"]');
  if (r) r.checked = true;
  currentSelectedPaymentMethod = methodName;
}

function handleCheckoutCityChange(city) {
  renderCheckoutPricing(city);
}

function renderCheckoutPricing(city) {
  const container = document.getElementById('checkout-pricing-summary');
  if (!container) return;
  const calc = window.store.getCartCalculation(city);

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.85rem; border-top:1px solid var(--border-light); padding-top:1rem;">
      <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
        <span>Subtotal</span>
        <span>Rs. ${calc.subtotal.toLocaleString()}</span>
      </div>
      ${calc.discount > 0 ? `
        <div style="display:flex; justify-content:space-between; color:#34D399; font-weight:600;">
          <span>Coupon Discount (${calc.activeCoupon.code})</span>
          <span>- Rs. ${calc.discount.toLocaleString()}</span>
        </div>
      ` : ''}
      <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
        <span>Delivery to ${city}</span>
        <span>${calc.isFreeShipping ? '<strong style="color:var(--emerald-accent);">FREE</strong>' : `Rs. ${calc.shipping}`}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:1.25rem; font-weight:800; color:#fff; border-top:1px solid var(--border-light); padding-top:0.75rem; margin-top:0.25rem;">
        <span>Grand Total</span>
        <span class="gold-gradient-text">Rs. ${calc.finalTotal.toLocaleString()}</span>
      </div>
    </div>
  `;
}

function handlePlaceOrder(e) {
  e.preventDefault();

  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const city = document.getElementById('checkout-city').value;
  const area = document.getElementById('checkout-area').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const notes = document.getElementById('checkout-notes').value.trim();

  const calc = window.store.getCartCalculation(city);

  const orderData = {
    customer: {
      name,
      phone,
      email: email || `${phone}@customer.pk`,
      city,
      area,
      address,
      notes
    },
    items: JSON.parse(JSON.stringify(window.store.cart)),
    subtotal: calc.subtotal,
    discount: calc.discount,
    couponCode: calc.activeCoupon ? calc.activeCoupon.code : null,
    deliveryCharges: calc.shipping,
    total: calc.finalTotal,
    paymentMethod: currentSelectedPaymentMethod,
    paymentStatus: currentSelectedPaymentMethod.includes('COD') ? 'Pending COD' : 'Pending Verification'
  };

  const newOrder = window.store.createOrder(orderData);
  notifyStoreOwnerOnWhatsApp(newOrder);
  closeCheckoutModal();
  openOrderConfirmationModal(newOrder);
  showToast(`Order #${newOrder.id} placed successfully!`, "success");
}

function openOrderConfirmationModal(order) {
  const modalBackdrop = document.getElementById('order-confirm-modal-backdrop');
  const modalContainer = document.getElementById('order-confirm-modal-content');
  if (!modalBackdrop || !modalContainer) return;

  const settings = window.store.getSettings();

  modalContainer.innerHTML = `
    <div class="invoice-container">
      <div class="invoice-header">
        <div>
          <h2 style="font-family:var(--font-serif); font-size:1.6rem; color:#0A0B0E;">${settings.storeName}</h2>
          <p style="font-size:0.8rem; color:#64748B;">Official Horology Store Pakistan</p>
          <p style="font-size:0.8rem; color:#64748B;">WhatsApp: ${settings.phone}</p>
        </div>
        <div style="text-align:right;">
          <h3 style="color:#0A0B0E; font-size:1.1rem;">ORDER INVOICE</h3>
          <p style="font-size:0.85rem; font-weight:700; color:#D4AF37;">Order ID: ${order.id}</p>
          <p style="font-size:0.8rem; color:#64748B;">Date: ${new Date(order.date).toLocaleDateString('en-GB')}</p>
          <p style="font-size:0.8rem; color:#059669; font-weight:700;">Status: Order Confirmed</p>
        </div>
      </div>

      <!-- Customer & Courier Info -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; background:#F8FAFC; padding:1rem; border-radius:6px;">
        <div>
          <h4 style="font-size:0.85rem; color:#64748B; text-transform:uppercase;">Billed & Shipped To:</h4>
          <strong style="color:#0A0B0E; font-size:0.95rem;">${order.customer.name}</strong>
          <p style="font-size:0.85rem; color:#334155; margin-top:2px;">Phone: ${order.customer.phone}</p>
          <p style="font-size:0.85rem; color:#334155;">${order.customer.address}, ${order.customer.area}, ${order.customer.city}</p>
        </div>
        <div>
          <h4 style="font-size:0.85rem; color:#64748B; text-transform:uppercase;">Courier & Payment:</h4>
          <p style="font-size:0.85rem; color:#334155;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p style="font-size:0.85rem; color:#334155;"><strong>Assigned Courier:</strong> ${order.courier}</p>
          <p style="font-size:0.85rem; color:#334155;"><strong>Tracking #:</strong> ${order.trackingNumber}</p>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem;">
        <thead>
          <tr style="border-bottom:2px solid #E2E8F0; text-align:left; font-size:0.8rem; color:#64748B;">
            <th style="padding:0.6rem 0;">Item Description</th>
            <th style="padding:0.6rem 0; text-align:center;">Qty</th>
            <th style="padding:0.6rem 0; text-align:right;">Unit Price</th>
            <th style="padding:0.6rem 0; text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr style="border-bottom:1px solid #E2E8F0; font-size:0.88rem;">
              <td style="padding:0.75rem 0;">
                <strong style="color:#0A0B0E;">${item.name}</strong>
                <div style="font-size:0.75rem; color:#64748B;">Edition: ${item.variant} &bull; SKU: ${item.sku}</div>
              </td>
              <td style="padding:0.75rem 0; text-align:center;">${item.quantity}</td>
              <td style="padding:0.75rem 0; text-align:right;">Rs. ${item.price.toLocaleString()}</td>
              <td style="padding:0.75rem 0; text-align:right; font-weight:700;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex; justify-content:flex-end; margin-bottom:2rem;">
        <div style="width:260px; display:flex; flex-direction:column; gap:0.4rem; font-size:0.88rem;">
          <div style="display:flex; justify-content:space-between; color:#64748B;">
            <span>Subtotal:</span>
            <span>Rs. ${order.subtotal.toLocaleString()}</span>
          </div>
          ${order.discount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:#059669; font-weight:600;">
              <span>Discount:</span>
              <span>- Rs. ${order.discount.toLocaleString()}</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; color:#64748B;">
            <span>Delivery Charges:</span>
            <span>${order.deliveryCharges === 0 ? 'FREE' : `Rs. ${order.deliveryCharges}`}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.15rem; color:#0A0B0E; border-top:2px solid #0A0B0E; padding-top:0.5rem; margin-top:0.25rem;">
            <span>Amount to Pay:</span>
            <span>Rs. ${order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; gap:1rem; justify-content:center;" class="no-print">
        <button class="btn-whatsapp" onclick="sendOrderConfirmationWhatsApp('${order.id}')">
          Send Invoice to WhatsApp
        </button>
        <button class="btn-secondary" style="color:#0A0B0E; border-color:#CBD5E1;" onclick="window.print()">
          Print Official Invoice
        </button>
        <button class="btn-primary" onclick="closeOrderConfirmationModal()">
          Continue Shopping
        </button>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('open');
}

function closeOrderConfirmationModal() {
  const modalBackdrop = document.getElementById('order-confirm-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('open');
}

function sendOrderConfirmationWhatsApp(orderId) {
  const order = window.store.getOrderById(orderId);
  if (!order) return;
  const settings = window.store.getSettings();
  const text = `Assalam-o-Alaikum Watch Mart,\nI have placed an order!\n\n📋 *Order ID: ${order.id}*\n👤 Name: ${order.customer.name}\n📞 Phone: ${order.customer.phone}\n📍 Address: ${order.customer.address}, ${order.customer.city}\n💰 Total: Rs. ${order.total.toLocaleString()} (${order.paymentMethod})\n\nPlease dispatch my watch soon. Thank you!`;
  window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
}

// ==========================================================================
// ORDER TRACKING SYSTEM
// ==========================================================================
function openTrackOrderModal() {
  const modalBackdrop = document.getElementById('track-order-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.add('open');
}

function closeTrackOrderModal() {
  const modalBackdrop = document.getElementById('track-order-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('open');
}

function handleSearchOrderTracking(e) {
  e.preventDefault();
  const query = document.getElementById('tracking-search-input').value.trim();
  if (!query) return;

  const resultContainer = document.getElementById('tracking-result-box');
  const order = window.store.getOrderById(query);

  if (!order) {
    resultContainer.innerHTML = `
      <div style="text-align:center; padding:2rem; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.3); border-radius:var(--radius-md);">
        <p style="color:#EF4444; font-weight:700;">No order found matching "${query}"</p>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">Please verify your Order ID (e.g. ORD-PK-8921) or 11-digit mobile number.</p>
      </div>
    `;
    return;
  }

  const steps = ["New", "Confirmed", "Processing", "Shipped", "Delivered"];
  const currentStepIdx = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 1;

  resultContainer.innerHTML = `
    <div style="background:var(--bg-elevated); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.5rem; margin-top:1.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-light); padding-bottom:1rem; margin-bottom:1.5rem;">
        <div>
          <span class="badge badge-gold" style="margin-bottom:4px;">ORDER ${order.id}</span>
          <h3 style="font-size:1.1rem; color:#fff;">Customer: ${order.customer.name}</h3>
          <p style="font-size:0.8rem; color:var(--text-muted);">Destination: ${order.customer.city} &bull; Courier: <strong>${order.courier}</strong></p>
        </div>
        <div style="text-align:right;">
          <span style="font-size:0.75rem; color:var(--text-dim);">Tracking Code:</span>
          <p style="font-family:monospace; font-size:1rem; color:var(--gold-light); font-weight:700;">${order.trackingNumber}</p>
        </div>
      </div>

      <!-- Visual Stepper -->
      <div class="tracking-stepper">
        ${steps.map((st, i) => `
          <div class="tracking-step ${i <= currentStepIdx ? 'completed' : ''} ${i === currentStepIdx ? 'active' : ''}">
            <div class="tracking-node">${i <= currentStepIdx ? '✓' : (i + 1)}</div>
            <span style="font-size:0.72rem; font-weight:600; text-transform:uppercase; color:${i <= currentStepIdx ? '#fff' : 'var(--text-dim)'};">${st}</span>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(212,175,55,0.06); padding:0.75rem 1rem; border-radius:var(--radius-sm); margin-top:1.5rem; font-size:0.85rem;">
        <span>Current Live Status: <strong style="color:var(--gold-light);">${order.status.toUpperCase()}</strong></span>
        <button class="btn-whatsapp" style="padding:0.4rem 0.8rem; font-size:0.75rem;" onclick="sendOrderConfirmationWhatsApp('${order.id}')">
          Inquire on WhatsApp
        </button>
      </div>
    </div>
  `;
}

// ==========================================================================
// WISHLIST MODAL
// ==========================================================================
function openWishlistModal() {
  renderWishlistModal();
  const modalBackdrop = document.getElementById('wishlist-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.add('open');
}

function closeWishlistModal() {
  const modalBackdrop = document.getElementById('wishlist-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('open');
}

function renderWishlistModal() {
  const container = document.getElementById('wishlist-items-container');
  if (!container) return;

  const wishlistIds = window.store.wishlist;
  const products = wishlistIds.map(id => window.store.getProductById(id)).filter(Boolean);

  if (products.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text-dim); margin-bottom:1rem;">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <h3 class="serif-title" style="margin-bottom:0.5rem;">Your Wishlist is Empty</h3>
        <p style="color:var(--text-muted); font-size:0.88rem;">Click the heart icon on any timepiece to save it here for future purchase.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:1.25rem;">
      ${products.map(p => `
        <div class="product-card">
          <div class="product-card-media" style="height:200px;">
            <img src="${p.images[0]}" alt="${p.name}" class="product-card-img" />
          </div>
          <div class="product-card-body" style="padding:1rem;">
            <h4 class="product-card-title" style="font-size:0.9rem;">${p.name}</h4>
            <div class="product-price-row">
              <span class="product-price-current">Rs. ${(p.salePrice || p.price).toLocaleString()}</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:0.75rem;">
              <button class="btn-primary" style="padding:0.45rem; font-size:0.72rem;" onclick="handleDirectAddToCart('${p.id}')">Add to Cart</button>
              <button class="btn-secondary" style="padding:0.45rem; font-size:0.72rem; color:#EF4444;" onclick="window.store.toggleWishlist('${p.id}')">Remove</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ==========================================================================
// SEARCH MODAL & AUTOCOMPLETE
// ==========================================================================
function openSearchModal() {
  const modalBackdrop = document.getElementById('search-modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.classList.add('open');
    const input = document.getElementById('search-live-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    renderSearchResults('');
  }
}

function closeSearchModal() {
  const modalBackdrop = document.getElementById('search-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('open');
}

function renderSearchResults(query) {
  const container = document.getElementById('search-results-list');
  if (!container) return;

  const results = window.store.getProducts({ search: query }).slice(0, 6);

  if (results.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem; color:var(--text-muted); font-size:0.88rem;">
        No timepieces matching "${query}" found.
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(p => `
    <div class="search-item" onclick="closeSearchModal(); openProductModal('${p.id}')">
      <img src="${p.images[0]}" alt="${p.name}" class="search-item-thumb" />
      <div style="flex:1;">
        <h4 style="font-size:0.92rem; color:#fff; font-weight:700;">${p.name}</h4>
        <div style="font-size:0.75rem; color:var(--gold-light);">${p.brand} &bull; ${p.category.toUpperCase()} &bull; SKU: ${p.sku}</div>
      </div>
      <div style="text-align:right;">
        <span style="font-weight:800; color:#fff; font-size:1rem;">Rs. ${(p.salePrice || p.price).toLocaleString()}</span>
        ${p.salePrice ? `<div style="font-size:0.75rem; color:var(--text-dim); text-decoration:line-through;">Rs. ${p.price.toLocaleString()}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// REVIEW SUBMIT HANDLER
// ==========================================================================
function handleReviewSubmit(e, productId) {
  e.preventDefault();
  const name = document.getElementById('review-name-input').value.trim();
  const city = document.getElementById('review-city-input').value.trim();
  const rating = Number(document.getElementById('review-rating-input').value);
  const comment = document.getElementById('review-comment-input').value.trim();

  const product = window.store.getProductById(productId);

  window.store.addReview({
    productId,
    productName: product ? product.name : 'Luxury Watch',
    customerName: name,
    city: city || 'Pakistan',
    rating,
    comment,
    verifiedPurchase: true
  });

  showToast("Thank you! Your verified review has been published.", "success");
  e.target.reset();
  renderReviews();
}

// ==========================================================================
// PROMO COUNTDOWN TIMER
// ==========================================================================
function initSocialLinks() {
  const links = window.SOCIAL_LINKS || {};
  document.querySelectorAll('a[data-social]').forEach(el => {
    const url = links[el.getAttribute('data-social')];
    if (url) el.href = url; else el.style.display = 'none';
  });
}

function initPromoCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');
  const secsEl = document.getElementById('countdown-secs');
  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;
  const section = daysEl.closest('section');
  const target = window.OFFER_END_DATE ? new Date(window.OFFER_END_DATE).getTime() : NaN;
  // No real end date set (or it has passed): hide the timer instead of faking urgency.
  if (isNaN(target) || target <= Date.now()) { if (section) section.style.display = 'none'; return; }

  const timer = setInterval(() => {
    const distance = target - Date.now();
    if (distance <= 0) { clearInterval(timer); if (section) section.style.display = 'none'; return; }
    daysEl.textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
    hoursEl.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
    minsEl.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
    secsEl.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
  }, 1000);
}

// ==========================================================================
// EVENT LISTENERS & FILTER HOOKS
// ==========================================================================
function setupEventListeners() {
  // Category nav and chips clicks
  document.addEventListener('click', (e) => {
    const catTarget = e.target.closest('[data-category]');
    if (catTarget) {
      const cat = catTarget.getAttribute('data-category');
      currentCategoryFilter = cat;
      renderHeaderCategoryNav();
      renderCategoryChips();
      renderProducts();
    }
  });

  // Search input live trigger
  const searchInput = document.getElementById('search-live-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('product-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Price range filters
  const minPriceInput = document.getElementById('filter-min-price');
  const maxPriceInput = document.getElementById('filter-max-price');
  if (minPriceInput && maxPriceInput) {
    const triggerPrice = () => {
      currentPriceFilter.min = minPriceInput.value;
      currentPriceFilter.max = maxPriceInput.value;
      renderProducts();
    };
    minPriceInput.addEventListener('input', triggerPrice);
    maxPriceInput.addEventListener('input', triggerPrice);
  }
}

function resetAllFilters() {
  currentCategoryFilter = 'all';
  currentSearchQuery = '';
  currentPriceFilter = { min: '', max: '' };
  currentSort = 'popular';

  const minInp = document.getElementById('filter-min-price');
  const maxInp = document.getElementById('filter-max-price');
  if (minInp) minInp.value = '';
  if (maxInp) maxInp.value = '';

  renderHeaderCategoryNav();
  renderCategoryChips();
  renderProducts();
}

// ==========================================================================
// TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconMap = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  toast.innerHTML = `
    ${iconMap[type] || iconMap.info}
    <div style="font-size:0.85rem; font-weight:600; line-height:1.4;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Orders live only in the customer's browser, so send the full order to the store's WhatsApp
// so the owner actually receives it.
function notifyStoreOwnerOnWhatsApp(order) {
  try {
    const s = window.store.getSettings();
    const items = order.items.map(i => `- ${i.name}${i.variant ? ' (' + i.variant + ')' : ''} x${i.quantity} = Rs. ${(i.price * i.quantity).toLocaleString()}`).join('\n');
    const c = order.customer;
    const text = `NEW ORDER ${order.id}\n\n${items}\n\nSubtotal: Rs. ${order.subtotal.toLocaleString()}\nDelivery: Rs. ${order.deliveryCharges.toLocaleString()}\nTotal: Rs. ${order.total.toLocaleString()} (${order.paymentMethod})\n\nName: ${c.name}\nPhone: ${c.phone}\nCity: ${c.city}\nAddress: ${c.area ? c.area + ', ' : ''}${c.address}${c.notes ? '\nNotes: ' + c.notes : ''}`;
    window.open(`https://wa.me/${s.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  } catch (e) { console.error(e); }
}
