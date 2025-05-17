document.addEventListener("DOMContentLoaded", function () {
    const edits = document.getElementsByClassName('edit-img');
    document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-img")) {
        event.preventDefault();
        window.location.href = `editor.html?id=${event.target.dataset.id}`
    }
});
})