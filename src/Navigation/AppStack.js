import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../LoginSingupScreen/LoginScreen';
import SignupNextScreen from '../LoginSingupScreen/SingupNextScreen';
import SignupScreen from '../LoginSingupScreen/SignupScreen';
import HomeScreen from  '../MainScreens/HomeScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name="Home" component={HomeScreen} />
                {/* <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignupNext" component={SignupNextScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} /> */}
                
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppStack;