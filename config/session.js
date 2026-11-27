const session = require('express-session');
const {MongoStore} = require ("connect-mongo");

const secret = process.env.SESSION_SECRET;

if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short. It should be at least 32 characters long.");
}

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
}

const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
});

store.on("error", (error) => {
    console.error("session store error", error.name);
})

const sessionMiddleware = session ({
    name: "julekalendar.sid",
    secret,
    store,
    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 2
    }
})

module.exports = sessionMiddleware;

