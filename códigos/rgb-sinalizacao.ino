/*
====================================================
 Sistema de Alerta para Situações de Emergência
 Arduino UNO R3

 Vermelho Piscando -> Perigo
 Azul Piscando -> Saída Segura

 Potenciômetro:
 Controla o brilho do LED através de PWM.

====================================================
*/

// -------------------------------
// Definição dos pinos do LED RGB
// -------------------------------
const int ledVermelho = 9;     // PWM
const int ledVerde = 10;       // PWM (não será utilizado)
const int ledAzul = 11;        // PWM

// -------------------------------
// Potenciômetro
// -------------------------------
const int potenciometro = A0;

// -------------------------------
// Variáveis
// -------------------------------
int brilho = 255;

// Estado atual
bool perigo = true;

// Controle do tempo
unsigned long tempoAnterior = 0;

// Alternância entre estados
const unsigned long intervalo = 5000;

void setup()
{
    // Configura os pinos do LED como saída
    pinMode(ledVermelho, OUTPUT);
    pinMode(ledVerde, OUTPUT);
    pinMode(ledAzul, OUTPUT);

    // Potenciômetro como entrada
    pinMode(potenciometro, INPUT);
}

void loop()
{
    // ==================================================
    // Lê o potenciômetro
    // Valor de 0 a 1023
    // ==================================================
    int leitura = analogRead(potenciometro);

    // ==================================================
    // Converte para brilho PWM
    // PWM varia de 0 até 255
    // ==================================================
    brilho = map(leitura, 0, 1023, 0, 255);

    // ==================================================
    // Alterna entre perigo e saída segura
    // a cada 5 segundos
    // ==================================================
    if (millis() - tempoAnterior >= intervalo)
    {
        perigo = !perigo;
        tempoAnterior = millis();
    }

    // ==================================================
    // Estado PERIGO
    // ==================================================
    if (perigo)
    {
        analogWrite(ledVermelho, brilho);
        analogWrite(ledAzul, 0);

        delay(300);

        analogWrite(ledVermelho, 0);

        delay(300);
    }

    // ==================================================
    // Estado SAÍDA SEGURA
    // ==================================================
    else
    {
        analogWrite(ledAzul, brilho);
        analogWrite(ledVermelho, 0);

        delay(300);

        analogWrite(ledAzul, 0);

        delay(300);
    }
}