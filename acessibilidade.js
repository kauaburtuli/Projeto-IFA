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

// ======================================================
// LEITOR DE PÁGINA
// ======================================================

let leitura = null;


// ======================================================
// ELEMENTOS
// ======================================================

const botao = document.querySelector(".btn-acessibilidade");
const menu = document.querySelector(".menu-acessibilidade");

const controle = document.getElementById("controleLeitura");
const status = document.getElementById("statusLeitura");

const modalLeitura = document.getElementById("modalLeitura");
const cancelarLeitura = document.getElementById("cancelarLeitura");

const indicadorSelecao =
    document.getElementById("indicadorSelecao");


// ======================================================
// OPÇÕES DO MODAL
// ======================================================

const opcoesLeitura =
    document.querySelectorAll(
        "#modalLeitura .opcao-leitura"
    );


// ======================================================
// VARIÁVEIS
// ======================================================

let opcaoAtual = 0;

let modoLeitura = null;

let lendoTexto = false;

let proximoTexto = null;

let filaLeitura = [];

let indiceFila = 0;


// ======================================================
// FUNÇÃO DE FALA
// ======================================================

function falar(texto) {

    if (!texto) {
        return;
    }

    speechSynthesis.cancel();

    const fala =
        new SpeechSynthesisUtterance(texto);

    fala.lang = "pt-BR";

    fala.rate = 1;

    fala.pitch = 1;

    speechSynthesis.speak(fala);

}


// ======================================================
// BOTÃO "LER PÁGINA"
// ======================================================

const botaoLerPagina =
    document.getElementById("lerPagina");


if (botaoLerPagina && modalLeitura) {
botaoLerPagina.onclick = () => {

    speechSynthesis.cancel();

    opcaoAtual = 0;

    modalLeitura.classList.add("ativo");

    modalLeitura.setAttribute(
        "aria-hidden",
        "false"
    );


    // Explica como utilizar o menu

    const instrucao =
        "Selecione o tipo de leitura. " +
        "Use a seta para baixo ou a seta para cima " +
        "para trocar de opção. " +
        "Pressione Enter para confirmar. " +
        "A leitura geral lê toda a página. " +
        "A leitura por seleção permite clicar no texto " +
        "que você deseja ouvir.";


    const fala =
        new SpeechSynthesisUtterance(
            instrucao
        );

    fala.lang = "pt-BR";

    fala.rate = 1;

    fala.pitch = 1;


    fala.onend = () => {

        atualizarOpcao();

    };


    speechSynthesis.speak(fala);

};

}


// ======================================================
// ATUALIZAR OPÇÃO
// ======================================================

function atualizarOpcao() {

    // Verifica se existem opções

    if (opcoesLeitura.length === 0) {

        console.error(
            "Nenhuma opção de leitura encontrada."
        );

        return;

    }


    // Mantém o índice válido

    if (opcaoAtual >= opcoesLeitura.length) {

        opcaoAtual = 0;

    }


    if (opcaoAtual < 0) {

        opcaoAtual =
            opcoesLeitura.length - 1;

    }


    // Remove seleção de todas

    opcoesLeitura.forEach(
        (opcao, index) => {

            opcao.classList.remove(
                "selecionada"
            );


            if (index === opcaoAtual) {

                opcao.classList.add(
                    "selecionada"
                );

            }

        }
    );


    // Opção atual

    const opcaoSelecionada =
        opcoesLeitura[opcaoAtual];


    if (!opcaoSelecionada) {

        return;

    }


    const texto =
        opcaoSelecionada.innerText.trim();


    if (texto) {

        falar(texto);

    }

}


// ======================================================
// TECLADO DO MODAL
// ======================================================

document.addEventListener(
    "keydown",
    (e) => {

        // Se não existe modal, ignora

        if (!modalLeitura) {
            return;
        }


        // Se modal não está aberto

        if (
            !modalLeitura.classList.contains(
                "ativo"
            )
        ) {

            return;

        }


        // ==========================
        // SETA PARA BAIXO
        // ==========================

        if (e.key === "ArrowDown") {

            e.preventDefault();

            opcaoAtual++;

            atualizarOpcao();

        }


        // ==========================
        // SETA PARA CIMA
        // ==========================

        if (e.key === "ArrowUp") {

            e.preventDefault();

            opcaoAtual--;

            atualizarOpcao();

        }


        // ==========================
        // ENTER
        // ==========================

        if (e.key === "Enter") {

            e.preventDefault();

            confirmarLeitura();

        }


        // ==========================
        // ESC
        // ==========================

        if (e.key === "Escape") {

            e.preventDefault();

            fecharModal();

        }

    }
);


// ======================================================
// CONFIRMAR LEITURA
// ======================================================

