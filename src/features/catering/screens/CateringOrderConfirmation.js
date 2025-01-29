import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import LottieView from 'lottie-react-native';

const CateringOrderConfirmation = ({ route, navigation }) => {
  const { orderId } = route.params;

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../../assets/animations/order-success.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text h3 style={styles.title}>Order Confirmed!</Text>
      <Text style={styles.orderId}>Order ID: {orderId}</Text>
      <Text style={styles.message}>
        Thank you for your catering order. We'll contact you shortly to confirm the details.
      </Text>
      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('HomeScreen')}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  message: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    width: '80%',
  },
});

export default CateringOrderConfirmation;
