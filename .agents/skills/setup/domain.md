# The domain name

A domain is the website's address, like `janesmithpottery.com`. Ask: "Do you already own a domain name you'd like to use?"

## They already own one

1. Ask where they bought it (GoDaddy, Namecheap, Squarespace, Google/Squarespace Domains, Wix…). If they don't know, check `whois <domain>` for the registrar and explain.
2. Before changing anything, **check for email on the domain:** run `dig +short MX <domain>`. If there are results, they get email at this domain. Tell them: "Your email at this address will keep working. Cloudflare copies these settings over, and I'll double-check them before we switch."
3. In Cloudflare: **Add a domain** (or **Websites → Add a site**). Enter the domain and choose the **Free** plan. Cloudflare scans the existing settings.
4. Compare Cloudflare's imported records against the current ones (`dig` for MX, TXT and any other records you can find). Make sure every **MX** and **TXT** record is there. If any are missing, have them add them before continuing. **Don't delete any records**, apart from old website ones that would clash with the new site at the root or `www`.
5. Cloudflare shows two **nameservers**. Open their registrar's website (they sign in) and help them find **Nameservers** (sometimes under DNS or Advanced). Change it to "custom" and enter Cloudflare's two.
6. Wait for Cloudflare to say the domain is **Active**. This can take from minutes to a few hours, so they can come back later. Note in `SETUP-PROGRESS.md` that you're waiting.
7. Then attach the domain to the site (see "Attach the domain" below).

If the domain is with Wix or Squarespace and its email is through them, be extra careful with step 4. If unsure, suggest asking their helper before switching.

## They need a new one

1. Brainstorm a few short options together: their name, or business name plus `.com`, `.co.uk`, `.design`, etc.
2. In Cloudflare, go to **Domain Registration → Register Domains** and search. Cloudflare sells domains at cost with no markup. Typical prices are about $10–15 a year for `.com`, and more for some endings.
3. **Before buying,** say exactly: "`<domain>` costs **$<price> per year** from Cloudflare, and renews automatically each year. Do you want to buy it?" Only continue on a clear yes.
4. They enter their payment and contact details themselves. Turn on **auto-renew** so they never lose it, and keep the default free privacy protection.
5. The domain is added to Cloudflare automatically.

## Attach the domain to the site

1. In Cloudflare, open the site's Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
2. Add `<domain>`, then add `www.<domain>` too.
3. Wait a few minutes, then open both addresses to check they load.
4. Record the domain in `SETUP-PROGRESS.md` and in `SITE.md` under `## Notes`.
