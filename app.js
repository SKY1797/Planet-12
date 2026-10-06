/**
 * PLANET 12 — E-Commerce & Interactive Experience
 * Conversions, WhatsApp Concierge & Dynamic Cart
 */

// Global Product Database
const PRODUCTS = {
  pecan: {
    id: 'pecan',
    name: 'Mammoth Jumbo Pecan Halves',
    shortName: 'Mammoth Pecans',
    category: 'pecan',
    image: 'assets/pecan-nuts.jpg',
    origin: 'Georgia & Texas Orchards, USA',
    grade: 'Fancy Mammoth Jumbo (Largest Available)',
    pricing: {
      '250g': { price: 499, mrp: 599, savings: 100 },
      '500g': { price: 949, mrp: 1199, savings: 250 },
      '1kg': { price: 1799, mrp: 2399, savings: 600 }
    },
    defaultWeight: '250g',
    nutrition: {
      calories: '196 kcal',
      fat: '20g (Monounsaturated 12g, Poly 6g)',
      protein: '2.6g',
      netCarbs: '1.2g',
      fiber: '2.7g',
      orac: '17,940 μmol TE (World #1)',
      highlights: 'Rich in Gamma-Tocopherol Vitamin E, Zinc, and Oleic acid. Zero bitterness, 100% natural maple sweetness.'
    }
  },
  almond: {
    id: 'almond',
    name: 'California Supreme Jumbo Almonds',
    shortName: 'California Almonds',
    category: 'almond',
    image: 'assets/almonds.jpg',
    origin: 'Central Valley, California, USA',
    grade: 'Nonpareil Supreme Jumbo 20/22',
    pricing: {
      '250g': { price: 349, mrp: 420, savings: 71 },
      '500g': { price: 649, mrp: 799, savings: 150 },
      '1kg': { price: 1199, mrp: 1499, savings: 300 }
    },
    defaultWeight: '250g',
    nutrition: {
      calories: '164 kcal',
      fat: '14g (Monounsaturated 9g)',
      protein: '6.0g',
      netCarbs: '2.5g',
      fiber: '3.5g',
      orac: '4,454 μmol TE',
      highlights: 'Naturally sweet snap, unpasteurized, high in Vitamin E, Magnesium, and plant-based protein.'
    }
  },
  cashew: {
    id: 'cashew',
    name: 'King W180 Whole Ivory Cashews',
    shortName: 'King W180 Cashews',
    category: 'cashew',
    image: 'assets/cashews.jpg',
    origin: 'Konkan Coast & Mangaluru Select',
    grade: 'King Grade W180 (Only 180 nuts/lb)',
    pricing: {
      '250g': { price: 399, mrp: 480, savings: 81 },
      '500g': { price: 749, mrp: 899, savings: 150 },
      '1kg': { price: 1399, mrp: 1699, savings: 300 }
    },
    defaultWeight: '250g',
    nutrition: {
      calories: '157 kcal',
      fat: '12g (Heart-Healthy Stearic & Oleic)',
      protein: '5.2g',
      netCarbs: '8.0g',
      fiber: '0.9g',
      orac: '1,948 μmol TE',
      highlights: 'Extraordinarily creamy, sweet ivory crescent, zero sulphur bleaching, zero broken kernels.'
    }
  },
  gift: {
    id: 'gift',
    name: 'The Connoisseur’s Trio Hamper Box',
    shortName: 'Trio Gift Hamper',
    category: 'gift',
    image: 'assets/gift-box.jpg',
    origin: 'Curated Artisanal Trio from USA & India',
    grade: 'Royal Gift Presentation',
    pricing: {
      '750g Box': { price: 1249, mrp: 1549, savings: 300 },
      '1.5kg Grand Box': { price: 2399, mrp: 2999, savings: 600 }
    },
    defaultWeight: '750g Box',
    nutrition: {
      calories: '172 kcal avg / serving',
      fat: '15g balanced healthy fats',
      protein: '4.6g',
      netCarbs: '3.9g',
      fiber: '2.4g',
      orac: '8,114 μmol TE avg',
      highlights: 'Includes 3 sealed glass keepsake jars: Mammoth Pecans, Jumbo California Almonds, and W180 Cashews with a gold foil gift sleeve.'
    }
  }
};

