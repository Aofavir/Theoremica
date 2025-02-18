import api from "./api.js";
import {setHeartsListeners} from "./hearts.js";

document.addEventListener("DOMContentLoaded", async function () {
    // Код здесь будет ждать до загрузки DOM
    const theories = await api.getAllTheories();
    console.log("All theories", theories);
    let theoriesHtml = "";
    for (const theory of theories) {
        theoriesHtml += `
        
            <a class="theory-link center" href='${theory.id}.html'>
                
                <ul class="block-content-card">
                    <li class="title">${theory.title}</li>
                    <li><span class="topic">${theory.topics}</span> <span class="grade">${theory.grade} класс</span></li>
                    <li></li>
                    <li></li>
                    <li class="views-amount">просмотров: ${theory.views}</li>
                </ul>
                
                <div class="heart-and-img"><img style="width:228px;height:258px; margin-right:-100px" alt=""
                                                src="${
            theory.images?.[0]
                ?.filename ?? ""
        }">
                    <img data-id="${
            theory.id
        }" class='heart' alt="" src="heart.svg">
                </div>
                
            </a>
        
    `;
    }
    const theoriesList = document.getElementById("theories-list");
    if (theoriesList) {
        theoriesList.innerHTML = theoriesHtml;
    }

    const popular = await api.getPopularTheories();
    console.log("Popular", popular);
    let popularListHtml = "";
    for (const popularTheory of popular) {
        popularListHtml += `<li class="string"><a href="${popularTheory.id}.html">${popularTheory.title}</a></li>`;
    }
    const popularBlock = document.getElementById("popular-theories");
    if (popularBlock) {
        popularBlock.innerHTML += popularListHtml;
    }

    const likes = localStorage.getItem("likes");
    const favoritesBlock = document.getElementById("favorite-theories");
    if (likes && favoritesBlock) {
        let likesHtml = "";
        for (const like of likes) {
            const likedTheory = theories.find((theory) => theory.id == like);
            if (likedTheory) {
                likesHtml += `<li class="string"><a href="${likedTheory.id}.html">${likedTheory.title}</a></li>`;
            }
        }
        favoritesBlock.innerHTML += likesHtml;
    }

    setHeartsListeners();
});
