document.addEventListener("DOMContentLoaded", function () {
    // Код здесь будет ждать до загрузки DOM

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
                console.log(1);
                // remove from localStorage
                const likes = localStorage.getItem('likes');
                if (likes) {
                    localStorage.setItem('likes', JSON.stringify(JSON.parse(likes).filter(id => id !== heart.dataset.id)));
                }
            } else {
                heart.src = 'heart-filled.png';
                console.log(heart);
                // add to localStorage
                const likes = localStorage.getItem('likes');
                localStorage.setItem('likes', JSON.stringify([...(likes ? JSON.parse(likes) : []), heart.dataset.id]));
            }

            heart.classList.toggle('heart-filled');
        })
    })


    class Api {
        constructor(baseURL = 'http://localhost:5000') {
            this.baseURL = baseURL;
        }

        async getAllTheories() {
            try {
                const response = await fetch(`${this.baseURL}/theories`);
                if (!response.ok) throw new Error('Failed to fetch theories');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching theories:', error);
            }
        }

        async getTheoryById(id) {
            try {
                const response = await fetch(`${this.baseURL}/theories/${id}`);
                if (!response.ok) throw new Error(`Theory with ID ${id} not found`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error(`Error fetching theory ${id}:`, error);
            }
        }

        async updateTheoryViews(id) {
            try {
                const response = await fetch(`${this.baseURL}/theories/${id}/views`, {
                    method: 'PUT',  // Using PUT to update the views count
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error(`Failed to update views for theory ${id}`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error(`Error updating views for theory ${id}:`, error);
            }
        }
    }
});