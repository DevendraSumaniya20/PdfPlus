import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomTheme from '../../../constants/CustomTheme';
import CustomIcon from '../../../components/CustomIcon';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../../../components/CustomHeader';
import navigationString from '../../../constants/navigationString';

const BookScreen = ({route}) => {
  const navigation = useNavigation();
  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    {
      id: '1',
      code: 3110005,
      subjectName: 'Basic Electrical Engineering',
      known_as: 'BEE1',
      pdfUrl:
        'https://www.forteachersforstudents.com.au/site/wp-content/uploads/KidsMedia/RemembranceDay/pdfs/remembrance-day-facts.pdf',
      downloaded: false,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      code: 3110006,
      subjectName: 'Basic Electrical Engineering',
      known_as: 'BEE2',
      pdfUrl:
        'https://www.forteachersforstudents.com.au/site/wp-content/uploads/KidsMedia/RemembranceDay/pdfs/remembrance-day-facts.pdf',
      downloaded: false,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]);

  const downloadPdf = async (pdfUrl, fileName, itemId) => {
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    const options = {
      fromUrl: pdfUrl,
      toFile: downloadDest,
    };

    setIsLoading(true);

    try {
      const result = await RNFS.downloadFile(options).promise;
      setIsLoading(false);
      if (result.statusCode === 200) {
        Alert.alert(
          'Download Successful',
          'The PDF has been downloaded. Do you want to view it?',
          [
            {
              text: 'No',
              onPress: () => console.log('PDF viewing cancelled'),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                navigation.navigate(navigationString.PDFVIEWERSCREEN, {
                  filePath: downloadDest,
                });
              },
            },
          ],
          {cancelable: false},
        );
        setData(prevData =>
          prevData.map(item =>
            item.id === itemId ? {...item, downloaded: true} : item,
          ),
        );
      } else {
        Alert.alert('Download Failed', 'File could not be downloaded.');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Download Error',
        `An error occurred while downloading the file: ${error.message}`,
      );
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text
        style={[
          styles.subjectText,
          {color: darkmodeColor, borderColor: darkBorderColor},
        ]}>
        {item.subjectName} ({item.code})
      </Text>
      <Image source={{uri: item.imageUrl}} style={styles.subjectImage} />
      <TouchableOpacity
        style={[styles.downloadButton, {borderColor: darkBorderColor}]}
        onPress={() =>
          downloadPdf(item.pdfUrl, `${item.known_as}.pdf`, item.id)
        }>
        <CustomIcon
          type="Ionicons"
          color={darkmodeColor}
          name={'download-outline'}
          size={scale(16)}
        />
        <Text style={[styles.downloadText, {color: darkmodeColor}]}>
          Download PDF
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          text={'Books'}
          iconName={'chevron-back'}
          color={darkmodeColor}
          onPress={() => {
            navigation.goBack();
          }}
        />
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={darkmodeColor}
            style={styles.loadingIndicator}
          />
        )}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    marginHorizontal: moderateScale(16),
  },
  itemContainer: {
    paddingVertical: moderateScale(10),
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  subjectText: {
    fontSize: scale(14),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: moderateScale(10),
  },
  subjectImage: {
    width: '100%',
    height: moderateScale(150),
    resizeMode: 'cover',
    marginBottom: moderateScale(10),
  },
  downloadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    padding: moderateScale(10),
  },
  downloadText: {
    marginLeft: moderateScale(5),
    fontSize: scale(12),
  },
  loadingIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    zIndex: 1,
  },
});

export default BookScreen;
