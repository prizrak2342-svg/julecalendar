const express = require('express');
const path = require('node:path');
const connectToDatabase = require('./config/database');
const User = require('./models/user');
const app = express();
const sessionMiddleware = require("./config/session");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionMiddleware); // Sessions are stored in MongoDB (collection "sessions")

app.get("/", (req,res) => {
    res.render("index", { title: "Hjem", activePage: "home" });
});

app.get("/calendar", (req, res) => {
    res.render("calendar", { title: "Julekalender", activePage: "calendar" });
});

app.get("/about", (req, res) => {
    res.render("about", { title: "Om oss", activePage: "about" });
});

app.get("/contact", (req, res) => {
    res.render("contact", { title: "Kontakt", activePage: "contact" });
});

app.get("/service", (req, res) => {
    res.render("service", { title: "Opprett konto", activePage: "service" });
});

app.get("/register", (req, res) => {
    res.render("service", {
        title: "Opprett konto",
        activePage: "register"
    });
});

// Keep old bookmarks working; navigation uses the routes without .ejs.
const legacyPages = { index: "/", calendar: "/calendar", about: "/about", contact: "/contact", service: "/service" };
for (const [page, destination] of Object.entries(legacyPages)) {
    app.get(`/${page}.ejs`, (req, res) => res.redirect(302, destination));
}

if (process.env.NODE_ENV === "development") {   
    app.get("/session-check", (req,res, next) => {
        req.session.visits =(req.session.visits || 0) +1;

        req.session.save((error) => {
            if (error) {
                return next (error);
            }

            res.set("Cache-Control", "no-store");
            res.json({visits: req.session.visits});
        });
    });
}

app.use((req, res) => {
    res.status(404).render("not-found", { title: "Siden finnes ikke", activePage: "" });
});

async function startServer() {
    await connectToDatabase();
    await User.init(); // Ensure indexes are created before starting the server

    console.log("user model and indexes initialized.");
    
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || "127.0.0.1";

    app.listen(port, host, () => {
        console.log(`server: http://${host}:${port}`);
    });
}

if (require.main === module) {
    startServer().catch(error => {
        console.log("Application startup failed:", error.message);
        process.exit(1);
    });
}
  

module.exports = app;
