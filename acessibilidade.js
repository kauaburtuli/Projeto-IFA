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





// ======================================================
// LEITURA POR SELEÇÃO
// ======================================================

let elementosLeitura = [];
let indiceLeitura = -1;
let filaLeitura = [];
let lendoFila = false;


// ======================================================
// INICIAR LEITURA POR SELEÇÃO
// ======================================================

function iniciarLeituraSelecao() {

    modoLeitura = "selecao";

    document.body.classList.add(
        "modo-leitura-selecao"
    );

    if (indicadorSelecao) {
        indicadorSelecao.style.display = "block";
    }

    prepararElementos();

    falar(
        "Modo leitura por seleção ativado. " +
        "Use a tecla Tab para passar entre os elementos. " +
        "Pressione Enter para ativar links e botões. " +
        "Você também pode clicar sobre um elemento para ouvi-lo."
    );
}


// ======================================================
// OBTER TEXTO DO ELEMENTO
// ======================================================

function obterTextoLeitura(elemento) {

    if (!elemento) {
        return "";
    }

    let texto = "";

    // Prioridade para aria-label
    texto =
        elemento.getAttribute("aria-label") ||
        elemento.getAttribute("title") ||
        elemento.innerText ||
        elemento.value ||
        elemento.getAttribute("alt") ||
        "";

    texto = texto
        .replace(/\s+/g, " ")
        .trim();

    if (!texto) {
        texto = "Elemento sem texto";
    }


    // ==================================================
    // IDENTIFICA O TIPO DO ELEMENTO
    // ==================================================

    if (elemento.tagName === "BUTTON") {

        texto +=
            ". Botão. " +
            "Pressione Enter para ativar.";

    }

    else if (elemento.tagName === "A") {

        texto +=
            ". Link. " +
            "Pressione Enter para acessar.";

    }

    else if (
        elemento.tagName === "INPUT" ||
        elemento.tagName === "SELECT" ||
        elemento.tagName === "TEXTAREA"
    ) {

        texto +=
            ". Campo de formulário.";

    }

    else if (
        elemento.getAttribute("role") === "button"
    ) {

        texto +=
            ". Botão. " +
            "Pressione Enter para ativar.";

    }

    else if (
        elemento.getAttribute("role") === "link"
    ) {

        texto +=
            ". Link. " +
            "Pressione Enter para acessar.";

    }


    return texto;
}


// ======================================================
// ELEMENTOS QUE PODEM SER NAVEGADOS
// ======================================================

function obterElementosNavegaveis() {

    const seletores = [

        // CABEÇALHO
        "header",
        "header h1";
        "header a",
        "header button",
        "header input",
        "header select",
        "header textarea",

        // ELEMENTOS INTERATIVOS DA PÁGINA
        "a[href]",
        "button",
        "input",
        "select",
        "textarea",

        "[tabindex]:not([tabindex='-1'])",

        "[role='button']",
        "[role='link']",

        // CONTEÚDO
        "main h1",
        "main h2",
        "main h3",
        "main h4",
        "main h5",
        "main h6",

        "main p",
        "main li",

        "main .texto",
        "main .titulo",
        "main .card",
        "main .item",

        // RODAPÉ
        "footer",
        "footer a",
        "footer button",
        "footer p",
        "footer li"

    ];


    const encontrados = [];


    seletores.forEach(seletor => {

        document
            .querySelectorAll(seletor)
            .forEach(elemento => {

                if (!encontrados.includes(elemento)) {

                    encontrados.push(elemento);

                }

            });

    });


    // Remove elementos invisíveis

    return encontrados.filter(elemento => {

        const estilo =
            getComputedStyle(elemento);

        return (
            estilo.display !== "none" &&
            estilo.visibility !== "hidden" &&
            elemento.offsetParent !== null
        );

    });

}


// ======================================================
// PREPARAR ELEMENTOS
// ======================================================

function prepararElementos() {

    elementosLeitura =
        obterElementosNavegaveis();


    elementosLeitura.forEach(elemento => {

        if (
            elemento.dataset.leituraAtiva ===
            "true"
        ) {

            return;

        }


        elemento.dataset.leituraAtiva =
            "true";


        // Mouse
        elemento.addEventListener(
            "mouseenter",
            destacarElemento
        );


        elemento.addEventListener(
            "mouseleave",
            removerDestaque
        );


        // Clique
        elemento.addEventListener(
            "click",
            selecionarElemento
        );

    });

}


// ======================================================
// DESTACAR ELEMENTO
// ======================================================

