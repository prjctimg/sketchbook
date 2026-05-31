export interface P5ApiEntry {
  name: string;
  category: string;
  type: 'function' | 'constant' | 'property';
}

export interface UsedP5Symbol {
  name: string;
  category: string;
  type: 'function' | 'constant' | 'property';
}

type CategoryRule = {
  label: string;
  test: (name: string) => boolean;
};

const CATEGORIES: CategoryRule[] = [
  { label: 'Events', test: (n) => /^(mouse|key|touch|device)/.test(n) },
  { label: 'Lifecycle', test: (n) => /^(setup|draw|preload|windowResized|remove)$/.test(n) },
  { label: 'I/O', test: (n) => /^(load|save|http)/.test(n) },
  {
    label: 'Transform',
    test: (n) => /^(translate|rotate|rotateX|rotateY|rotateZ|scale|shearX|shearY|pushMatrix|popMatrix|resetMatrix|applyMatrix|printMatrix)/.test(n),
  },
  {
    label: 'Color & Style',
    test: (n) => /^(fill|noFill|stroke|noStroke|background|color|colorMode|erase|noErase|blendMode|angleMode|ellipseMode|rectMode|arcMode|smooth|noSmooth|strokeCap|strokeJoin|strokeWeight|textureWrap|ambientMaterial|specularMaterial|emissiveMaterial|normalMaterial|shininess|specularColor)/.test(n),
  },
  {
    label: 'Shape',
    test: (n) => /^(ellipse|circle|arc|rect|square|line|triangle|quad|point|beginShape|endShape|vertex|curveVertex|quadraticVertex|bezierVertex|contour|beginContour|endContour|curve|bezier|curveDetail|curveTightness|curvePoint|curveTangent|bezierPoint|bezierTangent|texture|textureMode)/.test(n),
  },
  {
    label: 'Math',
    test: (n) => /^(abs|ceil|constrain|dist|exp|floor|fract|lerp|log|mag|map|max|min|norm|pow|round|sq|sqrt|noise|noiseDetail|noiseSeed|random|randomSeed|randomGaussian|sin|cos|tan|atan|atan2|asin|acos|degrees|radians|angleMode)/.test(n),
  },
  {
    label: 'Typography',
    test: (n) => /^(text|textFont|textSize|textStyle|textAlign|textWidth|textAscent|textDescent|textLeading|textWrap|loadFont)/.test(n),
  },
  {
    label: 'Rendering',
    test: (n) => /^(createCanvas|resizeCanvas|noCanvas|createGraphics|setAttributes|pixelDensity|displayDensity|print|println|clear)/.test(n),
  },
  {
    label: 'Image',
    test: (n) => /^(image|createImage|loadImage|imageMode|loadPixels|updatePixels|pixels|filter|blend|copy|get|resize|saveCanvas|saveFrames)/.test(n),
  },
  {
    label: 'Lights & Camera',
    test: (n) => /^(ambientLight|directionalLight|pointLight|spotLight|lights|noLights|lightFalloff|lightMode|camera|createCamera|setCamera|orbitControl|debugMode|noDebug|perspective|ortho|frustum)/.test(n),
  },
  {
    label: 'Shaders',
    test: (n) => /^(createShader|loadShader|shader|resetShader|createFilterShader)/.test(n),
  },
  {
    label: 'DOM',
    test: (n) => /^(select|selectAll|drop|parent|style|position|size|show|hide|addClass|removeClass|toggleClass|child|attribute|value|html|center)/.test(n) || /^create(P|Div|Span|Input|Button|Checkbox|Select|Radio|Slider|ColorPicker|FileInput|Video|Audio|Capture|Writer)$/.test(n),
  },
  {
    label: 'Vector',
    test: (n) => /^(createVector|fromAngle|fromAngles|normalize|setMag|limit|heading|angleBetween|dot|cross|random2D|random3D)/.test(n),
  },
  {
    label: 'Creation',
    test: (n) => n.startsWith('create') && n !== 'createCanvas',
  },
];

function categorizeFunction(name: string): string {
  for (const cat of CATEGORIES) {
    if (cat.test(name)) return cat.label;
  }
  return 'General';
}

async function introspectP5Symbols(): Promise<P5ApiEntry[]> {
  const { default: p5 } = await import('p5') as any;
  const proto = p5.prototype;
  const entries: P5ApiEntry[] = [];
  const seen = new Set<string>();

  for (const name of Object.getOwnPropertyNames(proto)) {
    if (name === 'constructor' || name.startsWith('_')) continue;
    if (seen.has(name)) continue;
    seen.add(name);

    const isFunc = typeof (proto as any)[name] === 'function';

    if (isFunc) {
      entries.push({ name, category: categorizeFunction(name), type: 'function' });
    } else {
      const isConst = name === name.toUpperCase() && name.length > 1;
      if (isConst) {
        entries.push({ name, category: 'Constants', type: 'constant' });
      } else {
        entries.push({ name, category: 'Properties', type: 'property' });
      }
    }
  }

  return entries;
}

let _symbols: P5ApiEntry[] | null = null;
let _initPromise: Promise<void> | null = null;

async function initSymbols(): Promise<void> {
  if (_symbols) return;
  _symbols = await introspectP5Symbols();
}

function getP5Symbols(): P5ApiEntry[] {
  if (!_symbols && !_initPromise && typeof window !== 'undefined') {
    _initPromise = initSymbols().catch(() => { _symbols = []; });
  }
  return _symbols ?? [];
}

export function findUsedP5Symbols(code: string): UsedP5Symbol[] {
  const symbols = getP5Symbols();
  const result: UsedP5Symbol[] = [];
  const seen = new Set<string>();

  for (const entry of symbols) {
    if (seen.has(entry.name)) continue;

    const escaped = entry.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escaped}\\b`);
    if (pattern.test(code)) {
      result.push({ name: entry.name, category: entry.category, type: entry.type });
      seen.add(entry.name);
    }
  }

  return result;
}
