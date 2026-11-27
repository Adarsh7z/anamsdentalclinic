# Go-live checklist: getting Dr. Anam's Dental onto Google and AI search

The website itself is ready to be read by Google, Bing, ChatGPT, Claude, Perplexity and Google's AI answers. It already has:

- `robots.txt`, which invites search engines and AI assistants in by name.
- `sitemap.xml`, a list of all 18 public pages.
- `llms.txt`, a plain summary of the clinic's facts for AI assistants.
- Structured data (schema.org) on every page: clinic, doctor, opening hours, treatments, FAQs and breadcrumbs.
- An IndexNow key file so Bing can be told when pages change.

What is left can only be done once the domain is bought. Do the steps in order. Expect 2 to 8 weeks before the clinic shows up reliably. Nobody can promise a ranking.

---

## 1. Connect the domain and switch the address

1. In Cloudflare: **Workers & Pages → the site → Custom domains → Set up a custom domain**.
2. In the site folder, run this command. Use the real domain, starting with `https://`:

   ```
   node tools/set-domain.mjs https://www.your-domain.in
   ```

   It changes every canonical link, share tag, schema block, the sitemap, robots.txt and llms.txt in one go.
3. Commit, push and deploy.
4. Open `https://www.your-domain.in/robots.txt` and `/sitemap.xml` and check they show the new address.

## 2. Let AI crawlers in at Cloudflare (important)

Since July 2025, Cloudflare **blocks AI crawlers by default** on new domains. If you skip this step, ChatGPT and the others cannot read the site, whatever robots.txt says.

1. Cloudflare dashboard → your domain → **Security → Bots** (it may be called **AI Crawl Control**).
2. Turn **off** "Block AI bots" / "AI Scrapers and Crawlers", or set it to **Allow**.
3. If there is a "Manage robots.txt" option, keep it **off**. The site has its own robots.txt.
4. Check that **Bot Fight Mode** is not blocking verified bots.

## 3. Google Search Console (Google and Google's AI answers)

1. Go to https://search.google.com/search-console and add a **Domain** property.
2. Google gives you a **TXT record**. Add it in Cloudflare under **DNS → Records → Add record**: type `TXT`, name `@`, and the value Google gives you. Add it yourself. Nobody else should change DNS for you.
3. Click **Verify**.
4. Go to **Sitemaps** and submit `sitemap.xml`.
5. Use **URL Inspection** on the home page and on `/treatments`, then click **Request indexing**.

## 4. Bing Webmaster Tools (Bing, ChatGPT search and Copilot)

ChatGPT search draws heavily on Bing's index, so this step matters.

1. Go to https://www.bing.com/webmasters and choose **Import from Google Search Console**. This is the quickest way. You can also verify with a DNS TXT record.
2. Submit `sitemap.xml`.
3. After every deploy that changes pages, run this from the site folder:

   ```
   node tools/indexnow.mjs
   ```

   A reply of 200 or 202 means Bing accepted it.

## 5. Google Business Profile (the most important step for local search)

Most "dentist near me" searches and AI answers read the Google Business Profile, not just the website.

1. Go to https://business.google.com and create the profile **once the clinic is open**. Google verifies the address with a postcard or a video.
2. Use **exactly** these details everywhere, character for character:
   - Name: `Dr. Anam's Dental`
   - Address: `6th Floor (Unit 612), Fairmount Downtown Building, X Road, Doolapally Road, Sri Ganesh Nagar, Bolarum, Secunderabad, Telangana 500100`
   - Phone: `040-27638169`
   - Hours: Monday to Saturday, 10:00 AM to 7:00 PM. Closed on Sunday.
   - Website: the new domain
3. Primary category: **Dentist**. Extra categories, only where a dentist on the team does it: Cosmetic Dentist, Dental Implants Provider, Endodontist, Orthodontist, Pediatric Dentist, Prosthodontist, Oral Surgeon.
4. Add the services one by one, using the same names as on the Treatments page.
5. Upload the real clinic photos when they are ready.
6. Ask real patients for reviews after their visit. Never buy reviews or write them yourself; Google removes them and can suspend the profile.

## 6. Directories (where AI assistants also look)

List the clinic with the **same name, address and phone** on:

- Practo (practo.com), the most important one for Indian dental searches
- Justdial
- Bing Places (https://www.bingplaces.com). You can import it from Google Business Profile.
- Apple Business Connect (https://businessconnect.apple.com) for Apple Maps and Siri
- Lybrate and Sulekha (optional)

## 7. After the profiles exist: link them in the schema

When the Google Business Profile, Practo and other pages are live, add their links to the clinic schema as `"sameAs": [ ... ]`. This tells search engines that the profiles all belong to the same clinic. Ask Claude to do it, giving the real profile links.

## 8. Before launch: confirm these facts

- **Invisalign®**: Align Technology lets only active Invisalign providers use the name. Confirm that the clinic's orthodontist is an active Invisalign provider. If not, change "Invisalign" to "clear aligners" on the braces page, the FAQ and llms.txt.
- **Specialist team**: the site says there are specialist dentists for each branch (root canals, braces, kids, gums, oral surgery). Keep that true as the team is hired.
- **Photos**: replace the AI placeholder photos with real clinic and doctor photos.

## 9. Check again after 30 days

1. In Search Console, check **Pages** (are pages indexed?) and **Performance** (which searches show the clinic?).
2. Ask ChatGPT, Google (AI Mode) and Perplexity questions such as "dentist near Kompally", "root canal treatment in Bolarum" and "kids dentist Secunderabad". Note whether the clinic appears and which sources are cited. Results change from one try to the next, so look at the trend over a few months, not a single answer.
