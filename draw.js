document.addEventListener('DOMContentLoaded', function() {
    usernameDiv = document.querySelector("#username-div");
    username = document.createElement("h2");
    username.textContent = localStorage.getItem("username");
    usernameDiv.appendChild(username);
});