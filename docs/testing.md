# Testing

## Current test setup

There is no automated test suite. The `npm test` script is still the generated placeholder (`Error: no test specified`) and exits with status 1; it must not be reported as a passing test command.

## Planned checks

| ID | Area | Check and expected result |
| --- | --- | --- |
| T01 | Local startup | Run `npm ci` and `npm start`; `/` responds successfully and renders the page |
| T02 | Static assets | CSS, images, and scripts return successfully from the served directory with correct paths |
| T03 | Door availability | Test before, exactly at, and after opening time in `Europe/Oslo`; future content remains inaccessible through UI and direct requests |
| T04 | Calendar boundaries | Test before December, after the calendar ends, previous dates, year changes, and the agreed submission closing rules |
| T05 | Content | Teacher-provided text, images, video, and questions render; missing media gets clear feedback |
| T06 | Answers | Valid answers persist; empty/oversized/invalid requests are rejected; duplicate and concurrent submissions respect the agreed rule |
| T07 | Identity and authorization | Anonymous users and students cannot call administrator operations; changing submitted IDs cannot impersonate another participant |
| T08 | Administration | Content changes and correct/incorrect review decisions persist and record the responsible administrator |
| T09 | Winner selection | Only eligible correct answers can win; empty pools show clear feedback; repeated/concurrent draws cannot create duplicate winners |
| T10 | Past doors | A published winner appears on the appropriate previous date; unpublished results remain private and show a pending state |
| T11 | Database | Data survives app restart; indexes prevent invalid duplicates; outages produce controlled errors without leaking connection details |
| T12 | Accessibility and layout | Check keyboard navigation, visible focus, labels, error feedback, image descriptions, contrast, and mobile/desktop layouts |
| T13 | Input safety and privacy | Escape submitted content, restrict admin mutations, test request-forgery protection if cookie sessions are used, and avoid exposing unnecessary user data |
| T14 | Linux access | Developer and every teacher can SSH with their own keys and only the documented permissions |
| T15 | Deployment | HTTPS reaches the app; internal ports are restricted; PM2 restart and VM reboot restore service |
| T16 | Recovery and capacity | Restore a database backup and verify records; measure representative concurrent traffic and resource usage |
| T17 | User support | Student/admin instructions match the final UI and the support contact is visible |

For time-dependent checks, use controlled test times and test data; do not change production server time. Use fictional participants and teacher-approved sample content for validation.

## Actual results

The results below apply only to the local starter project checked on 16 November 2026, using Node.js v24.21.0 and installed Express 5.3.0. Planned features and server behavior have not been tested.

| Date | Check | Result | Evidence or limitation |
| --- | --- | --- | --- |
| 2026-11-16 | JavaScript syntax | Passed | `node --check app.js` exited successfully |
| 2026-11-16 | EJS rendering | Passed | Rendered `views/index.ejs` with `{ title: "Home Page" }` and checked for `<h1>Home Page</h1>` |
| 2026-11-16 | Static CSS configuration review | Issue found | Template requests `/css/styles.css`; existing file is `css/style.css`, outside the served `public/` directory |
| 2026-11-16 | Test-script review | Placeholder confirmed | `package.json` defines an intentional failing placeholder, not application tests |
| 2026-11-16 | Documentation structure | Passed | All seven requested Markdown files are populated; relative file links resolve and code fences are balanced |

Syntax and template checks do not verify an HTTP response, browser appearance, database integration, or deployment. T01–T17 remain pending execution against their implemented features; the static-path review supplies an early finding for T02.

## Recording future results

For each executed check, record the date, test ID, revision, environment/browser, input or steps, expected result, actual result, and any linked issue. Mark unexecuted tests as **Not run**, never **Passed**. After fixing a failure, retain the original finding and add a dated retest result.
