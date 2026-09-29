# Chrome Web Store listing

Source of truth for the store listing. The API uploads packages only, so
copy changes here into the developer dashboard by hand.

## Name

Jobtrail — Job Application Tracker

## Summary (≤132 characters)

Save any job posting to a private Kanban board in one click. No AI, no accounts, no servers — your data stays in your browser.

## Category

Productivity → Workflow & Planning

## Description

Jobtrail turns job postings into cards on a Kanban board, so you always know where every application stands.

• One click to capture: open a job on LinkedIn, SEEK, Indeed, Glassdoor, Greenhouse, Lever, Workday or almost any careers page, click the Jobtrail icon, check the details, save.
• Title, company, location, salary, closing date and the full description are filled in for you. Uncertain fields are flagged so you can fix them before saving.
• Drag cards through Saved → Applied → Screening → Interviewing → Offer.
• Notes, tags, priorities, closing-date warnings and a timeline of every move.
• Duplicate detection, so the same job found on two sites stays one card.
• Export and import backups. Light and dark themes. Keyboard shortcuts (Alt+J, Alt+Shift+J, / to search, N to add).

Private by design: Jobtrail has no servers, no accounts, no analytics and no AI. It reads a page only when you click it, and everything is stored locally in your browser.

## Single purpose

Save job postings from web pages to a personal job-application Kanban board.

## Permission justifications

| Permission         | Justification |
| ------------------ | ------------- |
| `activeTab`        | Reads the job posting in the current tab, only when the user clicks the toolbar button, uses the context menu item or presses the shortcut. |
| `scripting`        | Injects the bundled extraction script into that tab to read the job details. No remote code. |
| `storage`          | Saves the user's jobs and settings locally. |
| `unlimitedStorage` | Job description snapshots can exceed the default 10 MB quota over time. |
| `contextMenus`     | Adds "Track this job in Jobtrail" to the page right-click menu and "Open Jobtrail board" to the toolbar button menu. |

Host permissions: none. Remote code: none.

## Data usage disclosures

- Collects: website content (job postings the user chooses to save), stored locally only.
- Not sold, not transferred to third parties, not used for purposes unrelated to the single purpose, not used for creditworthiness or lending.
- Privacy policy: https://github.com/SHINO-01/jobtrail-extension/blob/main/PRIVACY.md

## Screenshots

`store/screenshots/*.png` (1280×800), in order: board, job details, dark mode.
