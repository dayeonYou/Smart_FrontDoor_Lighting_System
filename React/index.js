import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';
import MyComponent from './MyComponent'; // MyComponent를 import합니다.

// 홈 화면 컴포넌트

const HomeScreen = ({ navigation }) => {
  // MyComponent에서 가져온 날씨 정보를 표시할 상태 추가
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentColor, setCurrentColor] = useState('yellow'); // 기본 색상 설정
  const [currentBelb, setCurrentBelb] = useState('안전'); // 더미 값
  const [currentBright, setCurrentBright] = useState('70%'); // 추가 더미 값
  const [AlarmPattern, setAlarmPattern] = useState('기본 설정'); // 추가 더미 값

  // MyComponent에서 날씨 정보 업데이트 처리
  const handleWeatherUpdate = (weatherData) => {
    setCurrentWeather(weatherData);
    updateColor(weatherData.description, weatherData.temperature);
  };
  const updateColor = (description, temperature) => {
    let temperatureDouble = parseFloat(temperature);
    if (description === '맑음') {
      if(temperatureDouble > 22){
        setCurrentColor('yellow');
      }
      else if(temperatureDouble<10){ //추운 것으로 간주
        setCurrentColor('purple');
      }
      else{
        setCurrentColor('white');
      }
    } else if (description === '비') {
      setCurrentColor('blue');
    } else if (description === '흐림') {
      setCurrentColor('gray');
    } else if (description === '대체로 흐림') {
      setCurrentColor('gray');
    } else if (description === '구름 조금') {
      setCurrentColor('gray');
    } else {
      setCurrentColor('yellow');
    }
  };
  
  return (
    <View style={styles.mainContainer}>
      {/* MyComponent 추가 */}
      <MyComponent onWeatherUpdate={handleWeatherUpdate} />

      <View style={styles.container}>
        {/* 현재 날씨 정보 표시 */}
        <Text style={styles.text}>날씨 정보: {currentWeather ? `${currentWeather.description}, ${currentWeather.temperature}°C` : '업데이트 필요'}</Text>
        <Text style={styles.text}>가스밸브 상태: {currentBelb}</Text>
      </View>
      
      <View style={styles.additionalContainer}>
        {/* 추가 정보 표시 */}
        <Text style={styles.text}>조명 색상: {currentColor}</Text>
        <Text style={styles.text}>밝기: {currentBright}</Text>
        <Text style={styles.text}>알림 패턴: {AlarmPattern}</Text>
      </View>

     
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
        <Image source={require('./assets/settings.png')} style={styles.settingsIcon} />
      </TouchableOpacity>
    </View>
  );
};

// 설정 화면 컴포넌트
const SettingsScreen = () => {
  const [rainyColor, setRainyColor] = useState('blue');
  const [sunnyColor, setSunnyColor] = useState('yellow');
  const [coldColor, setColdColor] = useState('purple');
  const [belbColor, setBelbColor] = useState('red');
  const [cloudyColor, setCloudyColor] = useState('gray');

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>설정 화면</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>비올 때: </Text>
        <Picker
          selectedValue={rainyColor}
          style={styles.picker}
          onValueChange={(itemValue) => setRainyColor(itemValue)}
        >
          <Picker.Item label="빨간색" value="red" />
          <Picker.Item label="파란색" value="blue" />
          <Picker.Item label="보라색" value="purple" />
          <Picker.Item label="노란색" value="yellow" />
          <Picker.Item label="회색" value="gray" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>맑을 때: </Text>
        <Picker
          selectedValue={sunnyColor}
          style={styles.picker}
          onValueChange={(itemValue) => setSunnyColor(itemValue)}
        >
          <Picker.Item label="빨간색" value="red" />
          <Picker.Item label="파란색" value="blue" />
          <Picker.Item label="보라색" value="purple" />
          <Picker.Item label="노란색" value="yellow" />
          <Picker.Item label="회색" value="gray" />

        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>추울 때: </Text>
        <Picker
          selectedValue={coldColor}
          style={styles.picker}
          onValueChange={(itemValue) => setColdColor(itemValue)}
        >
          <Picker.Item label="빨간색" value="red" />
          <Picker.Item label="파란색" value="blue" />
          <Picker.Item label="보라색" value="purple" />
          <Picker.Item label="노란색" value="yellow" />
          <Picker.Item label="회색" value="gray" />
          </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>흐릴 때: </Text>
        <Picker
          selectedValue={cloudyColor}
          style={styles.picker}
          onValueChange={(itemValue) => setCloudyColor(itemValue)}
        >
          <Picker.Item label="빨간색" value="red" />
          <Picker.Item label="파란색" value="blue" />
          <Picker.Item label="보라색" value="purple" />
          <Picker.Item label="노란색" value="yellow" />
          <Picker.Item label="회색" value="gray" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>벨브가 열려있을 때: </Text>
        <Picker
          selectedValue={belbColor}
          style={styles.picker}
          onValueChange={(itemValue) => setBelbColor(itemValue)}
        >
          <Picker.Item label="빨간색" value="red" />
          <Picker.Item label="파란색" value="blue" />
          <Picker.Item label="보라색" value="purple" />
          <Picker.Item label="노란색" value="yellow" />
          <Picker.Item label="회색" value="gray" />
        </Picker>
      </View>
    </View>
  );
};

// 네비게이션 스택 생성
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '설정' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    backgroundColor: '#E0E0E0', // 첫 번째 컨테이너 배경색
    padding: 10,
    borderRadius: 10,
    marginBottom: 50, // 간격을 늘리기 위해 마진을 증가
  },
  additionalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0', // 두 번째 컨테이너 배경색
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  settingsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20, // 오른쪽으로 이동
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  settingsIcon: {
    width: 30,
    height: 30,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
});

AppRegistry.registerComponent(appName, () => App);
