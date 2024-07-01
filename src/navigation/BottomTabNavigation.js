import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import navigationString from '../constants/navigationString';
import Color from '../constants/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DiscoverScreen from '../screens/DiscoverScreen/DiscoverScreen';
import MyPdfScreen from '../screens/MyPdfScreen/MyPdfScreen';
import MyPdfSavedScreen from '../screens/MyPdfSavedScreen/MyPdfSavedScreen';
import DrawerNavigation from './DrawerNavigation';

const BottomTabNavigation = () => {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name={navigationString.DRAWERNAVIGATION}
        component={DrawerNavigation}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" color={color} size={24} />
          ),
          tabBarLabel: 'Home',
          tabBarStyle: {backgroundColor: Color.BLACK},
          tabBarActiveTintColor: Color.RED,
          tabBarInactiveTintColor: Color.GRAY,
        }}
      />
      <Tab.Screen
        name={navigationString.DISCOVERSCREEN}
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="search" color={color} size={24} />
          ),
          tabBarLabel: 'Discover',
          tabBarStyle: {backgroundColor: Color.BLACK},
          tabBarActiveTintColor: Color.RED,
          tabBarInactiveTintColor: Color.GRAY,
        }}
      />
      <Tab.Screen
        name={navigationString.MYPDFSCREEN}
        component={MyPdfScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="file-pdf-box"
              color={color}
              size={24}
            />
          ),
          tabBarLabel: 'My Pdf',
          tabBarStyle: {backgroundColor: Color.BLACK},
          tabBarActiveTintColor: Color.RED,
          tabBarInactiveTintColor: Color.GRAY,
        }}
      />
      <Tab.Screen
        name={navigationString.MYPDFSAVEDSCREEN}
        component={MyPdfSavedScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="bookmark-outline" color={color} size={24} />
          ),
          tabBarLabel: 'Saved',
          tabBarStyle: {backgroundColor: Color.BLACK},
          tabBarActiveTintColor: Color.RED,
          tabBarInactiveTintColor: Color.GRAY,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
