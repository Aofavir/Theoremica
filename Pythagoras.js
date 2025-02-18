const theory = await api.getTheoryById(1);
console.log(theory);
document.getElementById('title').innerHTML = theory.title;
document.getElementById('desription').innerHTML = theory.description;
document.getElementById('views').innerHTML = theory.views;