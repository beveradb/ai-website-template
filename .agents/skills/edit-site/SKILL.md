---
name: edit-site
description: Use for any change to the website - changing or adding text, adding or replacing photos, adding a page, changing colours or fonts, fixing a mistake. Triggers on "change", "update", "add", "fix", "replace", "new photo", "new page" and similar requests about the site's content or look.
---

# Editing the website

Follow the change workflow in `AGENTS.md` section 3 (draft → check → preview link → wait for "make it live"). This skill covers the *what*; AGENTS.md covers the *how it goes live*.

## Before you change anything

1. Read `SITE.md` to find where the thing lives.
2. If the request is vague ("make it nicer"), ask one short question or suggest 2–3 specific options, then do what they choose.
3. Start the draft (`change/<short-description>`).

## Text

- Edit the words in the HTML (or content file, if `SITE.md` says the site uses one).
- Keep their voice. Fix obvious typos only if they'd clearly want it; mention what you fixed.
- If the text also appears elsewhere (page title, meta description, footer), update it there too.

## Photos

Find out which mode you're in. If you can run commands in the site folder on their computer, you're in **local mode**.

**Local mode (best):**
1. Open the images folder for them: `open site/images` (Mac) or `explorer site\images` (Windows).
2. Say: "I've opened your website's photos folder. Drag your photos into it, then tell me when you're done."
3. Look for new files. Give them sensible lowercase names with hyphens, e.g. `garden-party-2026.jpg`. Never use spaces.
4. **Keep the original safe first:** `mkdir -p photo-originals && cp site/images/<file> photo-originals/`. That folder is outside the published site and never uploaded.
5. Then work on the copy in `site/images/`:
   - **iPhone `.heic` photos:** convert them to `.jpg`. On a Mac, run `sips -s format jpeg site/images/in.heic --out site/images/out.jpg`, then delete the `.heic` from `site/images`. On Windows, ask them to export the photo as JPEG.
   - **Shrink large photos** to at most 2000px on the long edge. On a Mac, run `sips -Z 2000 site/images/<file>`. On Windows, use PowerShell with `System.Drawing` to scale and save the image to the same path.
6. Make sure `.gitignore` contains `photo-originals/`, `*.heic` and `*.HEIC`. Add any that are missing.
7. Add the photo to the page with good `alt` text. If you can't tell what's in the photo, ask them.

**Cloud mode** (you can't see their computer):
1. Your chat attachments may not be saved as files. Don't rely on them.
2. Push the draft first, then send them the upload page: `https://github.com/<owner>/<repo>/upload/<draft-branch>/site/images`.
3. Say: "Open this link, drag your photos onto the page, then click the green **Commit changes** button. Tell me when that's done."
4. Pull the draft (`git pull`), then continue from step 3 of local mode. Note that in cloud mode the original photo stays in the draft's history and may briefly appear on a preview link. That's fine for ordinary photos, but suggest local mode for anything private.

## New page

1. Copy the structure of an existing page so the header, footer and styles match.
2. Add it to the navigation on **every** page (or the shared layout, if there is one).
3. Add it to the `## Pages` section of `SITE.md`.

## Look and feel

- To change colours or fonts across the site, change the design tokens at the top of `site/styles.css`. Don't change individual elements.
- For a web font, use Google Fonts (`<link>` in each page's `<head>`) and set `--font-body` / `--font-heading`.
- Check that text stays readable in both light and dark mode.

## Finish

- Run `node scripts/check.mjs` and fix anything it reports.
- Update `SITE.md` if anything moved, or new pages or sections were added.
- Continue with AGENTS.md section 3: commit, push, share the preview link.
