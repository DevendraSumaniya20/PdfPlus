import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import navigationString from '../constants/navigationString';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import DrawerNavigation from './DrawerNavigation';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen/ForgotPasswordScreen';

import SyllabusScreen from '../screens/Learning/SyllabusScreen/SyllabusScreen';
import BookScreen from '../screens/Learning/BookScreen/BookScreen';
import OldPaperScreen from '../screens/Learning/OldPaperScreen/OldPaperScreen';
import ImpMaterialScreen from '../screens/Learning/ImpMaterialScreen/ImpMaterialScreen';
import PaperSolutionScreen from '../screens/Learning/PaperSolutionScreen/PaperSolutionScreen';
import CourseScreen from '../screens/Learning/CourseScreen/CourseScreen';
import PdfViewerScreen from '../screens/Learning/PdfViewerScreen/PdfViewerScreen';
import ProfileScreen from '../screens/SettingScreen/OtherScreens/ProfileScreen/ProfileScreen';
import ManageNotificationScreen from '../screens/SettingScreen/OtherScreens/ManageNotificationScreen/ManageNotificationScreen';
import AboutScreen from '../screens/SettingScreen/OtherScreens/AboutScreen/AboutScreen';
import FeedbackScreen from '../screens/SettingScreen/OtherScreens/FeedbackScreen/FeedbackScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name={navigationString.LOGINSCREEN}
          component={LoginScreen}
        />
        <Stack.Screen
          name={navigationString.SIGNUPSCREEN}
          component={SignUpScreen}
        />
        <Stack.Screen
          name={navigationString.DRAWERNAVIGATION}
          component={DrawerNavigation}
        />
        <Stack.Screen
          name={navigationString.FORGOTPASSWORDSCREEN}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={navigationString.COURSESCREEN}
          component={CourseScreen}
        />
        <Stack.Screen
          name={navigationString.SYLLABUSSCREEN}
          component={SyllabusScreen}
        />
        <Stack.Screen
          name={navigationString.BOOKSCREEN}
          component={BookScreen}
        />
        <Stack.Screen
          name={navigationString.OLDPAPERSCREEN}
          component={OldPaperScreen}
        />
        <Stack.Screen
          name={navigationString.IMPMATERIALSCREEN}
          component={ImpMaterialScreen}
        />
        <Stack.Screen
          name={navigationString.PAPERSOLUTIONSCREEN}
          component={PaperSolutionScreen}
        />
        <Stack.Screen
          name={navigationString.PDFVIEWERSCREEN}
          component={PdfViewerScreen}
        />
        <Stack.Screen
          name={navigationString.PROFILESCREEN}
          component={ProfileScreen}
        />
        <Stack.Screen
          name={navigationString.MANAGENOTIFICATIONSCREEN}
          component={ManageNotificationScreen}
        />
        <Stack.Screen
          name={navigationString.ABOUTSCREEN}
          component={AboutScreen}
        />
        <Stack.Screen
          name={navigationString.FEEDBACKSCREEN}
          component={FeedbackScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
