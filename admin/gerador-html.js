/* =========================================================
   GERADOR DE HTML DOS PROJETOS
   Usa o HTML base oficial do site
   ========================================================= */


/* =========================================================
   FUNÇÕES AUXILIARES
   ========================================================= */

function escaparHTMLGerador(texto) {

    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escaparAtributo(texto) {

    return escaparHTMLGerador(texto)
        .replace(/`/g, "&#096;");
}


function nomeSeguro(nome) {

    return String(nome || "arquivo")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
}


function extensaoArquivo(nome) {

    const partes = String(nome || "").split(".");

    if (partes.length < 2) {
        return "";
    }

    return partes.pop().toLowerCase();
}


function caminhoImagem(nome) {

    return `imagens/${nome}`;
}


function caminhoImagemProjeto(nome) {

    return `../imagens/${nome}`;
}


function caminhoCodigo(nome) {

    return `../codigos/${nome}`;
}


function caminhoVideo(nome) {

    return `../vídeos/${nome}`;
}


/* =========================================================
   NOME ÚNICO PARA ARQUIVOS
   ========================================================= */

function gerarNomeArquivoProjeto(slug, indice, arquivo, pasta) {

    const extensao = extensaoArquivo(arquivo?.name);

    const baseOriginal = arquivo?.name
        ? arquivo.name.replace(/\.[^/.]+$/, "")
        : `arquivo-${indice}`;

    const base = nomeSeguro(baseOriginal) || `arquivo-${indice}`;

    return `${pasta}/${slug}-${indice}-${base}${extensao ? "." + extensao : ""}`;
}


/* =========================================================
   GERAR CABEÇALHO
   ========================================================= */

function gerarCabecalho(projeto) {

    return `
<header>

    <h1>

        <img src="../imagens/robo-logo.png"
             class="logo-robo"
             alt="Mascote da Robótica Educacional">

        Robótica Educacional

    </h1>

    <nav>

        <a href="../index.html">Início</a>

        <a href="../projetos.html">Projetos</a>

        <div class="dropdown-acessibilidade">

            <button class="btn-acessibilidade">
                ♿ Acessibilidade ▼
            </button>

            <div class="menu-acessibilidade">

                <button id="lerPagina">
                    🔊 Ler página
                </button>

                <hr>

                <div class="linha-fonte">

                    <span class="texto-fonte">
                        🔤 Tamanho da fonte
                    </span>

                    <div class="controles-fonte">

                        <button
                            id="fonteMais"
                            aria-label="Aumentar fonte">
                            A+
                        </button>

                        <button
                            id="fontePadrao"
                            aria-label="Fonte padrão">
                            A
                        </button>

                        <button
                            id="fonteMenos"
                            aria-label="Diminuir fonte">
                            A−
                        </button>

                    </div>

                </div>

                <hr>

                <button id="contraste">
                    🌙 Alto contraste
                </button>

                <button id="dislexia">
                    📖 Fonte para dislexia
                </button>

                <button id="espacamento">
                    ↔️ Aumentar espaçamento
                </button>

                <button id="cursor">
                    🖱 Cursor ampliado
                </button>

                <button id="animacoes">
                    ✨ Reduzir animações
                </button>

                <button id="lupa">
                    🔍 Ativar lupa
                </button>

                <button id="restaurarAcessibilidade">
                    Restaurar padrão
                </button>

            </div>

        </div>

    </nav>

</header>

<div id="controleLeitura" class="controle-leitura">

    <span id="statusLeitura">
        🔊 Lendo...
    </span>

    <div class="botoes-leitura">

        <button id="continuarBtn">
            ▶
        </button>

        <button id="pausarBtn">
            ⏸
        </button>

        <button id="pararBtn">
            ⏹
        </button>

    </div>

</div>
`;
}


/* =========================================================
   BLOCO DE TEXTO
   ========================================================= */

function gerarBlocoTexto(bloco) {

    const titulo = escaparHTMLGerador(bloco.titulo);
    const conteudo = String(bloco.conteudo || "");

    return `
<section>

    <h2 class="titulo">
        ${titulo}
    </h2>

    <div class="texto">

        <p>
            ${converterQuebrasTexto(conteudo)}
        </p>

    </div>

</section>
`;
}


/* =========================================================
   CONVERTER QUEBRAS DE LINHA
   ========================================================= */

function converterQuebrasTexto(texto) {

    return escaparHTMLGerador(texto)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\n/g, "<br>");
}


/* =========================================================
   BLOCO DE IMAGEM
   ========================================================= */

async function gerarBlocoImagem(bloco, projeto, arquivos, indice) {

    if (!bloco.arquivo) {
        return "";
    }

    const nomeArquivo = gerarNomeArquivoProjeto(
        projeto.slug,
        indice,
        bloco.arquivo,
        "imagens"
    );

    arquivos.push({

        caminho: nomeArquivo,

        conteudo: bloco.arquivo,

        tipo: "arquivo"

    });

    const caminhoPagina =
        "../" + nomeArquivo;

    const titulo =
        escaparHTMLGerador(bloco.titulo);

    const alt =
        escaparAtributo(
            bloco.alt ||
            bloco.titulo ||
            "Imagem do projeto"
        );

    const legenda =
        escaparHTMLGerador(bloco.legenda);

    return `
<section>

    <h2 class="titulo">
        ${titulo}
    </h2>

    <div class="texto">

        <img
            src="${caminhoPagina}"
            alt="${alt}"
            onclick="abrirImagem(this.src)"
            style="max-width:100%; cursor:pointer;"
        >

        ${
            legenda
                ? `<p>${legenda}</p>`
                : ""
        }

    </div>

</section>
`;
}


/* =========================================================
   BLOCO DE GALERIA
   ========================================================= */

async function gerarBlocoGaleria(bloco, projeto, arquivos, indice) {

    if (!bloco.arquivos || bloco.arquivos.length === 0) {
        return "";
    }

    const imagens = [];

    for (
        let i = 0;
        i < bloco.arquivos.length;
        i++
    ) {

        const arquivo =
            bloco.arquivos[i];

        if (!arquivo) {
            continue;
        }

        const nomeArquivo =
            gerarNomeArquivoProjeto(
                projeto.slug,
                `${indice}-${i + 1}`,
                arquivo,
                "imagens"
            );

        arquivos.push({

            caminho: nomeArquivo,

            conteudo: arquivo,

            tipo: "arquivo"

        });

        imagens.push(`

            <img
                src="../${nomeArquivo}"
                onclick="abrirImagem(this.src)"
                alt="Imagem ${i + 1} da galeria"
            >

        `);
    }

    if (imagens.length === 0) {
        return "";
    }

    return `
<section>

    <h2 class="titulo">
        ${escaparHTMLGerador(bloco.titulo)}
    </h2>

    <div class="galeria">

        ${imagens.join("\n")}

    </div>

</section>
`;
}


/* =========================================================
   BLOCO DE MATERIAIS
   ========================================================= */

async function gerarBlocoMateriais(
    bloco,
    projeto,
    arquivos,
    indice
) {

    const itens = bloco.itens || [];

    if (itens.length === 0) {
        return "";
    }

    const materiais = [];

    for (
        let i = 0;
        i < itens.length;
        i++
    ) {

        const material = itens[i];

        if (!material) {
            continue;
        }

        let caminhoImagemMaterial = "";

        if (material.arquivo) {

            const nomeArquivo =
                gerarNomeArquivoProjeto(
                    projeto.slug,
                    `material-${indice}-${i + 1}`,
                    material.arquivo,
                    "imagens"
                );

            arquivos.push({

                caminho: nomeArquivo,

                conteudo: material.arquivo,

                tipo: "arquivo"

            });

            caminhoImagemMaterial =
                `../${nomeArquivo}`;
        }

        const nome =
            escaparHTMLGerador(
                material.nome || "Material"
            );

        const descricao =
            escaparHTMLGerador(
                material.descricao || ""
            );

        const alt =
            escaparAtributo(
                material.alt ||
                material.nome ||
                "Imagem do material"
            );

        materiais.push(`

<div
    class="material"
    ${
        caminhoImagemMaterial
            ? `onclick="abrirImagem('${caminhoImagemMaterial}')"`
            : ""
    }
>

    ${
        caminhoImagemMaterial
            ? `
            <img
                src="${caminhoImagemMaterial}"
                alt="${alt}"
                style="display:none;"
            >
            `
            : ""
    }

    <h3>
        ${nome}
    </h3>

    <p>
        ${descricao}
    </p>

</div>

        `);
    }

    return `
<section>

    <h2 class="titulo">
        ${escaparHTMLGerador(
            bloco.titulo || "Materiais Utilizados"
        )}
    </h2>

    <div class="texto-material">
        Clique nos balões para visualizar os componentes
    </div>

    <div class="cards-materiais">

        ${materiais.join("\n")}

    </div>

</section>
`;
}


/* =========================================================
   BLOCO DE CÓDIGO
   ========================================================= */

function gerarBlocoCodigo(
    bloco,
    projeto,
    codigos,
    indice
) {

    const titulo =
        escaparHTMLGerador(
            bloco.titulo || "Código Arduino"
        );

    let nomeArquivo =
        String(bloco.nomeArquivo || "").trim();

    if (!nomeArquivo) {

        nomeArquivo =
            `${projeto.slug}-${indice}.ino`;
    }

    nomeArquivo =
        nomeArquivo
            .replace(/[\/\\]/g, "-")
            .trim();

    if (!nomeArquivo.toLowerCase().endsWith(".ino")) {
        nomeArquivo += ".ino";
    }

    const nomeSeguroArquivo =
        nomeSeguro(nomeArquivo);

    const nomeFinal =
        nomeSeguroArquivo || `${projeto.slug}-${indice}.ino`;

    const conteudo =
        String(bloco.conteudo || "");

    codigos.push({

        caminho: `codigos/${nomeFinal}`,

        nomeArquivo: nomeFinal,

        conteudo

    });

    const codigoHTML =
        escaparHTMLGerador(conteudo);

    return `
<section>

    <h2 class="titulo">
        Códigos Fonte
    </h2>

    <div class="codigo">

        <h3>
            ${titulo}
        </h3>

        <pre><code class="language-cpp">${codigoHTML}</code></pre>

        <a
            href="${caminhoCodigo(nomeFinal)}"
            download
            class="btn"
        >

            Baixar ${titulo}

        </a>

    </div>

</section>
`;
}


/* =========================================================
   BLOCO DE VÍDEO
   ========================================================= */

async function gerarBlocoVideo(
    bloco,
    projeto,
    arquivos,
    indice
) {

    if (!bloco.arquivo) {
        return "";
    }

    const nomeArquivo =
        gerarNomeArquivoProjeto(
            projeto.slug,
            indice,
            bloco.arquivo,
            "vídeos"
        );

    arquivos.push({

        caminho: nomeArquivo,

        conteudo: bloco.arquivo,

        tipo: "arquivo"

    });

    const titulo =
        escaparHTMLGerador(
            bloco.titulo || "Vídeo Demonstrativo"
        );

    const legenda =
        escaparHTMLGerador(
            bloco.legenda || ""
        );

    return `
<section>

    <h2 class="titulo">
        ${titulo}
    </h2>

    <div class="video">

        <video controls>

            <source
                src="../${nomeArquivo}"
                type="video/mp4"
            >

            Seu navegador não suporta vídeos.

        </video>

        ${
            legenda
                ? `
                <p>
                    ${legenda}
                </p>
                `
                : ""
        }

    </div>

</section>
`;
}


/* =========================================================
   BLOCO DE LINK
   ========================================================= */

function gerarBlocoLink(bloco) {

    const titulo =
        escaparHTMLGerador(
            bloco.titulo || "Link"
        );

    const texto =
        escaparHTMLGerador(
            bloco.texto || "Acessar"
        );

    const url =
        escaparAtributo(
            bloco.url || "#"
        );

    return `
<section>

    <h2 class="titulo">
        ${titulo}
    </h2>

    <div class="link">

        <a
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn"
        >

            ${texto}

        </a>

    </div>

</section>
`;
}


/* =========================================================
   BLOCO TINKERCAD
   ========================================================= */

async function gerarBlocoTinkercad(
    bloco,
    projeto,
    arquivos,
    indice
) {

    let imagem = "";

    if (bloco.imagem) {

        const nomeArquivo =
            gerarNomeArquivoProjeto(
                projeto.slug,
                `tinkercad-${indice}`,
                bloco.imagem,
                "imagens"
            );

        arquivos.push({

            caminho: nomeArquivo,

            conteudo: bloco.imagem,

            tipo: "arquivo"

        });

        imagem = `
            <img
                src="../${nomeArquivo}"
                alt="${escaparAtributo(
                    bloco.titulo ||
                    "Circuito no Tinkercad"
                )}"
                onclick="abrirImagem(this.src)"
            >
        `;
    }

    const titulo =
        escaparHTMLGerador(
            bloco.titulo ||
            "Circuito no Tinkercad"
        );

    const url =
        escaparAtributo(
            bloco.url || "#"
        );

    const legenda =
        escaparHTMLGerador(
            bloco.legenda || ""
        );

    return `
<section>

    <h2 class="titulo">
        ${titulo}
    </h2>

    <div class="tinkercad">

        ${imagem}

        ${
            legenda
                ? `
                <p>
                    ${legenda}
                </p>
                `
                : ""
        }

        ${
            bloco.url
                ? `
                <a
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn"
                >

                    Acessar Projeto no Tinkercad

                </a>
                `
                : ""
        }

    </div>

</section>
`;
}


/* =========================================================
   MODAIS E ACESSIBILIDADE
   ========================================================= */

function gerarModais() {

    return `

<!-- Janela da imagem -->

<div
    id="janelaImagem"
    class="janela"
>

    <span
        class="fechar"
        onclick="fecharImagem()"
    >
        &times;
    </span>

    <img id="imagemGrande">

</div>


<div id="cursorGrande"></div>

<div id="lupaFoco"></div>


<!-- Modal de escolha da leitura -->

<div
    id="modalLeitura"
    class="modal-leitura"
    aria-hidden="true"
>

    <div
        class="caixa-leitura"
        role="dialog"
        aria-modal="true"
    >

        <h2>
            Selecione o tipo de leitura
        </h2>

        <div class="opcoes-leitura">

            <div
                class="opcao-leitura selecionada"
                data-tipo="geral"
            >
                ▶ Leitura geral
            </div>

            <div
                class="opcao-leitura"
                data-tipo="selecao"
            >
                ○ Leitura por seleção
            </div>

        </div>

        <p class="instrucao-leitura">

            Use as setas para escolher e Enter para confirmar.

        </p>

        <button id="cancelarLeitura">

            Cancelar

        </button>

    </div>

</div>


<!-- Indicador do modo seleção -->

<div
    id="indicadorSelecao"
    class="indicador-selecao"
>

    👆 Clique no texto que deseja ouvir

</div>

`;
}


/* =========================================================
   SCRIPTS
   ========================================================= */

function gerarScripts() {

    return `

<script src="../projeto-individual.js"></script>

<script src="../acessibilidade.js"></script>

<script src="https://cdn.jsdelivr.net/npm/prismjs/prism.js"></script>

<script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-c.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-cpp.min.js"></script>


<div vw class="enabled">

    <div vw-access-button class="active"></div>

    <div vw-plugin-wrapper>

        <div class="vw-plugin-top-wrapper"></div>

    </div>

</div>


<script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>

<script>

    new window.VLibras.Widget(
        'https://vlibras.gov.br/app'
    );

</script>

`;
}


/* =========================================================
   RODAPÉ
   ========================================================= */

function gerarRodape() {

    return `

<footer>

    <p>

        Projeto desenvolvido para o IFA - Robótica Educacional<br>

        © 2026 - Todos os direitos reservados.

    </p>

</footer>

`;
}


/* =========================================================
   CARD PARA PROJETOS.HTML
   ========================================================= */

function gerarCardProjeto(projeto) {

    const imagem =
        projeto.bannerFile
            ? `imagens/${projeto.slug}-banner.${extensaoArquivo(
                projeto.bannerFile.name
            )}`
            : "imagens/robo-logo.png";

    return `
<article class="card-projeto">

    <img
        src="${imagem}"
        alt="${escaparAtributo(projeto.titulo)}"
    >

    <div class="conteudo-card">

        <h2>
            ${escaparHTMLGerador(projeto.titulo)}
        </h2>

        <p>
            ${escaparHTMLGerador(projeto.descricao)}
        </p>

        <a
            href="projetos/${projeto.slug}.html"
            class="botao"
        >

            Ver projeto

        </a>

    </div>

</article>
`;
}


/* =========================================================
   GERAR PÁGINA COMPLETA
   ========================================================= */

async function gerarProjetoHTML({
    projeto,
    blocos
}) {

    if (!projeto) {
        throw new Error(
            "Os dados do projeto não foram informados."
        );
    }

    if (!projeto.slug) {
        throw new Error(
            "O slug do projeto não foi informado."
        );
    }


    const arquivos = [];

    const codigos = [];

    let conteudoProjeto = "";


    /* -----------------------------------------------------
       BANNER
       ----------------------------------------------------- */

    let bannerHTML = "";

    if (projeto.bannerFile) {

        const extensao =
            extensaoArquivo(
                projeto.bannerFile.name
            );

        const nomeBanner =
            `${projeto.slug}-banner${extensao ? "." + extensao : ""}`;

        arquivos.push({

            caminho: `imagens/${nomeBanner}`,

            conteudo: projeto.bannerFile,

            tipo: "arquivo"

        });

        bannerHTML = `

<div class="banner">

    <img
        src="../imagens/${nomeBanner}"
        alt="${escaparAtributo(projeto.titulo)}"
    >

    <div class="banner-texto">

        <h2>
            ${escaparHTMLGerador(projeto.titulo)}
        </h2>

        <p>

            ${escaparHTMLGerador(projeto.descricao)}

        </p>

    </div>

</div>

`;
    } else {

        bannerHTML = `

<div class="banner">

    <div class="banner-texto">

        <h2>
            ${escaparHTMLGerador(projeto.titulo)}
        </h2>

        <p>
            ${escaparHTMLGerador(projeto.descricao)}
        </p>

    </div>

</div>

`;
    }


    /* -----------------------------------------------------
       BLOCOS
       ----------------------------------------------------- */

    for (
        let i = 0;
        i < blocos.length;
        i++
    ) {

        const bloco = blocos[i];

        if (!bloco) {
            continue;
        }


        if (bloco.tipo === "texto") {

            conteudoProjeto +=
                gerarBlocoTexto(bloco);

        }


        else if (bloco.tipo === "imagem") {

            conteudoProjeto +=
                await gerarBlocoImagem(
                    bloco,
                    projeto,
                    arquivos,
                    i
                );

        }


        else if (bloco.tipo === "galeria") {

            conteudoProjeto +=
                await gerarBlocoGaleria(
                    bloco,
                    projeto,
                    arquivos,
                    i
                );

        }


        else if (bloco.tipo === "materiais") {

            conteudoProjeto +=
                await gerarBlocoMateriais(
                    bloco,
                    projeto,
                    arquivos,
                    i
                );

        }


        else if (bloco.tipo === "codigo") {

            conteudoProjeto +=
                gerarBlocoCodigo(
                    bloco,
                    projeto,
                    codigos,
                    i
                );

        }


        else if (bloco.tipo === "video") {

            conteudoProjeto +=
                await gerarBlocoVideo(
                    bloco,
                    projeto,
                    arquivos,
                    i
                );

        }


        else if (bloco.tipo === "link") {

            conteudoProjeto +=
                gerarBlocoLink(bloco);

        }


        else if (bloco.tipo === "tinkercad") {

            conteudoProjeto +=
                await gerarBlocoTinkercad(
                    bloco,
                    projeto,
                    arquivos,
                    i
                );

        }

    }


    /* -----------------------------------------------------
       HTML FINAL
       ----------------------------------------------------- */

    const html = `<!DOCTYPE html>

<html lang="pt-BR">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${escaparHTMLGerador(projeto.titulo)}
    </title>

    <link
        rel="icon"
        type="image/png"
        href="../imagens/robo-logo.png"
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
        rel="stylesheet"
    >

    <link
        rel="stylesheet"
        href="../projeto-individual.css"
    >

    <link
        rel="stylesheet"
        href="../acessibilidade.css"
    >

    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css"
    >

</head>

<body>

${gerarCabecalho(projeto)}

<main id="conteudo">

${bannerHTML}

${conteudoProjeto}

${gerarModais()}

</main>

${gerarScripts()}

${gerarRodape()}

</body>

</html>
`;


    /* -----------------------------------------------------
       RETORNO PARA O ADMIN.JS
       ----------------------------------------------------- */

    return {

        arquivos,

        codigos,

        pagina: {

            caminho:
                `projetos/${projeto.slug}.html`,

            conteudo:
                html

        },

        card:
            gerarCardProjeto(projeto)

    };

}


/* =========================================================
   DISPONIBILIZAR PARA O ADMIN.JS
   ========================================================= */

window.gerarProjetoHTML =
    gerarProjetoHTML;