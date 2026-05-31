# sketchbook

![skchbk](skchbk.png)

> A Next.js gallery for p5.js sketches loaded from GitHub Gists.

## Configuration

Edit the `sitemeta.json` file to configure your sketchbook:

```jsonc
{
  "site": {
    "title": "skchbk",            // Site title (used in <title>)
    "description": "...",         // Meta description
    "url": "https://example.com"  // Deployed URL
  },
  "github": {
    "username": "your-github-username",
    "gistIncludeMarker": "// @sketch"  // Only include gists whose sketch.js starts with this string
  },
  "ga": {
    "measurementId": ""  // Google Analytics 4 measurement ID (optional)
  }
}
```

### Using GitHub Gists

Each gist must contain a `sketch.js` file. Optional files:

| File | Purpose |
|------|---------|
| `p5.json` | Dependency definitions (`libs` field) |

The first GitHub comment on a gist (by the gist owner) becomes the sketch description.

> [!caution]
> Rendering is expensive. If your sketch is making the preview page lag, do most work in `setup()`, lower `frameRate()`, or call `noLoop()` at the end of `draw()`.
>
> See [Optimizing p5.js Code for Performance](https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance)

### Dev Mode

```bash
DEV_SKETCHES_DIR=dev-sketches npm run dev
```

Place `sketch.js` files in `dev-sketches/` for local development without GitHub Gists.

Add a `p5.json` file in `dev-sketches/` to declare global dependencies:

```json
{
  "libs": { "d3": "7" }
}
```

## License

(c) 2026, prjctimg — GPL-3.0
