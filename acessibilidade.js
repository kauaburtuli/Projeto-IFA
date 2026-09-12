/* =========================================================
   ACESSIBILIDADE - ROBÓTICA EDUCACIONAL
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const botaoAcessibilidade = document.querySelector(".btn-acessibilidade");
const menuAcessibilidade = document.querySelector(".menu-acessibilidade");

const botaoLer = document.getElementById("lerPagina");

const controleLeitura = document.getElementById("controleLeitura");
const statusLeitura = document.getElementById("statusLeitura");

const botaoPausar = document.getElementById("pausarBtn");
const botaoContinuar = document.getElementById("continuarBtn");
const botaoParar = document.getElementById("pararBtn");

const botaoContraste = document.getElementById("contraste");
const botaoDislexia = document.getElementById("dislexia");
const botaoEspacamento = document.getElementById("espacamento");
const botaoCursor = document.getElementById("cursor");
const botaoAnimacoes = document.getElementById("animacoes");
const botaoLupa = document.getElementById("lupa");
const botaoRestaurar = document.getElementById("restaurarAcessibilidade");

const botaoFonteMais = document.getElementById("fonteMais");
const botaoFontePadrao = document.getElementById("fontePadrao");
const botaoFonteMenos = document.getElementById("fonteMenos");

const modalLeitura = document.getElementById("modalLeitura");
const cancelarLeitura = document.getElementById("cancelarLeitura");

const indicadorSelecao = document.getElementById("indicadorSelecao");


/* =========================================================
   VARIÁVEIS DA LEITURA
========================================================= */

let leitura = null;

let modoLeitura = null;
let lendoTexto = false;

let filaLeitura = [];
let indiceFila = 0;
let lendoFila = false;

let elementosLeitura = [];
let indiceLeitura = -1;

let opcaoAtual = 0;


/* =========================================================
   MENU DE ACESSIBILIDADE
========================================================= */

if (botaoAcessibilidade && menuAcessibilidade) {

    botaoAcessibilidade.addEventListener("click", function (evento) {

        evento.stopPropagation();

        menuAcessibilidade.classList.toggle("ativo");

    });

}


/* Fecha o menu quando clicar fora */

document.addEventListener("click", function (evento) {

    if (
        menuAcessibilidade &&
        botaoAcessibilidade &&
        !menuAcessibilidade.contains(evento.target) &&
        !botaoAcessibilidade.contains(evento.target)
    ) {

        menuAcessibilidade.classList.remove("ativo");

    }

});


/* =========================================================
   FUNÇÃO AUXILIAR - TEXTO
========================================================= */

function limparTexto(texto) {

    if (!texto) return "";

    return texto
        .replace(/\s+/g, " ")
        .replace(/\n+/g, " ")
        .trim();

}


/* =========================================================
   FALAR TEXTO SIMPLES
========================================================= */

