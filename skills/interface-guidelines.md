---
name: interface-guidelines
description: >-
  UI layout standards, component specifications, visual hierarchy, ergonomics,
  and formatting guidelines for the 5 mandated sections of the Student Supplies Ordering System.
---

# Interface Guidelines Skill: Student Supplies Ordering System

This skill defines the user interface (UI) and user experience (UX) layout specifications, component design standards, visual hierarchy, and formatting rules for the **Student Supplies Ordering System**.

---

## 1. Five Core Mandated Sections

Per Section III Step 1 of the specification, the application interface must be structured into five clearly defined sections:
1. **Product List Section**
2. **Shopping Cart Section**
3. **Order Summary Section**
4. **Payment Section**
5. **Receipt Section**

```
┌────────────────────────────────────────────────────────────────────────┐
│             STUDENT SUPPLIES ORDERING SYSTEM - HEADER                  │
├──────────────────────────────────────┬─────────────────────────────────┤
│                                      │                                 │
│      1. PRODUCT LIST SECTION         │    2. SHOPPING CART SECTION     │
│   ┌────────┐ ┌────────┐ ┌────────┐   │    ┌───────────────────────┐    │
│   │Ballpen │ │ Pencil │ │Notebook│   │    │ Item | Qty | Subtotal │    │
│   │ ₱12.00 │ │ ₱10.00 │ │ ₱35.00 │   │    └───────────────────────┘    │
│   │ [Add]  │ │ [Add]  │ │ [Add]  │   ├─────────────────────────────────┤
│   └────────┘ └────────┘ └────────┘   │    3. ORDER SUMMARY SECTION     │
│   ┌────────┐ ┌────────┐ ┌────────┐   │    Total Due: ₱XX.00            │
│   │Yellow P│ │ Eraser │ │ Ruler  │   ├─────────────────────────────────┤
│   │ ₱45.00 │ │  ₱8.00 │ │ ₱15.00 │   │    4. PAYMENT SECTION           │
│   │ [Add]  │ │ [Add]  │ │ [Add]  │   │    Cash Tendered: [ ₱____ ]     │
│   └────────┘ └────────┘ └────────┘   │    [ Confirm Payment ]          │
├──────────────────────────────────────┴─────────────────────────────────┤
│    5. DIGITAL RECEIPT SECTION (Active upon successful payment)         │
│    Ref #, Timestamp, Itemized breakdown, Total, Paid, Change, [New Tx] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Section-by-Section Specifications

### Section 1: Product List
- **Layout**: Clean grid (e.g., 3 columns on desktop, 2 on tablet, 1 on mobile).
- **Product Card Elements**:
  - **Visual Identifier / Icon**: High-recognition icon or image representing the supply item (e.g., 🖊️, ✏️, 📓, 📋, 🧹, 📏).
  - **Product Title**: Large, readable typography (`font-weight: 600`, minimum `1.1rem`).
  - **Price Tag**: Distinct accent badge prominently displaying the currency (e.g., `₱12.00`).
  - **Add to Cart CTA**: Full-width or prominent button with clear text (`+ Add to Cart`) and hover feedback.
- **Readability Rule**: Ensure high contrast against the card background so prices are instantly discernible by cashiers and students.

### Section 2: Shopping Cart
- **Layout**: Structured table or card list displaying active selections.
- **Line Item Row Layout**:
  - **Item Name**: Bold title.
  - **Unit Price**: Subdued text (e.g., `@ ₱12.00`).
  - **Quantity Controls**: Stepper group with `[-]` button, numeric quantity display, and `[+]` button.
  - **Line Subtotal**: Right-aligned, formatted currency (`₱XX.00`).
  - **Delete Action**: Distinct remove button (trash icon or `✕ Remove`) with red/danger hover state.
- **Empty State**: When no items have been added, display a helpful empty state illustration or callout:
  > *"Your cart is empty. Please select school supplies from the catalog."*

### Section 3: Order Summary
- **Position**: Placed immediately below or adjacent to the Shopping Cart.
- **Elements**:
  - **Item Count**: E.g., `Total Items: 4 units`.
  - **Total Amount Due**: Highlighted calculation row with prominent text (`font-size: 1.5rem; font-weight: 700; color: var(--color-primary);`).
- **Dynamic Updates**: Automatically recalculates in real-time as quantities change or items are added/removed.

### Section 4: Payment Section
- **Form Controls**:
  - **Payment Input Field**:
    - Numeric input (`type="number"`, `step="0.01"`, `min="0"`).
    - Currency prefix icon (`₱`) inside or next to the field.
    - Placeholder: `Enter cash tendered (e.g. 100.00)`.
  - **Quick Cash Preset Buttons** (Optional POS Ergonomic Enhancement):
    - `[Exact]`, `[₱50]`, `[₱100]`, `[₱500]`, `[₱1000]` buttons for rapid cashier entry.
  - **Action Button**: Prominent primary button styled with high visibility:
    - Text: **"Confirm Payment"**
    - Disabled state when cart is empty (`opacity: 0.5; cursor: not-allowed;`).
  - **Validation Alert Area**: Reserved space beneath the input for instant error alerts (prevents jarring layout shifts).

### Section 5: Receipt Section
- **Visual Design**: Styled with an authentic POS receipt aesthetic:
  - Clean card with dashed dividers (`border-bottom: 2px dashed #cbd5e1;`).
  - Monospace tabular font for numbers and line items (`font-family: var(--font-mono);`).
  - Centered store header (`CAMPUS STUDENT SUPPLIES SHOP`).
