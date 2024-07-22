import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Platform,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';

import {moderateScale, scale} from 'react-native-size-matters';
import CustomTheme from '../../constants/CustomTheme';
import CustomIcon from '../../components/CustomIcon';

const MyPdfScreen = () => {
  const [pdfUri, setPdfUri] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pageToGo, setPageToGo] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const pdfRef = useRef(null);
  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const permissions = Platform.select({
        ios: [PERMISSIONS.IOS.PHOTO_LIBRARY],
        android: [
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ],
      });

      const results = await Promise.all(
        permissions.map(permission => request(permission)),
      );
      const allGranted = results.every(result => result === RESULTS.GRANTED);

      if (allGranted) {
        setPermissionGranted(true);
      } else {
        Alert.alert(
          'Permission required',
          'Storage permissions are needed to select and display PDF files.',
        );
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  };

  const pickPdf = async () => {
    if (!permissionGranted) {
      Alert.alert(
        'Permission required',
        'Please grant storage permissions to pick a PDF file.',
      );
      return;
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      const fileUri = res[0].uri;

      if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
        const filePath = `${RNFS.CachesDirectoryPath}/${res[0].name}`;
        await RNFS.copyFile(fileUri, filePath);
        setPdfUri(filePath);
      } else {
        const filePath = fileUri.replace('file://', '');
        setPdfUri(filePath);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        Alert.alert('Error', 'Failed to pick the PDF file.');
      }
    }
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleLoadComplete = numberOfPages => {
    setTotalPages(numberOfPages);
    setIsLoading(false);
  };

  const goToPage = () => {
    const pageNumber = parseInt(pageToGo, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      pdfRef.current.setPage(pageNumber);
      setCurrentPage(pageNumber);
      setModalVisible(false);
    } else {
      Alert.alert(
        'Invalid Page Number',
        `Please enter a valid page number between 1 and ${totalPages}.`,
      );
    }
  };

  const handleSearch = () => {
    // Implement search functionality here
    Alert.alert('Search', `Searching for: ${searchText}`);
  };

  const confirmDownload = async () => {
    const fileName = pdfUri.substring(pdfUri.lastIndexOf('/') + 1);
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    try {
      const exists = await RNFS.exists(destPath);
      if (exists) {
        Alert.alert(
          'File already downloaded',
          'The file is already downloaded.',
        );
        return;
      }

      const downloadOptions = {
        fromUrl: pdfUri,
        toFile: destPath,
      };

      const downloadResult = await RNFS.downloadFile(downloadOptions).promise;
      if (downloadResult.statusCode === 200) {
        Alert.alert(
          'Download complete',
          'Pdf downloaded successfully! Click to view',
        );
      } else {
        Alert.alert('Download failed', 'Failed to download the PDF.');
      }
    } catch (error) {
      Alert.alert('Download error', 'Failed to download the PDF.');
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <CustomIcon
            type="MaterialCommunityIcons"
            color={darkmodeColor}
            name={'dots-vertical'}
            size={scale(24)}
          />
        </TouchableOpacity>
      </View>
      <Button title="Pick PDF" onPress={pickPdf} />
      {pdfUri ? (
        <View style={styles.pdfContainer}>
          <Pdf
            trustAllCerts={false}
            ref={pdfRef}
            source={{uri: pdfUri, cache: true}}
            onPageChanged={handlePageChange}
            onLoadComplete={handleLoadComplete}
            onError={error => {
              console.error('PDF error:', error);
              Alert.alert('Error', 'Failed to load PDF.');
              setIsLoading(false);
            }}
            style={styles.pdf}
          />
          {isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={darkmodeColor} />
            </View>
          )}
          <Text style={[styles.pageInfo, {color: darkmodeColor}]}>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity
            onPress={() => setSearchModalVisible(true)}
            style={styles.actionButton}>
            <Text style={[styles.buttonText, {color: darkmodeColor}]}>
              Search
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}>
            <Text style={[styles.buttonText, {color: darkmodeColor}]}>
              Go to Page
            </Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <View style={[styles.modalContainer, {borderColor: darkmodeColor}]}>
              <View style={[styles.modalView, {borderColor: darkBorderColor}]}>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: darkBorderColor, color: darkmodeColor},
                  ]}
                  placeholder="Enter page number"
                  keyboardType="numeric"
                  value={pageToGo}
                  onChangeText={setPageToGo}
                />
                <TouchableOpacity
                  onPress={goToPage}
                  style={[
                    styles.openButton,
                    {backgroundColor: darkBackgroundColor},
                  ]}>
                  <Text style={[styles.buttonText, {color: darkmodeColor}]}>
                    Go
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[
                    styles.openButton,
                    {backgroundColor: darkBackgroundColor},
                  ]}>
                  <Text style={[styles.buttonText, {color: darkmodeColor}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDownload}
                  style={[
                    styles.openButton,
                    {backgroundColor: darkBackgroundColor},
                  ]}>
                  <Text style={[styles.buttonText, {color: darkmodeColor}]}>
                    Download PDF
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            visible={searchModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setSearchModalVisible(false)}>
            <View
              style={[
                styles.modalContainer,
                {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
              ]}>
              <View
                style={[
                  styles.modalView,
                  {backgroundColor: darkBackgroundColor},
                ]}>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: darkBorderColor, color: darkmodeColor},
                  ]}
                  placeholder="Enter text to search"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <TouchableOpacity
                  onPress={handleSearch}
                  style={[
                    styles.openButton,
                    {backgroundColor: darkBackgroundColor},
                  ]}>
                  <Text style={[styles.buttonText, {color: darkmodeColor}]}>
                    Search
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSearchModalVisible(false)}
                  style={[
                    styles.openButton,
                    {backgroundColor: darkBackgroundColor},
                  ]}>
                  <Text style={[styles.buttonText, {color: darkmodeColor}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <Text style={{color: darkmodeColor}}>No PDF selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    width: '100%',
    padding: moderateScale(10),
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pdfContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '80%',
  },
  pageInfo: {
    fontSize: 16,
    margin: 10,
  },
  actionButton: {
    backgroundColor: 'transparent',
    margin: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  openButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },
});

export default MyPdfScreen;
