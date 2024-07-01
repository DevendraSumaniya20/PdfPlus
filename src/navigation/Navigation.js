import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import navigationString from '../constants/navigationString';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import DiscoverScreen from '../screens/DiscoverScreen/DiscoverScreen';
import MyPdfScreen from '../screens/MyPdfScreen/MyPdfScreen';
import MyPdfSavedScreen from '../screens/MyPdfSavedScreen/MyPdfSavedScreen';
import BottomTabNavigation from './BottomTabNavigation';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name={navigationString.BOTTOMTABNAVIGATION}
          component={BottomTabNavigation}
        />
        <Stack.Screen
          name={navigationString.LOGINSCREEN}
          component={LoginScreen}
        />
        <Stack.Screen
          name={navigationString.SIGNUPSCREEN}
          component={SignUpScreen}
        />

        <Stack.Screen
          name={navigationString.DISCOVERSCREEN}
          component={DiscoverScreen}
        />
        <Stack.Screen
          name={navigationString.MYPDFSCREEN}
          component={MyPdfScreen}
        />
        <Stack.Screen
          name={navigationString.MYPDFSAVEDSCREEN}
          component={MyPdfSavedScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
