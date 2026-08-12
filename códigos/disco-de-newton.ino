#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>

int pinPot = A5;

void _delay(float seconds) {
  long endTime = millis() + seconds * 1000;
  while(millis() < endTime) _loop();
}

void setup() {
  pinMode(6,OUTPUT);
  while(1) {
    analogWrite(6,map(analogRead(pinPot),0,1023,0,255));

  	_loop();
  }

}

void _loop() {
}

void loop() {
  _loop();
}
