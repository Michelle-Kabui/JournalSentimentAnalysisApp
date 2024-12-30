// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/app/HomeScreen';
import JournalScreen from '../screens/app/JournalScreen';
import AssessmentScreen from '../screens/app/AssessmentScreen';
import MDQScreen from '../screens/app/MDQScreen'; 
import BSDSScreen from '../screens/app/BSDSScreen';
import ResultsScreen from '../screens/app/ResultsScreen';
import JournalHistoryScreen from '../screens/app/JournalHistoryScreen';
import JournalDetailScreen from '../screens/app/JournalDetailScreen';
import MoodVisualizationScreen from '../screens/app/MoodVisualizationScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import AssessmentHistoryScreen from '../screens/app/AssessmentHistoryScreen';
import JournalAnalyticsScreen from '../screens/app/JournalAnalyticsScreen';


// In Stack.Navigator
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="Assessment" component={AssessmentScreen} /> 
        <Stack.Screen name="MDQ" component={MDQScreen} /> 
        <Stack.Screen name="BSDS" component={BSDSScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="JournalHistory" 
       component={JournalHistoryScreen}
       options={{ headerShown: false }}
      />
      <Stack.Screen 
  name="JournalDetail" 
  component={JournalDetailScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="MoodVisualization" 
  component={MoodVisualizationScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="Profile" 
  component={ProfileScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="AssessmentHistory" 
  component={AssessmentHistoryScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="JournalAnalytics" 
  component={JournalAnalyticsScreen}
  options={{ headerShown: false }}
/>
      </Stack.Navigator>      
    </NavigationContainer>
  );
}