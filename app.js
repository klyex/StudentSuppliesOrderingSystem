/**
 * Student Supplies Ordering System
 * IT415 Midterm Practical Examination
 * 
 * Stage 1: Project Setup and Basic Interface
 * - Hard-coded 6 products and prices (immutable)
 * - Dynamic rendering of product list with "Add to Cart" buttons
 * - Setup of the 5 interface sections
 */

// ==========================================================================
// 1. Immutable Product Catalog Definition (system-security & system-features)
// ==========================================================================
const PRODUCT_CATALOG = Object.freeze([
  Object.freeze({ id: 'prod_ballpen', name: 'Ballpen', price: 12.00, icon: '🖊️' }),
  Object.freeze({ id: 'prod_pencil', name: 'Pencil', price: 10.00, icon: '✏️' }),
  Object.freeze({ id: 'prod_notebook', name: 'Notebook', price: 35.00, icon: '📓' }),
  Object.freeze({ id: 'prod_yellow_pad', name: 'Yellow Pad', price: 45.00, icon: '📋' }),
  Object.freeze({ id: 'prod_eraser', name: 'Eraser', price: 8.00, icon: '🧹' }),
  Object.freeze({ id: 'prod_ruler', name: 'Ruler', price: 15.00, icon: '📏' })
]);

// ==========================================================================
// 2. Helper Functions (Formatting & Math Precision)
// ==========================================================================

/**
 * Formats a numeric value into Philippine Peso string (e.g. 12.00 -> ₱12.00)
 * @param {number} amount 
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return `₱${num.toFixed(2)}`;
}

// ==========================================================================
// 3. Stage 1 View Rendering: Product List Display
// ==========================================================================

/**
 * Renders all 6 school supplies into the Product List section
 */
function renderProductList() {
  const gridContainer = document.getElementById('product-grid');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  PRODUCT_CATALOG.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    card.innerHTML = `
      <div class="product-icon" aria-hidden="true">${product.icon}</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">${formatCurrency(product.price)}</div>
      <button 
        type="button" 
        class="btn btn-primary btn-block btn-add-cart" 
        data-id="${product.id}"
        aria-label="Add ${product.name} to cart"
      >
        🛒 Add to Cart
      </button>
    `;

    gridContainer.appendChild(card);
  });

  // Attach click listener to "Add to Cart" buttons
  const addButtons = gridContainer.querySelectorAll('.btn-add-cart');
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      handleProductSelectStage1(productId);
    });
  });
}

/**
 * Handles product selection in Stage 1 (Logs selection ready for Stage 2 cart integration)
 * @param {string} productId 
 */
function handleProductSelectStage1(productId) {
  const product = PRODUCT_CATALOG.find(p => p.id === productId);
  if (product) {
    console.log(`[Stage 1 Event] Selected: ${product.name} (${formatCurrency(product.price)})`);
  }
}

// ==========================================================================
// 4. Application Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderProductList();
  console.log('Student Supplies Ordering System: Stage 1 Loaded Successfully.');
});
