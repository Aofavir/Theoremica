import api from "./api.js";

document.addEventListener("DOMContentLoaded", async function () {
    const headerRight = document.getElementById('header-right-part');
    const user = await api.getCurrentUser()
    console.log(user)
    // headerRight.innerHTML =

})