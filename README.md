<!--============================
# Sprint - KeyTop Fresh
# Author: Feras Zen , Darrell Declaro , Sam Higdon and Logan Marsh .
# Date: Feb, 2026
# ============================-->

# KeyTop Fresh

KeyTop Fresh is a responsive multi-page website for a fresh juice, fruit salad, and ice cream shop.  
This project was developed as part of Sprint 1 and follows all academic requirements including semantic HTML, DOM manipulation, localStorage usage, and responsive design principles.

---

## 📌 Project Overview

KeyTop Fresh allows customers to:

- Browse categorized menu items
- Add products to a shopping cart
- Modify quantities
- Remove items
- Calculate total order cost
- Submit an order with form validation
- View rotating customer reviews

The project demonstrates clean structure, modular JavaScript, and proper separation of concerns.

---

## 🚀 Features Implemented

### ✅ Multi-Page Structure
- Home Page
- Menu Page
- Order Page
- About Page

### ✅ Semantic HTML
Proper use of:
- `<header>`
- `<nav>`
- `<main>`
- `<section>`
- `<article>`
- `<footer>`

### ✅ DOM Manipulation
- Dynamic cart counter update
- Product addition to cart
- Order summary rendering
- Quantity updates
- Item removal
- Total calculation
- Popup confirmation message
- Auto-rotating reviews carousel

### ✅ localStorage Integration
Cart items are stored as an array of objects:
```json
[
  {
    "name": "Orange Boost",
    "price": 5,
    "quantity": 2
  }
]