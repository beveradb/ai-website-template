---
name: setup
description: Use to set up a brand-new website from nothing, step by step with a non-technical owner - accounts, account security, GitHub and Cloudflare, the first version, a domain name, going live. Also use to continue an unfinished setup ("let's continue setting up my website") or when SETUP-PROGRESS.md has unticked steps.
---

# Setting up a new website

You're guiding someone who may never have heard of GitHub or Cloudflare. Go slowly, one step at a time. Explain *why* briefly, and celebrate progress. The whole thing takes about an hour. It's fine to stop and continue another day.

**Hard rules for setup** (on top of AGENTS.md):
- Signing up, passwords, two-step codes, CAPTCHAs and payment details are always typed by **the owner**. Open the page in the browser and explain what to do, then wait. Never fill these in yourself, and never ask them to tell you any of them.
- GitHub forbids accounts created by bots, so the owner must create accounts themselves.
- Use a browser as described in AGENTS.md section 5 (built-in browser first, then the `website-browser` Chrome window if sign-in is blocked).
- **Except** for screens that show secrets: password entry, two-step QR codes and setup keys, and recovery or backup codes. Have the owner do those in **their own normal browser**, where you can't see them. Describe the steps in words, and never ask for a screenshot of those screens.

## Progress file

Keep progress in `SETUP-PROGRESS.md` in the site folder, so setup can continue later, even in a different app.

