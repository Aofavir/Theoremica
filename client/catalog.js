import api from './api.js';
import { setHeartsListeners } from './hearts.js'

document.addEventListener("DOMContentLoaded", async function () {
    // Код здесь будет ждать до загрузки DOM
    const theories = await api.getAllTheories();
    console.log(theories);
    
    setHeartsListeners();
});