/*

====================================================

 Sistema de Alerta para Situações de Emergência

 Arduino UNO


 Vermelho piscando = PERIGO

 Azul piscando = SAÍDA SEGURA


 Potenciômetro controla a velocidade do piscar.

====================================================

*/


// ------------------------------

// Pinos do LED RGB

// ------------------------------

const int ledVermelho = 9;

const int ledAzul = 11;


// Potenciômetro

const int potenciometro = A0;


// Botão para trocar o modo

const int botao = 2;


// Guarda o modo atual

// false = vermelho

// true = azul

bool modo = false;


// Guarda o estado do LED

bool estadoLED = false;


// Tempo da última troca

unsigned long tempoAnterior = 0;


void setup()

{

    // Configura os LEDs como saída

    pinMode(ledVermelho, OUTPUT);

    pinMode(ledAzul, OUTPUT);


    // Configura botão

    pinMode(botao, INPUT_PULLUP);


    Serial.begin(9600);

}


void loop()

{

    // ----------------------------

    // Verifica se o botão foi apertado

    // ----------------------------


    if (digitalRead(botao) == LOW)

    {

        modo = !modo;


        delay(300);

    }


    // ----------------------------

    // Lê potenciômetro

    // ----------------------------


    int leitura = analogRead(potenciometro);


    // Converte para tempo

    int velocidade = map(leitura, 0, 1023, 1000, 100);


    // ----------------------------

    // Pisca LED

    // ----------------------------


    if (millis() - tempoAnterior >= velocidade)

    {

        tempoAnterior = millis();


        estadoLED = !estadoLED;


        if (modo == false)

        {

            // PERIGO


            if (estadoLED)

            {

                analogWrite(ledVermelho, 255);

            }

            else

            {

                analogWrite(ledVermelho, 0);

            }


            analogWrite(ledAzul, 0);

        }

        else

        {

            // SAÍDA SEGURA


            if (estadoLED)

            {

                analogWrite(ledAzul, 255);

            }

            else

            {

                analogWrite(ledAzul, 0);

            }


            analogWrite(ledVermelho, 0);

        }

    }

}