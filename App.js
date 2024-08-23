// App.js

import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './navigation/Tabs';
import { Featured, EventDetail } from './screens';
import FilterScreen from './screens/FilterScreen';
import { customFonts } from './constants';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import CartEventsScreen from './screens/CartEventsScreen';
const Stack = createStackNavigator();

export default function App() {
  const [assetsLoaded, setAssetLoaded] = useState(false);

  /* Loading custom fonts in async */
  const _loadAssetsAsync = async () => {
    await Font.loadAsync(customFonts);
    setAssetLoaded(true);
  };

  useEffect(() => {
    _loadAssetsAsync();
  });

  return assetsLoaded ? (
    <NavigationContainer>
      <StatusBar barStyle="light-content"></StatusBar>
      <Stack.Navigator
    screenOptions={{
        headerShown: false,
    }}
    initialRouteName="Login"
>
    <Stack.Screen name="Featured" component={Featured} />
    <Stack.Screen name="EventDetail" component={EventDetail} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignupScreen" component={SignupScreen} />
    <Stack.Screen name="CartEvents" component={CartEventsScreen} />
    <Stack.Screen name="FilterScreen" component={FilterScreen} />
</Stack.Navigator>

    </NavigationContainer>
  ) : (
    <ActivityIndicator size="small"></ActivityIndicator>
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