- **Structured Content**:
  - Header with Transaction Reference Number & Timestamp.
  - Itemized table: `Item`, `Qty`, `Unit Price`, `Subtotal`.
  - Financial summary:
    - `Total Amount Due:`
    - `Cash Tendered:`
    - `Change Due:` (Emphasized in green bold typography).
  - Confirmation status badge: `✅ Payment Successful`.
  - Primary Action: **"New Transaction"** button styled with a distinct accent color to initiate the next sale.

---

## 3. Formatting & Ergonomics Standards

### Currency Formatting
- Every monetary amount must be formatted as:
  $$\text{₱} + \text{Number}.toFixed(2)$$
  Examples: `₱12.00`, `₱10.00`, `₱35.00`, `₱45.00`, `₱8.00`, `₱15.00`.
- Do not omit decimals (e.g., avoid `₱12`, always display `₱12.00`).

### Interactive Element Sizes (Touch & Click Ergonomics)
- Buttons must have a minimum touch target of **44px × 44px** to ensure usability on touch monitors or tablets.
- Input fields must have a minimum height of **42px** with legible font size (`>= 16px` to prevent automatic zoom on mobile browsers).

### Typography Hierarchy
```text
Page Title (H1)        : 1.75rem / 28px - Bold (Slate-900)
Section Header (H2)    : 1.25rem / 20px - SemiBold (Slate-800)
Product Title (H3)     : 1.10rem / 17px - Medium (Slate-900)
Body & Cart Item Text  : 0.95rem / 15px - Regular (Slate-700)
Subtotal / Total Price : 1.25rem - 1.50rem - Bold (Emerald-600 / Blue-600)
Muted Labels           : 0.85rem / 13px - Regular (Slate-500)
```

---

## 4. UI State Progression Guide

1. **Initial State**:
   - Products listed with active "Add to Cart" buttons.
   - Cart displays empty state message.
   - Total Amount Due displays `₱0.00`.
   - Payment input is empty; "Confirm Payment" is disabled.
   - Receipt section is hidden.
2. **Cart Populated State**:
   - Line items render with stepper controls.
   - Total Amount Due updates reactively.
   - Payment input becomes active.
3. **Receipt Active State**:
   - Receipt renders smoothly (or modal opens).
   - "New Transaction" button is clearly visible.
   - Focus is shifted to the receipt or confirmation for accessibility.
