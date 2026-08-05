// Seleciona todos os elementos com a classe .card
const cards = document.querySelectorAll(".card");

// Aplica o estado inicial escondido para cada card antes da animação acontecer
cards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = ".8s";
});

// Monitora o evento de scroll da página
window.addEventListener("scroll", () => {
    cards.forEach(card => {
        const pos = card.getBoundingClientRect().top;
        
        // Se o card aparecer na tela, ele executa a animação de subida
        if (pos < window.innerHeight - 100) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
});

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