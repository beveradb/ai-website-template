# Lessons and changes

Newest first. Each entry: what changed in the template, and why. Assistants read the entries newer than a site's current version when running **update-from-template**, and summarise them for the owner.

## 2026-11-10 v0.1.0: First version

- First release of the template:
  - shared instructions for Claude and ChatGPT/Codex (`AGENTS.md` + skills)
  - guided setup from zero (accounts, security, Cloudflare, domain)
  - a draft → preview → "make it live" workflow, with undo
  - template updates
  - optional helper access
- Hosting uses Cloudflare Workers static assets with Workers Builds, because Cloudflare now recommends Workers over Pages for new projects. Preview links come from Workers Builds' non-production branch builds.
- Photos: local mode (the site folder on the owner's computer) is the default, because chat attachments in cloud sessions may not be saved as files.
