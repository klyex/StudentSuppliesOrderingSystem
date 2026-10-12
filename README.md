# Student Supplies Ordering System

**Course:** IT415 Midterm Practical Examination  
**System:** Student Supplies Ordering System  
**Target Environment:** Desktop-friendly & Browser-based (Mouse and Keyboard)

---

## 📌 Project Description
The **Student Supplies Ordering System** is a streamlined, client-side Point of Sale (POS) application created for a small school supplies shop near the campus. It enables students and cashiers to browse items, manage shopping carts, calculate subtotals and totals in real time, enter cash payments with strict validation, compute change, and issue digital receipts.

---

## 📦 School Supplies Product Catalog & Pricing

| Item No. | Product Name | Unit Price (PHP) |
| :---: | :--- | :---: |
| 1 | **Ballpen** | ₱12.00 |
| 2 | **Pencil** | ₱10.00 |
| 3 | **Notebook** | ₱35.00 |
| 4 | **Yellow Pad** | ₱45.00 |
| 5 | **Eraser** | ₱8.00 |
| 6 | **Ruler** | ₱15.00 |

*Note: All product data is stored locally in memory using immutable structures; no database or user authentication is required.*

---

## 🖥️ User Interface Sections (5 Core Modules)
1. **Product List Section**: Displays all 6 products with readable names, prices, and "Add to Cart" buttons.
2. **Shopping Cart Section**: Displays active cart items, itemized quantities, and controls.
3. **Order Summary Section**: Real-time counter of total items and total amount due.
4. **Payment Section**: Numeric cash input, validation checks, and payment confirmation.
5. **Receipt Section**: Formatted digital receipt with transaction reference number, timestamps, item breakdown, and a "New Transaction" reset button.

---

## 🚀 How to Run the Application
1. Clone or download the repository to your local machine.
2. Navigate to the project root folder:
   ```bash
   cd StudentSuppliesOrderingSystem
   ```
3. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox) by double-clicking the file or serving it locally:
   ```bash
   # Optional: Using Python HTTP server
   python -m http.server 3000
   ```
4. Access the application at `http://localhost:3000` (or `file:///.../index.html`).

---

## 📅 Incremental Development Stages

- [x] **Stage 1: Project Setup and Basic Interface**
  - Configured project directory with `index.html`, `styles.css`, and `app.js`.
  - Built the 5 mandated interface sections.
  - Implemented the product catalog with all 6 school supplies and formatted prices (₱).
  - Configured responsive desktop-friendly layout with accessible button targets.
- [ ] **Stage 2: Shopping Cart and Computations**
  - Implement dynamic item addition, quantity stepper controls (`+` / `-`), and line item removal.
  - Real-time recalculation of subtotals (`Unit Price × Quantity`) and total amount due.
- [ ] **Stage 3: Payment Validation, Digital Receipt & Final Improvements**
  - Implement cash payment input validation (empty, invalid, negative, insufficient).
  - Automatic change calculation (`Amount Paid - Total Amount`).
  - Digital receipt generation and "New Transaction" reset.
