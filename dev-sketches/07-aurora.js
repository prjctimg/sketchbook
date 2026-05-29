const sketch = (p) => {
  const layers = [
    { hue: 340, amp: 60, freq: 0.008, speed: 0.4, yoff: 0 },
    { hue: 270, amp: 50, freq: 0.012, speed: 0.6, yoff: 60 },
    { hue: 170, amp: 45, freq: 0.01, speed: 0.5, yoff: 120 },
    { hue: 210, amp: 40, freq: 0.015, speed: 0.7, yoff: 180 },
    { hue: 310, amp: 35, freq: 0.009, speed: 0.35, yoff: 240 },
  ];

  const stars = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);

    for (let i = 0; i < 200; i++) {
      stars.push({
        x: p.random(p.width),
        y: p.random(p.height * 0.6),
        r: p.random(0.5, 1.8),
      });
    }
  };

  function drawStars() {
    for (const s of stars) {
      const twinkle = 0.5 + 0.5 * p.sin(p.frameCount * 0.02 + s.x);
      p.fill(0, 0, 100, twinkle * 60);
      p.noStroke();
      p.circle(s.x, s.y, s.r);
    }
  }

  p.draw = () => {
    p.background(0, 0, 8);

    const t = p.millis() * 0.001;

    for (const layer of layers) {
      p.beginShape();
      p.noStroke();
      const alpha = 18 + 8 * p.sin(t * 0.2 + layer.yoff * 0.01);
      p.fill(layer.hue, 40, 95, alpha);

      p.vertex(0, p.height);

      for (let x = 0; x <= p.width; x += 4) {
        const n1 = p.noise(x * layer.freq, layer.yoff * 0.005, t * layer.speed);
        const n2 = p.noise(x * layer.freq * 0.5, layer.yoff * 0.01 + 100, t * layer.speed * 0.7);
        const yBase = p.height * 0.5 + layer.yoff * 0.3;
        const y = yBase + n1 * layer.amp + n2 * layer.amp * 0.5 + p.sin(x * 0.01 + t * layer.speed) * 15;
        p.vertex(x, y);
      }

      p.vertex(p.width, p.height);
      p.endShape(p.CLOSE);
    }

    for (const layer of layers) {
      p.beginShape();
      p.noStroke();
      const alpha = 10 + 5 * p.sin(t * 0.15 + layer.yoff * 0.02 + 1);
      p.fill(layer.hue, 30, 100, alpha);

      p.vertex(0, p.height);

      for (let x = 0; x <= p.width; x += 6) {
        const n1 = p.noise(x * layer.freq * 1.5, layer.yoff * 0.008 + 50, t * layer.speed * 1.2 + 200);
        const yBase = p.height * 0.35 + layer.yoff * 0.2;
        const y = yBase + n1 * layer.amp * 0.8 - 30;
        p.vertex(x, y);
      }

      p.vertex(p.width, p.height);
      p.endShape(p.CLOSE);
    }

    drawStars();

    p.fill(0, 0, 100, 4);
    p.noStroke();
    for (let i = 0; i < 50; i++) {
      const sx = p.noise(i * 1.5, t * 0.05) * p.width;
      const sy = p.height * 0.85 + p.noise(i, t * 0.03) * p.height * 0.1;
      p.circle(sx, sy, p.noise(i * 2, t * 0.02) * 3 + 1);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};
