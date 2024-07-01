import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import navigationString from '../constants/navigationString';
import Color from '../constants/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen/DiscoverScreen';
import MyPdfScreen from '../screens/MyPdfScreen/MyPdfScreen';
import MyPdfSavedScreen from '../screens/MyPdfSavedScreen/MyPdfSavedScreen';

const BottomTabNavigation = () => {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={navigationString.HOMESCREEN}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: Color.BLACK},
        tabBarActiveTintColor: Color.RED,
        tabBarInactiveTintColor: Color.GRAY,
      }}>
      <Tab.Screen
        name={navigationString.HOMESCREEN}
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" color={color} size={24} />
          ),
          tabBarLabel: 'Home',
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
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
