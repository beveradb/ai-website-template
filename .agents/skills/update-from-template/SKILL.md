---
name: update-from-template
description: Use when the owner or their helper asks to "update your instructions", "update from the template" or "get the latest template", or when check.mjs says skill links are broken. Brings in the latest assistant instructions, skills and scripts from the template without touching the website's own content.
---

# Updating from the template

The template (https://github.com/beveradb/ai-website-template) improves over time. This brings those improvements into this site. Only template-owned files (listed in `template-manifest.json`) change. The site's pages, photos, `SITE.md` and settings are never touched.

1. Download the latest template into a temporary folder **outside** this site:
   - Mac: `T=$(mktemp -d) && curl -sL -o "$T/t.zip" https://github.com/beveradb/ai-website-template/archive/refs/heads/main.zip && tar -xf "$T/t.zip" -C "$T" --strip-components 1`
   - Windows (PowerShell): `$T = New-Item -ItemType Directory -Path (Join-Path $env:TEMP ("tpl-" + [guid]::NewGuid())); curl.exe -sL -o "$T\t.zip" https://github.com/beveradb/ai-website-template/archive/refs/heads/main.zip; tar -xf "$T\t.zip" -C "$T" --strip-components 1`
2. Compare versions: `"version"` in this site's `template-manifest.json` against the downloaded one. If they're the same and `node scripts/check.mjs` passes, say "Your instructions are already up to date", clean up the temp folder, and stop.
3. Make sure nothing is half-done: `git status --porcelain` must be empty. If it isn't, finish or park the current change first (AGENTS.md section 3). Then start a draft: `git checkout main && git pull && git checkout -b change/template-<new-version>`.
4. Apply it: `node <tempdir>/scripts/update-from-template.mjs <tempdir> .`. Use the **new** template's script, so fixes to the updater itself apply.
5. Run `node --test` and `node scripts/check.mjs`. Both must pass. If they don't, stop and throw the draft away: `git reset --hard && git checkout main && git branch -D change/template-<new-version>`. This is safe because nothing was shared yet, and site files weren't touched. Then tell the owner to let their helper know.
6. Read the new entries in `docs/LESSONS.md` (those newer than the old version). If any has an **Existing sites** section, make those changes to the site's own files on this same draft, exactly as described, then run the checks again. Tell the owner in 2–3 plain lines what's improved.
7. Commit, push, open the draft, and share the preview link as usual. The website should look exactly the same. Say so. Then wait for the OK, and **publish**.
8. Delete the temporary folder.
