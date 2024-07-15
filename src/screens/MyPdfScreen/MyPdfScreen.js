import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';
import Pdf from 'react-native-pdf';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const MyPdfScreen = () => {
  const [pdfPath, setPdfPath] = useState(null);

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

    try {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        console.log('Permission granted');
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setPdfPath(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  const sharePdf = async () => {
    if (!pdfPath) {
      Alert.alert('Error', 'No PDF selected to share');
      return;
    }

    const options = {
      url: pdfPath,
      type: 'application/pdf',
      social: Share.Social.SHARE,
    };

    try {
      await Share.open(options);
    } catch (error) {
      Alert.alert('Error', 'Failed to share the PDF');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>MyPdfScreen</Text>
      <Button title="Pick PDF" onPress={pickPdf} />
      <Button title="Share PDF" onPress={sharePdf} />
      {pdfPath && (
        <Pdf source={{uri: pdfPath, cache: true}} style={styles.pdf} />
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
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default MyPdfScreen;
