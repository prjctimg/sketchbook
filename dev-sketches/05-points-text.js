const sketch = (p) => {
  const word = "dream";
  const fontSize = 140;
  let targetPoints = [];
  const sampleStep = 3;
  const drifters = [];
  let showText = true;

  function sampleText() {
    const pg = p.createGraphics(600, 220);
    pg.background(0);
    pg.fill(255);
    pg.textSize(fontSize);
    pg.textAlign(p.CENTER, p.CENTER);
    pg.textStyle(p.BOLD);
    pg.textFont("sans-serif");
    pg.text(word, pg.width / 2, pg.height / 2);
    pg.loadPixels();

    const pts = [];
    for (let y = 0; y < pg.height; y += sampleStep) {
      for (let x = 0; x < pg.width; x += sampleStep) {
        const idx = (y * pg.width + x) * 4;
        if (pg.pixels[idx] > 128) {
          pts.push(p.createVector(x - pg.width / 2, y - pg.height / 2));
        }
      }
    }
    pg.remove();
    return pts;
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.background(0, 0, 10);

    targetPoints = sampleText();

    for (const t of targetPoints) {
      drifters.push({
        pos: p.createVector(p.random(-p.width / 2, p.width / 2), p.random(-p.height / 2, p.height / 2)),
        target: t.copy(),
        hue: p.random(280, 360),
      });
    }
  };

  p.draw = () => {
    p.fill(0, 0, 10, 12);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    p.translate(p.width / 2, p.height / 2);

    const t = p.millis() * 0.0003;

    for (const d of drifters) {
      const dx = d.target.x - d.pos.x;
      const dy = d.target.y - d.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0.5) {
        const speed = 0.03 + 0.02 * p.noise(d.pos.x * 0.01, d.pos.y * 0.01, t);
        d.pos.x += dx * speed;
        d.pos.y += dy * speed;
      }

      const drift = 0.3 * p.noise(d.pos.x * 0.005, d.pos.y * 0.005, t);
      d.pos.x += p.sin(t * 0.5 + d.hue) * drift;
      d.pos.y += p.cos(t * 0.3 + d.hue) * drift;

      const hue = (d.hue + p.sin(t + d.target.x * 0.01) * 20) % 360;
      const sat = 55 + 20 * p.noise(d.pos.x * 0.02, d.pos.y * 0.02, t);
      p.stroke(hue, sat, 92, 35);
      p.strokeWeight(1.8);
      p.point(d.pos.x, d.pos.y);
    }
  };

  p.mouseClicked = () => {
    showText = !showText;
    if (showText) {
      for (let i = 0; i < drifters.length && i < targetPoints.length; i++) {
        drifters[i].target = targetPoints[i].copy();
      }
    } else {
      for (const d of drifters) {
        d.target = p.createVector(
          p.random(-p.width / 2, p.width / 2),
          p.random(-p.height / 2, p.height / 2)
        );
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    targetPoints = sampleText();
    const newDrifters = [];
    for (const t of targetPoints) {
      if (newDrifters.length < drifters.length) {
        const d = drifters[newDrifters.length];
        d.target = t.copy();
        newDrifters.push(d);
      } else {
        newDrifters.push({
          pos: p.createVector(p.random(-p.width / 2, p.width / 2), p.random(-p.height / 2, p.height / 2)),
          target: t.copy(),
          hue: p.random(280, 360),
        });
      }
    }
    drifters.length = 0;
    for (const d of newDrifters) drifters.push(d);
  };
};

new p5(sketch);
