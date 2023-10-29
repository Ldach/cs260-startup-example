function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('pass').value;
    if (username && password) {
        localStorage.setItem("userName", username);
        localStorage.setItem("password", password);
        window.location.href = "play.html";
    }
    else
    {
        alert('Please enter a username and a password.');
        return false;
    }
  }
  