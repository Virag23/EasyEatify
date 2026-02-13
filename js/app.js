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
                <div>
                    <!-- Carousel -->
                    <div id="introCarousel" class="carousel slide shadow-lg mb-5" data-bs-ride="carousel">
                        <div class="carousel-indicators">
                            <button type="button" data-bs-target="#introCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#introCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#introCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div class="carousel-inner rounded-4 overflow-hidden">
                            <div class="carousel-item active">
                                <img src="bg1.png" class="d-block w-100 object-fit-cover" style="height: 500px;" alt="Restaurant Ambiance">
                                <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                                    <h3>Experience Fine Dining</h3>
                                    <p>Enjoy our premium selection of authentic dishes in a cozy atmosphere.</p>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <img src="bg2.png" class="d-block w-100 object-fit-cover" style="height: 500px;" alt="Delicious Food">
                                <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                                    <h3>Fresh & Hot</h3>
                                    <p>Our meals are prepared with the freshest ingredients just for you.</p>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <img src="bg3.png" class="d-block w-100 object-fit-cover" style="height: 500px;" alt="Fast Service">
                                <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                                    <h3>Quick & Easy Ordering</h3>
                                    <p>Order from your table or online with just a few clicks.</p>
                                </div>
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#introCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#introCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>

                    <!-- Features Section -->
                    <div class="row text-center mb-5 fade-in-up">
                        <div class="col-md-4 mb-4">
                            <div class="feature-card p-4 h-100 shadow-sm rounded-4 bg-white">
                                <div class="display-4 text-primary mb-3">📋</div>
                                <h4>Easy Ordering</h4>
                                <p class="text-muted">Browse our digital menu and place orders instantly without waiting.</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="feature-card p-4 h-100 shadow-sm rounded-4 bg-white">
                                <div class="display-4 text-success mb-3">🚀</div>
                                <h4>Fast Delivery</h4>
                                <p class="text-muted">Lightning fast service to ensure your food arrives hot and fresh.</p>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="feature-card p-4 h-100 shadow-sm rounded-4 bg-white">
                                <div class="display-4 text-warning mb-3">⭐</div>
                                5 Star Quality</h4>
                                <p class="text-muted">Top-rated chefs preparing exquisite meals for a memorable experience.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Login/Action Section -->
                    <div class="text-center bg-white p-5 rounded-4 shadow-sm fade-in-up">
                        <h2 class="mb-4 text-primary">Get Started</h2>
                        <p class="lead mb-4">Select your role to login or create a new account.</p>
                        
                        <div class="d-flex justify-content-center gap-3 flex-wrap mb-4">
                            <button class="btn btn-outline-primary btn-lg px-4" onclick="App.openLogin('customer')">
                                Login as Customer
                            </button>
                            <button class="btn btn-outline-dark btn-lg px-4" onclick="App.openLogin('staff')">
                                Staff Login
                            </button>
                            <button class="btn btn-outline-success btn-lg px-4" onclick="App.openLogin('manager')">
                                Manager Login
                            </button>
                        </div>
                        
                        <div>
                            <span class="text-muted">New here?</span>
                            <button class="btn btn-link fw-bold text-decoration-none" data-bs-toggle="modal" data-bs-target="#registerModal">
                                Create Customer Account
                            </button>
                        </div>
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
