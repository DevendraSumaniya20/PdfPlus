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
} from 'react-native';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomTheme from '../../../constants/CustomTheme';
import CustomIcon from '../../../components/CustomIcon';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import navigationString from '../../../constants/navigationString';
import CustomHeader from '../../../components/CustomHeader';

const SyllabusScreen = ({route}) => {
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
    },
    {
      id: '2',
      code: 3110006,
      subjectName: 'Basic Electrical Engineering',
      known_as: 'BEE2',
      pdfUrl:
        'https://www.forteachersforstudents.com.au/site/wp-content/uploads/KidsMedia/RemembranceDay/pdfs/remembrance-day-facts.pdf',
      downloaded: false,
    },
  ]);

  const previewPdf = async (pdfUrl, fileName, itemId) => {
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
        navigation.navigate(navigationString.PDFVIEWERSCREEN, {
          filePath: downloadDest,
        });
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
        onPress={() => previewPdf(item.pdfUrl, `${item.known_as}.pdf`, item.id)}
        style={[
          styles.cell,
          {color: darkmodeColor, borderColor: darkBorderColor},
        ]}>
        {item.code}
      </Text>
      <Text
        numberOfLines={1}
        includeFontPadding={false}
        style={[
          styles.cell,
          {color: darkmodeColor, borderColor: darkBorderColor},
        ]}>
        {item.subjectName}
      </Text>
      <Text
        style={[
          styles.cell,
          {color: darkmodeColor, borderColor: darkBorderColor},
        ]}>
        {item.known_as}
      </Text>
      <TouchableOpacity
        style={[
          styles.cell,
          styles.downloadButton,
          {borderColor: darkBorderColor},
        ]}
        onPress={() =>
          previewPdf(item.pdfUrl, `${item.known_as}.pdf`, item.id)
        }>
        <CustomIcon
          type="Ionicons"
          color={darkmodeColor}
          name={'eye-outline'}
          size={scale(16)}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader
          text={'Syllabus'}
          iconName={'chevron-back'}
          color={darkmodeColor}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.headerContainer}>
          <View style={[styles.headerRow, {borderColor: darkBorderColor}]}>
            <Text
              style={[
                styles.headerCell,
                {color: darkmodeColor, borderColor: darkBorderColor},
              ]}>
              Code
            </Text>
            <Text
              style={[
                styles.headerCell,
                {color: darkmodeColor, borderColor: darkBorderColor},
              ]}>
              Subject Name
            </Text>
            <Text
              style={[
                styles.headerCell,
                {color: darkmodeColor, borderColor: darkBorderColor},
              ]}>
              Known as
            </Text>
            <Text
              style={[
                styles.headerCell,
                {color: darkmodeColor, borderColor: darkBorderColor},
              ]}>
              Syllabus
            </Text>
          </View>
        </View>
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
  headerContainer: {
    marginBottom: moderateScale(5),
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: moderateScale(10),
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: scale(14),
    textAlign: 'center',
    borderWidth: 1,
    padding: moderateScale(10),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(10),
  },
  cell: {
    flex: 1,
    fontSize: scale(12),
    textAlign: 'center',
    borderWidth: 0.5,
    padding: moderateScale(10),
  },
  downloadButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    zIndex: 1,
  },
});

export default SyllabusScreen;