function destacarElemento(e) {

    if (
        modoLeitura !== "selecao"
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
// DESTACAR PELO TAB
// ======================================================

function destacarPorTab(elemento) {

    elementosLeitura.forEach(el => {

        el.classList.remove(
            "leitura-hover"
        );

    });


    if (!elemento) {
        return;
    }


    elemento.classList.add(
        "leitura-hover"
    );


    elemento.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    const texto =
        obterTextoLeitura(elemento);


    if (texto) {

        adicionarFilaLeitura(texto);

    }

}


// ======================================================
// TECLA TAB
// ======================================================

document.addEventListener(
    "keydown",
    function(e) {

        if (
            modoLeitura !== "selecao"
        ) {

            return;

        }


        // Não interfere dentro do modal

        if (
            modalLeitura &&
            modalLeitura.classList.contains(
                "ativo"
            )
        ) {

            return;

        }


        // TAB
        if (e.key === "Tab") {

            e.preventDefault();


            if (elementosLeitura.length === 0) {

                prepararElementos();

            }


            if (e.shiftKey) {

                indiceLeitura--;

                if (
                    indiceLeitura < 0
                ) {

                    indiceLeitura =
                        elementosLeitura.length - 1;

                }

            }

            else {

                indiceLeitura++;

                if (
                    indiceLeitura >=
                    elementosLeitura.length
                ) {

                    indiceLeitura = 0;

                }

            }


            const elemento =
                elementosLeitura[
                    indiceLeitura
                ];


            destacarPorTab(
                elemento
            );

        }


        // ENTER
        if (e.key === "Enter") {

            const elemento =
                elementosLeitura[
                    indiceLeitura
                ];


            if (!elemento) {
                return;
            }


            // Remove destaque
            elemento.classList.remove(
                "leitura-hover"
            );


            // Ativa botão ou link

            if (
                elemento.tagName === "BUTTON" ||
                elemento.tagName === "A" ||
                elemento.getAttribute("role") === "button" ||
                elemento.getAttribute("role") === "link"
            ) {

                elemento.click();

            }

        }


        // ESC
        if (e.key === "Escape") {

            if (
                modoLeitura === "selecao"
            ) {

                if (botaoParar) {
                    botaoParar.click();
                }

            }

        }

    }
);


// ======================================================
// CLIQUE NO ELEMENTO
// ======================================================

function selecionarElemento(e) {

    if (
        modoLeitura !== "selecao"
    ) {

        return;

    }


    const elemento =
        e.currentTarget;


    // Impede que o próprio clique
    // seja executado duas vezes
    if (
        elemento.tagName === "BUTTON" ||
        elemento.tagName === "A"
    ) {

        e.preventDefault();

    }


    e.stopPropagation();


    const texto =
        obterTextoLeitura(elemento);


    if (!texto) {
        return;
    }


    adicionarFilaLeitura(
        texto
    );

}


// ======================================================
// FILA DE LEITURA
// ======================================================

function adicionarFilaLeitura(texto) {

    if (!texto) {
        return;
    }


    filaLeitura.push(texto);


    if (!lendoFila) {

        processarFilaLeitura();

    }

}


// ======================================================
// PROCESSAR FILA
// ======================================================

function processarFilaLeitura() {

    if (
        filaLeitura.length === 0
    ) {

        lendoFila = false;

        return;

    }


    lendoFila = true;


    const texto =
        filaLeitura.shift();


    falarTextoFila(
        texto
    );

}


// ======================================================
// FALAR ITEM DA FILA
// ======================================================

function falarTextoFila(texto) {

    if (!texto) {

        processarFilaLeitura();

        return;

    }


    const partes =
        texto
            .replace(/\s+/g, " ")
            .trim()
            .match(
                /.{1,180}(?:\s|$)/g
            );


    if (
        !partes ||
        partes.length === 0
    ) {

        processarFilaLeitura();

        return;

    }


    let indice = 0;


    function falarParte() {

        if (
            indice >= partes.length
        ) {

            processarFilaLeitura();

            return;

        }


        leitura =
            new SpeechSynthesisUtterance(
                partes[indice].trim()
            );


        leitura.lang = "pt-BR";

        leitura.rate = 1;

        leitura.pitch = 1;


        leitura.onend = () => {

            indice++;

            setTimeout(
                falarParte,
                80
            );

        };


        leitura.onerror = () => {

            indice++;

            setTimeout(
                falarParte,
                100
            );

        };


        speechSynthesis.speak(
            leitura
        );

    }


    falarParte();

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

// =====================================
// AJUSTE AUTOMÁTICO DO CABEÇALHO
// =====================================

function ajustarEspacoCabecalho(){

    const header = document.querySelector("header");

    if(!header){
        return;
    }

    const altura = header.offsetHeight;

    document.documentElement.style.setProperty(
        "--altura-cabecalho",
        altura + "px"
    );

}

window.addEventListener(
    "load",
    ajustarEspacoCabecalho
);

window.addEventListener(
    "resize",
    ajustarEspacoCabecalho
);


// Atualiza quando a página mudar
const observadorCabecalho =
new ResizeObserver(() => {

    ajustarEspacoCabecalho();

});

const header =
document.querySelector("header");

if(header){

    observadorCabecalho.observe(header);

}