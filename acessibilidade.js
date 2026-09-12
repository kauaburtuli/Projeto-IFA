/* =========================================================
   LEITURA POR SELEÇÃO
========================================================= */

let elementosLeitura = [];
let indiceLeitura = -1;

let filaLeitura = [];
let lendoFila = false;


/* =========================================================
   OBTER ELEMENTOS NAVEGÁVEIS
========================================================= */

function obterElementosNavegaveis() {

    const seletores = [
        "header h1",
        "header a",
        "header button",
        "header input",
        "header select",
        "header textarea",

        "main h1",
        "main h2",
        "main h3",
        "main h4",
        "main h5",
        "main h6",

        "main p",
        "main li",
        "main a",
        "main button",
        "main input",
        "main select",
        "main textarea",

        "main .texto",
        "main .titulo",
        "main .card",
        "main .item",

        "footer a",
        "footer button",
        "footer p",
        "footer li",

        "[role='button']",
        "[role='link']"
    ];

    const encontrados = [];

    seletores.forEach(function(seletor) {

        document.querySelectorAll(seletor).forEach(function(elemento) {

            if (!encontrados.includes(elemento)) {
                encontrados.push(elemento);
            }

        });

    });


    /* Remove elementos invisíveis */

    const visiveis = encontrados.filter(function(elemento) {

        const estilo = window.getComputedStyle(elemento);
        const rect = elemento.getBoundingClientRect();

        return (
            estilo.display !== "none" &&
            estilo.visibility !== "hidden" &&
            estilo.opacity !== "0" &&
            rect.width > 0 &&
            rect.height > 0
        );

    });


    /* =====================================================
       COLOCA OS ELEMENTOS NA ORDEM REAL DA PÁGINA
    ===================================================== */

    visiveis.sort(function(a, b) {

        if (
            a.compareDocumentPosition(b) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ) {
            return -1;
        }

        return 1;

    });


    return visiveis;

}


/* =========================================================
   OBTER TEXTO DO ELEMENTO
========================================================= */

function obterTextoLeitura(elemento) {

    if (!elemento) return "";

    let texto = "";

    const ariaLabel =
        elemento.getAttribute("aria-label");

    const title =
        elemento.getAttribute("title");

    const alt =
        elemento.getAttribute("alt");


    if (ariaLabel) {

        texto = ariaLabel;

    } else if (title) {

        texto = title;

    } else if (alt) {

        texto = alt;

    } else if (
        elemento.tagName === "INPUT" &&
        elemento.value
    ) {

        texto = elemento.value;

    } else {

        texto =
            elemento.innerText ||
            elemento.textContent ||
            "";

    }


    texto = texto
        .replace(/\s+/g, " ")
        .trim();


    if (!texto) return "";


    const tag =
        elemento.tagName.toLowerCase();


    if (tag === "button") {

        texto +=
            ". Botão. Pressione Enter para ativar.";

    } else if (tag === "a") {

        texto +=
            ". Link. Pressione Enter para acessar.";

    } else if (tag === "input") {

        texto +=
            ". Campo de entrada.";

    } else if (tag === "select") {

        texto +=
            ". Caixa de seleção.";

    }


    return texto;

}


/* =========================================================
   DESTACAR ELEMENTO
========================================================= */

function destacarElemento(elemento) {

    if (!elemento) return;


    /* Remove destaque anterior */

    document
        .querySelectorAll(".destaque-leitura")
        .forEach(function(item) {

            item.classList.remove(
                "destaque-leitura"
            );

        });


    /* Adiciona destaque */

    elemento.classList.add(
        "destaque-leitura"
    );


    /* Guarda qual elemento está selecionado */

    elemento.setAttribute(
        "data-elemento-leitura",
        "ativo"
    );

}


/* =========================================================
   REMOVER DESTAQUES
========================================================= */

function removerDestaques() {

    document
        .querySelectorAll(".destaque-leitura")
        .forEach(function(elemento) {

            elemento.classList.remove(
                "destaque-leitura"
            );

            elemento.removeAttribute(
                "data-elemento-leitura"
            );

        });

}


/* =========================================================
   PREPARAR ELEMENTOS
========================================================= */

function prepararElementosLeitura() {

    elementosLeitura =
        obterElementosNavegaveis();

}


/* =========================================================
   INICIAR LEITURA POR SELEÇÃO
========================================================= */

function iniciarLeituraSelecao() {

    modoLeitura = "selecao";

    prepararElementosLeitura();

    indiceLeitura = -1;

    filaLeitura = [];

    lendoFila = false;


    if (menu) {

        menu.classList.remove("ativo");

    }


    document.body.classList.add(
        "modo-leitura-selecao"
    );


    if (indicadorSelecao) {

        indicadorSelecao.style.display =
            "block";

        indicadorSelecao.innerHTML =
            "👆 Modo de seleção ativo — use Tab ou clique em um elemento.";

    }


    if (controle) {

        controle.style.display =
            "flex";

    }


    if (status) {

        status.innerHTML =
            "👆 Selecione um texto";

    }


    falar(
        "Modo de leitura por seleção ativado. " +
        "Use a tecla Tab para navegar pelos elementos " +
        "ou clique sobre um texto para ouvi-lo."
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

        if (status) {

            status.innerHTML =
                "👆 Selecione um texto";

        }

        return;

    }


    lendoFila = true;

    const texto =
        filaLeitura.shift();


    falarTextoFila(texto);

}


