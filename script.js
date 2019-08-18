let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

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
window.addEventListener("resize", adjustCanvasSize);

function random(min, max) {
  return min + Math.random() * (max - min);
}

function circle(canvas, x, y, r, color) {
  canvas.beginPath();
  canvas.fillStyle = color;
  canvas.arc(x, y, r, Math.PI * 2, 0, false);
  canvas.fill();
  canvas.closePath();
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
  "#FFFF00",
  "#00FFFF",
  "#FF0040",
  "#00FF00",
  "#FF0000",
  "#0404B4",
  "#FF00FF",
  "#FFFFFF",
  "#A4A4A4",
  "#FF8000",
  "#819FF7"
];

let speedOfRender = {
  pointPerIteration: 1000,
  iterationEvery: 10
};

let vertexsRadius = 4;
let firstPointRadius = 3;
let pointsRadius = 0.1;

let vertexsColor = "#FFFFFF";
let firstPointColor = "#FF4500";

let colorSettings = document.getElementById("color").checked;
let vertexsCount = Number(document.getElementById("countOfVertex").value);
let percentOfPath = Number(document.getElementById("percent").value) / 100;
let typeOfCalcRandomDirection = Number(
  document.getElementById("typeOfGeneration").value
);
let vertexMode = document.getElementById("vertexMode").checked;

function pathCalc(x, y, x0, y0) {
  return [x0 + (x - x0) * percentOfPath, y0 + (y - y0) * percentOfPath];
}

//--------------- drawing function:

let vertexsData = [];

function setup() {
  let pointsColor = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < vertexsCount; i++) {
    let angel = i * ((Math.PI * 2) / vertexsCount) - (Math.PI * 2) / 4;

    let pointIndex = i;

    let x = (Math.cos(angel) * canvas.height) / 3 + canvas.width / 2,
      y = (Math.sin(angel) * canvas.height) / 3 + canvas.height / 2;

    if (colorSettings) {
      pointsColor = colors[Math.floor(Math.random() * colors.length)];
    }

    if (vertexMode) {
      circle(ctx, x, y, vertexsRadius, vertexsColor);
    }
    vertexsData.push([x, y, pointsColor, pointIndex]);
  }
}

let lastPoint;
let lastChosenVertex;

function render() {
  if (vertexsData[0]) {
    for (let i = 0; i < speedOfRender.pointPerIteration; i++) {
      let nextPointData =
        vertexsData[Math.floor(Math.random() * vertexsData.length)];

      if (typeOfCalcRandomDirection === 3 && lastChosenVertex != null) {
        do {
          nextPointData =
            vertexsData[Math.floor(Math.random() * vertexsData.length)];
        } while (
          nextArrayElementIndex(vertexsData, nextPointData[3], 1, true) !==
            lastChosenVertex[3] &&
          nextArrayElementIndex(vertexsData, nextPointData[3], 1, false) !==
            lastChosenVertex[3] &&
          nextArrayElementIndex(vertexsData, nextPointData[3], 0, false) !==
            lastChosenVertex[3]
        );
      }

      if (typeOfCalcRandomDirection === 2 && lastChosenVertex != null) {
        do {
          nextPointData =
            vertexsData[Math.floor(Math.random() * vertexsData.length)];
        } while (
          nextPointData[0] === lastChosenVertex[0] &&
          nextPointData[1] === lastChosenVertex[1]
        );
      }

      if (typeOfCalcRandomDirection === 2 || typeOfCalcRandomDirection === 3) {
        lastChosenVertex = nextPointData;
      }

      if (lastPoint != null) {
        let point = pathCalc(
          nextPointData[0],
          nextPointData[1],
          lastPoint[0],
          lastPoint[1]
        );
        circle(ctx, point[0], point[1], pointsRadius, nextPointData[2]);
        lastPoint = point;
      } else {
        let point = pathCalc(nextPointData[0], nextPointData[1], x, y);
        circle(ctx, point[0], point[1], pointsRadius, nextPointData[2]);
        lastPoint = point;
      }
    }
  }
}

//--------------- drawing:

let x = random(0, canvas.width),
  y = random(0, canvas.height);
if (vertexMode) {
  circle(ctx, x, y, firstPointRadius, firstPointColor);
}

setup();
// let draw = setIntervalAndExecute(render, speedOfRender.iterationEvery);
let draw = null;
let animationStatus = false;

restartF.onclick = function() {
  colorSettings = document.getElementById("color").checked;
  vertexsCount = Number(document.getElementById("countOfVertex").value);
  percentOfPath = Number(document.getElementById("percent").value) / 100;
  typeOfCalcRandomDirection = Number(
    document.getElementById("typeOfGeneration").value
  );
  vertexMode = document.getElementById("vertexMode").checked;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(draw);
  vertexsData = [];
  lastChosenVertex = null;
  lastPoint = null;
  setup();
  if (vertexMode) {
    for (let i = 0; i < vertexsData.length; i++) {
      circle(
        ctx,
        vertexsData[i][0],
        vertexsData[i][1],
        vertexsRadius,
        vertexsColor
      );
    }
    circle(ctx, x, y, firstPointRadius, firstPointColor);
  }
  draw = setIntervalAndExecute(render, speedOfRender.iterationEvery);
  animationStatus = true;
};

stopF.onclick = function() {
  if (animationStatus) {
    clearInterval(draw);
    animationStatus = false;
  }
};

goF.onclick = function() {
  if (!animationStatus) {
    draw = setIntervalAndExecute(render, speedOfRender.iterationEvery);
    animationStatus = true;
  }
};
