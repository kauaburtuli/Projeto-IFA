// LED ligado ao pino 11
const int led = 11;

// Variáveis do efeito
int brilho = 0;
int incremento = 1;

void setup() {
  pinMode(led, OUTPUT);
}

void loop() {
  analogWrite(led, brilho);

  brilho += incremento;

  // Quando atingir o máximo ou o mínimo, inverte a direção
  if (brilho <= 0 || brilho >= 255) {
    incremento = -incremento;
  }

  delay(30); // Controla a velocidade do efeito
}
