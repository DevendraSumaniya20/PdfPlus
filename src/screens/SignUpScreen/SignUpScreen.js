import React, {useState, useCallback} from 'react';
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
  Dimensions,
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
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
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
  const [imageError, setImageError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(ImagePath.LOGOBLACK);

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();
  const navigation = useNavigation();

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
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
          openImagePicker('camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (error) {
        console.error('Error requesting camera permission: ', error);
      }
    } else {
      openImagePicker('camera');
    }
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
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
          openImagePicker('gallery');
        } else {
          console.log('Gallery permission denied');
        }
      } catch (error) {
        console.error('Error requesting gallery permission: ', error);
      }
    } else {
      openImagePicker('gallery');
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
        handleCameraImage(selectedImage);
      } else if (type === 'gallery') {
        selectedImage = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        });
        handleGalleryImage(selectedImage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCameraImage = selectedImage => {
    setImageUri(selectedImage.path);
    setSelectedImage({uri: selectedImage.path});
  };

  const handleGalleryImage = selectedImage => {
    setImageUri(selectedImage.path);
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

      // Store user data in Firestore
      await firestore().collection('Users').doc(userId).set({
        userId: userId,
        email: user.email,
        name: name,
        imageUri: imageUri, // Save image URI
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Store token in async storage
      const idToken = await user.getIdToken();
      await storeData('idToken', idToken);
      await storeData('accessToken', idToken);

      navigation.navigate(navigationString.DRAWERNAVIGATION, {
        screen: navigationString.HOMESCREEN,
        params: {
          userId: userId,
          email: user.email,
          name: name,
          imageUri: imageUri,
        },
      });
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Sign-up Error', error.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, name, imageUri, navigation]);

  const validation = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const emailMaxLength = 50;
    const passwordMaxLength = 30;
    const nameMaxLength = 50;

    let emailError = '';
    let passwordError = '';
    let confirmPasswordError = '';
    let nameError = '';
    let imageError = '';

    if (!name) {
      nameError = 'Please enter your Name';
    } else if (name.length > nameMaxLength) {
      nameError = `Name must be less than ${nameMaxLength} characters`;
    }

    if (!email) {
      emailError = 'Please enter Email Address';
    } else if (!emailRegex.test(email)) {
      emailError = 'Invalid Email Address';
    } else if (email.length > emailMaxLength) {
      emailError = `Email Address must be less than ${emailMaxLength} characters`;
    }

    if (!password) {
      passwordError = 'Please enter Password';
    } else if (!passwordRegex.test(password)) {
      passwordError =
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character';
    } else if (password.length > passwordMaxLength) {
      passwordError = `Password must be less than ${passwordMaxLength} characters`;
    }

    if (!confirmPassword) {
      confirmPasswordError = 'Please confirm your Password';
    } else if (confirmPassword !== password) {
      confirmPasswordError = 'Passwords do not match';
    }

    if (!imageUri) {
      imageError = 'Please select an image';
    }

    setEmailError(emailError);
    setPasswordError(passwordError);
    setConfirmPasswordError(confirmPasswordError);
    setNameError(nameError);
    setImageError(imageError);

    if (
      !nameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !imageError
    ) {
      handleSignUp();
    }
  };

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
        paddingBottom: moderateVerticalScale(125),
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
            style={[
              styles.imageView,
              {
                backgroundColor: 'transperent',
                borderColor: darkBorderColor,
              },
            ]}
            onPress={handleImagePicker}>
            <Image
              source={
                selectedImage && selectedImage.uri
                  ? {uri: selectedImage.uri}
                  : ImagePath.LOGOBLACK
              }
              resizeMethod="auto"
              resizeMode="center"
              style={[styles.image, {borderRadius: moderateScale(300)}]}
            />
          </TouchableOpacity>
          <CustomErrorMessage text={imageError} style={{color: 'red'}} />

          <View style={styles.inputView}>
            <CustomTextInput
              inputStyle={{width: '90%'}}
              placeholder="Full Name"
              onChangeText={text => setName(text)}
              placeholderTextColor={darkmodeColor}
            />
            <CustomErrorMessage text={nameError} style={{color: 'red'}} />

            <CustomTextInput
              inputStyle={{width: '90%'}}
              placeholder="Email"
              onChangeText={text => setEmail(text)}
              placeholderTextColor={darkmodeColor}
            />
            <CustomErrorMessage text={emailError} style={{color: 'red'}} />
          </View>

          <CustomTextInput
            secureTextEntry={secureTextEntry}
            inputStyle={{width: '90%'}}
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
              <CustomButton
                text={'Sign up'}
                onPress={() => {
                  handleSignUp();
                }}
              />
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
