---
name: publish
description: Use when the owner says a previewed change is ready to go live - "make it live", "publish", "looks good, go ahead", "put it on the website". Makes the current draft live on the real website.
---

# Making a change live

## Before you publish

1. Confirm you've shared a preview link for this draft and they've said to make it live. If not, share the preview first (AGENTS.md section 3) and wait.
2. If several drafts are open (`gh pr list`), ask which one, describing each in plain words.
3. Run `node scripts/check.mjs`. It must pass.
4. Make sure everything is saved: `git status` shows nothing to commit, and `git push` is up to date.

## Publish

If the draft is marked as a GitHub "draft" pull request, run `gh pr ready` first.

```
gh pr merge --squash --delete-branch
git checkout main && git pull
```

**If the merge fails because of permissions or settings,** fall back to the owner doing it:

1. Get the draft's link: `gh pr view --json url -q .url`.
2. Say: "One last click from you: open this link, scroll down, click the green **Merge** button, then **Confirm**. Tell me when you've done it."
3. When they say it's done, check with `gh pr view --json state -q .state` (should be `MERGED`), then `git checkout main && git pull`.

## Check it's live

Cloudflare publishes the change, usually within 1–2 minutes. Don't say it's live until you've confirmed it:

1. Wait for Cloudflare's build of `main` to finish. Cloudflare reports it as a check on the latest commit: `gh api repos/{owner}/{repo}/commits/main/check-runs --jq '.check_runs[] | [.name, .status, .conclusion] | @tsv'`. Wait for the Cloudflare entry to show `completed` and `success`. (The site's own "Check site" entry is the safety check, not the publish.)
2. Then confirm on the real site. The live address is in `SITE.md` under `## Notes`. Load the changed page (e.g. `curl -s <address>/<page> | grep "<some new text>"`) and check the change is there.
3. Only then tell them: "Done! Your change is live at <address>. If you don't see it straight away, refresh the page."
4. If the Cloudflare check failed, or the change isn't showing after ~5 minutes, say so plainly. The live site stays as it was. Look at the build log in the Cloudflare dashboard (Worker → Deployments / Builds), fix it on a new draft, and preview again.
