# Kashti Educare: static website (HTML · CSS · JS)

A plain static site. No framework and no build step: open `index.html` in a browser, or upload the folder to any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages, cPanel).

```
index.html          Home: year-stage hero, partner strip, visionaries, 8 pathways, formats, 3-step planner,
                    See-Build-Become, notice board (updates / expeditions / downloads), testimonials, CTA
why-kashti.html     What we stand for, institution outcomes, NEP 2020 alignment
people.html         Founder, advisors, open council seats, council structure
programs.html       8 themes + the full 53-programme catalogue (filters, search, detail view, FAQ)
experiences.html    Orient → Immerse → Build → Transform, and See → Build → Become
formats.html        90 min → 1 day → 2–4 days → 5–7 days → Annual
institutions.html   Learning ecosystem + Education & Experience Council
partners.html       Who we partner with, why, partner logos
gallery.html        30 field photos, filters and a full-screen viewer
contact.html        Enquiry form (reads ?intent=, ?program=, and plans sent from the planner)
css/styles.css      All styles (colour tokens are at the top)
js/data.js          ALL editable content: notices, downloads, programmes, partners, gallery, FAQ…
js/main.js          Rendering and interactions
```

## Everyday edits (all in `js/data.js`)

- **Post a notice:** add a line at the top of `notices` (date, tag, title, link).
- **Attach a PDF:** put the file in a `downloads/` folder and set `url: "downloads/your-file.pdf"`. Until a URL is set, the link opens an email request instead.
- **Add or change a programme:** edit `programmes`. Each one has `aud` (`school` or `he`), `formats` (`one`, `multi`, `res`, `intl`) and `themes`. Filters, counts and links update automatically.
- **People:** edit `people` in data.js. To add a headshot, put a square photo in `images/people/` and set `photo: "images/people/name.jpg"` (no leading slash, so it loads from this folder) (until then each person shows coloured initials). Copy a block to add someone; `group` is `founder` or `advisor`. Open seats live in `peopleUpcoming`.
- **Hero calendar (the year stage):** the sample year is `roadmap` in data.js (one programme per month). Each month's look (sky, land, light, particles, silhouette) is set in the `MOODS` table near the top of the stage section in `js/main.js`. The stage plays itself after a short sunrise, pauses on hover or when a visitor picks a month, and stays still for visitors who prefer reduced motion. It sleeps when scrolled off-screen or in a background tab, and on devices that can't hold the frame rate the particles drop to 1x resolution automatically.
- **Stats:** the numbers in `stats` come from the site's own content (53 programmes, 18 partners, 8 STEM circuits, 5 formats). Swap in verified figures (students reached, mentors, etc.) when you have them.

## Enquiry form

With `config.formEndpoint` empty, the form opens the visitor's email app with everything filled in, addressed to engage@kashtieducare.com. To receive enquiries directly, paste a Formspree / Getform / Google Apps Script web-app URL into `formEndpoint`. The form POSTs standard form data (`role, name, org, email, phone, programme, learners, message, consent`).

## Images

Photos and logos currently load from the live site (`https://kashtieducare.com/images/...`). To self-host them:

1. Copy `public/images/` (and `public/logo.jpeg`) from the Next.js repo into this folder.
2. In `js/data.js` set `img: ""`.
3. Find and replace `https://kashtieducare.com/images/` with `images/` across the `.html` files.

Photos are shown whole (never cropped): each frame shows the full image, with a soft blurred copy filling any spare space. If an image can't load, the page shows a tinted placeholder with its caption, so the layout never breaks.

## Before launch, please review

- **Bios on the People page** were compiled from public sources (rishibhatnagar.in, coachsisodia.com, Muni International School coverage). Karan's LinkedIn couldn't be read, so his bio is written from Kashti's own story. Please confirm all four before launch.
- **FAQ answers** (`faq` in data.js). The live site lists the questions but not the answers, so these were written from the site's own content. Fees, lead times and post-programme reports are kept general.
- **Logo.** Every page uses the official `logo.jpeg` from kashtieducare.com. If that file can't load, the site falls back to a built-in wordmark.
- **Testimonials.** Add student and teacher feedback to `testimonials` in data.js (`who: "student"` or `"teacher"`). Only one real quote exists so far.
- **Partner strip.** The running strip uses the 18 logos already on the live site. Add brochure partners (ATMC, Decathlon, Signzy, Mukand, NIDHI, etc.) to `partners` in data.js once their logo files are in `images/logos/`.
- **Social links.** None exist on the live site, so none were added.
- **Left out on purpose.** The mockups contain sample content that isn't on the live site: named principals and testimonials, expert profiles (Dr. Arvind Mehta, etc.), stats like "25,000+ students", partner logos such as Amity, IISc, Tata Technologies and Dubai Holding, the MSIT and Shri Vishwakarma awards, and placeholder contact details. The layouts for these are all built. Add real entries to `testimonials`, `stats` and `partners` in data.js as they're confirmed.
