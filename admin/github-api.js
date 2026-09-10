const GITHUB_CONFIG = {
    owner: "kauaburtuli",
    repo: "Projeto-IFA",
    branch: "main"
};

let githubToken = null;


/* =========================================================
   TOKEN
========================================================= */

function definirToken(token) {
    if (!token || !token.trim()) {
        throw new Error("Informe um token do GitHub.");
    }

    githubToken = token.trim();
}

function limparToken() {
    githubToken = null;
}

function possuiToken() {
    return githubToken !== null;
}


/* =========================================================
   CONFIGURAÇÃO DO REPOSITÓRIO
========================================================= */

function configurarRepositorio(owner, repo, branch = "main") {

    if (!owner || !repo) {
        throw new Error("Informe o usuário e o repositório do GitHub.");
    }

    GITHUB_CONFIG.owner = owner.trim();
    GITHUB_CONFIG.repo = repo.trim();
    GITHUB_CONFIG.branch = branch.trim() || "main";
}

function obterConfiguracaoGitHub() {
    return {
        owner: GITHUB_CONFIG.owner,
        repo: GITHUB_CONFIG.repo,
        branch: GITHUB_CONFIG.branch
    };
}


/* =========================================================
   URLs
========================================================= */

function githubApiUrl(caminho = "") {

    const base =
        `https://api.github.com/repos/` +
        `${encodeURIComponent(GITHUB_CONFIG.owner)}/` +
        `${encodeURIComponent(GITHUB_CONFIG.repo)}`;

    if (!caminho) {
        return base;
    }

    const caminhoCodificado = caminho
        .split("/")
        .map(parte => encodeURIComponent(parte))
        .join("/");

    return `${base}/${caminhoCodificado}`;
}

function githubUsuarioUrl() {
    return "https://api.github.com/user";
}


/* =========================================================
   CABEÇALHOS
========================================================= */

function githubHeaders() {

    const headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    };

    if (githubToken) {
        headers["Authorization"] = `Bearer ${githubToken}`;
    }

    return headers;
}


/* =========================================================
   REQUISIÇÃO
========================================================= */

async function githubRequest(url, options = {}) {

    const resposta = await fetch(url, {
        ...options,

        headers: {
            ...githubHeaders(),
            ...(options.headers || {})
        }
    });

    let dados = null;

    try {
        dados = await resposta.json();
    } catch {
        dados = null;
    }

    if (!resposta.ok) {

        let mensagem =
            dados?.message ||
            `Erro HTTP ${resposta.status}.`;

        if (resposta.status === 401) {
            mensagem =
                "Token do GitHub inválido, expirado ou sem autorização.";
        }

        if (resposta.status === 403) {
            mensagem =
                "O GitHub recusou o acesso. Verifique as permissões do token.";
        }

        if (resposta.status === 404) {
            mensagem =
                "Repositório ou arquivo não encontrado.";
        }

        const erro = new Error(mensagem);

        // Guarda o código para verificações internas.
        erro.status = resposta.status;

        throw erro;
    }

    return dados;
}


/* =========================================================
   TESTE DO REPOSITÓRIO
========================================================= */

async function testarRepositorio() {

    return await githubRequest(
        githubApiUrl(""),
        {
            method: "GET"
        }
    );
}


/* =========================================================
   USUÁRIO AUTENTICADO
========================================================= */

async function obterUsuarioAutenticado() {

    return await githubRequest(
        githubUsuarioUrl(),
        {
            method: "GET"
        }
    );
}


/* =========================================================
   LER ARQUIVO
========================================================= */

async function lerArquivo(caminho) {

    if (!caminho) {
        throw new Error("Informe o caminho do arquivo.");
    }

    return await githubRequest(
        githubApiUrl(`contents/${caminho}`),
        {
            method: "GET"
        }
    );
}


/* =========================================================
   VERIFICAR SE ARQUIVO EXISTE
========================================================= */

async function arquivoExiste(caminho) {

    try {

        await lerArquivo(caminho);

        return true;

    } catch (erro) {

        if (erro.status === 404) {
            return false;
        }

        throw erro;
    }
}


/* =========================================================
   LISTAR PASTA
========================================================= */

async function listarPastaGitHub(caminho = "") {

    return await githubRequest(
        githubApiUrl(
            caminho
                ? `contents/${caminho}`
                : "contents"
        ),
        {
            method: "GET"
        }
    );
}


