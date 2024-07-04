import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Modal,
  TouchableHighlight,
  TextInput,
  Share,
} from 'react-native';
import Pdf from 'react-native-pdf';
import CustomIcon from '../../../components/CustomIcon';
import CustomTheme from '../../../constants/CustomTheme';
import {scale} from 'react-native-size-matters';
import RNFS from 'react-native-fs';

const PdfViewerScreen = ({route}) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [modalVisible, setModalVisible] = useState(false);
  const [goToPageModalVisible, setGoToPageModalVisible] = useState(false);
  const [pageInput, setPageInput] = useState('');

  const {filePath} = route.params;
  const {darkmodeColor, darkBackgroundColor} = CustomTheme();

  const pdfRef = useRef(null);

  const handleDownload = async () => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
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
        fromUrl: filePath,
        toFile: destPath,
      };

      const downloadResult = await RNFS.downloadFile(downloadOptions).promise;
      if (downloadResult.statusCode === 200) {
        console.log('Download complete');
        Alert.alert(
          'Download complete',
          'Pdf downloaded successfully! Click to view',
        );
      } else {
        console.error('Download failed');
        Alert.alert('Download failed', 'Failed to download the PDF.');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download error', 'Failed to download the PDF.');
    }
  };

  const confirmDownload = () => {
    Alert.alert(
      'Confirm Download',
      'Are you sure you want to download this file?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: handleDownload,
        },
      ],
      {cancelable: false},
    );
  };

  const zoomIn = () => {
    setZoom(zoom + 0.5);
  };

  const zoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.5);
    }
  };

  const goToPage = () => {
    const pageNum = parseInt(pageInput);
    if (pageNum > 0 && pageNum <= numberOfPages) {
      pdfRef.current.setPage(pageNum);
      setGoToPageModalVisible(false);
      setPageInput('');
    } else {
      Alert.alert('Invalid Page', 'Please enter a valid page number.');
    }
  };

  const sharePdf = async () => {
    try {
      await Share.share({
        url: `file://${filePath}`,
        title: 'Share PDF',
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
    }
  };

  const handleMenuPress = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={zoomOut}>
          <CustomIcon
            color={darkmodeColor}
            name={'zoom-out'}
            size={scale(16)}
            type="MaterialIcons"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomIn}>
          <CustomIcon
            color={darkmodeColor}
            name={'zoom-in'}
            size={scale(16)}
            type="MaterialIcons"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMenuPress}>
          <CustomIcon
            type="MaterialCommunityIcons"
            color={darkmodeColor}
            name={'dots-vertical'}
            size={scale(24)}
          />
        </TouchableOpacity>
      </View>
      <Pdf
        ref={pdfRef}
        source={{uri: filePath}}
        onLoadComplete={numberOfPages => {
          setNumberOfPages(numberOfPages);
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={page => {
          setCurrentPage(page);
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log('Error while loading PDF:', error);
          Alert.alert('Error', 'Failed to load PDF.');
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        scale={zoom}
        style={styles.pdf}
      />
      <View style={styles.footer}>
        <Text style={{color: darkmodeColor}}>
          Page {currentPage} of {numberOfPages}
        </Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible || goToPageModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setGoToPageModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={confirmDownload}>
              <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                Download PDF
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#FF6347'}}
              onPress={sharePdf}>
              <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                Share PDF
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#1E90FF'}}
              onPress={() => setGoToPageModalVisible(true)}>
              <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                Go to Page
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#f194ff'}}
              onPress={() => {
                setModalVisible(false);
                setGoToPageModalVisible(false);
              }}>
              <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                Close Menu
              </Text>
            </TouchableHighlight>
            {goToPageModalVisible && (
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Go to Page</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={text => setPageInput(text)}
                  value={pageInput}
                />
                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#1E90FF'}}
                  onPress={goToPage}>
                  <Text style={styles.textStyle}>Go</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#f194ff'}}
                  onPress={() => {
                    setGoToPageModalVisible(false);
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 100,
    textAlign: 'center',
  },
});
