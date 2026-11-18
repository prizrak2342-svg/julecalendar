# Julekalender

A digital advent calendar for the school. Students will open available doors, view teacher-provided content, and submit answers. Administrators will manage content, review answers, and select winners.

**Status (16 November 2026):** the repository contains an Express server and a basic EJS home page. Calendar doors, accounts, answer submission, MongoDB, the administrator dashboard, and server deployment are planned and are not implemented yet.

## Technologies

| Technology | Current use |
| --- | --- |
| Node.js and npm | JavaScript runtime and dependency management |
| Express | Web server and the `/` route |
| EJS | Server-rendered home page |
| HTML and CSS | HTML template; the existing CSS file is empty |
| MongoDB | Required and planned; no driver, models, or connection yet |
| Git, GitHub, GitHub Projects | Local Git repository exists; remote repository and project setup are not verified |
| Linux and PM2 | Planned deployment environment and process management |

## Folder structure

```text
.
├── app.js                 # Express entry point; listens on port 3000
├── package.json           # Dependencies and npm scripts
├── package-lock.json      # Locked dependency versions
├── views/index.ejs        # Current home page
├── public/                # Directory served as static files
├── css/style.css          # Empty stylesheet, currently outside public/
├── fonts/                 # Empty asset directory
├── img/                   # Empty asset directory
├── js/                    # Empty client-side script directory
├── docs/                  # Project documentation
└── documents/             # Original assignment PDF and requirements placeholder
```

Empty directories may not appear in a fresh Git clone until they contain tracked files.

## Installation and local startup

Prerequisites: Git, Node.js, and npm. Express 5 requires Node.js 18 or newer; the project has not yet pinned a supported runtime version for development and deployment.

The repository URL still needs to be documented. Replace `<repository-url>` with the project's actual clone URL:

```sh
git clone <repository-url> julekalender
cd julekalender
npm ci
npm start
```

For an existing checkout, run `npm ci` and `npm start` from the project root. Open [http://localhost:3000](http://localhost:3000). Stop the process with `Ctrl+C`.

The current app always listens on port `3000`. It does not read environment variables or connect to a database, so no `.env` file is currently required. Planned `.env` and `.env.example` configuration is described in the [deployment plan](docs/deployment.md).

## Documentation

| File | Contents |
| --- | --- |
| [Project plan](docs/project-plan.md) | Goals, audience, requirements, milestones, and current status |
| [Database plan](docs/database.md) | Proposed MongoDB collections, fields, and relationships |
| [Deployment plan](docs/deployment.md) | VM sizing, network, SSH, users, permissions, and PM2 |
| [User guide](docs/user-guide.md) | Current behavior and planned student and administrator workflows |
| [Testing](docs/testing.md) | Planned checks and actual results |
| [Work log](docs/work-log.md) | Completed work, known problems, and solutions |

The [original assignment](documents/Julekalender.pdf) provides the project requirements. The documents distinguish those requirements from implementation proposals and verified repository behavior.

## Known issues and next work

- The home page is a generic placeholder and does not display a calendar.
- The template requests `/css/styles.css`, but the existing file is `css/style.css`, outside the served `public/` directory. Styles will need a matching path under `public/`.
- `npm test` is a placeholder that exits with an error; there is no automated test suite.
- Implement the calendar, database, participant identification, administrator access, submissions, and winner workflow before deployment.
- Search and filtering in the dashboard are optional later improvements.
