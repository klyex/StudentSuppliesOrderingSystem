---
name: system-security
description: >-
  Security guidelines, defensive programming patterns, client-side input sanitization,
  data integrity controls, and financial calculation precision for the Student Supplies Ordering System.
---

# System Security Skill: Student Supplies Ordering System

This skill defines the security principles, defensive programming standards, input sanitization rules, and state integrity controls for the **Student Supplies Ordering System**. Even in a lightweight, browser-based, or desktop environment without an external database, client-side security and data integrity are essential to prevent tampering, calculation exploits, and invalid transactions.

---

## 1. Core Threat Model & Attack Vectors

In a client-side Point of Sale (POS) application, the primary risks involve:
1. **Client-Side State Tampering**: Manipulating product prices, quantities, subtotals, or change in memory or via the browser console.
2. **Floating-Point Precision Exploits**: Currency calculation bugs caused by IEEE 754 floating-point inaccuracies.
3. **Cross-Site Scripting (XSS)**: Injecting malicious strings into receipt reference fields, notes, or product names that get rendered unsafely into the DOM.
4. **Input Boundary Violations**: Submitting negative numbers, scientific notation (e.g., `1e10`), `NaN`, `Infinity`, or extremely large integers.
5. **Double-Submission / Replay Actions**: Triggering multiple payments on the same cart or continuing to edit the cart after a transaction has completed without resetting.

---

## 2. Catalog & Price Immutability Protection

Product catalog definitions and their respective prices must be strictly immutable. Prices must never be retrieved from mutable user inputs or untrusted client state.

### Rules
1. **Freeze Catalog Data**: Hard-code product definitions and freeze the structure to prevent runtime modifications.
2. **Single Source of Truth for Prices**: When adding an item to the cart or computing subtotals, always resolve the unit price directly from the immutable catalog definition using the product's unique identifier.

### Reference Implementation
```javascript
// Catalog definitions frozen to prevent runtime property overrides
const PRODUCT_CATALOG = Object.freeze([
  Object.freeze({ id: 'prod_ballpen', name: 'Ballpen', price: 12.00 }),
  Object.freeze({ id: 'prod_pencil', name: 'Pencil', price: 10.00 }),
  Object.freeze({ id: 'prod_notebook', name: 'Notebook', price: 35.00 }),
  Object.freeze({ id: 'prod_yellow_pad', name: 'Yellow Pad', price: 45.00 }),
  Object.freeze({ id: 'prod_eraser', name: 'Eraser', price: 8.00 }),
  Object.freeze({ id: 'prod_ruler', name: 'Ruler', price: 15.00 })
]);

// Helper to look up verified price
function getVerifiedProductPrice(productId) {
  const product = PRODUCT_CATALOG.find(p => p.id === productId);
  if (!product) {
    throw new Error(`Security Violation: Unrecognized product ID "${productId}"`);
  }
  return product.price;
}
```

---

## 3. Financial Precision & Arithmetic Integrity

JavaScript numbers use 64-bit binary floating-point representation (IEEE 754), which can introduce rounding errors (e.g., `0.1 + 0.2 = 0.30000000000000004` or `35.00 * 3 = 105.00000000000001`). In financial software, calculations must guarantee exact centavo precision.

### Rules
1. **Centavo Arithmetic (Integer Representation)**: Internally compute currency amounts in whole centavos (multiplied by 100 as integers) or apply strict rounding to 2 decimal places at each calculation boundary.
2. **Deterministic Rounding**: Use `Math.round((value + Number.EPSILON) * 100) / 100` to prevent floating-point drift.
3. **Never Trust Pre-Calculated Subtotals**: Always recompute `Subtotal = Unit Price * Quantity` and `Total Amount = Sum of Subtotals` from verified catalog prices and validated quantities before confirming payment.

### Safe Calculation Implementation
```javascript
// Rounds monetary value safely to 2 decimal places
function roundToCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
    throw new TypeError('Invalid monetary amount provided for calculation.');
  }
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

// Calculates verified total from cart items using immutable catalog prices
function calculateVerifiedTotal(cartItems) {
  return cartItems.reduce((accTotal, item) => {
    const verifiedUnitPrice = getVerifiedProductPrice(item.productId);
    const itemSubtotal = roundToCurrency(verifiedUnitPrice * item.quantity);
    return roundToCurrency(accTotal + itemSubtotal);
  }, 0);
}
```

---

## 4. Input Sanitization & XSS Defense

Dynamic content injected into the DOM (product names, receipt transaction numbers, validation messages, quantities) must be safely escaped.

### Rules
1. **Prefer Safe DOM APIs**: Always use `textContent` or `innerText` instead of `innerHTML` when rendering dynamic text.
2. **Escape Dynamic Values**: If templating engines or HTML string concatenations are used, sanitize special HTML characters (`<`, `>`, `&`, `"`, `'`, `/`).
3. **Input Format Constraints**: Explicitly constrain input fields using HTML5 attributes (`type="number"`, `min="0"`, `step="0.01"`), but **never rely solely on client-side HTML attributes**—always enforce JavaScript validation.

### Escaping Function
```javascript
function escapeHTML(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

---

## 5. Quantity & Cart Boundary Defense

Quantities must be constrained strictly to valid positive integers.

### Rules
1. **Positive Integer Validation**: Quantity must satisfy `Number.isInteger(qty) && qty > 0`.
2. **Upper Bound Check**: Set a reasonable upper limit per item (e.g., maximum 999 units) to prevent memory allocation abuse or integer overflow.
3. **Safe Removal on Zero**: If quantity drops to `0` or below, the item must be removed from the cart completely rather than retaining negative or zero values.

```javascript
function validateCartQuantity(quantity) {
  const parsed = Number(quantity);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { valid: false, message: 'Quantity must be a positive whole number.' };
  }
  if (parsed > 999) {
    return { valid: false, message: 'Quantity cannot exceed 999 items per line.' };
  }
  return { valid: true, value: parsed };
}
```

---

## 6. Transaction Reference & Token Generation

Each receipt must have a unique, tamper-resistant transaction reference identifier.

### Rules
1. **Uniqueness**: Combine timestamp metrics with random entropy or standard UUIDs (`crypto.randomUUID()`).
2. **Immutability of Finalized Receipts**: Once a transaction is finalized and receipt generated, lock the transaction state until the user clicks **New Transaction**.

### Secure Transaction ID Generator
```javascript
function generateTransactionReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = (window.crypto && window.crypto.getRandomValues)
    ? Array.from(window.crypto.getRandomValues(new Uint8Array(4)))
        .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
    : Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SSOS-${timestamp}-${randomPart}`;
}
```

---

## 7. Security Audit Checklist

Before finalizing or committing code, ensure:
- [ ] Product prices are immutable and cannot be altered from browser dev tools.
- [ ] Cart calculations use verified catalog unit prices, not client-tampered object properties.
- [ ] All monetary calculations are rounded to 2 decimal places to avoid floating-point errors.
- [ ] No `eval()` or unescaped `innerHTML` calls exist in the codebase.
- [ ] Negative and non-numeric payment amounts are rejected before calculation.
- [ ] "Confirm Payment" button is disabled when cart is empty or transaction is already finalized.
- [ ] Sensitive memory/state is cleanly purged upon clicking "New Transaction".
