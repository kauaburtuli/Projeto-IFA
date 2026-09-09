const GITHUB = {

    usuario: "kauaburtuli",

    repositorio: "Projeto-IFA",

    branch: "main",

    token: ""

};

document.getElementById("publicarProjeto").onclick = async ()=>{

    if(!GITHUB.token){

        GITHUB.token = prompt("Cole seu Personal Access Token");

        if(!GITHUB.token) return;

    }

    publicarProjeto();

}

function paraBase64(texto){

    return btoa(

        unescape(

            encodeURIComponent(texto)

        )

    );

}



function gerarHTML(){

const titulo=campoTitulo.value;

const descricao=campoDescricao.value;

const banner=arquivoBanner.files[0].name;

let html=inicioHTML(titulo);

html+=gerarBanner(titulo,descricao,banner);

document.querySelectorAll(".bloco").forEach(bloco=>{

switch(bloco.dataset.tipo){

case "texto":

html+=blocoTexto(bloco);

break;

case "codigo":

html+=blocoCodigo(bloco);

break;

}

});

html+=fimHTML();

return html;

}

async function publicarProjeto(){

    await enviarBanner();

    await enviarGalerias();

    await enviarVideos();

    await enviarCodigos();

    const html=gerarHTML();

    const slug=document.getElementById("slug").value;

    await criarArquivo(

        "projetos/"+slug+".html",

        html,

        "Novo projeto"

    );

    alert("Projeto publicado!");

}

async function uploadArquivo(arquivo, pasta){

    const bytes = await arquivo.arrayBuffer();

    let binario = "";

    const view = new Uint8Array(bytes);

    view.forEach(b=>{

        binario += String.fromCharCode(b);

    });

    const base64 = btoa(binario);

    return await criarArquivo(

        pasta + "/" + arquivo.name,

        base64,

        "Upload " + arquivo.name,

        true

    );

}

async function enviarBanner(){

    const banner=document.getElementById("banner").files[0];

    if(!banner)return;

    await uploadArquivo(

        banner,

        "imagens"

    );

}

async function criarArquivo(caminho,conteudo,mensagem,jaBase64=false){

    const url=

`https://api.github.com/repos/${GITHUB.usuario}/${GITHUB.repositorio}/contents/${caminho}`;

    return fetch(url,{

        method:"PUT",

        headers:{

            Authorization:`Bearer ${GITHUB.token}`,

            Accept:"application/vnd.github+json"

        },

        body:JSON.stringify({

            message:mensagem,

            content:jaBase64?conteudo:paraBase64(conteudo),

            branch:GITHUB.branch

        })

    }).then(r=>r.json());

}

async function enviarGalerias(){

    const galerias=document.querySelectorAll(".galeria");

    for(const g of galerias){

        for(const img of g.files){

            await uploadArquivo(

                img,

                "imagens"

            );

        }

    }

}

async function enviarVideos(){

    const videos=document.querySelectorAll(".video");

    for(const v of videos){

        if(v.files.length){

            await uploadArquivo(

                v.files[0],

                "videos"

            );

        }

    }

}

async function enviarCodigos(){

    const codigos=document.querySelectorAll(".arquivo-ino");

    for(const c of codigos){

        if(c.files.length){

            await uploadArquivo(

                c.files[0],

                "codigos"

            );

        }

    }

}

async function lerArquivo(caminho){

    const url =
`https://api.github.com/repos/${GITHUB.usuario}/${GITHUB.repositorio}/contents/${caminho}`;

    const resposta = await fetch(url,{

        headers:{
            Authorization:`Bearer ${GITHUB.token}`
        }

    });

    return await resposta.json();

}

async function atualizarArquivo(caminho,conteudo,mensagem,sha){

    const url =
`https://api.github.com/repos/${GITHUB.usuario}/${GITHUB.repositorio}/contents/${caminho}`;

    const resposta = await fetch(url,{

        method:"PUT",

        headers:{

            Authorization:`Bearer ${GITHUB.token}`,

            Accept:"application/vnd.github+json"

        },

        body:JSON.stringify({

            message:mensagem,

            content:paraBase64(conteudo),

            branch:GITHUB.branch,

            sha:sha

        })

    });

    return await resposta.json();

}

function gerarCard(){

    const titulo =
    document.getElementById("titulo").value;

    const descricao =
    document.getElementById("descricao").value;

    const slug =
    document.getElementById("slug").value;

    const banner =
    document.getElementById("banner").files[0].name;

    return `

<div class="card">

<img src="imagens/${banner}">

<div class="card-conteudo">

<h3>${titulo}</h3>

<p>${descricao}</p>

<a href="projetos/${slug}.html"
class="botao">

Saiba mais

</a>

</div>

</div>

`;

}