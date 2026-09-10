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
    atualizarListaBlocos();

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
                arquivo: null
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

                <textarea
                    class="campo-conteudo"
                    rows="7"
                    placeholder="Digite o conteúdo..."
                >${escapeHTML(bloco.conteudo)}</textarea>

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


    return bloco.materiais.map(function (material, indice) {

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
                    >

                </div>

                <div class="campo">

                    <label>Imagem do material</label>

                    <input
                        type="file"
                        class="material-arquivo"
                        accept="image/*"
                    >

                    <small>
                        ${
                            material.arquivo
                            ? escapeHTML(material.arquivo.name)
                            : "Nenhuma imagem selecionada"
                        }
                    </small>

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
                elemento.querySelector(".campo-conteudo");

            if (conteudo) {

                conteudo.addEventListener("input", function () {

                    bloco.conteudo = this.value;

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
        elemento.querySelectorAll(
            ".material-editor"
        );


    materiais.forEach(function (materialElemento) {

        const indice =
            Number(
                materialElemento.dataset.material
            );


        const material =
            bloco.materiais[indice];

        if (!material) {
            return;
        }


        const nome =
            materialElemento.querySelector(
                ".material-nome"
            );

        if (nome) {

            nome.addEventListener(
                "input",
                function () {

                    material.nome =
                        this.value;

                }
            );

        }


        const descricao =
            materialElemento.querySelector(
                ".material-descricao"
            );

        if (descricao) {

            descricao.addEventListener(
                "input",
                function () {

                    material.descricao =
                        this.value;

                }
            );

        }


        const arquivo =
            materialElemento.querySelector(
                ".material-arquivo"
            );

        if (arquivo) {

            arquivo.addEventListener(
                "change",
                function () {

                    if (this.files[0]) {

                        material.arquivo =
                            this.files[0];

                    }

                }
            );

        }


        const remover =
            materialElemento.querySelector(
                ".botao-remover-material"
            );

        if (remover) {

            remover.addEventListener(
                "click",
                function () {

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