// State Variables
let selectedWeights = {
  pecan: '250g',
  almond: '250g',
  cashew: '250g',
  gift: '750g Box'
};

let cart = [];
let appliedCoupon = 'PLANET12';
let discountRate = 0.15; // 15%
const FREE_SHIPPING_THRESHOLD = 799;
const STANDARD_SHIPPING_FEE = 70;
const WHATSAPP_PHONE = '9574279679';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initWeightSelectors();
  initCollectionTabs();
  initScrollHeader();
  initMobileMenu();
  loadCartFromStorage();
  updateCartUI();
});

/* ==========================================================================
   WEIGHT PICKER LOGIC
   ========================================================================== */
function initWeightSelectors() {
  document.querySelectorAll('.weight-options').forEach(group => {
    const productId = group.dataset.product;
    const buttons = group.querySelectorAll('.weight-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const weight = btn.dataset.weight;
        const price = parseInt(btn.dataset.price, 10);
        const mrp = parseInt(btn.dataset.mrp, 10);
        const savings = parseInt(btn.dataset.savings, 10);

        selectedWeights[productId] = weight;

        // Update card pricing displays
        const priceEl = document.getElementById(`price-${productId}`);
        const mrpEl = document.getElementById(`mrp-${productId}`);
        const saveEl = document.getElementById(`save-${productId}`);

        if (priceEl) priceEl.textContent = price.toLocaleString('en-IN');
        if (mrpEl) mrpEl.textContent = `₹${mrp.toLocaleString('en-IN')}`;
        if (saveEl) saveEl.textContent = `Save ₹${savings.toLocaleString('en-IN')}`;
      });
    });
  });
}

/* ==========================================================================
   QUANTITY STEPPERS
   ========================================================================== */
function incrementQty(productId) {
  const input = document.getElementById(`qty-${productId}`);
  if (input) {
    let current = parseInt(input.value, 10) || 1;
    if (current < 10) input.value = current + 1;
  }
}

function decrementQty(productId) {
  const input = document.getElementById(`qty-${productId}`);
  if (input) {
    let current = parseInt(input.value, 10) || 1;
    if (current > 1) input.value = current - 1;
  }
}

/* ==========================================================================
   CART OPERATIONS
   ========================================================================== */
function addToCart(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;

  const weight = selectedWeights[productId] || product.defaultWeight;
  const pricing = product.pricing[weight];
  const qtyInput = document.getElementById(`qty-${productId}`);
  const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

  const itemKey = `${productId}-${weight}`;
  const existingIndex = cart.findIndex(item => item.key === itemKey);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      key: itemKey,
      id: productId,
      name: product.name,
      shortName: product.shortName,
      weight: weight,
      price: pricing.price,
      mrp: pricing.mrp,
      quantity: quantity,
      image: product.image
    });
  }

  saveCartToStorage();
  updateCartUI();
  openCart();

  // Reset quantity input back to 1
  if (qtyInput) qtyInput.value = 1;
}

function updateItemQuantity(itemKey, delta) {
  const index = cart.findIndex(item => item.key === itemKey);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCartToStorage();
  updateCartUI();
}

function removeItem(itemKey) {
  cart = cart.filter(item => item.key !== itemKey);
  saveCartToStorage();
  updateCartUI();
}

