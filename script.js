let data; //variavel global para salvar o data (que é o json da API)

fetch("https://dogapi.dog/api/v2/breeds").then(response => response.json()) //info's
.then(json =>  {
    data = json;
    console.log(data);
});


var user = document.querySelector(".search-input");
var button = document.querySelector(".button-search");


button.addEventListener("click", () => {
    let encontrado = false;

    if (!data || !data.data) { alert("Dados da API ainda não carregados"); return; }

    if (user.value == '') {
        alert("Digite o nome de uma raça de cachorro");
        user.value = '';
        encontrado = true;
    }

    data.data.forEach(raca => {
        
        if (user.value == raca.attributes.name) {
            mostrarCachorro(raca);
            encontrado = true;
            user.value = '';
            console.log("mostrando");
        }
    });
    
    if (!encontrado) { 
        alert("Esse cachorro não existe");
        user.value = '';
    }
});


function mostrarCachorro(raca) {
    let mostrando = document.querySelector('.div-mostrando-cachorros');
    let containerBottom = document.querySelector('.container-bottom');
    containerBottom.classList.add('show');
    
    fetch(`https://dog.ceo/api/breed/${raca.attributes.name.toLowerCase()}/images/random`).then (response => response.json()) //imagens
    .then(data => {
        mostrando.querySelector('.dog-image').src = data.message;
        mostrando.querySelector('.dog-image').alt = "Imagem de um " + raca.attributes.name;
    });

    document.getElementById('dog-name').innerHTML = `<b>${raca.attributes.name}</b>`;
    document.getElementById('description-dog').textContent = raca.attributes.description;
}

let botaoX = document.querySelector('.botaoX');

botaoX.addEventListener("click", () => {
    let containerBottom = document.querySelector('.container-bottom');
    containerBottom.classList.remove('show');
})