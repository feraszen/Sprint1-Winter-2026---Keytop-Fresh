// ===============================
// KeyTop Fresh - Main JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // ELEMENTS
    // ===============================

    const cartCountElement = document.getElementById("cart-count");
    const cartContainer = document.getElementById("cart-items");
    const totalItemsElement = document.getElementById("total-items");
    const totalPriceElement = document.getElementById("total-price");
    const customerForm = document.querySelector(".customer-form");
    const calculateBtn = document.getElementById("calculate-btn");

    // ===============================
    // STORAGE
    // ===============================

    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function getOrders() {
        return JSON.parse(localStorage.getItem("orders")) || [];
    }

    function saveOrders(orders) {
        localStorage.setItem("orders", JSON.stringify(orders));
    }

    // ===============================
    // INVOICE NUMBER GENERATOR
    // ===============================

    function getInvoiceNumber() {

        let counter = localStorage.getItem("invoiceCounter");

        if (!counter) {
            counter = 100;
        } else {
            counter = parseInt(counter) + 1;
        }

        localStorage.setItem("invoiceCounter", counter);

        return "KT" + String(counter).padStart(6, "0");
    }

    // ===============================
    // IMAGE MAPPING
    // ===============================

    function getImageName(name) {
        const images = {
            "Orange Boost": "orange-juice.jpg",
            "Mango Delight": "mango-juice.jpg",
            "Strawberry Fresh": "Strawberry-juice.jpg",
            "Watermelon Chill": "watermelon-juice.jpg",
            "Strawberry Banana Milkshake": "milkshake-cocktail-juice.jpg",
            "Kiwi Vital Smoothie": "kiwi-juice.jpg",
            "Tropical Mix": "fruit-salad.jpg",
            "Vanilla Dream": "ice-cream.jpg"
        };
        return images[name] || "orange-juice.jpg";
    }

    // ===============================
    // UPDATE CART COUNTER
    // ===============================

    function updateCartCounter(animate = false) {

        if (!cartCountElement) return;

        const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = total;

        if (animate) {
            cartCountElement.classList.add("cart-bounce");
            setTimeout(() => {
                cartCountElement.classList.remove("cart-bounce");
            }, 400);
        }
    }

    // ===============================
    // ADD TO CART WITH ADDONS
    // ===============================

    function addToCart(name, basePrice, addons = []) {

        let cart = getCart();

        const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
        const finalPrice = basePrice + addonsTotal;

        const existingItem = cart.find(item =>
            item.name === name &&
            JSON.stringify(item.addons) === JSON.stringify(addons)
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name,
                price: finalPrice,
                quantity: 1,
                addons
            });
        }

        saveCart(cart);
        updateCartCounter(true);
        showPopup(name + " added to cart!");
    }

    // ===============================
    // ADD BUTTON EVENTS
    // ===============================

    const addButtons = document.querySelectorAll(".add-to-cart");

    addButtons.forEach(button => {

        button.addEventListener("click", () => {

            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            let addons = [];

            if (name === "Vanilla Dream") {
                const sauce = prompt(
                    "Choose sauce:\n1 - Chocolate Sauce (+$1)\n2 - Pistachio Sauce (+$2)\n0 - No Sauce"
                );

                if (sauce === "1") addons.push({ name: "Chocolate Sauce", price: 1 });
                if (sauce === "2") addons.push({ name: "Pistachio Sauce", price: 2 });
            }

            if (name === "Tropical Mix") {
                const extra = prompt(
                    "Add extras?\n1 - Whipped Cream (+$1)\n2 - Extra Fruits (+$2)\n0 - None"
                );

                if (extra === "1") addons.push({ name: "Whipped Cream", price: 1 });
                if (extra === "2") addons.push({ name: "Extra Fruits", price: 2 });
            }

            addToCart(name, price, addons);
        });
    });

    // ===============================
    // LOAD CART
    // ===============================

    function loadCart() {

        if (!cartContainer) return;

        const cart = getCart();
        cartContainer.innerHTML = "";

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            updateSummary();
            return;
        }

        cart.forEach((item, index) => {

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");

            let addonsHTML = "";

            if (item.addons && item.addons.length > 0) {
                addonsHTML = `
                    <ul class="addon-list">
                        ${item.addons.map(addon => `<li>+ ${addon.name}</li>`).join("")}
                    </ul>
                `;
            }

            itemDiv.innerHTML = `
                <div class="cart-left">
                    <img src="images/${getImageName(item.name)}" alt="${item.name}">
                </div>

                <div class="cart-right">
                    <h4>${item.name}</h4>
                    ${addonsHTML}
                    <p class="item-price">$${item.price.toFixed(2)}</p>

                    <input type="number" min="1" value="${item.quantity}" 
                        data-index="${index}" class="quantity-input">

                    <button data-index="${index}" class="remove-btn">Remove</button>
                </div>
            `;

            cartContainer.appendChild(itemDiv);
        });

        attachCartEvents();
        updateSummary();
    }

    function attachCartEvents() {

        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("change", (e) => {

                const index = e.target.dataset.index;
                let cart = getCart();

                let newQuantity = parseInt(e.target.value);
                if (newQuantity < 1) newQuantity = 1;

                cart[index].quantity = newQuantity;
                saveCart(cart);

                updateCartCounter();
                updateSummary();
            });
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", (e) => {

                const index = e.target.dataset.index;
                let cart = getCart();

                cart.splice(index, 1);
                saveCart(cart);

                loadCart();
                updateCartCounter();
            });
        });
    }

    // ===============================
    // UPDATE SUMMARY
    // ===============================

    function updateSummary() {

        const cart = getCart();

        let totalItems = 0;
        let subtotal = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            subtotal += item.price * item.quantity;
        });

        const taxRate = 0.15;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        if (totalItemsElement) totalItemsElement.textContent = totalItems;

        document.getElementById("subtotal-amount").textContent = subtotal.toFixed(2);
        document.getElementById("tax-amount").textContent = tax.toFixed(2);
        totalPriceElement.textContent = total.toFixed(2);
    }


    // ===============================
    // COMPLETE ORDER + INVOICE
    // ===============================

    if (customerForm) {

        customerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const address = document.getElementById("address").value.trim();
            const instructions = document.getElementById("instructions").value.trim();

            if (!name || !phone || !address) {
                showPopup("Please fill in all required fields.");
                return;
            }

            const cart = getCart();
            if (cart.length === 0) {
                showPopup("Your cart is empty.");
                return;
            }

            const orders = getOrders();
            const invoiceNumber = getInvoiceNumber();

            // Calculate subtotal & tax again for invoice
            let subtotal = 0;

            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            const taxRate = 0.15;
            const tax = subtotal * taxRate;
            const total = subtotal + tax;

            const newOrder = {
                invoice: invoiceNumber,
                customer: { name, phone, address, instructions },
                items: cart,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2),
                date: new Date().toLocaleString()
                };

            orders.push(newOrder);
            saveOrders(orders);

            localStorage.removeItem("cart");

            document.querySelector(".order-layout").style.display = "none";

            // Generate Invoice
            const invoiceDiv = document.getElementById("invoice-content");

            let itemsHTML = "";

            newOrder.items.forEach(item => {

                let addonsText = "";

                if (item.addons && item.addons.length > 0) {
                    addonsText = " (" + item.addons.map(a => a.name).join(", ") + ")";
                }

                itemsHTML += `
                    <p>
                        ${item.quantity} x ${item.name}${addonsText}
                        - $${(item.price * item.quantity).toFixed(2)}
                    </p>
                `;
            });

            invoiceDiv.innerHTML = `
                <p><strong>Invoice Number:</strong> ${newOrder.invoice}</p>
                <p><strong>Name:</strong> ${newOrder.customer.name}</p>
                <p><strong>Phone:</strong> ${newOrder.customer.phone}</p>
                <p><strong>Address:</strong> ${newOrder.customer.address}</p>
                <hr>
                ${itemsHTML}
                <hr>
                <p>Subtotal: $${newOrder.subtotal}</p>
                <p>Tax (15%): $${newOrder.tax}</p>
                <p><strong>Total Paid: $${newOrder.total}</strong></p>
                <p><small>${newOrder.date}</small></p>
            `;

            document.getElementById("success-message").style.display = "flex";

            updateCartCounter();
            loadCart();
        });
    }

    // ===============================
    // POPUP
    // ===============================

    function showPopup(message) {

        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.textContent = message;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 2000);
    }

    // ===============================
    // INIT
    // ===============================

    updateCartCounter();
    loadCart();
});
