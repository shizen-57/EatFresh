<<<<<<< HEAD
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/LoginSignupScreen/LoginScreen';
import SignupScreen from './src/LoginSignupScreen/SignupScreen';
import AppNav from './src/Navigation/AppNav';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator screenOptions={{ headerShown: false }}>
    //     <Stack.Screen name="Login" component={LoginScreen} />
    //     <Stack.Screen name="Signup" component={SignupScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <AppNav />
  );
};

export default App;
=======
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
>>>>>>> 8636adafcb353ee986a6dc2057c6553a129d0b4c
