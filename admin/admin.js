
/* =========================================================
   PAINEL ADMINISTRATIVO - ROBÓTICA EDUCACIONAL
   ========================================================= */

let blocos = [];

let projeto = {
    titulo: "",
    slug: "",
    descricao: "",
    bannerFile: null
};

let slugAlteradoManualmente = false;


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", iniciarPainel);

function iniciarPainel() {

    // Recupera o token que veio da tela de login
    const tokenSessao = sessionStorage.getItem("roboticaGithubToken");

    if (!tokenSessao) {
        window.location.href = "index.html";
        return;
    }

    GitHubAPI.definirToken(tokenSessao);

    // Remove imediatamente da sessão.
    // O token continuará somente na memória desta página.
    sessionStorage.removeItem("roboticaGithubToken");


    configurarCampos();
    configurarBotoes();
    atualizarListaBlocos();
}


/* =========================================================
   CAMPOS PRINCIPAIS
   ========================================================= */

function configurarCampos() {

    const titulo = document.getElementById("tituloProjeto");
    const slug = document.getElementById("slugProjeto");
    const descricao = document.getElementById("descricaoProjeto");
    const banner = document.getElementById("bannerProjeto");

    if (titulo) {
        titulo.addEventListener("input", () => {

            projeto.titulo = titulo.value;

            if (!slugAlteradoManualmente) {
                slug.value = gerarSlug(titulo.value);
                projeto.slug = slug.value;
            }
        });
    }

    if (slug) {
        slug.addEventListener("input", () => {

            slugAlteradoManualmente = true;

            slug.value = gerarSlug(slug.value);
            projeto.slug = slug.value;
        });
    }

    if (descricao) {
        descricao.addEventListener("input", () => {
            projeto.descricao = descricao.value;
        });
    }

    if (banner) {
        banner.addEventListener("change", () => {

            const arquivo = banner.files[0];

            if (!arquivo) {
                projeto.bannerFile = null;
                return;
            }

            projeto.bannerFile = arquivo;

            mostrarPreviewBanner(arquivo);
        });
    }
}


/* =========================================================
   SLUG
   ========================================================= */

function gerarSlug(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}


/* =========================================================
   PREVIEW DO BANNER
   ========================================================= */

function mostrarPreviewBanner(arquivo) {

    const preview = document.getElementById("previewBanner");

    if (!preview) return;

    const url = URL.createObjectURL(arquivo);

    preview.src = url;
    preview.style.display = "block";

    preview.onload = () => {
        URL.revokeObjectURL(url);
    };
}


/* =========================================================
   BOTÕES
   ========================================================= */

/* =========================================================
   BOTÕES
   ========================================================= */

function configurarBotoes() {

    /* =====================================================
       BOTÕES DE ADICIONAR BLOCOS
       ===================================================== */

    const botoesBlocos =
        document.querySelectorAll("[data-bloco]");

    botoesBlocos.forEach(botao => {

        botao.addEventListener("click", () => {

            const tipo = botao.dataset.bloco;

            adicionarBloco(tipo);

        });

    });


    /* =====================================================
       BOTÃO PUBLICAR
       ===================================================== */

    const btnPublicar =
        document.getElementById("btnPublicar");

    if (btnPublicar) {

        btnPublicar.addEventListener(
            "click",
            abrirConfirmacao
        );

    }


    /* =====================================================
       MODAL - CANCELAR
       ===================================================== */

    const btnCancelar =
        document.getElementById("cancelarPublicacao");

    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            fecharConfirmacao
        );

    }


    /* =====================================================
       MODAL - CONFIRMAR
       ===================================================== */

    const btnConfirmar =
        document.getElementById("confirmarPublicacao");

    if (btnConfirmar) {

        btnConfirmar.addEventListener(
            "click",
            publicarProjeto
        );

    }


    /* =====================================================
       MODAL - FECHAR NO X
       ===================================================== */

    const fecharModal =
        document.getElementById("fecharModal");

    if (fecharModal) {

        fecharModal.addEventListener(
            "click",
            fecharConfirmacao
        );

    }


    /* =====================================================
       BOTÃO SAIR
       ===================================================== */

    const btnSair =
        document.getElementById("btnSair");

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            sairPainel
        );

    }
}

