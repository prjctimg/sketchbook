const LIFECYCLE_NAMES = [
  'setup', 'draw', 'preload',
  'mousePressed', 'mouseReleased', 'mouseClicked',
  'mouseMoved', 'mouseDragged', 'mouseWheel',
  'keyPressed', 'keyReleased', 'keyTyped', 'windowResized',
  'touchStarted', 'touchMoved', 'touchEnded',
  'deviceMoved', 'deviceTurned', 'deviceShaken', 'doubleClicked',
];

const transformCache = new Map<string, string>();
const wrapCache = new Map<string, (p: any) => void>();

export const wrapSketchCode = (code: string) => {
  if (wrapCache.has(code)) {
    return wrapCache.get(code)!;
  }

  let transformed = transformCache.get(code);
  if (!transformed) {
    transformed = code.replace(
      /^[ \t]*function\s+(\w+)\s*\(/gm,
      (_, name) => LIFECYCLE_NAMES.includes(name)
        ? `p.${name} = function(`
        : `var ${name} = function(`
    );
    transformCache.set(code, transformed);
  }

  const wrappedFn = (p: any) => {
    try {
      const fn = new Function('p', `with(p) { ${transformed} }`);
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
