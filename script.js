let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

function adjustCanvasSize() {
  let viewportWidth = document.documentElement.clientWidth;
  let viewportHeight = document.documentElement.clientHeight;
  if (viewportWidth > viewportHeight) {
    // landscape
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  } else {
    // portrait
    canvas.width = viewportWidth;
    canvas.height = viewportHeight;
  }
}
adjustCanvasSize();
window.addEventListener('resize', adjustCanvasSize);

function random(min, max) {
  return min + Math.random() * (max - min);
}

function randomElement(array) {
  return array[Math.floor(random(0, array.length))];
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
  let result = bestFitInside(canvas.width, canvas.height, 1, 1);
  let offset = result.offset,
    scale = result.scale;
  ctx.arc(offset.x + p.x * scale, offset.y + p.y * scale, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function nextArrayElementIndex(array, currentI, through, action) {
  let index;
  if (action) {
    index = currentI + through;
    if (index >= array.length) {
      index = 0 + index - array.length;
    }
  } else if (!action) {
    index = currentI - through;
    if (index < 0) {
      index = array.length + index;
    }
  }
  return index;
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
let $typeOfCalcRandomDirection = document.getElementById('typeOfGeneration');
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

function createVertices() {
  globalVertexColor = randomElement(colors);

  let verticesCount = Number($verticesCount.value);
  for (let i = 0; i < verticesCount; i++) {
    let angle = 2 * Math.PI * (i / verticesCount - 1 / 4);

    let x = Math.cos(angle) / 3 + 1 / 2,
      y = Math.sin(angle) / 3 + 1 / 2;

    color = randomElement(colors);

    vertices.push({ x, y, color, index: i });
  }
}

let randomPoint = {};

let lastPos;
let lastChosenVertex;

let points = [];

function start() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  vertices = [];
  points = [];
  randomPoint.x = random(0, 1);
  randomPoint.y = random(0, 1);
  lastChosenVertex = null;
  lastPos = null;
  createVertices();
  isAnimationRunning = true;
}

function update() {
  if (!isAnimationRunning) return;

  if (vertices[0]) {
    for (let i = 0; i < newPointsPerIteration; i++) {
      let nextPointData = randomElement(vertices);

      let typeOfCalcRandomDirection = Number($typeOfCalcRandomDirection.value);

      if (typeOfCalcRandomDirection === 3 && lastChosenVertex != null) {
        do {
          nextPointData = randomElement(vertices);
        } while (
          nextArrayElementIndex(vertices, nextPointData.index, 1, true) !==
            lastChosenVertex.index &&
          nextArrayElementIndex(vertices, nextPointData.index, 1, false) !==
            lastChosenVertex.index &&
          nextArrayElementIndex(vertices, nextPointData.index, 0, false) !==
            lastChosenVertex.index
        );
      }

      if (typeOfCalcRandomDirection === 2 && lastChosenVertex != null) {
        do {
          nextPointData = randomElement(vertices);
        } while (
          nextPointData.x === lastChosenVertex.x &&
          nextPointData.y === lastChosenVertex.y
        );
      }

      if (typeOfCalcRandomDirection === 2 || typeOfCalcRandomDirection === 3) {
        lastChosenVertex = nextPointData;
      }

      let pos = lerp(lastPos != null ? lastPos : randomPoint, nextPointData);
      points.push({ pos, color: nextPointData.color });
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
    circle(
      point.pos,
      pointsRadius,
      $colorForEachVertex.checked ? point.color : globalVertexColor,
    );
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
