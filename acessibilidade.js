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

//////////////////////
// Tamanho da Fonte //
//////////////////////

let escala = 100;

const elementos = document.querySelectorAll(

"main, section, section *, footer, footer *"

function atualizarFonte() {
    document.documentElement.style.setProperty(
        "--escala-fonte",
        escala + "%"
    );
}

document.getElementById("fonteMais").onclick = () => {
    if (escala < 150) {
        escala += 10;
        atualizarFonte();
    }
};

document.getElementById("fonteMenos").onclick = () => {
    if (escala > 80) {
        escala -= 10;
        atualizarFonte();
    }
};

document.getElementById("fontePadrao").onclick = () => {
    escala = 100;
    atualizarFonte();
};