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
        const test = await api.signup(formData);
        if (test.message === 'Аккаунт создан') {
            console.log('successful register')
            window.location.href='/';
        } else {
            const responseBox = document.getElementById('error-response')
            responseBox.innerHTML = test.message
            console.log(test)
        }
    }
});
