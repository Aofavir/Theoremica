document.addEventListener("DOMContentLoaded", function () {
    const edits = document.getElementsByClassName('edit-img');
    console.log(edits)
    console.log(Array.from(edits))
    document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-img")) {
        event.preventDefault();
        window.location.href = "editor.html";
    }
});
})