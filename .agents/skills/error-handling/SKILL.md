---
name: error-handling
description: >-
  Validation rules, error message matrices, edge-case recovery patterns,
  and testing verification protocols for the Student Supplies Ordering System.
---

# Error Handling Skill: Student Supplies Ordering System

This skill defines the validation architecture, edge-case prevention mechanisms, user-friendly error feedback, and formal testing protocols for the **Student Supplies Ordering System**.

---

## 1. Error Classification & Strategy

Errors in the Student Supplies Ordering System fall into three main categories:
1. **Payment Input Validation Errors**: Invalid, empty, negative, or insufficient cash values entered during checkout.
2. **Cart & Quantity Boundary Errors**: Attempting to set non-positive quantities or checking out with an empty cart.
3. **State Inconsistency Errors**: Attempting to alter quantities after payment confirmation without initiating a new transaction.

### Core Principles
- **Fail Fast & Explicitly**: Validate before any calculation or state mutation.
- **Clear & Actionable Messages**: Explain what was wrong and how the user can correct it.
- **Non-Destructive Feedback**: Retain entered values when reporting errors so users don't have to retype everything.
- **Real-Time Recovery**: Automatically dismiss or update error alerts when the user edits the problematic input.

---

## 2. Payment Validation Matrix

The system must evaluate payments against the four mandatory error conditions defined in Section III Step 4:

| Trigger Condition | Technical Evaluation | Error Message Displayed | UI Action / State |
| :--- | :--- | :--- | :--- |
| **Empty Payment Field** | `input.trim() === ''` | *"Payment amount is required. Please enter the cash tendered."* | Highlight field in red; retain focus. |
| **Non-Numeric / NaN** | `isNaN(Number(val)) \|\| !isFinite(val)` | *"Invalid payment amount. Please enter a valid numerical value."* | Highlight field; shake alert animation. |
| **Negative Payment** | `Number(val) < 0` | *"Payment amount cannot be negative. Please enter a positive amount."* | Highlight field in red. |
| **Insufficient Payment** | `Number(val) < totalAmount` | *"Insufficient payment. Total due is ₱{TOTAL}, but only ₱{PAID} was entered (short by ₱{DIFF})."* | Display alert with exact deficiency amount. |
| **Empty Cart Checkout** | `cart.length === 0` | *"Your cart is empty. Add products before confirming payment."* | Disable confirm button or display inline warning. |

---

## 3. Reference Implementation: Payment Validator

```javascript
/**
 * Validates the payment input against order total.
 * @param {string|number} rawAmount - Raw input from payment field.
 * @param {number} totalAmount - Calculated total amount due from cart.
 * @param {number} cartItemCount - Number of distinct items in cart.
 * @returns {{ isValid: boolean, error?: string, parsedAmount?: number, change?: number }}
 */
function validatePayment(rawAmount, totalAmount, cartItemCount) {
  // 1. Guard against empty cart
  if (!cartItemCount || cartItemCount <= 0 || totalAmount <= 0) {
    return {
      isValid: false,
      error: 'Your cart is empty. Please add items to the cart before confirming payment.'
    };
  }

  // 2. Check for empty or blank input
  const stringVal = String(rawAmount !== null && rawAmount !== undefined ? rawAmount : '').trim();
  if (stringVal === '') {
    return {
      isValid: false,
      error: 'The payment field is empty. Please enter the cash amount.'
    };
  }

  // 3. Check for valid numeric format
  const parsed = Number(stringVal);
  if (isNaN(parsed) || !isFinite(parsed)) {
    return {
      isValid: false,
      error: 'The payment is not a valid number. Please enter numbers only.'
    };
  }

  // 4. Check for negative amount
  if (parsed < 0) {
    return {
      isValid: false,
      error: 'The payment cannot be negative. Please enter a positive cash amount.'
    };
  }

  // 5. Check for insufficient payment
  const roundedPaid = Math.round((parsed + Number.EPSILON) * 100) / 100;
  const roundedTotal = Math.round((totalAmount + Number.EPSILON) * 100) / 100;

  if (roundedPaid < roundedTotal) {
    const shortage = (roundedTotal - roundedPaid).toFixed(2);
    return {
      isValid: false,
      error: `The payment is less than the total amount due. Total is ₱${roundedTotal.toFixed(2)}, paid ₱${roundedPaid.toFixed(2)} (Short by ₱${shortage}).`
    };
  }

  // 6. Payment is valid - calculate change
  const change = Math.round((roundedPaid - roundedTotal + Number.EPSILON) * 100) / 100;
  return {
    isValid: true,
    parsedAmount: roundedPaid,
    change: change
  };
}
```