function saveCartToStorage() {
  try {
    localStorage.setItem('p12_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Local storage unavailable');
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('p12_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }
}

/* ==========================================================================
   CART UI RENDERING
   ========================================================================== */
function updateCartUI() {
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Update header pill
  const headerCount = document.getElementById('headerCartCount');
  const headerTotal = document.getElementById('headerCartTotal');
  const drawerCount = document.getElementById('drawerCartCount');

  if (headerCount) headerCount.textContent = totalItemsCount;
  if (headerTotal) headerTotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (drawerCount) drawerCount.textContent = `(${totalItemsCount})`;

  const itemsContainer = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('emptyCartState');
  const cartFooter = document.getElementById('cartFooter');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    if (cartFooter) cartFooter.style.display = 'none';
    updateShippingProgress(0);
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartFooter) cartFooter.style.display = 'block';

  // Render items
  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.shortName}</h4>
        <div class="cart-item-weight">${item.weight}</div>
        <div class="cart-item-price-row">
          <span class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
          <div class="cart-mini-stepper">
            <button type="button" class="mini-qty-btn" onclick="updateItemQuantity('${item.key}', -1)" aria-label="Decrease quantity">−</button>
            <span class="mini-qty-val">${item.quantity}</span>
            <button type="button" class="mini-qty-btn" onclick="updateItemQuantity('${item.key}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" onclick="removeItem('${item.key}')">Remove</button>
      </div>
    </div>
  `).join('');

  // Shipping Calculation
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShipping) ? 0 : STANDARD_SHIPPING_FEE;
  updateShippingProgress(subtotal);

  // Discount Calculation
  let discountAmount = 0;
  if (appliedCoupon === 'PLANET12') {
    discountAmount = Math.round(subtotal * discountRate);
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Update calculations
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountRow = document.getElementById('discountRow');
  const discountEl = document.getElementById('cartDiscount');
  const shippingEl = document.getElementById('cartShipping');
  const grandTotalEl = document.getElementById('cartGrandTotal');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (shippingEl) shippingEl.textContent = isFreeShipping ? 'FREE' : `₹${shippingFee}`;
  
  if (discountRow && discountEl) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-₹${discountAmount.toLocaleString('en-IN')}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
}

function updateShippingProgress(subtotal) {
  const textEl = document.getElementById('shippingProgressText');
  const fillEl = document.getElementById('shippingProgressFill');
  const iconEl = document.getElementById('shippingIcon');

  if (!textEl || !fillEl) return;

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    textEl.innerHTML = `🎉 You’ve unlocked <strong>FREE Pan-India Express Shipping!</strong>`;
    fillEl.style.width = '100%';
    if (iconEl) iconEl.textContent = '🚀';
  } else {
    const diff = FREE_SHIPPING_THRESHOLD - subtotal;
    const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    textEl.innerHTML = `Add <strong>₹${diff.toLocaleString('en-IN')}</strong> more for <strong>FREE Pan-India Delivery!</strong>`;
    fillEl.style.width = `${percent}%`;
    if (iconEl) iconEl.textContent = '🚚';
  }
}

function applyCoupon() {
  const input = document.getElementById('couponInput');
  const note = document.getElementById('couponAppliedMsg');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (code === 'PLANET12') {
    appliedCoupon = 'PLANET12';
    discountRate = 0.15;
    if (note) {
      note.style.display = 'block';
      note.innerHTML = `✓ Code <strong>PLANET12</strong> applied! (15% Launch Discount)`;
    }
  } else if (code === '') {
    appliedCoupon = null;
    discountRate = 0;
    if (note) note.style.display = 'none';
  } else {
    alert(`Coupon code "${code}" is invalid or expired. Try using PLANET12 for 15% OFF.`);
    return;
  }
  updateCartUI();
}

function copyCouponCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    alert(`Coupon code "${code}" copied to clipboard! It provides 15% OFF on your entire bag.`);
    const input = document.getElementById('couponInput');
    if (input) input.value = code;
  }).catch(() => {
    alert(`Use code: ${code} at checkout!`);
  });
}

/* ==========================================================================
   CART DRAWER CONTROLS
   ========================================================================== */
function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('cartTrigger')?.addEventListener('click', openCart);

/* ==========================================================================
   WHATSAPP ORDERING ENGINE (High Conversion for Indian Buyers)
   ========================================================================== */

/**
 * 1-Click Order for Single Product from Card
 */
function orderSingleViaWhatsApp(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;

  const weight = selectedWeights[productId] || product.defaultWeight;
  const pricing = product.pricing[weight];
  const qtyInput = document.getElementById(`qty-${productId}`);
  const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
  const itemTotal = pricing.price * quantity;

  // 15% Launch Discount calculation
  const discount = Math.round(itemTotal * 0.15);
  const finalPrice = itemTotal - discount;

  const message = 
`*✦ PLANET 12 DIRECT ORDER REQUEST ✦*

Hello Planet 12! I would like to order:
• *Product:* ${product.name}
• *Pack Size:* ${weight}
• *Quantity:* ${quantity}
• *Regular Price:* ₹${itemTotal}
• *Launch Promo (PLANET12):* -₹${discount} (15% OFF)
• *Payable Amount:* *₹${finalPrice}*

Please confirm delivery timeline and share UPI / COD details.
My Delivery City / Pincode: `;

  const encodedUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, '_blank');
}

/**
 * Full Bag Checkout via WhatsApp
 */
function checkoutViaWhatsApp() {
  if (cart.length === 0) {
    alert('Your bag is empty! Please add some delicious nuts first.');
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = appliedCoupon === 'PLANET12' ? Math.round(subtotal * discountRate) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = subtotal - discount + shipping;

  let itemsList = '';
  cart.forEach((item, index) => {
    itemsList += `${index + 1}. *${item.name}* (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
  });

  const message =
