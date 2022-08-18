import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import Constant from "expo-constants";
import axios from "axios";

const API_URL = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={API_KEY}&lang=fr&units=metrics`;

export default function App() {
  //recuperer la position de l'utilisateur

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getCoordonate = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync();
      getWeather(userLocation);
    };
    getCoordonate();
  }, []);

  const getWeather = async (location) => {
    try {
      const response = await axios.get(
        API_URL(location.coords.latitude, location.coords.longitude)
      );

      setData(response.data);

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
  // realiser une requete vers le serveur
  return (
    <View style={styles.container}>
      <Text>Application METEO</Text>
      <Text>{data?.city?.name}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
