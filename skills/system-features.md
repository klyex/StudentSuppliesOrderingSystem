---
name: system-features
description: >-
  Detailed functional specifications, business logic requirements, calculation formulas,
  and state transitions for all features in the Student Supplies Ordering System.
---

# System Features Skill: Student Supplies Ordering System

This skill specifies the business rules, functional workflows, data contracts, and calculation formulas for the core capabilities of the **Student Supplies Ordering System**, in strict compliance with the examination specification.

---

## 1. Feature Breakdown Overview

The system delivers five integrated features that model a full retail checkout transaction for a campus stationery shop:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. Product List ├──────►│ 2. Shopping     ├──────►│ 3. Order        │
│    Display      │       │    Cart Engine  │       │    Summary      │
└─────────────────┘       └────────┬────────┘       └────────┬────────┘
                                   │                         │
                                   ▼                         ▼
                          ┌─────────────────┐       ┌─────────────────┐
                          │ 5. Transaction  │◄──────┤ 4. Cash Payment │
                          │    & Receipt    │       │    Processor    │
                          └─────────────────┘       └─────────────────┘
```

---

## 2. Feature 1: Product Catalog Management

### Functional Requirements
- Display all **six (6)** required school supplies with exact pricing in Philippine Peso (₱):
  1. **Ballpen** – `₱12.00`
  2. **Pencil** – `₱10.00`
  3. **Notebook** – `₱35.00`
  4. **Yellow Pad** – `₱45.00`
  5. **Eraser** – `₱8.00`
  6. **Ruler** – `₱15.00`
- Data must be hard-coded (no external database required).
- Each product entry must feature:
  - Product Name
  - Formatted Unit Price
  - Distinct **"Add to Cart"** button
- Products must remain readable and visually distinct.

### Data Contract
```javascript
const PRODUCTS = [
  { id: 'item_1', name: 'Ballpen', price: 12.00, icon: '🖊️' },
  { id: 'item_2', name: 'Pencil', price: 10.00, icon: '✏️' },
  { id: 'item_3', name: 'Notebook', price: 35.00, icon: '📓' },
  { id: 'item_4', name: 'Yellow Pad', price: 45.00, icon: '📋' },
  { id: 'item_5', name: 'Eraser', price: 8.00, icon: '🧹' },
  { id: 'item_6', name: 'Ruler', price: 15.00, icon: '📏' }
];
```

---

## 3. Feature 2: Shopping Cart Management

### Functional Requirements
1. **Add to Cart**:
   - If the selected item does not exist in the cart, append it with an initial `quantity: 1`.
   - If the item already exists in the cart, increment its existing quantity by `1`.
2. **Item Display**:
   - For every cart entry, clearly display:
     - Product Name
     - Unit Price (`₱XX.00`)
     - Quantity (`qty`)
     - Item Subtotal (`₱XX.00`)
3. **Quantity Stepper Controls**:
   - Provide an increment (`+`) button to increase quantity by 1.
   - Provide a decrement (`-`) button to decrease quantity by 1.
4. **Zero & Negative Quantity Prevention**:
   - Quantities must never fall below `1`.
   - If the customer clicks decrement (`-`) when quantity is `1`, the item must either:
     - Automatically be removed from the cart, OR
     - Disallow decrementing below 1, requiring the dedicated Remove button.
5. **Item Removal**:
   - Provide an explicit **"Remove"** / Delete button on each cart line item to immediately purge that item from the cart.
6. **Reactive Sync**:
   - Any cart mutation (add, increase, decrease, remove) must immediately trigger recalculation of all subtotals and the overall order summary.

---

## 4. Feature 3: Order Summary & Computation Engine

### Mathematical Formulas
The calculation engine strictly implements the specified formulas:

$$\text{Subtotal} = \text{Unit Price} \times \text{Quantity}$$

$$\text{Total Amount} = \sum_{i=1}^{n} \text{Subtotal}_i$$

### Business Rules
- If the cart is empty ($n = 0$), `Total Amount = ₱0.00`.
- All monetary values must format with the Philippine Peso symbol and two decimal places (e.g., `₱142.00`).
- The summary section must clearly present:
  - Total Items Count
  - Total Amount Due

```javascript
function computeCartMetrics(cart, catalog) {
  let totalItems = 0;
  let totalAmount = 0;

  const itemDetails = cart.map(item => {
    const product = catalog.find(p => p.id === item.productId);
    const subtotal = Math.round((product.price * item.quantity + Number.EPSILON) * 100) / 100;
    totalItems += item.quantity;
    totalAmount += subtotal;

    return {
      productId: item.productId,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: subtotal
    };
  });

  return {
    itemDetails,
    totalItems,
    totalAmount: Math.round((totalAmount + Number.EPSILON) * 100) / 100
  };
}
```

---

## 5. Feature 4: Cash Payment Processing

### Functional Requirements
1. **Numeric Payment Input**:
   - A dedicated input field where the cashier or customer inputs the tendered cash amount.
2. **Confirm Payment Action**:
   - A prominent **"Confirm Payment"** button that executes input validation and finalizes the transaction.
3. **Change Calculation Formula**:

$$\text{Change} = \text{Amount Paid} - \text{Total Amount}$$

4. **Change Computation Rules**:
   - If `Amount Paid >= Total Amount`, compute change:
     - E.g., Total: `₱72.00`, Paid: `₱100.00` $\rightarrow$ Change: `₱28.00`.
     - Exact payment: Total: `₱50.00`, Paid: `₱50.00` $\rightarrow$ Change: `₱0.00`.
   - If payment is insufficient, change is **not** computed and an error is displayed.

---

## 6. Feature 5: Digital Receipt Generation

### Functional Requirements
Upon successful payment validation, the system instantly generates and displays a structured digital receipt.

### Required Fields
The receipt must contain all nine (9) required fields:
1. **Transaction Reference Number**: Unique tracking string (e.g., `TXN-20261012-A8F2`).
2. **Date and Time**: Timestamp of transaction completion (e.g., `Oct 12, 2026, 09:45 PM`).
3. **Purchased Products**: Itemized list of all products in the transaction.
4. **Quantity of Each Product**: Number of units purchased per product.
5. **Unit Price and Subtotal**: Individual rate and calculated subtotal for each line item.
6. **Total Amount Due**: Cumulative total of the order.
7. **Amount Paid**: Cash tendered by the customer.
8. **Change**: Difference between amount paid and total amount.
9. **Payment Confirmation Message**: E.g., *"Payment Successful! Thank you for purchasing at Student Supplies Shop."*

### New Transaction (Reset) Functionality
- The receipt section must include a **"New Transaction"** button.
- Clicking this button must:
  - Clear all items from the shopping cart (`cart = []`).
  - Clear the cash payment input field (`value = ''`).
  - Clear all validation and error messages.
  - Hide or reset the digital receipt section.
  - Reset the Order Summary back to `₱0.00`.
  - Return the application to a clean, ready-to-order state.

---

## 7. State Transition Flow

```
[ Catalog Ready ] ──► (Add Items) ──► [ Cart Populated ]
                                            │
                                            ▼
                                   (Enter Cash & Confirm)
                                            │
                             ┌──────────────┴──────────────┐
                             │                             │
                   [ Invalid Payment ]             [ Valid Payment ]
                     (Display Error)                       │
                             │                             ▼
                             └──────────────► [ Digital Receipt Rendered ]
                                                           │
                                                (Click New Transaction)
                                                           │
                                                           ▼
                                                   [ Clean Reset State ]
```
