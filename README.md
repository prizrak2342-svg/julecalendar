# Julekalender

A Christmas advent calendar for our school. From 1 to 24 December a new door opens every day. Behind it there is a short text, a picture or a video, and a question. Students answer, teachers check the answers, and one random winner is picked among the correct ones. When a day has passed, its door shows who won.

This is my individual school project. The full assignment is in [documents/Julekalender.pdf](documents/Julekalender.pdf).

**Where the project is now (27 November):** the website, the pages and the calendar layout are done, and the app is connected to MongoDB with users, password hashing and sessions. Opening doors, answering, logging in and the admin area are what I'm building next. See the [project plan](docs/project-plan.md) for the steps.

## What it can do

For students:

- See all 24 doors on one page, on a phone or a computer
- Open today's door and earlier doors, but not future ones *(in progress)*
- Read the text, look at the picture or video, and answer the question *(in progress)*
- See who won on past doors *(in progress)*
- Create an account *(the form is ready, saving is in progress)*

For teachers (admins), all in progress:

- See all answers and mark them correct or wrong
- See who has signed up
- Edit the content of each door
- Pick a random winner with one click
- Extra: search and filter answers

## Built with

- **Node.js** and **Express 5**: the web server
- **EJS**: HTML pages rendered on the server
- **HTML and CSS**: layout and the Christmas look
- **MongoDB** with **Mongoose**: the database
- **express-session** and **connect-mongo**: logins that are stored in the database
- **argon2**: safe password hashing
- **Git, GitHub and GitHub Projects**: code and planning
- **Linux, PM2 and nginx**: running it on the server

## How the folders are organised

```text
app.js              start of the app: routes and server
config/             database connection and session setup
models/             database models (User for now)
utils/              helpers, e.g. password hashing
scripts/            small scripts to check things
views/              EJS pages
views/partials/     header, footer and <head>, shared by every page
public/             CSS and images
docs/               documentation
documents/          the assignment PDF
.env.example        template for the settings file
```

## Getting started

You need Node.js 20.19 or newer, npm, Git and MongoDB running on your machine.

```sh
git clone https://github.com/prizrak2342-svg/julecalendar.git julekalender
cd julekalender
npm ci
cp .env.example .env
npm run dev
```

Then open <http://127.0.0.1:3000>.

`npm run dev` restarts the server every time you save a file. Use `npm start` for a normal start. `npm run check:password` is a quick test that password hashing works.

## Settings (.env)

The app reads its settings from a file called `.env`. That file is never pushed to GitHub because it holds passwords. Copy `.env.example` and fill it in:

```dotenv
NODE_ENV=development        # use "production" on the server with HTTPS
PORT=3000
HOST=127.0.0.1
MONGODB_URI=mongodb://127.0.0.1:27017/julekalender
SESSION_SECRET=...          # at least 32 random characters
```

To make a good session secret:

```sh
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

If `MONGODB_URI` or `SESSION_SECRET` is missing, the app tells you and stops.

## The database

Everything is saved in a MongoDB database called `julekalender`:

- `users`: name, e-mail, password hash and role (student or admin). *Done.*
- `sessions`: who is logged in. Cleared after 2 hours. *Done.*
- `doors`: one per day, with the date, text, media and question. *Coming.*
- `answers`: what each student answered and whether it's correct. *Coming.*
- `winners`: the winner of each door. *Coming.*

More details, including how the data moves through the app: [docs/database.md](docs/database.md).

## Putting it on a Linux server

The step-by-step guide is in [docs/deployment.md](docs/deployment.md). It covers the VM size, users and SSH keys, installing Node.js and MongoDB, folder permissions, PM2 and nginx.

To update the server after new changes:

```sh
cd /var/www/julekalender
git pull
sudo -u julekalender npm ci --omit=dev
sudo -u julekalender pm2 restart julekalender --update-env
```

## How to use it

How students and teachers use the calendar, common problems and who to contact: [docs/user-guide.md](docs/user-guide.md).

## Ideas for later

- Search and filter answers in the admin area
- Download answers and winners as a CSV file
- Simple stats: how many took part each day, how many got it right
- A countdown to the next door and some falling snow
- E-mail to the winner
- Automatic tests

## Other documents

- [Project plan](docs/project-plan.md): the steps and what is done
- [Work log](docs/work-log.md): what I did each day
- [Testing](docs/testing.md): what I tested and the results
