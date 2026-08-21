// let leitura;

// // Elementos
// const botao = document.querySelector(".btn-acessibilidade");
// const menu = document.querySelector(".menu-acessibilidade");

// const controle = document.getElementById("controleLeitura");
// const status = document.getElementById("statusLeitura");

// // ==========================
// // Ler página
// // ==========================

// document.getElementById("lerPagina").onclick = () => {

//     speechSynthesis.cancel();

//     leitura = new SpeechSynthesisUtterance(document.body.innerText);

//     leitura.lang = "pt-BR";

//     speechSynthesis.speak(leitura);

//     // Fecha o menu
//     menu.classList.remove("ativo");

//     // Mostra o balão
//     controle.style.display = "flex";

//     status.innerHTML = "🔊 Lendo...";

// };

// // ==========================
// // Controles do balão
// // ==========================

// // Pausar

// document.getElementById("pausarBtn").onclick = () => {

//     speechSynthesis.pause();

//     status.innerHTML = "⏸ Pausado";

// };

// // Continuar

// document.getElementById("continuarBtn").onclick = () => {

//     speechSynthesis.resume();

//     status.innerHTML = "🔊 Lendo...";

// };

// // Parar

// document.getElementById("pararBtn").onclick = () => {

//     speechSynthesis.cancel();

//     controle.style.display = "none";

// };

// =======================================
// // LEITOR DE PÁGINA
// // =======================================

// const botaoLerPagina = document.getElementById("lerPagina");

// const modalLeitura = document.getElementById("modalLeitura");

// const cancelarLeitura =
//     document.getElementById("cancelarLeitura");

// const opcoesLeitura =
//     document.querySelectorAll(".opcao-leitura");

// const indicadorSelecao =
//     document.getElementById("indicadorSelecao");


// // Opção atualmente selecionada
// let opcaoLeitura = 0;


// // Modo atual
// let modoLeitura = null;


// // Próximo texto
// let proximoTexto = null;


// // Está lendo?
// let lendoTexto = false;


// // =======================================
// // ABRIR MODAL
// // =======================================

// botaoLerPagina.onclick = () => {

//     speechSynthesis.cancel();

//     modoLeitura = null;

//     opcaoLeitura = 0;

//     atualizarOpcao();

//     modalLeitura.classList.add("ativo");

//     modalLeitura.setAttribute("aria-hidden", "false");

//     falar(
//         "Selecione o tipo de leitura. " +
//         "Leitura geral. " +
//         "Leitura por seleção. " +
//         "Use as setas para escolher e Enter para confirmar."
//     );

// };

let leitura;

// ==========================
// Elementos
// ==========================

const botao = document.querySelector(".btn-acessibilidade");
const menu = document.querySelector(".menu-acessibilidade");

const controle = document.getElementById("controleLeitura");
const status = document.getElementById("statusLeitura");

const modalLeitura = document.getElementById("modalLeitura");
const cancelarLeitura = document.getElementById("cancelarLeitura");

const opcoesLeitura =
    document.querySelectorAll(".opcao-leitura");

const indicadorSelecao =
    document.getElementById("indicadorSelecao");


// ==========================
// Variáveis
// ==========================

let opcaoAtual = 0;

let modoLeitura = null;

let lendoTexto = false;

let proximoTexto = null;


// ==========================
// Função de fala
// ==========================

function falar(texto) {

    speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);

    fala.lang = "pt-BR";

    fala.rate = 1;

    fala.pitch = 1;

    speechSynthesis.speak(fala);

}


// ==========================
// Botão "Ler página"
// ==========================

document.getElementById("lerPagina").onclick = () => {

    speechSynthesis.cancel();

    opcaoAtual = 0;

    atualizarOpcao();

    modalLeitura.classList.add("ativo");

    modalLeitura.setAttribute(
        "aria-hidden",
        "false"
    );

};


// ==========================
// Atualizar opção
// ==========================

function atualizarOpcao() {

    opcoesLeitura.forEach((opcao, index) => {

        opcao.classList.remove("selecionada");

        if (index === opcaoAtual) {

            opcao.classList.add("selecionada");

        }

    });


    falar(
        opcoesLeitura[opcaoAtual].innerText.trim()
    );

}


