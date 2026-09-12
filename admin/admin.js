let blocos = [];

let projeto = {
    titulo: "",
    slug: "",
    descricao: "",
    bannerFile: null
};

let slugAlteradoManualmente = false;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", iniciarPainel);


function iniciarPainel() {

    const tokenSessao = sessionStorage.getItem("roboticaGithubToken");

    if (!tokenSessao) {
        window.location.href = "index.html";
        return;
    }

    if (typeof GitHubAPI === "undefined") {
        mostrarStatus(
            "Erro: github-api.js não foi carregado.",
            "erro"
        );
        return;
    }

    GitHubAPI.definirToken(tokenSessao);

    sessionStorage.removeItem("roboticaGithubToken");

    configurarCampos();
    configurarBotoes();
    configurarModalImagens();
    atualizarListaBlocos();
    carregarProjetosPublicados();

}


// ======================================================
// CAMPOS DO PROJETO
// ======================================================

function configurarCampos() {

    const titulo = document.getElementById("tituloProjeto");
    const slug = document.getElementById("slugProjeto");
    const descricao = document.getElementById("descricaoProjeto");
    const banner = document.getElementById("bannerProjeto");



    if (titulo) {

        titulo.addEventListener("input", function () {

            projeto.titulo = this.value;

            if (!slugAlteradoManualmente) {
                projeto.slug = gerarSlug(this.value);
                slug.value = projeto.slug;
            }

        });

    }



    if (slug) {

        slug.addEventListener("input", function () {

            slugAlteradoManualmente = true;

            projeto.slug = gerarSlug(this.value);

            this.value = projeto.slug;

        });

    }



    if (descricao) {

        descricao.addEventListener("input", function () {

            projeto.descricao = this.value;

        });

    }



    if (banner) {

        banner.addEventListener("change", function () {

            if (!this.files || !this.files[0]) {
                return;
            }

            projeto.bannerFile = this.files[0];

            const nome = document.getElementById("nomeBanner");

            if (nome) {
                nome.textContent = projeto.bannerFile.name;
            }

            mostrarPreviewBanner(projeto.bannerFile);

        });

    }

}


// ======================================================
// GERAR SLUG
// ======================================================

function gerarSlug(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


// ======================================================
// PREVIEW DO BANNER
// ======================================================

function mostrarPreviewBanner(arquivo) {

    const preview = document.getElementById("previewBanner");

    if (!preview || !arquivo) {
        return;
    }

    const url = URL.createObjectURL(arquivo);

    preview.src = url;
    preview.style.display = "block";

    preview.onload = function () {
        URL.revokeObjectURL(url);
    };

}


// ======================================================
// BOTÕES
// ======================================================

function configurarBotoes() {

    // Botões de adicionar blocos

    const botoesBlocos = document.querySelectorAll("[data-bloco]");

    botoesBlocos.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const tipo = this.getAttribute("data-bloco");

            console.log("Adicionando bloco:", tipo);

            adicionarBloco(tipo);

        });

    });



    // Publicar

    const btnPublicar = document.getElementById("btnPublicar");

    if (btnPublicar) {

        btnPublicar.addEventListener(
            "click",
            abrirConfirmacao
        );

    }



    // Cancelar

    const btnCancelar =
        document.getElementById("cancelarPublicacao");

    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            fecharConfirmacao
        );

    }



    // Confirmar

    const btnConfirmar =
        document.getElementById("confirmarPublicacao");

    if (btnConfirmar) {

        btnConfirmar.addEventListener(
            "click",
            publicarProjeto
        );

    }



    // X do modal

    const fechar =
        document.getElementById("fecharModal");

    if (fechar) {

        fechar.addEventListener(
            "click",
            fecharConfirmacao
        );

    }



    // Sair

    const btnSair =
        document.getElementById("btnSair");

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            sairPainel
        );

    }

    const btnAtualizarProjetos =
    document.getElementById(
        "btnAtualizarProjetos"
    );

if (btnAtualizarProjetos) {

    btnAtualizarProjetos.addEventListener(
        "click",
        carregarProjetosPublicados
    );

}

}


// ======================================================
// ADICIONAR BLOCO
// ======================================================

function adicionarBloco(tipo) {

    const novoBloco = {
        id: Date.now() + Math.random(),
        tipo: tipo,
        titulo: "",
        conteudo: "",
        legenda: "",
        alt: "",
        arquivo: null,
        nomeArquivo: "",
        url: "",
        textoLink: "",
        materiais: []
    };


    if (tipo === "materiais") {

        novoBloco.materiais = [
    {
        nome: "",
        descricao: "",
        imagem: ""
    }
];

    }


    blocos.push(novoBloco);

    atualizarListaBlocos();


    setTimeout(function () {

        const editores =
            document.querySelectorAll(".bloco-editor");

        if (editores.length > 0) {

            editores[editores.length - 1]
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        }

    }, 100);

}


// ======================================================
// ATUALIZAR LISTA
// ======================================================

function atualizarListaBlocos() {

    const lista =
        document.getElementById("listaBlocos");

    if (!lista) {
        return;
    }


    if (blocos.length === 0) {

        lista.innerHTML = `
            <div class="blocos-vazio">
                <span>📦</span>
                <p>Nenhum conteúdo adicionado.</p>
                <small>
                    Use os botões acima para começar.
                </small>
            </div>
        `;

        return;
    }


    lista.innerHTML = "";


    blocos.forEach(function (bloco, indice) {

        lista.insertAdjacentHTML(
            "beforeend",
            gerarEditorBloco(bloco, indice)
        );

    });


    configurarEditoresBlocos();

}


// ======================================================
// GERAR EDITOR
// ======================================================

