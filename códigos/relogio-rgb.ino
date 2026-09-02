// ==========================================================
// RELÓGIO VISUAL POR CORES
// Arduino Uno R3 + LED RGB
// ==========================================================

// Define o pino conectado à cor vermelha do LED RGB
const int LED_VERMELHO = 9;

// Define o pino conectado à cor verde do LED RGB
const int LED_VERDE = 10;

// Define o pino conectado à cor azul do LED RGB
const int LED_AZUL = 11;


// ----------------------------------------------------------
// CONFIGURAÇÃO DOS TEMPOS
// ----------------------------------------------------------

// Define quanto tempo cada período irá durar.
// O valor é dado em milissegundos.

// 10 segundos = 10000 milissegundos
const unsigned long TEMPO_MANHA = 10000;

// 10 segundos = 10000 milissegundos
const unsigned long TEMPO_TARDE = 10000;

// 10 segundos = 10000 milissegundos
const unsigned long TEMPO_NOITE = 10000;


// Soma todos os períodos para formar um ciclo completo
const unsigned long TEMPO_CICLO =
  TEMPO_MANHA + TEMPO_TARDE + TEMPO_NOITE;


// ----------------------------------------------------------
// VARIÁVEL PARA CONTROLAR O TEMPO
// ----------------------------------------------------------

// Guarda o momento em que o ciclo começou
unsigned long inicioCiclo = 0;


// ==========================================================
// FUNÇÃO SETUP
// Executada apenas uma vez quando o Arduino é ligado
// ==========================================================

void setup() {

  // Define o pino vermelho como saída
  pinMode(LED_VERMELHO, OUTPUT);

  // Define o pino verde como saída
  pinMode(LED_VERDE, OUTPUT);

  // Define o pino azul como saída
  pinMode(LED_AZUL, OUTPUT);

  // Garante que o LED comece apagado
  apagarLED();

  // Guarda o tempo inicial do Arduino
  inicioCiclo = millis();
}


// ==========================================================
// FUNÇÃO LOOP
// Executada continuamente pelo Arduino
// ==========================================================

void loop() {

  // Obtém o tempo atual desde que o Arduino foi ligado
  unsigned long tempoAtual = millis();

  // Calcula quanto tempo passou desde o início do ciclo
  unsigned long tempoDecorrido =
    tempoAtual - inicioCiclo;


  // --------------------------------------------------------
  // VERIFICA SE ESTAMOS NO PERÍODO DA MANHÃ
  // --------------------------------------------------------

  if (tempoDecorrido < TEMPO_MANHA) {

    // Acende o LED na cor azul
    mostrarAzul();
  }


  // --------------------------------------------------------
  // VERIFICA SE ESTAMOS NO PERÍODO DA TARDE
  // --------------------------------------------------------

  else if (tempoDecorrido <
           TEMPO_MANHA + TEMPO_TARDE) {

    // Acende o LED na cor verde
    mostrarVerde();
  }


  // --------------------------------------------------------
  // CASO CONTRÁRIO, É O PERÍODO DA NOITE
  // --------------------------------------------------------

  else {

    // Acende o LED na cor vermelha
    mostrarVermelho();
  }


  // --------------------------------------------------------
  // VERIFICA SE O CICLO TERMINOU
  // --------------------------------------------------------

  if (tempoDecorrido >= TEMPO_CICLO) {

    // Reinicia o contador do ciclo
    inicioCiclo = tempoAtual;
  }
}


// ==========================================================
// FUNÇÃO PARA MOSTRAR A COR AZUL
// Representa a MANHÃ
// ==========================================================

void mostrarAzul() {

  // Vermelho desligado
  digitalWrite(LED_VERMELHO, LOW);

  // Verde desligado
  digitalWrite(LED_VERDE, LOW);

  // Azul ligado
  digitalWrite(LED_AZUL, HIGH);
}


// ==========================================================
// FUNÇÃO PARA MOSTRAR A COR VERDE
// Representa a TARDE
// ==========================================================

void mostrarVerde() {

  // Vermelho desligado
  digitalWrite(LED_VERMELHO, LOW);

  // Verde ligado
  digitalWrite(LED_VERDE, HIGH);

  // Azul desligado
  digitalWrite(LED_AZUL, LOW);
}


// ==========================================================
// FUNÇÃO PARA MOSTRAR A COR VERMELHA
// Representa a NOITE
// ==========================================================

void mostrarVermelho() {

  // Vermelho ligado
  digitalWrite(LED_VERMELHO, HIGH);

  // Verde desligado
  digitalWrite(LED_VERDE, LOW);

  // Azul desligado
  digitalWrite(LED_AZUL, LOW);
}


// ==========================================================
// FUNÇÃO PARA APAGAR O LED
// ==========================================================

void apagarLED() {

  // Desliga o vermelho
  digitalWrite(LED_VERMELHO, LOW);

  // Desliga o verde
  digitalWrite(LED_VERDE, LOW);

  // Desliga o azul
  digitalWrite(LED_AZUL, LOW);
}