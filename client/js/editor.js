import api from "./api.js";
import {setHeartsListeners} from "./hearts.js";
// import katex from "express/lib/view";

document.addEventListener("DOMContentLoaded", async function () {
    // Код здесь будет ждать до загрузки DOM
    const theoryContent = document.getElementById("editor-content");
    const theoryId = theoryContent.dataset.theoryId;
    const theory = await api.getTheoryById(theoryId);
    console.log(theory);
    theoryContent.innerHTML = `
    <li><span class="topic">${theory.topics}</span> <span class="grade">${theory.grade} класс</span><img class='heart1' alt=""
                                                                                                     src="images/heart.svg"></li>
        <li class="title" id="title">${theory.title}</li>
        <li class="description" id="description">${theory.description}</li>
        <li class="views-amount" id="views">Просмотры: ${theory.views}</li>
    `;

    renderMathInElement(document.body, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false},
        ],
    });
    document.getElementById("image-content").innerHTML = `
    <img style="width:75%;height:75%; margin-right:-100px; margin-top: 65px" alt="" src=${
        theory.images?.[0]?.filename ?? ""
    }>
    `;
    setHeartsListeners();

    await api.updateTheoryViews(theoryId);
});
