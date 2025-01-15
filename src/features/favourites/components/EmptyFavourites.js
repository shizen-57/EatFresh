import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function EmptyFavourites() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../../../assets/animations/check-mark.json")}
        style={styles.animation}
        autoPlay
        loop
      />
      <Text style={styles.text}>No favourite items yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
});