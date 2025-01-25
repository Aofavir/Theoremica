export function setHeartsListeners() {
    const hearts = document.getElementsByClassName('heart');
    Array.from(hearts).forEach((heart) => {
        // initial fill
        const likes = localStorage.getItem('likes');
        if (likes) {
            if (JSON.parse(likes).includes(heart.dataset.id)) {
                heart.src = 'heart-filled.png';
            }
        }

        // click event
        heart.addEventListener('click', () => {
            if (heart.classList.contains('heart-filled')) {
                heart.src = 'heart.svg';
                // remove from localStorage
                const likes = localStorage.getItem('likes');
                if (likes) {
                    localStorage.setItem('likes', JSON.stringify(JSON.parse(likes).filter(id => id !== heart.dataset.id)));
                }
            } else {
                heart.src = 'heart-filled.png';
                // add to localStorage
                const likes = localStorage.getItem('likes');
                localStorage.setItem('likes', JSON.stringify([...(likes ? JSON.parse(likes) : []), heart.dataset.id]));
            }

            heart.classList.toggle('heart-filled');
        })
    })
}