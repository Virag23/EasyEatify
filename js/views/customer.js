const CustomerView = {
    cart: [],
    currentTable: null,

    render: function () {
        const app = document.getElementById('main-content');

        // Fetch external HTML file
        fetch('views/customer.html')
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
                // Initialize component after HTML is loaded
                this.initView();
            })
            .catch(error => {
                console.error('Error loading view:', error);
                app.innerHTML = '<div class="alert alert-danger">Error loading content. Please ensure you are running on a local server (e.g., Live Server).</div>';
            });
    },

    initView: function () {
        // Inject Table Options
        const tableSelect = document.getElementById('table-select');
        if (tableSelect) {
            tableSelect.innerHTML += this.getAvailableTablesOptions();
        }

        // Render Initial Menu
        this.renderMenu();
    },

    getAvailableTablesOptions: function () {
        const tables = window.AppData.tables;
        let optionsHtml = '';

        for (let i = 0; i < tables.length; i++) {
            const t = tables[i];
            if (t.status === 'Available') {
                optionsHtml += `<option value="${t.id}">Table ${t.number} (${t.capacity} Seats)</option>`;
            }
        }
        return optionsHtml;
    },

    filterMenu: function () {
        const searchText = document.getElementById('search-input').value.toLowerCase();
        const category = document.getElementById('category-filter').value;

        this.renderMenu(searchText, category);
    },

    renderMenu: function (searchText = '', category = 'All') {
        const menuContainer = document.getElementById('menu-list');
        const menuItems = window.AppData.menu;

        if (!menuContainer) return; // Guard clause

        let htmlContent = '';

        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];

            const matchesSearch = item.name.toLowerCase().includes(searchText);
            const matchesCategory = category === 'All' || item.category === category;

            if (matchesSearch && matchesCategory) {
                htmlContent += `
                    <div class="col-md-6 mb-4 fade-in-up">
                        <div class="card h-100 card-hover">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <h5 class="card-title text-primary">${item.name}</h5>
                                    <span class="badge bg-secondary">₹${item.price}</span>
                                </div>
                                <h6 class="card-subtitle mb-2 text-muted small">${item.category}</h6>
                                <p class="card-text small text-secondary">${item.description}</p>
                                <button class="btn btn-outline-primary btn-sm w-100" onclick="CustomerView.addToCart(${item.id})">Add to Order</button>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        if (htmlContent === '') {
            menuContainer.innerHTML = '<div class="col-12 text-center text-muted">No items found.</div>';
        } else {
            menuContainer.innerHTML = htmlContent;
        }
    },

    addToCart: function (itemId) {
        const item = window.AppData.menu.find(function (i) { return i.id === itemId; });
        const existingItem = this.cart.find(function (i) { return i.itemId === itemId; });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                itemId: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            });
        }

        window.App.showToast(`Added ${item.name} to cart`);
        this.updateCartUI();
    },

    updateCartUI: function () {
        const cartContainer = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const placeOrderBtn = document.getElementById('place-order-btn');
        const bookTableBtn = document.getElementById('book-table-btn');
        const tableSelect = document.getElementById('table-select');

        if (!cartContainer) return;

        const tableSelected = tableSelect.value !== "";

        if (tableSelected) {
            bookTableBtn.disabled = false;
        } else {
            bookTableBtn.disabled = true;
        }

        if (this.cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-muted text-center small">Your cart is empty.</p>';
            totalEl.innerText = '₹0';
            placeOrderBtn.disabled = true;
            return;
        }

        let cartHtml = '';
        let total = 0;

        for (let i = 0; i < this.cart.length; i++) {
            const item = this.cart[i];
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartHtml += `
                <div class="d-flex justify-content-between align-items-center mb-2 fade-in-up">
                    <div>
                        <span class="small fw-bold">${item.name}</span>
                        <small class="text-muted">x${item.quantity}</small>
                    </div>
                    <div>
                        <span class="small">₹${itemTotal}</span>
                        <button class="btn btn-sm btn-link text-danger p-0 ms-2" onclick="CustomerView.removeFromCart(${i})">&times;</button>
                    </div>
                </div>
            `;
        }

        cartContainer.innerHTML = cartHtml;
        totalEl.innerText = `₹${total}`;

        if (tableSelected && this.cart.length > 0) {
            placeOrderBtn.disabled = false;
        } else {
            placeOrderBtn.disabled = true;
        }
    },

    removeFromCart: function (index) {
        this.cart.splice(index, 1);
        this.updateCartUI();
    },

    placeOrder: function () {
        const tableSelect = document.getElementById('table-select');
        const tableId = parseInt(tableSelect.value);

        if (!tableId) {
            window.App.showToast("Please select a table first!", "error");
            return;
        }

        let totalAmount = 0;
        for (let i = 0; i < this.cart.length; i++) {
            totalAmount += (this.cart[i].price * this.cart[i].quantity);
        }

        const order = {
            id: Date.now(),
            tableId: tableId,
            items: [...this.cart],
            status: "Ordered",
            totalAmount: totalAmount,
            timestamp: new Date().toISOString()
        };

        window.AppData.orders.push(order);

        const table = window.AppData.tables.find(t => t.id === tableId);
        table.status = "Occupied";
        table.currentOrderId = order.id;

        this.cart = [];

        window.App.showToast("Order placed successfully! Kitchen notified.", "success");
        // Re-init view to refresh tables
        this.initView();
    },

    bookTableOnly: function () {
        const tableSelect = document.getElementById('table-select');
        const tableId = parseInt(tableSelect.value);

        if (!tableId) {
            window.App.showToast("Please select a table to book.", "error");
            return;
        }

        const order = {
            id: Date.now(),
            tableId: tableId,
            items: [],
            status: "Served",
            totalAmount: 0,
            timestamp: new Date().toISOString()
        };

        window.AppData.orders.push(order);

        const table = window.AppData.tables.find(t => t.id === tableId);
        table.status = "Occupied";
        table.currentOrderId = order.id;

        window.App.showToast(`Table ${table.number} booked successfully!`, "success");
        this.initView();
    }
};

window.CustomerView = CustomerView;
