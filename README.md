# AI website template

Make a website you **own**, and change it just by chatting with an AI assistant: **Claude** or **ChatGPT**. No WordPress, no website builder subscription, no technical knowledge needed. Hosting is free on Cloudflare. Every change gets a preview link before it goes live.

- **Want a website?** → [Start here](docs/START-HERE.md)
- **Helping a friend set one up?** → [Guide for helpers](docs/HELPERS.md)

## How it works

```
You ask for a change in the Claude or ChatGPT app
  → the assistant edits your website's files and saves a draft (GitHub)
  → Cloudflare builds a preview link for the draft
  → you check it and say "make it live"
  → the change is published to your real website
```

## What's in here

| Path | What it is |
|---|---|
| `AGENTS.md` | The rules every AI assistant follows when working on the site (`CLAUDE.md` points Claude to it) |
| `.agents/skills/` | Step-by-step skills: `setup`, `create-site`, `edit-site`, `publish`, `undo`, `update-from-template`, `add-helper` (linked into `.claude/skills/` for Claude) |
| `site/` | The website itself: a placeholder starter until the first version is made |
| `SITE.md` | The site's own map, kept up to date by the assistant |
| `wrangler.jsonc` | Cloudflare hosting settings |
| `template-manifest.json` | Which files come from the template, so sites can get updates safely |
| `scripts/`, `tests/` | The repo checker and the template updater (Node, no dependencies) |
| `docs/` | Guides, plus `LESSONS.md`: the change history |

## Development

```
node --test
node scripts/check.mjs
```

Both run in GitHub Actions on every push. See [HELPERS.md](docs/HELPERS.md#improving-the-template) for how to release template improvements.
