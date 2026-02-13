const StaffView = {
    render: function () {
        const app = document.getElementById('main-content');

        fetch('views/staff.html')
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
                this.renderOrders();
                this.loadManualOrderOptions();
            })
            .catch(error => {
                console.error('Error loading view:', error);
                app.innerHTML = '<div class="alert alert-danger">Error loading content. Please ensure you are running on a local server.</div>';
            });
    },

    renderOrders: function () {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        const activeOrders = window.AppData.orders.filter(function (o) {
            return o.status !== 'Paid';
        });

        let rowsHtml = '';

        if (activeOrders.length === 0) {
            rowsHtml = '<tr><td colspan="6" class="text-center py-4 text-muted">No active orders. Kitchen is free!</td></tr>';
        } else {
            for (let i = 0; i < activeOrders.length; i++) {
                const order = activeOrders[i];
                const table = window.AppData.tables.find(t => t.id === order.tableId);

                let itemsSummary = '';
                if (order.items.length === 0) {
                    itemsSummary = '<span class="text-muted fst-italic">Table Only / No Food Yet</span>';
                } else {
                    itemsSummary = order.items.map(function (item) {
                        return `${item.quantity}x ${item.name}`;
                    }).join(', ');
                }

                rowsHtml += `
                    <tr class="fade-in-up">
                        <td class="ps-4 fw-bold">#${order.id}</td>
                        <td><span class="badge bg-light text-dark border">Table ${table ? table.number : '?'}</span></td>
                        <td>${itemsSummary}</td>
                        <td>₹${order.totalAmount}</td>
                        <td><span class="badge ${this.getStatusBadgeClass(order.status)}">${order.status}</span></td>
                        <td>
                            ${this.getNextActionButton(order)}
                        </td>
                    </tr>
                `;
            }
        }

        tbody.innerHTML = rowsHtml;
    },

    loadManualOrderOptions: function () {
        // Tables
        const tableSelect = document.getElementById("staff-table-select");
        tableSelect.innerHTML = '<option value="">Select Table</option>';

        AppData.tables.forEach(t => {
            tableSelect.innerHTML += `<option value="${t.id}">${t.number}</option>`;
        });

        // Foods
        const foodSelect = document.getElementById("staff-food-select");
        foodSelect.innerHTML = '<option value="">Select Food</option>';

        AppData.menu.forEach(f => {
            foodSelect.innerHTML += `<option value="${f.id}">${f.name}</option>`;
        });
        },

        addManualOrder: function () {

        const tableId = document.getElementById("staff-table-select").value;
        const foodId = document.getElementById("staff-food-select").value;

        if (!tableId || !foodId) {
            App.showToast("Select table and food", "error");
            return;
        }

        const food = AppData.menu.find(f => f.id == foodId);

        const order = {
            id: Date.now(),
            tableId: parseInt(tableId),
            items: [{
            itemId: food.id,
            name: food.name,
            price: food.price,
            quantity: 1
            }],
            status: "Cooking",
            totalAmount: food.price,
            timestamp: new Date().toISOString()
        };

        AppData.orders.push(order);

        const table = AppData.tables.find(t => t.id == tableId);
        table.status = "Occupied";
        table.currentOrderId = order.id;

        App.showToast("Order Added Successfully", "success");

        this.renderOrders();
    },

    getStatusBadgeClass: function (status) {
        if (status === 'Ordered') return 'bg-danger';
        if (status === 'Cooking') return 'bg-warning text-dark';
        if (status === 'Served') return 'bg-success';
        return 'bg-secondary';
    },

    getNextActionButton: function (order) {
        if (order.status === 'Ordered') {
            return `<button class="btn btn-sm btn-warning shadow-sm" onclick="StaffView.updateStatus(${order.id}, 'Cooking')">Start Cooking</button>`;
        } else if (order.status === 'Cooking') {
            return `<button class="btn btn-sm btn-success shadow-sm" onclick="StaffView.updateStatus(${order.id}, 'Served')">Serve Order</button>`;
        } else if (order.status === 'Served') {
            return `<span class="text-muted small">Waiting for Payment</span>`;
        } else {
            return `<button class="btn btn-sm btn-secondary" disabled>No Actions</button>`;
        }
    },

    updateStatus: function (orderId, newStatus) {
        const order = window.AppData.orders.find(function (o) { return o.id === orderId; });

        if (order) {
            order.status = newStatus;
            window.App.showToast(`Order #${orderId} marked as ${newStatus}`, "info");
            this.renderOrders();
        }
    }
};

window.StaffView = StaffView;
