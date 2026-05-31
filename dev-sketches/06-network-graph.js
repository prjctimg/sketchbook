const sketch = (p) => {
  const numNodes = 36;
  const pastelHues = [350, 30, 150, 210, 270];
  const nodes = [];
  let layout = 0;
  let layoutTime = 0;

  function generateConnections() {
    for (let i = 0; i < numNodes; i++) {
      const conns = [];
      const numConns = Math.floor(p.random(3, 6));
      for (let j = 0; j < numConns; j++) {
        let other = Math.floor(p.random(numNodes));
        if (other !== i && !conns.includes(other)) {
          conns.push(other);
        }
      }
      nodes[i].connections = conns;
    }
  }

  function rebuildLayout() {
    layout = (layout + 1) % 5;
    layoutTime = p.millis();

    for (let i = 0; i < numNodes; i++) {
      const t = i / numNodes;
      let x = 0, y = 0;

      switch (layout) {
        case 0: {
          const radius = p.min(p.width, p.height) * 0.35;
          x = p.width / 2 + p.cos(t * p.TWO_PI) * radius;
          y = p.height / 2 + p.sin(t * p.TWO_PI) * radius;
          break;
        }
        case 1: {
          const r = p.min(p.width, p.height) * 0.15 + t * p.min(p.width, p.height) * 0.25;
          x = p.width / 2 + p.cos(t * p.TWO_PI * 3) * r;
          y = p.height / 2 + p.sin(t * p.TWO_PI * 3) * r;
          break;
        }
        case 2: {
          const sketchCols = 6;
          const cx = i % sketchCols;
          const cy = Math.floor(i / sketchCols);
          const spacing = p.min(p.width, p.height) * 0.08;
          x = p.width / 2 + (cx - sketchCols / 2) * spacing + spacing / 2;
          y = p.height / 2 + (cy - 3) * spacing;
          break;
        }
        case 3: {
          x = p.random(p.width * 0.15, p.width * 0.85);
          y = p.random(p.height * 0.15, p.height * 0.85);
          break;
        }
        case 4: {
          const waveAmp = p.min(p.width, p.height) * 0.1;
          x = p.width * 0.1 + t * p.width * 0.8;
          y = p.height / 2 + p.sin(t * p.TWO_PI * 4) * waveAmp;
          break;
        }
      }

      nodes[i].basePos = p.createVector(x, y);
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        pos: p.createVector(0, 0),
        basePos: p.createVector(0, 0),
        hue: pastelHues[i % pastelHues.length] + p.random(-10, 10),
        connections: [],
      });
    }

    generateConnections();
    rebuildLayout();

    for (const n of nodes) {
      n.pos = n.basePos.copy();
    }
  };

  p.draw = () => {
    p.background(0, 0, 10);

    const time = p.millis() * 0.0003;
    const orbitAmp = 8 + 4 * p.sin(time * 0.5);

    for (let i = 0; i < numNodes; i++) {
      const n = nodes[i];
      const t = i / numNodes;
      const ox = p.sin(time + t * p.TWO_PI) * orbitAmp;
      const oy = p.cos(time * 0.7 + t * p.TWO_PI * 1.3) * orbitAmp;
      n.pos.x = n.basePos.x + ox;
      n.pos.y = n.basePos.y + oy;
    }

    for (let i = 0; i < numNodes; i++) {
      const a = nodes[i];
      for (const j of a.connections) {
        if (j <= i) continue;
        const b = nodes[j];

        const midHue = (a.hue + b.hue) / 2;
        const midSat = 40 + 30 * p.sin(time + i * 0.1);
        p.stroke(midHue, midSat, 80, 15);
        p.strokeWeight(0.8);

        const cpx1 = a.pos.x + (b.pos.x - a.pos.x) * 0.3 + p.sin(time + i) * 40;
        const cpy1 = a.pos.y + (b.pos.y - a.pos.y) * 0.3 + p.cos(time + j) * 40;
        const cpx2 = a.pos.x + (b.pos.x - a.pos.x) * 0.7 + p.sin(time * 0.8 + j) * 40;
        const cpy2 = a.pos.y + (b.pos.y - a.pos.y) * 0.7 + p.cos(time * 0.8 + i) * 40;

        p.noFill();
        p.bezier(a.pos.x, a.pos.y, cpx1, cpy1, cpx2, cpy2, b.pos.x, b.pos.y);
      }
    }

    for (const n of nodes) {
      p.fill(n.hue, 50, 92, 70);
      p.noStroke();
      p.circle(n.pos.x, n.pos.y, 5 + 3 * p.sin(time + n.hue));
    }
  };

  p.mouseClicked = () => {
    rebuildLayout();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    rebuildLayout();
  };
};