// ==========================
// Teclado do modal
// ==========================

document.addEventListener("keydown", (e) => {

    if (!modalLeitura.classList.contains("ativo")) {
        return;
    }


    // ↓
    if (e.key === "ArrowDown") {

        e.preventDefault();

        opcaoAtual++;

        if (opcaoAtual >= opcoesLeitura.length) {

            opcaoAtual = 0;

        }

        atualizarOpcao();

    }


    // ↑
    if (e.key === "ArrowUp") {

        e.preventDefault();

        opcaoAtual--;

        if (opcaoAtual < 0) {

            opcaoAtual = opcoesLeitura.length - 1;

        }

        atualizarOpcao();

    }


    // Enter
    if (e.key === "Enter") {

        e.preventDefault();

        confirmarLeitura();

    }


    // ESC
    if (e.key === "Escape") {

        e.preventDefault();

        fecharModal();

    }

});


// ==========================
// Confirmar leitura
// ==========================

function confirmarLeitura() {

    const tipo =
        opcoesLeitura[opcaoAtual].dataset.tipo;


    fecharModal();


    if (tipo === "geral") {

        iniciarLeituraGeral();

    }


    if (tipo === "selecao") {

        iniciarLeituraSelecao();

    }

}


// ==========================
// Fechar modal
// ==========================

function fecharModal() {

    modalLeitura.classList.remove("ativo");

    modalLeitura.setAttribute(
        "aria-hidden",
        "true"
    );

    speechSynthesis.cancel();

}


// ==========================
// LEITURA GERAL
// ==========================

function iniciarLeituraGeral() {

    modoLeitura = "geral";

    // Lê TODA a página
    const texto = document.body.innerText.trim();


    if (!texto) {

        falar("Não há texto para leitura.");

        return;

    }


    iniciarLeituraTexto(texto);

}


// ==========================
// Iniciar leitura
// ==========================

function iniciarLeituraTexto(texto) {

    if (!texto) {
        return;
    }


    speechSynthesis.cancel();


    leitura =
        new SpeechSynthesisUtterance(texto);


    leitura.lang = "pt-BR";

    leitura.rate = 1;

    leitura.pitch = 1;


    lendoTexto = true;


    leitura.onend = () => {

        lendoTexto = false;


        // Se outro texto foi selecionado
        if (proximoTexto) {

            const novoTexto =
                proximoTexto;

            proximoTexto = null;

            iniciarLeituraTexto(novoTexto);

        } else {

            status.innerHTML = "✅ Leitura concluída";

        }

    };


    speechSynthesis.speak(leitura);


    // Fecha o menu
    menu.classList.remove("ativo");


    // Mostra o balão
    controle.style.display = "flex";

    status.innerHTML = "🔊 Lendo...";

}


// ==========================
// LEITURA POR SELEÇÃO
// ==========================

function iniciarLeituraSelecao() {

    modoLeitura = "selecao";


    document.body.classList.add(
        "modo-leitura-selecao"
    );


    indicadorSelecao.style.display = "block";


    falar(
        "Modo leitura por seleção ativado. " +
        "Clique no texto que deseja ouvir."
    );


    prepararElementos();

}


// ==========================
// Elementos que podem ser lidos
// ==========================

function prepararElementos() {

    const elementos =
        document.querySelectorAll(
            "main h1, " +
            "main h2, " +
            "main h3, " +
            "main h4, " +
            "main h5, " +
            "main h6, " +
            "main p, " +
            "main li, " +
            "main .texto, " +
            "main .titulo, " +
            "main .card, " +
            "main .item"
        );


    elementos.forEach(el => {

        if (
            el.dataset.leituraAtiva === "true"
        ) {

            return;

        }


        el.dataset.leituraAtiva = "true";


        el.addEventListener(
            "mouseenter",
            destacarElemento
        );


        el.addEventListener(
            "mouseleave",
            removerDestaque
        );


        el.addEventListener(
            "click",
            selecionarElemento
        );

    });

}


// ==========================
// Destacar
// ==========================

function destacarElemento(e) {

    if (modoLeitura !== "selecao") {
        return;
    }


    e.currentTarget.classList.add(
        "leitura-hover"
    );

}


// ==========================
// Remover destaque
// ==========================

