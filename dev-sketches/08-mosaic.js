const sketch = (p) => {
  const palette = [
    { h: 350, s: 50, b: 92 },
    { h: 30, s: 55, b: 90 },
    { h: 50, s: 50, b: 95 },
    { h: 150, s: 50, b: 90 },
    { h: 200, s: 45, b: 90 },
    { h: 270, s: 45, b: 90 },
  ];

  let tileSize = 0;
  let cols = 0, rows = 0;
  const tiles = [];

  function rebuildTiles() {
    tileSize = Math.max(30, Math.min(60, Math.floor(p.min(p.width, p.height) / 15)));
    cols = Math.floor(p.width / tileSize) + 2;
    rows = Math.floor(p.height / tileSize) + 2;
    tiles.length = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const swatch = palette[Math.floor(p.random(palette.length))];
        tiles.push({
          col: c, row: r,
          hue: swatch.h + p.random(-8, 8),
          sat: swatch.s + p.random(-10, 10),
          bri: swatch.b + p.random(-8, 8),
          phase: p.random(p.TWO_PI),
          pattern: Math.floor(p.random(4)),
          x: c * tileSize,
          y: r * tileSize,
        });
      }
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noStroke();
    rebuildTiles();
  };

  p.draw = () => {
    p.background(0, 0, 10);
    const t = p.millis() * 0.0005;

    for (const tile of tiles) {
      const pulse = 0.5 + 0.5 * p.sin(t + tile.phase);
      const shift = pulse * 0.5;
      p.fill(tile.hue, tile.sat, tile.bri - 5, 85);

      const cx = tile.x + tileSize / 2;
      const cy = tile.y + tileSize / 2;
      const margin = 2 + pulse * 2;

      switch (tile.pattern) {
        case 0: {
          p.rect(tile.x + margin, tile.y + margin,
            tileSize - margin * 2, tileSize - margin * 2, 3);
          break;
        }
        case 1: {
          p.push();
          p.translate(cx, cy);
          p.rotate(t * 0.2 * shift);
          const d = tileSize * 0.35;
          p.rect(-d, -d, d * 2, d * 2, tileSize * 0.1);
          p.pop();
          break;
        }
        case 2: {
          p.circle(cx, cy, (tileSize - margin * 2) * (0.5 + shift * 0.5));
          break;
        }
        case 3: {
          const half = tileSize / 2;
          p.beginShape();
          p.vertex(tile.x + half, tile.y + margin);
          p.vertex(tile.x + tileSize - margin, tile.y + half);
          p.vertex(tile.x + half, tile.y + tileSize - margin);
          p.vertex(tile.x + margin, tile.y + half);
          p.endShape(p.CLOSE);
          break;
        }
      }

      p.fill(tile.hue, tile.sat - 10, tile.bri + 5, 30);
      const dotSize = 2 + pulse * 2;
      p.circle(
        tile.x + tileSize * (0.3 + 0.4 * p.sin(t * 0.3 + tile.phase + tile.col)),
        tile.y + tileSize * (0.3 + 0.4 * p.cos(t * 0.3 + tile.phase * 0.7 + tile.row)),
        dotSize
      );
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    rebuildTiles();
  };
};

new p5(sketch);
