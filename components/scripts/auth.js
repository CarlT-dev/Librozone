import DB from '../../db.js';

const Auth = {  

    login(email, password, expectedRole = "client") {
        const user = DB.findUser(email, password);

        if (!user) {
            alert("Invalid credentials");
            console.error("No valid user");
            return null;
        }

        if (user.role !== expectedRole) {
            alert("Invalid credentials");
            console.error("Invalid user");
            return null;
        }

        const sessionData = {
            id: user.id,
            name: user.name || `${user.firstName} ${user.lastName}`,
            email: user.email,
            mobile_number: user.mobile_number,
            role: user.role,
            loggedInAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(sessionData));

        if (this.isAdmin()) {
            window.location.hash = "#admin-panel";
        } else if (this.isClient()) {
            window.location.hash = "#home";
        }

        // Tell the SPA that the state has changed so updateNav UI can run
        window.dispatchEvent(new Event("hashchange"));

        return user;
    },

    isClient() {
        const user = this.getUser();
        return user && user.role === "client";
    },

    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    },

    getUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    },

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },

    logout() {
        localStorage.removeItem('currentUser');

        if (window.location.hash === "#home") {
            window.dispatchEvent(new Event('hashchange'));
        } else {
            window.location.hash = "#home";
        }
    }

};

export default Auth;