function removerDestaque(e) {

    e.currentTarget.classList.remove(
        "leitura-hover"
    );

}


// ==========================
// Clicar no texto
// ==========================

function selecionarElemento(e) {

    if (modoLeitura !== "selecao") {
        return;
    }


    e.preventDefault();

    e.stopPropagation();


    const texto =
        e.currentTarget.innerText.trim();


    if (!texto) {
        return;
    }


    // Se já estiver lendo,
    // espera terminar
    if (lendoTexto) {

        proximoTexto = texto;

        return;

    }


    iniciarLeituraTexto(texto);

}


// ==========================
// PAUSAR
// ==========================

document.getElementById("pausarBtn").onclick = () => {

    speechSynthesis.pause();

    status.innerHTML = "⏸ Pausado";

};


// ==========================
// CONTINUAR
// ==========================

document.getElementById("continuarBtn").onclick = () => {

    speechSynthesis.resume();

    status.innerHTML = "🔊 Lendo...";

};


// ==========================
// PARAR
// ==========================

document.getElementById("pararBtn").onclick = () => {

    speechSynthesis.cancel();

    lendoTexto = false;

    proximoTexto = null;

    modoLeitura = null;


    document.body.classList.remove(
        "modo-leitura-selecao"
    );


    indicadorSelecao.style.display = "none";

    controle.style.display = "none";

    status.innerHTML = "⏹ Parado";

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

// let escala = 1;

// // Todos os elementos de texto do conteúdo
// const textos = document.querySelectorAll(
//     "main h1, main h2, main h3, main h4, main h5, main h6, main p, main a, main li, main span, main button"
// );

// // Guarda o tamanho original
// textos.forEach(el => {
//     const tamanho = parseFloat(getComputedStyle(el).fontSize);
//     el.dataset.fonteOriginal = tamanho;
// });

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
console.log("Escala:", escala);
console.log("Storage:", localStorage.getItem("escalaFonte"));

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

if (botaoContraste) {

    if (localStorage.getItem("contraste") === "on") {
        document.body.classList.add("alto-contraste");
        botaoContraste.innerHTML = "☀️ Tema normal";
    }

    botaoContraste.onclick = () => {

        document.body.classList.toggle("alto-contraste");

        if (document.body.classList.contains("alto-contraste")) {

            botaoContraste.innerHTML = "☀️ Tema normal";
            localStorage.setItem("contraste", "on");

        } else {

            botaoContraste.innerHTML = "🌙 Alto contraste";
            localStorage.setItem("contraste", "off");

        }

    };

}

/////////////////////////
// Fonte para Dislexia //
/////////////////////////

const botaoDislexia = document.getElementById("dislexia");

// Recupera a preferência salva
if(localStorage.getItem("dislexia") === "on"){

    document.body.classList.add("fonte-dislexia");
    botaoDislexia.innerHTML = "🔤 Fonte Normal";

}

botaoDislexia.onclick = () => {

    document.body.classList.toggle("fonte-dislexia");

    if(document.body.classList.contains("fonte-dislexia")){

        botaoDislexia.innerHTML = "🔤 Fonte Normal";
        localStorage.setItem("dislexia", "on");

    }else{

        botaoDislexia.innerHTML = "📖 Fonte para Dislexia";
        localStorage.setItem("dislexia", "off");

    }

};

///////////////////////
// Espaçamento maior //
///////////////////////

const botaoEspacamento = document.getElementById("espacamento");

//Recupera a preferência salva
if(localStorage.getItem("espacamento") === "on"){

    document.body.classList.add("espacamento");
    botaoEspacamento.innerHTML = "↔  Espaçamento normal";

}

// Clique no botão
botaoEspacamento.onclick = () => {

    document.body.classList.toggle("espacamento");

    if(document.body.classList.contains("espacamento")) {

        botaoEspacamento.innerHTML = "↔ Espaçamento normal";

        localStorage.setItem("espacamento", "on");

    }else{
        botaoEspacamento.innerHTML = "↔ Aumentar espaçamento";

        localStorage.setItem("espacamento", "off");

    }
};

/////////////////////
// Cursor ampliado //
/////////////////////

const cursor = document.getElementById("cursorGrande");
const botaoCursor = document.getElementById("cursor");

document.addEventListener("mousemove",(e)=>{

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

});

// Recupera a preferência

if(localStorage.getItem("cursor") === "on"){

    document.body.classList.add("cursor-grande");
    botaoCursor.innerHTML = "🖱 Cursor normal";

}

// Botão

botaoCursor.onclick = ()=>{

    document.body.classList.toggle("cursor-grande");

    if(document.body.classList.contains("cursor-grande")){

        botaoCursor.innerHTML = "🖱 Cursor normal";
        localStorage.setItem("cursor","on");

    }else{

        botaoCursor.innerHTML = "🖱 Cursor ampliado";
        localStorage.setItem("cursor","off");

    }

};

// Movimento do cursor

document.addEventListener("mousemove",(e)=>{

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

});

// Cresce ao passar sobre elementos clicáveis

document.querySelectorAll("a, button").forEach(el=>{

    el.addEventListener("mouseenter",()=>{

        cursor.classList.add("hover");

    });

    el.addEventListener("mouseleave",()=>{

        cursor.classList.remove("hover");

    });

});

/////////////////////////
// Reduzir animações //
/////////////////////////

const botaoAnimacoes = document.getElementById("animacoes");

// Recupera a preferência salva
if(localStorage.getItem("animacoes") === "on"){

    document.body.classList.add("reduzir-animacoes");
    botaoAnimacoes.innerHTML = "🎞 Animações normais";

}

// Clique no botão
botaoAnimacoes.onclick = () => {

    document.body.classList.toggle("reduzir-animacoes");

    if(document.body.classList.contains("reduzir-animacoes")){

        botaoAnimacoes.innerHTML = "🎞 Animações normais";
        localStorage.setItem("animacoes","on");

    }else{

        botaoAnimacoes.innerHTML = "🎞 Reduzir animações";
        localStorage.setItem("animacoes","off");

    }

};

//////////////////
// Lupa de foco //
//////////////////

const lupa = document.getElementById("lupaFoco");
const botaoLupa = document.getElementById("lupa");

// Recupera a preferência
if(localStorage.getItem("lupa") === "on"){

    document.body.classList.add("lupa");
    botaoLupa.innerHTML = "🔍 Desativar lupa";

}

document.addEventListener("mousemove",(e)=>{

    lupa.style.left = e.clientX + "px";
    lupa.style.top = e.clientY + "px";

});

botaoLupa.onclick = ()=>{

    document.body.classList.toggle("lupa");

    if(document.body.classList.contains("lupa")){

        botaoLupa.innerHTML = "🔍 Desativar lupa";
        localStorage.setItem("lupa","on");

    }else{

        botaoLupa.innerHTML = "🔍 Ativar lupa";
        localStorage.setItem("lupa","off");

    }

};

document.getElementById("restaurarAcessibilidade").onclick = () => {

    // Fonte
    escala = 1;
    atualizarFonte();

    // Alto contraste
    document.body.classList.remove("alto-contraste");
    localStorage.setItem("contraste","off");
    document.getElementById("contraste").innerHTML = "🌙 Alto contraste";

    // Fonte para dislexia
    document.body.classList.remove("fonte-dislexia");
    localStorage.setItem("dislexia","off");
    document.getElementById("dislexia").innerHTML = "📖 Fonte para dislexia";

    // Espaçamento
    document.body.classList.remove("espacamento");
    localStorage.setItem("espacamento","off");
    document.getElementById("espacamento").innerHTML = "↔️ Aumentar espaçamento";

    // Cursor ampliado
    document.body.classList.remove("cursor-grande");
    localStorage.setItem("cursor","off");
    document.getElementById("cursor").innerHTML = "🖱 Cursor ampliado";

    // Redução de animações
    document.body.classList.remove("reduzir-animacoes");
    localStorage.setItem("animacoes","off");
    document.getElementById("animacoes").innerHTML = "✨ Reduzir animações";

    // Lupa (se existir)
    document.body.classList.remove("lupa");
    localStorage.setItem("lupa","off");

    const botaoLupa = document.getElementById("lupa");
    if(botaoLupa){
        botaoLupa.innerHTML = "🔍 Ativar lupa";
    }

    // Fecha o menu
    menu.classList.remove("ativo");

};