import api from "./api.js";
import {buildLikesList, setHeartsListeners} from "./hearts.js";

document.addEventListener("DOMContentLoaded", async function () {
    // Код здесь будет ждать до загрузки DOM
    const theories = await api.getAllTheories();
    const user = await api.getCurrentUser()
    let theoriesHtml = "";
    if (user?.is_admin && user['is_admin']) {
        for (const theory of theories) {
            theoriesHtml += `
        
            <a class="theory-link center" href='${theory.id}.html'>
                
                <ul class="block-content-card">
                    <li class="title">${theory.title}</li>
                    <li><span class="topic">${theory.topics}</span><br/><br/><span class="grade">${theory.grade} класс</span></li>
                    <li></li>
                    <li></li>
                    <li class="views-amount">просмотров: ${theory.views}</li>
                </ul>
                
                <div class="heart-and-img"><img style="min-width: 314px; min-height: 10px;width:37.5%;height:37.5%; margin-right:-100px" alt="" src="${theory.images?.[0]?.filename ?? ""}"><img data-id="${theory.id}" class="edit-img" alt="Редактор" src="images/edit.svg"><img data-id="${theory.id}" id="heart" class='heart' alt="" src="images/heart.svg"></div>                
            </a>
        
    `;
        }
    } else {
        for (const theory of theories) {
            theoriesHtml += `
        
            <a class="theory-link center" href='${theory.id}.html'>
                
                <ul class="block-content-card">
                    <li class="title">${theory.title}</li>
                    <li><span class="topic">${theory.topics}</span><br/><br/><span class="grade">${theory.grade} класс</span></li>
                    <li></li>
                    <li></li>
                    <li class="views-amount">просмотров: ${theory.views}</li>
                </ul>
                
                <div class="heart-and-img"><img style="min-width: 314px; min-height: 10px;width:37.5%;height:37.5%; margin-right:-100px" alt="" src="${theory.images?.[0]?.filename ?? ""}"><img data-id="${theory.id}" id="heart" class='heart' alt="" src="images/heart.svg"></div>                
            </a>
        
    `;
        }
    }
    const theoriesList = document.getElementById("theories-list");
    if (theoriesList) {
        theoriesList.innerHTML = theoriesHtml;
    }

    const popular = await api.getPopularTheories();
    let popularListHtml = "";
    for (const popularTheory of popular) {
        popularListHtml += `<li class="string"><a href="${popularTheory.id}.html">${popularTheory.title}</a></li>`;
    }
    const popularBlock = document.getElementById("popular-theories");
    if (popularBlock) {
        popularBlock.innerHTML += popularListHtml;
    }

    buildLikesList(theories);
    setHeartsListeners(theories);
});
