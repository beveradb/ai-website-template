# Connecting Cloudflare to GitHub

Cloudflare is what puts the website on the internet. Here we connect it to their GitHub, so that:
- every change that's made live is published automatically, and
- every draft gets its own private-ish **preview link**.

No passwords or keys are handled: Cloudflare and GitHub connect through their own approval screens.

## Steps

1. Open https://dash.cloudflare.com and let them sign in.
2. In the left menu, open **Compute** (it may say **Workers & Pages**) and click **Create** (or **Create application**).
3. Choose **Import a repository** (or **Connect to Git** → **GitHub**).
4. GitHub asks them to approve **Cloudflare Workers and Pages**. Tell them to choose **Only select repositories**, pick the site (`<site-name>`), and click **Install & Authorize**. This gives Cloudflare access to just this website.
5. Back in Cloudflare, select the repository and set:
   - **Project name:** exactly the site name. It must match `"name"` in `wrangler.jsonc`.
   - **Production branch:** `main`.
   - **Build command:** leave empty for plain HTML sites. If `SITE.md` says the site has a build step, use `npm run build`.
   - **Deploy command:** `npx wrangler deploy` (the default).
   - **Builds for non-production branches / Preview builds:** make sure this is **enabled**. It creates the preview links.
6. Click **Create and deploy** (or **Deploy**). The first build takes a minute or two.
7. Note the free address it shows (`https://<site-name>.<their-subdomain>.workers.dev`), and add it to `SITE.md` under `## Notes`.
8. **Check previews work:**
   1. Open the draft for `change/first-version` with `gh pr create --draft --fill` if not already open.
   2. Wait for `gh pr checks --watch`.
   3. Find the preview URL in `gh pr view --comments`.
   4. If no preview appears after ~5 minutes, go back to the Worker's **Settings → Build** and turn on builds for non-production branches, then push again.

## Editing from anywhere (optional "cloud mode")

This lets them ask for changes from the Claude or ChatGPT app on another device, without this computer. Adding photos is clunkier this way; see **edit-site**.

- **Claude:**
  1. Open https://claude.ai/settings/connectors (Settings → Connectors → GitHub) and connect GitHub.
  2. When GitHub asks about the **Claude** app, choose **Only select repositories** → the site → **Install & Authorize**.
  3. Then in the Claude app: **Code** → **Cloud**, and pick the repository.
- **ChatGPT:**
  1. In ChatGPT's settings, find **Connectors / Apps → GitHub** (or Codex settings), and connect GitHub.
  2. Choose **Only select repositories** → the site.
  3. Then in Codex choose **Cloud** and pick the repository.

Screens change often. Read the page and adapt, but always choose "only select repositories".
