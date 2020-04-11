#include <Servo.h>

  
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>


const int Servo1Pin = 15; //D8
const int Servo2Pin = 2; //D4

const int LEDR= 04; //D2
const int LEDL = 00; //D3
const int LEDB1 = 12; //D6
const int LEDB2 = 13; //D7

const int LEDK1 = 16; //D0
const int LEDK2 = 14; //D5
const int LEDK3 = 5; //D1

bool moving = false;

const char* ssid ="iPad de Josep";     //YOUR SSID
const char* password = "ynmvhyum4to55";        //YOUR WIFI PASSWORD


//const char* ssid ="Salasphone";     //YOUR SSID
//const char* password = "3baefd18e028";        //YOUR WIFI PASSWORD


Servo servo1;
Servo servo2;

ESP8266WebServer server(80);

void right(){
  digitalWrite(LEDR,HIGH);
  digitalWrite(LEDL, LOW);
  digitalWrite(LEDB1,LOW);
  digitalWrite(LEDB2, LOW);

  servo1.attach(Servo1Pin);
  servo2.attach(Servo2Pin);

  servo1.write(360);
  servo2.write(360);

  moving = true;
  
  server.send(200, "text/plane","trying right");
}

void left(){
  digitalWrite(LEDR, LOW);
  digitalWrite(LEDL, HIGH);
  digitalWrite(LEDB1,LOW);
  digitalWrite(LEDB2, LOW);

  servo1.attach(Servo1Pin);
  servo2.attach(Servo2Pin);
  
  servo1.write(0); 
  servo2.write(0);

  moving = true;
  
  server.send(200, "text/plane","trying left");
}
void up(){
  digitalWrite(LEDR, HIGH);
  digitalWrite(LEDL, HIGH);
  digitalWrite(LEDB1,LOW);
  digitalWrite(LEDB2, LOW);
  
  servo1.attach(Servo1Pin); 
  servo2.attach(Servo2Pin);
  
  servo1.write(360);
  servo2.write(0);

  moving = true;
  
  server.send(200, "text/plane","trying up");
}
void down(){
  digitalWrite(LEDR, LOW);
  digitalWrite(LEDL, LOW);
  digitalWrite(LEDB1,HIGH);
  digitalWrite(LEDB2, HIGH);

  servo1.attach(Servo1Pin);
  servo2.attach(Servo2Pin);

  servo1.write(0);
  servo2.write(360);

  moving = true;
  
  server.send(200, "text/plane","trying down ");
}
void alto(){
  digitalWrite(LEDR, LOW);
  digitalWrite(LEDL, LOW);
  digitalWrite(LEDB1,LOW);
  digitalWrite(LEDB2, LOW);
  
  servo1.detach();
  servo2.detach();

  moving = false;
  
  server.send(200, "text/plane","trying stop");
}
void kit () {
  digitalWrite(LEDK1,HIGH);
  digitalWrite(LEDK2,LOW);
  digitalWrite(LEDK3,LOW);
  delay(50);
  
  digitalWrite(LEDK1,LOW);
  digitalWrite(LEDK2,HIGH);
  digitalWrite(LEDK3,LOW);
  delay(50);

  digitalWrite(LEDK1,LOW);
  digitalWrite(LEDK2,LOW);
  digitalWrite(LEDK3,HIGH);
  delay(50);
  
  digitalWrite(LEDK1,LOW);
  digitalWrite(LEDK2,HIGH);
  digitalWrite(LEDK3,LOW);
  delay(50);
  
}
void info() {
 server.send(200, "text/plain", "Hola mundo!");
}

void no_encontrado() {
 server.send(404,"text/plain","Error en la petición");
}

void setup() {

  Serial.begin(115200);
  delay(10);
  pinMode(LEDR,OUTPUT);
  pinMode(LEDL,OUTPUT);
  pinMode(LEDB1,OUTPUT);
  pinMode(LEDB2,OUTPUT);

  pinMode(LEDK1, OUTPUT);
  pinMode(LEDK2, OUTPUT);
  pinMode(LEDK3, OUTPUT);
  
  digitalWrite(LEDR,LOW);
  digitalWrite(LEDL,LOW);
  digitalWrite(LEDB1,LOW);
  digitalWrite(LEDB2,LOW);

  digitalWrite(LEDK1,LOW);
  digitalWrite(LEDK2,LOW);
  digitalWrite(LEDK3,LOW);

  WiFi.mode(WIFI_STA); 
  WiFi.disconnect(); 
  Serial.println();  

  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {   
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: "); 
  Serial.println(WiFi.localIP());

  kit();
  moving = false;
  
  server.on("/up",up);    
  server.on("/down",down);    
  server.on("/left",left);    
  server.on("/right",right);    
  server.on("/stop",alto);    
  server.onNotFound(no_encontrado);
  
  server.begin();
 Serial.println("Servidor HTTP activo");
}

void loop() {
  server.handleClient();
  if (moving == true)
  {
    kit();
  }
  else{
    digitalWrite(LEDK1,LOW);
    digitalWrite(LEDK2,LOW);
    digitalWrite(LEDK3,LOW); 
  }
}
