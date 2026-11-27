# Database

All data lives in one MongoDB database called `julekalender`. The app connects to it using `MONGODB_URI` from `.env` (see [config/database.js](../config/database.js)). I use Mongoose to describe what each document should look like and to check the data before it's saved.

Right now `users` and `sessions` exist. `doors`, `answers` and `winners` are next.

## How it fits together

```text
users ──< answers >── doors
  │          │          │
  │          └── winners ┘
  └──< sessions
```

- One student can answer many doors, but each door only once.
- One door gets many answers, but only one winner.
- A winner always points back to a correct answer, and to the student and door it belongs to.

The diagram from mongomodeler.com will be added here as `database-schema.png`.

## The collections

### users (done)

Defined in [models/user.js](../models/user.js).

- `name`: 2–80 characters. This is the name shown if you win.
- `email`: unique, saved in lowercase. Never shown to other students.
- `passwordHash`: the argon2id hash. The real password is never stored, and the hash isn't even loaded unless the code asks for it.
- `role`: `student` (default) or `admin`.
- `createdAt` and `updatedAt`: filled in automatically.

### sessions (done)

Handled by connect-mongo ([config/session.js](../config/session.js)). It remembers who is logged in. A session ends after 2 hours and MongoDB deletes it by itself.

### doors (coming)

- `year` and `day` (1–24). There can only be one door per day.
- `opensAt`: midnight Norwegian time on that day, saved in UTC.
- `title`, `text` and `question`.
- `media`: a list of pictures and videos, each with a link and a description (`alt`) for pictures.
- `correctAnswer`: a note for teachers. Never sent to students.
- `published`: only published doors are shown.

### answers (coming)

- `door` and `user`: which door and which student. Only one answer per pair.
- `text`: the answer, up to 1000 characters.
- `status`: `pending`, `correct` or `wrong`. Starts as `pending`.
- `reviewedBy`: which teacher checked it.

### winners (coming)

- `door`: only one winner per door.
- `user` and `answer`: who won, and with which answer.
- `drawnBy` and `drawnAt`: which teacher pressed the button, and when.

## Indexes

Indexes make lookups fast and stop bad data:

- `users.email` is unique, so one account per e-mail. *(done)*
- `doors.year + day` is unique, so one door per day.
- `answers.door + user` is unique, so a double click can't save two answers.
- `answers.door + status` makes it fast to find the correct answers for the draw.
- `winners.door` is unique, so there's never more than one winner.

## What happens step by step

1. **Calendar page:** the server loads the doors and decides for each one whether it's locked, open today or in the past. Locked doors are sent without their content, so you can't peek in the page source.
2. **Opening a door** (`/calendar/5`): the server checks the time again. Typing the address for a future door just shows "not open yet".
3. **Answering:** the server checks that you're logged in, the door is open and the answer isn't empty or too long. Then it saves the answer as `pending`.
4. **Checking:** a teacher marks each answer `correct` or `wrong`.
5. **Draw:** the server picks one random correct answer (with MongoDB's `$sample`) and saves it as the winner. If a winner already exists, nothing changes.
6. **Past doors** show the winner's name, or a note that the winner hasn't been picked yet.

## Personal data

- Saved about each student: name, e-mail and their answers. Passwords only as hashes.
- Only the winner's name is public. E-mail addresses are only visible to admins.
- On the server MongoDB only listens on `127.0.0.1` and needs a password.
- When the calendar is over (January 2027), users and answers should be deleted, or exported if the school wants to keep them.
