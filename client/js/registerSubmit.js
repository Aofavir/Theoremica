import api from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        sendData();
    })

    async function sendData() {
        console.log(registerForm)
        const formData = new FormData(registerForm);
        console.log(Array.from(formData));
        await api.signup(formData);
        window.location.href='/login.html';
    }
});