/* =========================================================
   ADICIONAR BLOCO
   ========================================================= */

function adicionarBloco(tipo) {

    let bloco;

    switch (tipo) {

        case "texto":

            bloco = {
                tipo: "texto",
                titulo: "",
                conteudo: ""
            };

            break;


        case "imagem":

            bloco = {
                tipo: "imagem",
                titulo: "",
                legenda: "",
                alt: "",
                arquivo: null
            };

            break;


        case "galeria":

            bloco = {
                tipo: "galeria",
                titulo: "",
                arquivos: []
            };

            break;


        case "materiais":

            bloco = {
                tipo: "materiais",
                titulo: "Materiais",
                itens: []
            };

            break;


        case "codigo":

            bloco = {
                tipo: "codigo",
                titulo: "Código Arduino",
                nomeArquivo: "",
                linguagem: "cpp",
                conteudo: ""
            };

            break;


        case "video":

            bloco = {
                tipo: "video",
                titulo: "",
                legenda: "",
                arquivo: null
            };

            break;


        case "link":

            bloco = {
                tipo: "link",
                titulo: "",
                texto: "",
                url: ""
            };

            break;


        case "tinkercad":

            bloco = {
                tipo: "tinkercad",
                titulo: "Simulação no Tinkercad",
                url: "",
                imagem: null,
                legenda: ""
            };

            break;


        default:
            return;
    }

    blocos.push(bloco);

    atualizarListaBlocos();

    // Leva o usuário até o novo bloco
    setTimeout(() => {

        const elementos =
            document.querySelectorAll(".bloco-editor");

        const ultimo = elementos[elementos.length - 1];

        if (ultimo) {
            ultimo.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }, 50);
}


/* =========================================================
   RENDERIZAÇÃO DOS BLOCOS
   ========================================================= */

function atualizarListaBlocos() {

    const lista = document.getElementById("listaBlocos");

    if (!lista) return;

    lista.innerHTML = "";

    if (blocos.length === 0) {

        lista.innerHTML = `
            <div class="blocos-vazio">
                <strong>Nenhum conteúdo adicionado.</strong>
                <p>
                    Use os botões acima para montar o projeto.
                </p>
            </div>
        `;

        return;
    }


    blocos.forEach((bloco, index) => {

        const elemento = document.createElement("div");

        elemento.className = "bloco-editor";
        elemento.dataset.index = index;

        elemento.innerHTML = gerarEditorBloco(bloco, index);

        lista.appendChild(elemento);

        configurarEditorBloco(elemento, bloco, index);
    });
}


/* =========================================================
   EDITOR DE CADA TIPO
   ========================================================= */

function gerarEditorBloco(bloco, index) {

    const cabecalho = `
        <div class="bloco-cabecalho">

            <strong>
                ${numeroBloco(index)} ${nomeTipoBloco(bloco.tipo)}
            </strong>

            <div class="acoes-bloco">

                <button type="button"
                    class="btn-mover-cima"
                    ${index === 0 ? "disabled" : ""}>
                    ↑
                </button>

                <button type="button"
                    class="btn-mover-baixo"
                    ${index === blocos.length - 1 ? "disabled" : ""}>
                    ↓
                </button>

                <button type="button"
                    class="btn-remover-bloco">
                    🗑
                </button>

            </div>

        </div>
    `;


    let corpo = "";


    /* TEXTO */

    if (bloco.tipo === "texto") {

        corpo = `
            <div class="campo">

                <label>Título da seção</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escaparHTML(bloco.titulo)}"
                    placeholder="Ex.: Como funciona"
                >

            </div>

            <div class="campo">

                <label>Texto</label>

                <textarea
                    class="campo-conteudo"
                    rows="8"
                    placeholder="Digite o conteúdo desta seção..."
                >${escaparHTML(bloco.conteudo)}</textarea>

            </div>
        `;
    }


    /* IMAGEM */

    if (bloco.tipo === "imagem") {

        corpo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escaparHTML(bloco.titulo)}"
                    placeholder="Ex.: Montagem do circuito"
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
                    ${bloco.arquivo ? bloco.arquivo.name : "Nenhuma imagem selecionada"}
                </small>

            </div>

            <div class="campo">

                <label>Texto alternativo</label>

                <input
                    type="text"
                    class="campo-alt"
                    value="${escaparHTML(bloco.alt)}"
                    placeholder="Descreva a imagem para acessibilidade"
                >

            </div>

            <div class="campo">

                <label>Legenda</label>

                <input
                    type="text"
                    class="campo-legenda"
                    value="${escaparHTML(bloco.legenda)}"
                    placeholder="Opcional"
                >

            </div>
        `;
    }


    /* GALERIA */

    if (bloco.tipo === "galeria") {

        corpo = `
            <div class="campo">

                <label>Título da galeria</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escaparHTML(bloco.titulo)}"
                    placeholder="Ex.: Fotos do projeto"
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

                <small class="nome-arquivo">
                    ${bloco.arquivos.length > 0
                        ? `${bloco.arquivos.length} imagem(ns) selecionada(s)`
                        : "Nenhuma imagem selecionada"}
                </small>

            </div>
        `;
    }


    /* MATERIAIS */

    if (bloco.tipo === "materiais") {

        corpo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escaparHTML(bloco.titulo)}"
                    placeholder="Materiais utilizados"
                >

            </div>

            <div class="lista-materiais">
                ${gerarMateriais(bloco)}
            </div>

            <button type="button" class="botao-secundario btn-adicionar-material">
                + Adicionar material
            </button>
        `;
    }


    /* CÓDIGO */

    if (bloco.tipo === "codigo") {

        corpo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escaparHTML(bloco.titulo)}"
                    placeholder="Ex.: Código principal"
                >

            </div>

            <div class="campo">

                <label>Nome do arquivo .ino</label>

                <input
                    type="text"
                    class="campo-nome-arquivo"
                    value="${escaparHTML(bloco.nomeArquivo)}"
                    placeholder="Ex.: relogio-visual.ino"
                >

            </div>

            <div class="campo">

                <label>Código Arduino</label>

                <textarea
                    class="campo-codigo"
                    rows="15"
                    spellcheck="false"
                    placeholder="// Cole aqui o código do Arduino..."
                >${escaparHTML(bloco.conteudo)}</textarea>

            </div>

            <div class="campo">

                <label>Ou carregar um arquivo .ino</label>

                <input
                    type="file"
                    class="campo-arquivo"
                    accept=".ino,.cpp,.h,text/plain"
                >

            </div>
        `;
    }


    /* VÍDEO */

    if (bloco.tipo === "video") {

        corpo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escaparHTML(bloco.titulo)}"
                    placeholder="Ex.: Funcionamento do projeto"
                >

            </div>

            <div class="campo">

                <label>Vídeo</label>

                <input
                    type="file"
                    class="campo-arquivo"
                    accept="video/*"
                >

                <small class="nome-arquivo">
                    ${bloco.arquivo ? bloco.arquivo.name : "Nenhum vídeo selecionado"}
                </small>

            </div>

            <div class="campo">

                <label>Legenda</label>

                <input
                    type="text"
                    class="campo-legenda"
                    value="${escaparHTML(bloco.legenda)}"
                    placeholder="Opcional"
                >

            </div>
        `;
    }


    /* LINK */

    if (bloco.tipo === "link") {

        corpo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escaparHTML(bloco.titulo)}"
                    placeholder="Ex.: Site oficial"
                >

            </div>

            <div class="campo">

                <label>Texto do botão</label>

                <input
                    type="text"
                    class="campo-texto-link"
                    value="${escaparHTML(bloco.texto)}"
                    placeholder="Acessar site"
                >

            </div>

            <div class="campo">

                <label>Endereço do link</label>

                <input
                    type="url"
                    class="campo-url"
                    value="${escaparHTML(bloco.url)}"
                    placeholder="https://..."
                >

            </div>
        `;
    }


    /* TINKERCAD */

    if (bloco.tipo === "tinkercad") {

        corpo = `
            <div class="campo">

                <label>Título</label>

                <input
                    type="text"
                    class="campo-titulo"
                    value="${escaparHTML(bloco.titulo)}"
                    placeholder="Simulação no Tinkercad"
                >

            </div>

            <div class="campo">

                <label>Link do Tinkercad</label>

                <input
                    type="url"
                    class="campo-url"
                    value="${escaparHTML(bloco.url)}"
                    placeholder="https://www.tinkercad.com/..."
                >

            </div>

            <div class="campo">

                <label>Imagem da simulação</label>

                <input
                    type="file"
                    class="campo-arquivo"
                    accept="image/*"
                >

                <small class="nome-arquivo">
                    ${bloco.imagem ? bloco.imagem.name : "Nenhuma imagem selecionada"}
                </small>

            </div>

            <div class="campo">

                <label>Legenda</label>

                <input
                    type="text"
                    class="campo-legenda"
                    value="${escaparHTML(bloco.legenda)}"
                    placeholder="Opcional"
                >

            </div>
        `;
    }


    return `
        ${cabecalho}

        <div class="bloco-corpo">

            ${corpo}

        </div>
    `;
}


/* =========================================================
   MATERIAIS
   ========================================================= */

function gerarMateriais(bloco) {

    if (bloco.itens.length === 0) {

        return `
            <div class="material-vazio">
                Nenhum material adicionado.
            </div>
        `;
    }


    return bloco.itens.map((material, index) => {

        return `
            <div class="material-editor">

                <div class="material-topo">

                    <strong>
                        Material ${index + 1}
                    </strong>

                    <button
                        type="button"
                        class="btn-remover-material"
                        data-material="${index}">
                        🗑
                    </button>

                </div>

                <div class="campo">

                    <label>Nome</label>

                    <input
                        type="text"
                        class="material-nome"
                        data-material="${index}"
                        value="${escaparHTML(material.nome)}"
                        placeholder="Ex.: Arduino Uno R3"
                    >

                </div>

                <div class="campo">

                    <label>Descrição</label>

                    <textarea
                        class="material-descricao"
                        data-material="${index}"
                        rows="3"
                        placeholder="Explique qual componente é utilizado..."
                    >${escaparHTML(material.descricao)}</textarea>

                </div>

                <div class="campo">

                    <label>Imagem ilustrativa</label>

                    <input
                        type="file"
                        class="material-arquivo"
                        data-material="${index}"
                        accept="image/*"
                    >

                    <small>
                        ${material.arquivo
                            ? material.arquivo.name
                            : "Nenhuma imagem selecionada"}
                    </small>

                </div>

                <div class="campo">

                    <label>Texto alternativo</label>

                    <input
                        type="text"
                        class="material-alt"
                        data-material="${index}"
                        value="${escaparHTML(material.alt)}"
                        placeholder="Descrição da imagem"
                    >

                </div>

            </div>
        `;

    }).join("");
}


/* =========================================================
   CONFIGURAR UM BLOCO
   ========================================================= */

function configurarEditorBloco(elemento, bloco, index) {

    const titulo = elemento.querySelector(".campo-titulo");

    if (titulo) {

        titulo.addEventListener("input", () => {
            bloco.titulo = titulo.value;
        });
    }


    const conteudo = elemento.querySelector(".campo-conteudo");

    if (conteudo) {

        conteudo.addEventListener("input", () => {
            bloco.conteudo = conteudo.value;
        });
    }


    const alt = elemento.querySelector(".campo-alt");

    if (alt) {

        alt.addEventListener("input", () => {
            bloco.alt = alt.value;
        });
    }


    const legenda = elemento.querySelector(".campo-legenda");

    if (legenda) {

        legenda.addEventListener("input", () => {
            bloco.legenda = legenda.value;
        });
    }


    const arquivo = elemento.querySelector(".campo-arquivo");

    if (arquivo) {

        arquivo.addEventListener("change", () => {

            if (bloco.tipo === "galeria") {

                bloco.arquivos = Array.from(arquivo.files);

            } else if (bloco.tipo === "codigo") {

                if (arquivo.files[0]) {

                    const file = arquivo.files[0];

                    bloco.nomeArquivo = file.name;

                    file.text().then(texto => {

                        bloco.conteudo = texto;

                        atualizarListaBlocos();
                    });
                }

            } else if (bloco.tipo === "tinkercad") {

                bloco.imagem = arquivo.files[0] || null;

            } else {

                bloco.arquivo = arquivo.files[0] || null;
            }

            atualizarNomeArquivo(elemento, bloco);
        });
    }


    const nomeArquivo = elemento.querySelector(".campo-nome-arquivo");

    if (nomeArquivo) {

        nomeArquivo.addEventListener("input", () => {
            bloco.nomeArquivo = nomeArquivo.value;
        });
    }


    const codigo = elemento.querySelector(".campo-codigo");

    if (codigo) {

        codigo.addEventListener("input", () => {
            bloco.conteudo = codigo.value;
        });
    }


    const url = elemento.querySelector(".campo-url");

    if (url) {

        url.addEventListener("input", () => {
            bloco.url = url.value;
        });
    }


    const textoLink = elemento.querySelector(".campo-texto-link");

    if (textoLink) {

        textoLink.addEventListener("input", () => {
            bloco.texto = textoLink.value;
        });
    }


    /* MOVER PARA CIMA */

    const cima = elemento.querySelector(".btn-mover-cima");

    if (cima) {

        cima.addEventListener("click", () => {

            if (index === 0) return;

            const temporario = blocos[index - 1];

            blocos[index - 1] = blocos[index];
            blocos[index] = temporario;

            atualizarListaBlocos();
        });
    }


    /* MOVER PARA BAIXO */

    const baixo = elemento.querySelector(".btn-mover-baixo");

    if (baixo) {

        baixo.addEventListener("click", () => {

            if (index >= blocos.length - 1) return;

            const temporario = blocos[index + 1];

            blocos[index + 1] = blocos[index];
            blocos[index] = temporario;

            atualizarListaBlocos();
        });
    }


    /* REMOVER */

    const remover = elemento.querySelector(".btn-remover-bloco");

    if (remover) {

        remover.addEventListener("click", () => {

            const confirmar =
                confirm("Remover este bloco do projeto?");

            if (!confirmar) return;

            blocos.splice(index, 1);

            atualizarListaBlocos();
        });
    }


    /* MATERIAIS */

    const adicionarMaterial =
        elemento.querySelector(".btn-adicionar-material");

    if (adicionarMaterial) {

        adicionarMaterial.addEventListener("click", () => {

            bloco.itens.push({
                nome: "",
                descricao: "",
                arquivo: null,
                alt: ""
            });

            atualizarListaBlocos();
        });
    }


    elemento.querySelectorAll(".material-nome")
        .forEach(input => {

            input.addEventListener("input", () => {

                const i = Number(input.dataset.material);

                bloco.itens[i].nome = input.value;
            });
        });


    elemento.querySelectorAll(".material-descricao")
        .forEach(input => {

            input.addEventListener("input", () => {

                const i = Number(input.dataset.material);

                bloco.itens[i].descricao = input.value;
            });
        });


    elemento.querySelectorAll(".material-alt")
        .forEach(input => {

            input.addEventListener("input", () => {

                const i = Number(input.dataset.material);

                bloco.itens[i].alt = input.value;
            });
        });


    elemento.querySelectorAll(".material-arquivo")
        .forEach(input => {

            input.addEventListener("change", () => {

                const i = Number(input.dataset.material);

                bloco.itens[i].arquivo =
                    input.files[0] || null;

                atualizarListaBlocos();
            });
        });


    elemento.querySelectorAll(".btn-remover-material")
        .forEach(botao => {

            botao.addEventListener("click", () => {

                const i = Number(botao.dataset.material);

                bloco.itens.splice(i, 1);

                atualizarListaBlocos();
            });
        });
}


/* =========================================================
   ATUALIZAR NOME DO ARQUIVO
   ========================================================= */

function atualizarNomeArquivo(elemento, bloco) {

    const campo = elemento.querySelector(".nome-arquivo");

    if (!campo) return;


    if (bloco.tipo === "galeria") {

        campo.textContent =
            bloco.arquivos.length > 0
                ? `${bloco.arquivos.length} imagem(ns) selecionada(s)`
                : "Nenhuma imagem selecionada";

        return;
    }


    if (bloco.tipo === "tinkercad") {

        campo.textContent =
            bloco.imagem
                ? bloco.imagem.name
                : "Nenhuma imagem selecionada";

        return;
    }


    campo.textContent =
        bloco.arquivo
            ? bloco.arquivo.name
            : "Nenhum arquivo selecionado";
}


/* =========================================================
   CONFIRMAÇÃO
   ========================================================= */

function abrirConfirmacao() {

    const erro = validarProjeto();

    if (erro) {

        mostrarStatus(erro, "erro");

        return;
    }


    const modal =
        document.getElementById("modalConfirmacao");

    if (!modal) {

        publicarProjeto();

        return;
    }


    const resumo =
        document.getElementById("resumoPublicacao");

    if (resumo) {

        resumo.innerHTML = `
            <strong>${escaparHTML(projeto.titulo)}</strong>

            <p>
                ${blocos.length}
                bloco(s) de conteúdo serão publicados.
            </p>

            <p>
                A publicação criará a página do projeto,
                os arquivos de mídia e os códigos .ino.
            </p>
        `;
    }


    modal.style.display = "flex";
}


function fecharConfirmacao() {

    const modal =
        document.getElementById("modalConfirmacao");

    if (modal) {
        modal.style.display = "none";
    }
}


/* =========================================================
   VALIDAÇÃO
   ========================================================= */

function validarProjeto() {

    projeto.titulo =
        document.getElementById("tituloProjeto")?.value.trim() || "";

    projeto.slug =
        document.getElementById("slugProjeto")?.value.trim() || "";

    projeto.descricao =
        document.getElementById("descricaoProjeto")?.value.trim() || "";


    if (!projeto.titulo) {
        return "Digite o título do projeto.";
    }


    if (!projeto.slug) {
        return "Digite um endereço para o projeto.";
    }


    if (!/^[a-z0-9-]+$/.test(projeto.slug)) {

        return "O endereço do projeto deve conter apenas letras minúsculas, números e hífens.";
    }


    if (!projeto.bannerFile) {

        return "Escolha uma imagem de banner para o projeto.";
    }


    if (blocos.length === 0) {

        return "Adicione pelo menos um bloco de conteúdo.";
    }


    for (const bloco of blocos) {

        if (bloco.tipo === "texto" && !bloco.conteudo.trim()) {

            return "Existe uma seção de texto vazia.";
        }


        if (bloco.tipo === "codigo") {

            if (!bloco.conteudo.trim()) {
                return "Existe um bloco de código vazio.";
            }

            if (!bloco.nomeArquivo.trim()) {
                return "Informe o nome do arquivo .ino.";
            }

            if (!bloco.nomeArquivo.toLowerCase().endsWith(".ino")) {
                bloco.nomeArquivo += ".ino";
            }
        }


        if (bloco.tipo === "imagem" && !bloco.arquivo) {

            return "Existe um bloco de imagem sem imagem.";
        }


        if (bloco.tipo === "galeria" && bloco.arquivos.length === 0) {

            return "Existe uma galeria sem imagens.";
        }


        if (bloco.tipo === "video" && !bloco.arquivo) {

            return "Existe um bloco de vídeo sem vídeo.";
        }
    }


    return null;
}


/* =========================================================
   PUBLICAR
   ========================================================= */

async function publicarProjeto() {

    fecharConfirmacao();


    const erro = validarProjeto();

if (erro) {
    mostrarStatus(erro, "erro");
    return;
}


// VERIFICA SE O PROJETO JÁ EXISTE

const caminhoPagina = `projetos/${projeto.slug}.html`;

try {

    if (await GitHubAPI.arquivoExiste(caminhoPagina)) {

        mostrarStatus(
            "Já existe um projeto com esse endereço. Escolha outro slug.",
            "erro"
        );

        return;
    }

} catch (erro) {

    mostrarStatus(
        "Não foi possível verificar se o projeto já existe: " + erro.message,
        "erro"
    );

    return;
}





    const botao =
        document.getElementById("btnPublicar");


    try {

        if (botao) {

            botao.disabled = true;
            botao.textContent = "Publicando...";
        }


        mostrarStatus(
            "Preparando arquivos do projeto...",
            "carregando"
        );


        /*
         * A função gerarProjetoHTML será criada no próximo arquivo:
         * gerador-html.js
         */

        const resultado =
            await gerarProjetoHTML({
                projeto,
                blocos
            });


        mostrarStatus(
            "Enviando arquivos para o GitHub...",
            "carregando"
        );


        /*
         * Primeiro envia os arquivos de mídia.
         */

        for (const arquivo of resultado.arquivos) {

            mostrarStatus(
                `Enviando ${arquivo.caminho}...`,
                "carregando"
            );


            await GitHubAPI.salvarArquivoGitHub({

                caminho: arquivo.caminho,

                conteudo: arquivo.conteudo,

                tipo: arquivo.tipo || "texto",

                mensagem:
                    `Adicionar projeto: ${projeto.titulo}`
            });
        }


        /*
         * Depois envia os códigos .ino.
         */

        for (const codigo of resultado.codigos) {

            mostrarStatus(
                `Enviando código ${codigo.nomeArquivo}...`,
                "carregando"
            );


            await GitHubAPI.salvarArquivoGitHub({

                caminho: codigo.caminho,

                conteudo: codigo.conteudo,

                tipo: "texto",

                mensagem:
                    `Adicionar código: ${codigo.nomeArquivo}`
            });
        }


        /*
         * Página individual do projeto.
         */

        mostrarStatus(
            "Publicando página do projeto...",
            "carregando"
        );


        await GitHubAPI.salvarArquivoGitHub({

            caminho: resultado.pagina.caminho,

            conteudo: resultado.pagina.conteudo,

            tipo: "texto",

            mensagem:
                `Adicionar projeto: ${projeto.titulo}`
        });


        /*
         * Atualização automática do projetos.html.
         */

        mostrarStatus(
            "Atualizando lista de projetos...",
            "carregando"
        );


        const projetosAtual =
            await GitHubAPI.lerArquivo("projetos.html");


        const textoProjetos =
            decodificarBase64GitHub(projetosAtual.content);


        const novoProjetos =
            inserirCardProjeto(
                textoProjetos,
                resultado.card
            );


        await GitHubAPI.salvarArquivoGitHub({

            caminho: "projetos.html",

            conteudo: novoProjetos,

            mensagem:
                `Adicionar projeto à lista: ${projeto.titulo}`
        });


        mostrarStatus(
            "Projeto publicado com sucesso!",
            "sucesso"
        );


        if (botao) {

            botao.textContent = "Projeto publicado ✓";
        }


        /*
         * Limpa o formulário após a publicação.
         */

        setTimeout(() => {

            limparFormulario();

        }, 2500);


    } catch (erro) {

        console.error(erro);

        mostrarStatus(
            "Erro ao publicar: " + erro.message,
            "erro"
        );

    } finally {

        if (botao) {
            botao.disabled = false;
        }
    }
}


/* =========================================================
   INSERIR CARD NO projetos.html
   ========================================================= */

function inserirCardProjeto(html, card) {

    const inicio =
        "<!-- PROJETOS-AUTOMATICOS-INICIO -->";

    const fim =
        "<!-- PROJETOS-AUTOMATICOS-FIM -->";


    if (!html.includes(inicio) || !html.includes(fim)) {

        throw new Error(
            "Não encontrei os marcadores de projetos automáticos no projetos.html."
        );
    }


    const posInicio =
        html.indexOf(inicio) + inicio.length;


    const posFim =
        html.indexOf(fim);


    if (posFim < posInicio) {

        throw new Error(
            "Os marcadores automáticos do projetos.html estão fora de ordem."
        );
    }


    const conteudoAtual =
        html.substring(posInicio, posFim).trim();


    const novoConteudo =
        conteudoAtual
            ? `${conteudoAtual}\n\n${card}`
            : card;


    return (
        html.substring(0, posInicio) +
        "\n" +
        novoConteudo +
        "\n" +
        html.substring(posFim)
    );
}


/* =========================================================
   DECODIFICAR BASE64 DO GITHUB
   ========================================================= */

function decodificarBase64GitHub(conteudo) {

    const binario =
        atob(conteudo.replace(/\n/g, ""));


    const bytes =
        Uint8Array.from(
            binario,
            caractere => caractere.charCodeAt(0)
        );


    return new TextDecoder("utf-8").decode(bytes);
}


/* =========================================================
   STATUS
   ========================================================= */

function mostrarStatus(mensagem, tipo = "") {

    const status =
        document.getElementById("statusPublicacao");

    if (!status) return;


    status.textContent = mensagem;

    status.className =
        "status-publicacao " + tipo;
}


/* =========================================================
   SAIR
   ========================================================= */

function sairPainel() {

    GitHubAPI.limparToken();

    sessionStorage.removeItem("roboticaGithubToken");

    window.location.href = "index.html";
}


/* =========================================================
   LIMPAR FORMULÁRIO
   ========================================================= */

function limparFormulario() {

    projeto = {
        titulo: "",
        slug: "",
        descricao: "",
        bannerFile: null
    };

    blocos = [];

    slugAlteradoManualmente = false;


    const formulario =
        document.querySelector("main");

    if (formulario) {

        formulario
            .querySelectorAll("input, textarea")
            .forEach(campo => {

                if (campo.type === "file") {
                    campo.value = "";
                } else {
                    campo.value = "";
                }
            });
    }


    const preview =
        document.getElementById("previewBanner");

    if (preview) {

        preview.src = "";
        preview.style.display = "none";
    }


    atualizarListaBlocos();
}


/* =========================================================
   FUNÇÕES AUXILIARES
   ========================================================= */

function numeroBloco(index) {

    return `#${index + 1}`;
}


function nomeTipoBloco(tipo) {

    const nomes = {

        texto: "Texto",
        imagem: "Imagem",
        galeria: "Galeria",
        materiais: "Materiais",
        codigo: "Código Arduino",
        video: "Vídeo",
        link: "Link",
        tinkercad: "Tinkercad"
    };

    return nomes[tipo] || "Conteúdo";
}


function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   EXPORTAÇÃO PARA DEBUG
   ========================================================= */

window.AdminProjeto = {

    obterProjeto: () => projeto,

    obterBlocos: () => blocos,

    atualizar: atualizarListaBlocos

};
```
