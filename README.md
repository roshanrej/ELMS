# Employee Leave Management System (ELMS) — Frontend

Angular app for submitting and tracking employee leave requests.

## Tech Stack

- Angular 17+
- TypeScript / RxJS
- SCSS + Bootstrap, with custom design tokens

## Getting Started

```bash
npm install
ng serve
```

Runs on `http://localhost:4200/`.

## `my-leaves` module

`MyLeavesPage` renders the leave history as a fixed-layout (`table-layout: fixed`) table — column widths are set explicitly per `<th>`/`<td>` rather than left to content, since auto layout was causing misalignment between header and rows.

Row-level actions (cancel, withdraw, edit draft) route through a shared `ConfirmDialogComponent` rather than firing immediately, so destructive actions always get a confirm step before hitting the API.

Draft edit/submit relies on Angular Router state (passed via `navigateExtras.state` or similar) to avoid an extra fetch when the data's already in memory. If that state is missing — e.g. on a hard refresh or direct URL nav — the component falls back to fetching the draft by ID from the API instead of breaking.

## Known gaps / in progress

- Confirming edge cases around the fallback fetch (loading/error states while it resolves).
- Auditing other places that assume router state is present without a fallback.