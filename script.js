let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

function adjustCanvasSize() {
  let viewportWidth = document.documentElement.clientWidth;
  let viewportHeight = document.documentElement.clientHeight;
  if (viewportWidth > viewportHeight) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  } else {
    canvas.width = viewportWidth;
    canvas.height = viewportHeight;
  }
}
adjustCanvasSize();
window.addEventListener('resize', adjustCanvasSize);

function random(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(random(min, max));
}

function randomElement(array) {
  return array[randomInt(0, array.length)];
}

function bestFitInside(w1, h1, w2, h2) {
  let offset = { x: 0, y: 0 };
  let scale;

  if (w1 / h1 >= w2 / h2) {
    scale = h1 / h2;
    offset.x = (w1 - w2 * scale) / 2;
  } else {
    scale = w1 / w2;
    offset.y = (h1 - h2 * scale) / 2;
  }

  return { offset, scale };
}

function circle(p, r, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  let offset = { x: 0, y: 0 };
  let scale;
  if (canvas.width >= canvas.height) {
    scale = canvas.height;
    offset.x = (canvas.width - scale) / 2;
  } else {
    scale = canvas.width;
    offset.y = (canvas.height - scale) / 2;
  }
  ctx.arc(offset.x + p.x * scale, offset.y + p.y * scale, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

let colors = [
  '#FFFF00',
  '#00FFFF',
  '#FF0040',
  '#00FF00',
  '#FF0000',
  '#0404B4',
  '#FF00FF',
  '#FFFFFF',
  '#A4A4A4',
  '#FF8000',
  '#819FF7',
  '#00BFFF',
  '#8A2BE2',
  '#9370DB',
  '#6A5ACD',
  '#4B0082',
  '#006400',
];

let newPointsPerIteration = 10;
let iterationInterval = 10;

let vertexRadius = 4;
let firstPointRadius = 3;
let pointsRadius = 1;

let vertexColor = '#FFFFFF';
let firstPointColor = '#FF4500';

let $colorForEachVertex = document.getElementById('colorForEachVertex');
let $verticesCount = document.getElementById('verticesCount');
let $pathPercent = document.getElementById('pathPercent');
let $vertexSelectionStrategy = document.getElementById(
  'vertexSelectionStrategy',
);
let $showVertices = document.getElementById('showVertices');

function lerp(a, b) {
  let delta = Number($pathPercent.value / 100);
  return {
    x: a.x + (b.x - a.x) * delta,
    y: a.y + (b.y - a.y) * delta,
  };
}

let vertices = [];
let globalVertexColor;

let lastPos;
let randomPoint;
let vertexIndex;

let points = [];

function start() {
  points = [];
  randomPoint = { x: random(0, 1), y: random(0, 1) };
  lastPos = randomPoint;

  globalVertexColor = randomElement(colors);

  vertices = [];
  let verticesCount = Number($verticesCount.value);
  for (let i = 0; i < verticesCount; i++) {
    let angle = 2 * Math.PI * (i / verticesCount - 0.25);

    let x = Math.cos(angle) / 3 + 0.5,
      y = Math.sin(angle) / 3 + 0.5;

    color = randomElement(colors);

    vertices.push({ x, y, color });
  }
  vertexIndex = randomElement(vertices);
  isAnimationRunning = true;
}

function update() {
  if (!isAnimationRunning) return;

  if (vertices[0]) {
    for (let i = 0; i < newPointsPerIteration; i++) {
      let vertexSelectionStrategy = Number($vertexSelectionStrategy.value);
      switch (vertexSelectionStrategy) {
        case 1: {
          vertexIndex = randomInt(0, vertices.length);
          break;
        }
        case 2: {
          let index = randomInt(0, vertices.length - 1);
          if (index < vertexIndex) {
            vertexIndex = index;
          } else {
            vertexIndex = index + 1;
          }
          break;
        }
        case 3: {
          let direction = randomInt(0, 3);
          if (direction === 0) {
            // vertexIndex = vertexIndex;
          } else if (direction === 1) {
            if (vertexIndex > 0) {
              vertexIndex -= 1;
            } else {
              vertexIndex = vertices.length - 1;
            }
          } else if (direction === 2) {
            if (vertexIndex < vertices.length - 1) {
              vertexIndex += 1;
            } else {
              vertexIndex = 0;
            }
          }
          break;
        }
        case 4: {
          let direction = randomInt(0, 2);
          if (direction === 0) {
            if (vertexIndex > 0) {
              vertexIndex -= 1;
            } else {
              vertexIndex = vertices.length - 1;
            }
          } else if (direction === 1) {
            if (vertexIndex < vertices.length - 1) {
              vertexIndex += 1;
            } else {
              vertexIndex = 0;
            }
          }
          break;
        }
      }

      let pos = lerp(lastPos, vertices[vertexIndex]);
      points.push({ pos, vertexIndex });
      lastPos = pos;
    }
  }
}
setInterval(update, iterationInterval);

function render() {
  if (!isAnimationRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let color = $colorForEachVertex.checked
      ? vertices[point.vertexIndex].color
      : globalVertexColor;
    circle(point.pos, pointsRadius, color);
  }

  if ($showVertices.checked) {
    for (let i = 0; i < vertices.length; i++) {
      let vertex = vertices[i];
      circle(vertex, vertexRadius, vertexColor);
    }
    circle(randomPoint, firstPointRadius, firstPointColor);
  }

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

let isAnimationRunning = false;

document.getElementById('restartF').addEventListener('click', function() {
  start();
});

document.getElementById('stopF').addEventListener('click', function() {
  isAnimationRunning = false;
});

document.getElementById('goF').addEventListener('click', function() {
  isAnimationRunning = true;
});

start();
