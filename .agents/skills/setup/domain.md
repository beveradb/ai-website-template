# The domain name

A domain is the website's address, like `janesmithpottery.com`. Ask: "Do you already own a domain name you'd like to use?"

## It's already in their Cloudflare account

Check first: if the domain shows under **Domains** in their Cloudflare dashboard and is **Active**, skip the nameserver steps below.
1. List its records (**DNS → Records**) and note the email ones (MX, TXT, `_domainkey`, `autodiscover`). Don't touch them.
2. **Mail check:** follow each MX record's target, and any CNAME it points through. If any of them is the domain itself (`@`) or `www`, stop and ask their helper. Attaching the website there would break email.
3. List every domain and subdomain the website should answer on, and get the owner's OK.
4. For each one, in turn:
   - If an old website (another Worker or Pages project) has it, remove it there (**Workers & Pages** → that project → **Domains** / **Custom domains**).
   - Then **immediately** attach it to the new site ("Attach the domain" below). If it was pointed at an outside website by DNS records instead, that step replaces those records.

   One at a time keeps the gap to seconds.
5. Check each address loads the new site, and that the MX records are unchanged.

## It's registered with Cloudflare, but in someone else's Cloudflare account

For example, a family member bought it for them and it should now be theirs. Cloudflare can move the registration between accounts. Nobody needs to share a password: the other account holder starts the move, and the owner accepts it.

**Before the move, set everything up in the owner's account,** so nothing breaks:
1. Add the domain as a website in the owner's account and **finish the add-site steps**: choose the **Free** plan, then **Continue to activation**. It should show as *pending*. The move is refused while it's still setting up.
2. Copy every DNS record from the old account's zone, especially the email ones (MX, TXT for SPF/DKIM/DMARC, `_domainkey` and `autodiscover` CNAMEs).
3. If email forwarding (Email Routing) is used, recreate the same destination addresses and rules. Destinations get a verification email. Email Routing itself can only be **turned on** after the domain is active, so do that straight after the move.
4. So the website works the moment the domain arrives, attach it now. Add the site's Worker routes (`<domain>/*`, and `www.<domain>/*` if wanted), plus a proxied `AAAA` record with content `100::` for each hostname. The Worker route serves the site; the record only makes the hostname resolve.
5. Note the owner's **account ID** (on their Cloudflare home page, or in the dashboard address).

**The move:**
1. The current account holder opens the domain (**Domain Registration → Manage**), chooses **Move to another account**, enters the owner's account ID twice, and ticks the two acknowledgements. Leave any other settings, like auto-renew, as they are.
2. In the owner's account, go to **Domain Registration → Registrations**. Open the pending domain (**Manage**, which leads to the Action Center) and click **Accept**. They have 5 days.
3. The nameservers usually switch within minutes, though Cloudflare says up to 8 hours. Once the zone is **Active**, turn on Email Routing, check every address loads the site, and send a test email.
4. The old account's zone becomes *moved* and can't be deleted (Cloudflare clears it). Old Workers or routes there can be removed. The domain can't be moved again for 30 days.

## They already own one, elsewhere

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

   Cloudflare's import often misses some. Add any that are missing before continuing, copied exactly.
   - **Mail records must be "DNS only"** (grey cloud, not orange). That includes `mail`, `autodiscover`, and any name an MX record points to. A proxied mail hostname stops email working.
   - If an **MX record points at the domain itself** (`@`) or at `www`, or at a name that is itself a CNAME to `@` or `www` (follow the chain), stop and ask their helper. That setup needs mail moving to its own hostname first.
   - **Keep the old website records for now.** They're replaced in "Attach the domain", so the site stays reachable in between.
6. **Check DNSSEC first.** Run `dig +short DS <domain>` (Mac) or `Resolve-DnsName <domain> -Type DS` (Windows), or look for "DNSSEC" in the registrar's settings. If it's on, have them **turn DNSSEC off at the registrar**. Then wait until `dig +short DS <domain>` returns nothing, plus at least another 24–48 hours for old copies to expire, before changing nameservers. Switching while it's on can take the website *and email* offline. Note the wait in `SETUP-PROGRESS.md`. After the domain is Active in Cloudflare, turn DNSSEC back on there (**DNS → Settings → DNSSEC**) and add the DS record it shows at the registrar.
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

1. In Cloudflare **DNS → Records**, delete the old website records at the root (`@`) and `www` (A, AAAA or CNAME) that would clash. Show the owner first, and never delete mail records. Do this straight before step 2, so the gap is seconds.
2. In Cloudflare, open the site's Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
3. Add `<domain>`, then add `www.<domain>` too.
4. Wait a few minutes, then open both addresses to check they load.
5. Record the domain in `SETUP-PROGRESS.md` and in `SITE.md` under `## Notes`.
