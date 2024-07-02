import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
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

const HomeScreen = () => {
  const [greeting, setGreeting] = useState('');

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();
  keyExtractor = (item, index) => index.toString();

  const data = [
    {id: '1', text: 'Card 1'},
    {id: '2', text: 'Card 2'},
    {id: '3', text: 'Card 3'},
    {id: '4', text: 'Card 4'},
    {id: '5', text: 'Card 5'},
    {id: '6', text: 'Card 6'},
    {id: '7', text: 'Card 7'},
  ];

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.cardText}>{item.text}</Text>
      </TouchableOpacity>
    </View>
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
            <Text style={styles.userName}>UserName</Text>
            <Text style={styles.greeting}>{greeting}</Text>
          </View>
          <Button title="Mic" onPress={() => {}} style={styles.micButton} />
        </View>
        <View style={[styles.nextView, {backgroundColor: darkBackgroundColor}]}>
          <Text style={styles.text}>
            This is some text that will span over three lines to give an example
            of how the layout will look.
          </Text>
        </View>
        <View>
          <FlatList
            data={data}
            numColumns={3}
            renderItem={renderItem}
            keyExtractor={this.keyExtractor}
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
    backgroundColor: '#4CAF50', // Change this to your desired color
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeScreen;
