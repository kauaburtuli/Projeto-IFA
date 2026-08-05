// Seleciona todos os elementos com a classe .card
const cards = document.querySelectorAll(".card");

// Aplica o estado inicial escondido para cada card antes da animação acontecer
cards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = ".8s";
});

// Monitora o evento de scroll da página
window.addEventListener("scroll", () => {
    cards.forEach(card => {
        const pos = card.getBoundingClientRect().top;
        
        // Se o card aparecer na tela, ele executa a animação de subida
        if (pos < window.innerHeight - 100) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
});