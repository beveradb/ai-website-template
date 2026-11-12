# Start here: make your own website with AI

This guide helps you make a website that **you own**, and that you change just by chatting with an AI assistant. You don't need to know anything technical.

## What you'll get

- A website at your own address (like `yourname.com`)
- Free hosting (no monthly fee for the website itself)
- Any change, any time: just ask the assistant. You always see a **preview** before anything changes on your real site.

## What it costs

| What | Cost |
|---|---|
| Claude **Pro** or ChatGPT **Plus** (the AI assistant) | about $20 a month |
| Hosting (Cloudflare) | free |
| GitHub (stores your website's files) | free |
| Your domain name, if you need a new one | about $10–15 a year |

## What you'll need

- A Mac or Windows computer
- About an hour (you can stop and carry on later)
- Your phone, for two-step login codes
- A payment card, if you're buying a new domain name

## Step 1: Install the AI app

Install **one** of these and sign in:
- **Claude:** https://claude.ai/download (you need a Pro plan or higher)
- **ChatGPT:** https://chatgpt.com/download (you need a Plus plan or higher)

## Step 2: Make a folder for your website

Make a new, **empty** folder for your website, for example:
- Mac: a folder called `My Website` in your **Documents**
- Windows: a folder called `My Website` in **Documents**

## Step 3: Open the folder in the app's coding mode

The assistant needs to be able to work with files in that folder:
- **Claude:** click **Code** at the top of the app, choose **Local**, and select your `My Website` folder.
- **ChatGPT:** switch to **Codex**, choose **Local**, and select your `My Website` folder.

If the app asks for permission to read and change files in that folder, say yes.

**Permission mode (Claude app):** the menu next to the model name at the bottom of the window is usually set to **Auto**. Leave it there. If the assistant says the app blocked a step, switch it to **Manual**, tell the assistant to try again, and approve the step when asked. Don't use **Bypass permissions**.

You may see a **Changes** panel with a **Create PR** button on the right. You can ignore it. The assistant handles all of that for you.

## Step 4: Paste this message

Copy this whole message, paste it into the app, and press Enter:

```
Please set up my website. Download https://github.com/beveradb/ai-website-template/archive/refs/heads/main.zip and unzip its contents directly into this folder (not into a subfolder) — on a Mac use `curl -L -o template.zip <url> && tar -xf template.zip --strip-components 1 && rm template.zip`, on Windows use `curl.exe -L -o template.zip <url>; tar -xf template.zip --strip-components 1; del template.zip`. Then read AGENTS.md and follow the setup skill in .agents/skills/setup/SKILL.md step by step with me. I'm not technical, so please keep things simple and go one step at a time.
```

The assistant takes it from there. It will guide you through everything, and tell you whenever it needs you to click or type something.

## Joining a website that already exists

If someone has already set up your website and added you to it, use this message in Step 4 instead (replace the link with your website's GitHub link):

```
Please set up my existing website on this computer. It's at https://github.com/OWNER/SITE. Download https://github.com/beveradb/ai-website-template/archive/refs/heads/main.zip and unzip its contents directly into this folder (not into a subfolder) — on a Mac use `curl -L -o template.zip <url> && tar -xf template.zip --strip-components 1 && rm template.zip`, on Windows use `curl.exe -L -o template.zip <url>; tar -xf template.zip --strip-components 1; del template.zip`. Then read AGENTS.md and follow the "Joining an existing website" part of .agents/skills/setup/SKILL.md with me. I'm not technical, so please keep things simple.
```

## Important: keep your passwords to yourself

The assistant will **never** need your passwords, two-step codes or recovery codes. When a website asks for one, *you* type it in. If anything ever asks you to paste a password into the chat, don't.

## If you get stuck or need a break

Close the app whenever you like. To carry on, open the app again in your `My Website` folder (Step 3) and say:

> Let's continue setting up my website.

## After setup: changing your website

Open the app in your website folder, and ask for what you want, e.g.:

- "Change my phone number to 555 1234."
- "Add these photos to my gallery."
- "Add a page about my workshops."

You'll get a **preview link**. When you're happy, say **"make it live"**. Don't like it? Say **"undo"**.
