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