import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const EmptyFavourites = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No favourites yet</Text>
    <Text style={styles.subText}>Save your favourite restaurants for quick access!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 16,
    color: "grey",
    marginTop: 10,
  },
});
