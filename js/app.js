const App = {
    init: function () {
        this.updateAuthUI();
        this.router();
        this.setupGlobalEvents();
    },

    updateAuthUI: function () {
        const user = window.AppAuth.getCurrentUser();
        const logoutBtn = document.getElementById('logout-btn');
        const userDisplay = document.getElementById('user-display');

        if (user) {
            logoutBtn.classList.remove('d-none');
            userDisplay.innerText = `Hello, ${user.name}`;
        } else {
            logoutBtn.classList.add('d-none');
            userDisplay.innerText = '';
        }

        this.renderRoleBasedNav(user);
    },

    renderRoleBasedNav: function (user) {
        const navContainer = document.getElementById('nav-items');
        navContainer.innerHTML = '';

        if (!user) return;

        if (user.role === 'customer') {
            navContainer.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link active" href="#" onclick="CustomerView.render()">Menu & Order</a>
                </li>
            `;
        } else if (user.role === 'staff') {
            navContainer.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link active" href="#" onclick="StaffView.render()">Orders</a>
                </li>
            `;
        } else if (user.role === 'manager') {
            navContainer.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link active" href="#" onclick="ManagerView.render()">Dashboard</a>
                </li>
            `;
        }
    },

    router: function () {
        const user = window.AppAuth.getCurrentUser();
        const mainContent = document.getElementById('main-content');

        if (!user) {
            mainContent.innerHTML = `
                <div class="text-center mt-5 fade-in-up">
                    <h1 class="display-4 text-primary mb-3">Welcome to EasyEatify</h1>
                    <p class="lead mb-5">Select your role to continue.</p>
                    
                    <div class="d-flex justify-content-center gap-3 flex-wrap">
                        <button class="btn btn-outline-primary btn-lg shadow-sm" style="min-width: 200px;" onclick="App.openLogin('customer')">
                            Login as Customer
                        </button>
                        <button class="btn btn-outline-dark btn-lg shadow-sm" style="min-width: 200px;" onclick="App.openLogin('staff')">
                            Login as Staff
                        </button>
                        <button class="btn btn-outline-success btn-lg shadow-sm" style="min-width: 200px;" onclick="App.openLogin('manager')">
                            Login as Manager
                        </button>
                    </div>
                    
                    <div class="mt-4">
                        <p class="text-muted">Don't have an account?</p>
                        <button class="btn btn-link text-decoration-none" data-bs-toggle="modal" data-bs-target="#registerModal">
                            Register as Customer
                        </button>
                    </div>
                </div>
            `;
        } else {
            if (user.role === 'customer') {
                window.CustomerView.render();
            } else if (user.role === 'staff') {
                window.StaffView.render();
            } else if (user.role === 'manager') {
                window.ManagerView.render();
            } else {
                window.AppAuth.logout();
            }
        }
    },

    openLogin: function (role) {
        const modalEl = document.getElementById('loginModal');
        const modal = new bootstrap.Modal(modalEl);

        document.getElementById('login-role-target').value = role;
        document.getElementById('loginModalLabel').innerText = `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`;

        const helperText = document.getElementById('login-helper-text');
        if (role === 'manager') {
            helperText.innerText = "Tip: Use a name like 'Manager John'";
        } else if (role === 'staff') {
            helperText.innerText = "Tip: Use a name like 'Staff Alice'";
        } else {
            helperText.innerText = "Enter any name to continue.";
        }

        modal.show();
    },

    setupGlobalEvents: function () {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const targetRole = document.getElementById('login-role-target').value;
            let finalUsername = username;
            if (targetRole === 'manager' && !username.toLowerCase().includes('manager')) {
                finalUsername = `Manager ${username}`;
            } else if (targetRole === 'staff' && !username.toLowerCase().includes('staff')) {
                finalUsername = `Staff ${username}`;
            }

            const user = window.AppAuth.login(finalUsername, password);

            if (user) {
                const modalEl = document.getElementById('loginModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();

                App.showToast(`Welcome, ${user.name}!`, 'success');
                App.init();
            }
        });

        // Register Form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const username = document.getElementById('reg-username').value;

                // Auto login as customer
                const user = window.AppAuth.login(username, 'password');

                const modalEl = document.getElementById('registerModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();

                App.showToast('Account created! Welcome.', 'success');
                App.init();
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', function () {
            window.AppAuth.logout();
        });
    },

    showToast: function (message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast-custom toast-${type}`;
        toast.innerText = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;
