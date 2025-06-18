let shapes = [];
let circleCount = 0;
let squareCount = 0;
let gravity = 0.5;

let circleBtn, squareBtn, resetBtn;
let circleCounter, squareCounter, totalCounter;

function setup() {
  createCanvas(400, 500);
  frameRate(60);

  createP("点击按钮添加图形（真实碰撞 + 弹性堆叠）").style("color", "white");

  circleBtn = createButton("happy");
  circleBtn.mousePressed(() => addShape('circle'));

  squareBtn = createButton("angry");
  squareBtn.mousePressed(() => addShape('square'));

  resetBtn = createButton("new");
  resetBtn.mousePressed(resetCanvas);

  circleCounter = createP("圆形数量: 0").style("color", "white");
  squareCounter = createP("正方形数量: 0").style("color", "white");
  totalCounter = createP("总数量: 0").style("color", "white");

  textAlign(CENTER);
}

function draw() {
  background(30, 40, 60);
  drawPlatform();

  for (let i = shapes.length - 1; i >= 0; i--) {
    let s = shapes[i];

    if (!s.stopped) {
      s.vy += gravity;
      s.y += s.vy;
      s.x += s.vx;

      // 边界限制与反弹
      if (s.x - s.size / 2 <= 0) {
        s.x = s.size / 2;
        s.vx *= -s.bounciness;
      } else if (s.x + s.size / 2 >= width) {
        s.x = width - s.size / 2;
        s.vx *= -s.bounciness;
      }

      // 与底部碰撞
      if (s.y + s.size / 2 >= height - 10) {
        s.y = height - 10 - s.size / 2;
        s.vy *= -s.bounciness;
        s.vx *= 0.95;
        if (abs(s.vy) < 0.5 && abs(s.vx) < 0.3) {
          s.vy = 0;
          s.vx = 0;
          s.stopped = true;
        }
      }

      // 与其他图形的碰撞
      checkCollisions(i);
    }

    drawShape(s);
  }
}

function drawPlatform() {
  fill(70, 80, 100);
  noStroke();
  rect(0, height - 10, width, 10);
}

function drawShape(s) {
  noStroke();
  fill(s.color);
  if (s.type === 'circle') {
    ellipse(s.x, s.y, s.size);
  } else {
    rectMode(CENTER);
    rect(s.x, s.y, s.size, s.size);
  }
}

function addShape(type) {
  let size = random(30, 50);
  let s = {
    x: random(size / 2, width - size / 2),
    y: -size / 2,
    size: size,
    type: type,
    vx: random(-2, 2),
    vy: 0,
    bounciness: 0.6,
    stopped: false,
    color: type === 'circle'
      ? [random(100, 200), random(100, 200), random(200, 255)]
      : [random(200, 255), random(100, 180), random(50, 150)]
  };
  shapes.push(s);

  if (type === 'circle') circleCount++;
  else squareCount++;
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
      // 发生重叠
      // 纵向修复位置
      s.y -= overlapY;
      s.vy *= -s.bounciness;
      s.vx += dx * 0.05; // 水平推动

      if (abs(s.vy) < 0.5 && abs(s.vx) < 0.3) {
        s.vy = 0;
        s.vx = 0;
        s.stopped = true;
      }
    }
  }
}

function resetCanvas() {
  shapes = [];
  circleCount = 0;
  squareCount = 0;
  updateCounters();
}

function updateCounters() {
  circleCounter.html("圆形数量:1 " + circleCount);
  squareCounter.html("正方形数量: " + squareCount);
  totalCounter.html("总数量: " + shapes.length);
}