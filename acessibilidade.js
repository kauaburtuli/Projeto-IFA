/* =========================================================
   ACESSIBILIDADE - ROBÓTICA EDUCACIONAL
========================================================= */


/* =========================================================
   VARIÁVEIS PRINCIPAIS
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
   ELEMENTOS
========================================================= */

const botaoAcessibilidade =
    document.querySelector(".btn-acessibilidade");

const menuAcessibilidade =
    document.querySelector(".menu-acessibilidade");

const botaoLerPagina =
    document.getElementById("lerPagina");

const controleLeitura =
    document.getElementById("controleLeitura");

const statusLeitura =
    document.getElementById("statusLeitura");

const botaoPausar =
    document.getElementById("pausarBtn");

const botaoContinuar =
    document.getElementById("continuarBtn");

const botaoParar =
    document.getElementById("pararLeitura") ||
    document.getElementById("pararBtn");

const modalLeitura =
    document.getElementById("modalLeitura");

const cancelarLeitura =
    document.getElementById("cancelarLeitura");

const indicadorSelecao =
    document.getElementById("indicadorSelecao");


/* =========================================================
   MENU DE ACESSIBILIDADE
========================================================= */

if (botaoAcessibilidade && menuAcessibilidade) {

    botaoAcessibilidade.addEventListener("click", function (event) {

        event.stopPropagation();

        menuAcessibilidade.classList.toggle("ativo");

    });

    menuAcessibilidade.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        menuAcessibilidade.classList.remove("ativo");
    });

}


/* =========================================================
   FUNÇÃO PARA FALAR UM TEXTO
========================================================= */

function falar(texto, callback) {

    if (!texto) {
        if (callback) callback();
        return;
    }

    leitura = new SpeechSynthesisUtterance(texto);

    leitura.lang = "pt-BR";
    leitura.rate = 1;
    leitura.pitch = 1;
    leitura.volume = 1;

    leitura.onend = function () {

        if (callback) {
            callback();
        }

    };

    leitura.onerror = function () {

        if (callback) {
            callback();
        }

    };

    speechSynthesis.speak(leitura);
}


/* =========================================================
   ABRIR MODAL DE LEITURA
========================================================= */

if (botaoLerPagina) {

    botaoLerPagina.addEventListener("click", function () {

        if (!modalLeitura) {
            iniciarLeituraGeral();
            return;
        }

        menuAcessibilidade.classList.remove("ativo");

        modalLeitura.style.display = "flex";

        opcaoAtual = 0;

        atualizarOpcaoModal();

        falar(
            "Selecione o tipo de leitura. " +
            "Use as setas para escolher entre leitura geral da página " +
            "ou leitura por seleção. Pressione Enter para confirmar " +
            "ou Escape para cancelar."
        );

    });

}


/* =========================================================
   OPÇÕES DO MODAL
========================================================= */

const opcoesLeitura =
    document.querySelectorAll(
        "#modalLeitura .opcao-leitura"
    );


function atualizarOpcaoModal() {

    opcoesLeitura.forEach(function (opcao, indice) {

        if (indice === opcaoAtual) {

            opcao.classList.add("selecionada");

            opcao.setAttribute(
                "aria-selected",
                "true"
            );

        } else {

            opcao.classList.remove("selecionada");

            opcao.setAttribute(
                "aria-selected",
                "false"
            );

        }

    });

}


/* =========================================================
   CLICAR NAS OPÇÕES DO MODAL
========================================================= */

opcoesLeitura.forEach(function (opcao, indice) {

    opcao.addEventListener("click", function () {

        opcaoAtual = indice;

        confirmarLeitura();

    });

});


/* =========================================================
   TECLADO DO MODAL
========================================================= */

document.addEventListener("keydown", function (event) {

    if (
        !modalLeitura ||
        modalLeitura.style.display !== "flex"
    ) {
        return;
    }

    if (event.key === "ArrowDown" ||
        event.key === "ArrowRight") {

        event.preventDefault();

        opcaoAtual++;

        if (opcaoAtual >= opcoesLeitura.length) {
            opcaoAtual = 0;
        }

        atualizarOpcaoModal();

        return;
    }


    if (event.key === "ArrowUp" ||
        event.key === "ArrowLeft") {

        event.preventDefault();

        opcaoAtual--;

        if (opcaoAtual < 0) {
            opcaoAtual = opcoesLeitura.length - 1;
        }

        atualizarOpcaoModal();

        return;
    }


    if (event.key === "Enter") {

        event.preventDefault();

        confirmarLeitura();

        return;
    }


    if (event.key === "Escape") {

        event.preventDefault();

        fecharModal();

    }

});


