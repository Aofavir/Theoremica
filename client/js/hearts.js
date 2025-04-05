export function setHeartsListeners(theories) {
  const hearts = document.getElementsByClassName("heart");
  Array.from(hearts).forEach((heart) => {
    // initial fill
    const likes = localStorage.getItem("likes");
    if (likes) {
      if (JSON.parse(likes).includes(heart.dataset.id)) {
          heart.classList.add('heart-filled')
        heart.src = "images/heart-filled.png";
      }
    }

    // click event
    heart.addEventListener("click", (event) => {
      if (heart.classList.contains("heart-filled")) {
        heart.src = "images/heart.svg";
        // remove from localStorage
        const likes = localStorage.getItem("likes");
        if (likes) {
          localStorage.setItem(
            "likes",
            JSON.stringify(
              JSON.parse(likes).filter((id) => id !== heart.dataset.id)
            )
          );
        }
      } else {
        heart.src = "images/heart-filled.png";
        // add to localStorage
        const likes = localStorage.getItem("likes");
        localStorage.setItem(
          "likes",
          JSON.stringify([
            ...(likes ? JSON.parse(likes) : []),
            heart.dataset.id,
          ])
        );
      }

      heart.classList.toggle("heart-filled");
      buildLikesList(theories);
      event.preventDefault();
    });
  });
}

export function buildLikesList(theories) {
  const likes = localStorage.getItem("likes");
  const favoritesBlock = document.getElementById("favorite-theories");
  if (likes && favoritesBlock) {
      let likesHtml = "<li><img src=\"images/heart.svg\" class=\"star\" alt=\"Star\"><span class='title-left'>Избранное</span></li>";
      for (const like of likes) {
          const likedTheory = theories.find((theory) => theory.id == like);
          if (likedTheory) {
              likesHtml += `<li class="string"><a href="${likedTheory.id}.html">${likedTheory.title}</a></li>`;
          }
      }
      favoritesBlock.innerHTML = likesHtml;
  }
}
