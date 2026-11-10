---
name: add-helper
description: Use when the owner wants to give a helper (for example the friend who set the site up) access to work on their website files, or to remove a helper's access. Triggers on "add <name> as a helper", "let <name> help with my website", "give <name> access", "remove <name>'s access".
---

# Adding (or removing) a helper

A helper can work on the website's files from their own computer. They **cannot** access the owner's GitHub account, Cloudflare account, domain or passwords.

Be honest about one thing: with this access, a helper **could** make changes live directly, without the owner seeing a preview first. GitHub's free plan can't block that for private websites. It works on trust: helpers agree to use drafts and previews like everyone else, and the owner can see every change and undo it.

## Add a helper

1. Ask for the helper's **GitHub username**. The helper can tell them; it's not secret.
2. Explain, then ask: "This lets <name> make changes to your website for you. They won't be able to get into your accounts. They'll normally show you a preview first, but they *could* put changes live themselves, so only add someone you trust. You can remove them at any time. Shall I add them?"
3. On a clear yes:
   `gh api -X PUT repos/{owner}/{repo}/collaborators/<username> -f permission=push`
4. Tell them: "Done. <name> will get an email invitation from GitHub and needs to accept it."
5. Add a line to `SITE.md` under `## Notes`: `Helper: <name> (GitHub: <username>), added <date>.` Commit it on a small draft, then publish it, or include it in the next change.

## Remove a helper

1. `gh api -X DELETE repos/{owner}/{repo}/collaborators/<username>`
   - If the invitation was never accepted, also cancel it: find it with `gh api repos/{owner}/{repo}/invitations`, then `gh api -X DELETE repos/{owner}/{repo}/invitations/<id>`.
2. Update `SITE.md` notes.
3. Tell them it's done. They can also see and manage this on GitHub: the repository's **Settings → Collaborators**.
