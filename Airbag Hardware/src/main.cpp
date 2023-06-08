#include <Arduino.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

#define DEVICE_ID 4545
#define RELAY_PIN 33
#define FALL_THRESHOLD -1.4

Adafruit_MPU6050 mpu;

void setup()
{
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(115200);

  if (!mpu.begin())
  {
    Serial.println("Failed to find MPU6050 chip");
    while (1)
    {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  digitalWrite(RELAY_PIN, LOW);
  Serial.println("Setup done");

  Serial.println("");
  delay(100);
}

void loop()
{
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  /* Print out the values */
  // Serial.print("Acceleration X: ");
  // Serial.print(a.acceleration.x * 100);
  // Serial.print(", Y: ");
  // Serial.print(a.acceleration.y * 100);
  // Serial.print(", Z: ");
  // Serial.print(a.acceleration.z * 100);
  // Serial.println(" m/s^2");

  if (a.acceleration.z < FALL_THRESHOLD)
  {
    Serial.println("Fall detected");
    digitalWrite(RELAY_PIN, HIGH);
    delay(500);
    digitalWrite(RELAY_PIN, LOW);
  }

  delay(10);
}