function falar(texto) {

    if (!texto || !("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    leitura = new SpeechSynthesisUtterance(limparTexto(texto));

    leitura.lang = "pt-BR";
    leitura.rate = 1;
    leitura.pitch = 1;
    leitura.volume = 1;

    speechSynthesis.speak(leitura);

}


/* =========================================================
   TEXTO DA PÁGINA
========================================================= */

function obterTextoPagina() {

    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");

    let partes = [];

    if (header) {
        partes.push(header.innerText);
    }

    if (main) {
        partes.push(main.innerText);
    }

    if (footer) {
        partes.push(footer.innerText);
    }

    if (partes.length === 0) {
        partes.push(document.body.innerText);
    }

    return limparTexto(partes.join(" "));

}


/* =========================================================
   LEITURA GERAL
========================================================= */

function iniciarLeituraGeral() {

    const texto = obterTextoPagina();

    if (!texto) return;

    modoLeitura = "geral";

    if (menuAcessibilidade) {
        menuAcessibilidade.classList.remove("ativo");
    }

    if (controleLeitura) {
        controleLeitura.style.display = "flex";
    }

    if (statusLeitura) {
        statusLeitura.innerHTML = "🔊 Lendo...";
    }

    iniciarLeituraTexto(texto);

}


/* =========================================================
   LEITURA GERAL EM PARTES
========================================================= */

function iniciarLeituraTexto(texto) {

    if (!texto) return;

    speechSynthesis.cancel();

    const partes = texto
        .replace(/\s+/g, " ")
        .trim()
        .match(/.{1,180}(?:\s|$)/g);

    if (!partes || partes.length === 0) return;

    let indice = 0;

    lendoTexto = true;

    function falarParte() {

        if (!lendoTexto) return;

        if (indice >= partes.length) {

            lendoTexto = false;

            if (statusLeitura) {
                statusLeitura.innerHTML = "🔊 Leitura concluída";
            }

            return;
        }

        leitura = new SpeechSynthesisUtterance(
            partes[indice].trim()
        );

        leitura.lang = "pt-BR";
        leitura.rate = 1;
        leitura.pitch = 1;
        leitura.volume = 1;

        leitura.onend = function () {

            indice++;

            setTimeout(falarParte, 80);

        };

        leitura.onerror = function () {

            indice++;

            setTimeout(falarParte, 100);

        };

        speechSynthesis.speak(leitura);

    }

    falarParte();

}


/* =========================================================
   MODAL DE ESCOLHA DO TIPO DE LEITURA
========================================================= */

if (botaoLer) {

    botaoLer.addEventListener("click", function () {

        abrirModalLeitura();

    });

}


function abrirModalLeitura() {

    if (!modalLeitura) {

        iniciarLeituraGeral();

        return;

    }

    modalLeitura.style.display = "flex";

    opcaoAtual = 0;

    atualizarOpcaoModal();

}


/* =========================================================
   OPÇÕES DO MODAL
========================================================= */

const opcoesLeitura = document.querySelectorAll(
    "#modalLeitura .opcao-leitura"
);


function atualizarOpcaoModal() {

    if (!opcoesLeitura.length) return;

    opcoesLeitura.forEach(function (opcao, indice) {

        opcao.classList.toggle(
            "selecionada",
            indice === opcaoAtual
        );

        opcao.setAttribute(
            "aria-selected",
            indice === opcaoAtual ? "true" : "false"
        );

    });

    const opcao = opcoesLeitura[opcaoAtual];

    if (opcao) {

        let texto = opcao.innerText;

        falar(texto);

    }

}


/* =========================================================
   TECLADO DO MODAL
========================================================= */

document.addEventListener("keydown", function (evento) {

    if (
        !modalLeitura ||
        modalLeitura.style.display !== "flex"
    ) {
        return;
    }

    if (evento.key === "ArrowDown") {

        evento.preventDefault();

        opcaoAtual++;

        if (opcaoAtual >= opcoesLeitura.length) {
            opcaoAtual = 0;
        }

        atualizarOpcaoModal();

    }


    if (evento.key === "ArrowUp") {

        evento.preventDefault();

        opcaoAtual--;

        if (opcaoAtual < 0) {
            opcaoAtual = opcoesLeitura.length - 1;
        }

        atualizarOpcaoModal();

    }


    if (evento.key === "Enter") {

        evento.preventDefault();

        confirmarLeitura();

    }


    if (evento.key === "Escape") {

        evento.preventDefault();

        fecharModal();

    }

});


/* =========================================================
   CONFIRMAR LEITURA
========================================================= */

function confirmarLeitura() {

    const opcao = opcoesLeitura[opcaoAtual];

    if (!opcao) return;

    const tipo = opcao.dataset.tipo;

    fecharModal();

    if (tipo === "selecao") {

        iniciarLeituraSelecao();

    } else {

        iniciarLeituraGeral();

    }

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal() {

    if (modalLeitura) {
        modalLeitura.style.display = "none";
    }

    speechSynthesis.cancel();

}


/* =========================================================
   BOTÃO CANCELAR
========================================================= */

if (cancelarLeitura) {

    cancelarLeitura.addEventListener("click", function () {

        fecharModal();

    });

}


/* =========================================================
   TEXTO DE ELEMENTOS INTERATIVOS
========================================================= */

function obterTextoLeitura(elemento) {

    if (!elemento) return "";

    let texto = "";

    const aria = elemento.getAttribute("aria-label");
    const title = elemento.getAttribute("title");
    const alt = elemento.getAttribute("alt");

    if (aria) {

        texto = aria;

    } else if (alt) {

        texto = alt;

    } else if (title) {

        texto = title;

    } else if (
        elemento.tagName === "INPUT" &&
        elemento.value
    ) {

        texto = elemento.value;

    } else {

        texto = elemento.innerText || elemento.textContent || "";

    }

    texto = limparTexto(texto);

    if (!texto) return "";

    const tag = elemento.tagName.toLowerCase();

    if (tag === "button") {

        texto += ". Botão. Pressione Enter para ativar.";

    }

    if (tag === "a") {

        texto += ". Link. Pressione Enter para acessar.";

    }

    if (tag === "input") {

        const tipo = elemento.type || "campo";

        texto += ". Campo de entrada " + tipo + ".";

    }

    if (tag === "select") {

        texto += ". Caixa de seleção.";

    }

    return texto;

}


/* =========================================================
   ELEMENTOS NAVEGÁVEIS
========================================================= */

function obterElementosNavegaveis() {

    const seletores = [

        /* CABEÇALHO */

        "header h1",
        "header a",
        "header button",
        "header input",
        "header select",
        "header textarea",

        /* ELEMENTOS INTERATIVOS */

        "a[href]",
        "button",
        "input",
        "select",
        "textarea",

        "[role='button']",
        "[role='link']",

        "[tabindex]:not([tabindex='-1'])",

        /* CONTEÚDO */

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

        /* RODAPÉ */

        "footer",
        "footer a",
        "footer button",
        "footer p",
        "footer li"

    ];

    const encontrados = [];

    seletores.forEach(function (seletor) {

        document.querySelectorAll(seletor).forEach(function (elemento) {

            if (!encontrados.includes(elemento)) {

                encontrados.push(elemento);

            }

        });

    });


    return encontrados.filter(function (elemento) {

        const estilo = getComputedStyle(elemento);
        const rect = elemento.getBoundingClientRect();

        return (
            estilo.display !== "none" &&
            estilo.visibility !== "hidden" &&
            rect.width > 0 &&
            rect.height > 0
        );

    });

}


/* =========================================================
   PREPARAR ELEMENTOS
========================================================= */

function prepararElementos() {

    elementosLeitura = obterElementosNavegaveis();

    elementosLeitura.forEach(function (elemento) {

        if (elemento.dataset.leituraPreparada === "true") {
            return;
        }

        elemento.dataset.leituraPreparada = "true";


        /* Mouse */

        elemento.addEventListener("mouseenter", function () {

            if (
                modoLeitura === "selecao" &&
                !eLeituraInterativa()
            ) {

                destacarElemento(elemento);

            }

        });


        elemento.addEventListener("mouseleave", function () {

            if (
                modoLeitura === "selecao" &&
                !eLeituraInterativa()
            ) {

                removerDestaque(elemento);

            }

        });


        /* Clique */

        elemento.addEventListener("click", function () {

            if (modoLeitura !== "selecao") return;

            if (
                elemento.id === "cursor" ||
                elemento.id === "contraste" ||
                elemento.id === "dislexia" ||
                elemento.id === "espacamento" ||
                elemento.id === "animacoes" ||
                elemento.id === "lupa"
            ) {

                return;

            }

            const texto = obterTextoLeitura(elemento);

            if (texto) {

                adicionarNaFila(texto);

            }

        });

    });

}


/* =========================================================
   VERIFICAR SE HÁ LEITURA INTERATIVA
========================================================= */

function eLeituraInterativa() {

    return lendoFila || speechSynthesis.speaking;

}


/* =========================================================
   DESTACAR ELEMENTO
========================================================= */

function destacarElemento(elemento) {

    if (!elemento) return;

    elemento.classList.add("elemento-leitura");

}


function removerDestaque(elemento) {

    if (!elemento) return;

    elemento.classList.remove("elemento-leitura");

}


/* =========================================================
   LEITURA POR SELEÇÃO
========================================================= */

function iniciarLeituraSelecao() {

    modoLeitura = "selecao";

    prepararElementos();

    indiceLeitura = -1;

    if (menuAcessibilidade) {
        menuAcessibilidade.classList.remove("ativo");
    }

    if (indicadorSelecao) {

        indicadorSelecao.style.display = "block";

        indicadorSelecao.innerHTML =
            "👆 Modo de seleção ativo — clique ou use Tab para escolher o texto.";

    }

    if (controleLeitura) {

        controleLeitura.style.display = "flex";

    }

    if (statusLeitura) {

        statusLeitura.innerHTML =
            "👆 Selecione um texto";

    }

    falar(
        "Modo de leitura por seleção ativado. " +
        "Clique em um texto para ouvi-lo. " +
        "Você também pode usar a tecla Tab para navegar pelos elementos."
    );

}


/* =========================================================
   ADICIONAR TEXTO À FILA
========================================================= */

function adicionarNaFila(texto) {

    if (!texto) return;

    filaLeitura.push(texto);

    processarFila();

}


/* =========================================================
   PROCESSAR FILA
========================================================= */

function processarFila() {

    if (lendoFila) return;

    if (filaLeitura.length === 0) {

        if (modoLeitura === "selecao") {

            if (statusLeitura) {
                statusLeitura.innerHTML =
                    "👆 Selecione um texto";
            }

        }

        return;

    }

    lendoFila = true;

    const texto = filaLeitura.shift();

    if (statusLeitura) {

        statusLeitura.innerHTML = "🔊 Lendo...";

    }

    falarTextoFila(texto);

}


/* =========================================================
   FALAR TEXTO DA FILA
========================================================= */

function falarTextoFila(texto) {

    if (!texto) {

        lendoFila = false;
        processarFila();

        return;

    }

    const partes = limparTexto(texto)
        .match(/.{1,180}(?:\s|$)/g);

    if (!partes || partes.length === 0) {

        lendoFila = false;
        processarFila();

        return;

    }

    let indice = 0;


    function falarParteFila() {

        if (indice >= partes.length) {

            lendoFila = false;

            processarFila();

            return;

        }

        leitura = new SpeechSynthesisUtterance(
            partes[indice].trim()
        );

        leitura.lang = "pt-BR";
        leitura.rate = 1;
        leitura.pitch = 1;
        leitura.volume = 1;


        leitura.onend = function () {

            indice++;

            setTimeout(
                falarParteFila,
                80
            );

        };


        leitura.onerror = function () {

            indice++;

            setTimeout(
                falarParteFila,
                100
            );

        };


        speechSynthesis.speak(leitura);

    }


    falarParteFila();

}


/* =========================================================
   NAVEGAÇÃO COM TAB
========================================================= */

document.addEventListener("keydown", function (evento) {

    if (modoLeitura !== "selecao") return;

    if (evento.key !== "Tab") return;

    prepararElementos();

    if (elementosLeitura.length === 0) return;

    evento.preventDefault();


    if (evento.shiftKey) {

        indiceLeitura--;

        if (indiceLeitura < 0) {

            indiceLeitura =
                elementosLeitura.length - 1;

        }

    } else {

        indiceLeitura++;

        if (
            indiceLeitura >=
            elementosLeitura.length
        ) {

            indiceLeitura = 0;

        }

    }


    const elemento =
        elementosLeitura[indiceLeitura];

    if (!elemento) return;

    destacarPorTab(elemento);

});


/* =========================================================
   DESTACAR PELO TAB
========================================================= */

function destacarPorTab(elemento) {

    elementosLeitura.forEach(function (item) {

        removerDestaque(item);

    });

    destacarElemento(elemento);

    try {

        elemento.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    } catch (erro) {}

    const texto = obterTextoLeitura(elemento);

    if (texto) {

        adicionarNaFila(texto);

    }

}


/* =========================================================
   ENTER NO ELEMENTO SELECIONADO
========================================================= */

document.addEventListener("keydown", function (evento) {

    if (modoLeitura !== "selecao") return;

    if (evento.key !== "Enter") return;

    const elemento =
        elementosLeitura[indiceLeitura];

    if (!elemento) return;

    const tag =
        elemento.tagName.toLowerCase();


    if (
        tag === "button" ||
        tag === "a"
    ) {

        evento.preventDefault();

        elemento.click();

    }

});


/* =========================================================
   ESC - SAIR DO MODO DE LEITURA
========================================================= */

document.addEventListener("keydown", function (evento) {

    if (evento.key !== "Escape") return;

    if (modoLeitura === "selecao") {

        pararLeitura();

    }

});


/* =========================================================
   PAUSAR
========================================================= */

if (botaoPausar) {

    botaoPausar.addEventListener("click", function () {

        if (
            "speechSynthesis" in window &&
            speechSynthesis.speaking
        ) {

            speechSynthesis.pause();

            if (statusLeitura) {

                statusLeitura.innerHTML =
                    "⏸ Pausado";

            }

        }

    });

}


/* =========================================================
   CONTINUAR
========================================================= */

if (botaoContinuar) {

    botaoContinuar.addEventListener("click", function () {

        if (
            "speechSynthesis" in window &&
            speechSynthesis.paused
        ) {

            speechSynthesis.resume();

            if (statusLeitura) {

                statusLeitura.innerHTML =
                    "🔊 Lendo...";

            }

        }

    });

}


/* =========================================================
   PARAR LEITURA
========================================================= */

if (botaoParar) {

    botaoParar.addEventListener("click", function () {

        pararLeitura();

    });

}


function pararLeitura() {

    if ("speechSynthesis" in window) {

        speechSynthesis.cancel();

    }

    leitura = null;

    lendoTexto = false;
    lendoFila = false;

    filaLeitura = [];

    indiceFila = 0;

    modoLeitura = null;

    indiceLeitura = -1;


    elementosLeitura.forEach(function (elemento) {

        removerDestaque(elemento);

    });


    document.body.classList.remove(
        "modo-leitura-selecao"
    );


    if (indicadorSelecao) {

        indicadorSelecao.style.display = "none";

    }


    if (controleLeitura) {

        controleLeitura.style.display = "none";

    }


    if (statusLeitura) {

        statusLeitura.innerHTML = "";

    }

}


/* =========================================================
   TAMANHO DA FONTE
========================================================= */

const TAMANHO_PADRAO = 100;
const TAMANHO_MINIMO = 80;
const TAMANHO_MAXIMO = 150;
const PASSO_FONTE = 10;


function aplicarTamanhoFonte(tamanho) {

    tamanho = Number(tamanho);

    if (isNaN(tamanho)) {

        tamanho = TAMANHO_PADRAO;

    }

    tamanho = Math.max(
        TAMANHO_MINIMO,
        Math.min(
            TAMANHO_MAXIMO,
            tamanho
        )
    );


    document.documentElement.style.setProperty(
        "--escala-fonte",
        tamanho + "%"
    );


    document.body.style.setProperty(
        "--escala-fonte",
        tamanho + "%"
    );


    document.documentElement.setAttribute(
        "data-tamanho-fonte",
        tamanho
    );


    localStorage.setItem(
        "tamanhoFonte",
        tamanho
    );

}


const tamanhoSalvo =
    localStorage.getItem("tamanhoFonte");

aplicarTamanhoFonte(
    tamanhoSalvo || TAMANHO_PADRAO
);


/* A+ */

if (botaoFonteMais) {

    botaoFonteMais.addEventListener(
        "click",
        function () {

            const atual = Number(
                localStorage.getItem("tamanhoFonte") ||
                TAMANHO_PADRAO
            );

            aplicarTamanhoFonte(
                atual + PASSO_FONTE
            );

        }
    );

}


/* Fonte padrão */

if (botaoFontePadrao) {

    botaoFontePadrao.addEventListener(
        "click",
        function () {

            aplicarTamanhoFonte(
                TAMANHO_PADRAO
            );

        }
    );

}


/* A− */

if (botaoFonteMenos) {

    botaoFonteMenos.addEventListener(
        "click",
        function () {

            const atual = Number(
                localStorage.getItem("tamanhoFonte") ||
                TAMANHO_PADRAO
            );

            aplicarTamanhoFonte(
                atual - PASSO_FONTE
            );

        }
    );

}


/* =========================================================
   ALTO CONTRASTE
========================================================= */

function atualizarBotaoContraste() {

    if (!botaoContraste) return;

    if (
        document.body.classList.contains(
            "alto-contraste"
        )
    ) {

        botaoContraste.innerHTML =
            "☀️ Contraste normal";

    } else {

        botaoContraste.innerHTML =
            "🌙 Alto contraste";

    }

}


if (localStorage.getItem("altoContraste") === "on") {

    document.body.classList.add(
        "alto-contraste"
    );

}


if (botaoContraste) {

    botaoContraste.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "alto-contraste"
            );

            const ativo =
                document.body.classList.contains(
                    "alto-contraste"
                );

            localStorage.setItem(
                "altoContraste",
                ativo ? "on" : "off"
            );

            atualizarBotaoContraste();

        }
    );

}


