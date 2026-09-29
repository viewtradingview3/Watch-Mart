// State Store & LocalStorage Persistence Engine for Watch Mart
const STORE_KEY = 'CHRONO_IMPERIAL_DB_V1';
const CART_KEY = 'CHRONO_IMPERIAL_CART_V1';
const WISHLIST_KEY = 'CHRONO_IMPERIAL_WISHLIST_V1';
const USER_KEY = 'CHRONO_IMPERIAL_USER_V1';

class StoreEngine {
  constructor() {
    this.listeners = [];
    this.initDatabase();
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.currentUser = this.loadUser();
    this.activeCoupon = null;
  }

  initDatabase() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      this.data = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
      this.saveDatabase();
    } else {
      try {
        this.data = JSON.parse(raw);
        // Ensure all required collections exist
        if (!this.data.products) this.data.products = DEFAULT_STORE_DATA.products;
        if (!this.data.categories) this.data.categories = DEFAULT_STORE_DATA.categories;
        if (!this.data.coupons) this.data.coupons = DEFAULT_STORE_DATA.coupons;
        if (!this.data.orders) this.data.orders = DEFAULT_STORE_DATA.orders;
        if (!this.data.reviews) this.data.reviews = DEFAULT_STORE_DATA.reviews;
        if (!this.data.settings) this.data.settings = DEFAULT_STORE_DATA.settings;
        if (/chrono/i.test(this.data.settings.storeName || '')) { const D = DEFAULT_STORE_DATA.settings; ['storeName','email','announcementText','facebookUrl','instagramUrl','tiktokUrl'].forEach(k => { this.data.settings[k] = D[k]; }); }
        if (!this.data.shippingRates) this.data.shippingRates = DEFAULT_STORE_DATA.shippingRates;
      } catch (e) {
        console.error("Corrupted database, resetting to default:", e);
        this.data = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
        this.saveDatabase();
      }
    }
  }

  saveDatabase() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
    this.emitChange('database');
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
    this.saveDatabase();
    this.clearCart();
    this.wishlist = [];
    this.saveWishlist();
    this.emitChange('reset');
  }

  exportDataJson() {
    const fullBackup = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      store: this.data
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `watch_mart_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  }

  importDataJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.store && parsed.store.products) {
        this.data = parsed.store;
      } else if (parsed && parsed.products) {
        this.data = parsed;
      } else {
        throw new Error("Invalid backup format");
      }
      this.saveDatabase();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  emitChange(event, payload) {
    this.listeners.forEach(cb => {
      try {
        cb(event, payload);
      } catch (e) {
        console.error("Listener error:", e);
      }
    });
  }

  // --- PRODUCTS CRUD ---
  getProducts(filter = {}) {
    let list = [...this.data.products];

    if (filter.category && filter.category !== 'all') {
      if (filter.category === 'sale') {
        list = list.filter(p => p.isSale || (p.salePrice && p.salePrice < p.price));
      } else if (filter.category === 'men') {
        list = list.filter(p => p.category === 'men' || (p.secondaryCategories && p.secondaryCategories.includes('men')) || p.gender === 'Men');
      } else if (filter.category === 'women') {
        list = list.filter(p => p.category === 'women' || (p.secondaryCategories && p.secondaryCategories.includes('women')) || p.gender === 'Women');
      } else if (filter.category === 'smart') {
        list = list.filter(p => p.category === 'smart' || (p.secondaryCategories && p.secondaryCategories.includes('smart')));
      } else if (filter.category === 'luxury') {
        list = list.filter(p => p.category === 'luxury' || (p.secondaryCategories && p.secondaryCategories.includes('luxury')));
      } else {
        list = list.filter(p => p.category === filter.category || (p.secondaryCategories && p.secondaryCategories.includes(filter.category)));
      }
    }

    if (filter.brand && filter.brand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === filter.brand.toLowerCase());
    }

    if (filter.strapType && filter.strapType !== 'all') {
      list = list.filter(p => p.strapType.toLowerCase() === filter.strapType.toLowerCase());
    }

    if (filter.gender && filter.gender !== 'all') {
      list = list.filter(p => p.gender.toLowerCase() === filter.gender.toLowerCase());
    }

    if (filter.inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    if (filter.minPrice !== undefined && filter.minPrice !== '') {
      list = list.filter(p => (p.salePrice || p.price) >= Number(filter.minPrice));
    }

    if (filter.maxPrice !== undefined && filter.maxPrice !== '') {
      list = list.filter(p => (p.salePrice || p.price) <= Number(filter.maxPrice));
    }

    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
      );
    }

    if (filter.sort) {
      switch (filter.sort) {
        case 'price-low':
          list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case 'price-high':
          list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case 'rating':
          list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'popular':
        default:
          list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
          break;
      }
    }

    return list;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  saveProduct(product) {
    if (!product.id) {
      product.id = 'prod-' + Date.now();
      if (!product.sku) {
        product.sku = 'CI-' + Math.floor(1000 + Math.random() * 9000);
      }
      this.data.products.unshift(product);
    } else {
      const idx = this.data.products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        this.data.products[idx] = { ...this.data.products[idx], ...product };
      } else {
        this.data.products.unshift(product);
      }
    }
    this.saveDatabase();
    this.emitChange('product_updated', product);
    return product;
  }

  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.saveDatabase();
    this.emitChange('product_deleted', id);
  }

  updateStock(productId, delta) {
    const p = this.getProductById(productId);
    if (p) {
      p.stock = Math.max(0, p.stock + delta);
      this.saveDatabase();
      this.emitChange('stock_updated', p);
    }
  }

  // --- CATEGORIES CRUD ---
  getCategories() {
    return this.data.categories;
  }

  saveCategory(cat) {
    if (!cat.id) {
      cat.id = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      this.data.categories.push(cat);
    } else {
      const idx = this.data.categories.findIndex(c => c.id === cat.id);
      if (idx !== -1) {
        this.data.categories[idx] = { ...this.data.categories[idx], ...cat };
      } else {
        this.data.categories.push(cat);
      }
    }
    this.saveDatabase();
    this.emitChange('categories_updated');
  }

  deleteCategory(catId) {
    this.data.categories = this.data.categories.filter(c => c.id !== catId);
    this.saveDatabase();
    this.emitChange('categories_updated');
  }

  // --- COUPONS CRUD & VALIDATION ---
  getCoupons() {
    return this.data.coupons;
  }

  saveCoupon(coupon) {
    const idx = this.data.coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    coupon.code = coupon.code.toUpperCase().trim();
    if (idx !== -1) {
      this.data.coupons[idx] = { ...this.data.coupons[idx], ...coupon };
    } else {
      this.data.coupons.push(coupon);
    }
    this.saveDatabase();
    this.emitChange('coupons_updated');
  }

  deleteCoupon(code) {
    this.data.coupons = this.data.coupons.filter(c => c.code !== code);
    this.saveDatabase();
    this.emitChange('coupons_updated');
  }

  validateCoupon(code, cartSubtotal) {
    const cleanCode = (code || '').toUpperCase().trim();
    const coupon = this.data.coupons.find(c => c.code === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, message: "Invalid or expired coupon code." };
    }

    if (coupon.expiry && new Date(coupon.expiry) < new Date().setHours(0, 0, 0, 0)) {
      return { valid: false, message: "This coupon code has expired." };
    }

    if (coupon.minOrder && cartSubtotal < coupon.minOrder) {
      return {
        valid: false,
        message: `Minimum order amount of Rs. ${coupon.minOrder.toLocaleString()} required for this coupon.`
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, cartSubtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `Coupon applied: Rs. ${discountAmount.toLocaleString()} discount!`
    };
  }

  // --- ORDERS CRUD ---
  getOrders() {
    return this.data.orders;
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id || (o.customer && o.customer.phone === id));
  }

  createOrder(orderData) {
    const orderId = 'ORD-PK-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'New',
      date: new Date().toISOString(),
      trackingNumber: 'TCS-' + Math.floor(100000000 + Math.random() * 900000000),
      courier: 'TCS Express'
    };

    // Deduct stock automatically
    if (newOrder.items && newOrder.items.length) {
      newOrder.items.forEach(item => {
        this.updateStock(item.productId, -item.quantity);
      });
    }

    this.data.orders.unshift(newOrder);
    this.saveDatabase();
    this.clearCart();
    this.emitChange('order_created', newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId, status, courier, trackingNumber) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      if (courier) order.courier = courier;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      this.saveDatabase();
      this.emitChange('order_updated', order);
    }
  }

  // --- REVIEWS CRUD ---
  getReviews(productId = null) {
    let list = this.data.reviews;
    if (productId) {
      list = list.filter(r => r.productId === productId && r.status === 'approved');
    }
    return list;
  }

  addReview(review) {
    const newReview = {
      id: 'rev-' + Date.now(),
      status: 'approved', // Auto-approved for pleasant customer experience, manageable by admin
      date: new Date().toISOString().slice(0, 10),
      ...review
    };
    this.data.reviews.unshift(newReview);
    this.saveDatabase();
    this.emitChange('review_added', newReview);
    return newReview;
  }

  updateReviewStatus(id, status) {
    const r = this.data.reviews.find(item => item.id === id);
    if (r) {
      r.status = status;
      this.saveDatabase();
      this.emitChange('review_updated');
    }
  }

  deleteReview(id) {
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);
    this.saveDatabase();
    this.emitChange('review_deleted');
  }

  // --- SHIPPING & SETTINGS ---
  getShippingRates() {
    return this.data.shippingRates;
  }

  getDeliveryCharge(cityName, subtotal) {
    const threshold = this.data.settings.freeShippingThreshold || 5000;
    if (subtotal >= threshold) {
      return 0; // Free shipping
    }
    const cleanCity = (cityName || '').trim().toLowerCase();
    const rateObj = this.data.shippingRates.find(r => r.city.toLowerCase() === cleanCity);
    if (rateObj) {
      return rateObj.rate;
    }
    return 290; // Default for other cities
  }

  updateShippingRate(city, rate) {
    const r = this.data.shippingRates.find(item => item.city.toLowerCase() === city.toLowerCase());
    if (r) {
      r.rate = Number(rate);
      this.saveDatabase();
      this.emitChange('settings_updated');
    }
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveDatabase();
    this.emitChange('settings_updated');
  }

  // --- CART MANAGEMENT ---
  loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
    this.emitChange('cart_updated', this.cart);
  }

  addToCart(product, quantity = 1, selectedVariant = null) {
    const variantName = selectedVariant ? selectedVariant.name : (product.variants && product.variants[0] ? product.variants[0].name : 'Default');
    const existingIndex = this.cart.findIndex(
      item => item.productId === product.id && item.variant === variantName
    );

    const price = product.salePrice || product.price;

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: price,
        originalPrice: product.price,
        image: product.images[0],
        variant: variantName,
        quantity: quantity,
        maxStock: product.stock
      });
    }

    this.saveCart();
  }

  updateCartQuantity(index, newQty) {
    if (newQty <= 0) {
      this.cart.splice(index, 1);
    } else {
      this.cart[index].quantity = newQty;
    }
    this.saveCart();
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.activeCoupon = null;
    this.saveCart();
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartCalculation(cityName = "Lahore") {
    const subtotal = this.getCartSubtotal();
    let discount = 0;

    if (this.activeCoupon) {
      const res = this.validateCoupon(this.activeCoupon.code, subtotal);
      if (res.valid) {
        discount = res.discountAmount;
      } else {
        this.activeCoupon = null; // Invalidate if cart changes dropped below min
      }
    }

    const shipping = this.getDeliveryCharge(cityName, subtotal - discount);
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    const threshold = this.data.settings.freeShippingThreshold || 5000;
    const remainingForFreeShip = Math.max(0, threshold - subtotal);

    return {
      subtotal,
      discount,
      shipping,
      finalTotal,
      activeCoupon: this.activeCoupon,
      remainingForFreeShip,
      isFreeShipping: subtotal >= threshold
    };
  }

  applyCouponToCart(code) {
    const subtotal = this.getCartSubtotal();
    const res = this.validateCoupon(code, subtotal);
    if (res.valid) {
      this.activeCoupon = res.coupon;
      this.saveCart();
      return { success: true, message: res.message, discountAmount: res.discountAmount };
    }
    return { success: false, message: res.message };
  }

  removeCouponFromCart() {
    this.activeCoupon = null;
    this.saveCart();
  }

  // --- WISHLIST MANAGEMENT ---
  loadWishlist() {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist));
    this.emitChange('wishlist_updated', this.wishlist);
  }

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    let added = false;
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(productId);
      added = true;
    }
    this.saveWishlist();
    return added;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  // --- USER AUTH & PROFILE ---
  loadUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  saveUser(user) {
    this.currentUser = user;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.emitChange('user_updated', user);
  }

  loginUser(email, name = "Customer") {
    const user = {
      email,
      name: name || email.split('@')[0],
      phone: "03001234567",
      addresses: [
        {
          id: "addr-1",
          name: name || "Customer",
          phone: "03001234567",
          street: "Gulberg III",
          city: "Lahore",
          isDefault: true
        }
      ]
    };
    this.saveUser(user);
    return user;
  }

  logoutUser() {
    this.currentUser = null;
    localStorage.removeItem(USER_KEY);
    this.emitChange('user_updated', null);
  }
}

// Global store instance
window.store = new StoreEngine();
