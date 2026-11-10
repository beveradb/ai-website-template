---
name: create-site
description: Use to make the first version of a website, or a complete redesign - by interviewing the owner and building something new, by rebuilding an existing website they point to, or by making an original site inspired by one they like. Usually run from the setup skill.
---

# Making the first version of the website

## 1. Choose the starting point

Ask: "How would you like to start?

1. **From scratch:** I'll ask you some questions and design something for you.
2. **Rebuild your current website:** give me its address and I'll recreate it here, so you're free of whatever it's on now.
3. **Inspired by a site you like:** give me its address and I'll make you an original site with a similar feel."

They can combine these, e.g. rebuild their old site and give it the feel of another. Then:
- For 1, follow the interview in `interview.md` in this folder.
- For 2 or 3, ask for the address, then do the short interview anyway: purpose, audience, and anything they want different.

## 2. Gather the content

**Rebuild (2):**
1. Fetch the home page, then every page linked from it on the same domain, following links up to a few levels deep. Skip shop, cart, login, admin, and tag/archive listing pages.
2. Save the real text content of each page. **Check it's theirs to use:** ask the owner about anything that looks like someone else's, e.g. stock photos, testimonials quoted from elsewhere, or other people's logos. Leave out or replace anything that isn't theirs.
3. Download the images that are part of the content (not tracking pixels or icons from other sites) into `site/images/` with tidy names.
4. Note the colours, fonts, layout and overall mood.
5. Keep a list of anything that can't be carried over to a simple website: online shops, booking systems, member logins, comments, forms that send email. Tell the owner about these, and suggest simple replacements, e.g. a "book with me" link to a booking service, or an email link instead of a form.

**Inspired by (3):**
1. Study the site's structure (which sections, in what order), its mood, layout style, spacing and type feel.
2. **Do not copy** its text, photos, logos, icons or anything distinctive to that brand. Say to the owner: "I'll borrow the general feel and layout, but everything on your site will be your own words and photos."
3. Gather the owner's own content through the interview.

**Photos from the owner:** use the photo steps in the **edit-site** skill. If they don't have photos yet, use clearly-marked placeholders, and list what photos would help.

## 3. Decide how to build it

Follow `docs/choosing-a-stack.md`. For most sites, the starter's plain HTML/CSS in `site/` is right. Replace the starter's placeholder content entirely.

## 4. Build it

1. Start a draft: `change/first-version`.
2. Set the design tokens at the top of `site/styles.css` first: colours, fonts, spacing, corner rounding. Then build pages using only those tokens.
   - For a rebuild, match the old site's look by default, but cleaner. Offer a refresh only if they want one.
3. Each page:
   - a proper `<title>` and meta description
   - real headings in order
   - `alt` text on images
   - works on a phone
   - a working navigation menu on every page
4. Add a favicon if they have a logo. Otherwise use a simple letter-mark built from the design tokens.
5. Fill in **every section of `SITE.md`**. Future sessions depend on it.
6. Run `node scripts/check.mjs` and fix all problems.
7. Share the preview link (AGENTS.md section 3) with a short tour: "Here's the first version: <link>. It has a home page with…, an about page with…. What would you like changed?"

## 5. Polish together

Make their changes on the same draft, sharing the preview each time, until they're happy. Then follow **publish** (or, during setup, return to the setup skill, which handles going live).