`*✦ PLANET 12 WEB ORDER ✦*

Hello Planet 12! I would like to order the following fresh nuts:

${itemsList}
----------------------------------
*Subtotal:* ₹${subtotal}
*Promo Code:* ${appliedCoupon || 'None'} (-₹${discount})
*Pan-India Shipping:* ${shipping === 0 ? 'FREE' : `₹${shipping}`}
*Final Total:* *₹${grandTotal}*
----------------------------------

*Delivery Details:*
• Name: 
• Contact No: 
• Complete Address: 
• Pincode: 
• Preferred Payment: (UPI / Cash on Delivery)

Please confirm my order dispatch!`;

  const encodedUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, '_blank');
}

/* ==========================================================================
   WEB FAST CHECKOUT MODAL & ORDER CONFIRMATION
   ========================================================================== */
function openCheckoutModal() {
  if (cart.length === 0) {
    alert('Please add items to your bag before checking out.');
    return;
  }
  closeCart();

  const modal = document.getElementById('checkoutModal');
  const overlay = document.getElementById('checkoutModalOverlay');
  const summaryPill = document.getElementById('checkoutSummaryPill');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = appliedCoupon === 'PLANET12' ? Math.round(subtotal * discountRate) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = subtotal - discount + shipping;

  if (summaryPill) {
    summaryPill.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <strong>Total Items: ${cart.length} product(s)</strong>
        <strong style="color: var(--color-primary);">Payable: ₹${grandTotal.toLocaleString('en-IN')}</strong>
      </div>
      <small style="color: var(--text-muted);">Includes 15% Launch Discount + ${shipping === 0 ? 'FREE Shipping' : '₹70 Shipping'}</small>
    `;
  }

  if (modal) modal.classList.add('open');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  const overlay = document.getElementById('checkoutModalOverlay');
  if (modal) modal.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function handleDirectCheckout(event) {
  event.preventDefault();

  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const address = document.getElementById('coAddress').value.trim();
  const city = document.getElementById('coCity').value.trim();
  const pincode = document.getElementById('coPincode').value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI';

  const orderId = `P12-${Math.floor(100000 + Math.random() * 900000)}`;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = appliedCoupon === 'PLANET12' ? Math.round(subtotal * discountRate) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = subtotal - discount + shipping;

  // Build receipt html
  const receiptBox = document.getElementById('orderReceiptBox');
  if (receiptBox) {
    receiptBox.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong>Order ID:</strong> <span style="color: var(--color-primary); font-weight: 700;">#${orderId}</span><br>
        <strong>Recipient:</strong> ${name} (${phone})<br>
        <strong>Delivery To:</strong> ${address}, ${city} - ${pincode}<br>
        <strong>Payment Mode:</strong> ${paymentMethod}
      </div>
      <div style="border-top: 1px solid #DDD; padding-top: 8px;">
        <strong>Order Summary:</strong><br>
        ${cart.map(i => `• ${i.shortName} (${i.weight}) x ${i.quantity} — ₹${i.price * i.quantity}`).join('<br>')}<br>
        <strong>Final Total: ₹${grandTotal.toLocaleString('en-IN')}</strong>
      </div>
    `;
  }

  // Pre-fill WhatsApp share link
  const waShareBtn = document.getElementById('orderWhatsAppShareBtn');
  if (waShareBtn) {
    const waText = `Hi Planet 12! I just placed Order #${orderId} on your site for ₹${grandTotal}. Name: ${name}, Phone: ${phone}, City: ${city}. Please share dispatch tracking!`;
    waShareBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;
  }

  // Clear cart
  cart = [];
  saveCartToStorage();
  updateCartUI();

  // Close checkout modal & open success modal
  closeCheckoutModal();
  openSuccessModal();
}

