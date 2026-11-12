# Connecting Cloudflare to GitHub

Cloudflare is what puts the website on the internet. Here we connect it to their GitHub, so that:
- every change that's made live is published automatically, and
- every draft gets its own **preview link**. Preview links aren't listed anywhere, but anyone who has the link can open it, so drafts shouldn't contain anything private.

No passwords or keys are handled: Cloudflare and GitHub connect through their own approval screens.

## Steps

1. Open https://dash.cloudflare.com and let them sign in.
2. In the left menu, open **Compute** (it may say **Workers & Pages**) and click **Create** (or **Create application**).
3. Choose **Connect GitHub** (it may say **Import a repository** or **Connect to Git**).
4. GitHub may ask them to sign in, then to approve **Cloudflare Workers and Pages**. If Cloudflare was connected to their GitHub before, this screen is skipped, which is fine. Tell them to choose **Only select repositories**, pick the site (`<site-name>`), and click **Install & Authorize**. This gives Cloudflare access to just this website.
5. Back in Cloudflare, select the repository and set:
   - **Project name:** exactly the site name. It must match `"name"` in `wrangler.jsonc`.
   - **Production branch:** `main`.
   - **Build command:** leave empty for plain HTML sites. If `SITE.md` says the site has a build step, use `npm run build`.
   - **Deploy command:** `npx wrangler deploy` (the default).
   - **Preview command:** `npx wrangler preview` (the default).
   - **Enable Preview builds:** make sure this is **on** (it is by default). It creates the preview links.
   - **Protect with Cloudflare Access:** leave **off**.
6. Click **Create and deploy** (or **Deploy**). The first build takes a minute or two. It publishes the starter placeholder to a free `workers.dev` address only. Their real domain isn't connected yet, so this is fine.
7. Note the free address it shows (`https://<site-name>.<their-subdomain>.workers.dev`) in `SETUP-PROGRESS.md`. It goes into `SITE.md` with the first version.
8. Previews are checked the first time a draft is shared, in **first-version**. If the **Workers Builds** check fails, the build log is in the Cloudflare dashboard (the check's link). The owner may need to sign in for you to see it. A common cause is a missing `"previews": {}` block in `wrangler.jsonc`.

## Editing from anywhere (optional "cloud mode", experimental)

This lets them ask for changes from the Claude or ChatGPT app on another device, without this computer. Adding photos is clunkier this way; see **edit-site**.

- **Claude:**
  1. Open https://claude.ai/settings/connectors (Settings → Connectors → GitHub) and connect GitHub.
  2. When GitHub asks about the **Claude** app, choose **Only select repositories** → the site → **Install & Authorize**.
  3. Then in the Claude app: **Code** → **Cloud**, and pick the repository.
- **ChatGPT:**
  1. In ChatGPT's settings, find **Connectors / Apps → GitHub** (or Codex settings), and connect GitHub.
  2. Choose **Only select repositories** → the site.
  3. Then in Codex choose **Cloud** and pick the repository.

In cloud mode the `gh` command may not be available. Use the app's own GitHub tools to open drafts (pull requests) instead. If you can't merge, use the **publish** skill's fallback, where the owner clicks **Merge** on GitHub. Preview links still come from Cloudflare as usual.

Screens change often. Read the page and adapt, but always choose "only select repositories".
