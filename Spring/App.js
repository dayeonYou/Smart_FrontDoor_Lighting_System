import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

const WeatherInfo = () => {
  const [weatherInfo, setWeatherInfo] = useState('');

  const handleClick = async () => {
    try {
      const response = await axios.post('http://192.168.45.18:8080/info'); // 서버의 URL을 여기에 입력
      const weatherData = response.data;

      // Process weather data
      let result = '';
      switch (weatherData) {
        case 'y':
          result = '맑음 - 더움';
          break;
        case 'p':
          result = '맑음 - 추움';
          break;
        case 'w':
          result = '맑음 - 보통';
          break;
        case 'b':
          result = '비';
          break;
        case 'g':
          result = '흐림';
          break;
        default:
          result = '알 수 없음';
          break;
      }

      setWeatherInfo(result);
    } catch (error) {
      console.error('Error fetching weather information:', error);
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>날씨 정보</Text>
      <Button title="날씨 정보 가져오기" onPress={handleClick} />
      <Text>{weatherInfo}</Text>
    </View>
  );
};

export default WeatherInfo;