atualizarBotaoContraste();


/* =========================================================
   FONTE PARA DISLEXIA
========================================================= */

function atualizarBotaoDislexia() {

    if (!botaoDislexia) return;

    if (
        document.body.classList.contains(
            "fonte-dislexia"
        )
    ) {

        botaoDislexia.innerHTML =
            "📖 Fonte normal";

    } else {

        botaoDislexia.innerHTML =
            "📖 Fonte para dislexia";

    }

}


if (
    localStorage.getItem("fonteDislexia") === "on"
) {

    document.body.classList.add(
        "fonte-dislexia"
    );

}


if (botaoDislexia) {

    botaoDislexia.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "fonte-dislexia"
            );

            const ativo =
                document.body.classList.contains(
                    "fonte-dislexia"
                );

            localStorage.setItem(
                "fonteDislexia",
                ativo ? "on" : "off"
            );

            atualizarBotaoDislexia();

        }
    );

}


atualizarBotaoDislexia();


/* =========================================================
   ESPAÇAMENTO
========================================================= */

function atualizarBotaoEspacamento() {

    if (!botaoEspacamento) return;

    if (
        document.body.classList.contains(
            "espacamento-aumentado"
        )
    ) {

        botaoEspacamento.innerHTML =
            "↔️ Espaçamento normal";

    } else {

        botaoEspacamento.innerHTML =
            "↔️ Aumentar espaçamento";

    }

}


