# Lance McHan — website

Static, five-page marketing site built with vanilla HTML, CSS and JavaScript.
No build step, no dependencies: serve the directory as-is.

## Pages
| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, services overview, process, reviews notice, FAQ preview, quote form |
| `services.html` | How working with Lance works, in detail |
| `reviews.html` | Reviews policy + "share your experience" form |
| `faq.html` | Full FAQ |
| `contact.html` | Contact details + quote request form |

## Assets
- `assets/css/styles.css` — all styles (mobile-first, single accent colour for actions)
- `assets/js/main.js` — mobile nav, `_page` hidden field, fetch form submission, confirmation messages
- `favicon.svg` — favicon placeholder

## Contact details used throughout
- Phone: (209) 986-9292 — `tel:+12099869292`
- Email: lance@lancemchan.com

## Forms
Every form posts to LeadrVision:

```
https://vision.leadrai.com/api/forms/c210a3fc5d063e01e79c357d8eb8c4f1
```

Each form includes `_form` (form name), `_page` (set to `window.location.href` on load)
and a hidden `_gotcha` honeypot. Forms work without JavaScript via a normal POST, which
returns to the page with `?submitted=1`; with JavaScript they submit via `fetch()` to the
same URL and show the confirmation inline.

## Content note
No testimonials, ratings, years in business, licences or service-area claims are published,
because none were supplied. The reviews page collects real client feedback instead.
