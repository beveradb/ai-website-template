# Account security and recovery

The goal: if they forget a password or lose their phone, they can still get back in, and nobody else can. Do these with every new or existing account during setup. Ask them to confirm each step ("Done?"), and **never** ask them to tell or paste you anything.

## 0. A password manager (once)

Ask: "Where do you keep your passwords?" Gently steer them to a password manager if they don't use one:
- **iPhone/Mac:** the built-in **Passwords** app (synced with iCloud). It can also generate two-step codes.
- **Android/Windows with Chrome:** **Google Password Manager**, built into Chrome.
- Or a dedicated one: **Bitwarden** (free) or **1Password**.

A notes app, a document, an email to themselves, or the same password everywhere is not safe.

## 1. An authenticator for two-step login (once)

Two-step login means signing in needs the password **and** a 6-digit code from their phone. Recommend one of:
- Apple **Passwords** app (iPhone/Mac, synced with iCloud)
- **Google Authenticator**, with cloud backup turned on
- **Microsoft Authenticator**

It must be backed up or synced, so a lost phone isn't a disaster.

## GitHub

1. **Password saved:** confirm the GitHub password is in their password manager.
2. **Two-step login:**
   1. Open https://github.com/settings/security and click **Enable two-factor authentication**.
   2. Choose **Authenticator app**, scan the QR code with their authenticator, and type in the 6-digit code.
3. **Recovery codes:** GitHub shows them next. Have them **download** them, then save them as a secure note in their password manager, or print them and keep the copy somewhere safe. Explain: "These are your spare keys if you ever lose your phone."
4. **Passkey (recommended):** on the same security page, under **Passkeys**, click **Add a passkey** and use Touch ID, Face ID or Windows Hello. Next time they can sign in with their fingerprint or face. GitHub still needs the authenticator app as well.
5. **Recovery email:** at https://github.com/settings/emails, add a second email address if they have one.

## Cloudflare

1. **Password saved:** confirm the Cloudflare password is in their password manager.
2. **Two-step login:**
   1. Click the profile icon (top right), then **My Profile** → **Authentication**.
   2. Under two-factor authentication, set up the authenticator app (scan, type the code).
   3. Optionally also add a **security key**: Touch ID or Windows Hello.
3. **Backup codes:** Cloudflare shows backup codes. Save them the same way as GitHub's.

## Their AI app account

Mention it once: the Claude or ChatGPT account should also have a saved password (or "Sign in with Apple/Google"), and two-step login turned on in its settings.

When done, tick the step in `SETUP-PROGRESS.md`, with no details.
