const wrapCache = new Map<string, (p: any) => void>();

const GLOBAL_MODE_RE = /\bfunction\s+(setup|draw|preload)\s*\(/m;
const WARNED = new Set<string>();

export const wrapSketchCode = (code: string) => {
  if (wrapCache.has(code)) {
    return wrapCache.get(code)!;
  }

  if (GLOBAL_MODE_RE.test(code) && !WARNED.has(code)) {
    WARNED.add(code);
    console.warn(
      '[skchbk] Global-mode p5 sketch detected. Wrap your code in instance mode:\n' +
      '  const sketch = (p) => {\n' +
      '    p.setup = () => { p.createCanvas(400, 400); };\n' +
      '    p.draw = () => { p.background(220); };\n' +
      '  };\n' +
      'See: https://p5js.org/examples/instance-mode.html'
    );
  }

  const wrappedFn = (p: any) => {
    try {
      const fn = new Function('p', code + '\nif (typeof sketch === "function") sketch(p);');
      fn(p);
    } catch (e) {
      console.error('Error wrapping p5 sketch:', e);
      p.setup = () => {
        p.createCanvas(400, 400);
        p.background(240);
        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.text('SKETCH_LOAD_ERROR', p.width / 2, p.height / 2);
      };
    }
  };

  wrapCache.set(code, wrappedFn);
  return wrappedFn;
};

export function hasNoLoop(code: string | undefined): boolean {
  if (!code) return false;
  return /\bnoLoop\s*\(/.test(code);
}
