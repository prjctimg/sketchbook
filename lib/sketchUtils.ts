const wrapCache = new Map<string, (p: any) => void>();

export const wrapSketchCode = (code: string) => {
  if (wrapCache.has(code)) {
    return wrapCache.get(code)!;
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
