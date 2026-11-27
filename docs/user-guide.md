# User guide

This guide is for three groups: students, teachers who run the calendar, and whoever looks after the code and the server. Things marked *(coming)* are not finished yet.

## Need help?

- **Students:** ask your teacher, or use the Kontakt page.
- **Teachers:** contact the developer: `<name, school e-mail>`.
- **Server or network problems:** the developer first, then the school IT department.

When you report a problem, tell us when it happened, which door, which device and browser you used, and what the screen said. Never send your password to anyone.

---

## For students

1. Open the calendar in your browser: `<URL>`.
2. Click **Julekalender** in the menu. You'll see 24 doors.
3. *(coming)* Go to **Profil** and create an account with your name, school e-mail and a password of at least 15 characters.
4. *(coming)* Log in and open today's door. Doors open at midnight (Norwegian time), so tomorrow's door stays locked until then.
5. *(coming)* Read the text or watch the video and answer the question. You'll see a message when your answer is saved. You can only answer each door once, so think before you send.
6. *(coming)* Open an earlier door to see who won. If it says the winner hasn't been picked yet, check back later.

The calendar works on phones, tablets and computers. You can also use it with just the keyboard: Tab moves between items, Enter opens them.

**Something wrong?**

- *The door is locked:* it opens at midnight on its date. If today's door is still locked, refresh the page and tell your teacher.
- *It says you already answered:* only one answer per door counts.
- *Forgot your password:* ask your teacher.
- *A picture or video won't load:* refresh the page. If it still doesn't work, tell your teacher which door.
- *The site won't open:* check your internet and that you're using the right address.

---

## For teachers (admins)

The admin area is still being built *(coming)*. This is how it will work:

1. Log in with your account. The developer gives your account the admin role first.
2. Click **Admin** in the menu. You'll see today's door, how many have joined and how many answers are waiting.
3. Under **Doors**, check or change the title, text, pictures, video link and question for each day. Give every picture a short description for students who use a screen reader.
4. Under **Answers**, pick a door and mark each answer as **Riktig** (correct) or **Feil** (wrong).
5. Press **Trekk vinner** to pick a winner at random among the correct answers. The result is saved and can't be drawn again.
6. Under **Participants**, see everyone who has signed up.

**Something wrong?**

- *No Admin link in the menu:* your account isn't an admin yet. Ask the developer.
- *"Ingen riktige svar" when drawing:* mark at least one answer as correct first.
- *You marked a wrong answer as correct:* change it before the draw. If the draw already happened, contact the developer.

---

## For developers and the server

- How to install and run it: [README](../README.md)
- The server, PM2, nginx and backups: [deployment.md](deployment.md)
- The database: [database.md](database.md)

**Common errors:**

- `MONGODB_URI is missing`: you have no `.env` file. Copy it from `.env.example`.
- `SESSION_SECRET is missing or too short`: put at least 32 random characters in `.env`.
- `connect ECONNREFUSED 127.0.0.1:27017`: MongoDB isn't running. Start it with `brew services start mongodb-community` on a Mac or `sudo systemctl start mongod` on Linux.
- `EADDRINUSE`: something else is using port 3000. Stop it, or change `PORT` in `.env`.
- `bad option: --env-file`: your Node.js is too old. Install version 20.19 or newer.

To make someone an admin:

```sh
mongosh julekalender --eval 'db.users.updateOne({ email: "teacher@school.no" }, { $set: { role: "admin" } })'
```
