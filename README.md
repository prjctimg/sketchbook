# sketchbook

<!--toc:start-->
- [sketchbook](#sketchbook)
  - [What does it allow you to do (features)?](#what-does-it-allow-you-to-do-features)
    - [Why not just use the p5 web editor?](#why-not-just-use-the-p5-web-editor)
  - [Configuration](#configuration)
  - [How (why) does it work?](#how-why-does-it-work)
    - [Sketch format](#sketch-format)
  - [Other related references](#other-related-references)
  - [License 📜](#license-📜)
<!--toc:end-->

![skchbk](skchbk.png)

> Showcase your sketches hosted on GitHub Gists.

## What does it allow you to do (features)?

- Load and preview sketches (dynamically) via GitHub gists
- Edit and run sketch code on-site
- Show the used symbols in a sketch
- Provide description for the sketch (useful for sharing references and the thought process)
- Jump to the sketch's related gist

> [!note]
>
> ### Why not just use the p5 web editor?
>
> This project is far from competing with the p5.js web editor for functionality (i.e., it doesn't have FES integration, etc.) but rather serves as an alternative approach to sharing your sketches in a more self-hosted fashion.
>
> Also the motivation of this template was to reduce the moving parts between developing, publishing, and maintaining sketches so that any changes are trivial and kept at one 'source of truth'.
>
> If you're looking to learn p5.js instead, please use the web editor as it has many more features geared towards that goal.
>

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
  },
  "ga": {
    "measurementId": ""  // Google Analytics 4 measurement ID (optional)
  }
}
```

## How (why) does it work?

Each gist must contain a `sketch.js` file and optionally a `p5.json` file.

If the gist has a `p5.json`, the `libs` key is scraped for any installed p5 plugins and loads them via a CDN.
Other dependencies outside of the p5.js scope are specified using a special comment with each name being a valid NPM package name (space or comma separated):

```js

// deps: package1 package2

// OR 

//deps: package1,package2,...
```

> [!caution]
> Loading (big) modules can increase your sketch preview page's [FCP](https://web.dev/fcp/) as well as the page's RAM usage considerably. Pick the lightest dependency whenever possible.
>

The first GitHub comment on a gist (by the gist owner) becomes the sketch description. When that comment is updated (or the associated `sketch.js` and `p5.json` file), the changes are immediately mirrored on the sketchbook.

This allows the user to make edits to their sketches and not worry about redeploying for the changes to take effect.

> [!tip]
> There's [a (nice) workflow that I use to develop, publish and maintain sketches](https://prjctimg.me/blg/how-i-use-neovim-to-run-skchbk) from the terminal using the [p5.nvim plugin](https://github.com/prjctimg/p5.nvim)

> [!warning]
> Rendering is expensive.
>
> If your sketch is making the preview page lag, do most work in `setup()`, lower `frameRate()`, or call `noLoop()` at the end of `draw()`.
>
> See [Optimizing p5.js Code for Performance](https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance)

### Sketch format

All sketches must be in instance mode, **global mode** will not work.

This allows us to embed different sketches without creating any collisions with other JS libraries.

> [!tip]
> For more about why instance mode is preferred over global mode, [see this article on the p5.js wiki](https://github.com/processing/p5.js/wiki/Global-and-instance-mode)

## Other related references

- [p5.js web editor](https://editor.p5js.org)
- [GitHub Gists](https://gist.github.com)
- [On keeping a sketchbook](https://prjctimg.me/blg/on-keeping-a-sketchbook)
- [p5.nvim](https://github.com/prjctimg/p5.nvim)
- [Embedding p5.js (wiki)](https://github.com/processing/p5.js/wiki/Embedding-p5.js)

---

> ## License 📜
>
> (c) 2026, [prjctimg](https://prjctimg.me)
>
> This is free software, released under the GPL-3.0 license.

---
---
