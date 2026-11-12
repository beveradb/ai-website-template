# Guide for helpers

You're the friend who knows a bit about computers and is helping someone get a website. This explains how the system works behind the scenes, and how to help without becoming their permanent IT department.

## How it works

- The **owner** owns everything: their GitHub account (the site's files, in a private repo), their Cloudflare account (hosting and domain), and their Claude or ChatGPT subscription.
- The site is a repo created from this template. `AGENTS.md` and the skills in `.agents/skills/` teach the owner's AI assistant how to work safely:
  - every change goes on a branch, which they call a "draft"
  - Cloudflare Workers Builds builds a preview URL for each branch
  - the assistant merges only when the owner says "make it live"
- `CLAUDE.md` just imports `AGENTS.md`, and `.claude/skills/*` are symlinks to `.agents/skills/*`. That's how Claude and Codex share one set of instructions.
- `SITE.md` is each site's own map: pages, where things live, how it's built. The assistant keeps it current.

## Getting someone started

**Sitting beside them (best):**
1. Open `docs/START-HERE.md` on GitHub with them and follow it. Your job is mostly reassurance.
2. Let them type every password and code themselves.

**Remotely:** send them the link to `docs/START-HERE.md`. The setup skill keeps progress in `SETUP-PROGRESS.md`, so they can stop and resume. Expect a call at the account-security or domain steps.

Things that commonly need a human eye:
- **Moving an existing domain** whose email is hosted at the old provider. Double-check the MX/TXT records made it into Cloudflare *before* the nameserver switch.
- **CAPTCHAs** that fail in the app's built-in browser. Use their normal browser instead.
- **Windows:** skill symlinks become plain files unless Developer Mode is on and `core.symlinks` is true. `node scripts/check.mjs` shows a warning, not a failure. Codex reads `.agents/skills` directly, and AGENTS.md points Claude at the same paths.
- **Cloud mode** (Claude/Codex cloud sessions) is experimental. `gh` may be missing there, so the owner may need to click Merge themselves.

## Working on a friend's site yourself

If they've added you with the **add-helper** skill, you're a collaborator on their repo:

```
gh repo clone <owner>/<site-name>
cd <site-name>
```

Work exactly as their assistant would: a `change/<x>` branch, `node scripts/check.mjs`, a PR, then the preview URL. Let **them** decide when it goes live, either by telling their assistant "make it live", or you merge once they've said yes.

You don't need, and shouldn't ask for, access to their Cloudflare or GitHub accounts.

## Improving the template

Heads-up: `AGENTS.md` here is written for friends' assistants. When you open *this* repo in Claude Code or Codex, it loads as instructions too. Tell your assistant you're developing the template, not editing a friend's site.


When you fix something that every site would benefit from:

1. Make the change in this template repo, on a branch, with tests where it's code (`node --test`, `node scripts/check.mjs`).
2. Bump `"version"` in `template-manifest.json` (semver: patch for wording fixes, minor for new skills or behaviour).
3. Add a dated entry at the top of `docs/LESSONS.md` saying what changed and why, in plain words. The assistant reads these to owners when updating. If existing sites need changes to their **own** files (`wrangler.jsonc`, `package.json`, `.gitignore`, `site/`), add an **Existing sites** section with exact steps. The updater only replaces template-owned files, and the assistant applies these steps on the same draft.
4. If you add a new template-owned file outside the existing globs, add it to `templateOwned` in `template-manifest.json`.
5. Merge, then tag: `git tag v<version> && git push --tags`.
6. Tell the friends whose sites need it: *"Next time you open your website app, ask: update your instructions from the template."*

Site-specific fixes never go in template files. They go in that site's `SITE.md` or its own pages.