function gerarEditorBloco(bloco, indice) {

    let conteudo = "";


   if (bloco.tipo === "texto") {
    conteudo = `
        <div class="campo">
            <label>Título</label>

            <input
                type="text"
                class="campo-titulo"
                value="${escapeHTML(bloco.titulo)}"
                placeholder="Título da seção"
            >
        </div>

        <div class="campo">
            <label>Texto</label>

            <div class="editor-texto">

                <div class="barra-formatacao">

                    <button
                        type="button"
                        class="formatar-texto"
                        data-comando="bold"
                        title="Negrito"
                    >
                        <strong>B</strong>
                    </button>

                    <button
                        type="button"
                        class="formatar-texto"
                        data-comando="italic"
                        title="Itálico"
                    >
                        <em>I</em>
                    </button>

                    <button
                        type="button"
                        class="formatar-texto"
                        data-comando="underline"
                        title="Sublinhado"
                    >
                        <u>U</u>
                    </button>

                    <button
                        type="button"
                        class="formatar-texto"
                        data-comando="strikeThrough"
                        title="Tachado"
                    >
                        <s>S</s>
                    </button>

                    <input
                        type="color"
                        class="cor-texto"
                        title="Cor do texto"
                        value="#222222"
                    >

                    <button
                        type="button"
                        class="formatar-texto"
                        data-comando="insertUnorderedList"
                        title="Lista"
                    >
                        • Lista
                    </button>

                    <button
                        type="button"
                        class="formatar-texto"
                        data-comando="justifyLeft"
                        title="Alinhar à esquerda"
                    >
                        ≡
                    </button>

                    <button
                        type="button"
                        class="formatar-texto"
                        data-comando="justifyCenter"
                        title="Centralizar"
                    >
                        ☰
                    </button>

                    <button
                        type="button"
                        class="formatar-texto"
                        data-comando="justifyRight"
                        title="Alinhar à direita"
                    >
                        ≡
                    </button>

                </div>

                <div
                    class="campo-conteudo editor-conteudo"
                    contenteditable="true"
                    data-placeholder="Digite o conteúdo..."
                >${bloco.conteudo || ""}</div>

            </div>
        </div>
    `;
}



    else if (bloco.tipo === "imagem") {

        conteudo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escapeHTML(bloco.titulo)}"
                >

            </div>

            <div class="campo">

                <label>Imagem</label>

                <input
                    type="file"
                    class="campo-arquivo"
                    accept="image/*"
                >

                <small class="nome-arquivo">
                    ${escapeHTML(
                        bloco.arquivo
                            ? bloco.arquivo.name
                            : "Nenhuma imagem selecionada"
                    )}
                </small>

            </div>

            <div class="campo">

                <label>Texto alternativo</label>

                <input
                    type="text"
                    class="campo-alt"
                    value="${escapeHTML(bloco.alt)}"
                    placeholder="Descrição da imagem"
                >

            </div>

            <div class="campo">

                <label>Legenda</label>

                <input
                    type="text"
                    class="campo-legenda"
                    value="${escapeHTML(bloco.legenda)}"
                >

            </div>
        `;

    }



    else if (bloco.tipo === "galeria") {

        conteudo = `
            <div class="campo">

                <label>Título da galeria</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escapeHTML(bloco.titulo)}"
                >

            </div>

            <div class="campo">

                <label>Imagens</label>

                <input
                    type="file"
                    class="campo-arquivo"
                    accept="image/*"
                    multiple
                >

                <small>
                    Selecione uma ou várias imagens.
                </small>

            </div>
        `;

    }



    else if (bloco.tipo === "materiais") {

        conteudo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escapeHTML(bloco.titulo)}"
                >

            </div>

            <div class="materiais-editor">

                ${gerarMateriais(bloco)}

            </div>

            <button
                type="button"
                class="botao-secundario adicionar-material"
            >
                + Adicionar material
            </button>
        `;

    }



    else if (bloco.tipo === "codigo") {

        conteudo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escapeHTML(bloco.titulo)}"
                >

            </div>

            <div class="campo">

                <label>Arquivo .ino</label>

                <input
                    type="file"
                    class="campo-arquivo"
                    accept=".ino,.txt"
                >

                <small class="nome-arquivo">
                    ${escapeHTML(
                        bloco.nomeArquivo ||
                        "Nenhum arquivo selecionado"
                    )}
                </small>

            </div>

            <div class="campo">

                <label>Código</label>

                <textarea
                    class="campo-codigo"
                    rows="15"
                    placeholder="Cole o código aqui..."
                >${escapeHTML(bloco.conteudo)}</textarea>

            </div>
        `;

    }



    else if (bloco.tipo === "video") {

        conteudo = `
            <div class="campo">

                <label>Vídeo</label>

                <input
                    type="file"
                    class="campo-arquivo"
                    accept="video/*"
                >

                <small class="nome-arquivo">
                    ${
                        bloco.arquivo
                        ? escapeHTML(bloco.arquivo.name)
                        : "Nenhum vídeo selecionado"
                    }
                </small>

            </div>

            <div class="campo">

                <label>Legenda</label>

                <input
                    type="text"
                    class="campo-legenda"
                    value="${escapeHTML(bloco.legenda)}"
                >

            </div>
        `;

    }



    else if (bloco.tipo === "link") {

        conteudo = `
            <div class="campo">

                <label>Texto do link</label>

                <input
                    type="text"
                    class="campo-texto-link"
                    value="${escapeHTML(bloco.textoLink)}"
                    placeholder="Ex.: Acesse o projeto"
                >

            </div>

            <div class="campo">

                <label>URL</label>

                <input
                    type="url"
                    class="campo-url"
                    value="${escapeHTML(bloco.url)}"
                    placeholder="https://..."
                >

            </div>
        `;

    }



    else if (bloco.tipo === "tinkercad") {

        conteudo = `
            <div class="campo">

                <label>Texto do botão</label>

                <input
                    type="text"
                    class="campo-texto-link"
                    value="${escapeHTML(
                        bloco.textoLink || "Abrir no Tinkercad"
                    )}"
                >

            </div>

            <div class="campo">

                <label>Link do Tinkercad</label>

                <input
                    type="url"
                    class="campo-url"
                    value="${escapeHTML(bloco.url)}"
                    placeholder="https://www.tinkercad.com/..."
                >

            </div>
        `;

    }


    return `
        <div
            class="bloco-editor"
            data-id="${bloco.id}"
        >

            <div class="bloco-cabecalho">

                <strong>
                    ${nomeTipoBloco(bloco.tipo)}
                </strong>

                <div>

                    <button
                        type="button"
                        class="mover-cima"
                        title="Mover para cima"
                    >
                        ↑
                    </button>

                    <button
                        type="button"
                        class="mover-baixo"
                        title="Mover para baixo"
                    >
                        ↓
                    </button>

                    <button
                        type="button"
                        class="remover-bloco"
                        title="Remover"
                    >
                        🗑
                    </button>

                </div>

            </div>

            <div class="bloco-corpo">

                ${conteudo}

            </div>

        </div>
    `;

}


// ======================================================
// NOMES DOS BLOCOS
// ======================================================

function nomeTipoBloco(tipo) {

    const nomes = {

        texto: "📝 Texto",

        imagem: "🖼 Imagem",

        galeria: "🖼 Galeria",

        materiais: "🔧 Materiais",

        codigo: "💻 Código",

        video: "🎬 Vídeo",

        link: "🔗 Link",

        tinkercad: "🔌 Tinkercad"

    };

    return nomes[tipo] || "Bloco";

}


// ======================================================
// MATERIAIS
// ======================================================

function gerarMateriais(bloco) {

    if (!bloco.materiais) {
        bloco.materiais = [];
    }

    return bloco.materiais.map(function(material, indice) {

        return `
            <div
                class="material-editor"
                data-material="${indice}"
            >

                <div class="campo">

                    <label>Nome do material</label>

                    <input
                        type="text"
                        class="material-nome"
                        value="${escapeHTML(material.nome)}"
                        placeholder="Ex.: Arduino Uno"
                    >

                </div>


                <div class="campo">

                    <label>Descrição</label>

                    <input
                        type="text"
                        class="material-descricao"
                        value="${escapeHTML(material.descricao)}"
                        placeholder="Descrição do material"
                    >

                </div>


                <div class="campo">

                    <label>Imagem do material</label>

                    <button
                        type="button"
                        class="botao-secundario selecionar-imagem-material"
                    >
                        🖼 Selecionar imagem existente
                    </button>

                    <div class="imagem-material-selecionada">

                        ${
                            material.imagem
                            ? `
                                <img
                                    src="../${escapeHTML(material.imagem)}"
                                    alt="Imagem selecionada"
                                >

                                <small>
                                    ${escapeHTML(material.imagem)}
                                </small>
                            `
                            : `
                                <small>
                                    Nenhuma imagem selecionada
                                </small>
                            `
                        }

                    </div>

                </div>


                <button
                    type="button"
                    class="botao-remover-material"
                >
                    Remover material
                </button>

            </div>
        `;

    }).join("");

}


// ======================================================
// CONFIGURAR EDITORES
// ======================================================

function configurarEditoresBlocos() {

    document
        .querySelectorAll(".bloco-editor")
        .forEach(function (elemento) {

            const id =
                Number(elemento.dataset.id);

            const bloco =
                blocos.find(function (item) {
                    return item.id === id;
                });

            if (!bloco) {
                return;
            }


            const titulo =
                elemento.querySelector(".campo-titulo");

            if (titulo) {

                titulo.addEventListener("input", function () {

                    bloco.titulo = this.value;

                });

            }


           const conteudo =
    elemento.querySelector(".editor-conteudo");

if (conteudo) {

    conteudo.addEventListener("input", function () {
        bloco.conteudo = this.innerHTML;
    });

    conteudo
        .querySelectorAll("a")
        .forEach(function (link) {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        });
}

const botoesFormatacao =
    elemento.querySelectorAll(".formatar-texto");

botoesFormatacao.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const comando =
            this.dataset.comando;

        const editor =
            elemento.querySelector(".editor-conteudo");

        if (!editor) return;

        editor.focus();

        document.execCommand(
            comando,
            false,
            null
        );

        bloco.conteudo =
            editor.innerHTML;
    });

});


const seletorCor =
    elemento.querySelector(".cor-texto");

if (seletorCor) {

    seletorCor.addEventListener("input", function () {

        const editor =
            elemento.querySelector(".editor-conteudo");

        if (!editor) return;

        editor.focus();

        document.execCommand(
            "foreColor",
            false,
            this.value
        );

        bloco.conteudo =
            editor.innerHTML;
    });

}


            const codigo =
                elemento.querySelector(".campo-codigo");

            if (codigo) {

                codigo.addEventListener("input", function () {

                    bloco.conteudo = this.value;

                });

            }


            const alt =
                elemento.querySelector(".campo-alt");

            if (alt) {

                alt.addEventListener("input", function () {

                    bloco.alt = this.value;

                });

            }


            const legenda =
                elemento.querySelector(".campo-legenda");

            if (legenda) {

                legenda.addEventListener("input", function () {

                    bloco.legenda = this.value;

                });

            }


            const url =
                elemento.querySelector(".campo-url");

            if (url) {

                url.addEventListener("input", function () {

                    bloco.url = this.value;

                });

            }


            const textoLink =
                elemento.querySelector(".campo-texto-link");

            if (textoLink) {

                textoLink.addEventListener("input", function () {

                    bloco.textoLink = this.value;

                });

            }


            const arquivo =
                elemento.querySelector(".campo-arquivo");

            if (arquivo) {

                arquivo.addEventListener("change", function () {

                    if (!this.files.length) {
                        return;
                    }

                    if (
                        bloco.tipo === "galeria"
                    ) {

                        bloco.arquivo =
                            Array.from(this.files);

                    } else {

                        bloco.arquivo =
                            this.files[0];

                    }

                    if (bloco.tipo === "codigo") {

                        const file =
                            this.files[0];

                        bloco.nomeArquivo =
                            file.name;

                        file.text().then(function (texto) {

                            bloco.conteudo = texto;

                            atualizarListaBlocos();

                        });

                    }

                });

            }


            // Materiais

            configurarMateriais(
                elemento,
                bloco
            );


            // Adicionar material

            const adicionarMaterial =
                elemento.querySelector(
                    ".adicionar-material"
                );

            if (adicionarMaterial) {

                adicionarMaterial.addEventListener(
                    "click",
                    function () {

                        bloco.materiais.push({

                            nome: "",
                            descricao: "",
                            arquivo: null

                        });

                        atualizarListaBlocos();

                    }
                );

            }


            // Remover bloco

            const remover =
                elemento.querySelector(
                    ".remover-bloco"
                );

            if (remover) {

                remover.addEventListener(
                    "click",
                    function () {

                        blocos =
                            blocos.filter(
                                function (item) {
                                    return item.id !== id;
                                }
                            );

                        atualizarListaBlocos();

                    }
                );

            }


            // Mover para cima

            const cima =
                elemento.querySelector(
                    ".mover-cima"
                );

            if (cima) {

                cima.addEventListener(
                    "click",
                    function () {

                        const posicao =
                            blocos.findIndex(
                                function (item) {
                                    return item.id === id;
                                }
                            );

                        if (posicao > 0) {

                            const temp =
                                blocos[posicao - 1];

                            blocos[posicao - 1] =
                                blocos[posicao];

                            blocos[posicao] =
                                temp;

                            atualizarListaBlocos();

                        }

                    }
                );

            }


            // Mover para baixo

            const baixo =
                elemento.querySelector(
                    ".mover-baixo"
                );

            if (baixo) {

                baixo.addEventListener(
                    "click",
                    function () {

                        const posicao =
                            blocos.findIndex(
                                function (item) {
                                    return item.id === id;
                                }
                            );

                        if (
                            posicao < blocos.length - 1
                        ) {

                            const temp =
                                blocos[posicao + 1];

                            blocos[posicao + 1] =
                                blocos[posicao];

                            blocos[posicao] =
                                temp;

                            atualizarListaBlocos();

                        }

                    }
                );

            }

        });

}


// ======================================================
// CONFIGURAR MATERIAIS
// ======================================================

function configurarMateriais(elemento, bloco) {

    const materiais =
        elemento.querySelectorAll(".material-editor");


    materiais.forEach(function(materialElemento) {

        const indice =
            Number(materialElemento.dataset.material);


        const material =
            bloco.materiais[indice];


        if (!material) {
            return;
        }


        // Nome

        const nome =
            materialElemento.querySelector(
                ".material-nome"
            );

        if (nome) {

            nome.addEventListener(
                "input",
                function() {

                    material.nome =
                        this.value;

                }
            );

        }


        // Descrição

        const descricao =
            materialElemento.querySelector(
                ".material-descricao"
            );

        if (descricao) {

            descricao.addEventListener(
                "input",
                function() {

                    material.descricao =
                        this.value;

                }
            );

        }


        // Selecionar imagem existente

        const selecionarImagem =
            materialElemento.querySelector(
                ".selecionar-imagem-material"
            );

        if (selecionarImagem) {

            selecionarImagem.addEventListener(
                "click",
                function() {

                    abrirSeletorImagem(
                        bloco,
                        indice
                    );

                }
            );

        }


        // Remover material

        const remover =
            materialElemento.querySelector(
                ".botao-remover-material"
            );

        if (remover) {

            remover.addEventListener(
                "click",
                function() {

                    bloco.materiais.splice(
                        indice,
                        1
                    );

                    atualizarListaBlocos();

                }
            );

        }

    });

}


// ======================================================
// MODAL
// ======================================================

function abrirConfirmacao() {

    if (!validarProjeto()) {
        return;
    }


    const modal =
        document.getElementById(
            "modalConfirmacao"
        );

    const resumo =
        document.getElementById(
            "resumoPublicacao"
        );


    if (!modal) {
        return;
    }


    if (resumo) {

        resumo.innerHTML = `
            <strong>${escapeHTML(projeto.titulo)}</strong>
            <br><br>

            Arquivo:
            projetos/${escapeHTML(projeto.slug)}.html

            <br>

            Blocos:
            ${blocos.length}
        `;

    }


    modal.hidden = false;
    modal.style.display = "flex";

}


function fecharConfirmacao() {

    const modal =
        document.getElementById(
            "modalConfirmacao"
        );

    if (!modal) {
        return;
    }

    modal.hidden = true;
    modal.style.display = "none";

}


// ======================================================
// VALIDAÇÃO
// ======================================================

function validarProjeto() {

    projeto.titulo =
        document.getElementById(
            "tituloProjeto"
        ).value.trim();


    projeto.slug =
        document.getElementById(
            "slugProjeto"
        ).value.trim();


    projeto.descricao =
        document.getElementById(
            "descricaoProjeto"
        ).value.trim();


    if (!projeto.titulo) {

        alert(
            "Digite o título do projeto."
        );

        return false;

    }


    if (!projeto.slug) {

        alert(
            "Digite o nome do arquivo."
        );

        return false;

    }


    if (!/^[a-z0-9-]+$/.test(projeto.slug)) {

        alert(
            "O nome do arquivo deve conter apenas letras minúsculas, números e hífens."
        );

        return false;

    }


    if (!projeto.bannerFile) {

        alert(
            "Escolha uma imagem para o banner."
        );

        return false;

    }


    if (blocos.length === 0) {

        alert(
            "Adicione pelo menos um bloco ao projeto."
        );

        return false;

    }


    return true;

}


// ======================================================
// PUBLICAR
// ======================================================

async function publicarProjeto() {

    fecharConfirmacao();


    try {

        mostrarStatus(
            "Publicando projeto...",
            "info"
        );


        if (!validarProjeto()) {
            return;
        }


        const caminhoProjeto =
            `projetos/${projeto.slug}.html`;


        mostrarStatus(
            "Verificando projeto...",
            "info"
        );


        if (
            await GitHubAPI.arquivoExiste(
                caminhoProjeto
            )
        ) {

            mostrarStatus(
                "Já existe um projeto com esse nome.",
                "erro"
            );

            return;

        }


        mostrarStatus(
            "Gerando página...",
            "info"
        );


        const html =
            await gerarProjetoHTML(
                projeto,
                blocos
            );


        mostrarStatus(
            "Enviando arquivos...",
            "info"
        );


        // Banner

        const caminhoBanner =
            `imagens/projetos/${projeto.slug}/${projeto.bannerFile.name}`;


        await GitHubAPI.enviarArquivo(
            caminhoBanner,
            await arquivoBase64(
                projeto.bannerFile
            ),
            `Banner do projeto ${projeto.titulo}`
        );


        // Arquivos dos blocos

        for (const bloco of blocos) {

            if (
                bloco.tipo === "imagem" &&
                bloco.arquivo
            ) {

                const caminho =
                    `imagens/projetos/${projeto.slug}/${bloco.arquivo.name}`;

                await GitHubAPI.enviarArquivo(
                    caminho,
                    await arquivoBase64(
                        bloco.arquivo
                    ),
                    `Imagem do projeto ${projeto.titulo}`
                );

            }


            if (
                bloco.tipo === "video" &&
                bloco.arquivo
            ) {

                const caminho =
                    `vídeos/${projeto.slug}/${bloco.arquivo.name}`;

                await GitHubAPI.enviarArquivo(
                    caminho,
                    await arquivoBase64(
                        bloco.arquivo
                    ),
                    `Vídeo do projeto ${projeto.titulo}`
                );

            }


            if (
                bloco.tipo === "codigo" &&
                bloco.conteudo
            ) {

                const nome =
                    bloco.nomeArquivo ||
                    `${projeto.slug}.ino`;

                await GitHubAPI.enviarArquivo(
                    `codigos/${projeto.slug}/${nome}`,
                    textoBase64(
                        bloco.conteudo
                    ),
                    `Código do projeto ${projeto.titulo}`
                );

            }

        }


        // Página HTML

        await GitHubAPI.enviarArquivo(
            caminhoProjeto,
            textoBase64(html),
            `Publicação do projeto ${projeto.titulo}`
        );


        mostrarStatus(
            "Projeto publicado com sucesso! 🚀",
            "sucesso"
        );


        setTimeout(
            limparFormulario,
            2000
        );


    } catch (erro) {

        console.error(erro);

        mostrarStatus(
            "Erro ao publicar: " +
            (erro.message || erro),
            "erro"
        );

    }

}


// ======================================================
// ARQUIVO → BASE64
// ======================================================

function arquivoBase64(arquivo) {

    return new Promise(function (resolve, reject) {

        const reader =
            new FileReader();

        reader.onload = function () {

            const resultado =
                reader.result;

            resolve(
                resultado.split(",")[1]
            );

        };

        reader.onerror =
            reject;

        reader.readAsDataURL(arquivo);

    });

}


// ======================================================
// TEXTO → BASE64
// ======================================================

function textoBase64(texto) {

    return btoa(
        unescape(
            encodeURIComponent(texto)
        )
    );

}


// ======================================================
// STATUS
// ======================================================

function mostrarStatus(mensagem, tipo) {

    const status =
        document.getElementById(
            "statusPublicacao"
        );

    if (!status) {
        return;
    }

    status.textContent = mensagem;

    status.className =
        "status-publicacao " +
        tipo;

}


// ======================================================
// LIMPAR
// ======================================================

function limparFormulario() {

    blocos = [];

    projeto = {
        titulo: "",
        slug: "",
        descricao: "",
        bannerFile: null
    };

    slugAlteradoManualmente = false;


    document.getElementById(
        "tituloProjeto"
    ).value = "";


    document.getElementById(
        "slugProjeto"
    ).value = "";


    document.getElementById(
        "descricaoProjeto"
    ).value = "";


    const banner =
        document.getElementById(
            "bannerProjeto"
        );

    if (banner) {
        banner.value = "";
    }


    const nome =
        document.getElementById(
            "nomeBanner"
        );

    if (nome) {
        nome.textContent =
            "Nenhuma imagem selecionada";
    }


    const preview =
        document.getElementById(
            "previewBanner"
        );

    if (preview) {

        preview.src = "";
        preview.style.display = "none";

    }


    atualizarListaBlocos();

}


// ======================================================
// SAIR
// ======================================================

function sairPainel() {

    GitHubAPI.removerToken();

    sessionStorage.removeItem(
        "roboticaGithubToken"
    );

    window.location.href =
        "index.html";

}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escapeHTML(valor) {

    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

// ======================================================
// SELETOR DE IMAGENS EXISTENTES
// ======================================================

let blocoMaterialSelecionado = null;
let indiceMaterialSelecionado = null;


async function abrirSeletorImagem(bloco, indice) {

    blocoMaterialSelecionado = bloco;
    indiceMaterialSelecionado = indice;


    const modal =
        document.getElementById("modalImagens");

    const lista =
        document.getElementById(
            "listaImagensExistentes"
        );


    if (!modal || !lista) {
        return;
    }


    modal.hidden = false;
    modal.style.display = "flex";


    lista.innerHTML = `
        <p>
            🔄 Carregando imagens do site...
        </p>
    `;


    try {

        const arquivos =
            await GitHubAPI.listarArquivos(
                "imagens"
            );


        const imagens =
            arquivos.filter(function(arquivo) {

                return /\.(jpg|jpeg|png|gif|webp|svg)$/i
                    .test(arquivo.name);

            });


        if (imagens.length === 0) {

            lista.innerHTML = `
                <p>
                    Nenhuma imagem encontrada.
                </p>
            `;

            return;

        }


        lista.innerHTML = imagens.map(
            function(imagem) {

                const caminho =
                    imagem.path;


                return `
                    <div
                        class="imagem-existente"
                        data-caminho="${escapeHTML(caminho)}"
                    >

                        <img
                            src="../${escapeHTML(caminho)}"
                            alt="${escapeHTML(imagem.name)}"
                        >

                        <span
                            class="nome-imagem-existente"
                        >
                            ${escapeHTML(imagem.name)}
                        </span>

                    </div>
                `;

            }
        ).join("");


        lista
            .querySelectorAll(".imagem-existente")
            .forEach(function(item) {

                item.addEventListener(
                    "click",
                    function() {

                        selecionarImagemExistente(
                            this.dataset.caminho
                        );

                    }
                );

            });


    } catch (erro) {

        console.error(erro);

        lista.innerHTML = `
            <p style="color:#b00020;">
                ❌ Não foi possível carregar
                as imagens do site.
            </p>
        `;

    }

}


// ======================================================
// SELECIONAR IMAGEM
// ======================================================

function selecionarImagemExistente(caminho) {

    if (
        !blocoMaterialSelecionado ||
        indiceMaterialSelecionado === null
    ) {
        return;
    }


    const material =
        blocoMaterialSelecionado
            .materiais[
                indiceMaterialSelecionado
            ];


    if (!material) {
        return;
    }


    material.imagem = caminho;


    fecharSeletorImagem();


    atualizarListaBlocos();

}


// ======================================================
// FECHAR SELETOR
// ======================================================

function fecharSeletorImagem() {

    const modal =
        document.getElementById(
            "modalImagens"
        );


    if (!modal) {
        return;
    }


    modal.hidden = true;
    modal.style.display = "none";


    blocoMaterialSelecionado = null;
    indiceMaterialSelecionado = null;

}


// ======================================================
// CONFIGURAR MODAL DE IMAGENS
// ======================================================

function configurarModalImagens() {

    const fechar =
        document.getElementById(
            "fecharModalImagens"
        );


    if (fechar) {

        fechar.addEventListener(
            "click",
            fecharSeletorImagem
        );

    }


    const modal =
        document.getElementById(
            "modalImagens"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            function(event) {

                if (event.target === modal) {

                    fecharSeletorImagem();

                }

            }
        );

    }

}

function sairPainel() {
    GitHubAPI.limparToken();
    window.location.href = "../index.html";
}

/* =========================================================
   PROJETOS PUBLICADOS
   ========================================================= */

async function carregarProjetosPublicados() {

    const lista =
        document.getElementById(
            "listaProjetosPublicados"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML = `
        <div class="projetos-carregando">
            <span>⏳</span>
            <p>Carregando projetos...</p>
        </div>
    `;

    try {

        const arquivos =
            await GitHubAPI.listarPastaGitHub(
                "projetos"
            );

        if (!Array.isArray(arquivos)) {

            lista.innerHTML = `
                <div class="erro-projetos">
                    Não foi possível obter a lista de projetos.
                </div>
            `;

            return;
        }

        const projetos =
            arquivos.filter(function (arquivo) {

                return (
                    arquivo.type === "file" &&
                    arquivo.name.toLowerCase().endsWith(".html")
                );

            });

        if (projetos.length === 0) {

            lista.innerHTML = `
                <div class="projetos-vazio">
                    <span>📂</span>
                    <p>Nenhum projeto publicado ainda.</p>
                </div>
            `;

            return;
        }

        lista.innerHTML = projetos
            .map(function (arquivo) {

                const nome =
                    arquivo.name
                        .replace(/\.html$/i, "")
                        .replace(/-/g, " ");

                const titulo =
                    nome.charAt(0).toUpperCase() +
                    nome.slice(1);

                return `
                    <div
                        class="projeto-publicado"
                        data-caminho="${escaparAtributoAdmin(arquivo.path)}"
                    >

                        <div class="projeto-publicado-info">

                            <p class="projeto-publicado-titulo">
                                ${escaparHTMLAdmin(titulo)}
                            </p>

                            <p class="projeto-publicado-arquivo">
                                ${escaparHTMLAdmin(arquivo.path)}
                            </p>

                        </div>

                        <div class="projeto-publicado-acoes">

                            <button
                                type="button"
                                class="botao-editar-projeto"
                                data-editar="${escaparAtributoAdmin(arquivo.path)}"
                            >
                                ✏️ Editar
                            </button>

                            <button
                                type="button"
                                class="botao-excluir-projeto"
                                data-excluir="${escaparAtributoAdmin(arquivo.path)}"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    </div>
                `;

            })
            .join("");

        configurarAcoesProjetosPublicados();

    } catch (erro) {

        console.error(
            "Erro ao carregar projetos:",
            erro
        );

        lista.innerHTML = `
            <div class="erro-projetos">
                ❌ Não foi possível carregar os projetos publicados.
                <br><br>
                ${escaparHTMLAdmin(erro.message)}
            </div>
        `;

    }

}


/* =========================================================
   AÇÕES DOS PROJETOS PUBLICADOS
   ========================================================= */

function configurarAcoesProjetosPublicados() {

    const botoesEditar =
        document.querySelectorAll(
            "[data-editar]"
        );

    botoesEditar.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const caminho =
                    this.dataset.editar;

                iniciarEdicaoProjeto(
                    caminho
                );

            }
        );

    });


    const botoesExcluir =
        document.querySelectorAll(
            "[data-excluir]"
        );

    botoesExcluir.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const caminho =
                    this.dataset.excluir;

                excluirProjetoPublicado(
                    caminho
                );

            }
        );

    });

}


/* =========================================================
   PREPARAR EDIÇÃO
   ========================================================= */

async function iniciarEdicaoProjeto(caminho) {

    if (!caminho) return;

    try {

        mostrarStatus(
            "Carregando projeto para edição...",
            "sucesso"
        );

        const arquivo =
            await GitHubAPI.lerArquivo(caminho);

        if (!arquivo || !arquivo.content) {
            throw new Error(
                "Não foi possível obter o conteúdo do projeto."
            );
        }

        const html =
            decodificarBase64GitHub(arquivo.content);

        carregarProjetoDoHTML(
            html,
            caminho
        );

        mostrarStatus(
            "Projeto carregado. Você pode editar as informações e publicar novamente.",
            "sucesso"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (erro) {

        console.error(erro);

        mostrarStatus(
            "Erro ao carregar projeto: " + erro.message,
            "erro"
        );
    }
}

function carregarProjetoDoHTML(html, caminho) {

    const parser = new DOMParser();

    const documento =
        parser.parseFromString(
            html,
            "text/html"
        );

    /*
     * --------------------------------------------------
     * TÍTULO
     * --------------------------------------------------
     */

    const titulo =
        documento.querySelector("title");

    projeto.titulo =
        titulo
            ? titulo.textContent.trim()
            : "";


    /*
     * --------------------------------------------------
     * SLUG
     * --------------------------------------------------
     */

    const nomeArquivo =
        caminho
            .split("/")
            .pop()
            .replace(/\.html$/i, "");

    projeto.slug =
        nomeArquivo;


    /*
     * --------------------------------------------------
     * DESCRIÇÃO
     * --------------------------------------------------
     */

    const bannerTexto =
        documento.querySelector(
            ".banner-texto p"
        );

    projeto.descricao =
        bannerTexto
            ? bannerTexto.textContent.trim()
            : "";


    /*
     * --------------------------------------------------
     * BANNER
     * --------------------------------------------------
     */

    projeto.bannerFile = null;

    const imagemBanner =
        documento.querySelector(
            ".banner img"
        );

    projeto.bannerExistente =
        imagemBanner
            ? obterCaminhoImagem(
                imagemBanner.getAttribute("src")
            )
            : "";


    /*
     * --------------------------------------------------
     * BLOCOS
     * --------------------------------------------------
     */

    blocos = [];

    const secoes =
        documento.querySelectorAll(
            "main > section"
        );

    secoes.forEach(function(secao) {

        const bloco =
            identificarBlocoHTML(secao);

        if (bloco) {
            blocos.push(bloco);
        }

    });


    /*
     * --------------------------------------------------
     * PREENCHER CAMPOS
     * --------------------------------------------------
     */

    const campoTitulo =
        document.getElementById(
            "tituloProjeto"
        );

    const campoSlug =
        document.getElementById(
            "slugProjeto"
        );

    const campoDescricao =
        document.getElementById(
            "descricaoProjeto"
        );


    if (campoTitulo) {
        campoTitulo.value =
            projeto.titulo;
    }

    if (campoSlug) {
        campoSlug.value =
            projeto.slug;
    }

    if (campoDescricao) {
        campoDescricao.value =
            projeto.descricao;
    }


    /*
     * --------------------------------------------------
     * MOSTRAR BANNER EXISTENTE
     * --------------------------------------------------
     */

    mostrarBannerExistente(
        projeto.bannerExistente
    );


    /*
     * --------------------------------------------------
     * ATUALIZAR EDITOR
     * --------------------------------------------------
     */

    atualizarListaBlocos();

}


/* =========================================================
   EXCLUIR PROJETO
   ========================================================= */

async function excluirProjetoPublicado(caminho) {

    if (!caminho) {
        return;
    }

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este projeto?\n\n" +
            caminho +
            "\n\n" +
            "Essa ação excluirá a página HTML do projeto."
        );

    if (!confirmar) {
        return;
    }

    try {

        mostrarStatus(
            "Excluindo projeto...",
            "info"
        );

        await GitHubAPI.excluirArquivoGitHub({
            caminho: caminho,
            mensagem:
                `Exclusão de projeto: ${caminho}`
        });

        mostrarStatus(
            "Projeto excluído com sucesso.",
            "sucesso"
        );

        await carregarProjetosPublicados();

    } catch (erro) {

        console.error(
            "Erro ao excluir projeto:",
            erro
        );

        mostrarStatus(
            "Erro ao excluir projeto: " +
            erro.message,
            "erro"
        );

    }

}


/* =========================================================
   ESCAPE HTML DO ADMIN
   ========================================================= */

function escaparHTMLAdmin(texto) {

    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escaparAtributoAdmin(texto) {

    return escaparHTMLAdmin(texto);

}

function obterCaminhoImagem(src) {

    if (!src) {
        return "";
    }

    return src
        .replace(/^\.\.\//, "")
        .replace(/^\//, "");

}

function mostrarBannerExistente(caminho) {

    const preview =
        document.getElementById(
            "previewBanner"
        );

    const nome =
        document.getElementById(
            "nomeBanner"
        );

    if (!preview) return;

    if (!caminho) {

        preview.innerHTML = "";

        preview.style.display =
            "none";

        if (nome) {
            nome.textContent =
                "Nenhuma imagem selecionada";
        }

        return;
    }


    preview.innerHTML = `
        <img
            src="../${escaparHTMLAdmin(caminho)}"
            alt="Banner atual"
            style="
                max-width:100%;
                max-height:300px;
                border-radius:12px;
                display:block;
                margin:auto;
            "
        >
    `;

    preview.style.display =
        "block";

    if (nome) {

        nome.textContent =
            "Banner atual: " + caminho;

    }

}

function identificarBlocoHTML(secao) {

    if (!secao) {
        return null;
    }

    const id =
        Date.now() +
        Math.random();


    /*
     * ================================================
     * TEXTO
     * ================================================
     */

    const areaTexto =
        secao.querySelector(
            ".texto-formatado"
        );

    if (areaTexto) {

        const titulo =
            secao.querySelector(
                "h2.titulo"
            );

        return {

            id: id,

            tipo: "texto",

            titulo:
                titulo
                    ? titulo.textContent.trim()
                    : "",

            conteudo:
                areaTexto.innerHTML,

            legenda: "",
            alt: "",
            arquivo: null,
            arquivos: [],
            nomeArquivo: "",
            url: "",
            textoLink: "",
            materiais: []

        };

    }


    /*
     * ================================================
     * CÓDIGO
     * ================================================
     */

    const codigo =
        secao.querySelector(
            ".codigo"
        );

    if (codigo) {

        const titulo =
            codigo.querySelector(
                "h3"
            );

        const codigoElemento =
            codigo.querySelector(
                "pre code"
            );

        const linkDownload =
            codigo.querySelector(
                "a[download]"
            );

        let nomeArquivo = "";

        if (linkDownload) {

            const href =
                linkDownload.getAttribute(
                    "href"
                );

            if (href) {

                nomeArquivo =
                    href
                        .split("/")
                        .pop();

            }

        }

        return {

            id: id,

            tipo: "codigo",

            titulo:
                titulo
                    ? titulo.textContent.trim()
                    : "",

            conteudo:
                codigoElemento
                    ? codigoElemento.textContent
                    : "",

            nomeArquivo:
                nomeArquivo,

            legenda: "",
            alt: "",
            arquivo: null,
            arquivos: [],
            url: "",
            textoLink: "",
            materiais: []

        };

    }


    /*
     * ================================================
     * VÍDEO
     * ================================================
     */

    const video =
        secao.querySelector(
            ".video video"
        );

    if (video) {

        const titulo =
            secao.querySelector(
                "h2.titulo"
            );

        const fonte =
            video.querySelector(
                "source"
            );

        const legenda =
            secao.querySelector(
                ".video p"
            );

        return {

            id: id,

            tipo: "video",

            titulo:
                titulo
                    ? titulo.textContent.trim()
                    : "",

            conteudo: "",

            legenda:
                legenda
                    ? legenda.textContent.trim()
                    : "",

            arquivo: null,

            arquivoExistente:
                fonte
                    ? obterCaminhoImagem(
                        fonte.getAttribute("src")
                    )
                    : "",

            arquivos: [],

            alt: "",
            nomeArquivo: "",
            url: "",
            textoLink: "",
            materiais: []

        };

    }


    /*
     * ================================================
     * TINKERCAD
     * ================================================
     */

    const tinkercad =
        secao.querySelector(
            ".tinkercad"
        );

    if (tinkercad) {

        const titulo =
            secao.querySelector(
                "h2.titulo"
            );

        const link =
            tinkercad.querySelector(
                "a"
            );

        const imagem =
            tinkercad.querySelector(
                "img"
            );

        const legenda =
            tinkercad.querySelector(
                "p"
            );

        return {

            id: id,

            tipo: "tinkercad",

            titulo:
                titulo
                    ? titulo.textContent.trim()
                    : "",

            url:
                link
                    ? link.getAttribute("href")
                    : "",

            textoLink:
                link
                    ? link.textContent.trim()
                    : "Abrir no Tinkercad",

            legenda:
                legenda
                    ? legenda.textContent.trim()
                    : "",

            imagem: null,

            imagemExistente:
                imagem
                    ? obterCaminhoImagem(
                        imagem.getAttribute("src")
                    )
                    : "",

            conteudo: "",
            arquivo: null,
            arquivos: [],
            alt: "",
            nomeArquivo: "",
            materiais: []

        };

    }


    /*
     * ================================================
     * LINK
     * ================================================
     */

    const areaLink =
        secao.querySelector(
            ".link"
        );

    if (areaLink) {

        const link =
            areaLink.querySelector(
                "a"
            );

        const titulo =
            secao.querySelector(
                "h2.titulo"
            );

        return {

            id: id,

            tipo: "link",

            titulo:
                titulo
                    ? titulo.textContent.trim()
                    : "",

            url:
                link
                    ? link.getAttribute("href")
                    : "",

            textoLink:
                link
                    ? link.textContent.trim()
                    : "",

            conteudo: "",
            legenda: "",
            alt: "",
            arquivo: null,
            arquivos: [],
            nomeArquivo: "",
            materiais: []

        };

    }


    return null;

}