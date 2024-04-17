localStorage.setItem("accuracy", "0");
let accuracy = 0;
let shape;

document.addEventListener('DOMContentLoaded', function() {
    usernameDiv = document.querySelector("#username-div");
    username = document.createElement("h2");
    username.textContent = localStorage.getItem("username");
    usernameDiv.appendChild(username);
});

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/shape', {
          method: 'GET',
          headers: {'content-type': 'application/json'},
          body: {'username': localStorage.getItem("username")}
        });
  
        shape = await response.json();
      } catch {
        shape = {type: undefined, sides: -1, focal: -1};
      }

      shapeNameDiv = document.querySelector("#shape-type");
      shapeTypeBox = document.createElement("h3");
      shapeTypeBox.textContent = shape.type;
      shapeNameDiv.appendChild(shapeTypeBox);
});

function renderAccuracy() {
    accuracyTitle = document.querySelector("#accuracy");
    accuracyDisplay = document.createElement("h3");
    accuracyDisplay.textContent = calculateAccuracy().toString() + "%";
    accuracyTitle.appendChild(accuracyDisplay);
    localStorage.setItem("accuracy", accuracy);
}

document.addEventListener('DOMContentLoaded', drawCenter);

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = Math.min(.9 * window.innerHeight, .9 * window.innerWidth + 200);
canvas.height = canvas.width;

let mouseX, mouseY;
let isDrawing = false;

let lines = [];

canvas.addEventListener("mousedown", function(pos) {
    clearScreen();
    isDrawing = true;

    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    
    mouseX = (pos.clientX - rect.left) * scaleX;
    mouseY = (pos.clientY - rect.top) * scaleY;

    if (euclideanDistance(mouseX, mouseY, canvas.width / 2, centerY = canvas.height / 2) > (canvas.width / 2)) {
        // TODO: radius too large error
    }
    else if (euclideanDistance(mouseX, mouseY, canvas.width / 2, centerY = canvas.height / 2) < 20) {
        // TODO: radius too small error
    }
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
    if (shapeNotClosed() || lineTooShort()) {
        return;
    }

    renderAccuracy();

    drawCircle(calculateAverageRadius());
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
        drawCenter();
    }
    else if (event.key === "Enter") {
        saveAccuracy();
    }
});

function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines = [];
    drawCenter();
}

function drawCenter() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = 5;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function slope(x1, y1, x2, y2) {
    return (y2 - y1) / (x2 / x1);
}

function calculateAverageRadius() {
    let distances = [];
    for (let i = 0; i < lines.length; i++) {
        distances.push(euclideanDistance(lines[i].x1, lines[i].y1, canvas.width / 2, centerY = canvas.height / 2));
    }

    return (distances.reduce((a, b) => a + b, 0)) / distances.length;
}

function drawCircle(radius) {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

// averaging the radius actually ensures a relatively high accuracy percent
// thus this value ensures more "realistic" outputs
let fudgeFactor = .2;

function calculateCircleAccuracy() {
    avgRadius = calculateAverageRadius();
    let errorVals = [];

    for (let i = 0; i < lines.length; i++) {
        errorVals.push(Math.abs(euclideanDistance(lines[i].x1, lines[i].y1, canvas.width / 2, canvas.height / 2) - avgRadius) 
                        / (canvas.width * fudgeFactor));
    }

    let avgErr = ((errorVals.reduce((a, b) => a + b, 0)) / errorVals.length) * 100;
    let avg = 100 - avgErr;

    let expectedLength = 2 * avgRadius * Math.PI;
    let actualLength = lengthOfShape();

    if (actualLength < expectedLength) {
        avg = avg * (actualLength / expectedLength);
    }
    else if (actualLength > expectedLength) {
        avg = avg * (expectedLength / actualLength);
    }

    return +avg.toFixed(1);
}

let MAX_ALLOWABLE_PIXEL_GAP = 15;
function shapeNotClosed() {
    if (euclideanDistance(lines[0].x1, 
                          lines[0].y1, 
                          lines[lines.length - 1].x2, 
                          lines[lines.length - 1].y2) < MAX_ALLOWABLE_PIXEL_GAP) {
        return false;
    }

    return true;
}

function lineTooShort() {
    let sum = lengthOfShape();

    if (sum > 200) {
        return false;
    }

    return true;
}

function lengthOfShape() {
    let sum = 0;
    for (let i = 0; i < lines.length; i++) {
        sum += euclideanDistance(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
    }
    return sum;
}

function calculateAccuracy() {
    if (localStorage.getItem("shape-type") === "circle") {
        accuracy = calculateCircleAccuracy();
        return accuracy;
    }
    // this is a placeholder for when I get the polygon accuracy logic implemented
    else {
        accuracy = calculateCircleAccuracy();
        return accuracy;
    }
}

class PersonalScoreboardRow {
    shape;
    accuracy;

    constructor(shape, accuracy) {
        this.shape = shape;
        this.accuracy = accuracy;
    }
}

async function saveAccuracy() {
    const scoreboardRow = {shape: shape.type, accuracy: calculateAccuracy()};

    try {
      const response = await fetch('/api/score/personal', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(scoreboardRow),
      });
    } catch {
      saveAccuracyLocal();
    }

    window.location.href = "select.html";
}

function saveAccuracyLocal() {
    let personalScoreboard = JSON.parse(localStorage.getItem("personalScoreboard"));
    if (personalScoreboard === null) {
        personalScoreboard = [];
    }

    personalScoreboard.push(new PersonalScoreboardRow(localStorage.getItem("shape-type"), parseFloat(localStorage.getItem("accuracy"))));
    personalScoreboard.sort(compareAccuracy);
    localStorage.setItem("personalScoreboard", JSON.stringify(personalScoreboard));
}

function findVertices() {
    let vertexIndices = [];
    // assumes user will always start drawing polygon at a vertex
    currVertexIndex = 0;
    vertexIndices.push(0);
    currSlope = slope(lines[0].x1, lines[0].y1, lines[1].x2, lines[1].y2);
    for (let i = 1; i < lines.length - 1; i++) {
        // TODO: handle near-infinite slope case
        nextSlope = slope(lines[i].x1, lines[i].y1, lines[i + 1].x2, lines[i + 1].y2);
        // include range of tolerance for not perfectly straight lines
        // .15 is arbitrary, need to test to find appropriate value
        if (Math.abs(currSlope - nextSlope) > .15) {
            vertexIndices.push(i);
            currVertexIndex = i;
            currSlope = nextSlope;
        }
    }
}

// TODO: write function to generate polygon based on average radius distance to vertices
//       if number of vertices does not match number of sides accuracy should take a hit
//       calculate and average lengths of sides to generate shape
//       calculate accuracy by computing generated angle between three points and comparing to expected angle