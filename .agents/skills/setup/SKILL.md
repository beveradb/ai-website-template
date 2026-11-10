---
name: setup
description: Use to set up a brand-new website from nothing, step by step with a non-technical owner - accounts, account security, GitHub and Cloudflare, the first version, a domain name, going live. Also use to continue an unfinished setup ("let's continue setting up my website") or when SETUP-PROGRESS.md has unticked steps.
---

# Setting up a new website

You're guiding someone who may never have heard of GitHub or Cloudflare. Go slowly, one step at a time. Explain *why* briefly, and celebrate progress. The whole thing takes about an hour. It's fine to stop and continue another day.

**Hard rules for setup** (on top of AGENTS.md):
- Signing up, passwords, two-step codes, CAPTCHAs and payment details are always typed by **the owner**. Open the page in the browser and explain what to do, then wait. Never fill these in yourself, and never ask them to tell you any of them.
- GitHub forbids accounts created by bots, so the owner must create accounts themselves.
- If your app has a built-in browser, use it so you can see the page and guide them. Otherwise, give them the link and ask them to describe or screenshot what they see.

## Progress file

Keep progress in `SETUP-PROGRESS.md` in the site folder, so setup can continue later, even in a different app.

- If it doesn't exist, create it with the checklist below, all unticked.
- If it exists, read it. Welcome them back ("Welcome back! Last time we got as far as …") and continue at the first unticked step.
- Tick each step (`- [x]`) as soon as it's done.
- Only write non-secret facts: their GitHub username, the site name, the domain. **Never** write passwords, codes or email addresses.

```markdown
# Website setup progress

GitHub username:
Site name:
Domain:

- [ ] app-mode: Using the right mode in the AI app
- [ ] tools: Tools installed on this computer
- [ ] github-account: GitHub account
- [ ] github-security: GitHub account secured
- [ ] gh-signin: This computer signed in to GitHub
- [ ] repo: Website files saved to GitHub
- [ ] cloudflare-account: Cloudflare account
- [ ] cloudflare-security: Cloudflare account secured
- [ ] cloudflare-connect: Cloudflare connected to GitHub
- [ ] first-version: First version of the website
- [ ] domain: Domain name
- [ ] live: Website live
- [ ] cloud-mode: (optional) Editing from anywhere
- [ ] helper: (optional) Helper access
- [ ] handover: How to look after your website
```

Start by telling them the plan in 3–4 lines: "We'll set up two free accounts (GitHub stores your website's files, Cloudflare puts it on the internet), make your website together, connect your domain name, and make it live. I'll guide every step."

## The steps

### app-mode
Check you can run commands in this folder, e.g. `pwd`. If you can't, you're in plain chat mode. Tell them how to switch:
- **Claude app:** click **Code** at the top, choose **Local**, and pick this folder.
- **ChatGPT app:** switch to **Codex**, choose **Local**, and pick this folder.

### tools
Check `git --version` and `gh --version`.
- **Mac, no git:** running `git --version` pops up an "install command line developer tools" box. Tell them to click **Install**, accept, and wait (5–15 minutes).
- **Mac, no gh:** download the latest macOS `.pkg` from https://github.com/cli/cli/releases/latest (the `gh_*_macOS_universal.pkg` asset). Open it and ask them to click through the installer. Then check `gh --version`, opening a new terminal session if needed (`/usr/local/bin/gh`).
- **Windows:** `winget install --id Git.Git -e` and `winget install --id GitHub.cli -e`. Accept the prompts. Restart the app's session so the new commands are found.

### github-account
Ask: "Do you already have a GitHub account?" If yes, ask for the username, record it, and skip to **github-security**.

Otherwise, open https://github.com/signup and walk them through it:
1. **Email:** one they'll keep long-term.
2. **Password:** let their browser or password manager *suggest and save* a strong one.
3. **Username:** short and professional. It appears in some addresses.
4. The puzzle check and the email code: they do these.
5. Skip any questions about plans or teams. Free is all they need.

Record the username.

### github-security
Follow `accounts-and-security.md` (GitHub section). Don't skip it. This is what saves them if they forget a password or lose a phone.

### gh-signin
Run `gh auth status`. If it's not signed in:
1. Run `gh auth login --web --git-protocol https --hostname github.com`.
2. It shows a one-time code and opens the browser. Say: "Your browser is asking you to confirm. Type in the code shown here (it's just a pairing code, not a password), then click **Authorize**."
3. Then run `gh auth setup-git`.
4. Confirm with `gh auth status`.

### repo
1. Agree a site name: short, lowercase, hyphens, e.g. `jane-smith-pottery`. Record it.
2. Create their copy of the template: `gh repo create <site-name> --private --template beveradb/ai-website-template --description "<their site, in a few words>"`.
3. Turn this folder into it. Wait a few seconds after creating, and retry the fetch if it's empty:
   ```
   git init -b main
   git remote add origin https://github.com/<username>/<site-name>.git
   git fetch origin
   git reset --hard origin/main
   git branch --set-upstream-to=origin/main main
   ```
4. Start the first draft: `git checkout -b change/first-version`. On it:
   - delete `docs/superpowers/` (the template's own build notes)
   - set `"name"` in `wrangler.jsonc` and `package.json` to the site name
   - commit `SETUP-PROGRESS.md`

   Push the draft (`git push -u origin HEAD`). Cloudflare needs it to exist.

Tell them: "Your website's files are now safely stored in your GitHub account."

### cloudflare-account
Ask if they already have one. If not, open https://dash.cloudflare.com/sign-up. They type their email and a password saved by their password manager, then confirm the email. If asked what they want to do, choose the free plan and skip optional steps.

### cloudflare-security
Follow `accounts-and-security.md` (Cloudflare section).

### cloudflare-connect
Follow `cloudflare.md`. At the end, the website has a free `…workers.dev` address and every draft gets its own preview link.

### first-version
Use the **create-site** skill on the `change/first-version` draft, including sharing preview links, until they're happy. Don't publish yet.

### domain
Follow `domain.md`.

### live
1. Use the **publish** skill to make the first version live.
2. Open the real address together.
3. Celebrate! 🎉

### cloud-mode (optional)
Offer: "Would you like to be able to ask for changes from your phone or another computer, without this computer? It's optional. Most changes are easiest from here."

If yes, follow the "Editing from anywhere" section of `cloudflare.md`.

### helper (optional)
Ask: "Is there someone helping you with your website, like the friend who suggested this, who should be able to make changes for you if you ask? You can remove them at any time." If yes, use the **add-helper** skill.

### handover
Explain, in their words, in 5–6 short lines:
- To change anything, open this app in this folder and just ask.
- You'll always get a **preview link** first. Nothing changes on the real website until you say "make it live".
- If you don't like something, say "undo".
- Your passwords and recovery codes are in your password manager. Remind them where. Never share them, including with an AI.
- Template updates: if your helper says so, ask "update your instructions from the template".

Tick **handover**. Setup is complete. Leave `SETUP-PROGRESS.md` in place as a record. Commit the final ticks on a small draft and publish it, or include them in the next change.

## If something goes wrong

- **CAPTCHA or "verify you're human" keeps failing:** have them do it in their normal browser, not the built-in one, then continue.
- **They don't have their phone, or can't get a code:** stop, note in `SETUP-PROGRESS.md` where you are (no secrets), and continue another time.
- **A step's screen looks different from these instructions:** websites change. Read the page and adapt, and keep to the hard rules.
- **They want to stop:** that's fine. Tell them to open the app in this folder next time and say "let's continue setting up my website".