function confirmarLeitura() {

    if (opcoesLeitura.length === 0) {

        return;

    }


    const opcaoSelecionada =
        opcoesLeitura[opcaoAtual];


    if (!opcaoSelecionada) {

        return;

    }


    const tipo =
        opcaoSelecionada.dataset.tipo;


    fecharModal();


    // ==========================
    // LEITURA GERAL
    // ==========================

    if (tipo === "geral") {

        iniciarLeituraGeral();

    }


    // ==========================
    // LEITURA POR SELEÇÃO
    // ==========================

    if (tipo === "selecao") {

        iniciarLeituraSelecao();

    }

}


// ======================================================
// FECHAR MODAL
// ======================================================

function fecharModal() {

    if (!modalLeitura) {
        return;
    }


    modalLeitura.classList.remove(
        "ativo"
    );


    modalLeitura.setAttribute(
        "aria-hidden",
        "true"
    );


    speechSynthesis.cancel();

}


// ======================================================
// LEITURA GERAL
// ======================================================

function iniciarLeituraGeral() {

    modoLeitura = "geral";


    // Pega TODA a página

    const texto =
        document.body.innerText.trim();


    if (!texto) {

        falar(
            "Não há texto para leitura."
        );

        return;

    }


    iniciarLeituraTexto(texto);

}


// ======================================================
// INICIAR LEITURA DE UM TEXTO
// ======================================================

// 



// ======================================================
// LEITURA POR SELEÇÃO
// ======================================================

function iniciarLeituraSelecao() {

    modoLeitura = "selecao";


    document.body.classList.add(
        "modo-leitura-selecao"
    );


    if (indicadorSelecao) {

        indicadorSelecao.style.display =
            "block";

    }


    falar(
        "Modo leitura por seleção ativado. " +
        "Clique no texto que deseja ouvir."
    );


    prepararElementos();

}


// ======================================================
// PREPARAR ELEMENTOS PARA SELEÇÃO
// ======================================================

