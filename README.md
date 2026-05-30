# sketchbook 🏞️

![skchbk](skchbk.png)

> Gallery to showcase your sketches hosted as GitHub Gists🐙  
>

## Configuration

Edit the [`sitemeta.json`](https://github.com/prjctimg/sketchbook) file to configure your sketchbook:

```jsonc
{
  "site": {
    "title": "skchbk",            // Site title (used in <title>)
    "description": "...",         // Meta description
    "url": "https://example.com"  // Deployed URL
  },
  "github": {
    "username": "your-github-username",  // GitHub user whose gists to load
    "gistIncludeMarker": "// @sketch"             // If set, only include gists whose
                                        // sketch.js starts with this string.
                                        // Empty = include all gists.
  }
}
```

### Using GitHub Gists for hosting sketches

Each gist must contain a `sketch.js` file. Optional files:

| File | Purpose |
|------|---------|
| `p5.json` | Dependency definitions (`libs` field) |

The first GitHub comment on a gist (by the gist owner) becomes the sketch description and any changes to the comment are reflected on the sketchbook immediately after it is reloaded.

### Further reading

> [!caution]
>
> Rendering is expensive. If your sketch is making the preview page lag  then it may be wiser to do most stuff in the `setup()` function, pin to a lower `frameRate()` or call `noLoop()` at the end of the `draw()` function (though this will limit the interactivity of the sketch).
>
> See  [Optimizing p5.js code (wiki)](https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance)

> ### License
>
> This is free software software released under the GPL-3.0 license.
