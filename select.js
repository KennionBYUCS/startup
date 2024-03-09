let shapeErrorMessage;

document.addEventListener('DOMContentLoaded', function () {
    usernameDiv = document.querySelector("#username-div");
    username = document.createElement("h2");
    username.textContent = localStorage.getItem("username");
    usernameDiv.appendChild(username);
});

function getShapeType() {
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

    if (shapeTypeElement.value === "polygon" && numberOfSidesElement.value === "") {
        clearErrorMessage(parametersElement);
        shapeErrorMessage = document.createElement("div");
        shapeErrorMessage.textContent = "Please input a number of sides";
        parametersElement.appendChild(shapeErrorMessage);
        return;
    }

    if (shapeTypeElement.value === "polygon" && parseInt(numberOfSidesElement.value) === NaN) {
        clearErrorMessage(parametersElement);
        shapeErrorMessage = document.createElement("div");
        shapeErrorMessage.textContent = "Please input a valid number of sides";
        parametersElement.appendChild(shapeErrorMessage);
        return;
    }

    if (shapeTypeElement.value === "polygon"
        && (parseInt(numberOfSidesElement.value) < 3
            || parseInt(numberOfSidesElement.value) > 12)) {
        clearErrorMessage(parametersElement);
        shapeErrorMessage = document.createElement("div");
        shapeErrorMessage.textContent = "Please input a number of sides between 3 and 12";
        parametersElement.appendChild(shapeErrorMessage);
        return;
    }
    else { // number of sides within range
        // stored as string, will need to be converted in draw page
        localStorage.setItem("shape-type", "polygon");
        localStorage.setItem("sides", numberOfSidesElement.value);
    }

    if (shapeTypeElement.value === "ellipse" && parseFloat(focalDistanceElement.value) === NaN) {
        clearErrorMessage(parametersElement);
        shapeErrorMessage = document.createElement("div");
        shapeErrorMessage.textContent = "Please input a valid focal distance";
        parametersElement.appendChild(shapeErrorMessage);
        return;
    }

    if (shapeTypeElement.value === "ellipse" && parseFloat(focalDistanceElement.value) < 0) {
        clearErrorMessage(parametersElement);
        shapeErrorMessage = document.createElement("div");
        shapeErrorMessage.textContent = "Please input a positive focal distance";
        parametersElement.appendChild(shapeErrorMessage);
        return;
    }

    if (shapeTypeElement.value === "ellipse" && parseFloat(focalDistanceElement.value) === 0) {
        localStorage.setItem("shape-type", "circle");
        return;
    }

    if (shapeTypeElement.value === "ellipse" && focalDistanceTooLarge(focalDistanceElement.value)) {
        // TODO: set lower bound for focal distance
        clearErrorMessage(parametersElement);
        shapeErrorMessage = document.createElement("div");
        shapeErrorMessage.textContent = "Please input a positive focal distance";
        parametersElement.appendChild(shapeErrorMessage);
        return;
    }
    else {
        localStorage.setItem("shape-type", "ellipse");
        localStorage.setItem("focal", focalDistanceElement.value);
        return;
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
    return Math.min(.9 * window.innerHeight, .9 * window.innerWidth + 200);
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