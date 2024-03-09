function login() {
    // checking to see if username/password combination stored in local storage matches input
    if (localStorage.getItem("name") != null 
        && (localStorage.getItem("name") === document.querySelector("#name"))) {
        if (localStorage.getItem("password") != null 
            && (localStorage.getItem("password") === document.querySelector("#password"))) {
            window.location.href = select.html;
            return;
        } else {
            // output incorrect password message
        }
    } else {
        // output unregistered username message
    }

    // inject string explaining account info not found
}

function create_account() {
    const nameElement = document.querySelector("#name");
    const passwordElement = document.querySelector("#password");

    if (nameElement === null || passwordElement === null) {
        // could also add regex types to see if username/password are reasonable
        // inject code asking to resubmit username and password before clicking button

        return;
    }

    localStorage.setItem("username", nameElement.value);
    localStorage.setItem("password", passwordElement.value);
    window.location.href = select.html;
}

function login_as_guest() {
    localStorage.setItem("username", "Guest");
    // not sure if null values can be stored like this
    localStorage.setItem("password", null);
    window.location.href = select.html;
}

function logout() {
    localStorage.setItem("username", null);
    localStorage.setItem("password", null);
}