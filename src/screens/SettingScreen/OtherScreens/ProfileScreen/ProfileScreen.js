import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import CustomTheme from '../../../../constants/CustomTheme';
import CustomInput from '../../../../components/CustomTextInput';
import CustomButton from '../../../../components/CustomButton';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomHeader from '../../../../components/CustomHeader';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const userDoc = await firebase
            .firestore()
            .collection('Users')
            .doc(userId)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUser(userData);
            setName(userData.name || '');
            setEmail(userData.email || '');
            setImageUri(userData.imageUri || '');
          } else {
            console.log('User document does not exist in Firestore');
          }
        } else {
          console.log('No user ID found in local storage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        await firebase.firestore().collection('Users').doc(userId).update({
          name,
          email,
          imageUri,
        });
        showToast('Profile updated successfully');
      } else {
        Alert.alert('Error', 'No user ID found');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile');
    }
  };

  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  if (loading) {
    return (
      <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
        <ActivityIndicator size="large" color={darkmodeColor} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
        <Text style={[styles.title, {color: darkmodeColor}]}>
          No user data available
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.marginContainer}>
        <CustomHeader
          iconName={'chevron-back'}
          color={darkmodeColor}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.imageContainer}>
          {imageUri ? (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={{uri: imageUri}}
                style={[styles.profileImage, {borderColor: darkBorderColor}]}
              />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.info, {color: darkmodeColor}]}>
              No Image Available
            </Text>
          )}
        </View>

        <Text style={[styles.info, {color: darkmodeColor}]}>Name:</Text>
        <CustomInput
          placeholderTextColor={darkmodeColor}
          onChangeText={setName}
          placeholder="Edit your Name"
          value={name}
        />

        <Text style={[styles.info, {color: darkmodeColor}]}>Email:</Text>
        <CustomInput
          placeholderTextColor={darkmodeColor}
          onChangeText={setEmail}
          placeholder="Edit your Email"
          value={email}
        />

        <View style={{marginVertical: moderateVerticalScale(16)}}>
          <CustomButton onPress={handleUpdate} text={'Update Profile'} />
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalContainer,
              {
                // backgroundColor: '#2c2a2a',
                borderColor: darkBorderColor,
              },
            ]}>
            <View
              style={[
                styles.modalContent,
                {backgroundColor: darkBackgroundColor},
              ]}>
              <Text style={[styles.modalTitle, {color: darkmodeColor}]}>
                Select Image Source
              </Text>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: darkBackgroundColor,
                    borderColor: darkBorderColor,
                  },
                ]}
                onPress={() => openImagePicker('camera')}>
                <Text style={[styles.modalButtonText, {color: darkmodeColor}]}>
                  Open Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: darkBackgroundColor,
                    borderColor: darkBorderColor,
                  },
                ]}
                onPress={() => openImagePicker('gallery')}>
                <Text style={[styles.modalButtonText, {color: darkmodeColor}]}>
                  Open Gallery
                </Text>
              </TouchableOpacity>
              <Pressable
                style={[
                  styles.modalCloseButton,
                  {
                    backgroundColor: darkBackgroundColor,
                    borderColor: darkBorderColor,
                  },
                ]}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={[styles.modalCloseButtonText, {color: darkmodeColor}]}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginContainer: {
    margin: moderateScale(16),
  },
  title: {
    fontSize: scale(24),
    fontWeight: '700',
    marginBottom: moderateScale(24),
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: moderateVerticalScale(26),
  },
  info: {
    fontSize: scale(18),
    marginBottom: moderateVerticalScale(8),
  },

  profileImage: {
    width: moderateScale(120),
    height: moderateVerticalScale(120),
    borderRadius: moderateScale(100),
    borderWidth: 0.5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: moderateScale(20),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: scale(20),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(20),
  },
  modalButton: {
    borderRadius: moderateScale(8),
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(8),
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: scale(16),
    fontWeight: '600',
  },
  modalCloseButton: {
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateVerticalScale(20),
    marginTop: moderateVerticalScale(8),
  },
  modalCloseButtonText: {
    fontSize: scale(16),
    fontWeight: '400',
  },
});

export default ProfileScreen;
