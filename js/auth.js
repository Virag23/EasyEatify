const Auth = {
    currentUser: null,

    login: function (username, password) {
        if (!username || !password) {
            return null;
        }

        let role = 'customer';
        const lowerName = username.toLowerCase();

        if (lowerName.includes('manager')) {
            role = 'manager';
        } else if (lowerName.includes('staff')) {
            role = 'staff';
        }

        const user = {
            id: Date.now(),
            username: username,
            name: username,
            role: role
        };

        this.currentUser = user;
        return user;
    },

    logout: function () {
        this.currentUser = null;
        window.location.reload();
    },

    getCurrentUser: function () {
        return this.currentUser;
    },

    isLoggedIn: function () {
        return this.currentUser !== null;
    }
};

window.AppAuth = Auth;
