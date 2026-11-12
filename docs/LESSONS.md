# Lessons and changes

Newest first. Each entry: what changed in the template, and why. Assistants read the entries newer than a site's current version when running **update-from-template**, and summarise them for the owner.

## 2026-11-11 v0.1.1: Fixes from the first real test

- **Preview links now work.** Cloudflare's preview builds need a `"previews": {}` block in `wrangler.jsonc`, and a current Wrangler (now listed in `package.json`). Without them, every draft's preview failed.
- The assistant now works out the preview link itself and checks it loads. Cloudflare's comment on a draft can be out of date.
- Original photos are kept in a `photo-originals/` folder outside the published site, and never uploaded. Only converted, resized copies go in `site/images/`.
- Setup's Cloudflare steps match the current screens ("Connect GitHub", Preview builds on by default).

**Existing sites:** apply these to the site's own files:
- In `wrangler.jsonc`, add `"previews": {}` at the top level, if missing.
- In `package.json`, set `devDependencies.wrangler` to `^4.160.0` (add it, or raise an older version). If the site has a lockfile (`package-lock.json` or `bun.lock`), run `npm install` (or `bun install`) to update it.
- In `.gitignore`, add `photo-originals/`, `*.heic` and `*.HEIC`, if missing.
- If preview links still don't appear after this update, open the Worker in the Cloudflare dashboard and look for a prompt to switch to the new **Worker Previews**. Accept it. It's a one-time switch.

## 2026-11-10 v0.1.0: First version

- First release of the template:
  - shared instructions for Claude and ChatGPT/Codex (`AGENTS.md` + skills)
  - guided setup from zero (accounts, security, Cloudflare, domain)
  - a draft → preview → "make it live" workflow, with undo
  - template updates
  - optional helper access
- Hosting uses Cloudflare Workers static assets with Workers Builds, because Cloudflare now recommends Workers over Pages for new projects. Preview links come from Workers Builds' non-production branch builds.
- Photos: local mode (the site folder on the owner's computer) is the default, because chat attachments in cloud sessions may not be saved as files.
