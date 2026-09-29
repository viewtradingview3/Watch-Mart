// Watch Mart - Complete Executive Admin Panel & Store Manager
let currentAdminTab = 'overview';
let editingProductId = null;

// Admin login is handled by Supabase (email + password), see js/supabase.js
async function openAdminPortal() {
  if (!(await window.SB_adminSignIn())) return;
  openAdminPortalUnlocked();
}

function openAdminPortalUnlocked() {
  const portalBackdrop = document.getElementById('admin-modal-backdrop');
  if (portalBackdrop) {
    portalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderAdminContent();
  }
}

function closeAdminPortal() {
  const portalBackdrop = document.getElementById('admin-modal-backdrop');
  if (portalBackdrop) {
    portalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function switchAdminTab(tabName) {
  currentAdminTab = tabName;
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  renderAdminContent();
}

function renderAdminContent() {
  const container = document.getElementById('admin-dynamic-content');
  if (!container) return;

  switch (currentAdminTab) {
    case 'overview':
      renderAdminOverview(container);
      break;
    case 'products':
      renderAdminProducts(container);
      break;
    case 'orders':
      renderAdminOrders(container);
      break;
    case 'categories':
      renderAdminCategories(container);
      break;
    case 'coupons':
      renderAdminCoupons(container);
      break;
    case 'reviews':
      renderAdminReviews(container);
      break;
    case 'shipping':
      renderAdminShipping(container);
      break;
    case 'settings':
      renderAdminSettings(container);
      break;
    default:
      renderAdminOverview(container);
  }
}

// ==========================================================================
// 1. OVERVIEW & METRICS
// ==========================================================================
function renderAdminOverview(container) {
  const orders = window.store.getOrders();
  const products = window.store.getProducts();
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'New' || o.status === 'Processing').length;
  const lowStockCount = products.filter(p => p.stock <= (p.lowStockThreshold || 3)).length;

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
        <div>
          <h2 class="serif-title" style="font-size:1.8rem; color:#fff;">Store Management Dashboard</h2>
          <p style="color:var(--text-muted); font-size:0.88rem;">Live store performance, inventory levels & orders across Pakistan.</p>
        </div>
        <div style="display:flex; gap:0.75rem;">
          <button class="btn-primary" onclick="switchAdminTab('products'); openAddProductModal();">
            + Add New Watch
          </button>
          <button class="btn-secondary" onclick="window.store.exportDataJson()">
            Export Full Backup (JSON)
          </button>
        </div>
      </div>

      <!-- Metric Cards -->
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1.5rem; margin-bottom:2.5rem;">
        <div class="admin-metric-card">
          <div style="width:48px; height:48px; border-radius:var(--radius-md); background:rgba(212,175,55,0.15); color:var(--gold-light); display:flex; align-items:center; justify-content:center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted);">Total Store Revenue</div>
            <div style="font-size:1.6rem; font-weight:800; color:#fff;" class="gold-gradient-text">Rs. ${totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        <div class="admin-metric-card">
          <div style="width:48px; height:48px; border-radius:var(--radius-md); background:rgba(59,130,246,0.15); color:#60A5FA; display:flex; align-items:center; justify-content:center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <div>
            <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted);">Total Orders</div>
            <div style="font-size:1.6rem; font-weight:800; color:#fff;">${orders.length}</div>
          </div>
        </div>

        <div class="admin-metric-card">
          <div style="width:48px; height:48px; border-radius:var(--radius-md); background:rgba(245,158,11,0.15); color:#FBBF24; display:flex; align-items:center; justify-content:center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted);">Pending Orders</div>
            <div style="font-size:1.6rem; font-weight:800; color:#FBBF24;">${pendingOrders}</div>
          </div>
        </div>

        <div class="admin-metric-card">
          <div style="width:48px; height:48px; border-radius:var(--radius-md); background:rgba(239,68,68,0.15); color:#F87171; display:flex; align-items:center; justify-content:center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
          </div>
          <div>
            <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted);">Low Stock Alerts</div>
            <div style="font-size:1.6rem; font-weight:800; color:${lowStockCount > 0 ? '#F87171' : '#fff'};">${lowStockCount}</div>
          </div>
        </div>
      </div>

      <!-- Recent Orders & Inventory Alerts Row -->
      <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:2rem;">
        <!-- Recent Orders Box -->
        <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <h3 class="serif-title" style="font-size:1.15rem; color:#fff;">Recent Customer Orders</h3>
            <button class="btn-outline-gold" style="font-size:0.75rem; padding:0.35rem 0.75rem;" onclick="switchAdminTab('orders')">View All Orders</button>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${orders.slice(0, 5).map(o => `
                <tr>
                  <td><strong>${o.id}</strong></td>
                  <td>${o.customer.name}</td>
                  <td>${o.customer.city}</td>
                  <td><strong>Rs. ${o.total.toLocaleString()}</strong></td>
                  <td>
                    <span class="badge ${o.status === 'Delivered' ? 'badge-new' : (o.status === 'Shipped' ? 'badge-stock' : 'badge-gold')}">
                      ${o.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Inventory Watchlist -->
        <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <h3 class="serif-title" style="font-size:1.15rem; color:#fff;">Inventory Stock Alerts</h3>
            <button class="btn-outline-gold" style="font-size:0.75rem; padding:0.35rem 0.75rem;" onclick="switchAdminTab('products')">Manage Stock</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            ${products.filter(p => p.stock <= 5).slice(0, 5).map(p => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem; background:var(--bg-elevated); border-radius:var(--radius-sm); border:1px solid var(--border-light);">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <img src="${p.images[0]}" alt="${p.name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;" />
                  <div>
                    <h5 style="font-size:0.82rem; color:#fff; line-height:1.2;">${p.name}</h5>
                    <span style="font-size:0.72rem; color:var(--text-dim);">SKU: ${p.sku}</span>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <span style="font-weight:700; color:${p.stock <= 2 ? '#EF4444' : '#F59E0B'}; font-size:0.85rem;">${p.stock} units left</span>
                  <button class="btn-outline-gold" style="padding:0.25rem 0.55rem; font-size:0.7rem;" onclick="window.store.updateStock('${p.id}', 5); renderAdminContent(); showToast('Added +5 units to stock', 'success');">
                    +5 Stock
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 2. PRODUCTS MANAGEMENT CRUD
// ==========================================================================
function renderAdminProducts(container) {
  const products = window.store.getProducts();

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2 class="serif-title" style="font-size:1.6rem; color:#fff;">Products & Inventory Management</h2>
          <p style="color:var(--text-muted); font-size:0.85rem;">Add, edit, adjust stock, or remove luxury watches from the webstore.</p>
        </div>
        <button class="btn-primary" onclick="openAddProductModal()">
          + Add New Watch
        </button>
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Watch Preview</th>
              <th>Name & SKU</th>
              <th>Category</th>
              <th>Regular Price</th>
              <th>Sale Price</th>
              <th>Available Stock</th>
              <th>Badges</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>
                  <img src="${p.images[0]}" alt="${p.name}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; border:1px solid var(--border-light);" />
                </td>
                <td>
                  <strong style="color:#fff; font-size:0.88rem;">${p.name}</strong>
                  <div style="font-size:0.75rem; color:var(--text-dim);">SKU: ${p.sku} &bull; Brand: ${p.brand}</div>
                </td>
                <td><span class="badge badge-gold">${p.category.toUpperCase()}</span></td>
                <td>Rs. ${p.price.toLocaleString()}</td>
                <td style="color:${p.salePrice ? '#34D399' : 'inherit'}; font-weight:700;">
                  ${p.salePrice ? `Rs. ${p.salePrice.toLocaleString()}` : '-'}
                </td>
                <td>
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="font-weight:700; color:${p.stock <= 3 ? '#EF4444' : '#fff'};">${p.stock}</span>
                    <button style="color:var(--gold-light); font-weight:800; padding:2px 6px; border:1px solid var(--border-light); border-radius:3px;" onclick="window.store.updateStock('${p.id}', 1); renderAdminProducts(document.getElementById('admin-dynamic-content'));">+</button>
                    <button style="color:var(--text-dim); font-weight:800; padding:2px 6px; border:1px solid var(--border-light); border-radius:3px;" onclick="window.store.updateStock('${p.id}', -1); renderAdminProducts(document.getElementById('admin-dynamic-content'));">&minus;</button>
                  </div>
                </td>
                <td>
                  ${p.isBestSeller ? '<span class="badge badge-gold" style="font-size:0.65rem;">BEST</span>' : ''}
                  ${p.isNewArrival ? '<span class="badge badge-new" style="font-size:0.65rem;">NEW</span>' : ''}
                  ${p.isSale ? '<span class="badge badge-sale" style="font-size:0.65rem;">SALE</span>' : ''}
                </td>
                <td>
                  <div style="display:flex; gap:0.5rem;">
                    <button class="btn-outline-gold" style="padding:0.35rem 0.65rem; font-size:0.75rem;" onclick="openEditProductModal('${p.id}')">Edit</button>
                    <button class="btn-secondary" style="padding:0.35rem 0.65rem; font-size:0.75rem; color:#EF4444;" onclick="handleDeleteProduct('${p.id}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddProductModal() {
  editingProductId = null;
  openProductFormModal({});
}

function openEditProductModal(id) {
  editingProductId = id;
  const product = window.store.getProductById(id);
  if (product) openProductFormModal(product);
}

function openProductFormModal(data) {
  const backdrop = document.getElementById('admin-form-modal-backdrop');
  const container = document.getElementById('admin-form-modal-content');
  if (!backdrop || !container) return;

  const cats = window.store.getCategories().filter(c => c.id !== 'all');

  container.innerHTML = `
    <div style="padding:2rem;">
      <h3 class="serif-title" style="font-size:1.4rem; color:#fff; margin-bottom:1.5rem;">
        ${editingProductId ? 'Edit Watch Details' : 'Add New Watch to Catalogue'}
      </h3>

      <form id="admin-product-edit-form" onsubmit="handleSaveProductForm(event)">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Watch Name *</label>
            <input type="text" id="form-prod-name" class="form-control" value="${data.name || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">SKU Code *</label>
            <input type="text" id="form-prod-sku" class="form-control" value="${data.sku || ''}" placeholder="CI-XXXX" required />
          </div>
        </div>

        <div class="form-row" style="margin-top:0.75rem;">
          <div class="form-group">
            <label class="form-label">Brand Name</label>
            <input type="text" id="form-prod-brand" class="form-control" value="${data.brand || 'Watch Mart'}" />
          </div>
          <div class="form-group">
            <label class="form-label">Primary Category</label>
            <select id="form-prod-category" class="form-control">
              ${cats.map(c => `
                <option value="${c.id}" ${data.category === c.id ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="form-row" style="margin-top:0.75rem;">
          <div class="form-group">
            <label class="form-label">Regular Price (PKR) *</label>
            <input type="number" id="form-prod-price" class="form-control" value="${data.price || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Sale / Discounted Price (PKR)</label>
            <input type="number" id="form-prod-sale-price" class="form-control" value="${data.salePrice || ''}" placeholder="Leave blank if no sale" />
          </div>
        </div>

        <div class="form-row" style="margin-top:0.75rem;">
          <div class="form-group">
            <label class="form-label">Available Stock Quantity *</label>
            <input type="number" id="form-prod-stock" class="form-control" value="${data.stock !== undefined ? data.stock : 10}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Strap Material</label>
            <select id="form-prod-strap" class="form-control">
              <option value="Stainless Steel" ${data.strapType === 'Stainless Steel' ? 'selected' : ''}>Stainless Steel</option>
              <option value="Genuine Leather" ${data.strapType === 'Genuine Leather' ? 'selected' : ''}>Genuine Leather</option>
              <option value="Silicone/Rubber" ${data.strapType === 'Silicone/Rubber' ? 'selected' : ''}>Silicone/Rubber</option>
              <option value="Ceramic" ${data.strapType === 'Ceramic' ? 'selected' : ''}>Ceramic</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top:0.75rem;">
          <label class="form-label">Primary Image URL (Direct Image Link)</label>
          <input type="url" id="form-prod-img1" class="form-control" value="${data.images && data.images[0] ? data.images[0] : 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'}" required />
          <input type="file" accept="image/*" style="margin-top:.4rem;font-size:.8rem" onchange="uploadProductImage(this, 'form-prod-img1')" /><small style="margin-left:.5rem;color:var(--gold-primary)"></small>
        </div>

        <div class="form-group" style="margin-top:0.75rem;">
          <label class="form-label">Alternate Image URL (Secondary view)</label>
          <input type="url" id="form-prod-img2" class="form-control" value="${data.images && data.images[1] ? data.images[1] : 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'}" />
          <input type="file" accept="image/*" style="margin-top:.4rem;font-size:.8rem" onchange="uploadProductImage(this, 'form-prod-img2')" /><small style="margin-left:.5rem;color:var(--gold-primary)"></small>
        </div>

        <div class="form-group" style="margin-top:0.75rem;">
          <label class="form-label">Product Short Description</label>
          <textarea id="form-prod-desc" class="form-control" rows="3" required>${data.description || data.shortDesc || ''}</textarea>
        </div>

        <div style="display:flex; gap:1.5rem; margin-top:1rem;">
          <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
            <input type="checkbox" id="form-prod-bestseller" ${data.isBestSeller ? 'checked' : ''} />
            <span>Mark as Bestseller</span>
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
            <input type="checkbox" id="form-prod-new" ${data.isNewArrival ? 'checked' : ''} />
            <span>Mark as New Arrival</span>
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; cursor:pointer;">
            <input type="checkbox" id="form-prod-featured" ${data.isFeatured ? 'checked' : ''} />
            <span>Show on Homepage</span>
          </label>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:2rem;">
          <button type="button" class="btn-secondary" onclick="closeAdminFormModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Watch</button>
        </div>
      </form>
    </div>
  `;

  backdrop.classList.add('open');
}

function closeAdminFormModal() {
  const backdrop = document.getElementById('admin-form-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
}

function handleSaveProductForm(e) {
  e.preventDefault();

  const name = document.getElementById('form-prod-name').value.trim();
  const sku = document.getElementById('form-prod-sku').value.trim();
  const brand = document.getElementById('form-prod-brand').value.trim();
  const category = document.getElementById('form-prod-category').value;
  const price = Number(document.getElementById('form-prod-price').value);
  const salePriceVal = document.getElementById('form-prod-sale-price').value;
  const salePrice = salePriceVal ? Number(salePriceVal) : null;
  const stock = Number(document.getElementById('form-prod-stock').value);
  const strapType = document.getElementById('form-prod-strap').value;
  const img1 = document.getElementById('form-prod-img1').value.trim();
  const img2 = document.getElementById('form-prod-img2').value.trim();
  const desc = document.getElementById('form-prod-desc').value.trim();
  const isBestSeller = document.getElementById('form-prod-bestseller').checked;
  const isNewArrival = document.getElementById('form-prod-new').checked;
  const isFeatured = document.getElementById('form-prod-featured').checked;

  const images = [img1];
  if (img2) images.push(img2);

  const existing = editingProductId ? window.store.getProductById(editingProductId) : {};

  const productData = {
    ...existing,
    id: editingProductId || null,
    name,
    sku,
    brand,
    category,
    price,
    salePrice,
    isSale: salePrice && salePrice < price,
    stock,
    strapType,
    images,
    shortDesc: desc.slice(0, 140) + '...',
    description: desc,
    isBestSeller,
    isNewArrival,
    isFeatured,
    rating: existing.rating || 5.0,
    reviewCount: existing.reviewCount || 1,
    specs: existing.specs || {
      movement: "Japanese Precision Quartz",
      caseDiameter: "42 mm",
      caseMaterial: "Solid Stainless Steel",
      glass: "Sapphire Crystal",
      waterResistance: "50m / 5 ATM",
      warranty: "1 Year Official Warranty"
    },
    variants: existing.variants || [
      { name: "Standard Edition", hex: "#D4AF37", inStock: true }
    ]
  };

  window.store.saveProduct(productData);
  closeAdminFormModal();
  renderAdminProducts(document.getElementById('admin-dynamic-content'));
  showToast(`Watch "${name}" saved successfully!`, 'success');
}

function handleDeleteProduct(id) {
  if (confirm("Are you sure you want to permanently delete this watch from the catalogue?")) {
    window.store.deleteProduct(id);
    renderAdminProducts(document.getElementById('admin-dynamic-content'));
    showToast("Product deleted successfully", "info");
  }
}

// ==========================================================================
// 3. ORDERS MANAGEMENT
// ==========================================================================
function renderAdminOrders(container) {
  const orders = window.store.getOrders();

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2 class="serif-title" style="font-size:1.6rem; color:#fff;">Customer Orders & Tracking Management</h2>
          <p style="color:var(--text-muted); font-size:0.85rem;">Manage status progression, update tracking codes, and print customer invoices.</p>
        </div>
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Details</th>
              <th>Items Ordered</th>
              <th>Payment & Total</th>
              <th>Courier & Tracking</th>
              <th>Current Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td>
                  <strong>${o.id}</strong>
                  <div style="font-size:0.72rem; color:var(--text-dim);">${new Date(o.date).toLocaleDateString()}</div>
                </td>
                <td>
                  <strong style="color:#fff;">${o.customer.name}</strong>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${o.customer.phone} &bull; ${o.customer.city}</div>
                  <div style="font-size:0.72rem; color:var(--text-dim); max-width:200px;">${o.customer.address}</div>
                </td>
                <td>
                  ${o.items.map(it => `
                    <div style="font-size:0.8rem; color:#fff;">${it.quantity}x ${it.name} (${it.variant})</div>
                  `).join('')}
                </td>
                <td>
                  <strong style="color:var(--gold-light); font-size:0.95rem;">Rs. ${o.total.toLocaleString()}</strong>
                  <div style="font-size:0.72rem; color:var(--text-muted);">${o.paymentMethod}</div>
                </td>
                <td>
                  <div style="font-size:0.8rem; font-weight:700;">${o.courier}</div>
                  <div style="font-size:0.72rem; color:var(--text-dim); font-family:monospace;">${o.trackingNumber}</div>
                </td>
                <td>
                  <select class="form-control" style="padding:0.35rem 0.5rem; font-size:0.8rem; width:130px;" onchange="handleAdminOrderStatusChange('${o.id}', this.value)">
                    <option value="New" ${o.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </td>
                <td>
                  <button class="btn-outline-gold" style="padding:0.35rem 0.65rem; font-size:0.75rem;" onclick="openOrderConfirmationModal(window.store.getOrderById('${o.id}'))">
                    Invoice
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function handleAdminOrderStatusChange(orderId, newStatus) {
  window.store.updateOrderStatus(orderId, newStatus);
  showToast(`Order #${orderId} marked as ${newStatus}!`, "success");
}

// ==========================================================================
// 4. CATEGORIES MANAGEMENT
// ==========================================================================
function renderAdminCategories(container) {
  const cats = window.store.getCategories();

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2 class="serif-title" style="font-size:1.6rem; color:#fff;">Store Categories</h2>
          <p style="color:var(--text-muted); font-size:0.85rem;">Organize watches into curated sections and collections.</p>
        </div>
        <button class="btn-primary" onclick="handleAddCategoryPrompt()">
          + Add Category
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1.5rem;">
        ${cats.map(c => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.5rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h4 class="serif-title" style="font-size:1.1rem; color:#fff;">${c.name}</h4>
              <span style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase;">ID: ${c.id}</span>
            </div>
            ${c.id !== 'all' ? `
              <button class="btn-secondary" style="color:#EF4444; padding:0.35rem 0.65rem; font-size:0.75rem;" onclick="handleDeleteCategory('${c.id}')">Delete</button>
            ` : '<span class="badge badge-gold">DEFAULT</span>'}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function handleAddCategoryPrompt() {
  const name = prompt("Enter category name (e.g. Vintage Pocket Watches, Gold Plated):");
  if (name && name.trim()) {
    window.store.saveCategory({ name: name.trim() });
    renderAdminCategories(document.getElementById('admin-dynamic-content'));
    showToast(`Category "${name}" added!`, "success");
  }
}

function handleDeleteCategory(id) {
  if (confirm("Delete this category?")) {
    window.store.deleteCategory(id);
    renderAdminCategories(document.getElementById('admin-dynamic-content'));
  }
}

// ==========================================================================
// 5. COUPONS & DISCOUNTS
// ==========================================================================
function renderAdminCoupons(container) {
  const coupons = window.store.getCoupons();

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2 class="serif-title" style="font-size:1.6rem; color:#fff;">Coupons & Discount Engine</h2>
          <p style="color:var(--text-muted); font-size:0.85rem;">Create percentage or fixed PKR discount vouchers for customers.</p>
        </div>
        <button class="btn-primary" onclick="openAddCouponModal()">
          + Create Coupon
        </button>
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount Type</th>
              <th>Value</th>
              <th>Minimum Order</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${coupons.map(cp => `
              <tr>
                <td><strong style="color:var(--gold-light); font-size:1rem; letter-spacing:0.05em;">${cp.code}</strong></td>
                <td><span class="badge ${cp.discountType === 'percentage' ? 'badge-gold' : 'badge-stock'}">${cp.discountType.toUpperCase()}</span></td>
                <td><strong>${cp.discountType === 'percentage' ? `${cp.value}% OFF` : `Rs. ${cp.value} OFF`}</strong></td>
                <td>Rs. ${(cp.minOrder || 0).toLocaleString()}</td>
                <td>${cp.expiry || 'No Expiry'}</td>
                <td><span class="badge ${cp.active ? 'badge-new' : 'badge-sale'}">${cp.active ? 'ACTIVE' : 'INACTIVE'}</span></td>
                <td>
                  <button class="btn-secondary" style="padding:0.35rem 0.65rem; font-size:0.75rem; color:#EF4444;" onclick="window.store.deleteCoupon('${cp.code}'); renderAdminCoupons(document.getElementById('admin-dynamic-content'));">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddCouponModal() {
  const code = prompt("Enter Coupon Code (e.g. FESTIVE20):");
  if (!code) return;
  const type = prompt("Enter type: 'percentage' or 'fixed'", "percentage");
  const value = Number(prompt("Enter discount value (e.g. 15 for 15% or 500 for Rs. 500):", "15"));
  const min = Number(prompt("Minimum order spend (e.g. 3000):", "3000"));

  window.store.saveCoupon({
    code: code.trim(),
    discountType: type === 'fixed' ? 'fixed' : 'percentage',
    value,
    minOrder: min,
    expiry: "2026-12-31",
    active: true
  });

  renderAdminCoupons(document.getElementById('admin-dynamic-content'));
  showToast(`Coupon ${code.toUpperCase()} created!`, "success");
}

// ==========================================================================
// 6. REVIEWS MODERATION
// ==========================================================================
function renderAdminReviews(container) {
  const reviews = window.store.getReviews();

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2 class="serif-title" style="font-size:1.6rem; color:#fff;">Customer Reviews Moderation</h2>
          <p style="color:var(--text-muted); font-size:0.85rem;">Approve, reject or delete ratings and feedback submitted by buyers.</p>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${reviews.map(r => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.25rem; display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="flex:1;">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:4px;">
                <strong style="color:#fff;">${r.customerName}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${r.city} &bull; ${r.date}</span>
                <span class="badge ${r.status === 'approved' ? 'badge-new' : 'badge-sale'}">${r.status.toUpperCase()}</span>
              </div>
              <div style="color:var(--gold-light); font-size:0.8rem; margin-bottom:6px;">${'★'.repeat(r.rating || 5)} - Watch: ${r.productName}</div>
              <p style="font-size:0.88rem; color:#E2E8F0;">"${r.comment}"</p>
            </div>
            <div style="display:flex; gap:0.5rem; margin-left:1.5rem;">
              ${r.status !== 'approved' ? `
                <button class="btn-outline-gold" style="padding:0.35rem 0.65rem; font-size:0.75rem;" onclick="window.store.updateReviewStatus('${r.id}', 'approved'); renderAdminReviews(document.getElementById('admin-dynamic-content'));">Approve</button>
              ` : `
                <button class="btn-secondary" style="padding:0.35rem 0.65rem; font-size:0.75rem;" onclick="window.store.updateReviewStatus('${r.id}', 'rejected'); renderAdminReviews(document.getElementById('admin-dynamic-content'));">Hide</button>
              `}
              <button class="btn-secondary" style="color:#EF4444; padding:0.35rem 0.65rem; font-size:0.75rem;" onclick="window.store.deleteReview('${r.id}'); renderAdminReviews(document.getElementById('admin-dynamic-content'));">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// 7. SHIPPING & DELIVERY SETTINGS
// ==========================================================================
function renderAdminShipping(container) {
  const rates = window.store.getShippingRates();
  const settings = window.store.getSettings();

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2 class="serif-title" style="font-size:1.6rem; color:#fff;">Pakistan Delivery Charges Configuration</h2>
          <p style="color:var(--text-muted); font-size:0.85rem;">Set custom courier rates per city and configure free shipping thresholds.</p>
        </div>
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.5rem; margin-bottom:2rem; max-width:600px;">
        <h4 style="font-size:1rem; color:#fff; margin-bottom:0.75rem;">Free Shipping Threshold</h4>
        <div style="display:flex; gap:1rem; align-items:center;">
          <input type="number" id="admin-free-threshold" class="form-control" value="${settings.freeShippingThreshold || 5000}" style="width:200px;" />
          <button class="btn-primary" onclick="handleSaveFreeShippingThreshold()">Save Threshold</button>
        </div>
        <p style="font-size:0.75rem; color:var(--text-muted); margin-top:6px;">Customers with cart subtotal above this PKR value receive free delivery.</p>
      </div>

      <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); overflow-x:auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Destination City</th>
              <th>Delivery Days</th>
              <th>Courier Rate (PKR)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${rates.map(r => `
              <tr>
                <td><strong style="color:#fff;">${r.city}</strong></td>
                <td>${r.estDays}</td>
                <td>
                  <input type="number" value="${r.rate}" style="width:110px; padding:0.4rem 0.6rem;" onchange="window.store.updateShippingRate('${r.city}', this.value); showToast('Shipping updated for ${r.city}', 'success');" />
                </td>
                <td>
                  <span style="color:var(--emerald-accent); font-size:0.75rem;">Auto-saves on change</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function handleSaveFreeShippingThreshold() {
  const val = Number(document.getElementById('admin-free-threshold').value);
  window.store.updateSettings({ freeShippingThreshold: val });
  showToast(`Free shipping threshold set to Rs. ${val.toLocaleString()}`, "success");
}

// ==========================================================================
// 8. STORE SETTINGS & BACKUP ENGINE
// ==========================================================================
function renderAdminSettings(container) {
  const settings = window.store.getSettings();

  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h2 class="serif-title" style="font-size:1.6rem; color:#fff;">Store Branding & System Settings</h2>
          <p style="color:var(--text-muted); font-size:0.85rem;">Manage store details, contact info, WhatsApp number, and complete database backup.</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:2.5rem;">
        <form onsubmit="handleSaveStoreSettings(event)" style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:2rem; display:flex; flex-direction:column; gap:1.25rem;">
          <h3 class="serif-title" style="font-size:1.15rem; color:#fff;">Branding & Contact Info</h3>

          <div class="form-group">
            <label class="form-label">Store Brand Name</label>
            <input type="text" id="set-store-name" class="form-control" value="${settings.storeName}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Official WhatsApp Number (without + or 0, e.g. 923001234567)</label>
            <input type="text" id="set-whatsapp" class="form-control" value="${settings.whatsappNumber}" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Support Phone</label>
              <input type="text" id="set-phone" class="form-control" value="${settings.phone}" />
            </div>
            <div class="form-group">
              <label class="form-label">Support Email</label>
              <input type="email" id="set-email" class="form-control" value="${settings.email}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Business Showroom Address</label>
            <input type="text" id="set-address" class="form-control" value="${settings.address}" />
          </div>

          <div class="form-group">
            <label class="form-label">Top Bar Announcement Text</label>
            <input type="text" id="set-announcement" class="form-control" value="${settings.announcementText}" />
          </div>

          <button type="submit" class="btn-primary" style="align-self:flex-start; margin-top:0.5rem;">
            Save Store Settings
          </button>
        </form>

        <!-- Backup & Restore Operations -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          <div style="background:var(--bg-surface); border:1px solid var(--gold-border); border-radius:var(--radius-md); padding:1.5rem;">
            <h4 class="serif-title" style="font-size:1.1rem; color:var(--gold-light); margin-bottom:0.5rem;">📦 Database Backup (Export)</h4>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1rem;">Download a complete JSON snapshot of all products, stock levels, orders, reviews, and settings.</p>
            <button class="btn-primary" style="width:100%;" onclick="window.store.exportDataJson()">
              Download Full Backup JSON
            </button>
          </div>

          <div style="background:var(--bg-surface); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.5rem;">
            <h4 class="serif-title" style="font-size:1.1rem; color:#fff; margin-bottom:0.5rem;">📥 Restore Backup (Import)</h4>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1rem;">Upload a previously downloaded backup JSON file to restore the entire store instantly.</p>
            <input type="file" id="admin-import-file-input" accept=".json" style="margin-bottom:0.75rem; font-size:0.8rem;" />
            <button class="btn-secondary" style="width:100%;" onclick="handleImportBackup()">
              Restore From File
            </button>
          </div>

          <div style="background:rgba(239,68,68,0.06); border:1px solid rgba(239,68,68,0.3); border-radius:var(--radius-md); padding:1.5rem;">
            <h4 style="font-size:1rem; color:#EF4444; margin-bottom:0.5rem;">⚠️ Reset to Default Demo Data</h4>
            <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:1rem;">Revert all products, prices, and settings back to factory luxury demo catalogue.</p>
            <button class="btn-secondary" style="width:100%; color:#EF4444; border-color:rgba(239,68,68,0.4);" onclick="handleResetDatabase()">
              Reset Demo Store
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleSaveStoreSettings(e) {
  e.preventDefault();
  const storeName = document.getElementById('set-store-name').value.trim();
  const whatsappNumber = document.getElementById('set-whatsapp').value.trim();
  const phone = document.getElementById('set-phone').value.trim();
  const email = document.getElementById('set-email').value.trim();
  const address = document.getElementById('set-address').value.trim();
  const announcementText = document.getElementById('set-announcement').value.trim();

  window.store.updateSettings({
    storeName,
    whatsappNumber,
    phone,
    email,
    address,
    announcementText
  });

  showToast("Store settings updated successfully!", "success");
}

function handleImportBackup() {
  const fileInput = document.getElementById('admin-import-file-input');
  if (!fileInput || !fileInput.files.length) {
    showToast("Please select a valid JSON backup file", "warning");
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const res = window.store.importDataJson(e.target.result);
    if (res.success) {
      showToast("Store database restored successfully!", "success");
      renderAdminContent();
    } else {
      showToast(`Restore error: ${res.error}`, "error");
    }
  };
  reader.readAsText(file);
}

function handleResetDatabase() {
  if (confirm("Reset everything to default demo data? All custom orders and products will be reset.")) {
    window.store.resetToDefault();
    showToast("Database reset to default luxury catalogue.", "info");
    renderAdminContent();
  }
}
