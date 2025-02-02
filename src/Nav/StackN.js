// src/Nav/StackN.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens
import Splash from '../Screen/Splash';
import Onboard from '../Screen/Onboard';
import Home from '../Screen/Home';
import OwnerLogin from '../Screen/OwnerLogin';
import AdminProfile from '../Screen/AdminProfile';
import HowItWorks from '../Screen/HowItWorks';
import Requirements from '../Screen/Requirements';
import ContactSupport from '../Screen/ContactSupport';
import FAQs from '../Screen/FAQs';

const Stack = createStackNavigator();

const StackN = () => {
  return (
    <Stack.Navigator
      initialRouteName='Splash'
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      {/* Initial Screens */}
      <Stack.Screen 
        name="Splash" 
        component={Splash} 
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen 
        name="Onboard" 
        component={Onboard}
        options={{ gestureEnabled: false }}
      />
      
      {/* Main Screens */}
      <Stack.Screen name="Home" component={Home} />
      
      {/* Authentication Screens */}
      <Stack.Screen 
        name="OwnerLogin" 
        component={OwnerLogin}
        options={{
          gestureEnabled: true,
          cardStyle: { backgroundColor: '#fff' }
        }}
      />
      
      {/* Admin/Owner Screens */}
      <Stack.Screen 
        name="AdminProfile" 
        component={AdminProfile}
        options={{
          gestureEnabled: false,
          cardStyle: { backgroundColor: '#fff' }
        }}
      />
      
      {/* Information Screens */}
      <Stack.Screen name="HowItWorks" component={HowItWorks} />
      <Stack.Screen name="Requirements" component={Requirements} />
      <Stack.Screen name="ContactSupport" component={ContactSupport} />
      <Stack.Screen name="FAQs" component={FAQs} />
    </Stack.Navigator>
  );
};

export default StackN;