if (
    localStorage.getItem("espacamento") === "on"
) {

    document.body.classList.add(
        "espacamento-aumentado"
    );

}


if (botaoEspacamento) {

    botaoEspacamento.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "espacamento-aumentado"
            );

            const ativo =
                document.body.classList.contains(
                    "espacamento-aumentado"
                );

            localStorage.setItem(
                "espacamento",
                ativo ? "on" : "off"
            );

            atualizarBotaoEspacamento();

        }
    );

}


atualizarBotaoEspacamento();


/* =========================================================
   CURSOR AMPLIADO
========================================================= */

function atualizarBotaoCursor() {

    if (!botaoCursor) return;

    if (
        document.body.classList.contains(
            "cursor-grande"
        )
    ) {

        botaoCursor.innerHTML =
            "🖱 Cursor normal";

    } else {

        botaoCursor.innerHTML =
            "🖱 Cursor ampliado";

    }

}


if (
    localStorage.getItem("cursorGrande") === "on"
) {

    document.body.classList.add(
        "cursor-grande"
    );

}


if (botaoCursor) {

    botaoCursor.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "cursor-grande"
            );

            const ativo =
                document.body.classList.contains(
                    "cursor-grande"
                );

            localStorage.setItem(
                "cursorGrande",
                ativo ? "on" : "off"
            );

            atualizarBotaoCursor();

        }
    );

}