- If it doesn't exist, create it with the checklist below, all unticked.
- If it exists, read it. Welcome them back ("Welcome back! Last time we got as far as …") and continue at the first unticked step.
- Tick each step (`- [x]`) as soon as it's done.
- The file is deliberately **not saved to GitHub** (it is in `.gitignore`). It stays in this folder whatever draft you are on, so switching drafts never loses progress.
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
- [ ] live: Website live (on its free address)
- [ ] domain: Domain name
- [ ] cloud-mode: (optional) Editing from anywhere
- [ ] helper: (optional) Helper access
- [ ] handover: How to look after your website
```

Start by telling them the plan in 3–4 lines: "We'll set up two free accounts (GitHub stores your website's files, Cloudflare puts it on the internet), make your website together, connect your domain name, and make it live. I'll guide every step."

## Joining an existing website

If the website already exists and someone has added this person to it (a helper set it up, they're using a new computer, or they share a site), don't make a new one:
1. Do **app-mode**, **tools**, **github-account**, **github-security** and **gh-signin** as below.
2. If they were invited, accept the invitation: open https://github.com/notifications or the invitation email in the browser, and they click **Accept**.
3. Turn this folder into the site, keeping `SETUP-PROGRESS.md`. It's ignored by git, so these commands leave it alone:
   ```
   git init -b main
   git remote add origin https://github.com/<owner>/<site>.git
   git fetch origin
   git reset --hard origin/main
   git branch --set-upstream-to=origin/main main
   git clean -fd
   ```
   The last command removes leftover template files the site doesn't use. Then run `git config core.hooksPath .githooks`, and set the git name and email as in **repo** step 4.
4. Read `SITE.md`, then skip to **handover**, adapting it to an existing site.

Use a shorter checklist in `SETUP-PROGRESS.md` for this: app-mode, tools, github-account, github-security, gh-signin, join, handover.

## The steps

### app-mode
Check you can run commands in this folder, e.g. `pwd`. If you can't, you're in plain chat mode. Tell them how to switch:
- **Claude app:** click **Code** at the top, choose **Local**, and pick this folder.
- **ChatGPT app:** switch to **Codex**, choose **Local**, and pick this folder.

If the app asks whether to **trust** this folder, or to approve the `website-browser` tool, say yes. It's the browser you'll use for website sign-ins.

### tools
Check `git --version`, `gh --version` and `node --version` (Node 20 or newer, which runs the site's safety check).
- **Mac, no git:** running `git --version` pops up an "install command line developer tools" box. Tell them to click **Install**, accept, and wait (5–15 minutes).
- **Mac, no gh:** download the latest macOS `.pkg` from https://github.com/cli/cli/releases/latest (the `gh_*_macOS_universal.pkg` asset). Open it and ask them to click through the installer. Then check `gh --version`, opening a new terminal session if needed (`/usr/local/bin/gh`).
- **Mac, no node (or older than 20):** download the **LTS** macOS installer (`.pkg`) from https://nodejs.org/en/download, open it, and ask them to click through.
- **Windows:** `winget install --id Git.Git -e`, `winget install --id GitHub.cli -e` and `winget install --id OpenJS.NodeJS.LTS -e`. Accept the prompts. Restart the app's session so the new commands are found.

### github-account
Ask: "Do you already have a GitHub account?" If yes, ask for the username, record it, and skip to **github-security**.

When creating accounts (here and for Cloudflare), suggest **"Continue with Google"** (or Apple) if they have a Google or Apple account with two-step login. It means one fewer password, and signing in works more reliably from assistant browsers.

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
Run `gh auth status`.
- **Always check the active account is the owner's:** `gh api user -q .login` must equal the GitHub username in `SETUP-PROGRESS.md`. Otherwise everything would be created in someone else's account.
- **The owner's account is signed in but not active:** explain in plain words, then run `gh auth switch --user <their username>` after they agree. This changes the default for the whole computer, so say so.
- **The owner's account isn't signed in at all** (not signed in, or only someone else's account is):
1. Run `gh auth login --web --git-protocol https --hostname github.com`.
2. It shows a one-time code and opens the browser. Say: "Your browser is asking you to confirm. Type in the code shown here (it's just a pairing code, not a password), then click **Authorize**."
3. Then run `gh auth setup-git`.
4. Confirm with `gh auth status`.

### repo
1. Agree a site name: short, lowercase, hyphens, e.g. `jane-smith-pottery`. Record it.
2. Create their copy of the template, **unless it already exists** (check with `gh repo view <username>/<site-name>`, e.g. after an interrupted setup): `gh repo create <site-name> --private --template beveradb/ai-website-template --description "<their site, in a few words>"`.
3. Turn this folder into it, **unless `git remote -v` already shows it**. Wait a few seconds after creating, and retry the fetch if it's empty:
   ```
   git init -b main
   git remote add origin https://github.com/<username>/<site-name>.git
   git fetch origin
   git reset --hard origin/main
   git branch --set-upstream-to=origin/main main
   ```
4. Label saved changes with their GitHub name, without using their personal email:
   ```
   git config user.name "$(gh api user -q '.name // .login')"
   git config user.email "$(gh api user -q '"\(.id)+\(.login)@users.noreply.github.com"')"
   ```
5. Prepare `main`. This is the **one time** you commit straight to `main`, because nothing is live yet:
   - delete `docs/superpowers/` (the template's own build notes)
   - set `"name"` in `wrangler.jsonc` and `package.json` to the site name. Cloudflare's build fails if it doesn't match.

   Then commit, but only if `git status --porcelain` shows changes (it won't if an earlier attempt already committed): `git commit -am "Set up <site-name>"`. Then **always** run `git push`, which is safe to repeat.
6. Turn on the safety check that stops passwords or tokens being uploaded: `git config core.hooksPath .githooks`.
7. Start the first draft: `git checkout -b change/first-version && git push -u origin HEAD`.

Tell them: "Your website's files are now safely stored in your GitHub account."

### cloudflare-account
First ask: "Will your website live in **your own** Cloudflare account, or in **someone else's** (for example, a family member's who looks after your domain)?"

**Someone else's account:** they never share a password. Instead:
1. The account holder invites the owner: in Cloudflare, **Manage Account → Members → Invite**, with the owner's email. They choose the **narrowest role that covers Workers and DNS for this domain**, e.g. a domain-scoped DNS role plus Workers access, if offered. Roles like Administrator or Workers Platform Admin give access to the *whole* account (all domains and billing). Only use one if the account holder understands that, and is comfortable with it.
2. The owner signs in to Cloudflare with **their own** login. If they have none, they sign up (ideally "Continue with Google"). Then they accept the invitation from the email, or from the notice in the dashboard.
3. Every Cloudflare step from here on happens **inside that account**: use the account switcher at the top left of the dashboard to pick it. Record the account's name (not any email) in `SETUP-PROGRESS.md` as `Cloudflare account:`.
4. Secure their own Cloudflare login as in **cloudflare-security**. Then carry on with **cloudflare-connect**. The GitHub approval there happens while they're signed in to their own GitHub, so it links **their** GitHub repository to the shared account.

**Their own account:** ask if they already have one. If not, open https://dash.cloudflare.com/sign-up. They type their email and a password saved by their password manager, then confirm the email. If asked what they want to do, choose the free plan and skip optional steps.

### cloudflare-security
Follow `accounts-and-security.md` (Cloudflare section).

### cloudflare-connect
Follow `cloudflare.md`. At the end, the website has a free `…workers.dev` address and every draft gets its own preview link.

### first-version
Use the **create-site** skill on the `change/first-version` draft, including sharing preview links, until they're happy. Don't publish yet. Include the free `workers.dev` address (from `SETUP-PROGRESS.md`) in `SITE.md` under `## Notes`, so **publish** knows where to check.

### live
1. Use the **publish** skill to make the approved first version live. It goes to the free `workers.dev` address.
2. Open it together. Celebrate! 🎉

### domain
Follow `domain.md`. Only do this after **live**, so the domain shows the real site, not the placeholder.

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

Tick **handover**. Setup is complete. Leave `SETUP-PROGRESS.md` in the folder as a record.

## If something goes wrong

- **CAPTCHA or "verify you're human" keeps failing:** have them do it in their normal browser, not the built-in one, then continue.
- **They don't have their phone, or can't get a code:** stop, note in `SETUP-PROGRESS.md` where you are (no secrets), and continue another time.
- **A step's screen looks different from these instructions:** websites change. Read the page and adapt, and keep to the hard rules.
- **They want to stop:** that's fine. Tell them to open the app in this folder next time and say "let's continue setting up my website".
