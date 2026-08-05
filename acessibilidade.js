let leitura;

// Elementos
const botao = document.querySelector(".btn-acessibilidade");
const menu = document.querySelector(".menu-acessibilidade");

const controle = document.getElementById("controleLeitura");
const status = document.getElementById("statusLeitura");

// ==========================
// Ler página
// ==========================

document.getElementById("lerPagina").onclick = () => {

    speechSynthesis.cancel();

    leitura = new SpeechSynthesisUtterance(document.body.innerText);

    leitura.lang = "pt-BR";

    speechSynthesis.speak(leitura);

    // Fecha o menu
    menu.classList.remove("ativo");

    // Mostra o balão
    controle.style.display = "flex";

    status.innerHTML = "🔊 Lendo...";

};

// ==========================
// Controles do balão
// ==========================

// Pausar

document.getElementById("pausarBtn").onclick = () => {

    speechSynthesis.pause();

    status.innerHTML = "⏸ Pausado";

};

// Continuar

document.getElementById("continuarBtn").onclick = () => {

    speechSynthesis.resume();

    status.innerHTML = "🔊 Lendo...";

};

// Parar

document.getElementById("pararBtn").onclick = () => {

    speechSynthesis.cancel();

    controle.style.display = "none";

};

// ==========================
// Menu de acessibilidade
// ==========================

botao.addEventListener("click", function(e) {

    e.stopPropagation();

    menu.classList.toggle("ativo");

});

document.addEventListener("click", function() {

    menu.classList.remove("ativo");

});

menu.addEventListener("click", function(e) {

    e.stopPropagation();

});

let tamanhoFonte = 100;

function aplicarFonte(){

    document.body.style.fontSize = tamanhoFonte + "%";

}

document.getElementById("fonteMais").onclick = () =>{

    if(tamanhoFonte < 150){

        tamanhoFonte += 10;

        aplicarFonte();

    }

}

document.getElementById("fonteMenos").onclick = () =>{

    if(tamanhoFonte > 80){

        tamanhoFonte -= 10;

        aplicarFonte();

    }

}

document.getElementById("fontePadrao").onclick = () =>{

    tamanhoFonte = 100;

    aplicarFonte();

}