function prepararElementos() {

    const elementos =
        document.querySelectorAll(

            "a" +
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


    elementos.forEach(
        (el) => {

            // Evita adicionar duas vezes

            if (
                el.dataset.leituraAtiva ===
                "true"
            ) {

                return;

            }


            el.dataset.leituraAtiva =
                "true";


            // Mouse entrando

            el.addEventListener(
                "mouseenter",
                destacarElemento
            );


            // Mouse saindo

            el.addEventListener(
                "mouseleave",
                removerDestaque
            );


            // Clique

            el.addEventListener(
                "click",
                selecionarElemento
            );

        }
    );

}

function iniciarLeituraTexto(texto) {

    if (!texto || !texto.trim()) {
        return;
    }

    // Para qualquer leitura anterior
    speechSynthesis.cancel();

    // Divide o texto em frases/partes menores
    const partes = texto
        .replace(/\s+/g, " ")
        .trim()
        .match(/.{1,180}(?:\s|$)/g);

    if (!partes || partes.length === 0) {
        return;
    }

    let indice = 0;

    lendoTexto = true;


    // ==========================
    // Mostra controles
    // ==========================

    if (menu) {

        menu.classList.remove("ativo");

    }

    if (controle) {

        controle.style.display = "flex";

    }

    if (status) {

        status.innerHTML = "🔊 Lendo...";

    }


    // ==========================
    // Função para falar próxima parte
    // ==========================

    function falarParte() {

        // Se o usuário apertou PARAR
        if (!lendoTexto) {
            return;
        }


        // Terminou todas as partes
        if (indice >= partes.length) {

            lendoTexto = false;

            if (status) {

                status.innerHTML =
                    "✅ Leitura concluída";

            }

            return;
        }


        const textoParte =
            partes[indice].trim();


        if (!textoParte) {

            indice++;

            falarParte();

            return;

        }


        leitura =
            new SpeechSynthesisUtterance(
                textoParte
            );


        leitura.lang = "pt-BR";

        leitura.rate = 1;

        leitura.pitch = 1;


        // ==========================
        // Terminou essa parte
        // ==========================

        leitura.onend = () => {

            if (!lendoTexto) {
                return;
            }


            indice++;


            // Se existe outro texto
            // selecionado pelo usuário
            if (proximoTexto) {

                const novoTexto =
                    proximoTexto;

                proximoTexto = null;

                iniciarLeituraTexto(
                    novoTexto
                );

                return;
            }


            // Pequeno intervalo
            // antes da próxima parte

            setTimeout(() => {

                falarParte();

            }, 80);

        };


        // ==========================
        // Se ocorrer erro
        // ==========================

        leitura.onerror = (erro) => {

            console.warn(
                "Erro na leitura:",
                erro
            );


            if (!lendoTexto) {
                return;
            }


            indice++;


            setTimeout(() => {

                falarParte();

            }, 100);

        };


        // ==========================
        // Fala
        // ==========================

        speechSynthesis.speak(
            leitura
        );

    }


    // ==========================
    // Começa
    // ==========================

    falarParte();

}


// ======================================================
// DESTACAR ELEMENTO
// ======================================================

function destacarElemento(e) {

    if (
        modoLeitura !==
        "selecao"
    ) {

        return;

    }


    e.currentTarget.classList.add(
        "leitura-hover"
    );

}


// ======================================================
// REMOVER DESTAQUE
// ======================================================

function removerDestaque(e) {

    e.currentTarget.classList.remove(
        "leitura-hover"
    );

}


// ======================================================
// SELECIONAR ELEMENTO
// ======================================================

function selecionarElemento(e) {

    if (
        modoLeitura !==
        "selecao"
    ) {

        return;

    }


    e.preventDefault();

    e.stopPropagation();


    const elemento =
        e.currentTarget;


    const texto =
        elemento.innerText.trim();


    if (!texto) {

        return;

    }


    // Se já está lendo,
    // coloca na fila

    if (lendoTexto) {

        proximoTexto =
            texto;

        return;

    }


    iniciarLeituraTexto(
        texto
    );

}


// ======================================================
// PAUSAR
// ======================================================

const botaoPausar =
    document.getElementById(
        "pausarBtn"
    );


if (botaoPausar) {

    botaoPausar.onclick = () => {

        speechSynthesis.pause();

        if (status) {

            status.innerHTML =
                "⏸ Pausado";

        }

    };

}



// ======================================================
// CONTINUAR
// ======================================================

const botaoContinuar =
    document.getElementById(
        "continuarBtn"
    );


if (botaoContinuar) {

    botaoContinuar.onclick = () => {

        speechSynthesis.resume();

        if (status) {

            status.innerHTML =
                "🔊 Lendo...";

        }

    };

}


// ======================================================
// PARAR
// ======================================================

const botaoParar =
    document.getElementById(
        "pararBtn"
    );


// if (botaoParar) {

//     botaoParar.onclick = () => {

//         speechSynthesis.cancel();


//         leitura = null;


//         lendoTexto = false;


//         proximoTexto = null;


//         modoLeitura = null;


//         document.body.classList.remove(
//             "modo-leitura-selecao"
//         );


//         if (indicadorSelecao) {

//             indicadorSelecao.style.display =
//                 "none";

//         }


//         if (controle) {

//             controle.style.display =
//                 "none";

//         }


//         if (status) {

//             status.innerHTML =
//                 "⏹ Parado";

//         }

//     };

//}

if (botaoParar) {

    botaoParar.onclick = () => {

        lendoTexto = false;

        proximoTexto = null;

        filaLeitura = [];

        indiceFila = 0;

        speechSynthesis.cancel();

        leitura = null;

        modoLeitura = null;


        document.body.classList.remove(
            "modo-leitura-selecao"
        );


        if (indicadorSelecao) {

            indicadorSelecao.style.display =
                "none";

        }


        if (controle) {

            controle.style.display =
                "none";

        }


        if (status) {

            status.innerHTML =
                "⏹ Parado";

        }

    };

}


// ======================================================
// CANCELAR LEITURA NO MODAL
// ======================================================

if (cancelarLeitura) {

    cancelarLeitura.onclick = () => {

        fecharModal();

    };

}


// ======================================================
// MENU DE ACESSIBILIDADE
// ======================================================

if (botao && menu) {

    botao.addEventListener(
        "click",
        function(e) {

            e.stopPropagation();

            menu.classList.toggle(
                "ativo"
            );

        }
    );


    document.addEventListener(
        "click",
        function() {

            menu.classList.remove(
                "ativo"
            );

        }
    );


    menu.addEventListener(
        "click",
        function(e) {

            e.stopPropagation();

        }
    );

}

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

/////////////////////////
// Cursor Ampliado
/////////////////////////

const botaoCursor =
document.getElementById("cursor");

// Recupera preferência

if(localStorage.getItem("cursor") === "on"){

    document.body.classList.add("cursor-grande");

    botaoCursor.innerHTML =
    "🖱 Cursor normal";

}

// Clique

botaoCursor.onclick = () => {

    document.body.classList.toggle(
        "cursor-grande"
    );

    if(document.body.classList.contains(
        "cursor-grande"
    )){

        localStorage.setItem(
            "cursorGrande",
            "on"
        );

        botaoCursor.innerHTML =
        "🖱 Cursor normal";

    }else{

        localStorage.setItem(
            "cursorGrande",
            "off"
        );

        botaoCursor.innerHTML =
        "🖱 Cursor ampliado";

    }

};

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

        botaoAnimacoes.innerHTML = "✨ Reduzir animações";
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