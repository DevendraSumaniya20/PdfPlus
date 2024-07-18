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
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import uuid from 'react-native-uuid';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import CustomHeader from '../../components/CustomHeader';
import Bubble from '../../animation/Bubble';
import ImagePath from '../../constants/ImagePath';
import CustomTheme from '../../constants/CustomTheme';
import navigationString from '../../constants/navigationString';
import styles from './Styles';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {storeData} from '../../utils/AsyncStorage';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../redux/slices/userSlice';

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
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const requestPermission = async (
    permissionType,
    permissionMessage,
    action,
  ) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(permissionType, {
          title: `${permissionMessage} Permission`,
          message: `This app needs access to your ${permissionMessage.toLowerCase()}.`,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          action();
        } else {
          console.log(`${permissionMessage} permission denied`);
        }
      } catch (error) {
        console.error(
          `Error requesting ${permissionMessage} permission: `,
          error,
        );
      }
    } else {
      action();
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
      } else if (type === 'gallery') {
        selectedImage = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        });
      }
      if (selectedImage) {
        setImageUri(selectedImage.path);
        setSelectedImage({uri: selectedImage.path});
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignUp = useCallback(async () => {
    try {
      setLoading(true);
      if (!validation()) {
        setLoading(false);
        return;
      }

      const userSnapshot = await firebase
        .firestore()
        .collection('Users')
        .where('email', '==', email)
        .get();

      if (!userSnapshot.empty) {
        setEmailError('Email is already in use');
        setLoading(false);
        return;
      }

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const user = userCredential.user;
      const userId = uuid.v4();

      await firebase.firestore().collection('Users').doc(userId).set({
        userId: userId,
        email: user.email,
        name: name,
        imageUri: imageUri,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      const idToken = await user.getIdToken();
      await storeData('idToken', idToken);
      await storeData('accessToken', idToken);
      await storeData('userId', userId);

      const userData = {
        email,
        name,
        imageUri,
        userId,
      };

      dispatch(setUser(userData));

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
    } finally {
      setLoading(false);
    }
  }, [email, password, name, imageUri, dispatch]);

  const validation = () => {
    console.log('Validating form fields');
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

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
      setConfirmPasswordError('Please confirm your Password');
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
    }

    if (!imageUri) {
      imageError = 'Please select an image';
    }

    setEmailError(emailError);
    setPasswordError(passwordError);
    setConfirmPasswordError(confirmPasswordError);
    setNameError(nameError);
    setImageError(imageError);

    return (
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !nameError &&
      !imageError
    );
  };

  const handleImagePicker = () => {
    setModalVisible(true);
  };

  const handleImageSelection = type => {
    setModalVisible(false);
    if (type === 'camera') {
      requestPermission(PermissionsAndroid.PERMISSIONS.CAMERA, 'Camera', () =>
        openImagePicker('camera'),
      );
    } else if (type === 'gallery') {
      requestPermission(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        'Gallery',
        () => openImagePicker('gallery'),
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      contentContainerStyle={{
        paddingBottom:
          Platform.OS === 'android'
            ? moderateVerticalScale(250)
            : moderateVerticalScale(250),
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
            placeholder="Confirm Password"
            onChangeText={text => setConfirmPassword(text)}
            secureTextEntry={secureConfirmTextEntry}
            placeholderTextColor={darkmodeColor}
            rightIcon={
              secureConfirmTextEntry ? 'eye-off-outline' : 'eye-outline'
            }
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
          <View
            style={[
              styles.modalContainer,
              // {backgroundColor: darkBackgroundColor},
            ]}>
            <View
              style={[
                styles.modalView,
                {backgroundColor: darkBackgroundColor},
              ]}>
              <Text style={[styles.modalTitle, {color: darkmodeColor}]}>
                Select Image Source
              </Text>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    borderColor: darkBorderColor,
                    backgroundColor: darkBackgroundColor,
                  },
                ]}
                onPress={() => handleImageSelection('camera')}>
                <Text style={[styles.modalButtonText, {color: darkmodeColor}]}>
                  Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, {borderColor: darkBorderColor}]}
                onPress={() => handleImageSelection('gallery')}>
                <Text style={[styles.modalButtonText, {color: darkmodeColor}]}>
                  Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalCancelButton, {}]}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={[
                    styles.modalCancelButtonText,
                    {color: darkmodeColor},
                  ]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default SignUpScreen;
