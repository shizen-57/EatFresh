import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { SafeArea } from "../../../../components/utility/safe_area.component";

export const MapScreen = () => {
  return (
    <SafeArea>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 23.8103, // Dhaka Latitude
            longitude: 90.4125, // Dhaka Longitude
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* OpenStreetMap Tile Layer */}
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19} // Max zoom level for tiles
          />

          {/* Marker for Dhaka */}
          <Marker
            coordinate={{ latitude: 23.8103, longitude: 90.4125 }}
            title="Dhaka"
            description="Capital of Bangladesh"
          />
        </MapView>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
