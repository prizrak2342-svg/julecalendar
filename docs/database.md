# Database plan

**Status:** proposed MongoDB schema; no database connection, driver, collections, indexes, or models are implemented yet.

## Collections and fields

All `_id` and referenced identifiers below use MongoDB `ObjectId`. Dates use BSON Date values stored as UTC instants. The application will interpret calendar opening times in `Europe/Oslo`.

| Collection | Proposed fields | Purpose |
| --- | --- | --- |
| `users` | `_id`, `participantKey` (unique string), `displayName` (string), `role` (`student` or `admin`), `createdAt` (Date) | Identify participants and administrators. Authentication details depend on the identity method chosen before implementation. |
| `doors` | `_id`, `calendarYear` (integer), `day` (integer 1–24), `opensAt` (Date), `closesAt` (Date, optional until closing rules are agreed), `title` (string), `text` (string), `media` (array of `{type, url, altText}`), `question` (string), `published` (boolean), `createdAt`, `updatedAt` (Date) | Teacher-provided content and availability for each day |
| `answers` | `_id`, `doorId`, `userId`, `answerText` (string), `submittedAt` (Date), `reviewStatus` (`pending`, `correct`, `incorrect`), `reviewedBy` (user ID, optional), `reviewedAt` (Date, optional) | Student submissions and administrator assessment |
| `winners` | `_id`, `doorId`, `userId`, `answerId`, `selectedBy` (user ID), `selectedAt` (Date), `publishedAt` (Date, optional) | A recorded draw result and publication state |

`participantKey` represents the agreed school identity, not a secret. Do not store plaintext passwords; the authentication design must specify secure credential handling if local accounts are chosen. Public responses must expose only the fields intended for students.

## Relationships

- One user can submit answers for many doors; each answer belongs to one user and one door.
- One door can have many answers and, under the proposed rules, at most one winner.
- A winner references a correct answer and its user and door. All three references must agree.
- `reviewedBy` and `selectedBy` reference users with the administrator role.

MongoDB references do not enforce these relationships automatically. The application must validate referenced records and protect answer review and winner selection against conflicting updates. Prefer archiving doors and users with participation history to deleting referenced records.

## Proposed indexes and validation

| Collection | Index or rule | Reason |
| --- | --- | --- |
| `users` | Unique `participantKey` | Prevent duplicate identities |
| `doors` | Unique compound index on `calendarYear`, `day` | One door per day in each calendar |
| `answers` | Unique compound index on `doorId`, `userId` | Enforce the proposed one-answer-per-door rule |
| `answers` | Index on `doorId`, `reviewStatus` | Support review and eligible-answer queries |
| `winners` | Unique `doorId` | Prevent duplicate winners for a door |

Validate required fields, identifier types, day ranges, text lengths, media types and URLs, and role/status values. Determine practical text limits during implementation. Enforce publication and opening times on the server before returning content or accepting an answer; hiding a button is insufficient.

## Planned data flow

1. The calendar queries published door summaries without revealing future content.
2. Opening a door checks its availability before returning its content and any published winner.
3. Submitting an answer validates identity, availability, content, and duplicate rules before inserting the answer with `pending` status.
4. An authenticated administrator reviews the answer and records the result and reviewer.
5. A draw selects randomly from eligible correct answers for the door and saves one winner. With one answer per user, each eligible participant has one entry. Save the result once so refreshing cannot trigger another draw.
6. A past door reads the published winner's permitted display name, or reports that the winner has not yet been announced.

## Privacy and remaining work

Keep collection access restricted to the application and authorized operators. Store the MongoDB connection string outside version control. Agree with the school on identity fields, public winner names, retention, and deletion procedures before collecting student data.

Next implementation work: confirm identity and participation rules, create the schema diagram, choose a MongoDB driver or modeling library, implement validation and indexes, and test persistence, duplicates, permissions, and backup restoration. See the [test plan](testing.md).
