const express = require("express");
const User = require("../models/user");
const { hashPassword, verifyPassword } = require("../utils/password");

// A Router is a mini-app: we collect all login routes here and plug them into app.js
const router = express.Router();

// After a successful login we give the user a NEW session id.
// Otherwise an attacker who knew the old id could take over the logged-in session ("session fixation").
function startSession(req, userId) {
    return new Promise((resolve, reject) => {
        req.session.regenerate((error) => {
            if (error) return reject(error);

            req.session.userId = userId.toString();
            req.session.save((saveError) => (saveError ? reject(saveError) : resolve()));
        });
    });
}

// ---------- Register ----------

router.get("/register", (req, res) => {
    res.render("register", { title: "Opprett konto", activePage: "register", error: null, values: {} });
});

router.post("/register", async (req, res) => {
    // req.body holds the form fields (name="..." in the HTML).
    // String(...) protects us if someone sends something that is not text.
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const confirmPassword = String(req.body.confirmPassword || "");

    // Show the form again with an error, and keep what the user typed (never the password)
    const showError = (error) =>
        res.status(400).render("register", {
            title: "Opprett konto",
            activePage: "register",
            error,
            values: { name, email }
        });

    // The browser checks this too, but anyone can skip the browser, so the server must check again
    if (password.length < 15 || password.length > 128) {
        return showError("Passordet må være mellom 15 og 128 tegn.");
    }
    if (password !== confirmPassword) {
        return showError("Passordene er ikke like.");
    }

    try {
        const passwordHash = await hashPassword(password);
        const user = await User.create({ name, email, passwordHash });

        await startSession(req, user._id);
        res.redirect("/calendar");
    } catch (error) {
        if (error.code === 11000) {
            // 11000 = MongoDB "duplicate key": the unique e-mail index said no
            return showError("Denne e-posten er allerede registrert.");
        }
        if (error.name === "ValidationError") {
            // The User model rules (name length, e-mail format) said no
            return showError("Sjekk navn og e-post.");
        }
        throw error; // unexpected error: let Express show the error page
    }
});

// ---------- Log in ----------

router.get("/login", (req, res) => {
    res.render("login", { title: "Logg inn", activePage: "login", error: null, values: {} });
});

router.post("/login", async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    // passwordHash has select: false in the model, so we must ask for it with "+"
    const user = await User.findOne({ email }).select("+passwordHash");
    const passwordOk = user ? await verifyPassword(user.passwordHash, password) : false;

    if (!passwordOk) {
        // Same message for "no such e-mail" and "wrong password",
        // so nobody can use the form to find out who has an account
        return res.status(401).render("login", {
            title: "Logg inn",
            activePage: "login",
            error: "Feil e-post eller passord.",
            values: { email }
        });
    }

    await startSession(req, user._id);
    res.redirect("/calendar");
});

// ---------- Log out ----------

// POST, not GET: a GET link could be triggered by another site just by loading an image
router.post("/logout", (req, res, next) => {
    req.session.destroy((error) => {
        if (error) return next(error);
        res.clearCookie("julekalendar.sid");
        res.redirect("/");
    });
});

module.exports = router;
