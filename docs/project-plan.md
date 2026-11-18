# Project plan

Last updated: 16 November 2026.

## Goal and audience

Build a digital school advent calendar that students can use on phones and computers. Teachers supply text, images, videos, questions, and activities. The project covers the technical presentation, answer handling, administration, and operation of that content.

Students need clear door availability and submission feedback. Teachers and administrators need content management, participant and answer overviews, answer assessment, and winner selection. Operators need repeatable installation, access, deployment, and troubleshooting documentation.

## Requirements

The following requirements come from the [assignment](../documents/Julekalender.pdf); they describe the target solution, not completed features.

| Area | Acceptance criteria | Status |
| --- | --- | --- |
| Calendar | Show doors; prevent opening future doors, including through direct requests | Planned |
| Door content | Display teacher-provided text, images, video, and questions or activities | Planned |
| Participation | Accept and validate answers, save them in MongoDB, and show clear feedback | Planned |
| Past doors | Show the winner's name when opening a previous date; show a clear pending state until a winner exists | Planned |
| Administration | Show participants and submissions; mark answers correct or incorrect; manage content | Planned |
| Winners | Randomly select a winner from eligible participants with correct answers | Planned |
| Usability | Provide a festive, responsive interface with accessible navigation, contrast, labels, and feedback | Planned |
| Database | Use MongoDB and explain data storage and retrieval; create a model diagram using the assignment's suggested modeling tool | Plan documented; implementation pending |
| Operation | Deploy on Linux with PM2, MongoDB configuration, `.env` and `.env.example` | Planned |
| VM access | Document sizing, network configuration, users, roles, permissions, and SSH access for the student developer and all teachers | Plan documented; configuration pending |
| Collaboration workflow | Use a public repository, descriptive commits, issues, branches, pull requests, and a project board | Local repository present; remaining setup unverified |
| Documentation | Provide installation, deployment, user support, test results, work log, and the final reflection note | Documentation started; reflection pending |
| Optional features | Search and filter submitted answers; other justified dashboard improvements | Backlog |

## Proposed decisions to confirm before implementation

- Use 24 doors for the selected December calendar year. Store explicit opening timestamps and apply the school's `Europe/Oslo` timezone when calculating them.
- Identify participants consistently and allow one answer per participant per door. Confirm whether answers may be edited and when participation closes.
- Decide how students identify themselves and how administrator accounts are authenticated and provisioned.
- Agree on winner eligibility, when winners become public, and which display names may be published.
- Confirm the content delivery format, support contact, retention period, deployment address, and submission deadline with the school.

These are design proposals or unresolved choices, not extra requirements claimed from the assignment.

## Milestones

No delivery dates have been confirmed. Complete the milestones in this order and update the project board as work progresses.

| Milestone | Completion evidence | Status |
| --- | --- | --- |
| 1. Foundation and planning | Basic server, documentation structure, requirements and database plan | In progress |
| 2. Calendar interface | Responsive door overview and server-side date restrictions | Not started |
| 3. Database and participation | Persistent doors, participants, validated submissions, identity rules | Not started |
| 4. Administration | Protected content management, answer review, and winner selection | Not started |
| 5. Linux deployment | Documented VM, SSH access, environment, PM2 restart and reboot checks | Not started |
| 6. Verification and handover | Recorded functional/accessibility/operational tests, final user guide, reflection | Not started |

## Current status and work tracking

The app renders `views/index.ejs` at `/` and listens on port 3000. Only Express and EJS are declared application dependencies. There are no database models, authentication routes, calendar features, or administrator screens.

Use project-board columns such as **Backlog**, **In progress**, **Review**, and **Done**. Create issues from the acceptance criteria above and link branches and pull requests to them. Add the actual repository and project-board URLs here after setup; neither has been verified during this documentation update.

Record evidence in [testing](testing.md) and dated progress in the [work log](work-log.md). Main dependencies are teacher-supplied content, the school network/VM allocation, and the participant and winner rules.
