import React, { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    const checkUser = async () => {
      const userName = localStorage.getItem('userName');
      if (userName) {
        document.querySelector('#playerName').textContent = userName;
        setDisplay('loginControls', 'none');
        setDisplay('playControls', 'block');
      } else {
        setDisplay('loginControls', 'block');
        setDisplay('playControls', 'none');
      }
    };

    checkUser();
  }, []);

  const loginUser = async () => {
    loginOrCreate(`/api/auth/login`);
  };

  const createUser = async () => {
    loginOrCreate(`/api/auth/create`);
  };

  const loginOrCreate = async (endpoint) => {
    const userName = document.querySelector('#userName')?.value;
    const password = document.querySelector('#userPassword')?.value;
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    if (response.ok) {
      localStorage.setItem('userName', userName);
      window.location.href = 'play.html';
    } else {
      const body = await response.json();
      const modalEl = document.querySelector('#msgModal');
      modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
      const msgModal = new bootstrap.Modal(modalEl, {});
      msgModal.show();
    }
  };

  const play = () => {
    window.location.href = 'play.html';
  };

  const logout = () => {
    localStorage.removeItem('userName');
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => (window.location.href = '/'));
  };

  const getUser = async (email) => {
    let scores = [];
    // See if we have a user with the given email.
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
      return response.json();
    }

    return null;
  };

  const setDisplay = (controlId, display) => {
    const playControlEl = document.querySelector(`#${controlId}`);
    if (playControlEl) {
      playControlEl.style.display = display;
    }
  };

  return (
    // JSX content for the component if needed
    <div>
      {/* ... */}
    </div>
  );
};

export default Login;
