# User guide

**Current availability:** only a generic home page exists. The student and administrator workflows below describe the intended solution and will need verification against the finished interface before release.

## Trying the current version

Follow the [README startup instructions](../README.md#installation-and-local-startup) and open `http://localhost:3000`. The page displays “Home Page” and placeholder welcome text. There are currently no doors, sign-in options, answer forms, or administrator screens.

## Students: planned workflow

1. Open the school-provided calendar address. The final address is still to be confirmed.
2. Identify yourself using the school's agreed method; instructions will be added when this is implemented.
3. Select an available door. Future doors remain locked until their opening date.
4. Read or watch the teacher-provided content and complete the question or activity.
5. Submit your answer and wait for confirmation. A submission confirmation does not mean your answer has been marked correct.
6. Open a previous date to see the published winner. If the draw has not been published, the page should say that the winner is pending.

The current proposal allows one answer per person per door. Answer editing, closing times, and winner eligibility still need to be agreed and explained here before launch.

## Administrators: planned workflow

1. Sign in with an administrator account. The login address and account-provisioning procedure are not yet available.
2. Add or update the content supplied by teachers, checking the door date, question, text, image descriptions, and media links before publication.
3. Review the participant and submission lists. Mark each reviewed answer as correct or incorrect.
4. Once the participation period and eligibility checks are complete, draw a random winner from the eligible correct answers.
5. Verify and publish the winner using the agreed display-name policy. Confirm that the winner appears on the relevant past door.

Do not publish student contact information or credentials. Operator instructions for the Linux service are in the [deployment plan](deployment.md).

## Help and common problems

| Problem | What to do |
| --- | --- |
| A future door is locked | Wait until its opening date. If a current door is incorrectly locked, contact the calendar administrator. |
| An answer has no confirmation | Check the page's feedback and connection. Before retrying, check whether a submission was recorded once that feature exists. |
| No winner is displayed | The result may still be awaiting review or publication. |
| An image or video does not load | Reload the page and report the door number and a short description if it persists. |
| The site cannot be reached | Check your connection and the school's published address, then contact support. |
| The current local page has no styling | This is a known development issue documented in the work log. |

**Support contact:** to be provided by the school before launch. Until then, report project problems to the responsible teacher. Include the date/time, door number if applicable, device/browser, and the visible error message. Never send passwords or other secrets in a support report.