function openSuccessModal() {
  const modal = document.getElementById('successModal');
  const overlay = document.getElementById('successModalOverlay');
  if (modal) modal.classList.add('open');
  if (overlay) overlay.classList.add('active');
}

function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  const overlay = document.getElementById('successModalOverlay');
  if (modal) modal.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   PRODUCT DETAILS & NUTRITION MODAL
   ========================================================================== */
function openProductModal(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;

  const titleEl = document.getElementById('nutModalTitle');
  const bodyEl = document.getElementById('nutModalBody');
  const modal = document.getElementById('nutritionModal');
  const overlay = document.getElementById('nutritionModalOverlay');

  if (titleEl) titleEl.textContent = `${product.name} — Origin & Nutrition`;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="display: flex; gap: 18px; margin-bottom: 20px; align-items: center;">
        <img src="${product.image}" alt="${product.name}" style="width: 110px; height: 110px; border-radius: 12px; object-fit: cover;">
        <div>
          <div style="font-size: 0.8rem; color: var(--color-accent-gold); font-weight: 700; text-transform: uppercase;">Origin</div>
          <p style="font-size: 0.95rem; font-weight: 600; color: var(--color-primary-dark);">${product.origin}</p>
          <div style="font-size: 0.8rem; color: var(--color-accent-gold); font-weight: 700; text-transform: uppercase; margin-top: 6px;">Quality Grade</div>
          <p style="font-size: 0.9rem; color: var(--text-muted);">${product.grade}</p>
        </div>
      </div>

      <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 16px; background: #FAF7F2; padding: 12px; border-radius: 8px;">
        ${product.nutrition.highlights}
      </p>

      <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary-dark);">Nutritional Profile (Per 30g Serving)</h4>
      <table class="nutrition-table">
        <tr><th>Nutrient</th><th>Amount / Value</th></tr>
        <tr><td>Energy</td><td>${product.nutrition.calories}</td></tr>
        <tr><td>Healthy Fats</td><td>${product.nutrition.fat}</td></tr>
        <tr><td>Protein</td><td>${product.nutrition.protein}</td></tr>
        <tr><td>Dietary Fiber</td><td>${product.nutrition.fiber}</td></tr>
        <tr><td>Net Carbohydrates</td><td>${product.nutrition.netCarbs}</td></tr>
        <tr><td>ORAC Antioxidant Score</td><td><strong>${product.nutrition.orac}</strong></td></tr>
      </table>

      <div style="margin-top: 24px; display: flex; gap: 12px;">
        <button type="button" class="btn btn-primary btn-block" onclick="closeProductModal(); addToCart('${productId}');">
          Add To Bag
        </button>
      </div>
    `;
  }

  if (modal) modal.classList.add('open');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('nutritionModal');
  const overlay = document.getElementById('nutritionModalOverlay');
  if (modal) modal.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   COLLECTION FILTER TABS
   ========================================================================== */
function initCollectionTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.product-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   STICKY HEADER SCROLL EFFECT
   ========================================================================== */
function initScrollHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNavPanel');

  toggleBtn?.addEventListener('click', () => {
    mobileNav?.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav?.classList.remove('open');
    });
  });
}

/* ==========================================================================
   CONTACT & NEWSLETTER FORMS
   ========================================================================== */
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  const phone = document.getElementById('contactPhone').value;
  const topic = document.getElementById('contactTopic').value;
  const msg = document.getElementById('contactMsg').value;

  const successBanner = document.getElementById('contactSuccessMsg');
  if (successBanner) {
    successBanner.style.display = 'block';
  }

  // Also offer immediate WhatsApp dispatch
  const confirmWa = confirm(`Thank you ${name}! Would you like to chat with our concierge on WhatsApp directly now?`);
  if (confirmWa) {
    const waText = `Hello Planet 12! I am ${name} (${phone}). Topic: ${topic}. Message: ${msg}`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`, '_blank');
  }

  event.target.reset();
}

function handleNewsletter(event) {
  event.preventDefault();
  const banner = document.getElementById('newsletterSuccess');
  if (banner) banner.style.display = 'block';
  event.target.reset();
}
