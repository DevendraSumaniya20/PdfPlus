import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{uri: imageUri}} style={styles.profileImage} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.info}>No Image Available</Text>
        )}
      </View>

      <Text style={styles.info}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text style={styles.info}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter your email"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image Source</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => openImagePicker('camera')}>
              <Text style={styles.modalButtonText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => openImagePicker('gallery')}>
              <Text style={styles.modalButtonText}>Open Gallery</Text>
            </TouchableOpacity>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  info: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