atualizarBotaoCursor();


/* =========================================================
   REDUZIR ANIMAÇÕES
========================================================= */

function atualizarBotaoAnimacoes() {

    if (!botaoAnimacoes) return;

    if (
        document.body.classList.contains(
            "sem-animacoes"
        )
    ) {

        botaoAnimacoes.innerHTML =
            "✨ Ativar animações";

    } else {

        botaoAnimacoes.innerHTML =
            "✨ Reduzir animações";

    }

}


if (
    localStorage.getItem("animacoes") === "on"
) {

    document.body.classList.add(
        "sem-animacoes"
    );

}


if (botaoAnimacoes) {

    botaoAnimacoes.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "sem-animacoes"
            );

            const ativo =
                document.body.classList.contains(
                    "sem-animacoes"
                );

            localStorage.setItem(
                "animacoes",
                ativo ? "on" : "off"
            );

            atualizarBotaoAnimacoes();

        }
    );

}


atualizarBotaoAnimacoes();


/* =========================================================
   LUPA
========================================================= */

function atualizarBotaoLupa() {

    if (!botaoLupa) return;

    if (
        document.body.classList.contains(
            "lupa-ativa"
        )
    ) {

        botaoLupa.innerHTML =
            "🔍 Desativar lupa";

    } else {

        botaoLupa.innerHTML =
            "🔍 Ativar lupa";

    }

}


