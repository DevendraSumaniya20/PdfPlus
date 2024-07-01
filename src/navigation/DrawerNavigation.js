import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import navigationString from '../constants/navigationString';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen/DiscoverScreen';
import MyPdfScreen from '../screens/MyPdfScreen/MyPdfScreen';
import MyPdfSavedScreen from '../screens/MyPdfSavedScreen/MyPdfSavedScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name={navigationString.HOMESCREEN}
        component={HomeScreen}
        options={{
          drawerLabel: 'Home',
          headerShown: false,

          drawerIcon: ({color}) => (
            <MaterialIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={navigationString.DISCOVERSCREEN}
        component={DiscoverScreen}
        options={{
          drawerLabel: 'Discover',
          headerShown: false,
          drawerIcon: ({color}) => (
            <Ionicons name="search" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name={navigationString.MYPDFSCREEN}
        component={MyPdfScreen}
        options={{
          drawerLabel: 'My Pdf',
          headerShown: false,
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons
              name="file-pdf-box"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={navigationString.MYPDFSAVEDSCREEN}
        component={MyPdfSavedScreen}
        options={{
          drawerLabel: 'Saved',
          headerShown: false,
          drawerIcon: ({color}) => (
            <Ionicons name="bookmark-outline" color={color} size={24} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
