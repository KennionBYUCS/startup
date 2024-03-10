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

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = Math.min(.9 * window.innerHeight, .9 * window.innerWidth + 200);
canvas.height = canvas.width;

let mouseX, mouseY;
let isDrawing = false;

let lines = [];

canvas.addEventListener("mousedown", function(e) {
    isDrawing = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener("mousemove", function(e) {
    if (isDrawing) {
        lines.push({x1: mouseX, y1: mouseY, x2: e.clientX, y2: e.clientY});
        mouseX = e.clientX;
        mouseY = e.clientY;

        redraw();
    }
});

canvas.addEventListener("mouseup", function() {
    isDrawing = false;
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(function(line) {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    });
}

