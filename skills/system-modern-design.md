---
name: system-modern-design
description: >-
  Modern architectural patterns, clean code design, modular state management,
  responsive UI layout, design tokens, and accessibility principles for the Student Supplies Ordering System.
---

# System Modern Design Skill: Student Supplies Ordering System

This skill outlines the architectural standards, code modularity patterns, modern UI/UX design systems, and responsive layout guidelines for the **Student Supplies Ordering System**. It ensures the codebase remains maintainable, scalable, accessible, and visually contemporary while adhering to the examination requirement of clean, functioning software.

---

## 1. Architectural Pattern: Modular Component-Store Architecture

To avoid monolithic "spaghetti" scripts, the application must follow a clean **Separation of Concerns (SoC)** separating State (Data Store), Logic (Actions & Calculators), and Presentation (DOM Renderer).

```
┌────────────────────────────────────────────────────────┐
│                      State Store                       │
│  (Catalog, Cart Items, Active Payment, Receipt State)  │
└──────────────────────────▲─────────────────────────────┘
                           │ Dispatches State Changes
┌──────────────────────────┴─────────────────────────────┐
│                 Controller / Business Logic            │
│ (Cart Operations, Financial Math, Payment Validation)   │
└──────────────────────────▲─────────────────────────────┘
                           │ Listens to DOM Events
┌──────────────────────────┴─────────────────────────────┐
│                  Presentation Layer (View)             │
│ (Product Cards, Cart Table, Summary, Payment, Receipt) │
└────────────────────────────────────────────────────────┘
```

### Key Architectural Guidelines
- **Unidirectional Data Flow**: User interactions trigger controller functions $\rightarrow$ controller validates & updates state store $\rightarrow$ state store triggers view re-renders.
- **Pure Computation Helpers**: Keep arithmetic functions (`calculateSubtotal`, `calculateTotal`, `calculateChange`) pure with zero DOM side effects.
- **Single Source of Truth**: The active cart state is held in an array of objects `{ productId, quantity }`. All subtotals and totals are derived dynamically on change.

---

## 2. Modern Design System & Tokenization

Use modern CSS Custom Properties (Design Tokens) to create a clean, professional aesthetic tailored to a modern student bookstore/stationery shop.

### Design Tokens (CSS Variables)
```css
:root {
  /* Color Palette - Modern Slate & Indigo/Emerald Accent */
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-hover: #f1f5f9;
  --color-border: #e2e8f0;
  
  --color-text-main: #0f172a;
  --color-text-muted: #64748b;
  --color-text-inverted: #ffffff;
  
  --color-primary: #3b82f6;        /* Modern Blue */
  --color-primary-hover: #2563eb;
  --color-success: #10b981;        /* Emerald for Receipts & Confirmations */
  --color-success-hover: #059669;
  --color-danger: #ef4444;         /* Red for Errors & Deletions */
  --color-danger-hover: #dc2626;
  --color-accent: #f59e0b;         /* Amber for badges/highlights */

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

  /* Elevation & Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
}
```

---

## 3. Responsive Layout Strategy

A modern desktop-friendly Point of Sale (POS) layout uses a multi-pane grid that gracefully collapses on smaller devices.

### Grid Composition
- **Desktop (>= 1024px)**: 
  - **Left / Main Column (60-65% width)**: Product Catalog Grid (3 columns of cards).
  - **Right Sidebar (35-40% width)**: Sticky panel housing the Shopping Cart, Order Summary, and Cash Payment Section.
  - **Overlay / Modal or Slide-over**: Digital Receipt presentation with print/download actions.
- **Tablet (768px - 1023px)**: 2-column catalog with cart stacked below or in a 50/50 split.
- **Mobile (< 768px)**: Single-column linear flow with sticky bottom action bar.

```css
.app-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .app-container {
    grid-template-columns: 1.4fr 1fr;
    align-items: start;
  }
}
```

---

## 4. Modern UX & Micro-Interactions

A modern user experience minimizes cognitive friction and provides immediate, reassuring feedback:
1. **Interactive Product Cards**:
   - Subtle hover elevation (`transform: translateY(-2px); box-shadow: var(--shadow-md);`).
   - Prominent badge displaying the unit price in Philippine Peso (`₱XX.00`).
   - Tactile "Add to Cart" button with active depression feedback.
2. **Smooth Quantity Controls**:
   - Stepper design: `[-]` Button, `Number Display`, `[+]` Button grouped closely together.
   - Disabled states for invalid actions.
   - Visual cue when quantity changes.
3. **Sticky Order Summary & Payment Box**:
   - High-contrast calculation rows with clear typography hierarchy:
     - Subtotal $\rightarrow$ Standard weight.
     - Total Due $\rightarrow$ Large bold typography with primary brand accent.
4. **Receipt Visual Metaphor**:
   - Styled as an authentic thermal receipt (clean off-white background, dashed dividing lines, monospaced tabular numbers, clean padding).

---

## 5. Accessibility (a11y) & Usability Standards

- **Color Contrast**: All text must achieve at least a **4.5:1** contrast ratio against backgrounds (WCAG 2.1 AA).
- **Keyboard Navigation**:
  - All interactive elements must be focusable via `Tab`.
  - Visible focus indicators (`outline: 2px solid var(--color-primary); outline-offset: 2px;`).
- **Semantic HTML**:
  - Use `<header>`, `<main>`, `<section>`, `<article>`, `<button>`, `<input>`, and `<table>` / `<dl>`.
  - Label all form inputs with explicit `<label for="...">`.
- **Aria Live Regions**:
  - Use `aria-live="polite"` on the Cart Total and Error Notification areas so screen readers immediately announce updates.

---

## 6. Code Cleanliness & Best Practices

- **Descriptive Naming**: Use clear verbs for actions (`handleAddToCart`, `renderReceipt`, `validatePaymentInput`).
- **DRY (Don't Repeat Yourself)**: Centralize currency formatting into a reusable helper:
  ```javascript
  const formatCurrency = (amount) => `₱${Number(amount).toFixed(2)}`;
  ```
- **State Immutability**: Return new array/object instances during state updates rather than mutating variables in-place:
  ```javascript
  // Good: functional update
  const updatedCart = cart.map(item =>
    item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
  );
  ```
