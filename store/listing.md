# Chrome Web Store listing

Source of truth for the store listing. The API uploads packages only, so
copy changes here into the developer dashboard by hand.

## Name

Rolestash — Job Application Tracker

## Summary (≤132 characters)

Save any job posting to a Kanban board in one click. Autofill applications, track every reply. Local-first, no AI.

## Category

Productivity → Workflow & Planning

## Language

English

## Description

Rolestash turns job postings into cards on a Kanban board, so you always know where every application stands.

CAPTURE IN ONE CLICK
• Open a job on LinkedIn, SEEK, Indeed, Glassdoor, Workday, Greenhouse, Lever or almost any careers page, then click the Rolestash icon (or press Alt+J).
• Title, company, location, salary, closing date and the full description are filled in for you. Anything uncertain is flagged so you can check it before saving.
• The same job found on two sites stays one card.

A BOARD YOU'LL ACTUALLY USE
• Drag cards through Saved → Applied → Screening → Interviewing → Offer.
• Notes, tags, priorities, closing-date warnings and a timeline of every move.
• Side panel: keep Rolestash open beside any page.
• Export to CSV or a JSON backup at any time, on every plan.

PRO: US$7/month or US$59/year, with a 30-day free trial and no card needed
• Up to 60 active jobs (Free: 15).
• Application autofill: fill Greenhouse, Lever, Ashby and most careers forms from your profile, which you can start from your résumé (PDF or Word). It never answers demographic questions and never submits for you.
• Insights: applications per week, how far applications get, reply rates, the sites that work best for you, and a chart of where your applications end up.
• Contacts, interview rounds and documents per job, and a calendar export.
• Bulk actions, follow-up reminders, closing-date alerts, custom columns, capture from a pasted link and your full history.
• Sync across up to 3 computers.

ADVANCED: US$15/month or US$159/year
• Unlimited active jobs.
• Automatic status updates: forward job emails to your private address and the board moves the card ("we'd like to interview you", "unfortunately…"), with interview times and join links on the card. Plain rules, no AI, no access to your mailbox.
• Sync across up to 5 devices, including your phone through the web board.
• Your whole board in the side panel.

PRIVATE BY DESIGN
• No AI services read your applications. Capture and email updates use plain rules.
• Rolestash reads a page only when you click it. It doesn't track the sites you visit.
• The free plan needs no account, and everything stays in your browser. Accounts and sync are optional.
• No ads, no analytics, no data selling.

Payments are handled by Paddle.com, our merchant of record. Privacy policy: https://rolestash.com/privacy/

## Single purpose

Save job postings from web pages to a personal job-application tracker, and keep that tracker up to date: filling applications from the user's own details and recording replies the user forwards.

## Permission justifications

| Permission         | Justification |
| ------------------ | ------------- |
| `activeTab`        | Reads the job posting in the current tab, and fills an application form there, only after the user clicks the toolbar button, a context-menu item or the side panel, or presses the shortcut. |
| `scripting`        | Injects the bundled extraction script (to read the job) or the bundled autofill script (to fill the form) into that one tab, on that click. No remote code. |
| `storage`          | Saves the user's jobs, settings and autofill profile locally. |
| `unlimitedStorage` | Job description snapshots can exceed the default 10 MB quota over time. |
| `contextMenus`     | "Track this job" and "Fill this application" on the page, and "Open side panel" and "Open board" on the toolbar button. |
| `alarms`           | Checks every 15 minutes for follow-up reminders and closing dates the user set, while the board is closed. |
| `sidePanel`        | Shows Rolestash docked beside the page when the user opens it. The panel has no access to page content. |
| `identity`         | Optional account sign-in with Google through `chrome.identity.launchWebAuthFlow`. Accounts are optional and used for paid plans and sync. |
| `notifications` (optional) | Asked for only when the user turns on follow-up reminders or closing-date alerts, to show them. |
| `https://*/*`, `http://*/*` (optional host permissions) | "Capture from a pasted link": when the user pastes a job link, Rolestash asks for access to **that one site** in the same click, reads that page, and removes the access straight afterwards. |

`externally_connectable`: only `https://rolestash.com/board/*`, our own web board, may message the extension, to sign the web board in with the same account. No other site can.

Host permissions granted at install: none. Content scripts: none. Remote code: none. Every script, including the PDF reader used to read a résumé on the device, is bundled in the package.

## Data usage disclosures (dashboard → Privacy)

Collected (only when the user creates an optional account):

- **Personally identifiable information:** email address, and optionally a display name and profile photo.
- **Authentication information:** sign-in session tokens. No passwords.
- **Website content:** the job postings the user saves, when they turn on sync.
- **Personal communications:** emails the user chooses to forward for automatic status updates (Advanced). They're read in memory, and only the extracted update is kept, for at most 90 days.

Not collected: health, financial or payment information (Paddle handles payments), location, web history, user activity.

Certify:

- not sold to third parties;
- not used or transferred for purposes unrelated to the single purpose;
- not used to determine creditworthiness or for lending.

Privacy policy URL: https://rolestash.com/privacy/

## Screenshots

`store/screenshots/*.png` (1280×800), in order:

1. Board: Kanban columns with fictional jobs.
2. Job details: the drawer with an interview round and a contact.
3. Insights: where applications end up.
4. Side panel beside a fictional careers page.
5. Autofill profile, started from a résumé.

Regenerate with `npm run store:screenshots` in the source repo. It writes `.output/store-screenshots/`; copy those files here.
