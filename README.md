# Kingsperl Events

The event-company website at https://www.kingsperl.com, migrated from the Kingsperl Events Site. It replaces the former wedding website in this repository.

## Development

Requires Node.js 24. Run `npm ci`, `npm run dev`, `npm test`, and `npm run build`.

## Production

Vercel project: `kq-invite` in `emmanueloks-projects`. The production branch is `main`. Vercel uses `npm ci` and `npm run build:vercel`. Both `kingsperl.com` and `www.kingsperl.com` remain attached to that project.

The complete event website includes the home experience, Event World catalogue, Design Studio, secure project resume links, change requests, consultation inquiries, privacy, terms, social images, and search metadata.

## Existing event records

The existing event Site at https://st-johns-event-decor.elkings.chatgpt.site retains its Cloudflare D1 database and private staff operations workspace. Public customer APIs pass through narrowly scoped server routes in this app. Set `KINGSPERL_BACKEND_TOKEN` as a server-only production environment variable in Vercel. The credential is never forwarded to the browser. Visitor cookies and identity headers are not trusted or forwarded.

`/operations` opens the original workspace, which retains ChatGPT sign-in and the Kingsperl Events staff allowlist. Staff listing, inventory availability, and inventory holds cannot be called through the public gateway. This migration does not move or erase stored event records.

Old wedding pages and assets are absent from the current source tree. Prior versions remain available in Git history.

## Brand and app

Kingsperl Events uses an outlined vector wordmark, an architectural K and pearl monogram, and a cinematic Open Graph card. Logos are in `public/brand/`; the social image is `public/og/kingsperl-events.jpg`. The PWA provides home-screen icons, `/install`, app shortcuts, and a public-content offline fallback. The service worker never caches APIs, staff operations, project tokens, or private studio pages.

## Customer planning workspace

`/my-event` recovers the current device's essential event draft, keeps a personal preparation checklist, exports a tentative calendar reminder and opens saved projects through validated private links. Local drafts exclude contact information, personal notes, attachments and project access keys. Visitors can remove a local draft and undo that removal without deleting a submitted project.

The Design Studio saves essential progress locally, preserves the existing authenticated customer API, and prints a complete planning summary. Public copy clearly separates estimates and personal checklists from confirmed bookings. Supporting interface text uses at least 14px, with larger form controls and body text.

## Typography

The original Atlantic-ink and gold design pairs self-hosted Grenze Gotisch headings with Manrope body and interface text. Supporting copy is at least 14px and body copy is generally 17–20px. Both font licenses are included in `public/fonts/`.
