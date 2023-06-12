#include <WiFi.h>
#include <Arduino.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <PubSubClient.h>

#define DEVICE_ID 4545
#define RELAY_PIN 33

float FALL_THRESHOLD = -1.4;

Adafruit_MPU6050 mpu;

// For battery
const int MAX_ANALOG_VAL = 4095;
const float MAX_BATTERY_VOLTAGE = 4.2;

// Replace the SSID/Password details as per your wifi router
const char *ssid = "yourSSID";
const char *password = "yourPassword";

// Replace your MQTT Broker IP address here:
const char *mqtt_server = "461c2f8dac1642c9b29ae68be3d90e2d.s2.eu.hivemq.cloud";
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;

void setup_wifi();
void callback(char *topic, byte *message, unsigned int length);
void reconnect();

void connect_mqttServer()
{
  // Loop until we're reconnected
  while (!client.connected())
  {

    // first check if connected to wifi
    if (WiFi.status() != WL_CONNECTED)
    {
      // if not connected, then first connect to wifi
      setup_wifi();
    }

    // Attempt to connect
    if (client.connect("ESP32_client1"))
    { // Change the name of client here if multiple ESP32 are connected. This should be a unique name.
      // attempt successful
      Serial.println("connected");
      // Subscribe to topics here
      client.subscribe("airbag/data");
      // client.subscribe("rpi/xyz"); //subscribe more topics here
    }
    else
    {
      // attempt not successful
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" trying again in 2 seconds");

      delay(2000);
    }
  }
}

void setup_wifi()
{
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char *topic, byte *message, unsigned int length)
{
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  // Feel free to add more if statements to control more GPIOs with MQTT

  // If a message is received on the topic esp32/output, you check if the message is either "on" or "off".
  // Changes the output state according to the message
  if (String(topic) == "aribag/sensitivity")
  {
    FALL_THRESHOLD = atof(messageTemp.c_str());
  }
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client"))
    {
      Serial.println("connected");
      // Subscribe
      client.subscribe("esp32/output");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup()
{

  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(115200);
  // setup_wifi();
  client.setServer(mqtt_server, 1883); // 1883 is the default port for MQTT server
  connect_mqttServer();

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

  if (!client.connected())
  {
    connect_mqttServer();
  }

  client.loop();

  long now = millis();
  if (now - lastMsg > 4000)
  {
    lastMsg = now;

    int rawValue = analogRead(34);
    float voltageLevel = (rawValue / 4095.0) * 2 * 1.1 * 3.3; // calculate voltage level
    float batteryFraction = voltageLevel / MAX_BATTERY_VOLTAGE;

    String data = DEVICE_ID + "," + String((int)batteryFraction) + ",True";

    client.publish("airbag/data", data.c_str()); // topic name (to which this ESP32 publishes its data). 88 is the dummy value.
  }

  delay(10);
}