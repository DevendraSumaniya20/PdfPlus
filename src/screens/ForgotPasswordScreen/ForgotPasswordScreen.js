import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import styles from './Styles';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomWelcomeText from '../../components/CustomWelcomeText';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import CustomDescriptionText from '../../components/CustomDescriptionText';

import CustomErrorMessage from '../../components/CustomErrorMessage';
import CustomButton from '../../components/CustomButton';
import CustomTheme from '../../constants/CustomTheme';
import CustomInput from '../../components/CustomTextInput';

const ForgotScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const navigation = useNavigation();

  const {darkmodeColor, darkBorderColor, darkBackgroundColor} = CustomTheme();

  const validation = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const emailMaxLength = 50;

    setEmailError('');

    if (!email) {
      setEmailError('Please enter email Address');
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email Address');
    } else if (email.length > emailMaxLength) {
      setEmailError(
        `Email Address must be less than ${emailMaxLength} characters`,
      );
    } else if (email.length === 0) {
      setEmailError('');
    }

    if (!emailError) {
      //   NextScreen();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={{marginHorizontal: moderateScale(16)}}>
        <CustomHeader
          iconName={'chevron-back'}
          color={darkmodeColor}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <View style={styles.welcomeTextView}>
          <CustomWelcomeText text={'Forgot Passwrord ?'} />

          <CustomDescriptionText
            text={`Confirm your email and we'll send the recover passwords to your email address.`}
            marginTop={moderateScale(8)}
            lineHeight={21}
          />
        </View>

        <View style={styles.textinputView}>
          <View style={styles.textinputName}>
            <CustomInput
              inputStyle={{width: moderateScale(250)}}
              // autoFocus={true}
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              placeholderTextColor={darkmodeColor}
            />
          </View>
          <CustomErrorMessage text={emailError} />

          <View style={{marginTop: moderateScale(0)}}>
            <CustomButton
              text={'Reset Password'}
              onPress={() => {
                // NextScreen();
                validation();
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotScreen;