/* =========================================================
   TEXTO → BASE64
========================================================= */

function textoParaBase64(texto) {

    const bytes =
        new TextEncoder().encode(
            String(texto)
        );

    let binario = "";

    const tamanhoBloco = 0x8000;

    for (
        let i = 0;
        i < bytes.length;
        i += tamanhoBloco
    ) {

        const bloco = bytes.subarray(
            i,
            Math.min(
                i + tamanhoBloco,
                bytes.length
            )
        );

        binario += String.fromCharCode(...bloco);
    }

    return btoa(binario);
}


/* =========================================================
   ARQUIVO → BASE64
========================================================= */

async function arquivoParaBase64(arquivo) {

    if (!(arquivo instanceof Blob)) {
        throw new Error(
            "O conteúdo informado não é um arquivo válido."
        );
    }

    const buffer =
        await arquivo.arrayBuffer();

    const bytes =
        new Uint8Array(buffer);

    let binario = "";

    const tamanhoBloco = 0x8000;

    for (
        let i = 0;
        i < bytes.length;
        i += tamanhoBloco
    ) {

        const bloco = bytes.subarray(
            i,
            Math.min(
                i + tamanhoBloco,
                bytes.length
            )
        );

        binario += String.fromCharCode(...bloco);
    }

    return btoa(binario);
}


/* =========================================================
   SALVAR ARQUIVO NO GITHUB
========================================================= */

async function salvarArquivoGitHub({
    caminho,
    conteudo,
    mensagem,
    tipo = "texto"
}) {

    if (!githubToken) {
        throw new Error(
            "Você precisa informar o token do GitHub antes de publicar."
        );
    }

    if (!caminho || !caminho.trim()) {
        throw new Error(
            "O caminho do arquivo não foi informado."
        );
    }


    /* -----------------------------------------
       CONVERTER PARA BASE64
    ----------------------------------------- */

    let base64;

    if (tipo === "arquivo") {

        base64 =
            await arquivoParaBase64(conteudo);

    } else {

        base64 =
            textoParaBase64(conteudo);
    }


    /* -----------------------------------------
       DESCOBRIR SHA DO ARQUIVO ATUAL
    ----------------------------------------- */

    let sha = null;

    try {

        const arquivoAtual =
            await lerArquivo(caminho);

        sha = arquivoAtual.sha;

    } catch (erro) {

        // 404 significa que o arquivo ainda não existe.
        if (erro.status !== 404) {
            throw erro;
        }
    }


    /* -----------------------------------------
       CORPO DA REQUISIÇÃO
    ----------------------------------------- */

    const corpo = {

        message:
            mensagem ||
            `Atualização automática: ${caminho}`,

        content: base64,

        branch:
            GITHUB_CONFIG.branch
    };


    // Se já existe, o GitHub exige o SHA.
    if (sha) {
        corpo.sha = sha;
    }


    /* -----------------------------------------
       ENVIAR
    ----------------------------------------- */

    return await githubRequest(
        githubApiUrl(`contents/${caminho}`),
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(corpo)
        }
    );
}


/* =========================================================
   EXCLUIR ARQUIVO
========================================================= */

async function excluirArquivoGitHub({
    caminho,
    mensagem
}) {

    if (!githubToken) {
        throw new Error(
            "Você precisa informar o token do GitHub."
        );
    }

    const arquivo =
        await lerArquivo(caminho);

    if (!arquivo?.sha) {
        throw new Error(
            "Não foi possível obter o SHA do arquivo."
        );
    }

    return await githubRequest(
        githubApiUrl(`contents/${caminho}`),
        {
            method: "DELETE",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                message:
                    mensagem ||
                    `Exclusão automática: ${caminho}`,

                sha: arquivo.sha,

                branch:
                    GITHUB_CONFIG.branch
            })
        }
    );
}


/* =========================================================
   EXPORTAR API
========================================================= */

window.GitHubAPI = {

    definirToken,
    limparToken,
    possuiToken,

    configurarRepositorio,
    obterConfiguracaoGitHub,

    testarRepositorio,
    obterUsuarioAutenticado,

    lerArquivo,
    arquivoExiste,
    listarPastaGitHub,

    salvarArquivoGitHub,
    excluirArquivoGitHub,

    textoParaBase64,
    arquivoParaBase64
};