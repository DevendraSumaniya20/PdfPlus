import React, {useState} from 'react';
import {View, TouchableOpacity, Alert, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {auth} from '../../config/Firebase';
import navigationString from '../../constants/navigationString';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

import {
  clearCredentials,
  setEmail,
  setPassword,
} from '../../redux/slices/authSlice';
import CustomTheme from '../../constants/CustomTheme';

const SettingScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {darkBackgroundColor, darkBorderColor, darkmodeColor} = CustomTheme();
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

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={{marginHorizontal: moderateScale(16)}}>
        <TouchableOpacity
          style={[styles.menuItem, {backgroundColor: darkBackgroundColor}]}
          onPress={signOut}>
          <Text style={[styles.menuText, {color: darkmodeColor}]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  menuItem: {
    marginTop: moderateVerticalScale(52),
  },
});
