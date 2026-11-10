---
name: undo
description: Use when the owner wants to throw away a change or reverse something - "undo", "go back", "put it back how it was", "cancel that", "I don't like it, remove it", "the site is broken".
---

# Undoing changes

First work out which situation this is. Ask if unclear: "Do you mean the change I just showed you in the preview, or something that's already live on your website?"

## A. Throw away a draft that isn't live yet

1. Find the draft: `gh pr list`.
2. `gh pr close <number> --delete-branch`, then `git checkout main && git pull`.
3. Tell them: "Done. I've thrown that draft away. Your live website hasn't changed."

## B. Reverse something that's already live

1. Find the change: `git log --oneline -15 main`. Describe the recent changes in plain words and confirm which one.
2. Start a draft: `git checkout main && git pull && git checkout -b change/undo-<short-description>`.
3. `git revert --no-edit <commit>`. If it conflicts, it's because later changes touched the same place. Undo **only** the chosen change and keep every later change. If you can't tell how to combine them, stop, explain the overlap to the owner in plain words, and ask what they want the result to look like. Check the preview carefully for anything else that changed.
4. Run `node scripts/check.mjs`, push, open the draft, and share the preview link (AGENTS.md section 3): "Here's a preview of your website with that change undone."
5. When they confirm, use the **publish** skill.

## C. Emergency: the live site is broken right now

Do this when the site is down or badly broken and they need it back immediately, before fixing things properly:

1. Open https://dash.cloudflare.com in the browser and let them sign in.
2. Go to **Workers & Pages** → this site → **Deployments**.
3. Find the last version that was working (just before the bad change). Use **⋯ → Rollback** on it, then confirm.
4. Check the live site, and tell them it's back.
5. Then fix things properly with B, so the website's files match what's live. Otherwise the next change would bring the problem back.
