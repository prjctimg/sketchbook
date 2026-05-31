![skchbk](skchbk.png)

**skchbk** — a Next.js gallery for p5.js generative art sketches loaded from GitHub Gists.

## Configuration

Edit `sitemeta.json` to set up your instance:

```jsonc
{
  "site": {
    "title": "skchbk",            // Site title (used in <title>)
    "description": "...",         // Meta description
    "url": "https://example.com"  // Deployed URL
  },
  "github": {
    "username": "your-github-username",  // GitHub user whose gists to load
    "gistIncludeMarker": ""             // If set, only include gists whose
                                        // sketch.js starts with this string.
                                        // Empty = include all gists.
  },
  "ga": {
    "measurementId": ""  // Google Analytics 4 measurement ID (optional)
  }
}
```

### Gist structure

Each gist must contain a `sketch.js` file. Optional files:

| File | Purpose |
|------|---------|
| `sketch.js` | p5.js sketch code (instance mode) |
| `p5.json` | Dependency definitions (`libs` field) |
| `thumbnail.png` / `thumbnail.jpg` | Custom thumbnail override |

The first GitHub comment on a gist (by the gist owner) becomes the sketch description.

### Dev mode

```bash
DEV_SKETCHES_DIR=dev-sketches npm run dev
```

JavaScript files in `dev-sketches/` are loaded as local sketches (no gist dependency).
