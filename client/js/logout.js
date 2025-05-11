import api from './api.js'

document.addEventListener("DOMContentLoaded", function () {
    const logouts = document.getElementsByClassName('logout');
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("logout")) {
            event.preventDefault();
            api.logout();
            console.log('logged out')
            window.location.href='/'
        }
    });
})