---

## 4. Cart & Quantity Error Prevention

### Boundary Rules
1. **Zero or Negative Quantity Handling**:
   - When a user clicks decrement (`-`) and `currentQty === 1`:
     - Either prompt/auto-remove the line item from the cart, or disallow decrementing past 1.
   - If manual quantity input is permitted, parse the value:
     ```javascript
     function sanitizeQuantityInput(input) {
       const qty = parseInt(input, 10);
       if (isNaN(qty) || qty <= 0) return 1;
       if (qty > 999) return 999;
       return qty;
     }
     ```
2. **Floating-point Quantity Prevention**:
   - Stationeries are discrete physical items; non-integer quantities (e.g., `2.5 notebooks`) must be rejected or rounded to whole integers.

---

## 5. UI Error Presentation Standards

- **Inline Error Banner**:
  - Render an error container directly adjacent to the payment input:
    ```html
    <div id="payment-error" class="error-banner" role="alert" aria-live="assertive">
      <!-- Error text injected here -->
    </div>
    ```
- **Styling Specs**:
  - Background: Soft red (`#fee2e2` / `var(--color-danger-bg)`).
  - Border: Solid red (`1px solid #ef4444`).
  - Text: Dark red (`#991b1b`) for high contrast readability.
  - Icon: Leading warning icon (`⚠️`).
- **Input State Highlighting**:
  - Add `.is-invalid` class to input element: `border-color: #ef4444; outline: 2px solid rgba(239, 68, 68, 0.2);`.
- **Dismissal Behavior**:
  - Hook into `input` or `keyup` event of the payment input to clear error styling as soon as the user starts typing again.

---

## 6. Official Test Suite Protocol

The implementation must pass all ten (10) tests specified in Section III Step 6:

| # | Test Scenario | Step / Action | Expected Result |
| :---: | :--- | :--- | :--- |
| **1** | **Add single product** | Click "Add to Cart" on Ballpen | Ballpen appears in cart with Qty: 1, Subtotal: ₱12.00, Total: ₱12.00. |
| **2** | **Add multiple products** | Add Notebook (₱35.00) and Ruler (₱15.00) | Both items appear in cart; Total updates to ₱62.00 (`12 + 35 + 15`). |
| **3** | **Adjust quantities** | Click `+` on Pencil; click `-` on Notebook | Quantities increase/decrease; subtotals and Total adjust automatically. |
| **4** | **Remove product** | Click "Remove" button on Ruler | Ruler is removed from cart; Total decreases by Ruler subtotal. |
| **5** | **Verify total calculations** | Add 2 Yellow Pads (₱45 × 2 = ₱90) | Total updates accurately to include ₱90.00 without rounding errors. |
| **6** | **Blank payment test** | Leave payment blank and click "Confirm Payment" | Displays error: *"The payment field is empty."* Transaction blocked. |
| **7** | **Negative payment test** | Enter `-50` and click "Confirm Payment" | Displays error: *"The payment cannot be negative."* Transaction blocked. |
| **8** | **Insufficient payment test** | Total is ₱100; enter `60` and confirm | Displays error: *"The payment is less than total amount due."* Transaction blocked. |
| **9** | **Sufficient payment test** | Total is ₱72; enter `100` and confirm | Success! Receipt displayed; Change correctly computed: `₱28.00`. |
| **10** | **New transaction test** | Click "New Transaction" button | Cart is emptied, payment cleared, error cleared, receipt cleared, Total ₱0.00. |
