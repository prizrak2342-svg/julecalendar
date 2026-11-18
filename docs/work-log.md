# Work log

Record completed work and observed problems. Keep planned tasks in the [project plan](project-plan.md); do not describe them as completed here.

## 16 November 2026 — Repository review and documentation

### Existing work observed

- The project contains an Express application in `app.js`, an EJS home-page template, and an npm startup command.
- Dependencies and a lockfile are present. The application listens on port 3000 and serves static assets from `public/`.
- A local Git repository exists. At review time, project files were untracked; no remote repository, commit workflow, or GitHub Project was verified.
- The original assignment is available in `documents/Julekalender.pdf`. The previous Markdown documentation files were empty.

These observations describe the state found during this review; the original implementation dates are unknown.

### Work completed in this update

- Read the assignment as requirements reference and inspected the current source files.
- Renamed `README.MD` to `README.md` and moved the empty documentation placeholders into the requested `docs/` structure.
- Wrote the README, project plan, database plan, deployment plan, user guide, test plan/results, and this work log.
- Added explicit status labels to distinguish implemented behavior, assignment requirements, and proposed design choices.
- Preserved the original PDF and `documents/requoires` placeholder in `documents/`.
- Checked JavaScript syntax and rendered the EJS template successfully. Detailed evidence and limitations are in [testing](testing.md).

### Problems and solutions

| Problem | Action or proposed solution | Status |
| --- | --- | --- |
| Documentation files were empty and used inconsistent names | Created the requested lowercase filenames and linked the documents from the README | Resolved |
| Stylesheet URL does not match an accessible file | Proposed fix: place the stylesheet under `public/css/` and match the template URL and filename | Open; application files were not changed |
| `npm test` is a failing placeholder | Documented the limitation; add meaningful tests as features are implemented | Open |
| No database or environment loading exists | Documented the proposed schema and deployment configuration | Implementation pending |
| Participant identity, closing rules, support contact, and infrastructure details are unknown | Listed them as decisions and fields to complete before release | Pending |

### Next work

Implement the calendar and its date restrictions, resolve the static asset path, confirm participant rules, and connect MongoDB. Then implement protected administration, deploy to the assigned VM, and record actual user and operational test results.

## Entry template

For each future work session, add the date, completed changes, problems encountered, the solution attempted and its outcome, verification performed, and any remaining tasks. Link relevant issues or commits once those are available.