/* =========================================================
   FALAR FILA
========================================================= */

function falarTextoFila(texto) {

    if (!texto) {

        lendoFila = false;

        processarFila();

        return;

    }


    const partes = texto
        .replace(/\s+/g, " ")
        .trim()
        .match(/.{1,180}(?:\s|$)/g);


    if (!partes) {

        lendoFila = false;

        processarFila();

        return;

    }


    let indice = 0;


    function falarParte() {

        if (indice >= partes.length) {

            lendoFila = false;

            processarFila();

            return;

        }


        if (status) {

            status.innerHTML =
                "🔊 Lendo...";

        }


        leitura =
            new SpeechSynthesisUtterance(
                partes[indice].trim()
            );


        leitura.lang = "pt-BR";

        leitura.rate = 1;

        leitura.pitch = 1;


        leitura.onend = function() {

            indice++;

            setTimeout(
                falarParte,
                80
            );

        };


        leitura.onerror = function() {

            indice++;

            setTimeout(
                falarParte,
                80
            );

        };


        speechSynthesis.speak(
            leitura
        );

    }


    falarParte();

}


/* =========================================================
   TAB - PRÓXIMO ELEMENTO
========================================================= */

document.addEventListener(
    "keydown",
    function(evento) {

        if (
            modoLeitura !== "selecao"
        ) return;


        if (
            evento.key !== "Tab"
        ) return;


        /*
         * Não recria a lista a cada Tab.
         * Isso evita perder a posição atual.
         */

        if (
            elementosLeitura.length === 0
        ) {

            prepararElementosLeitura();

        }


        if (
            elementosLeitura.length === 0
        ) return;


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
            elementosLeitura[
                indiceLeitura
            ];


        if (!elemento) return;


        /* ==========================
           DESTACA
        ========================== */

        destacarElemento(
            elemento
        );


        /* ==========================
           FOCO
        ========================== */

        if (
            elemento.tagName === "A" ||
            elemento.tagName === "BUTTON" ||
            elemento.tagName === "INPUT" ||
            elemento.tagName === "SELECT" ||
            elemento.tagName === "TEXTAREA"
        ) {

            try {

                elemento.focus({
                    preventScroll: true
                });

            } catch (erro) {}

        }


        /* ==========================
           ROLA ATÉ O ELEMENTO
        ========================== */

        try {

            elemento.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        } catch (erro) {}


        /* ==========================
           LÊ
        ========================== */

        const texto =
            obterTextoLeitura(
                elemento
            );


        if (texto) {

            adicionarNaFila(
                texto
            );

        }

    }
);


/* =========================================================
   ENTER - ATIVAR ELEMENTO
========================================================= */

document.addEventListener(
    "keydown",
    function(evento) {

        if (
            modoLeitura !== "selecao"
        ) return;


        if (
            evento.key !== "Enter"
        ) return;


        const elemento =
            elementosLeitura[
                indiceLeitura
            ];


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

    }
);


/* =========================================================
   CLIQUE PARA SELECIONAR
========================================================= */

document.addEventListener(
    "click",
    function(evento) {

        if (
            modoLeitura !== "selecao"
        ) return;


        const elemento =
            evento.target.closest(
                "header h1, " +
                "header a, " +
                "header button, " +
                "main h1, " +
                "main h2, " +
                "main h3, " +
                "main h4, " +
                "main h5, " +
                "main h6, " +
                "main p, " +
                "main li, " +
                "main a, " +
                "main button, " +
                "main .texto, " +
                "main .titulo, " +
                "main .card, " +
                "main .item, " +
                "footer a, " +
                "footer button, " +
                "footer p, " +
                "footer li"
            );


        if (!elemento) return;


        /*
         * Não seleciona os controles
         * internos do menu de acessibilidade.
         */

        if (
            elemento.closest(
                ".menu-acessibilidade"
            ) ||
            elemento.closest(
                "#modalLeitura"
            ) ||
            elemento.closest(
                "#controleLeitura"
            )
        ) {

            return;

        }


        prepararElementosLeitura();


        const indice =
            elementosLeitura.indexOf(
                elemento
            );


        if (indice !== -1) {

            indiceLeitura =
                indice;

        }


        destacarElemento(
            elemento
        );


        const texto =
            obterTextoLeitura(
                elemento
            );


        if (texto) {

            adicionarNaFila(
                texto
            );

        }

    }
);


/* =========================================================
   ESC - SAIR DO MODO DE SELEÇÃO
========================================================= */

document.addEventListener(
    "keydown",
    function(evento) {

        if (
            evento.key !== "Escape"
        ) return;


        if (
            modoLeitura !== "selecao"
        ) return;


        /*
         * Não chama pararLeitura(),
         * pois essa função não existe.
         *
         * Apenas aciona o botão de parar
         * que já existe no seu sistema.
         */

        const botaoParar =
            document.getElementById(
                "pararLeitura"
            );


        if (botaoParar) {

            botaoParar.click();

        } else {

            /* Se o botão não existir,
               pelo menos limpa o destaque. */

            filaLeitura = [];

            lendoFila = false;

            speechSynthesis.cancel();

            removerDestaques();

            document.body.classList.remove(
                "modo-leitura-selecao"
            );

        }

    }
);


/* =========================================================
   LIMPAR DESTAQUE
========================================================= */

function limparDestaqueLeitura() {

    removerDestaques();

}

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