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
    // STORAGE FUNCTIONS
    // ===============================

    const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
    const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

    const getOrders = () => JSON.parse(localStorage.getItem("orders")) || [];
    const saveOrders = (orders) => localStorage.setItem("orders", JSON.stringify(orders));

    // ===============================
    // UPDATE CART COUNTER
    // ===============================

    function updateCartCounter(animate = false) {

        if (!cartCountElement) return;

        const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = total;

        if (animate) {
            cartCountElement.classList.add("cart-bounce");
            setTimeout(() => cartCountElement.classList.remove("cart-bounce"), 400);
        }
    }

    // ===============================
    // ADD TO CART
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
            cart.push({ name, price: finalPrice, quantity: 1, addons });
        }

        saveCart(cart);
        updateCartCounter(true);
        showPopup(`${name} added to cart!`);
    }

    // ===============================
    // ADD BUTTON EVENTS
    // ===============================

    document.querySelectorAll(".add-to-cart").forEach(button => {

        button.addEventListener("click", () => {

            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            if (!name || !price) return;

            let addons = [];

            if (name === "Vanilla Dream") {
                const sauce = prompt(
                    "Choose sauce:\n1 - Chocolate (+$1)\n2 - Pistachio (+$2)\n0 - None"
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

            itemDiv.innerHTML = `
                <div class="cart-right">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input">
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

                cart[index].quantity = Math.max(1, parseInt(e.target.value));
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

    function calculateTotals() {

        const cart = getCart();

        let totalItems = 0;
        let subtotal = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        return { totalItems, subtotal, tax, total };
    }

    function updateSummary() {

        const { totalItems, subtotal, tax, total } = calculateTotals();

        if (totalItemsElement) totalItemsElement.textContent = totalItems;

        const subtotalElement = document.getElementById("subtotal-amount");
        const taxElement = document.getElementById("tax-amount");

        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
        if (taxElement) taxElement.textContent = tax.toFixed(2);
        if (totalPriceElement) totalPriceElement.textContent = total.toFixed(2);
    }

    // ===============================
    // CALCULATE BUTTON
    // ===============================

    if (calculateBtn) {
        calculateBtn.addEventListener("click", () => {

            if (getCart().length === 0) {
                showPopup("Your cart is empty.");
                return;
            }

            updateSummary();
            showPopup("Total calculated successfully!");
        });
    }

    // ===============================
    // COMPLETE ORDER
    // ===============================

    if (customerForm) {

        customerForm.addEventListener("submit", (e) => {
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

            const totals = calculateTotals();
            const orders = getOrders();

            orders.push({
                customer: { name, phone, address, instructions },
                items: cart,
                total: totals.total.toFixed(2),
                date: new Date().toLocaleString()
            });

            saveOrders(orders);
            localStorage.removeItem("cart");

            loadCart();
            updateCartCounter();

            document.querySelector(".order-layout").style.display = "none";
            document.getElementById("success-message").style.display = "flex";
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

        setTimeout(() => popup.remove(), 2000);
    }

    // ===============================
    // INIT
    // ===============================

    updateCartCounter();
    loadCart();
});
