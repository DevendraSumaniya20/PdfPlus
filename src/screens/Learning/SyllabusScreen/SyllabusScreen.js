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

const SyllabusScreen = ({route}) => {
  const navigation = useNavigation();
  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    {
      id: '1',
      code: 3110005,
      subjectName: 'Basic Electrical Engineering',
      known_as: 'BEE',
      pdfUrl:
        'https://www.forteachersforstudents.com.au/site/wp-content/uploads/KidsMedia/RemembranceDay/pdfs/remembrance-day-facts.pdf',
      downloaded: false,
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
      <View style={styles.item}>
        <Text
          onPress={() =>
            downloadPdf(item.pdfUrl, `${item.known_as}.pdf`, item.id)
          }
          style={[styles.cell, {color: darkmodeColor}]}>
          {item.code}
        </Text>
        <Text style={[styles.cell, {color: darkmodeColor}]}>
          {item.subjectName}
        </Text>
        <Text style={[styles.cell, {color: darkmodeColor}]}>
          {item.known_as}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() =>
          downloadPdf(item.pdfUrl, `${item.known_as}.pdf`, item.id)
        }>
        <CustomIcon
          type="Ionicons"
          color={darkmodeColor}
          name={'eye-outline'}
          size={scale(24)}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <View
            style={[styles.headerRow, {borderBottomColor: darkBorderColor}]}>
            <Text style={[styles.headerCell, {color: darkmodeColor}]}>
              Code
            </Text>
            <Text style={[styles.headerCell, {color: darkmodeColor}]}>
              Subject Name
            </Text>
            <Text style={[styles.headerCell, {color: darkmodeColor}]}>
              Known as
            </Text>
            <Text style={[styles.headerCell, {color: darkmodeColor}]}>
              Syllabus
            </Text>
          </View>
          <View
            style={[styles.separator, {backgroundColor: darkBorderColor}]}
          />
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
          ItemSeparatorComponent={() => (
            <View
              style={[styles.separator, {backgroundColor: darkBorderColor}]}
            />
          )}
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
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(5),
  },
  item: {
    flexDirection: 'row',
    flex: 4,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: scale(12),
    textAlign: 'center',
  },
  downloadButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1.2,
    marginVertical: moderateScale(5),
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
