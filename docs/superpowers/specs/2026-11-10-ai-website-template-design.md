# AI-Edited Static Website Template — Design

Date: 2026-11-10 · Status: approved 2026-11-10

## Intent and why

Andrew has long helped friends and family run websites, historically on WordPress (free admin UI, cheap hosting) and more recently via a hybrid: WordPress + Elementor on his home server `homefanless1`, a static-export plugin, a cron job (`push-static-export.sh`, every 5 min) that commits the export to GitHub, and Cloudflare auto-deploying it. That avoids WordPress's security and performance problems on the live site, but still depends on a WordPress install on a residential home server.

Now that AI agents can build and edit sites directly, the WordPress layer is unnecessary. The goal is a **public, reusable template repo** that lets a non-technical person own and edit their own static website **by talking to an AI agent** — in either the **Claude desktop app** (Code tab) or the **ChatGPT desktop app** (Codex mode) — with code in GitHub and automatic deploys on Cloudflare, free hosting, and preview-before-publish safety.

The template doubles as Andrew's reference for every future site. It is proven and refined by migrating, in order:
1. `andrewbeveridge.co.uk` (Andrew's own simple site)
2. `lindsaywright.design` (Lindsay's portfolio)

…folding learnings back into the template after each.

## Who it serves

- **The friend** (e.g. Lindsay; Ana, who uses ChatGPT; future friends): non-technical, may never have heard of GitHub or Cloudflare. Has, or will install, the Claude or ChatGPT desktop app on a paid plan (~$20/mo; Claude Pro or ChatGPT Plus). Willing to switch the app into its coding-agent mode.
- **Andrew**: usually sits beside the friend during setup, but the system must work if he only sends them a link.

## Goals

1. **One template, two agents.** Every instruction and skill works identically in Claude Code and Codex.
2. **Bootstrap from zero.** A guided setup skill takes a total beginner from "I have the AI app" to "my site is live on my domain with preview links", including account creation and security hygiene.
3. **Friend owns everything.** GitHub, Cloudflare, domain, AI app — all in the friend's own accounts. Andrew has no access by default.
4. **Secure accounts with recovery.** Setup guides the friend to store credentials in a password manager (browser/OS built-in is acceptable), enable 2FA, prefer passkeys where supported, set recovery email/phone, and save backup/recovery codes somewhere safe.
5. **Three ways to create the first version**, chosen by situation:
   - *Interview & build new* — agent interviews about purpose, audience, pages, content, mood, sites they like.
   - *Rebuild existing* — friend gives a URL (Wix, Squarespace, WordPress, anything); agent extracts content + images and rebuilds cleanly. Default: keep the look; offer a refresh.
   - *Inspired by* — friend points at a site they admire; agent produces an original site with similar structure/feel and the friend's own content (not a copy).
6. **Safe everyday editing.** Every change happens on a branch → Cloudflare preview URL → agent shares the link in plain words → goes live only after the friend explicitly says to publish → agent merges. Undo is always possible (revert / Cloudflare rollback).
7. **Domain handling.** Ask whether they already own a domain. If yes, connect it (moving DNS to Cloudflare as needed). If no, help them buy one through Cloudflare Registrar (with explicit approval before any purchase).
8. **Free hosting** on Cloudflare's free tier.
9. **Living reference.** The template records learnings from each migration (a changelog/lessons file) so it improves over time.
10. **Sites can pull template improvements.** An `update-from-template` skill fetches the latest agent instructions and skills from the public template (no auth needed) and applies them to a friend's site. It never touches site-owned content: the pages, assets and the site-specific "site map" section. It goes through the normal preview → publish flow. This lets Andrew fix something once in the template and give the friend one simple instruction, e.g. "ask your agent to update your site's instructions". This requires a clear split between **template-owned** files (core `AGENTS.md` contract, skills, `CLAUDE.md` shim, helper docs) and **site-owned** files (site content, config, and a separate site-map file such as `SITE.md` that `AGENTS.md` references). Template version recorded in the site (e.g. `.template-version`).
11. **Optional trusted helper.** Setup (and a standalone skill, e.g. `add-helper`) offers, off by default, to add a named helper (Andrew, by GitHub username) as a collaborator on the friend's site repo only. This lets Andrew work on their site locally with his own tools when the friend asks. It never involves sharing logins, and it's easy to remove later. Account recovery never depends on the helper.

## Non-goals

- A CMS, admin UI, or any server-side runtime. (A git-based CMS like Pages CMS/Sveltia may be documented as an optional add-on if photo handling demands it — not built in.)
- Hosting on Andrew's infrastructure, or Andrew as a hidden owner/admin.
- Migrating `nomadkaraoke` and `karaokehunt`, which use the same WordPress export cron. Their cron lines and WordPress installs stay untouched in this project.
- Dynamic features like logins, databases or e-commerce. Contact forms only via third-party/static-friendly services if a site needs one.
- Supporting plain chat modes (no file/shell/browser access).

## Anti-goals (failure even if it "works")

- The agent ever sees, types, stores, or logs the friend's passwords, 2FA codes, recovery codes or API tokens in chat or in the repo.
- A change goes live without the friend having seen a preview and said yes.
- The friend is left needing Andrew for routine edits, or locked out with no recovery path.
- Instructions that only work in one of the two agents.
- Jargon-heavy agent behaviour: the friend hears "rebase", "merge conflict", "wrangler" etc. without asking.
- Elementor-export-style generated HTML soup that agents can't edit reliably.
- Spending money (domain purchase) without explicit confirmation.

## Constraints and facts (researched 2026-11-10)

- **Cross-agent instructions:** Codex reads `AGENTS.md` (root → cwd, 32 KiB cap) and skills from `.agents/skills/<name>/SKILL.md`. Claude Code reads `CLAUDE.md` and `.claude/skills/`; reads `AGENTS.md` only if no `CLAUDE.md` exists. Both follow symlinked skill folders. **Decided layout:** canonical content in `AGENTS.md` + `.agents/skills/`; `CLAUDE.md` contains `@AGENTS.md` (plus any Claude-only notes); `.claude/skills/<name>` symlinks to `../../.agents/skills/<name>`. Skills use only standard frontmatter (`name`, `description`). Windows symlink caveat → see open items.
- **Browser control:** both desktop apps have a built-in agent browser (clean profile, user can take over; agent can't see typed passwords). Use this rather than Playwright, so friends need no extra installs. Agents are blocked by CAPTCHAs and must ask before purchases/submissions.
- **Account creation must be done by the human.** GitHub ToS forbids bot-registered accounts; CAPTCHAs block agents anyway. The agent guides (opens the page, explains each field, waits), the human types and submits. Post-signup configuration (connecting apps, Cloudflare project setup) can be agent-driven.
- **GitHub security:** passkeys are supported for sign-in but can't be the primary 2FA method — pair with a TOTP authenticator (or the phone's built-in password manager's code generator). 2FA may be mandatory soon after signup.
- **Cloudflare security:** 2FA via security key (Touch ID / Windows Hello), TOTP, email; backup codes.
- **Cloudflare hosting:** Cloudflare now recommends **Workers (static assets) + Workers Builds** for new sites over Pages. Workers Builds' GitHub integration supports per-branch/PR preview URLs with PR comments (enable "Preview Builds"; free plan keeps 100 previews per Worker). Static asset requests are free and unlimited. Preview URLs are public unless protected by Cloudflare Access (acceptable). Existing direct-upload Pages projects (e.g. Little Black Horse) cannot be converted to Git integration; migration means a new project + moving the custom domain.
- **Registrar API** (beta) can search, check price and register domains, charging the default payment method on file. Limited TLDs. Dashboard purchase is the fallback. Always confirm price with the friend first.
- **Photos are the weak spot in cloud sessions:** images attached in chat are visible to the model but reportedly not saved to the repo. In **local mode** (repo folder on the friend's computer), the friend can just drop photos into a folder.
- **Agent modes:** Claude Code tab: Local / Cloud. Codex: Local / Worktree / Cloud.

## Decided

- Public repo on Andrew's GitHub (`beveradb`), usable as a GitHub template.
- Accounts are all the friend's own; recovery and credential hygiene are part of setup.
- Domain: use existing if they have one, else buy via Cloudflare.
- First version: interview, rebuild-from-URL, or inspired-by, chosen per situation.
- How each site is built (plain HTML vs a framework like Astro) is chosen per site by the agent, guided by the template. Default: plain HTML/CSS for small sites. Use a static-site framework only when there's clear benefit, e.g. many repeating items like portfolio projects or blog posts.
- Agents drive the browser built into the desktop apps; humans handle signups, passwords, 2FA and payments.

## Shape of the template (proposed)

- `AGENTS.md`: the core contract for any agent working in a site repo. It covers:
  - who the user is and the plain-language rules for talking to them
  - the branch → preview → explicit "publish" → merge workflow
  - undo and rollback
  - the never-handle-secrets rule
  - keeping to the site's design tokens
  - pointers to the skills
  - a "site map" section the agent fills in for each site, saying where things live
- `CLAUDE.md` — `@AGENTS.md`.
- `.agents/skills/` (symlinked into `.claude/skills/`), roughly:
  - `setup`: the bootstrap. It detects what exists and resumes where it left off, so it is safe to re-run. Steps:
    1. Check the app and mode.
    2. GitHub account and security.
    3. Cloudflare account and security.
    4. Create the repo from the template.
    5. Connect the AI app to GitHub.
    6. Create the first site (via `create-site`).
    7. Cloudflare project with GitHub integration and previews.
    8. Domain (existing or purchase).
    9. Go live.
    10. A "how to edit your site" handover.

    It saves progress in a non-secret checklist file in the repo, e.g. `SETUP-PROGRESS.md`.
  - `create-site`: interview / rebuild-from-URL / inspired-by → first draft → iterate via previews.
  - `edit-site` (or folded into AGENTS.md): everyday change workflow, including adding photos.
  - `publish` / `undo`: plain-language wrappers.
- `docs/`:
  - a **human** guide ("Start here" for the friend, and the link Andrew sends) with the exact first prompt to paste
  - a guide for Andrew/helpers
  - `LESSONS.md` with the migration learnings
- Starter skeleton: minimal accessible plain-HTML site with design tokens (CSS custom properties), plus guidance for when to switch to a framework.
- Cloudflare config (e.g. `wrangler.jsonc` for static assets) templated per site.

## Entry point for a friend (proposed)

Andrew sends a link to the template's "Start here" page. It says:
1. Install the Claude or ChatGPT desktop app and get a paid plan.
2. Switch to Code/Codex mode, in local mode, in a new empty folder.
3. Paste one prompt that tells the agent to fetch the template and run `setup`.

There's a bootstrapping chicken-and-egg problem: the skills live in a repo the friend doesn't have yet. So the first prompt must be self-sufficient enough to download the template into the folder, which needs no GitHub account because the repo is public, and then run `setup` from there.

## Current state of the two sites (checked 2026-11-10)

- Both domains are registered through Cloudflare Registrar in **Andrew's** Cloudflare account, and both zones are active there. `andrewbeveridge.co.uk` expires 2035-03 and `lindsaywright.design` expires 2027-06.
- **Email must be preserved.** `andrewbeveridge.co.uk` has Google Workspace MX records. `lindsaywright.design` uses Cloudflare Email Routing. DNS changes during the migration touch only web records (apex/www).
- The old export repo is `beveradb/lindsaywright.design-static-site` (public). Whether the current sites are on Pages or Workers wasn't confirmed: the local tokens lack Pages read permission. Check during the migration.
- **Decision:** both sites stay in Andrew's GitHub and Cloudflare accounts; Lindsay is fine with this. So neither migration exercises account creation or a domain purchase. The first full run of `setup` from zero will be a friend (e.g. Ana).

## Migrations (acceptance tests for the template)

1. **andrewbeveridge.co.uk.** Rebuild from the live site (or the existing export repo) into a new repo made from the template, deploy via Workers Builds with previews, and move the domain. Andrew is already technical, so this tests `create-site` (rebuild path), deploy and editing, but only lightly tests account setup. Retire the `andrewbeveridge.co.uk` cron line and its WordPress install on homefanless1 once live.
2. **lindsaywright.design.** Rebuild Lindsay's portfolio into a repo in Andrew's account, with Lindsay added as a collaborator. Lindsay is the first real non-technical *editor*: she connects her own Claude app to the repo and makes real edits, including adding photos, in local and cloud modes. Retire `wp.lindsaywright.design`, the `lindsaywrightdesign` cron line, and the old `lindsaywright.design-static-site` repo/deploy once live.
3. After each: update template + `LESSONS.md`.

A Codex/ChatGPT run-through, e.g. with Ana, validates the cross-agent claim. Before that, at least a dry run of `setup` and an edit in the ChatGPT desktop app's Codex mode.

## Left to the builder

- Repo name (proposed: `ai-website-template`), exact skill names and boundaries, and file layout details.
- Starter skeleton design, plus the guidance for choosing a framework.
- Wording of all human-facing text, at an elementary-reading-level target.
- How the bootstrap prompt fetches the template (e.g. download zip vs `git clone`, which needs git on the machine; macOS prompts to install Xcode CLT). Choose the most robust option for a non-technical user on macOS and Windows.

## Open items to verify early

- Image attachments → file in repo, in each app's Local and Cloud modes.
- Whether git is available or easily installed by each desktop app's local mode on a fresh Mac/Windows machine.
- Windows checkouts and skill symlinks. The fallback is copying the skill folders into `.claude/skills` and checking them in CI.
- Workers Builds preview URLs + PR comments end-to-end on a free account.
- Whether the agent can merge PRs in each app's mode. **Builder's call (fallback):** if it can't, `publish` gives the friend a direct link to the PR and plain instructions to click the green Merge button.
