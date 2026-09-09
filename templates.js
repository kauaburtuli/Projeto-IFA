function inicioHTML(titulo){

return `<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${titulo}</title>

<link rel="icon" href="../imagens/robo-logo.png">

<link rel="stylesheet" href="../projeto-individual.css">

<link rel="stylesheet" href="../acessibilidade.css">

<link rel="stylesheet"
href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css">

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
rel="stylesheet">

</head>

<body>

<header>

<h1>

<img src="../imagens/robo-logo.png" class="logo-robo">

Robótica Educacional

</h1>

<nav>

<a href="../index.html">Início</a>

<a href="../projetos.html">Projetos</a>

</nav>

</header>

<main id="conteudo">
`;
}

function gerarBanner(titulo,descricao,banner){

return `

<div class="banner">

<img src="../imagens/${banner}">

<div class="banner-texto">

<h2>${titulo}</h2>

<p>${descricao}</p>

</div>

</div>

`;

}

function blocoTexto(bloco){

return `

<section>

<h2 class="titulo">

${bloco.querySelector(".titulo-bloco").value}

</h2>

<div class="texto">

<p>

${bloco.querySelector(".conteudo-bloco").value.replace(/\n/g,"<br>")}

</p>

</div>

</section>

`;

}

function blocoCodigo(bloco){

return `

<section>

<div class="codigo">

<h3>

${bloco.querySelector(".titulo-codigo").value}

</h3>

<pre>

<code class="language-${bloco.querySelector(".linguagem").value}">

${bloco.querySelector(".codigo").value}

</code>

</pre>

<a class="btn">

Baixar Código

</a>

</div>

</section>

`;

}

function blocoGaleria(imagens){

let html=`

<section>

<h2 class="titulo">

Biblioteca de Imagens

</h2>

<div class="galeria">

`;

imagens.forEach(nome=>{

html+=`

<img
src="../imagens/${nome}"
onclick="abrirImagem(this.src)">

`;

});

html+=`

</div>

</section>

`;

return html;

}

function blocoVideo(video){

return`

<section>

<h2 class="titulo">

Vídeo Demonstrativo

</h2>

<div class="video">

<video controls>

<source src="../videos/${video}">

</video>

</div>

</section>

`;

}

function fimHTML(){

return`

</main>

<footer>

<p>

Projeto desenvolvido para o IFA - Robótica Educacional

<br>

© 2026

</p>

</footer>

<script src="../projeto-individual.js"></script>

<script src="../acessibilidade.js"></script>

<script src="https://cdn.jsdelivr.net/npm/prismjs/prism.js"></script>

<script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-cpp.min.js"></script>

</body>

</html>

`;

}

