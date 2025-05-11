import api from "./api.js";

document.addEventListener("DOMContentLoaded", async function () {
    const headerRight = document.getElementById('header-right-part');
    const user = await api.getCurrentUser()
    if (user) {
        headerRight.innerHTML = `
        <div class="title login-name top-row-link">${user.surname} ${user.first_name}</div>
        <div class="logout button top-row-link link">Выйти</div>
    `
    }

})