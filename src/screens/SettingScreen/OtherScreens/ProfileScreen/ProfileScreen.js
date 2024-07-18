import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImageCropPicker from 'react-native-image-crop-picker';
import CustomTheme from '../../../../constants/CustomTheme';
import CustomInput from '../../../../components/CustomTextInput';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  const {darkBackgroundColor, darkmodeColor} = CustomTheme();

  useEffect(() => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      firestore()
        .collection('Users')
        .doc(currentUser.uid)
        .get()
        .then(documentSnapshot => {
          const userData = documentSnapshot.data();
          if (userData) {
            setUser(userData);
            setName(userData.name);
            setEmail(currentUser.email); // Use Firestore email if needed
            setPhotoURL(userData.imageUri);
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      Alert.alert('No user logged in', 'Please log in to access your profile.');
    }
  }, []);

  const updateProfile = () => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      Alert.alert('No user logged in', 'Please log in to update your profile.');
      return;
    }

    const updates = {};

    if (password) {
      currentUser
        .updatePassword(password)
        .catch(error => console.error('Error updating password:', error));
    }

    if (email !== user.email) {
      updates.email = email;
      currentUser
        .updateEmail(email)
        .catch(error => console.error('Error updating email:', error));
    }

    if (name !== user.name || photoURL !== user.imageUri) {
      updates.name = name;
      updates.imageUri = photoURL;
    }

    if (Object.keys(updates).length > 0) {
      firestore()
        .collection('Users')
        .doc(currentUser.uid)
        .update(updates)
        .then(() => {
          console.log('Profile updated successfully');
        })
        .catch(error =>
          console.error('Error updating Firestore document:', error),
        );
    } else {
      Alert.alert('No changes made', 'Please update your profile information.');
    }
  };

  const chooseImage = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => openGallery(),
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        setPhotoURL(image.path);
      })
      .catch(error => console.error('Camera error:', error));
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        setPhotoURL(image.path);
      })
      .catch(error => console.error('Gallery error:', error));
  };

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <TouchableOpacity onPress={chooseImage}>
        <Image
          source={{uri: photoURL || 'https://via.placeholder.com/150'}}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <CustomInput
        placeholderTextColor={darkmodeColor}
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <CustomInput
        placeholderTextColor={darkmodeColor}
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomInput
        placeholderTextColor={darkmodeColor}
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
});
