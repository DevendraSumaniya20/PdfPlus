import React, {useState, useEffect, useCallback} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import CustomTheme from '../../constants/CustomTheme';
import styles from './Styles';
import Bubble from '../../animation/Bubble';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import {setEmail, setPassword} from '../../redux/slices/authSlice';
import {scale} from 'react-native-size-matters';
import navigationString from '../../constants/navigationString';
import CustomWelcomeText from '../../components/CustomWelcomeText';
import ImagePath from '../../constants/ImagePath';
import {auth} from '../../config/Firebase';
import {getData, storeData} from '../../utils/AsyncStorage';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const {darkmodeColor, darkBackgroundColor} = CustomTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const reduxAuth = useSelector(state => state.auth);

  useEffect(() => {
    checkTokens();
  }, []);

  const checkTokens = useCallback(async () => {
    try {
      const accessToken = await getData('accessToken');
      const storedImageUri = await getData('imageUri');
      setImageUri(storedImageUri);

      if (accessToken) {
        navigation.navigate(navigationString.DRAWERNAVIGATION, {
          screen: navigationString.HOMESCREEN,
        });
      } else {
        console.log('Access Token not found. Navigating to LoginScreen...');
        navigation.navigate(navigationString.LOGINSCREEN);
      }
    } catch (error) {
      console.error('Error checking tokens:', error);
    }
  }, [navigation]);

  const validation = useCallback(() => {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailMaxLength = 50;
    const passwordMaxLength = 30;
    let valid = true;

    if (!reduxAuth.email) {
      setEmailError('Please enter Email Address');
      valid = false;
    } else if (!emailRegex.test(reduxAuth.email)) {
      setEmailError('Invalid Email Address');
      valid = false;
    } else if (reduxAuth.email.length > emailMaxLength) {
      setEmailError(
        `Email Address must be less than ${emailMaxLength} characters`,
      );
      valid = false;
    } else {
      setEmailError('');
    }

    if (!reduxAuth.password) {
      setPasswordError('Please enter Password');
      valid = false;
    } else if (!passwordRegex.test(reduxAuth.password)) {
      setPasswordError(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character',
      );
      valid = false;
    } else if (reduxAuth.password.length > passwordMaxLength) {
      setPasswordError(
        `Password must be less than ${passwordMaxLength} characters`,
      );
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      handleLogin();
    }
  }, [reduxAuth.email, reduxAuth.password, handleLogin]);

  const handleLogin = useCallback(async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        reduxAuth.email,
        reduxAuth.password,
      );
      const user = userCredential.user;
      console.log('User signed in successfully:', user);

      const idToken = await user.getIdToken();
      await storeData('idToken', idToken);
      await storeData('accessToken', idToken);

      const snapshot = await firestore()
        .collection('Users')
        .where('email', '==', reduxAuth.email)
        .get();
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        const userId = userData.userId;
        const name = userData.name;
        const imageUri = userData.imageUri;

        await storeData('userId', userId);
        await storeData('imageUri', imageUri); // store image URI in AsyncStorage
        setImageUri(imageUri); // update state with the new image URI

        console.log('User data:', userData);

        navigation.navigate(navigationString.DRAWERNAVIGATION, {
          screen: navigationString.HOMESCREEN,
          params: {
            userId: userId,
            email: reduxAuth.email,
            name: name,
            imageUri: imageUri,
          },
        });
      } else {
        Alert.alert('User Not Found!');
      }
    } catch (error) {
      console.error('Sign-in error:', error.message);
      Alert.alert('Sign-in Error', error.message);
    } finally {
      setLoading(false);
    }
  }, [reduxAuth.email, reduxAuth.password, navigation]);

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
            {imageUri ? (
              <Image
                source={{uri: imageUri}}
                resizeMethod="auto"
                resizeMode="center"
                style={styles.image}
              />
            ) : (
              <Image
                source={
                  darkmodeColor === '#000'
                    ? ImagePath.LOGOBLACK
                    : ImagePath.LOGOWHITE
                }
                resizeMethod="auto"
                resizeMode="center"
                style={styles.image}
              />
            )}
          </View>
          <View style={styles.welcomeTextView}>
            <CustomWelcomeText
              text={'Log in'}
              inlineStyle={{color: darkmodeColor}}
              fontFamily="Poppins"
              fontSize={scale(24)}
              fontWeight="700"
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
              <CustomErrorMessage text={emailError} style={{color: 'red'}} />
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
              <CustomErrorMessage text={passwordError} style={{color: 'red'}} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordView}
            onPress={() =>
              navigation.navigate(navigationString.FORGOTPASSWORDSCREEN)
            }>
            <Text
              style={[styles.forgotPasswordTextStyle, {color: darkmodeColor}]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View style={styles.loginButtonView}>
            {loading ? (
              <ActivityIndicator size="small" color={darkmodeColor} />
            ) : (
              <CustomButton text={'Login'} onPress={validation} />
            )}
          </View>

          <TouchableOpacity
            style={styles.SignUpView}
            onPress={() => navigation.navigate(navigationString.SIGNUPSCREEN)}>
            <Text style={[styles.signUpTextStyle, {color: darkmodeColor}]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
