let errorMessage;

async function login() {
    loginOrCreate(`/api/auth/login`);
}

async function create_account() {
    loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint) {
    const username = document.querySelector('#name')?.value;
    const password = document.querySelector('#password')?.value;
    const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    });

    if (response.ok) {
        localStorage.setItem('username', username);
        window.location.href = 'select.html';
    } else {
        const body = await response.json();
        const modalEl = document.querySelector('#formError');
        modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
        const msgModal = new bootstrap.Modal(modalEl, {});
        msgModal.show();
    }
}

/*function login() {
    const formElement = document.querySelector("#form");
    try {
        const response = await fetch('/auth/login', {
            method: 'GET',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({username: document.querySelector("#name").value})
        }


        )
    }
    // checking to see if username/password combination stored in local storage matches input
    // as of right now, this will never happen, but this will later be replaced by a database call
    // that checks the stored username and password combinations
    if (localStorage.getItem("name") != null 
        && (localStorage.getItem("name") === document.querySelector("#name").value)) {
        if (localStorage.getItem("password") != null 
            && (localStorage.getItem("password") === document.querySelector("#password").value)) {
            window.location.href = "select.html";
            return;
        } else {
            if (!formElement.hasAttribute("login_wrong_password_error_message")) {
                clearErrorMessage();
                errorMessage = document.createElement("div");
                errorMessage.textContent = "Incorrect password";
                formElement.appendChild(errorMessage);
                formElement.setAttribute("login_wrong_password_error_message", "true");
            }
        }
    } 

    if (!formElement.hasAttribute("login_unknown_account_error_message")) {
        clearErrorMessage();
        errorMessage = document.createElement("div");
        errorMessage.textContent = "Unregistered account";
        formElement.appendChild(errorMessage);
        formElement.setAttribute("login_unknown_account_error_message", "true");
    }
}

function create_account() {
    const formElement = document.querySelector("#form");
    const nameElement = document.querySelector("#name");
    const passwordElement = document.querySelector("#password");
    
    if (nameElement.value === "" || passwordElement.value === "") {
        // TODO: add regex to see if username/password are reasonable
        if (!formElement.hasAttribute("account_creation_error_message")) {
            clearErrorMessage();
            errorMessage = document.createElement("div");
            errorMessage.textContent = "Please input both a username and password";
            formElement.appendChild(errorMessage);
            formElement.setAttribute("account_creation_error_message", "true");
        }
        return;
    }

    localStorage.clear();
    localStorage.setItem("username", nameElement.value);
    localStorage.setItem("password", passwordElement.value);
    window.location.href = "select.html";
}

function clearErrorMessage() {
    const formElement = document.querySelector("#form");

    if (errorMessage) {
        formElement.removeChild(errorMessage);
        errorMessage = null;
    }

    formElement.removeAttribute("account_creation_error_message");
    formElement.removeAttribute("login_wrong_password_error_message");
    formElement.removeAttribute("login_unknown_account_error_message");
}*/

async function login_as_guest() {
    localStorage.clear();
    localStorage.setItem("username", "Guest");
    localStorage.setItem("password", null);

    try {
        const response = await fetch('/api//auth/logout', {
          method: 'DELETE',
        });
    } catch {
        console.log("Logout failed");
    }

    window.location.href = "select.html";
}

function logout() {
    localStorage.removeItem('username');
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => (window.location.href = 'login.html'));
  }

/*async function logout() {
    localStorage.clear();
    try {
        const response = await fetch('/api/logout', {
          method: 'DELETE',
          headers: {'content-type': 'application/json'},
        });
    } catch {
        console.log("Logout failed");
    }
}*/