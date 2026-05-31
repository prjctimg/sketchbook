const boids = [];
const groups = [
  { hue: 150, count: 60 },
  { hue: 30, count: 60 },
  { hue: 270, count: 60 },
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  for (const g of groups) {
    for (let i = 0; i < g.count; i++) {
      const angle = random(TWO_PI);
      const speed = random(1, 3);
      boids.push({
        pos: createVector(random(width), random(height)),
        vel: createVector(cos(angle) * speed, sin(angle) * speed),
        acc: createVector(0, 0),
        hue: g.hue + random(-12, 12),
        groupHue: g.hue,
      });
    }
  }
}

function draw() {
  background(0, 0, 10);

  for (const b of boids) {
    let sep = createVector(0, 0);
    let sepCount = 0;
    let ali = createVector(0, 0);
    let aliCount = 0;
    let coh = createVector(0, 0);
    let cohCount = 0;

    const perceptionR = 60;
    const separationR = 28;

    for (const other of boids) {
      if (other === b) continue;
      const dx = b.pos.x - other.pos.x;
      const dy = b.pos.y - other.pos.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < perceptionR) {
        if (other.groupHue === b.groupHue) {
          ali.add(other.vel);
          aliCount++;
          coh.add(other.pos);
          cohCount++;
        }
        if (d < separationR) {
          const diff = createVector(dx, dy);
          diff.div(d * d + 0.01);
          sep.add(diff);
          sepCount++;
        }
      }
    }

    if (sepCount > 0) {
      sep.div(sepCount);
      sep.mult(1.8);
      b.acc.add(sep);
    }
    if (aliCount > 0) {
      ali.div(aliCount);
      const aliMag = Math.sqrt(ali.x * ali.x + ali.y * ali.y);
      if (aliMag > 0) {
        ali.setMag(1);
        ali.sub(b.vel);
        ali.limit(1);
        b.acc.add(ali);
      }
    }
    if (cohCount > 0) {
      coh.div(cohCount);
      coh.sub(b.pos);
      const cohMag = Math.sqrt(coh.x * coh.x + coh.y * coh.y);
      if (cohMag > 0) {
        coh.setMag(1);
        coh.sub(b.vel);
        coh.limit(1);
        b.acc.add(coh);
      }
    }

    b.vel.add(b.acc);
    const v = Math.sqrt(b.vel.x * b.vel.x + b.vel.y * b.vel.y);
    if (v > 3) b.vel.setMag(3);
    b.pos.add(b.vel);
    b.acc.mult(0);

    if (b.pos.x > width) b.pos.x = 0;
    if (b.pos.x < 0) b.pos.x = width;
    if (b.pos.y > height) b.pos.y = 0;
    if (b.pos.y < 0) b.pos.y = height;

    fill(b.hue, 65, 88, 75);
    noStroke();
    const angle = Math.atan2(b.vel.y, b.vel.x);
    push();
    translate(b.pos.x, b.pos.y);
    rotate(angle);
    triangle(7, 0, -5, -4, -5, 4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
