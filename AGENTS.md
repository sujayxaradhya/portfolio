<!-- BEGIN:nextjs-agent-rules -->
# BetterCMS — portfolio

portfolio's content lives in BetterCMS. Read it through the Delivery API with a project `content:read` key. Pull field shapes live from the types endpoint below — don't hardcode them, the schema can change.

## Auth
Send `X-API-Key: <key>` on every read. Mint a long-lived `content:read` key (reads PUBLISHED content, never expires) at https://api.bettercms.ai/api/v1/projects/NRU4Vf7aJC6C6P32rzJJv/api-keys. For drafts, mint a `content:read:draft` key (force-expired to ≤1h), then publish and switch to the long-lived key.

## Content types
- `experience` — page (singleton)
- `home` — page (singleton)
- `home` — model
- `projects` — page (dynamic)
- `skills` — page (singleton)

## Reading (Delivery API · base `https://api.bettercms.ai/api/v1/delivery/sujay`)
- Page: `GET .../content/{slug}`
- Entries (list): `GET .../content-entries?model={slug}`
- Entry: `GET .../content-entries/{slug}`

## Typed client
- Live TypeScript types: `GET https://api.bettercms.ai/api/v1/management/content/types` — authoritative field shapes; generate/refresh from here.
- `npm i @betttercms/next @betttercms/codegen`, then construct the client. `baseUrl` + `workspace` are required — there is no `apiUrl`/`endpoint` option:

```ts
import { createBetterCMS } from "@betttercms/next";
const cms = createBetterCMS<BetterCMSSchema>({
  baseUrl: "https://api.bettercms.ai/api/v1/delivery",
  workspace: "sujay",
  apiKey: process.env.BETTERCMS_API_KEY,
});
```

## Field shapes you'll read
Canonical READ shapes the Delivery API returns. Per-field types come from the types endpoint; these container shapes are stable:
- **richtext** → `{ html, value: { root: … }, format: "lexical-…" }`. Render `html`, or walk `value.root` for structured rendering.
- **image** → `{ url, altText?, width?, height?, id? }` — an object, use `.url` (the write value is a bare CDN URL string, but reads are normalized to this object).
- **array + zones** → `{ nonRepeatable?: { <key>: value }, repeatable?: Array<{ <key>: value }> }`. `nonRepeatable` is one fixed block; `repeatable` is a list — map over it.
- **array (primitive)** → a flat list (e.g. `string[]`). `type: "array"` alone is ambiguous — the generated type tells you which.

Example entry `fields` (a `sections` zone field + a `tags` primitive array):
```jsonc
{
  "sections": {
    "nonRepeatable": { "eyebrow": "New", "heading": "Welcome" },
    "repeatable": [{ "label": "Docs", "url": "/docs", "icon": { "url": "https://cdn…" } }]
  },
  "tags": ["alpha", "beta"]
}
```

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
