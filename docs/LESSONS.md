# Lessons and changes

Newest first. Each entry: what changed in the template, and why. Assistants read the entries newer than a site's current version when running **update-from-template**, and summarise them for the owner.

## 2026-11-12 v0.2.0: Lessons from the first real migration (andrewbeveridge.co.uk)

- **A real browser when sign-in is blocked.** Some sites (like Cloudflare) refuse password sign-in from the app's built-in browser. The template now includes a `website-browser`: a real Chrome window, driven by the assistant, that remembers logins. You sign in once.
- **Joining an existing website** (e.g. a helper set it up for you, or you're on a new computer) now has its own short setup path and start message.
- **Safer:** the assistant never opens files outside the website's folder, or files that hold passwords or keys.
- **GitHub accounts:** setup checks *which* GitHub account the computer uses, not just that one is signed in.
- **Domains already in Cloudflare** (attached to an old site) are moved one at a time, with seconds of downtime and email untouched.
- **Rebuilds keep old addresses working**, with redirects where pages move.
- The start page explains the Claude app's permission modes and the Changes panel you can ignore.

**Existing sites:** the new browser files (`.mcp.json`, `.codex/config.toml`) arrive with this update. Nothing to change in the site's own files.

## 2026-11-11 v0.1.2: Updater works from any folder

- The update and check scripts silently did nothing when run from a folder reached through a shortcut, such as the Mac's temporary folder. They now work from anywhere. (Found by an assistant during the first template update.)
- Preview link rule corrected: every character that isn't a letter or number becomes a dash, including dots.

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
