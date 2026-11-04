let data; //variavel global para salvar o data (que é o json da API)


// SEÇÃO API -------------------------------------------------------------------------------
let todasAsRacas = [];

async function carregarTodasAsRacas(url = "https://dogapi.dog/api/v2/breeds") {
    try {
        let response = await fetch(url);
        let json = await response.json();

        // adiciona as raças ao array global
        todasAsRacas.push(...json.data);

        // pega o link para a próxima página
        let proximaPagina = json.links && json.links.next;

        if (proximaPagina) {
            await carregarTodasAsRacas(proximaPagina);
        } else {
            console.log("todas as raças foram carregadas", todasAsRacas.length);
        }
    } catch (error) {
        console.error("Erro ao carregar as raças:", error);
    }
}

carregarTodasAsRacas();


// SEÇÃO DE PESQUISA DO USUARIO -------------------------------------------------------------------------------
var user = document.querySelector(".search-input");
var button = document.querySelector(".button-search");

// faz a busca se apertar o enter
user.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        button.click();
    }
});


button.addEventListener("click", () => {
    let termoBusca = user.value.trim();

    if (termoBusca === '') {
        alert("Enter the full name of a dog breed.");
        return;
    }

    let termoLower = termoBusca.toLowerCase();
    let racaEncontrada = null;


    if (todasAsRacas.length > 0) {
        racaEncontrada = todasAsRacas.find(raca => {
            let nomeRaca = raca.attributes.name.toLowerCase();
            let outrosNomes = raca.attributes.other_names 
                ? raca.attributes.other_names.map(n => n.toLowerCase()) 
                : [];
            return nomeRaca === termoLower || outrosNomes.includes(termoLower);
        });
    }

    if (racaEncontrada) {
        mostrarCachorro(racaEncontrada);
        user.value = '';
    } else {
        alert("This breed was not found in our system. Please check it and try again.");
        user.value = '';
    }
});


// SEÇÃO DE CARREGAMENTO DO RESULTADO -------------------------------------------------------------------------------
function mostrarCachorro(raca) {
    let mostrando = document.querySelector('.div-mostrando-cachorros');
    let loadingDiv = document.getElementById('loading');

    loadingDiv.style.display = 'block';
    mostrando.style.display = 'none';

    // tratamento para a API de imagens Dog CEO
    let nomeParaBuscaImg = raca.attributes.name.toLowerCase().trim();

    fetch(`https://dog.ceo/api/breed/${raca.attributes.name.toLowerCase()}/images/random`).then(response => response.json()) //imagens
        .then(imgData => {

            loadingDiv.style.display = 'none';
            mostrando.style.display = 'block';

            if (imgData.status === "success") {
                mostrando.querySelector('.dog-image').src = imgData.message;
                mostrando.querySelector('.dog-image').alt = "Image of a dog, which the breed is: " + raca.attributes.name;
            } else {
                console.log("Image not found for this specific breed.");
            }
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            mostrando.style.display = 'block';
            console.error("Error retrieving image: ", error)
        }
        );

    document.getElementById('dog-name').innerHTML = `<b>${raca.attributes.name}</b>`;
    document.getElementById('description-dog').textContent = raca.attributes.description;
}