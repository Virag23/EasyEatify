const ManagerView = {
    render: function () {
        const app = document.getElementById('main-content');

        fetch('views/manager.html')
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
                this.updateDashboardStats();
                this.renderBillingTable();
            })
            .catch(error => {
                console.error('Error loading view:', error);
                app.innerHTML = '<div class="alert alert-danger">Error loading content. Please ensure you are running on a local server.</div>';
            });
    },

    updateDashboardStats: function () {
        const revenue = this.calculateTotalRevenue();
        const activeOrdersCount = window.AppData.orders.filter(o => o.status !== 'Paid').length;
        const occupiedTablesCount = window.AppData.tables.filter(t => t.status === 'Occupied').length;

        const revEl = document.getElementById('total-revenue');
        const activeEl = document.getElementById('active-orders-count');
        const tableEl = document.getElementById('occupied-tables-count');

        if (revEl) revEl.innerText = `₹${revenue}`;
        if (activeEl) activeEl.innerText = activeOrdersCount;
        if (tableEl) tableEl.innerText = occupiedTablesCount;
    },

    calculateTotalRevenue: function () {
        const orders = window.AppData.orders;
        let total = 0;

        for (let i = 0; i < orders.length; i++) {
            if (orders[i].status === 'Paid') {
                total += orders[i].totalAmount;
            }
        }
        return total;
    },

    renderBillingTable: function () {
        const tbody = document.getElementById('billing-table-body');
        if (!tbody) return;

        const servedOrders = window.AppData.orders.filter(function (o) {
            return o.status === 'Served';
        });

        if (servedOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No pending bills.</td></tr>';
            return;
        }

        let rowsHtml = '';
        for (let i = 0; i < servedOrders.length; i++) {
            const order = servedOrders[i];
            const table = window.AppData.tables.find(t => t.id === order.tableId);

            rowsHtml += `
                <tr class="fade-in-up">
                    <td class="ps-4"><span class="badge bg-light text-dark border">Table ${table ? table.number : '?'}</span></td>
                    <td>#${order.id}</td>
                    <td>₹${order.totalAmount}</td>
                    <td><span class="badge bg-success">Served</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary shadow-sm" onclick="ManagerView.generateBill(${order.id})">Generate Bill</button>
                    </td>
                </tr>
            `;
        }

        tbody.innerHTML = rowsHtml;
    },

    generateBill: function (orderId) {
        const order = window.AppData.orders.find(o => o.id === orderId);
        if (!order) return;

        const subtotal = order.totalAmount;
        const tax = Math.round(subtotal * 0.05);
        const grandTotal = subtotal + tax;

        let itemsHtml = '';
        if (order.items.length === 0) {
            itemsHtml = '<li class="list-group-item text-muted fst-italic">Table Booking Only (No Food)</li>';
        } else {
            itemsHtml = order.items.map(function (item) {
                return `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${item.name} <small class="text-muted">x${item.quantity}</small></span>
                        <span>₹${item.price * item.quantity}</span>
                    </li>
                `;
            }).join('');
        }

        const modalHtml = `
            <div class="modal fade" id="billModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content shadow-lg border-0">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Invoice #${order.id}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h6 class="text-muted mb-2">Order Details:</h6>
                            <ul class="list-group mb-3 list-group-flush border rounded">
                                ${itemsHtml}
                            </ul>
                            
                            <div class="px-2">
                                <div class="d-flex justify-content-between mb-1">
                                    <span class="text-muted">Subtotal:</span>
                                    <span>₹${subtotal}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Tax (5%):</span>
                                    <span>₹${tax}</span>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h5 mb-0">Grand Total:</span>
                                    <span class="h4 mb-0 text-success fw-bold">₹${grandTotal}</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-light">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" onclick="ManagerView.processPayment(${order.id})">
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('bill-modal-container');
        container.innerHTML = modalHtml;

        const billModal = new bootstrap.Modal(document.getElementById('billModal'));
        billModal.show();
    },

    processPayment: function (orderId) {
        const order = window.AppData.orders.find(o => o.id === orderId);

        if (order) {
            order.status = 'Paid';

            const table = window.AppData.tables.find(t => t.id === order.tableId);
            if (table) {
                table.status = 'Available';
                table.currentOrderId = null;
            }

            const modalEl = document.getElementById('billModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            window.App.showToast('Payment received! Table marked as Available.', 'success');

            // Refresh
            this.updateDashboardStats();
            this.renderBillingTable();
        }
    }
};

window.ManagerView = ManagerView;
