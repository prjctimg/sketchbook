const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
  };

  function drawBranch(x, y, length, angle, depth, maxDepth, time) {
    const sway = p.noise(depth * 0.3, time * 0.005) * 0.4 - 0.2;
    const swayAngle = angle + sway;

    const ex = x + p.cos(swayAngle) * length;
    const ey = y + p.sin(swayAngle) * length;

    const frac = depth / maxDepth;
    const trunkHue = 30;
    const leafHue = 140 + depth * 12;

    if (depth > maxDepth - 3) {
      p.stroke(leafHue, 55, 90, 60);
      p.strokeWeight(1);
    } else {
      p.stroke(trunkHue, 40 + (1 - frac) * 30, 30 + (1 - frac) * 40, 80);
      p.strokeWeight(Math.max(1, depth * 0.8));
    }
    p.line(x, y, ex, ey);

    if (depth > maxDepth - 2) {
      p.noStroke();
      p.fill(leafHue, 50, 90, 40);
      p.circle(ex, ey, 6 + (maxDepth - depth) * 3);
      return;
    }

    const childLen = length * (0.7 + p.random(-0.03, 0.03));
    const spread = 0.4 + p.random(-0.05, 0.05);

    const noise1 = p.noise(depth * 0.5, time * 0.003, 0) * 0.3 - 0.15;
    const noise2 = p.noise(depth * 0.5, time * 0.003, 100) * 0.3 - 0.15;

    drawBranch(ex, ey, childLen, swayAngle - spread + noise1, depth + 1, maxDepth, time);
    drawBranch(ex, ey, childLen, swayAngle + spread + noise2, depth + 1, maxDepth, time);
  }

  p.draw = () => {
    p.background(0, 0, 10);
    const maxDepth = 9;
    const trunkLen = p.height * 0.25;
    drawBranch(p.width / 2, p.height, trunkLen, -p.HALF_PI, 1, maxDepth, p.frameCount);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
