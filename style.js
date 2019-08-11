let screenWidth = document.documentElement.clientWidth;
let screenHeight = document.documentElement.clientHeight;
let controlField = document.getElementById("controlPanel");
let page = document.getElementById("body");

canvas.width = screenWidth * 0.8;
canvas.height = screenHeight * 0.8;
canvas.style.marginLeft = `${screenWidth * 0.1}px`;
canvas.style.marginTop = `${screenHeight * 0.1}px`;

controlField.style.marginLeft = `${screenWidth * 0.1}px`;
controlField.style.marginTop = `${screenHeight * 0.1}px`;
controlField.style.width = `${canvas.width}px`;

page.style.paddingBottom = `${screenHeight * 0.1}px`;
