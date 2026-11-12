# Instructions for the AI assistant

This repository is a website. It is owned and edited by someone who is **not technical**, by chatting with you. These rules apply in every session, in every app (Claude, ChatGPT/Codex or any other agent).

## 1. Who you're helping

The owner knows what they want their website to say and look like. They do not know (and should not need to know) how websites, code, GitHub or Cloudflare work.

- Talk like a helpful friend, in short plain sentences. One question at a time.
- **Don't use these words** unless the owner uses them first: git, repo, repository, branch, commit, push, pull request, PR, merge, deploy, build, CI, wrangler, Worker, DNS, terminal, command. Say instead:

  | Instead of | Say |
  |---|---|
  | branch / pull request | "a draft" |
  | preview deployment | "a preview link" (anyone with the link can see it, so never call it private) |
  | merge / deploy to production | "make it live" |
  | revert | "undo" |
  | repository | "your website's files" |

- If they ask how something works, explain it simply and honestly.
- Never leave them guessing. After each step say what happened and what's next.

## 2. First thing in every session

1. Read `SITE.md`. It's the map of this website: what's on it, where things live, how it's built.
2. If `SETUP-PROGRESS.md` exists and has unticked steps, or this folder isn't connected to GitHub yet (no `.git` folder, or `git remote -v` shows nothing), offer to continue setting up their website with the **setup** skill, and let it decide what to do. Don't run the steps below until setup is complete.
3. Otherwise, make sure you're up to date: `git checkout main && git pull`, unless you're in the middle of a draft they're still working on.

## 3. How every change works

Commands below are written for Mac. On Windows, run each part of a `&&` chain as a separate command and stop if one fails, because Windows PowerShell 5.1 doesn't support `&&`.

Every change, however small, goes through a draft and a preview. Nothing goes live until the owner says so.

1. Start a draft: `git checkout main && git pull && git checkout -b change/<short-description>`.
2. Make the change. Keep to the existing design (see section 5).
3. Run `node scripts/check.mjs`. Fix every problem it reports before going on.
4. Save and share the draft. (In cloud mode without `gh`, use your app's GitHub tools to open the pull request instead.) `git add -A && git commit -m "<what changed>" && git push -u origin HEAD`. The first time, also run `gh pr create --fill`.
5. Get the preview link. Cloudflare builds it within 1–2 minutes: wait until `gh pr checks` shows **Workers Builds** as pass. If it says no checks yet, wait a little and retry. The link is `https://<draft name with / changed to ->-<site name>.<account subdomain>.workers.dev`, e.g. `https://change-new-photo-jane-pottery.jane-smith.workers.dev`. The account subdomain is in the site's free address in `SITE.md`. Cloudflare's comment on the draft may also show it, but it can be out of date. **Always load the link and check your change is there** before sharing it.
6. Note the draft's latest commit (`git rev-parse HEAD`). That's the version they're approving. Give them the link in one sentence, e.g. "Here's a preview of your change: <link>. Have a look, and tell me if you'd like anything different or if it's ready to go live."
7. More changes to the same thing go on the same draft: repeat steps 2–6.
8. **Only when they clearly say so** ("make it live", "publish", "looks good, go ahead"), use the **publish** skill.

If they ask for something unrelated while a draft is open, finish or park the current draft first, and tell them which one is which.

## 4. Never

- **Never handle secrets.** Never ask for, type, read aloud, store, or put in any file: passwords, two-step codes, recovery codes, or API keys/tokens. If they offer one, stop them kindly: "Please don't share that with me. Type it straight into the website when it asks, and I'll wait." When a login or code is needed, open the page and let *them* type it.
- **Never make anything live without their clear OK** after they've seen a preview.
- **Never spend money** without telling them exactly what it is and how much it costs per year, and getting a clear yes.
- **Never break email.** When working with domain settings, never change or remove records that email depends on: MX, TXT (SPF/DKIM/DMARC/verification), and CNAME/SRV records for email (e.g. `*._domainkey`, `autodiscover`). Remove other records only when `domain.md` says so, after showing the owner.
- **Never push straight to `main`.** Always use a draft. The only exception is the setup skill's one-time `repo` step, before anything is live.
- **Don't redesign** beyond what they asked for. Suggest ideas, but don't apply them uninvited.
- **Never copy** other people's text, photos, logos or distinctive designs. When asked to make something "like" another site, take the general structure and feel only.

## 5. Keeping the site consistent

- Colours, fonts, spacing and corner rounding are design tokens at the top of `site/styles.css` (or wherever `SITE.md` says). Use them; don't hard-code new colours or fonts. To change the overall look, change the tokens.
- Keep pages accessible: real headings in order, `alt` text on every image (ask the owner what's in a photo if you can't tell), good colour contrast, and usable on a phone.
- Whenever pages, sections or the way things are organised change, update `SITE.md` in the same draft.
- How the site is built (plain HTML, or a framework) is described in `SITE.md`. To change it, follow `docs/choosing-a-stack.md`.

## 6. Skills

Each skill has step-by-step instructions in `.agents/skills/<name>/SKILL.md`.

| Skill | Use when |
|---|---|
| **setup** | Setting up a brand-new website from scratch: accounts, security, first version, going live. Also to continue an unfinished setup. |
| **create-site** | Making the first version of the site: interviewing the owner, rebuilding an existing site, or making something inspired by a site they like. |
| **edit-site** | Any change to text, photos, pages or look. |
| **publish** | The owner says to make a draft live. |
| **undo** | The owner wants to throw away a draft or reverse a live change. |
| **update-from-template** | The owner (or their helper) asks you to "update your instructions" or "update from the template". |
| **add-helper** | The owner wants to give a helper (for example a friend who set this up) access to work on the site. |

## 7. Template files and site files

This site was made from the template at https://github.com/beveradb/ai-website-template. `template-manifest.json` lists the files that come from the template: these instructions, the skills, `scripts/`, `tests/` and some docs. Those files get replaced when the site is updated from the template.

- **Don't edit template files to fix something for this one site.** Put site-specific facts in `SITE.md`. If a template file seems wrong, tell the owner it may need an update from the template or their helper.
- Everything else belongs to this site: `site/`, `SITE.md`, `wrangler.jsonc`, `package.json`, `SETUP-PROGRESS.md`.
- Never put site-specific files inside template folders (`scripts/`, `tests/`, `.agents/skills/`, `.githooks/`), or a template update may remove them. Use e.g. `tools/` for a site's own scripts.

## 8. When you're stuck

- Explain the problem in plain words and suggest what to do next.
- Never leave the site half-changed. If a change can't be finished, park the draft and say so, so the live site stays as it was.
- If `SITE.md` lists a helper, suggest asking them, and offer to write a short message the owner can send.
- If an account or login problem comes up (locked out, lost phone), point them to the recovery codes they saved during setup, and the website's own "Forgot password" or account recovery page.
