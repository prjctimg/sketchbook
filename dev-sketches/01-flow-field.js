const scl = 14;
let cols, rows;
let zoff = 0;
const particles = [];
const numP = 1500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  cols = Math.floor(width / scl) + 2;
  rows = Math.floor(height / scl) + 2;
  for (let i = 0; i < numP; i++) {
    let hue = random(280, 340);
    if (random() > 0.6) hue = random(180, 220);
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      hue,
    });
  }
  background(0, 0, 8);
}

function draw() {
  fill(0, 0, 8, 5);
  noStroke();
  rect(0, 0, width, height);

  const field = [];
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      const angle = noise(xoff, yoff, zoff) * TWO_PI * 2.5;
      field.push(createVector(cos(angle) * 2.5, sin(angle) * 2.5));
      xoff += 0.08;
    }
    yoff += 0.08;
  }
  zoff += 0.003;

  for (const pt of particles) {
    const x = Math.floor(pt.pos.x / scl);
    const y = Math.floor(pt.pos.y / scl);
    const idx = constrain(x + y * cols, 0, field.length - 1);
    const force = field[idx];
    if (force) {
      pt.vel.add(force);
      pt.vel.limit(3.5);
    }
    pt.pos.add(pt.vel);

    stroke(pt.hue, 55, 92, 22);
    strokeWeight(1.2);
    point(pt.pos.x, pt.pos.y);

    if (pt.pos.x > width + 5) pt.pos.x = -5;
    if (pt.pos.x < -5) pt.pos.x = width + 5;
    if (pt.pos.y > height + 5) pt.pos.y = -5;
    if (pt.pos.y < -5) pt.pos.y = height + 5;
  }
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = Math.floor(width / scl) + 2;
  rows = Math.floor(height / scl) + 2;
};


