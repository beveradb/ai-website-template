# The domain name

A domain is the website's address, like `janesmithpottery.com`. Ask: "Do you already own a domain name you'd like to use?"

## They already own one

1. Ask where they bought it (GoDaddy, Namecheap, Squarespace, Google/Squarespace Domains, Wix…). If they don't know, look up the registrar with `whois <domain>` (Mac) or https://lookup.icann.org.
2. Before changing anything, **check for email on the domain**:
   - Mac: `dig +short MX <domain>`
   - Windows: `Resolve-DnsName <domain> -Type MX`

   If there are results, they get email at this domain. Tell them: "Your email at this address will keep working. I'll make sure the email settings come across before we switch."
3. **Take a full copy of the current settings first.** Open their registrar or DNS provider's DNS page together (they sign in), and export it or take screenshots of every record: type, name and value. Looking up records with `dig` can't list them all.
4. In Cloudflare: **Add a domain** (or **Websites → Add a site**). Enter the domain and choose the **Free** plan. Cloudflare scans the existing settings.
5. Compare Cloudflare's imported records against the full copy from step 3. Every record must be there, especially:
   - **MX** and **TXT** records
   - CNAMEs like `*._domainkey`, `autodiscover` and `mail`
   - **SRV** records

   Cloudflare's import often misses some. Add any that are missing before continuing, copied exactly. The only records to remove are old *website* records at the root (`@`) or `www` that would clash with the new site, and only after showing the owner.
6. **Check DNSSEC first.** Run `dig +short DS <domain>` (Mac) or `Resolve-DnsName <domain> -Type DS` (Windows), or look for "DNSSEC" in the registrar's settings. If it's on, have them **turn DNSSEC off at the registrar** and wait **at least 24 hours** before changing nameservers. Switching while it's on can take the website *and email* offline. Note the wait in `SETUP-PROGRESS.md`. After the domain is Active in Cloudflare, turn DNSSEC back on there (**DNS → Settings → DNSSEC**) and add the DS record it shows at the registrar.
7. Cloudflare shows two **nameservers**. Open their registrar's website (they sign in) and help them find **Nameservers** (sometimes under DNS or Advanced). Change it to "custom" and enter Cloudflare's two.
8. Wait for Cloudflare to say the domain is **Active**. This can take from minutes to a few hours, so they can come back later. Note in `SETUP-PROGRESS.md` that you're waiting.
9. Then attach the domain to the site (see "Attach the domain" below).

If the domain is with Wix or Squarespace and its email is through them, be extra careful with step 5. If unsure, suggest asking their helper before switching.

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
