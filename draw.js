document.addEventListener('DOMContentLoaded', function() {
    usernameDiv = document.querySelector("#username-div");
    username = document.createElement("h2");
    username.textContent = localStorage.getItem("username");
    usernameDiv.appendChild(username);
});

document.addEventListener('DOMContentLoaded', function() {
    usernameDiv = document.querySelector("#shape-type");
    username = document.createElement("h3");
    username.textContent = localStorage.getItem("shape-type");
    usernameDiv.appendChild(username);
});

document.addEventListener('DOMContentLoaded', drawCenter);

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = Math.min(.9 * window.innerHeight, .9 * window.innerWidth + 200);
canvas.height = canvas.width;

let mouseX, mouseY;
let isDrawing = false;

let lines = [];

canvas.addEventListener("mousedown", function(pos) {
    isDrawing = true;
    mouseX = pos.clientX;
    mouseY = pos.clientY;
});

canvas.addEventListener("mousemove", function(pos) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;

    let canvasX = (pos.clientX - rect.left) * scaleX; 
    let canvasY = (pos.clientY - rect.top) * scaleY;

    if (isDrawing) {
        lines.push({x1: mouseX, y1: mouseY, x2: canvasX, y2: canvasY});
        mouseX = canvasX;
        mouseY = canvasY;

        redraw();
    }
});

canvas.addEventListener("mouseup", function() {
    isDrawing = false;
});

// redrawing all the lines every time could get costly fast
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(function(line) {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    });

    drawCenter();
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") { 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines = []; 
    }

    drawCenter();
});

function drawCenter() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = 5; // Radius of the dot

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
}