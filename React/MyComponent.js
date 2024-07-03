import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const MyComponent = ({ onWeatherUpdate }) => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (value) => {
    setLocation(value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeather(data);
      onWeatherUpdate(data); // 홈 화면으로 날씨 정보 전달
      setError(null); // Reset error state if successful
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to fetch weather data');
      setWeather(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={handleChange}
        placeholder="Enter location"
      />
      <Button
        title="Get Weather"
        onPress={handleSubmit}
      />
      
      {weather && (
        <View style={styles.weatherContainer}>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 20,
    color: 'red',
    fontSize: 16,
  },
});

export default MyComponent;
