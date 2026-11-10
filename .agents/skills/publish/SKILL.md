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

1. Cloudflare publishes the change, usually within 1–2 minutes. Watch with `gh run list --limit 1` or `gh api repos/{owner}/{repo}/commits/main/check-runs`, or load the live page and look for the change.
2. The live address is in `SITE.md` under `## Notes` (their domain), or ask Cloudflare's dashboard.
3. Tell them: "Done! Your change is live at <address>. It may take a minute to show up. If you don't see it, refresh the page."
4. If the live build failed, say so plainly. Then look at the failure (`gh run view --log-failed`, or the Cloudflare dashboard build log), fix it on a new draft, and preview again. The live site stays as it was until a good build succeeds.
