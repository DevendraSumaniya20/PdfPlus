import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import CustomTheme from '../../../../constants/CustomTheme';

import CustomHeader from '../../../../components/CustomHeader';
import styles from './Styles';

const ManageNotificationScreen = ({navigation, route}) => {
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [isSMSEnabled, setIsSMSEnabled] = useState(false);
  const [areAllEnabled, setAreAllEnabled] = useState(false);

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();
  const {screenName} = route.params || {};

  const toggleEmail = () => {
    const newValue = !isEmailEnabled;
    setIsEmailEnabled(newValue);
    Alert.alert(
      'Email Notifications',
      newValue
        ? 'Email notifications have been enabled.'
        : 'Email notifications have been disabled.',
    );
  };

  const togglePush = () => {
    const newValue = !isPushEnabled;
    setIsPushEnabled(newValue);
    Alert.alert(
      'Push Notifications',
      newValue
        ? 'Push notifications have been enabled.'
        : 'Push notifications have been disabled.',
    );
  };

  const toggleSMS = () => {
    const newValue = !isSMSEnabled;
    setIsSMSEnabled(newValue);
    Alert.alert(
      'SMS Notifications',
      newValue
        ? 'SMS notifications have been enabled.'
        : 'SMS notifications have been disabled.',
    );
  };

  const toggleAllNotifications = () => {
    const newValue = !areAllEnabled;
    setIsEmailEnabled(newValue);
    setIsPushEnabled(newValue);
    setIsSMSEnabled(newValue);
    setAreAllEnabled(newValue);

    Alert.alert(
      'Notifications',
      newValue
        ? 'All notifications have been enabled.'
        : 'All notifications have been disabled.',
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.marginContainer}>
        <CustomHeader
          text={screenName}
          iconName={'chevron-back'}
          color={darkmodeColor}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.mainNotificationView}>
          <View
            style={[
              styles.settingContainer,
              {
                backgroundColor: darkBackgroundColor,
                borderColor: darkBorderColor,
              },
            ]}>
            <Text style={[styles.settingText, {color: darkmodeColor}]}>
              Enable All Notifications
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={areAllEnabled ? '#555' : '#f4f3f4'}
              onValueChange={toggleAllNotifications}
              value={areAllEnabled}
            />
          </View>
          <View
            style={[
              styles.settingContainer,
              {
                backgroundColor: darkBackgroundColor,
                borderColor: darkBorderColor,
              },
            ]}>
            <Text style={[styles.settingText, {color: darkmodeColor}]}>
              Email Notifications
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEmailEnabled ? '#555' : '#f4f3f4'}
              onValueChange={toggleEmail}
              value={isEmailEnabled}
            />
          </View>
          <View
            style={[
              styles.settingContainer,
              {
                backgroundColor: darkBackgroundColor,
                borderColor: darkBorderColor,
              },
            ]}>
            <Text style={[styles.settingText, {color: darkmodeColor}]}>
              Push Notifications
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isPushEnabled ? '#555' : '#f4f3f4'}
              onValueChange={togglePush}
              value={isPushEnabled}
            />
          </View>
          <View
            style={[
              styles.settingContainer,
              {
                backgroundColor: darkBackgroundColor,
                borderColor: darkBorderColor,
              },
            ]}>
            <Text style={[styles.settingText, {color: darkmodeColor}]}>
              SMS Notifications
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isSMSEnabled ? '#555' : '#f4f3f4'}
              onValueChange={toggleSMS}
              value={isSMSEnabled}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ManageNotificationScreen;
