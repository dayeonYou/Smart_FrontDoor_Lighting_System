import React, { useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';

const LocationComponent = () => {
  useEffect(() => {
    // 위치 가져오기를 위한 코드
    const getLocation = async () => {
      try {
        const position = await Geolocation.getCurrentPosition(
          (position) => {
            console.log(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (error) {
        console.log(error);
      }
    };

    getLocation(); // 위치 가져오기 함수 호출
  }, []);

  return null;
};

export default LocationComponent;
