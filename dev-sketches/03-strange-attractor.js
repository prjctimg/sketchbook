const sketch = (p) => {
  const numParticles = 8000;
  const attractors = [
    {
      name: "Lorenz",
      update: (x, y, z, dt) => {
        const sigma = 10, rho = 28, beta = 8 / 3;
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        return { x: x + dx, y: y + dy, z: z + dz };
      },
      init: () => ({ x: 0.1, y: 0.1, z: 0.1 }),
    },
    {
      name: "Thomas",
      update: (x, y, z, dt) => {
        const b = 0.18;
        const dx = (Math.sin(y) - b * x) * dt;
        const dy = (Math.sin(z) - b * y) * dt;
        const dz = (Math.sin(x) - b * z) * dt;
        return { x: x + dx, y: y + dy, z: z + dz };
      },
      init: () => ({ x: 0.5, y: 0.5, z: 0.5 }),
    },
    {
      name: "Aizawa",
      update: (x, y, z, dt) => {
        const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
        const dx = (z - b) * x - d * y;
        const dy = d * x + (z - b) * y;
        const dz = c + a * z - z * z * z / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
        return { x: x + dx * dt, y: y + dy * dt, z: z + dz * dt };
      },
      init: () => ({ x: 0.1, y: 0, z: 0 }),
    },
  ];

  const particles = [];
  let scale = 8;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.background(0, 0, 10);

    for (let i = 0; i < numParticles; i++) {
      const idx = i % attractors.length;
      const init = attractors[idx].init();
      particles.push({
        pos: init,
        trail: [],
        attractorIdx: idx,
      });
    }
  };

  p.draw = () => {
    p.fill(0, 0, 10, 4);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    scale = p.height / 40;

    for (const pt of particles) {
      const attr = attractors[pt.attractorIdx];
      const result = attr.update(pt.pos.x, pt.pos.y, pt.pos.z, 0.01);
      pt.pos = result;

      const sx = p.width / 2 + pt.pos.x * scale;
      const sy = p.height / 2 + pt.pos.z * scale;

      pt.trail.push({ x: sx, y: sy });
      if (pt.trail.length > 30) pt.trail.shift();

      const t = (p.frameCount * 0.05 + pt.attractorIdx * 120) % 360;
      const hue = t < 180 ? 280 + t * 0.3 : 180 + (t - 180) * 0.2;

      p.stroke(hue, 50, 92, 15);
      p.strokeWeight(1);

      if (pt.trail.length > 1) {
        const prev = pt.trail[pt.trail.length - 2];
        p.line(prev.x, prev.y, sx, sy);
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
