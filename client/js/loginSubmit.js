import api from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');
    const checkbox = document.getElementById('remember');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        sendData();
    })

    async function sendData() {
        console.log(loginForm)
        const formData = new FormData(loginForm);
        console.log(Array.from(formData));
        formData.append('remember', checkbox.checked);
        const test = await api.login(formData);
        if (test.message === 'Успешная авторизация') {
            console.log('successful login')
            window.location.href='/';
        } else {
            const responseBox = document.getElementById('error-response')
            responseBox.innerHTML = test.message
        }
    }
});
