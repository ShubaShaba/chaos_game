let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
// let textField = document.getElementById("text");

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

// not finished: nextArrayElementIndex(array, 2, 6, false) -4 : 1 / nextArrayElementIndex(array, 2, 7, false) -5 : 0 / nextArrayElementIndex(array, 2, 8, false) -6 : -1;
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

// function setRange(array, currentI, through, action, plus, minus) {
//   for(){
//     let pointOfRange = nextArrayElementIndex(array, currentI, through, action);
//   }
// }

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

let mainPointsRadius = 4;
let firstPointRadius = 3;
let pointsRadius = 0.1;

let mainPointsColor = "#FFFFFF";
let firstPointColor = "#FF4500";

let kOfSize = 2.2;
if (canvas.width < canvas.height) {
  kOfSize = 3;
  pointsRadius = 0.3;
}

let colorSettings = Number(document.getElementById("color").value);
let mainPointsCount = Number(document.getElementById("countOfVertex").value);
let percentOfPath = Number(document.getElementById("percent").value) / 100;
let typeOfCalcRandomDirection = Number(
  document.getElementById("typeOfGeneration").value
);
let vertexMode = Number(document.getElementById("vertexMode").value);

function pathCalc(x, y, x0, y0) {
  return [x0 + (x - x0) * percentOfPath, y0 + (y - y0) * percentOfPath];
}

//--------------- drawing function:

let mainPointsData = [];

function setup() {
  let pointsColor = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < mainPointsCount; i++) {
    let angel = i * ((Math.PI * 2) / mainPointsCount) - (Math.PI * 2) / 4;

    let pointIndex = i;

    let x = (Math.cos(angel) * canvas.height) / kOfSize + canvas.width / 2,
      y = (Math.sin(angel) * canvas.height) / kOfSize + canvas.height / 2;

    if (colorSettings === 2) {
      pointsColor = colors[Math.floor(Math.random() * colors.length)];
    }

    if (vertexMode === 2) {
      circle(ctx, x, y, mainPointsRadius, mainPointsColor);
    }
    mainPointsData.push([x, y, pointsColor, pointIndex]);
  }
}

let countOfIteration = 0;
let lastPoint;
let lastChosenVertex;

function render() {
  if (mainPointsData[0]) {
    for (let i = 0; i < speedOfRender.pointPerIteration; i++) {
      let nextPointData =
        mainPointsData[Math.floor(Math.random() * mainPointsData.length)];

      if (typeOfCalcRandomDirection === 3 && lastChosenVertex != null) {
        do {
          nextPointData =
            mainPointsData[Math.floor(Math.random() * mainPointsData.length)];
        } while (
          nextArrayElementIndex(mainPointsData, nextPointData[3], 1, true) !==
            lastChosenVertex[3] &&
          nextArrayElementIndex(mainPointsData, nextPointData[3], 1, false) !==
            lastChosenVertex[3] &&
          nextArrayElementIndex(mainPointsData, nextPointData[3], 0, false) !==
            lastChosenVertex[3]
        );
      }

      if (typeOfCalcRandomDirection === 2 && lastChosenVertex != null) {
        do {
          nextPointData =
            mainPointsData[Math.floor(Math.random() * mainPointsData.length)];
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
      countOfIteration++;
      // textField.innerHTML = countOfIteration;
    }
  }
}

//--------------- drawing:

let x = random(0, canvas.width),
  y = random(0, canvas.height);
if (vertexMode === 2) {
  circle(ctx, x, y, firstPointRadius, firstPointColor);
}

setup();
let draw = setIntervalAndExecute(render, speedOfRender.iterationEvery);
let animationStatus = false;

restartF.onclick = function() {
  colorSettings = Number(document.getElementById("color").value);
  mainPointsCount = Number(document.getElementById("countOfVertex").value);
  percentOfPath = Number(document.getElementById("percent").value) / 100;
  typeOfCalcRandomDirection = Number(
    document.getElementById("typeOfGeneration").value
  );
  vertexMode = Number(document.getElementById("vertexMode").value);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(draw);
  mainPointsData = [];
  countOfIteration = 0;
  lastChosenVertex = null;
  lastPoint = null;
  setup();
  if (vertexMode === 2) {
    for (let i = 0; i < mainPointsData.length; i++) {
      circle(
        ctx,
        mainPointsData[i][0],
        mainPointsData[i][1],
        mainPointsRadius,
        mainPointsColor
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
