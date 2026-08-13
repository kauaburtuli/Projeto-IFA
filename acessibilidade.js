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

//let escala = 1;


// function atualizarFonte() {
//     document.documentElement.style.setProperty(
//         "--escala-fonte",
//         escala
//     );
// }

// document.getElementById("fonteMais").onclick = () => {
//     if (escala < 1.5) {
//         escala += 0.1;
//         atualizarFonte();
//     }
// };

// document.getElementById("fonteMenos").onclick = () => {
//     if (escala > 0.8) {
//         escala -= 0.1;
//         atualizarFonte();
//     }
// }

//////////////////////
// Tamanho da Fonte //
//////////////////////

let escala = 1;

// Todos os elementos de texto do conteúdo
const textos = document.querySelectorAll(
    "main h1, main h2, main h3, main h4, main h5, main h6, main p, main a, main li, main span, main button"
);

// Guarda o tamanho original
textos.forEach(el => {
    const tamanho = parseFloat(getComputedStyle(el).fontSize);
    el.dataset.fonteOriginal = tamanho;
});

// function atualizarFonte() {

//     textos.forEach(el => {

//         const original = parseFloat(el.dataset.fonteOriginal);

//         el.style.fontSize = (original * escala) + "px";

//     });

// }

// document.getElementById("fonteMais").onclick = () => {

//     if (escala < 1.5) {
//         escala += 0.1;
//         atualizarFonte();
//     }

// };

// document.getElementById("fonteMenos").onclick = () => {

//     if (escala > 0.8) {
//         escala -= 0.1;
//         atualizarFonte();
//     }

// };

// document.getElementById("fontePadrao").onclick = () => {

//     escala = 1;
//     atualizarFonte();

// };

//////////////////////
// Tamanho da Fonte //
//////////////////////

// Recupera a escala salva ou usa 1 (100%)
let escala = parseFloat(localStorage.getItem("escalaFonte")) || 1;

// Seleciona todos os textos do conteúdo
const textos = document.querySelectorAll(
    "main h1, main h2, main h3, main h4, main h5, main h6, main p, main a, main li, main span, main button, main pre, main code"
);

// Guarda o tamanho original que o navegador calculou
textos.forEach(el => {
    const tamanho = parseFloat(getComputedStyle(el).fontSize);
    el.dataset.fonteOriginal = tamanho;
});

// Aplica a escala
function atualizarFonte() {

    textos.forEach(el => {

        const original = parseFloat(el.dataset.fonteOriginal);

        el.style.fontSize = (original * escala) + "px";

    });

    // Salva a escala
    localStorage.setItem("escalaFonte", escala);

}

// Aplica automaticamente ao abrir a página
atualizarFonte();

// A+
document.getElementById("fonteMais").onclick = () => {

    if (escala < 1.5) {

        escala = +(escala + 0.1).toFixed(1);
        atualizarFonte();

    }

};

// A-
document.getElementById("fonteMenos").onclick = () => {

    if (escala > 0.8) {

        escala = +(escala - 0.1).toFixed(1);
        atualizarFonte();

    }

};

// A (normal)
document.getElementById("fontePadrao").onclick = () => {

    escala = 1;
    atualizarFonte();

};

const botaoContraste = document.getElementById("contraste");

// Verifica se estava ativado
if(localStorage.getItem("contraste") === "on"){

    document.body.classList.add("alto-contraste");
    botaoContraste.innerHTML = "☀️ Tema normal";

}

botaoContraste.onclick = () => {

    document.body.classList.toggle("alto-contraste");

    if(document.body.classList.contains("alto-contraste")){

        botaoContraste.innerHTML = "☀️ Tema normal";
        localStorage.setItem("contraste", "on");

    }else{

        botaoContraste.innerHTML = "🌙 Alto contraste";
        localStorage.setItem("contraste", "off");

    }

};