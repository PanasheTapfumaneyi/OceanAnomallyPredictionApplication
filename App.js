// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import WhaleMigrationScreen from './screens/WhaleMigrationScreen';
import TemperatureScreen from './screens/TemperatureScreen';
import CombinedScreen from './screens/CombinedScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Whale Migration') {
              iconName = focused ? 'water' : 'water-outline';
            } else if (route.name === 'Temperature') {
              iconName = focused ? 'thermometer' : 'thermometer-outline';
            } else if (route.name === 'Combined') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0400FF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Whale Migration" component={WhaleMigrationScreen} />
        <Tab.Screen name="Temperature" component={TemperatureScreen} />
        <Tab.Screen name="Combined" component={CombinedScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}