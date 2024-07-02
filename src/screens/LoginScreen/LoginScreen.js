import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import CustomTheme from '../../constants/CustomTheme';
import styles from './Styles';
import Bubble from '../../animation/Bubble';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import {useDispatch, useSelector} from 'react-redux';
import {setEmail, setPassword} from '../../redux/slices/authSlice';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import navigationString from '../../constants/navigationString';
import {useNavigation} from '@react-navigation/native';
import CustomWelcomeText from '../../components/CustomWelcomeText';
import CustomDescriptionText from '../../components/CustomDescriptionText';
import ImagePath from '../../constants/ImagePath';

const LoginScreen = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const {darkmodeColor, darkBackgroundColor} = CustomTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const reduxAuth = useSelector(state => state.auth);

  const validation = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailMaxLength = 50;
    const passwordMaxLength = 30;

    setEmailError('');
    setPasswordError('');

    if (!reduxAuth.email) {
      setEmailError('Please enter Email Address');
    } else if (!emailRegex.test(reduxAuth.email)) {
      setEmailError('Invalid Email Address');
    } else if (reduxAuth.email.length > emailMaxLength) {
      setEmailError(
        `Email Address must be less than ${emailMaxLength} characters`,
      );
    }

    if (!reduxAuth.password) {
      setPasswordError('Please enter Password');
    } else if (!passwordRegex.test(reduxAuth.password)) {
      setPasswordError(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character',
      );
    } else if (reduxAuth.password.length > passwordMaxLength) {
      setPasswordError(
        `Password must be less than ${passwordMaxLength} characters`,
      );
    }

    if (!emailError && !passwordError) {
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.bubblesContainer}>
        {[...Array(10)].map((_, index) => (
          <Bubble key={index} index={index} />
        ))}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.marginContainer}>
          <View style={styles.imageView}>
            <Image
              source={ImagePath.LOGO}
              resizeMethod="auto"
              resizeMode="center"
              style={styles.image}
            />
          </View>
          <View style={styles.welcomeTextView}>
            <CustomWelcomeText
              text={'Log in'}
              inlineStyle={{color: darkmodeColor}}
            />
          </View>

          <View style={styles.inputView}>
            <View style={styles.emailView}>
              <CustomTextInput
                placeholder="Email"
                placeholderTextColor={darkmodeColor}
                onChangeText={text => dispatch(setEmail(text))}
                value={reduxAuth.email}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginBottom: moderateVerticalScale(4),
                  marginLeft: moderateScale(8),
                }}>
                <CustomErrorMessage text={emailError} style={{color: 'red'}} />
              </View>
            </View>

            <View style={styles.passwordView}>
              <CustomTextInput
                secureTextEntry={secureTextEntry}
                placeholder="Password"
                onChangeText={text => dispatch(setPassword(text))}
                value={reduxAuth.password}
                rightIcon={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                onPressRight={() => setSecureTextEntry(!secureTextEntry)}
                placeholderTextColor={darkmodeColor}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginBottom: moderateVerticalScale(4),
                  marginLeft: moderateScale(8),
                }}>
                <CustomErrorMessage
                  text={passwordError}
                  style={{color: 'red'}}
                />
              </View>
            </View>
          </View>
          <View style={styles.forgotPasswordView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(navigationString.FORGOTPASSWORDSCREEN);
              }}>
              <Text
                style={[
                  styles.forgotPasswordTextStyle,
                  {color: darkmodeColor},
                ]}>
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginButtonView}>
            <CustomButton
              text={'Login'}
              onPress={() => {
                validation();
              }}
            />
          </View>
          <View style={styles.SignUpView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(navigationString.SIGNUPSCREEN);
              }}>
              <Text style={[styles.signUpTextStyle, {color: darkmodeColor}]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
