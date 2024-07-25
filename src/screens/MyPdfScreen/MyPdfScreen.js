import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated, // Import Animated
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';

const MyPdfScreen = () => {
  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedPage, setSearchedPage] = useState(null);
  const [pdfName, setPdfName] = useState('');

  const scaleAnim = useRef(new Animated.Value(1)).current; // Initialize animated value

  // Request storage permission
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      console.log('Android Permission Result:', result);
      if (result !== RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Cannot access storage on Android.');
      }
      return result === RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      console.log('iOS Permission Result:', result);
      if (result !== RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Cannot access media library on iOS.');
      }
      return result === RESULTS.GRANTED;
    }
    return true;
  };

  // Handle PDF selection with animation
  const handleChoosePdf = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(); // Trigger the animation

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      return;
    }

    try {
      setLoading(true);
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      const fileUri = res[0].uri;
      const destPath = `${RNFS.DocumentDirectoryPath}/${res[0].name}`;
      await RNFS.copyFile(fileUri, destPath);

      setPdfUri(`file://${destPath}`);
      setPdfName(res[0].name);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'No file selected');
      } else {
        Alert.alert('Error', 'Failed to pick a PDF file');
        console.error(err);
      }
    }
  };

  // Handle PDF share
  const handleSharePdf = async () => {
    if (pdfUri) {
      const options = {
        url: pdfUri,
        type: 'application/pdf',
      };

      try {
        await Share.open(options);
      } catch (error) {
        console.log('Error while sharing PDF:', error);
        Alert.alert('Error', 'Failed to share PDF.');
      }
    }
  };

  // Handle search text and navigate to page
  const handleSearch = () => {
    const page = parseInt(searchText, 10);
    if (page > 0 && page <= numberOfPages) {
      setSearchedPage(page);
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Page number out of range.');
    }
  };

  return (
    <View style={styles.container}>
      {!pdfUri && (
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <Button title="Choose PDF" onPress={handleChoosePdf} />
        </Animated.View>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {pdfUri && !loading && (
        <>
          <View style={styles.header}>
            <Text style={styles.pdfName}>{pdfName}</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setModalVisible(true)}>
              <Icon name="ellipsis-vertical" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <Pdf
            trustAllCerts={false}
            source={{uri: pdfUri}}
            onLoadComplete={numberOfPages => {
              setNumberOfPages(numberOfPages);
              setIsLoading(false);
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={page => {
              setCurrentPage(page);
              console.log(`Current page: ${page}`);
            }}
            onError={error => {
              console.log('Error while loading PDF:', error);
              Alert.alert('Error', 'Failed to load PDF.');
              setIsLoading(false);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            page={searchedPage || 1}
            scale={1.0}
            style={styles.pdf}
          />
          <View style={styles.footer}>
            <Text>
              Page {currentPage} of {numberOfPages}
            </Text>
          </View>
        </>
      )}
      {!pdfUri && !loading && <Text>No PDF selected</Text>}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}>
            <Icon name="close" size={30} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter page number"
            keyboardType="numeric"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Button title="Go to page" onPress={handleSearch} />
          <Button title="Share PDF" onPress={handleSharePdf} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 8,
    backgroundColor: '#f8f8f8',
  },
  pdfName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 8,
    backgroundColor: '#f8f8f8',
    width: '100%',
    alignItems: 'center',
  },
  iconButton: {
    zIndex: 1,
  },
  modalView: {
    marginTop: 60,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: '80%',
  },
});

export default MyPdfScreen;
