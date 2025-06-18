let shapes = [];
let gravity = 2;
let totalCounter;
let buttonContainer;

let svg_A = [], svg_B = [], svg_C = [], svg_D = [];
let svg_E = [], svg_F = [], svg_G = [], svg_H = [];

function preload() {
  for (let i = 1; i <= 4; i++) {
    let a = createImg(`./assets/A-0${i}.svg`); a.hide(); svg_A.push(a);
    let b = createImg(`./assets/B-0${i}.svg`); b.hide(); svg_B.push(b);
    let c = createImg(`./assets/C-0${i}.svg`); c.hide(); svg_C.push(c);
    let d = createImg(`./assets/D-0${i}.svg`); d.hide(); svg_D.push(d);
    let e = createImg(`./assets/E-0${i}.svg`); e.hide(); svg_E.push(e);
    let f = createImg(`./assets/F-0${i}.svg`); f.hide(); svg_F.push(f);
    let g = createImg(`./assets/G-0${i}.svg`); g.hide(); svg_G.push(g);
    let h = createImg(`./assets/H-0${i}.svg`); h.hide(); svg_H.push(h);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  imageMode(CENTER);

  createP("Click emotion buttons to add shapes").style("color", "white");

  buttonContainer = createDiv().style("display", "flex")
                               .style("flex-wrap", "wrap")
                               .style("gap", "10px")
                               .style("margin-bottom", "10px");

  createEmotionButton("happy", buttonContainer);
  createEmotionButton("angry", buttonContainer);
  createEmotionButton("afraid", buttonContainer);
  createEmotionButton("anticipation", buttonContainer);
  createEmotionButton("sad", buttonContainer);
  createEmotionButton("surprise", buttonContainer);
  createEmotionButton("trust", buttonContainer);
  createEmotionButton("disgust", buttonContainer);

  createButton("reset").parent(buttonContainer).mousePressed(resetCanvas);

  totalCounter = createP("Total shapes: 0").style("color", "white");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function createEmotionButton(label, parentDiv) {
  createButton(label)
    .parent(parentDiv)
    .mousePressed(() => addShape(label));
}

function draw() {
  background("WHITE");
  drawPlatform();

  for (let i = shapes.length - 1; i >= 0; i--) {
    let s = shapes[i];

    if (!s.stopped) {
      s.vy += gravity;
      s.y += s.vy;

      if (s.y + s.size / 2 >= height - 10) {
        s.y = height - 10 - s.size / 2;
        s.vy = 0;
        s.stopped = true;
      }

      checkCollisions(i);
    }

    image(s.svg, s.x, s.y, s.size, s.size);
  }
}

function drawPlatform() {
  fill(70, 80, 100);
  noStroke();
  rect(0, height - 10, width, 10);
}

function addShape(type) {
  let size = random(60, 80);
  let svg;

  if (type === "happy") svg = svg_B[floor(random(0, 4))];
  else if (type === "angry") svg = svg_A[floor(random(0, 4))];
  else if (type === "afraid") svg = svg_C[floor(random(0, 4))];
  else if (type === "anticipation") svg = svg_D[floor(random(0, 4))];
  else if (type === "sad") svg = svg_E[floor(random(0, 4))];
  else if (type === "surprise") svg = svg_F[floor(random(0, 4))];
  else if (type === "trust") svg = svg_G[floor(random(0, 4))];
  else if (type === "disgust") svg = svg_H[floor(random(0, 4))];

  let s = {
    x: random(size / 2, width - size / 2),
    y: -size / 2,
    size: size,
    type: type,
    vy: 0,
    stopped: false,
    svg: svg
  };

  shapes.push(s);
  updateCounters();
}

function checkCollisions(index) {
  let s = shapes[index];
  for (let i = 0; i < shapes.length; i++) {
    if (i === index || !shapes[i].stopped) continue;

    let other = shapes[i];
    let dx = s.x - other.x;
    let dy = s.y - other.y;

    let overlapX = (s.size + other.size) / 2 - abs(dx);
    let overlapY = (s.size + other.size) / 2 - abs(dy);

    if (overlapX > 0 && overlapY > 0 && dy > 0) {
      s.y -= overlapY;
      s.vy = 0;
      s.stopped = true;
      break;
    }
  }
}

function resetCanvas() {
  shapes = [];
  updateCounters();
}

function updateCounters() {
  totalCounter.html("Total shapes: " + shapes.length);
}





