import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import navigationString from '../constants/navigationString';
import BottomTabNavigation from './BottomTabNavigation';
import DiscoverScreen from '../screens/DiscoverScreen/DiscoverScreen';
import MyPdfScreen from '../screens/MyPdfScreen/MyPdfScreen';
import MyPdfSavedScreen from '../screens/MyPdfSavedScreen/MyPdfSavedScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator screenOptions={{}}>
      <Drawer.Screen
        name={navigationString.BOTTOMTABNAVIGATION}
        component={BottomTabNavigation}
        options={{
          headerShown: false,
          drawerLabel: 'Home',
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
