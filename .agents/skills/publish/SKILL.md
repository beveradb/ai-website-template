---
name: publish
description: Use when the owner says a previewed change is ready to go live - "make it live", "publish", "looks good, go ahead", "put it on the website". Makes the current draft live on the real website.
---

# Making a change live

**Without `gh`** (cloud mode): use your app's GitHub tools for the same steps, i.e. find the pull request, confirm its latest commit matches the one previewed, and merge it. If your tools can't merge, use the owner-click fallback below with the pull request's web link. Then check it's live by loading the live page.

## Before you publish

1. Confirm you've shared a preview link for this draft and they've said to make it live. If not, share the preview first (AGENTS.md section 3) and wait.
2. Find the draft's number. If several drafts are open (`gh pr list`), ask which one, describing each in plain words. Use that number `<n>` in every command below.
3. Make sure it's still exactly what they saw: `gh pr view <n> --json headRefOid -q .headRefOid` must equal the commit you noted when you shared the preview. If it changed (e.g. someone else added to it), share a fresh preview and ask again.
4. Make sure the safety check passed **for that draft**: in `gh pr checks <n>`, "Check site" must show pass. If you're on that draft locally, also run `node scripts/check.mjs`.
5. Make sure everything is saved: `git status` shows nothing to commit, and `git push` is up to date.

## Publish

If it's marked as a GitHub "draft" pull request, run `gh pr ready <n>` first.

```
gh pr merge <n> --squash --delete-branch --match-head-commit <the commit they approved>
git checkout main && git pull
```

**If the merge fails because of permissions or settings,** fall back to the owner doing it:

1. Re-check step 3: the draft must still be exactly the approved commit. Then get its link: `gh pr view <n> --json url -q .url`.
2. Say: "One last click from you: open this link, scroll down, click the green **Merge** button, then **Confirm**. Tell me when you've done it." If anything new appears on that draft before they click, stop and preview again.
3. When they say it's done, check with `gh pr view <n> --json state -q .state` (should be `MERGED`), then `git checkout main && git pull`.

## Check it's live

Cloudflare publishes the change, usually within 1–2 minutes. Don't say it's live until you've confirmed it:

1. Wait for Cloudflare's build of `main` to finish. Cloudflare reports it as a check on the latest commit: `gh api repos/{owner}/{repo}/commits/main/check-runs --jq '.check_runs[] | [.name, .status, .conclusion] | @tsv'`. Wait for the Cloudflare entry to show `completed` and `success`. (The site's own "Check site" entry is the safety check, not the publish.)
2. Then confirm on the real site. The live address is in `SITE.md` under `## Notes`. Load the changed page (e.g. `curl -s <address>/<page> | grep "<some new text>"`) and check the change is there.
3. Only then tell them: "Done! Your change is live at <address>. If you don't see it straight away, refresh the page."
4. If the Cloudflare check failed, or the change isn't showing after ~5 minutes, say so plainly. The live site stays as it was. Look at the build log in the Cloudflare dashboard (Worker → Deployments / Builds), fix it on a new draft, and preview again.
