let shapeErrorMessage;

document.addEventListener('DOMContentLoaded', function () {
    usernameDiv = document.querySelector("#username-div");
    usernameDisplay = document.createElement("h2");
    usernameDisplay.textContent = localStorage.getItem("username");
    usernameDiv.appendChild(usernameDisplay);
});

document.addEventListener('DOMContentLoaded', loadPersonalScoreboardFromStorage());

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
    
        if (parseInt(numberOfSidesElement.value) === NaN) {
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
            switch (numSides) {
                case 3:
                    localStorage.setItem("shape-type", "Triangle");
                    break;
                case 4:
                    localStorage.setItem("shape-type", "Square");
                    break;
                case 5:
                    localStorage.setItem("shape-type", "Pentagon");
                    break;
                case 6:
                    localStorage.setItem("shape-type", "Hexagon");
                    break;
                case 7:
                    localStorage.setItem("shape-type", "Heptagon");
                    break;
                case 8:
                    localStorage.setItem("shape-type", "Octagon");
                    break;
                case 9:
                    localStorage.setItem("shape-type", "Nonagon");
                    break;
                case 10:
                    localStorage.setItem("shape-type", "Decagon");
                    break;
                case 11:
                    localStorage.setItem("shape-type", "Hendecagon");
                    break;
                case 12:
                    localStorage.setItem("shape-type", "Dodecagon");
                    break;
            }
    
            localStorage.setItem("sides", numSides);
            window.location.href = "draw.html";
        }
    }

    if (shapeTypeElement.value === "ellipse") {
        if (parseFloat(focalDistanceElement.value) === NaN) {
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
            localStorage.setItem("shape-type", "Circle");
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
            localStorage.setItem("shape-type", "Ellipse");
            localStorage.setItem("focal", focalDistanceElement.value);
            window.location.href = "draw.html";
            return;
        }
    }
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
const MAX_GLOBAL_ENTRIES = 12;
let numGlobalEntries = 0;

function generateRandomGlobalScoreboardRow() {
    const names = ["David", "YoungWoo", "Austin", "Kai", "Stephen", "Jacob", "Kaden", "Preston", "Matt"];
    const shapes = ["Circle", "Ellipse", "Triangle", "Square", "Pentagon", "Hexagon", "Heptagon", "Octagon", "Nonagon", "Decagon", "Hendecagon", "Dodecagon"];

    randomName = names[Math.floor(Math.random() * 10) % names.length];
    randomShape = shapes[Math.floor(Math.random() * 13) % shapes.length];
    randomAccuracy = Math.floor(Math.random() * 100) % 100;

    return new GlobalScoreboardRow(randomName, randomShape, randomAccuracy);
}

function convertGlobalEntryToHTML(globalElement) {
    return `<td>${globalElement.username}</td><td>${globalElement.shape}</td><td>${globalElement.accuracy}%</td>`
}

function compareAccuracy(a, b) {
    return b.accuracy - a.accuracy;
}

setInterval(() => {
    const randomRow = generateRandomGlobalScoreboardRow();
    const globalScoreboardElement = document.querySelector('#global-scoreboard-body');

    if(numGlobalEntries < MAX_GLOBAL_ENTRIES) {
        globalScoreboard.push(randomRow);
        globalScoreboard.sort(compareAccuracy);
        numGlobalEntries++;
    } 
    else {
        if (randomRow.accuracy > globalScoreboard[MAX_GLOBAL_ENTRIES - 1].accuracy) {
            globalScoreboard.pop();
            globalScoreboard.push(randomRow);
            globalScoreboard.sort(compareAccuracy);
        }
    }

    let rowHTML = "";

    for (let i = 0; i < numGlobalEntries; i++) {
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

function loadPersonalScoreboardFromStorage() {
    const personalScoreboardElement = document.querySelector("#personal-scoreboard-body");
    let personalScoreboard = JSON.parse(localStorage.getItem("personalScoreboard"));

    if (personalScoreboard === null) {
        const personalScoreboardHead = document.querySelector("#personal-scoreboard")
        scoreboardErrorMessage = document.createElement("div");
        scoreboardErrorMessage.textContent = "You have no saved high scores.";
        document.getElementById("personal-scoreboard").style.textAlign = "center";
        personalScoreboardHead.appendChild(scoreboardErrorMessage);
        return;
    }

    personalScoreboard.sort(compareAccuracy);
    
    let rowHTML;
    for (let i = 0; i < personalScoreboard.length; i++) {
        rowHTML = rowHTML + `<tr><td>${personalScoreboard[i].shape}</td><td>${personalScoreboard[i].accuracy}</td></tr>`
    }

    personalScoreboardElement = rowHTML;
}
