let shapeErrorMessage;
const MAX_SCOREBOARD_ENTRIES = 12;

document.addEventListener('DOMContentLoaded', function () {
    usernameDiv = document.querySelector("#username-div");
    usernameDisplay = document.createElement("h2");
    usernameDisplay.textContent = localStorage.getItem("username");
    usernameDiv.appendChild(usernameDisplay);
});

document.addEventListener('DOMContentLoaded', loadPersonalScoreboard());

function loadShapeIntoMemory() {
    const parametersElement = document.querySelector("#parameters");
    const shapeTypeElement = document.querySelector("#shape-type");
    const numberOfSidesElement = document.querySelector("#sides");
    const focalDistanceElement = document.querySelector("#focal");

    if (shapeTypeElement.value === "default") {
        clearErrorMessage(parametersElement);
        shapeErrorMessage = document.createElement("div");
        shapeErrorMessage.textContent = "Please select a shape type";
        parametersElement.appendChild(shapeErrorMessage);
        return;
    }

    if (shapeTypeElement.value === "polygon") {
        if (numberOfSidesElement.value === "") {
            clearErrorMessage(parametersElement);
            shapeErrorMessage = document.createElement("div");
            shapeErrorMessage.textContent = "Please input a number of sides";
            parametersElement.appendChild(shapeErrorMessage);
            return;
        }
    
        if (isNaN(parseInt(numberOfSidesElement.value))) {
            clearErrorMessage(parametersElement);
            shapeErrorMessage = document.createElement("div");
            shapeErrorMessage.textContent = "Please input a valid number of sides";
            parametersElement.appendChild(shapeErrorMessage);
            return;
        }
    
        if (parseInt(numberOfSidesElement.value) < 3 || parseInt(numberOfSidesElement.value) > 12) {
            clearErrorMessage(parametersElement);
            shapeErrorMessage = document.createElement("div");
            shapeErrorMessage.textContent = "Please input a number of sides between 3 and 12";
            parametersElement.appendChild(shapeErrorMessage);
            return;
        }
        else { // number of sides within range
            numSides = parseInt(numberOfSidesElement.value);
            let shapeType;
            switch (numSides) {
                case 3:
                    shapeType = "Triangle";
                    break;
                case 4:
                    shapeType = "Square";
                    break;
                case 5:
                    shapeType = "Pentagon";
                    break;
                case 6:
                    shapeType = "Hexagon";
                    break;
                case 7:
                    shapeType = "Heptagon";
                    break;
                case 8:
                    shapeType = "Octagon";
                    break;
                case 9:
                    shapeType = "Nonagon";
                    break;
                case 10:
                    shapeType = "Decagon";
                    break;
                case 11:
                    shapeType = "Hendecagon";
                    break;
                case 12:
                    shapeType = "Dodecagon";
                    break;
            }

            sendShapePostRequest(shapeType, numSides, -1);
            window.location.href = "draw.html";
        }
    }

    if (shapeTypeElement.value === "ellipse") {
        if (isNaN(parseFloat(focalDistanceElement.value))) {
            clearErrorMessage(parametersElement);
            shapeErrorMessage = document.createElement("div");
            shapeErrorMessage.textContent = "Please input a valid focal distance";
            parametersElement.appendChild(shapeErrorMessage);
            return;
        }
    
        if (parseFloat(focalDistanceElement.value) < 0) {
            clearErrorMessage(parametersElement);
            shapeErrorMessage = document.createElement("div");
            shapeErrorMessage.textContent = "Please input a positive focal distance";
            parametersElement.appendChild(shapeErrorMessage);
            return;
        }
    
        if (parseFloat(focalDistanceElement.value) === 0) {
            sendShapePostRequest("Circle", -1, 0);
            window.location.href = "draw.html";
            return;
        }
    
        if (focalDistanceTooLarge(focalDistanceElement.value)) {
            // TODO: set lower bound for focal distance
            clearErrorMessage(parametersElement);
            shapeErrorMessage = document.createElement("div");
            shapeErrorMessage.textContent = "Please input a smaller focal distance";
            parametersElement.appendChild(shapeErrorMessage);
            return;
        }
        else {
            sendShapePostRequest("Ellipse", -1, focalDistanceElement.value);
            window.location.href = "draw.html";
            return;
        }
    }
}

async function sendShapePostRequest(shapeType, numSides, focalDistance) {
    const shapeObject = {username: localStorage.getItem("username"), type: shapeType};
    try {
        const response = await fetch('/api/shape', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(shapeObject),
        });
      } catch {
        setShapeLocally(shapeType, numSides, focalDistance);
      }
}

function setShapeLocally(shapeType, numSides, focalDistance) {
    localStorage.setItem("shape-type", shapeType);
    localStorage.setItem("sides", numSides);
    localStorage.setItem("focal", focalDistance);
}

function clearErrorMessage(element) {
    if (shapeErrorMessage) {
        element.removeChild(shapeErrorMessage);
        shapeErrorMessage = null;
    }
}

function calculateMaxDrawSize() {
    // see draw.css for origin of this calculation
    return Math.min(.8 * window.innerHeight, .8 * window.innerWidth + 200);
}

function focalDistanceTooLarge(focalDistance) {
    // 0 < focalDistance/minorRadius < 2 and 0 < focalDistance/majorRadius < sqrt(3)/2
    // 1/2 < minorRadius/focalDistance < inf and 2/sqrt(3) < majorRadius/focalDistance < inf
    // focalDistance/2 < minorRadius < inf and (2 * focalDistance)/sqrt(3) < majorRadius < inf
    // focalDistance < majorRadius * sqrt(3) / 2
    if (focalDistance > calculateMaxDrawSize() * (Math.sqrt(3) / 2)) {
        return true;
    }

    return false;
}

class GlobalScoreboardRow {
    username;
    shape;
    accuracy;

    constructor(username, shape, accuracy) {
        this.username = username;
        this.shape = shape;
        this.accuracy = accuracy;
    }
};

let globalScoreboard = []
function generateRandomGlobalScoreboardRow() {
    const names = ["David", "YoungWoo", "Austin", "Kai", "Stephen", "Jacob", "Kaden", "Preston", "Matt"];
    const shapes = ["Circle", "Ellipse", "Triangle", "Square", "Pentagon", "Hexagon", "Heptagon", "Octagon", "Nonagon", "Decagon", "Hendecagon", "Dodecagon"];

    randomName = names[Math.floor(Math.random() * 10) % 9];
    randomShape = shapes[Math.floor(Math.random() * 13) % 12];
    randomAccuracy = Math.floor(Math.random() * 101) % 100;

    return new GlobalScoreboardRow(randomName, randomShape, randomAccuracy);
}

function convertGlobalEntryToHTML(globalElement) {
    return `<td>${globalElement.username}</td><td>${globalElement.shape}</td><td>${globalElement.accuracy}%</td>`
}

function compareAccuracy(a, b) {
    return b.accuracy - a.accuracy;
}

// included for future websocket integration
/*async function loadStaticGlobalScoreboard() {
    const globalScoreboardElement = document.querySelector('#global-scoreboard-body');
    try {
        const response = await fetch('/api/scores/global', {
            method: 'GET',
            headers: {'content-type': 'application/json'},
        });

        globalScoreboard = await response.json();
    } catch {
        globalScoreboard = JSON.parse(localStorage.getItem("globalScoreboard"));
    }

    let rowHTML = "";

    for (let i = 0; i < globalScoreboard.length; i++) {
        rowHTML = rowHTML + `<tr><td>${i + 1}</td>` + convertGlobalEntryToHTML(globalScoreboard[i]) + "</tr>";
    }

    globalScoreboardElement.innerHTML = rowHTML;
}*/

setInterval(() => {
    const randomRow = generateRandomGlobalScoreboardRow();
    const globalScoreboardElement = document.querySelector('#global-scoreboard-body');

    sortGlobalScoreboard(randomRow);

    let rowHTML = "";

    for (let i = 0; i < globalScoreboard.length; i++) {
        rowHTML = rowHTML + `<tr><td>${i + 1}</td>` + convertGlobalEntryToHTML(globalScoreboard[i]) + "</tr>";
    }

    globalScoreboardElement.innerHTML = rowHTML;
  }, 5000);

class PersonalScoreboardRow {
    shape;
    accuracy;

    constructor(shape, accuracy) {
        this.shape = shape;
        this.accuracy = accuracy;
    }
}

function sortGlobalScoreboard(randomRow) {
    if (globalScoreboard.length < MAX_SCOREBOARD_ENTRIES) {
        globalScoreboard.push(randomRow);
        globalScoreboard.sort(compareAccuracy);
    }
    else if (randomRow.accuracy > globalScoreboard[MAX_SCOREBOARD_ENTRIES - 1].accuracy) {
        globalScoreboard.pop();
        globalScoreboard.push(randomRow);
        globalScoreboard.sort(compareAccuracy);
    }
}

async function loadPersonalScoreboard() {
    const personalScoreboardElement = document.querySelector("#personal-scoreboard-body");
    let personalScoreboard;
    try {
        const response = await fetch('/api/scores/personal', {
          method: 'GET',
          headers: {'content-type': 'application/json'},
        });
  
        personalScoreboard = await response.json();
      } catch {
        personalScoreboard = JSON.parse(localStorage.getItem("personalScoreboard"));
      }
    
    if (localStorage.getItem("username") === "Guest") {
        const personalScoreboardHead = document.querySelector("#personal-scoreboard")
        let scoreboardErrorMessage = document.createElement("div");
        scoreboardErrorMessage.textContent = "Guests cannot save high scores.";
        document.getElementById("personal-scoreboard").style.textAlign = "center";
        personalScoreboardHead.appendChild(scoreboardErrorMessage);
        return;
    } else if (personalScoreboard === null || personalScoreboard.length === 0) {
        const personalScoreboardHead = document.querySelector("#personal-scoreboard")
        let scoreboardErrorMessage = document.createElement("div");
        scoreboardErrorMessage.textContent = "You have no saved high scores.";
        document.getElementById("personal-scoreboard").style.textAlign = "center";
        personalScoreboardHead.appendChild(scoreboardErrorMessage);
        return;
    }

    // scoreboard should come sorted from service, thus sorting here should not be necessary
    // personalScoreboard.sort(compareAccuracy);
    
    let rowHTML = "";
    for (let i = 0; i < Math.min(12, personalScoreboard.length); i++) {
        rowHTML = rowHTML + `<tr><td>${personalScoreboard[i].shape}</td><td>${personalScoreboard[i].accuracy}%</td></tr>`
    }

    personalScoreboardElement.innerHTML = rowHTML;
}
