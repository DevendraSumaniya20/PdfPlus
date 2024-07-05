import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Modal,
  TouchableHighlight,
  TextInput,
  Share,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Pdf from 'react-native-pdf';
import CustomIcon from '../../../components/CustomIcon';
import CustomTheme from '../../../constants/CustomTheme';
import CustomHeader from '../../../components/CustomHeader';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

const PdfViewerScreen = ({route, navigation}) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [goToPageModalVisible, setGoToPageModalVisible] = useState(false);
  const [pageInput, setPageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Track PDF loading state

  const {filePath} = route.params;
  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

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
      <View style={{flex: 1, marginHorizontal: moderateScale(16)}}>
        <View style={styles.toolbar}>
          <CustomHeader
            size={scale(24)}
            iconName={'chevron-back'}
            color={darkmodeColor}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <TouchableOpacity
            onPress={handleMenuPress}
            style={{marginRight: moderateScale(16)}}>
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
          scale={1.0}
          style={styles.pdf}
        />
        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={darkmodeColor} />
          </View>
        )}
        <View
          style={[
            styles.footer,
            {
              borderColor: darkBorderColor,
              backgroundColor: darkBackgroundColor,
            },
          ]}>
          <Text style={{color: darkmodeColor}}>
            Page {currentPage} of {numberOfPages}
          </Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible || goToPageModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setGoToPageModalVisible(false);
        }}>
        <View style={[styles.centeredView, {borderColor: darkmodeColor}]}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: darkBackgroundColor,
                borderColor: darkmodeColor,
              },
            ]}>
            <TouchableHighlight
              style={[
                styles.openButton,
                {backgroundColor: darkBackgroundColor},
              ]}
              onPress={confirmDownload}>
              <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                Download PDF
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[
                styles.openButton,
                {backgroundColor: darkBackgroundColor},
              ]}
              onPress={sharePdf}>
              <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                Share PDF
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[
                styles.openButton,
                {backgroundColor: darkBackgroundColor},
              ]}
              onPress={() => setGoToPageModalVisible(true)}>
              <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                Go to Page
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[
                styles.openButton,
                {backgroundColor: darkBackgroundColor},
              ]}
              onPress={() => {
                setModalVisible(false);
                setGoToPageModalVisible(false);
              }}>
              <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                Close Menu
              </Text>
            </TouchableHighlight>
            {goToPageModalVisible && (
              <View
                style={[
                  styles.modalView,
                  {backgroundColor: darkBackgroundColor},
                ]}>
                <Text style={[styles.modalText, {color: darkmodeColor}]}>
                  Go to Page
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: darkBorderColor, color: darkmodeColor},
                  ]}
                  keyboardType="numeric"
                  onChangeText={text => setPageInput(text)}
                  value={pageInput}
                />
                <TouchableHighlight
                  style={[
                    styles.openButton,
                    {backgroundColor: darkBackgroundColor},
                  ]}
                  onPress={goToPage}>
                  <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                    Go
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={[
                    styles.openButton,
                    {
                      backgroundColor: darkBackgroundColor,
                      borderColor: darkBorderColor,
                    },
                  ]}
                  onPress={() => {
                    setGoToPageModalVisible(false);
                  }}>
                  <Text style={[styles.textStyle, {color: darkmodeColor}]}>
                    Cancel
                  </Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: moderateScale(10),
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(21),
  },
  modalView: {
    margin: moderateScale(20),
    alignItems: 'center',
  },
  openButton: {
    borderRadius: moderateScale(20),
    padding: moderateScale(10),
    marginVertical: moderateVerticalScale(10),
    minWidth: moderateScale(180),
    alignItems: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: moderateVerticalScale(15),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: moderateVerticalScale(40),
    borderWidth: 1,
    marginBottom: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(10),
    width: moderateScale(100),
    textAlign: 'center',
  },
});
