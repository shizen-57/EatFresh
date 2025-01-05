import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LoginScreen from '../LoginSingupScreen/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen'; 

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
        </Stack.Navigator>
    );
};

export default AuthStack;