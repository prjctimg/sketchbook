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

### Writing Sketches

All sketches must use **instance mode**. Wrap your p5 code in a `sketch` function:

```javascript
// deps: d3-delaunay            ← npm packages for CDN loading
const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  };

  p.draw = () => {
    p.background(220);
    p.ellipse(p.width / 2, p.height / 2, 50);
  };
};
```

- Access all p5 functions and properties through the `p` parameter: `p.createCanvas()`, `p.background()`, `p.width`, `p.PI`, etc.
- Declare CDN dependencies with `// deps:` at the top (comma-separated npm package names)
- Define event handlers as instance methods: `p.mousePressed = () => {}` instead of `function mousePressed()`

## License

(c) 2026, prjctimg — GPL-3.0
