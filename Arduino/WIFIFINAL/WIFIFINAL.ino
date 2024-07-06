#include <SoftwareSerial.h>
#include <ArduinoJson.h>

// 핀 설정
const int pirPin = 6;
const int irPin = A0;
const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

SoftwareSerial mySerial(2, 3); // RX, TX

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);

  // ESP8266 초기화
  sendATCommand("AT", "OK", 2000);

  // WiFi 네트워크 연결 설정
  const char* ssid = "";       // WiFi 네트워크 SSID
  const char* password = "";   // WiFi 네트워크 비밀번호
  String wifiCommand = "AT+CWJAP=\"" + String(ssid) + "\",\"" + String(password) + "\"";
  sendATCommand(wifiCommand.c_str(), "OK", 20000);

  // 서버에 TCP 연결
  const char* server = "192.x.x.x"; // 백엔드 서버의 IP 주소
  String cipstartCommand = "AT+CIPSTART=\"TCP\",\"" + String(server) + "\",8080";
  sendATCommand(cipstartCommand.c_str(), "OK", 10000);

  pinMode(pirPin, INPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  Serial.println("System Ready");

}

void loop() {
  // 센서에서 데이터 읽기 (아날로그 핀 A0에서 값을 읽어옴)
  int sensorValue = analogRead(A0);
  float voltage = sensorValue * (5.0 / 1023.0); // 아날로그 값을 전압으로 변환 
  // JSON 데이터 생성
  String jsonBody = "{\"sensor_value\": " + String(sensorValue) + ", \"voltage\": " + String(voltage, 2) + "}";

  int pirValue = digitalRead(pirPin);
  int irValue = analogRead(irPin);
  //Serial.print("PIR Sensor Value: ");
  //Serial.println(pirValue);
  //Serial.print("IR Sensor Value: ");
  //Serial.println(irValue);
  if (pirValue == HIGH) {
      // PIR 센서가 움직임을 감지한 경우
      if (irValue < 50) { //열림
        // 적외선 센서가 특정 거리 내에 감지된 경우
        setColor(255, 0, 0); // 적색 (가까운 거리)
        Serial.println("Both PIR and IR detected. LED set to GREEN.");
      } else { //닫힘
      // HTTP POST 요청 전송
      sendHTTPPost("/info", jsonBody);
      // 서버 응답 읽기 (시리얼 모니터에 출력)
      readServerResponse();
      // 잠시 대기
      delay(5000); 
    }
  }
  else{
    setColor(0, 0, 0);
  }
}

void sendHTTPPost(const char* path, String body) {
  // HTTP POST 요청 생성
  String postRequest = "POST " + String(path) + " HTTP/1.1\r\n";
  postRequest += "Host: 192.x.x.x\r\n"; // 백엔드 서버의 IP 주소
  postRequest += "Content-Type: application/json\r\n";
  postRequest += "Content-Length: " + String(body.length()) + "\r\n\r\n";
  postRequest += body;

  // AT 명령어로 전송
  String cipsendCommand = "AT+CIPSEND=" + String(postRequest.length());
  sendATCommand(cipsendCommand.c_str(), ">", 5000);
  mySerial.print(postRequest);

  // 서버 응답을 받을 때까지 대기
  delay(1000); // 충분한 시간 대기
}

void sendATCommand(const char* command, const char* expectedResponse, unsigned long timeout) {
  mySerial.println(command);
  unsigned long startTime = millis();
  while (millis() - startTime < timeout) {
    if (mySerial.find((char*)expectedResponse)) {
      Serial.println("Command executed: " + String(command));
      return;
    }
  }
  Serial.println("Failed: " + String(command));
}
void readServerResponse() {
  String data = "";
  unsigned long startTime = millis();
  while (millis() - startTime < 10000) { // 10초 동안 대기
    while (mySerial.available()) {
      char c = mySerial.read();
      Serial.write(c);
      data += c;
    }
  }
  
  // 데이터 수신 확인을 위해 시리얼 모니터에 출력
  Serial.println("Received data: " + data);

  // 불필요한 공백 문자 및 특수 문자 제거
  data.trim();

  // 정제된 데이터 확인을 위해 시리얼 모니터에 출력
  Serial.println("Processed data: " + data);

  // 마지막 글자 추출
  char weatherCode = data.charAt(data.length() - 1);

  // 마지막 글자 확인을 위해 시리얼 모니터에 출력
  Serial.println("Last character: " + String(weatherCode));

  // 마지막 글자를 기반으로 LED 색상 설정
  if (weatherCode == 'y') {
    setColor(255, 255, 0); // 노란색
    Serial.println("Weather is hot. LED set to YELLOW.");
  } else if (weatherCode == 'b') {
    setColor(0, 0, 255); // 파란색
    Serial.println("Weather is Rainy. LED set to BLUE.");
  } else if (weatherCode == 'g') {
    setColor(128, 128, 128); // 회색
    Serial.println("Weather is Cloudy. LED set to GRAY.");
  } else if (weatherCode == 'w') {
    setColor(255, 255, 255); // 흰색
    Serial.println("Weather is Snowy. LED set to WHITE.");
  } else if (weatherCode == 'p') {
    setColor(128, 0, 128); // 보라색
    Serial.println("Weather is cold. LED set to PURPLE.");
  } else {
    setColor(255, 0, 0); // 빨간색 (알 수 없음)
    Serial.println("Unknown weather data. LED set to RED.");
  }
}

void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}

