import api from './api.js';
import {setHeartsListeners} from './hearts.js'

document.addEventListener("DOMContentLoaded", async function () {
    // Код здесь будет ждать до загрузки DOM
    const theoryContent = document.getElementById('theory-content');
    const theoryId = theoryContent.dataset.theoryId;
    const theory = await api.getTheoryById(theoryId);
    console.log(theory);
    // document.getElementById('title').innerHTML = theory.title;
    // document.getElementById('desription').innerHTML = theory.description;
    // document.getElementById('views').innerHTML = theory.views;

    theoryContent.innerHTML = `
    <li><span class="topic">Окружности</span> <span class="grade">8 класс</span><img class='heart1' alt=""
                                                                                                     src="heart.svg"></li>
        <li class="title" id="title">${theory.title}</li>
        <li class="description" id="description">${theory.description}</li>
        <li class="views-amount" id="views">Просмотры: ${theory.views}</li>
    `

    document.getElementById('image-content').innerHTML = `
    <img style="width:526px;height:651px; margin-right:-100px" alt="" src=${theory.images[0].filename}>
    `
    setHeartsListeners();
});
