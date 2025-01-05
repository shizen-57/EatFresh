import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/LoginSingupScreen/LoginScreen';
import SignupScreen from './src/LoginSingupScreen/SignupScreen';
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
