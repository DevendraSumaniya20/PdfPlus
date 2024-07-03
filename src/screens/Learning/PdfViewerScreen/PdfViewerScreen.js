import React, {useState, useRef} from 'react';
import {StyleSheet, View, Alert, TouchableOpacity, Text} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomIcon from '../../../components/CustomIcon';
import CustomTheme from '../../../constants/CustomTheme';
import {scale} from 'react-native-size-matters';

const PdfViewerScreen = ({route}) => {
  const {filePath} = route.params;
  const pdfRef = useRef(null);

  const {darkmodeColor, darkBackgroundColor} = CustomTheme();

  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [horizontal, setHorizontal] = useState(false);

  const storeDownloadedPdfPath = async path => {
    try {
      await AsyncStorage.setItem('downloadedPdfPath', path);
    } catch (error) {
      console.log('Error storing the PDF path:', error);
    }
  };

  const downloadPdf = async () => {
    try {
      const downloadDest = `${RNFS.DocumentDirectoryPath}/downloaded-file.pdf`;

      const options = {
        fromUrl: filePath,
        toFile: downloadDest,
      };

      const result = await RNFS.downloadFile(options).promise;
      if (result.statusCode === 200) {
        await storeDownloadedPdfPath(downloadDest);
        Alert.alert('Download Complete', `File downloaded to: ${downloadDest}`);
        console.log(`File downloaded to: ${downloadDest}`);
      } else {
        Alert.alert('Download Failed', 'Failed to download file');
        console.log('Download failed', result);
      }
    } catch (error) {
      console.log('Download error:', error);
      Alert.alert(
        'Download Error',
        'An error occurred while downloading the file',
      );
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
          onPress: () => downloadPdf(),
        },
      ],
      {cancelable: false},
    );
  };

  const toggleOrientation = () => {
    setHorizontal(prevHorizontal => !prevHorizontal);
  };

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={confirmDownload}>
          <CustomIcon
            type="MaterialIcons"
            color={darkmodeColor}
            name={'file-download'}
            size={scale(24)}
          />
        </TouchableOpacity>
        <Text style={{color: darkmodeColor}}>
          Page: {currentPage} / {numberOfPages}
        </Text>
        <Text style={{color: darkmodeColor}}>
          Zoom: {(zoom * 100).toFixed(0)}%
        </Text>
        <TouchableOpacity onPress={toggleOrientation}>
          <CustomIcon
            type="MaterialIcons"
            color={darkmodeColor}
            name={horizontal ? 'swap-vert' : 'swap-horiz'}
            size={scale(24)}
          />
        </TouchableOpacity>
      </View>
      <Pdf
        ref={pdfRef}
        source={{uri: filePath}}
        onLoadComplete={(numberOfPages, filePath) => {
          setNumberOfPages(numberOfPages);
          console.log(`Number of pages: ${numberOfPages}, ${filePath}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          setCurrentPage(page);
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        horizontal={horizontal}
        scale={zoom}
        style={styles.pdf}
      />
    </View>
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
});
