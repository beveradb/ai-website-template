# Choosing how a site is built

Start with **plain HTML and CSS** in `site/`. It has no build step, nothing to install, and nothing to break, so an assistant can edit it reliably for years.

## When to use a framework instead

Switch to [Astro](https://astro.build) when a plain site would mean copying the same block of HTML again and again. For example:

- a portfolio or blog with more than about 6 entries, where each entry has its own page
- the same header, footer or layout repeated across more than a few pages, and changing often
- content that's naturally a list of items (projects, posts, events) the owner adds to regularly

With Astro, each item becomes a small Markdown file plus a folder of images. Adding one means creating a file, not editing a huge page.

Don't use a framework just because it's popular. Don't add JavaScript frameworks (React, Vue…) for a content site.

## How to switch a site to Astro

1. Create the Astro project in the repo root (`npm create astro@latest`). Put the source in `src/` and the static files in `public/` (move `site/images/` to `public/images/`).
2. Merge Astro's dependencies and `build` script into the existing `package.json`. Keep the `test` and `check` scripts.
3. In `wrangler.jsonc`, set `assets.directory` to `./dist`.
4. In the Cloudflare dashboard (Worker → Settings → Build), set the build command to `npm run build`.
5. Update the `## How it's built` section of `SITE.md` to describe the new layout: where the content files live and how to add an item.
6. Run `node scripts/check.mjs` after `npm run build`, so the link checker sees the built site.

## Never

- Server code, databases or logins. If a site needs a contact form, use a hosted form service that works with static sites.
- Tracking scripts the owner hasn't asked for.
