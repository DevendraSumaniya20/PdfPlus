import React, {useState, useCallback, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import uuid from 'react-native-uuid';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import CustomWelcomeText from '../../components/CustomWelcomeText';
import CustomHeader from '../../components/CustomHeader';
import Bubble from '../../animation/Bubble';
import ImagePath from '../../constants/ImagePath';
import CustomTheme from '../../constants/CustomTheme';
import navigationString from '../../constants/navigationString';
import styles from './Styles';
import {useNavigation} from '@react-navigation/native';
import {auth} from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {storeData} from '../../utils/AsyncStorage';
import {moderateVerticalScale, scale} from 'react-native-size-matters';
import ImagePicker from 'react-native-image-crop-picker';

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
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(ImagePath.LOGOBLACK);

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();
  const navigation = useNavigation();

  useEffect(() => {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNameError('');
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        openImagePicker('camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Error requesting camera permission: ', error);
    }
  };

  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'This app needs access to your gallery.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Gallery permission granted');
        openImagePicker('gallery');
      } else {
        console.log('Gallery permission denied');
      }
    } catch (error) {
      console.error('Error requesting gallery permission: ', error);
    }
  };

  const openImagePicker = async type => {
    try {
      let selectedImage;
      if (type === 'camera') {
        selectedImage = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        });
        console.log('Image from camera:', selectedImage);
        handleCameraImage(selectedImage);
      } else if (type === 'gallery') {
        selectedImage = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        });
        console.log('Image from gallery:', selectedImage);
        handleGalleryImage(selectedImage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCameraImage = selectedImage => {
    setSelectedImage({uri: selectedImage.path});
  };

  const handleGalleryImage = selectedImage => {
    setSelectedImage({uri: selectedImage.path});
  };

  const handleSignUp = useCallback(async () => {
    try {
      setLoading(true);

      // Validate form fields
      if (!validation()) {
        setLoading(false);
        return;
      }

      // Check if email is already in use
      const userSnapshot = await firestore()
        .collection('Users')
        .where('email', '==', email)
        .get();

      if (!userSnapshot.empty) {
        console.error('Sign-up error: Email is already in use');
        setEmailError('Email is already in use');
        setLoading(false);
        return;
      }

      const userId = uuid.v4();

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log('User signed up successfully:', user);

      // Store user data in Firestore
      await firestore().collection('Users').doc(userId).set({
        userId: userId,
        email: user.email,
        name: name,
        imageUri: imageUri, // Save image URI
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('User data saved to Firestore');

      // Store token in async storage
      const idToken = await user.getIdToken();
      await storeData('idToken', idToken);
      await storeData('accessToken', idToken);

      // Navigate to the home screen with necessary params
      navigation.navigate(navigationString.DRAWERNAVIGATION, {
        screen: navigationString.HOMESCREEN,
        params: {
          userId: userId,
          email: user.email,
          name: name, // Pass the name here
          imageUri: imageUri, // Pass the image URI here
        },
      });
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Sign-up Error', error.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, name, imageUri, navigation]);

  const validation = useCallback(() => {
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
      handleSignUp();
    }
  }, [
    name,
    email,
    password,
    confirmPassword,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    handleSignUp,
  ]);

  const handleImagePicker = () => {
    setModalVisible(true);
  };

  const handleImageSelection = type => {
    setModalVisible(false);
    if (type === 'camera') {
      requestCameraPermission();
    } else if (type === 'gallery') {
      requestGalleryPermission();
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
          <TouchableOpacity
            style={styles.imageView}
            onPress={handleImagePicker}>
            <Image
              source={
                selectedImage && selectedImage.uri
                  ? {uri: selectedImage.uri}
                  : ImagePath.LOGOBLACK
              }
              resizeMethod="auto"
              resizeMode="center"
              style={[styles.image, {borderRadius: 50}]}
            />
          </TouchableOpacity>

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
            <CustomTextInput
              placeholder="Full Name"
              onChangeText={text => setName(text)}
              placeholderTextColor={darkmodeColor}
            />
            <CustomErrorMessage text={nameError} style={{color: 'red'}} />

            <CustomTextInput
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              placeholderTextColor={darkmodeColor}
            />
            <CustomErrorMessage text={emailError} style={{color: 'red'}} />
          </View>

          <CustomTextInput
            secureTextEntry={secureTextEntry}
            placeholder="Password"
            onChangeText={text => setPassword(text)}
            rightIcon={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
            onPressRight={() => setSecureTextEntry(!secureTextEntry)}
            placeholderTextColor={darkmodeColor}
          />
          <CustomErrorMessage text={passwordError} style={{color: 'red'}} />

          <CustomTextInput
            placeholderTextColor={darkmodeColor}
            inputStyle={{width: '90%'}}
            secureTextEntry={secureConfirmTextEntry}
            placeholder="Confirm Password"
            rightIcon={
              secureConfirmTextEntry ? 'eye-off-outline' : 'eye-outline'
            }
            onChangeText={text => setConfirmPassword(text)}
            onPressRight={() =>
              setSecureConfirmTextEntry(!secureConfirmTextEntry)
            }
          />
          <CustomErrorMessage
            text={confirmPasswordError}
            style={{color: 'red'}}
          />

          <View style={styles.loginButtonView}>
            {loading ? (
              <ActivityIndicator size="small" color={darkmodeColor} />
            ) : (
              <CustomButton text={'Sign up'} onPress={handleSignUp} />
            )}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalView]}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={() => handleImageSelection('camera')}>
                <Text style={styles.modalButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={() => handleImageSelection('gallery')}>
                <Text style={styles.modalButtonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default SignUpScreen;
