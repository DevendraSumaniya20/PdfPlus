import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomTheme from '../../constants/CustomTheme';
import CustomIcon from '../../components/CustomIcon';
import {useNavigation} from '@react-navigation/native';
import navigationString from '../../constants/navigationString';

const HomeScreen = ({route}) => {
  const [greeting, setGreeting] = useState('');

  const {userId, username, email} = route?.params || {};
  console.log(username);

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  const keyExtractor = item => item.id.toString();
  const navigation = useNavigation();

  const data = [
    {id: '1', text: 'Computer Engineering'},
    {id: '2', text: 'Electronics & Communication Engineering'},
    {id: '3', text: 'Mechanical Engineering'},
    {id: '4', text: 'Civil Engineering'},
    {id: '5', text: 'Automobile Engineering'},
    {id: '6', text: 'Electrical Engineering'},
    {id: '7', text: 'Information and Technology Engineering'},
    {id: '8', text: 'Other Subjects'},
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(navigationString.COURSESCREEN, {item});
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

  useEffect(() => {
    const GetCurrentGreeting = () => {
      let today = new Date();
      let currentHour = today.getHours();

      if (currentHour < 12) {
        setGreeting('Good Morning');
      } else if (currentHour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };
    GetCurrentGreeting();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <SafeAreaView style={styles.marginContainer}>
        <View style={styles.userProfileContainer}>
          <Image
            source={{
              uri: 'https://s.yimg.com/ny/api/res/1.2/zpFvsAowCv0gf6.Nx0FHAw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM2MA--/https://s.yimg.com/os/creatr-uploaded-images/2023-09/19fa78d0-5c92-11ee-bdf7-4c07cf46d8b9',
            }}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, {color: darkmodeColor}]}>
              {username}
            </Text>
            <Text style={[styles.greeting, {color: darkmodeColor}]}>
              {greeting}
            </Text>
          </View>

          <CustomIcon color={darkmodeColor} name={'book'} size={scale(24)} />
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginContainer: {
    marginHorizontal: moderateScale(16),
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: moderateScale(16),
    justifyContent: 'space-between',
    marginVertical: moderateVerticalScale(8),
  },
  profileImage: {
    width: moderateScale(60),
    height: moderateVerticalScale(60),
    borderRadius: moderateScale(50),
    marginRight: moderateScale(10),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: scale(16),
  },
  micButton: {
    marginLeft: moderateScale(8),
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
  },
  cardText: {
    fontSize: scale(14),
    textAlign: 'center',
  },
});

export default HomeScreen;
