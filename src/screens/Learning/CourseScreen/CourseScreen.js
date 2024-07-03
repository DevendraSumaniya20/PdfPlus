import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomTheme from '../../../constants/CustomTheme';
import {useNavigation} from '@react-navigation/native';
import navigationString from '../../../constants/navigationString';

const CourseScreen = ({route}) => {
  const {item} = route.params;
  console.log(item);

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  const keyExtractor = item => item.id.toString();
  const navigation = useNavigation();

  const data = [
    {id: '1', text: 'Syllabus'},
    {id: '2', text: 'Books'},
    {id: '3', text: 'Old Paper'},
    {id: '4', text: 'IMP Materials'},
    {id: '5', text: 'Paper Solution'},
  ];

  const screenMapping = {
    1: navigationString.SYLLABUSSCREEN,
    2: navigationString.BOOKSCREEN,
    3: navigationString.OLDPAPERSCREEN,
    4: navigationString.IMPMATERIALSCREEN,
    5: navigationString.PAPERSOLUTIONSCREEN,
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        const targetScreen = screenMapping[item.id];
        if (targetScreen) {
          navigation.navigate(targetScreen, {item});
        }
      }}
      style={[
        styles.card,
        {backgroundColor: darkBackgroundColor, borderColor: darkBorderColor},
      ]}>
      <View>
        <Text style={[styles.cardText, {color: darkmodeColor}]}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <SafeAreaView style={styles.marginContainer}>
        <View style={[styles.nextView, {backgroundColor: darkBackgroundColor}]}>
          <Text style={[styles.text, {color: darkmodeColor}]}>
            This is some text that will span over three lines to give an example
            of how the layout will look.
          </Text>
        </View>
        <View>
          <FlatList
            data={data}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CourseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginContainer: {
    marginHorizontal: moderateScale(16),
  },

  nextView: {
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  text: {
    fontSize: scale(16),
    lineHeight: 24,
  },
  card: {
    flex: 1,
    padding: moderateScale(16),
    marginVertical: moderateVerticalScale(8),
    marginHorizontal: moderateScale(8),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#ff5201',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  cardText: {
    fontSize: scale(14),
    textAlign: 'center',
  },
});
