import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomTheme from '../../../constants/CustomTheme';
import {useNavigation} from '@react-navigation/native';
import navigationString from '../../../constants/navigationString';
import CustomIcon from '../../../components/CustomIcon';
import CustomHeader from '../../../components/CustomHeader';

const CourseScreen = ({route}) => {
  const {item} = route.params;

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  const data = [
    {id: '1', text: 'Syllabus', icon: 'book'},
    {id: '2', text: 'Books', icon: 'book-open'},
    {id: '3', text: 'Old Paper', icon: 'file-text'},
    {id: '4', text: 'IMP Materials', icon: 'file'},
    {id: '5', text: 'Paper Solution', icon: 'edit'},
  ];

  const screenMapping = {
    1: navigationString.SYLLABUSSCREEN,
    2: navigationString.BOOKSCREEN,
    3: navigationString.OLDPAPERSCREEN,
    4: navigationString.IMPMATERIALSCREEN,
    5: navigationString.PAPERSOLUTIONSCREEN,
  };

  const navigation = useNavigation();

  const keyExtractor = item => item.id.toString();

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
        {
          backgroundColor: darkBackgroundColor,
          borderColor: darkBorderColor,
          shadowColor: darkmodeColor,
        },
      ]}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <CustomIcon
            color={darkmodeColor}
            name={item.icon}
            size={scale(16)}
            type="Feather"
          />
        </View>
        <Text style={[styles.cardText, {color: darkmodeColor}]}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.marginContainer}>
        <CustomHeader
          text={item.text}
          iconName={'chevron-back'}
          color={darkmodeColor}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={[styles.nextView, {backgroundColor: darkBackgroundColor}]}>
          <Text style={[styles.text, {color: darkmodeColor}]}>
            This is some text that will span over three lines to give an example
            of how the layout will look.
          </Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default CourseScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginContainer: {
    marginHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
  },
  nextView: {
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: scale(16),
    lineHeight: moderateScale(24),
  },
  card: {
    flex: 1,
    padding: moderateScale(12),
    marginVertical: moderateVerticalScale(12),
    marginHorizontal: moderateScale(8),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
  },
  iconContainer: {
    width: moderateScale(28),
  },
  cardText: {
    fontSize: scale(14),
  },
  flatListContainer: {
    flexGrow: 1,
  },
});