/* =========================================================
   CONFIRMAR TIPO DE LEITURA
========================================================= */

function confirmarLeitura() {

    if (!opcoesLeitura.length) {
        fecharModal();
        iniciarLeituraGeral();
        return;
    }

    const opcao =
        opcoesLeitura[opcaoAtual];

    const tipo =
        opcao.dataset.tipo ||
        opcao.getAttribute("data-leitura");

    fecharModal();

    if (
        tipo === "selecao" ||
        tipo === "seleção"
    ) {

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

}


/* =========================================================
   OBTER TEXTO COMPLETO DA PÁGINA
========================================================= */

function obterTextoPagina() {

    const partes = [];

    /*
       HEADER
    */

    const header =
        document.querySelector("header");

    if (header) {

        const textoHeader =
            header.innerText.trim();

        if (textoHeader) {
            partes.push(textoHeader);
        }

    }


    /*
       MAIN
    */

    const main =
        document.querySelector("main");

    if (main) {

        const textoMain =
            main.innerText.trim();

        if (textoMain) {
            partes.push(textoMain);
        }

    } else {

        /*
           Caso alguma página não possua <main>,
           utiliza o conteúdo do body.
        */

        const bodyTexto =
            document.body.innerText.trim();

        if (bodyTexto) {
            partes.push(bodyTexto);
        }

    }


    /*
       FOOTER
    */

    const footer =
        document.querySelector("footer");

    if (footer) {

        const textoFooter =
            footer.innerText.trim();

        if (textoFooter) {
            partes.push(textoFooter);
        }

    }


    return partes
        .join("\n\n")
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   DIVIDIR TEXTO EM PARTES
========================================================= */

function dividirTexto(texto) {

    if (!texto) {
        return [];
    }

    texto =
        texto
            .replace(/\s+/g, " ")
            .trim();


    /*
       Tenta preservar frases inteiras.
       Cada bloco fica com aproximadamente
       180 caracteres para evitar problemas
       em navegadores com SpeechSynthesis.
    */

    const frases =
        texto.match(
            /[^.!?]+[.!?]+|[^.!?]+$/g
        ) || [texto];


    const partes = [];

    let atual = "";


    frases.forEach(function (frase) {

        frase = frase.trim();

        if (!frase) {
            return;
        }


        if (
            (atual + " " + frase).length <= 180
        ) {

            atual =
                atual
                    ? atual + " " + frase
                    : frase;

        } else {

            if (atual) {
                partes.push(atual);
            }

            atual = frase;

        }

    });


    if (atual) {
        partes.push(atual);
    }


    return partes;

}


/* =========================================================
   INICIAR LEITURA GERAL
========================================================= */

function iniciarLeituraGeral() {

    pararLeituraInternamente(false);

    modoLeitura = "geral";

    const texto =
        obterTextoPagina();

    if (!texto) {

        atualizarStatus(
            "⚠️ Nenhum texto encontrado"
        );

        return;
    }


    if (menuAcessibilidade) {
        menuAcessibilidade.classList.remove("ativo");
    }


    if (controleLeitura) {
        controleLeitura.style.display = "flex";
    }


    filaLeitura =
        dividirTexto(texto);

    indiceFila = 0;

    lendoFila = true;

    atualizarStatus("🔊 Lendo...");

    falarProximaParte();

}


/* =========================================================
   INICIAR LEITURA DE UM TEXTO
========================================================= */

function iniciarLeituraTexto(texto) {

    if (!texto) {
        return;
    }

    pararLeituraInternamente(false);

    modoLeitura = "geral";

    filaLeitura =
        dividirTexto(texto);

    indiceFila = 0;

    lendoFila = true;

    if (controleLeitura) {
        controleLeitura.style.display = "flex";
    }

    atualizarStatus("🔊 Lendo...");

    falarProximaParte();

}


/* =========================================================
   LER PRÓXIMA PARTE DA FILA
========================================================= */

function falarProximaParte() {

    if (!lendoFila) {
        return;
    }


    if (
        indiceFila >= filaLeitura.length
    ) {

        lendoFila = false;
        lendoTexto = false;

        atualizarStatus(
            "🔊 Leitura concluída"
        );

        return;
    }


    const texto =
        filaLeitura[indiceFila];


    leitura =
        new SpeechSynthesisUtterance(texto);

    leitura.lang = "pt-BR";
    leitura.rate = 1;
    leitura.pitch = 1;
    leitura.volume = 1;


    lendoTexto = true;


    leitura.onstart = function () {

        atualizarStatus("🔊 Lendo...");

    };


    leitura.onend = function () {

        indiceFila++;

        setTimeout(function () {

            falarProximaParte();

        }, 80);

    };


    leitura.onerror = function () {

        indiceFila++;

        setTimeout(function () {

            falarProximaParte();

        }, 100);

    };


    speechSynthesis.speak(leitura);

}


/* =========================================================
   LEITURA POR SELEÇÃO
========================================================= */

function iniciarLeituraSelecao() {

    pararLeituraInternamente(false);

    modoLeitura = "selecao";

    document.body.classList.add(
        "modo-leitura-selecao"
    );


    if (indicadorSelecao) {

        indicadorSelecao.style.display =
            "block";

        indicadorSelecao.innerHTML =
            "🔊 Clique em um texto para ouvir";

    }


    prepararElementos();


    if (controleLeitura) {
        controleLeitura.style.display = "flex";
    }


    atualizarStatus(
        "🔊 Selecione um texto"
    );


    falar(
        "Modo de leitura por seleção ativado. " +
        "Clique em um texto para ouvi-lo. " +
        "Você também pode usar a tecla Tab para navegar. " +
        "Pressione Escape para sair."
    );

}


/* =========================================================
   OBTER TEXTO DE UM ELEMENTO
========================================================= */

function obterTextoLeitura(elemento) {

    if (!elemento) {
        return "";
    }


    let texto = "";


    /*
       ARIA-LABEL
    */

    if (elemento.getAttribute("aria-label")) {

        texto =
            elemento
                .getAttribute("aria-label")
                .trim();

    }


    /*
       TITLE
    */

    if (
        !texto &&
        elemento.getAttribute("title")
    ) {

        texto =
            elemento
                .getAttribute("title")
                .trim();

    }


    /*
       ALT DE IMAGEM
    */

    if (
        !texto &&
        elemento.tagName === "IMG"
    ) {

        texto =
            elemento
                .getAttribute("alt") || "";

    }


    /*
       VALUE
    */

    if (
        !texto &&
        (
            elemento.tagName === "INPUT" ||
            elemento.tagName === "TEXTAREA"
        )
    ) {

        texto =
            elemento.value ||
            elemento.placeholder ||
            "";

    }


    /*
       TEXTO NORMAL
    */

    if (!texto) {

        texto =
            elemento.innerText ||
            elemento.textContent ||
            "";

    }


    texto =
        texto
            .replace(/\s+/g, " ")
            .trim();


    if (!texto) {
        return "";
    }


    /*
       BOTÕES
    */

    if (
        elemento.tagName === "BUTTON" ||
        elemento.getAttribute("role") === "button"
    ) {

        texto +=
            ". Botão. Pressione Enter para ativar.";

    }


    /*
       LINKS
    */

    else if (
        elemento.tagName === "A" ||
        elemento.getAttribute("role") === "link"
    ) {

        texto +=
            ". Link. Pressione Enter para acessar.";

    }


    /*
       CAMPOS
    */

    else if (
        elemento.tagName === "INPUT" ||
        elemento.tagName === "TEXTAREA" ||
        elemento.tagName === "SELECT"
    ) {

        texto +=
            ". Campo de formulário.";

    }


    return texto;

}


/* =========================================================
   OBTER ELEMENTOS NAVEGÁVEIS
========================================================= */

function obterElementosNavegaveis() {

    const seletores = [

        /*
           CABEÇALHO
        */

        "header",
        "header h1",
        "header h2",
        "header a",
        "header button",
        "header input",
        "header select",
        "header textarea",


        /*
           LINKS E CONTROLES
        */

        "a[href]",
        "button",
        "input",
        "select",
        "textarea",
        "[role='button']",
        "[role='link']",
        "[tabindex]:not([tabindex='-1'])",


        /*
           CONTEÚDO
        */

        "main h1",
        "main h2",
        "main h3",
        "main h4",
        "main h5",
        "main h6",
        "main p",
        "main li",
        "main blockquote",
        "main figcaption",
        "main label",


        /*
           CLASSES COMUNS DO SITE
        */

        "main .texto",
        "main .titulo",
        "main .card",
        "main .item",


        /*
           RODAPÉ
        */

        "footer",
        "footer a",
        "footer button",
        "footer p",
        "footer li"

    ];


    const encontrados = [];


    seletores.forEach(function (seletor) {

        document
            .querySelectorAll(seletor)
            .forEach(function (elemento) {

                if (
                    !encontrados.includes(elemento)
                ) {

                    encontrados.push(elemento);

                }

            });

    });


    return encontrados.filter(function (elemento) {

        const estilo =
            getComputedStyle(elemento);

        const rect =
            elemento.getBoundingClientRect();


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

    elementosLeitura =
        obterElementosNavegaveis();


    elementosLeitura =
        elementosLeitura.filter(function (elemento) {

            const texto =
                obterTextoLeitura(elemento);

            return texto.length > 0;

        });


    elementosLeitura.forEach(function (elemento) {

        if (
            elemento.dataset.leituraPreparada === "true"
        ) {
            return;
        }


        elemento.dataset.leituraPreparada =
            "true";


        elemento.addEventListener(
            "mouseenter",
            function () {

                if (
                    !document.body.classList.contains(
                        "modo-leitura-selecao"
                    )
                ) {
                    return;
                }

                destacarElemento(elemento);

            }
        );


        elemento.addEventListener(
            "mouseleave",
            function () {

                elemento.classList.remove(
                    "leitura-destaque"
                );

            }
        );


        elemento.addEventListener(
            "click",
            function (event) {

                if (
                    !document.body.classList.contains(
                        "modo-leitura-selecao"
                    )
                ) {
                    return;
                }


                /*
                   Evita que links e botões
                   sejam ativados duas vezes
                   quando necessário.
                */

                if (
                    elemento.tagName === "A" ||
                    elemento.tagName === "BUTTON"
                ) {

                    event.preventDefault();

                }


                lerElementoComFila(elemento);

            }
        );

    });

}


/* =========================================================
   DESTACAR ELEMENTO
========================================================= */

function destacarElemento(elemento) {

    elementosLeitura.forEach(function (item) {

        item.classList.remove(
            "leitura-destaque"
        );

    });


    elemento.classList.add(
        "leitura-destaque"
    );

}


/* =========================================================
   LER ELEMENTO COM FILA
========================================================= */

function lerElementoComFila(elemento) {

    const texto =
        obterTextoLeitura(elemento);

    if (!texto) {
        return;
    }


    destacarElemento(elemento);


    /*
       IMPORTANTE:
       Não usamos speechSynthesis.cancel()
       aqui.

       Assim, se um texto já estiver sendo lido,
       o novo texto entra na fila e espera
       o anterior terminar.
    */

    const partes =
        dividirTexto(texto);


    partes.forEach(function (parte) {

        filaLeitura.push(parte);

    });


    if (!lendoFila) {

        lendoFila = true;

        indiceFila = 0;

        if (controleLeitura) {
            controleLeitura.style.display =
                "flex";
        }

        atualizarStatus(
            "🔊 Lendo seleção..."
        );

        falarProximaParte();

    }

}


/* =========================================================
   NAVEGAÇÃO POR TAB
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !document.body.classList.contains(
                "modo-leitura-selecao"
            )
        ) {
            return;
        }


        if (event.key !== "Tab") {
            return;
        }


        event.preventDefault();


        if (!elementosLeitura.length) {

            prepararElementos();

        }


        if (event.shiftKey) {

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


        if (!elemento) {
            return;
        }


        destacarElemento(elemento);


        try {

            elemento.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        } catch (erro) {}


        lerElementoComFila(elemento);

    }
);


/* =========================================================
   ENTER NO ELEMENTO SELECIONADO
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !document.body.classList.contains(
                "modo-leitura-selecao"
            )
        ) {
            return;
        }


        if (event.key !== "Enter") {
            return;
        }


        const elemento =
            elementosLeitura[indiceLeitura];


        if (!elemento) {
            return;
        }


        /*
           Links
        */

        if (
            elemento.tagName === "A"
        ) {

            elemento.click();

        }


        /*
           Botões
        */

        else if (
            elemento.tagName === "BUTTON"
        ) {

            elemento.click();

        }


        /*
           Outros elementos interativos
        */

        else if (
            elemento.getAttribute("role") ===
            "button"
        ) {

            elemento.click();

        }

    }
);


/* =========================================================
   ESCAPE - SAIR DO MODO DE SELEÇÃO
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        if (
            document.body.classList.contains(
                "modo-leitura-selecao"
            )
        ) {

            pararLeitura();

        }

    }
);


/* =========================================================
   ATUALIZAR STATUS
========================================================= */

function atualizarStatus(texto) {

    if (statusLeitura) {

        statusLeitura.innerHTML =
            texto;

    }

}


/* =========================================================
   PAUSAR
========================================================= */

if (botaoPausar) {

    botaoPausar.addEventListener(
        "click",
        function () {

            if (
                speechSynthesis.speaking &&
                !speechSynthesis.paused
            ) {

                speechSynthesis.pause();

                atualizarStatus(
                    "⏸ Pausado"
                );

            }

        }
    );

}


/* =========================================================
   CONTINUAR
========================================================= */

if (botaoContinuar) {

    botaoContinuar.addEventListener(
        "click",
        function () {

            if (
                speechSynthesis.paused
            ) {

                speechSynthesis.resume();

                atualizarStatus(
                    "🔊 Lendo..."
                );

            }

        }
    );

}


/* =========================================================
   PARAR
========================================================= */

if (botaoParar) {

    botaoParar.addEventListener(
        "click",
        function () {

            pararLeitura();

        }
    );

}


/* =========================================================
   PARAR LEITURA
========================================================= */

function pararLeitura() {

    pararLeituraInternamente(true);

}


/* =========================================================
   PARAR INTERNAMENTE
========================================================= */

function pararLeituraInternamente(
    ocultarControle
) {

    speechSynthesis.cancel();


    leitura = null;

    lendoTexto = false;
    lendoFila = false;

    filaLeitura = [];

    indiceFila = 0;

    indiceLeitura = -1;


    elementosLeitura.forEach(
        function (elemento) {

            elemento.classList.remove(
                "leitura-destaque"
            );

        }
    );


    document.body.classList.remove(
        "modo-leitura-selecao"
    );


    if (indicadorSelecao) {

        indicadorSelecao.style.display =
            "none";

    }


    if (ocultarControle) {

        if (controleLeitura) {

            controleLeitura.style.display =
                "none";

        }

        atualizarStatus("");

    }

}


/* =========================================================
   FONTE
========================================================= */

const botaoFonteMais =
    document.getElementById("fonteMais");

const botaoFontePadrao =
    document.getElementById("fontePadrao");

const botaoFonteMenos =
    document.getElementById("fonteMenos");


const CHAVE_FONTE =
    "tamanhoFonte";


function aplicarTamanhoFonte() {

    let escala =
        parseFloat(
            localStorage.getItem(
                CHAVE_FONTE
            )
        );


    if (isNaN(escala)) {
        escala = 1;
    }


    escala =
        Math.max(
            0.8,
            Math.min(
                1.4,
                escala
            )
        );


    document.documentElement.style
        .setProperty(
            "--escala-fonte",
            escala
        );


    document.body.style.fontSize =
        (escala * 100) + "%";

}


aplicarTamanhoFonte();


if (botaoFonteMais) {

    botaoFonteMais.onclick =
        function () {

            let escala =
                parseFloat(
                    localStorage.getItem(
                        CHAVE_FONTE
                    )
                ) || 1;


            escala += 0.1;


            if (escala > 1.4) {
                escala = 1.4;
            }


            localStorage.setItem(
                CHAVE_FONTE,
                escala.toFixed(2)
            );


            aplicarTamanhoFonte();

        };

}


if (botaoFontePadrao) {

    botaoFontePadrao.onclick =
        function () {

            localStorage.setItem(
                CHAVE_FONTE,
                "1"
            );

            aplicarTamanhoFonte();

        };

}


if (botaoFonteMenos) {

    botaoFonteMenos.onclick =
        function () {

            let escala =
                parseFloat(
                    localStorage.getItem(
                        CHAVE_FONTE
                    )
                ) || 1;


            escala -= 0.1;


            if (escala < 0.8) {
                escala = 0.8;
            }


            localStorage.setItem(
                CHAVE_FONTE,
                escala.toFixed(2)
            );


            aplicarTamanhoFonte();

        };

}


/* =========================================================
   ALTO CONTRASTE
========================================================= */

const botaoContraste =
    document.getElementById("contraste");


function aplicarContraste() {

    if (
        localStorage.getItem(
            "altoContraste"
        ) === "on"
    ) {

        document.body.classList.add(
            "alto-contraste"
        );

    } else {

        document.body.classList.remove(
            "alto-contraste"
        );

    }

}


aplicarContraste();


if (botaoContraste) {

    botaoContraste.onclick =
        function () {

            document.body.classList.toggle(
                "alto-contraste"
            );


            if (
                document.body.classList.contains(
                    "alto-contraste"
                )
            ) {

                localStorage.setItem(
                    "altoContraste",
                    "on"
                );

            } else {

                localStorage.setItem(
                    "altoContraste",
                    "off"
                );

            }

        };

}


/* =========================================================
   FONTE PARA DISLEXIA
========================================================= */

const botaoDislexia =
    document.getElementById("dislexia");


function aplicarDislexia() {

    if (
        localStorage.getItem(
            "fonteDislexia"
        ) === "on"
    ) {

        document.body.classList.add(
            "fonte-dislexia"
        );

        if (botaoDislexia) {

            botaoDislexia.innerHTML =
                "📖 Fonte normal";

        }

    } else {

        document.body.classList.remove(
            "fonte-dislexia"
        );

        if (botaoDislexia) {

            botaoDislexia.innerHTML =
                "📖 Fonte para dislexia";

        }

    }

}


aplicarDislexia();


if (botaoDislexia) {

    botaoDislexia.onclick =
        function () {

            const ativada =
                document.body.classList.toggle(
                    "fonte-dislexia"
                );


            localStorage.setItem(
                "fonteDislexia",
                ativada
                    ? "on"
                    : "off"
            );


            botaoDislexia.innerHTML =
                ativada
                    ? "📖 Fonte normal"
                    : "📖 Fonte para dislexia";

        };

}


/* =========================================================
   ESPAÇAMENTO
========================================================= */

const botaoEspacamento =
    document.getElementById("espacamento");


function aplicarEspacamento() {

    if (
        localStorage.getItem(
            "espacamento"
        ) === "on"
    ) {

        document.body.classList.add(
            "espacamento-aumentado"
        );

    } else {

        document.body.classList.remove(
            "espacamento-aumentado"
        );

    }

}


aplicarEspacamento();


if (botaoEspacamento) {

    botaoEspacamento.onclick =
        function () {

            const ativado =
                document.body.classList.toggle(
                    "espacamento-aumentado"
                );


            localStorage.setItem(
                "espacamento",
                ativado
                    ? "on"
                    : "off"
            );

        };

}


/* =========================================================
   CURSOR AMPLIADO
========================================================= */

const botaoCursor =
    document.getElementById("cursor");


function aplicarCursor() {

    if (
        localStorage.getItem(
            "cursorGrande"
        ) === "on"
    ) {

        document.body.classList.add(
            "cursor-grande"
        );


        if (botaoCursor) {

            botaoCursor.innerHTML =
                "🖱 Cursor normal";

        }

    } else {

        document.body.classList.remove(
            "cursor-grande"
        );


        if (botaoCursor) {

            botaoCursor.innerHTML =
                "🖱 Cursor ampliado";

        }

    }

}


aplicarCursor();


if (botaoCursor) {

    botaoCursor.onclick =
        function () {

            const ativado =
                document.body.classList.toggle(
                    "cursor-grande"
                );


            localStorage.setItem(
                "cursorGrande",
                ativado
                    ? "on"
                    : "off"
            );


            botaoCursor.innerHTML =
                ativado
                    ? "🖱 Cursor normal"
                    : "🖱 Cursor ampliado";

        };

}


/* =========================================================
   REDUZIR ANIMAÇÕES
========================================================= */

const botaoAnimacoes =
    document.getElementById("animacoes");


function aplicarAnimacoes() {

    if (
        localStorage.getItem(
            "reduzirAnimacoes"
        ) === "on"
    ) {

        document.body.classList.add(
            "reduzir-animacoes"
        );

    } else {

        document.body.classList.remove(
            "reduzir-animacoes"
        );

    }

}


aplicarAnimacoes();


if (botaoAnimacoes) {

    botaoAnimacoes.onclick =
        function () {

            const ativado =
                document.body.classList.toggle(
                    "reduzir-animacoes"
                );


            localStorage.setItem(
                "reduzirAnimacoes",
                ativado
                    ? "on"
                    : "off"
            );

        };

}


/* =========================================================
   LUPA
========================================================= */

const botaoLupa =
    document.getElementById("lupa");


function aplicarLupa() {

    if (
        localStorage.getItem(
            "lupaAtiva"
        ) === "on"
    ) {

        document.body.classList.add(
            "lupa-ativa"
        );

    } else {

        document.body.classList.remove(
            "lupa-ativa"
        );

    }

}


aplicarLupa();


if (botaoLupa) {

    botaoLupa.onclick =
        function () {

            const ativada =
                document.body.classList.toggle(
                    "lupa-ativa"
                );


            localStorage.setItem(
                "lupaAtiva",
                ativada
                    ? "on"
                    : "off"
            );

        };

}


/* =========================================================
   RESTAURAR ACESSIBILIDADE
========================================================= */

const botaoRestaurar =
    document.getElementById(
        "restaurarAcessibilidade"
    );


if (botaoRestaurar) {

    botaoRestaurar.onclick =
        function () {

            /*
               Leitura
            */

            pararLeitura();


            /*
               Fonte
            */

            localStorage.removeItem(
                "tamanhoFonte"
            );


            /*
               Contraste
            */

            localStorage.removeItem(
                "altoContraste"
            );


            /*
               Dislexia
            */

            localStorage.removeItem(
                "fonteDislexia"
            );


            /*
               Espaçamento
            */

            localStorage.removeItem(
                "espacamento"
            );


            /*
               Cursor
            */

            localStorage.removeItem(
                "cursorGrande"
            );


            /*
               Animações
            */

            localStorage.removeItem(
                "reduzirAnimacoes"
            );


            /*
               Lupa
            */

            localStorage.removeItem(
                "lupaAtiva"
            );


            /*
               Aplicar padrões
            */

            document.body.classList.remove(
                "alto-contraste",
                "fonte-dislexia",
                "espacamento-aumentado",
                "cursor-grande",
                "reduzir-animacoes",
                "lupa-ativa"
            );


            document.body.style.fontSize =
                "";


            document.documentElement.style
                .removeProperty(
                    "--escala-fonte"
                );


            aplicarDislexia();
            aplicarCursor();


            if (botaoDislexia) {

                botaoDislexia.innerHTML =
                    "📖 Fonte para dislexia";

            }


            if (botaoCursor) {

                botaoCursor.innerHTML =
                    "🖱 Cursor ampliado";

            }


            atualizarStatus("");


            if (controleLeitura) {

                controleLeitura.style.display =
                    "none";

            }

        };

}


/* =========================================================
   GARANTIR QUE O LEITOR FIQUE DISPONÍVEL
========================================================= */

window.addEventListener(
    "load",
    function () {

        aplicarTamanhoFonte();
        aplicarContraste();
        aplicarDislexia();
        aplicarEspacamento();
        aplicarCursor();
        aplicarAnimacoes();
        aplicarLupa();

    }
);