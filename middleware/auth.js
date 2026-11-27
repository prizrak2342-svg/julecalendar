const User = require("../models/user");

// Middleware = a function that runs BEFORE the route.
// It gets (req, res, next) and either answers itself, or calls next() to pass the request on.

// Runs on every page: if someone is logged in, load them from the database
// so every page (for example the header) can show their name and coins.
async function loadUser(req, res, next) {
    req.user = null;
    res.locals.currentUser = null; // res.locals = variables that every EJS view can read

    if (req.session.userId) {
        const user = await User.findById(req.session.userId)
            .select("name role coins openedGifts")
            .lean(); // lean() = plain JS object, faster when we only read

        if (user) {
            req.user = user;
            res.locals.currentUser = user;
        }
    }

    next();
}

// Use on pages that need a logged-in user
function requireLogin(req, res, next) {
    if (!req.user) {
        return res.redirect("/login");
    }
    next();
}

// Use on admin pages
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.redirect("/login");
    }
    if (req.user.role !== "admin") {
        return res.status(403).render("not-found", { title: "Ingen tilgang", activePage: "" });
    }
    next();
}

module.exports = { loadUser, requireLogin, requireAdmin };
