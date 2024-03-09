function login() {
    const formElement = document.querySelector("#form");
    // checking to see if username/password combination stored in local storage matches input
    if (localStorage.getItem("name") != null 
        && (localStorage.getItem("name") === document.querySelector("#name").value)) {
        if (localStorage.getItem("password") != null 
            && (localStorage.getItem("password") === document.querySelector("#password").value)) {
            window.location.href = "select.html";
            return;
        } else {
            if (!formElement.hasAttribute("login_wrong_password_error_message")) {
                removeErrorTypes();
                formElement.append("Incorrect password");
                formElement.setAttribute("login_wrong_password_error_message", "true");
            }
        }
    } 

    if (!formElement.hasAttribute("login_unknown_account_error_message")) {
        removeErrorTypes();
        formElement.append("Unregistered account");
        formElement.setAttribute("login_unknown_account_error_message", "true");
    }
}

function create_account() {
    const formElement = document.querySelector("#form");
    const nameElement = document.querySelector("#name");
    const passwordElement = document.querySelector("#password");
    
    if (nameElement.value === "" || passwordElement.value === "") {
        // could also add regex types to see if username/password are reasonable
        if (!formElement.hasAttribute("account_creation_error_message")) {
            removeErrorTypes();
            formElement.append("Please input both a username and password");
            formElement.setAttribute("account_creation_error_message", "true");
        }
        return;
    }

    localStorage.setItem("username", nameElement.value);
    localStorage.setItem("password", passwordElement.value);
    window.location.href = "select.html";
}

function removeErrorTypes() {
    const formElement = document.querySelector("#form");

    formElement.removeAttribute("account_creation_error_message");
    formElement.removeAttribute("login_wrong_password_error_message");
    formElement.removeAttribute("login_unknown_account_error_message");
}

function login_as_guest() {
    localStorage.setItem("username", "Guest");
    // not sure if null values can be stored like this
    localStorage.setItem("password", null);
    window.location.href = "select.html";
}

function logout() {
    localStorage.setItem("username", null);
    localStorage.setItem("password", null);
}