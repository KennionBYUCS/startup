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
        const form = document.querySelector('#form');
        errorMessage = document.createElement("div");
        errorMessage.textContent = `⚠ Error: ${body.msg}`;
        form.appendChild(errorMessage);
    }
}

async function login_as_guest() {
    localStorage.clear();
    localStorage.setItem("username", "Guest");
    localStorage.setItem("password", null);

    try {
        const response = await fetch('/api/auth/logout', {
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