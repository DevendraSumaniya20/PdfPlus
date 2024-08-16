import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import CustomTheme from '../../constants/CustomTheme';
import CustomIcon from '../../components/CustomIcon';
import Color from '../../constants/Color';
import Bubble from '../../animation/Bubble';

const MyPdfScreen = ({navigation}) => {
  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedPage, setSearchedPage] = useState(null);
  const [pdfName, setPdfName] = useState('');

  const scaleAnim = useSharedValue(1);
  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleAnim.value}],
    };
  });

  // Request storage permission
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      console.log('Android Permission Result:', result);
      if (result !== RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Cannot access storage on Android.');
        return false;
      }
      return true;
    } else if (Platform.OS === 'ios') {
      return true;
    }
    return false;
  };

  // Handle PDF selection with animation
  const handleChoosePdf = async () => {
    scaleAnim.value = withSequence(
      withTiming(1.2, {duration: 300}),
      withTiming(1, {duration: 300}),
    );

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
      const fileName = res[0].name;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const fileExists = await RNFS.exists(destPath);

      if (fileExists) {
        await RNFS.unlink(destPath);
      }

      await RNFS.copyFile(fileUri, destPath);

      setPdfUri(`file://${destPath}`);
      setPdfName(fileName);
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

  const handleHeaderPress = () => {
    Alert.alert(
      'Close PDF',
      'Are you sure you want to close this PDF?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setPdfUri(null);
            setPdfName('');
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.bubblesContainer}>
        {[...Array(10)].map((_, index) => (
          <Bubble key={index} index={index} />
        ))}
      </View>
      {!pdfUri && (
        <Animated.View style={[animatedStyle]}>
          <CustomButton onPress={handleChoosePdf} text={'Choose PDF'} />
        </Animated.View>
      )}
      {loading && <ActivityIndicator size="large" color={darkmodeColor} />}
      {pdfUri && !loading && (
        <>
          <View style={[styles.header, {backgroundColor: darkBackgroundColor}]}>
            <CustomHeader
              iconName={'chevron-back'}
              color={darkmodeColor}
              onPress={handleHeaderPress}
              text={
                pdfName.length > 16 ? pdfName.slice(0, 16) + '...' : pdfName
              }
              size={scale(20)}
            />

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setModalVisible(true)}>
              <CustomIcon
                color={darkmodeColor}
                name={'ellipsis-vertical'}
                size={scale(30)}
              />
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
            style={[styles.pdf, {backgroundColor: darkBackgroundColor}]}
          />
          <View style={styles.footer}>
            <Text style={{color: darkmodeColor}}>
              Page {currentPage} of {numberOfPages}
            </Text>
          </View>
        </>
      )}
      {!pdfUri && !loading && (
        <Text style={{color: darkmodeColor}}>No PDF selected</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={[styles.modalBackground, {backgroundColor: 'transparent'}]}>
          <View style={[styles.modalView, {backgroundColor: Color.BLACK_10}]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}>
              <Icon name="close" size={30} color={darkmodeColor} />
            </TouchableOpacity>
            <TextInput
              style={[
                styles.input,
                {borderColor: darkBorderColor, color: darkmodeColor},
              ]}
              placeholder="Enter page number"
              placeholderTextColor={darkBorderColor}
              keyboardType="numeric"
              value={searchText}
              onChangeText={setSearchText}
            />

            <CustomButton
              textStyle={{padding: moderateScale(1)}}
              onPress={handleSearch}
              text={'Go to page'}
              inlineStyle={{
                backgroundColor: darkBackgroundColor,
                padding: moderateScale(1),
              }}
            />
            <CustomButton
              onPress={handleSharePdf}
              text={'Share PDF'}
              inlineStyle={{
                backgroundColor: darkBackgroundColor,
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: moderateScale(8),
    marginHorizontal: moderateScale(16),
    marginVertical: moderateVerticalScale(16),
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  footer: {
    padding: moderateScale(8),
    alignItems: 'center',
  },
  iconButton: {
    zIndex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    borderRadius: moderateScale(8),
    padding: moderateScale(40),
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: moderateScale(10),
    right: moderateScale(10),
  },
  input: {
    height: moderateVerticalScale(36),
    borderWidth: 1,
    marginBottom: moderateVerticalScale(20),
    paddingLeft: moderateScale(12),
    width: '100%',
    borderRadius: moderateScale(8),
  },
});

export default MyPdfScreen;
