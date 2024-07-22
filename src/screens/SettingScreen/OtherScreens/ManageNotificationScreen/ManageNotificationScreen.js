import React, {useState} from 'react';
import {StyleSheet, Text, View, Switch, ScrollView} from 'react-native';
import CustomTheme from '../../../../constants/CustomTheme';

const ManageNotificationScreen = () => {
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [isSMSenabled, setIsSMSEnabled] = useState(false);

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  const toggleEmail = () => setIsEmailEnabled(previousState => !previousState);
  const togglePush = () => setIsPushEnabled(previousState => !previousState);
  const toggleSMS = () => setIsSMSEnabled(previousState => !previousState);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: darkBackgroundColor},
      ]}>
      <Text style={[styles.title, {color: darkmodeColor}]}>
        Manage Notifications
      </Text>
      <View
        style={[
          styles.settingContainer,
          {backgroundColor: darkBackgroundColor, borderColor: darkBorderColor},
        ]}>
        <Text style={[styles.settingText, {color: darkmodeColor}]}>
          Email Notifications
        </Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEmailEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleEmail}
          value={isEmailEnabled}
        />
      </View>
      <View
        style={[
          styles.settingContainer,
          {backgroundColor: darkBackgroundColor, borderColor: darkBorderColor},
        ]}>
        <Text style={[styles.settingText, {color: darkmodeColor}]}>
          Push Notifications
        </Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isPushEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={togglePush}
          value={isPushEnabled}
        />
      </View>
      <View
        style={[
          styles.settingContainer,
          {backgroundColor: darkBackgroundColor, borderColor: darkBorderColor},
        ]}>
        <Text style={[styles.settingText, {color: darkmodeColor}]}>
          SMS Notifications
        </Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isSMSenabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSMS}
          value={isSMSenabled}
        />
      </View>
    </ScrollView>
  );
};

export default ManageNotificationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  settingText: {
    fontSize: 18,
  },
});
