import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getCurrentPositionAsync } from 'expo-location';
import MapView from 'react-native-maps';
import { getNearbyHospitals } from './api';
import { Button } from 'react-native-elements';

export default function App() {

  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null); 
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const user = {
        id: userInfo.user.id,
        name: userInfo.user.name,
        email: userInfo.user.email, 
      };

      setUser(user); 

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentPositionAsync()
      .then(loc => {
        setLocation(loc.coords);

        getNearbyHospitals(loc.coords)  
          .then(nearbyHospitals => {
            setHospitals(nearbyHospitals);
          });
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {user ? (
        <MapView 
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421  
          }}
        >
          {hospitals.map(hospital => (
            <MapView.Marker
              key={hospital.id}
              coordinate={{latitude: hospital.lat, longitude: hospital.lng}} 
              title={hospital.name}
            />
          ))}
        </MapView>  
      ) : (
        <Button
          title="Sign in with Google"
          onPress={signIn} 
        />
      )}
    </View>
  );
}