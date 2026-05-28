export interface P5ApiCategory {
  label: string;
  symbols: string[];
}

export const P5_API_SYMBOLS: P5ApiCategory[] = [
  {
    label: 'Environment',
    symbols: [
      'print', 'println', 'clear', 'remove', 'getURL', 'getURLPath',
      'getURLParams', 'cursor', 'noCursor', 'frameRate', 'getFrameRate',
      'setFrameRate', 'displayDensity', 'pixelDensity', 'focused',
      'frameCount', 'windowWidth', 'windowHeight',
      'width', 'height',
    ],
  },
  {
    label: 'Setup & Draw',
    symbols: [
      'setup', 'draw', 'preload', 'windowResized',
      'mouseClicked', 'mousePressed', 'mouseReleased', 'mouseDragged', 'mouseMoved',
      'mouseEntered', 'mouseExited', 'keyPressed', 'keyReleased', 'keyTyped',
      'touchStarted', 'touchMoved', 'touchEnded',
      'deviceTurned', 'deviceMoved',
    ],
  },
  {
    label: '2D Primitives',
    symbols: [
      'ellipse', 'circle', 'arc', 'line', 'point', 'quad', 'rect',
      'triangle', 'square',
    ],
  },
  {
    label: 'Attributes',
    symbols: [
      'ellipseMode', 'rectMode', 'arcMode', 'noSmooth', 'smooth',
      'strokeCap', 'strokeJoin', 'strokeWeight',
      'fill', 'noFill', 'stroke', 'noStroke', 'erase', 'noErase',
      'blendMode', 'textureWrap', 'angleMode', 'colorMode',
      'shininess', 'specularColor', 'ambientMaterial', 'specularMaterial',
      'emissiveMaterial', 'normalMaterial',
    ],
  },
  {
    label: 'Color',
    symbols: [
      'color', 'alpha', 'blue', 'brightness', 'green', 'hue', 'lerpColor',
      'lightness', 'red', 'saturation', 'background',
      'colorMode', 'fill', 'noFill', 'stroke', 'noStroke',
    ],
  },
  {
    label: 'Math',
    symbols: [
      'abs', 'ceil', 'constrain', 'dist', 'exp', 'floor', 'lerp',
      'log', 'mag', 'map', 'max', 'min', 'norm', 'pow',
      'round', 'sq', 'sqrt', 'fract',
      'noise', 'noiseDetail', 'noiseSeed',
      'random', 'randomSeed', 'randomGaussian',
      'atan', 'atan2', 'sin', 'cos', 'tan', 'acos', 'asin',
      'degrees', 'radians', 'angleMode',
    ],
  },
  {
    label: '3D Primitives',
    symbols: [
      'plane', 'box', 'sphere', 'cylinder', 'cone', 'ellipsoid', 'torus',
    ],
  },
  {
    label: 'Vertex',
    symbols: [
      'beginShape', 'endShape', 'vertex', 'curveVertex', 'quadraticVertex',
      'bezierVertex', 'contour', 'beginContour', 'endContour',
      'curveTightness', 'curvePoint', 'curveTangent',
      'bezierPoint', 'bezierTangent',
      'texture', 'textureMode',
    ],
  },
  {
    label: 'Typography',
    symbols: [
      'textFont', 'text', 'textSize', 'textStyle', 'textAlign',
      'textWidth', 'textAscent', 'textDescent', 'textLeading',
      'textWrap', 'loadFont',
    ],
  },
  {
    label: 'Transform',
    symbols: [
      'applyMatrix', 'popMatrix', 'pushMatrix', 'resetMatrix',
      'rotate', 'rotateX', 'rotateY', 'rotateZ',
      'scale', 'shearX', 'shearY', 'translate',
    ],
  },
  {
    label: 'Lights & Camera',
    symbols: [
      'ambientLight', 'directionalLight', 'pointLight', 'spotLight',
      'lights', 'noLights', 'lightFalloff', 'lightMode',
      'camera', 'createCamera', 'setCamera', 'orbitControl',
      'debugMode', 'noDebug',
      'perspective', 'ortho', 'frustum',
    ],
  },
  {
    label: 'Image',
    symbols: [
      'createImage', 'image', 'imageMode', 'loadImage', 'loadPixels',
      'updatePixels', 'pixels', 'blend', 'copy', 'filter',
      'get', 'resize', 'saveCanvas', 'saveFrames',
    ],
  },
  {
    label: 'Rendering',
    symbols: [
      'createCanvas', 'resizeCanvas', 'noCanvas', 'createGraphics',
      'setAttributes', 'pixelDensity', 'displayDensity',
    ],
  },
  {
    label: 'IO',
    symbols: [
      'loadJSON', 'loadStrings', 'loadTable', 'loadXML',
      'loadBytes', 'loadShader', 'loadImage', 'loadFont',
      'save', 'saveJSON', 'saveStrings', 'saveTable',
      'saveCanvas', 'saveFrames', 'httpGet', 'httpPost', 'httpDo',
    ],
  },
  {
    label: 'Curves',
    symbols: [
      'curve', 'bezier', 'curveDetail', 'curveTightness',
      'curvePoint', 'curveTangent', 'bezierPoint', 'bezierTangent',
    ],
  },
  {
    label: 'Shaders',
    symbols: [
      'createShader', 'loadShader', 'shader', 'resetShader',
      'createFilterShader',
    ],
  },
  {
    label: 'Sound',
    symbols: [
      'audioContext', 'userStartAudio', 'getAudioContext',
      'soundFormats', 'loadSound', 'createConvolver',
      'createFilter', 'createCompressor', 'createDelay',
      'createReverb', 'peakDetect', 'amplitude',
      'fft', 'oscillator', 'envelope', 'pulse', 'noise', 'audioIn',
      'monoSynth', 'duoSynth', 'polySynth', 'part', 'score',
      'soundLoop', 'soundFile', 'soundRecorder', 'distortion',
      'reverb',
    ],
  },
  {
    label: 'DOM',
    symbols: [
      'select', 'selectAll', 'createP', 'createA', 'createImg',
      'createDiv', 'createSpan', 'createInput', 'createButton',
      'createCheckbox', 'createSelect', 'createRadio',
      'createSlider', 'createColorPicker', 'createFileInput',
      'createVideo', 'createAudio', 'createCapture',
      'createWriter', 'drop', 'parent',
    ],
  },
  {
    label: 'Vector & Matrix',
    symbols: [
      'createVector', 'p5.Vector', 'fromAngle', 'fromAngles',
      'dist', 'lerp', 'mag', 'mult', 'sub', 'add', 'div',
      'normalize', 'setMag', 'limit', 'heading', 'rotate',
      'angleBetween', 'dot', 'cross', 'random2D', 'random3D',
    ],
  },
  {
    label: 'p5.Color',
    symbols: [
      'setRed', 'setGreen', 'setBlue', 'setAlpha',
      'toString', 'levels',
    ],
  },
  {
    label: 'Constants',
    symbols: [
      'HALF_PI', 'PI', 'QUARTER_PI', 'TWO_PI', 'TAU', 'DEGREES', 'RADIANS',
      'CLOSE', 'OPEN', 'CHORD', 'PIE',
      'RGB', 'HSB', 'HSL',
      'BLEND', 'ADD', 'DARKEST', 'LIGHTEST', 'DIFFERENCE',
      'EXCLUSION', 'MULTIPLY', 'SCREEN', 'REPLACE', 'REMOVE',
      'OVERLAY', 'HARD_LIGHT', 'SOFT_LIGHT', 'DODGE', 'BURN',
      'SUBTRACT',
      'LANDSCAPE', 'PORTRAIT',
      'ALT', 'BACKSPACE', 'CONTROL', 'DELETE', 'DOWN_ARROW',
      'ENTER', 'ESCAPE', 'LEFT_ARROW', 'OPTION', 'RETURN',
      'RIGHT_ARROW', 'SHIFT', 'TAB', 'UP_ARROW',
      'ARROW', 'CROSS', 'HAND', 'MOVE', 'TEXT', 'WAIT',
      'AUTO', 'CENTER', 'CORNER', 'CORNERS', 'RADIUS',
      'MITER', 'BEVEL', 'ROUND', 'SQUARE', 'PROJECT',
      'NORMAL', 'IMAGE', 'OPAQUE', 'THRESHOLD', 'GRAY',
      'POSTERIZE', 'SOLARIZE', 'INVERT', 'BLUR', 'DILATE',
      'ERODE', 'EDGES',
      'VIDEO', 'AUDIO',
      'LINEAR', 'QUADRATIC', 'CONSTANT', 'EXPONENTIAL',
      'LSB', 'MSB',
      'WEBGL', 'P2D',
      'UNSIGNED_BYTE', 'FLOAT', 'HALF_FLOAT', 'UNSIGNED_INT',
      'UNSIGNED_SHORT',
    ],
  },
];

export interface UsedP5Symbol {
  name: string;
  category: string;
}

export function findUsedP5Symbols(code: string): UsedP5Symbol[] {
  const result: UsedP5Symbol[] = [];
  const seen = new Set<string>();

  for (const category of P5_API_SYMBOLS) {
    for (const sym of category.symbols) {
      if (seen.has(sym)) continue;

      const escaped = sym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escaped}\\b`);
      if (pattern.test(code)) {
        result.push({ name: sym, category: category.label });
        seen.add(sym);
      }
    }
  }

  return result;
}