if (
    localStorage.getItem("lupa") === "on"
) {

    document.body.classList.add(
        "lupa-ativa"
    );

}


if (botaoLupa) {

    botaoLupa.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "lupa-ativa"
            );

            const ativo =
                document.body.classList.contains(
                    "lupa-ativa"
                );

            localStorage.setItem(
                "lupa",
                ativo ? "on" : "off"
            );

            atualizarBotaoLupa();

        }
    );

}


atualizarBotaoLupa();


/* =========================================================
   RESTAURAR ACESSIBILIDADE
========================================================= */

if (botaoRestaurar) {

    botaoRestaurar.addEventListener(
        "click",
        function () {

            /* Leitura */

            pararLeitura();


            /* Classes */

            document.body.classList.remove(
                "alto-contraste",
                "fonte-dislexia",
                "espacamento-aumentado",
                "cursor-grande",
                "sem-animacoes",
                "lupa-ativa",
                "modo-leitura-selecao"
            );


            /* Fonte */

            aplicarTamanhoFonte(
                TAMANHO_PADRAO
            );


            /* LocalStorage */

            localStorage.setItem(
                "altoContraste",
                "off"
            );

            localStorage.setItem(
                "fonteDislexia",
                "off"
            );

            localStorage.setItem(
                "espacamento",
                "off"
            );

            localStorage.setItem(
                "cursorGrande",
                "off"
            );

            localStorage.setItem(
                "animacoes",
                "off"
            );

            localStorage.setItem(
                "lupa",
                "off"
            );

            localStorage.setItem(
                "tamanhoFonte",
                TAMANHO_PADRAO
            );


            /* Atualizar botões */

            atualizarBotaoContraste();
            atualizarBotaoDislexia();
            atualizarBotaoEspacamento();
            atualizarBotaoCursor();
            atualizarBotaoAnimacoes();
            atualizarBotaoLupa();


            /* Feedback */

            if (statusLeitura) {

                statusLeitura.innerHTML =
                    "Acessibilidade restaurada";

            }

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        prepararElementos();

        atualizarBotaoContraste();
        atualizarBotaoDislexia();
        atualizarBotaoEspacamento();
        atualizarBotaoCursor();
        atualizarBotaoAnimacoes();
        atualizarBotaoLupa();

    }
);