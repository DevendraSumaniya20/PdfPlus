import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import CustomTheme from '../../constants/CustomTheme';
import styles from './Styles';
import Bubble from '../../animation/Bubble';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import {useDispatch, useSelector} from 'react-redux';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import navigationString from '../../constants/navigationString';
import {useNavigation} from '@react-navigation/native';
import CustomWelcomeText from '../../components/CustomWelcomeText';
import ImagePath from '../../constants/ImagePath';
import CustomHeader from '../../components/CustomHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignUpScreen = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const {darkmodeColor, darkBackgroundColor} = CustomTheme();

  const navigation = useNavigation();

  const validation = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailMaxLength = 50;
    const passwordMaxLength = 30;
    const nameMaxLength = 50;

    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNameError('');

    if (!name) {
      setNameError('Please enter your Name');
    } else if (name.length > nameMaxLength) {
      setNameError(`Name must be less than ${nameMaxLength} characters`);
    }

    if (!email) {
      setEmailError('Please enter Email Address');
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid Email Address');
    } else if (email.length > emailMaxLength) {
      setEmailError(
        `Email Address must be less than ${emailMaxLength} characters`,
      );
    }

    if (!password) {
      setPasswordError('Please enter Password');
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character',
      );
    } else if (password.length > passwordMaxLength) {
      setPasswordError(
        `Password must be less than ${passwordMaxLength} characters`,
      );
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your Password');
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
    }

    if (!nameError && !emailError && !passwordError && !confirmPasswordError) {
      navigation.navigate(navigationString.DRAWERNAVIGATION);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      contentContainerStyle={{
        paddingBottom: moderateVerticalScale(120),
        backgroundColor: darkBackgroundColor,
      }}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <SafeAreaView
        style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
        <View style={styles.bubblesContainer}>
          {[...Array(10)].map((_, index) => (
            <Bubble key={index} index={index} />
          ))}
        </View>

        <View style={styles.marginContainer}>
          <View style={{marginTop: moderateVerticalScale(8)}}>
            <CustomHeader
              iconName={'chevron-back'}
              color={darkmodeColor}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <View style={styles.imageView}>
            <Image
              source={
                darkmodeColor == '#000'
                  ? ImagePath.LOGOBLACK
                  : ImagePath.LOGOWHITE
              }
              resizeMethod="auto"
              resizeMode="center"
              style={styles.image}
            />
          </View>
          <View style={styles.welcomeTextView}>
            <CustomWelcomeText
              text={'Sign up'}
              inlineStyle={{color: darkmodeColor}}
              fontFamily="Poppins"
              fontSize={scale(24)}
              fontWeight="700"
            />
          </View>

          <View style={styles.inputView}>
            <View style={styles.emailView}>
              <CustomTextInput
                placeholder="Full Name"
                onChangeText={text => setName(text)}
                placeholderTextColor={darkmodeColor}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginBottom: moderateVerticalScale(4),
                  marginLeft: moderateScale(8),
                }}>
                <CustomErrorMessage text={nameError} style={{color: 'red'}} />
              </View>
            </View>
            <View style={styles.emailView}>
              <CustomTextInput
                placeholder="Email"
                onChangeText={text => setEmail(text)}
                placeholderTextColor={darkmodeColor}
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
                onChangeText={text => setPassword(text)}
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
            <View style={styles.passwordView}>
              <CustomTextInput
                placeholderTextColor={darkmodeColor}
                inputStyle={{width: '90%'}}
                secureTextEntry={secureConfirmTextEntry}
                placeholder="Confirm Password"
                rightIcon={
                  setSecureConfirmTextEntry ? 'eye-off-outline' : 'eye-outline'
                }
                onChangeText={text => setConfirmPassword(text)}
                onPressRight={() =>
                  setSecureConfirmTextEntry(!secureConfirmTextEntry)
                }
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginBottom: moderateVerticalScale(4),
                  marginLeft: moderateScale(8),
                }}>
                <CustomErrorMessage
                  text={confirmPasswordError}
                  style={{color: 'red'}}
                />
              </View>
            </View>
          </View>

          <View style={styles.loginButtonView}>
            <CustomButton
              text={'Sign up'}
              onPress={() => {
                validation();
              }}
            />
          </View>
          <View style={styles.SignUpView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(navigationString.LOGINSCREEN);
              }}>
              <Text style={[styles.signUpTextStyle, {color: darkmodeColor}]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default SignUpScreen;
