import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {auth} from '../../config/Firebase';
import navigationString from '../../constants/navigationString';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  clearCredentials,
  setEmail,
  setPassword,
} from '../../redux/slices/authSlice';
import CustomTheme from '../../constants/CustomTheme';
import styles from './Styles';

const SettingScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {darkBackgroundColor, darkmodeColor} = CustomTheme();
  const dispatch = useDispatch();

  const signOut = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            setIsLoading(true);
            await auth.signOut();
            await AsyncStorage.clear();
            dispatch(clearCredentials());
            dispatch(setEmail(''));
            dispatch(setPassword(''));
            setIsLoading(false);
            navigation.push(navigationString.LOGINSCREEN);
          } catch (error) {
            console.error('Error during logout:', error);
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const MenuItem = ({iconName, text, onPress}) => (
    <TouchableOpacity
      style={[styles.menuItem, {backgroundColor: darkBackgroundColor}]}
      onPress={onPress}>
      <Icon name={iconName} size={moderateScale(24)} color={darkmodeColor} />
      <Text style={[styles.menuText, {color: darkmodeColor}]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      {isLoading && <ActivityIndicator size="large" color={darkmodeColor} />}
      <View style={styles.marginContainer}>
        <View style={styles.menuContainer}>
          <MenuItem
            iconName="person"
            text="Profile"
            onPress={() =>
              navigation.push(navigationString.PROFILESCREEN, {
                screenName: 'Profile',
              })
            }
          />
          <MenuItem
            iconName="notifications"
            text="Manage Notifications"
            onPress={() =>
              navigation.push(navigationString.MANAGENOTIFICATIONSCREEN, {
                screenName: 'Manage Notifications',
              })
            }
          />

          <MenuItem
            iconName="info"
            text="About Us"
            onPress={() =>
              navigation.push(navigationString.ABOUTSCREEN, {
                screenName: 'About Us',
              })
            }
          />
          <MenuItem
            iconName="feedback"
            text="Feedback"
            onPress={() =>
              navigation.push(navigationString.FEEDBACKSCREEN, {
                screenName: 'Feedback',
              })
            }
          />

          <MenuItem iconName="logout" text="Sign Out" onPress={signOut} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;
