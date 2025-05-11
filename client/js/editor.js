import api from "./api.js";
import {setHeartsListeners} from "./hearts.js";
// import katex from "express/lib/view";

document.addEventListener("DOMContentLoaded", async function () {
    // Код здесь будет ждать до загрузки DOM
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("id");
    console.log(id);
    const theoryContent = document.getElementById("login-form");
    const theoryId = id;
    const theory = await api.getTheoryById(theoryId);
    console.log(theory);
    theoryContent.innerHTML = `
    <div class="form-item">
        Название
        <label class="mail-text" style="max-width:100%">
            <input name="title" type="text" placeholder="Введите название" class="form" id="title-text" value="${theory.title}">
        </label>
        <div class="form-item">
            Описание
            <label class="password-text">
                <textarea name="description" cols="99" rows="8" id="description-text">${theory.description}</textarea>
            </label>
        </div>
    </div>
    <button class="log-in-button link" id="edit-button" type="submit"><img src="images/pen-fill.svg"
                                                                           class="edit-img"
                                                                           style="margin-top:6px"
                                                                           alt="User"><span class="enter">Подтвердить</span>
    </button>
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
