# Advanced Hair Clinics

## Search engine indexing: this site must NOT be indexed

This site is not public. Keep it out of search engines at every layer:

- Every HTML page must include `<meta name="robots" content="noindex, nofollow">` in its `<head>`
  (or the framework's equivalent, e.g. Next.js `metadata.robots = { index: false, follow: false }`).
- `vercel.json` sends an `X-Robots-Tag: noindex, nofollow` header on every response. Keep it.
- Do not add a sitemap or submit the site to search engines.
- Do not block crawlers with `Disallow: /` in `robots.txt`. Crawlers that can't fetch a page
  never see its noindex tag, and the URL can still get indexed from external links.

Remove these only when explicitly told the site is going live.
