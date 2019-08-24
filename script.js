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

function circle(x, y, r, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, r, Math.PI * 2, 0, false);
  ctx.fill();
  ctx.closePath();
}

function setIntervalAndExecute(f, t) {
  f();
  return setInterval(f, t);
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

let newPointsPerIteration = 1;
let iterationInterval = 10;

let vertexRadius = 4;
let firstPointRadius = 3;
let pointsRadius = 10;

let vertexColor = '#FFFFFF';
let firstPointColor = '#FF4500';

let colorSettings;
let vertexsCount;
let percentOfPath;
let typeOfCalcRandomDirection;
let showVertices;

function lerp(x1, y1, x2, y2) {
  return [x2 + (x1 - x2) * percentOfPath, y2 + (y1 - y2) * percentOfPath];
}

//--------------- drawing function:

let vertices = [];

function createVertices() {
  let pointsColor = randomElement(colors);

  for (let i = 0; i < vertexsCount; i++) {
    let angel = i * ((Math.PI * 2) / vertexsCount) - (Math.PI * 2) / 4;

    let pointIndex = i;

    let x = (Math.cos(angel) * canvas.height) / 3 + canvas.width / 2,
      y = (Math.sin(angel) * canvas.height) / 3 + canvas.height / 2;

    if (colorSettings) {
      pointsColor = randomElement(colors);
    }

    if (showVertices) {
      circle(x, y, vertexRadius, vertexColor);
    }
    vertices.push([x, y, pointsColor, pointIndex]);
  }
}

let x, y;

let lastPoint;
let lastChosenVertex;

function start() {
  colorSettings = document.getElementById('color').checked;
  vertexsCount = Number(document.getElementById('countOfVertex').value);
  percentOfPath = Number(document.getElementById('percent').value) / 100;
  typeOfCalcRandomDirection = Number(
    document.getElementById('typeOfGeneration').value,
  );
  showVertices = document.getElementById('showVertices').checked;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(draw);
  vertices = [];
  x = random(0, canvas.width);
  y = random(0, canvas.height);
  lastChosenVertex = null;
  lastPoint = null;
  createVertices();
  if (showVertices) {
    for (let i = 0; i < vertices.length; i++) {
      circle(vertices[i][0], vertices[i][1], vertexRadius, vertexColor);
    }
    circle(x, y, firstPointRadius, firstPointColor);
  }
  draw = setIntervalAndExecute(render, iterationInterval);
  isAnimationRunning = true;
}

function render() {
  if (vertices[0]) {
    for (let i = 0; i < newPointsPerIteration; i++) {
      let nextPointData = randomElement(vertices);

      if (typeOfCalcRandomDirection === 3 && lastChosenVertex != null) {
        do {
          nextPointData = randomElement(vertices);
        } while (
          nextArrayElementIndex(vertices, nextPointData[3], 1, true) !==
            lastChosenVertex[3] &&
          nextArrayElementIndex(vertices, nextPointData[3], 1, false) !==
            lastChosenVertex[3] &&
          nextArrayElementIndex(vertices, nextPointData[3], 0, false) !==
            lastChosenVertex[3]
        );
      }

      if (typeOfCalcRandomDirection === 2 && lastChosenVertex != null) {
        do {
          nextPointData = randomElement(vertices);
        } while (
          nextPointData[0] === lastChosenVertex[0] &&
          nextPointData[1] === lastChosenVertex[1]
        );
      }

      if (typeOfCalcRandomDirection === 2 || typeOfCalcRandomDirection === 3) {
        lastChosenVertex = nextPointData;
      }

      if (lastPoint != null) {
        let point = lerp(
          nextPointData[0],
          nextPointData[1],
          lastPoint[0],
          lastPoint[1],
        );
        circle(point[0], point[1], pointsRadius, nextPointData[2]);
        lastPoint = point;
      } else {
        let point = lerp(nextPointData[0], nextPointData[1], x, y);
        circle(point[0], point[1], pointsRadius, nextPointData[2]);
        lastPoint = point;
      }
    }
  }
}

//--------------- drawing:

if (showVertices) {
  circle(x, y, firstPointRadius, firstPointColor);
}

let draw;
let isAnimationRunning = false;

document.getElementById('restartF').onclick = function() {
  start();
};

document.getElementById('stopF').onclick = function() {
  if (isAnimationRunning) {
    clearInterval(draw);
    isAnimationRunning = false;
  }
};

document.getElementById('goF').onclick = function() {
  if (!isAnimationRunning) {
    draw = setIntervalAndExecute(render, iterationInterval);
    isAnimationRunning = true;
  }
};

start();
