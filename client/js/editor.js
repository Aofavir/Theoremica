import api from "./api.js";


document.addEventListener("DOMContentLoaded", async function () {
    const user = await api.getCurrentUser()
    if (!(user?.is_admin && user['is_admin'])) {
        window.location.href = '/'
    }
    const url_string = window.location.href;
    const url = new URL(url_string);
    const id = url.searchParams.get("id");
    const theoryContent = document.getElementById("editor-form");
    const theory = await api.getTheoryById(id);
    const editorForm = document.getElementById('editor-form');
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

    editorForm.addEventListener('submit', (event) => {
        event.preventDefault();
        sendData();
    })

    async function sendData() {
        const formData = new FormData(editorForm);
        const formArray = Array.from(formData);
        await api.change_theory(id, formArray[0][1], formArray[1][1]);
        window.location.href = '/'
    }
})