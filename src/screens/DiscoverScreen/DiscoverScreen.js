import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import bookSearch from '../../data/BookSearch';
import CustomTheme from '../../constants/CustomTheme';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomSearch from '../../components/CustomSearch';
import navigationString from '../../constants/navigationString';
import Icon from 'react-native-vector-icons/FontAwesome';

const DiscoverScreen = ({navigation, route}) => {
  const [bookData, setBookData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('popular');

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  useEffect(() => {
    setBookData(bookSearch);
    setFilteredData(bookSearch);
    setLoading(false);
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchText, bookData, sortOption]);

  const handleFilterAndSort = () => {
    let newData = [...bookData];

    if (searchText) {
      newData = newData.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    switch (sortOption) {
      case 'year':
        newData.sort((a, b) => b.year - a.year);
        break;
      case 'a-z':
        newData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        newData.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'popular':
        newData.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'trending':
        newData.sort((a, b) => b.trendingScore - a.trendingScore);
        break;
      default:
        break;
    }

    setFilteredData(newData);
  };

  const renderSortButton = (title, value, iconName) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        {borderColor: sortOption === value ? darkmodeColor : darkBorderColor},
      ]}
      onPress={() => setSortOption(value)}>
      <Icon
        name={iconName}
        size={scale(12)}
        color={sortOption === value ? darkmodeColor : darkBorderColor}
      />
      <Text style={{color: darkmodeColor, marginLeft: moderateScale(6)}}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.card,
        {backgroundColor: darkBackgroundColor, borderColor: darkBorderColor},
      ]}
      onPress={() => {
        navigation.navigate(navigationString.PDFVIEWERSCREEN, {
          filePath: item.pdfUrl,
        });
      }}>
      <Image
        source={item.imageLink}
        style={styles.bookImage}
        resizeMethod="auto"
        resizeMode="cover"
      />
      <View style={styles.bookDetails}>
        <Text style={[styles.bookTitle, {color: darkmodeColor}]}>
          {item.title}
        </Text>
        <Text style={[styles.bookAuthor, {color: darkmodeColor}]}>
          by {item.author}
        </Text>
        <Text style={[styles.bookInfo, {color: darkmodeColor}]}>
          Country: {item.country}
        </Text>
        <Text style={[styles.bookInfo, {color: darkmodeColor}]}>
          Language: {item.language}
        </Text>
        <Text style={[styles.bookInfo, {color: darkmodeColor}]}>
          Year: {item.year}
        </Text>
        <Text style={[styles.bookInfo, {color: darkmodeColor}]}>
          Pages: {item.pages}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <SafeAreaView style={styles.marginContainer}>
        <View style={styles.searchView}>
          <CustomSearch
            iconColor2={darkmodeColor}
            iconName2={'search'}
            onChangeText={text => setSearchText(text)}
            placeholder={'Search your Dream book'}
            placeholderTextColor={darkmodeColor}
            size={scale(16)}
            textInputStyle={{color: darkmodeColor}}
            value={searchText}
          />
        </View>

        <View style={styles.sortContainer}>
          {renderSortButton('Popular', 'popular', 'star')}
          {renderSortButton('Trending', 'trending', 'line-chart')}
          {renderSortButton('Year', 'year', 'calendar')}
          {renderSortButton('A-Z', 'a-z', 'sort-alpha-asc')}
          {renderSortButton('Z-A', 'z-a', 'sort-alpha-desc')}
        </View>

        {loading ? (
          <ActivityIndicator color={darkmodeColor} size={'large'} />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.bookId.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: moderateVerticalScale(80),
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginContainer: {
    margin: moderateScale(16),
  },
  searchView: {
    marginVertical: moderateVerticalScale(8),
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: moderateVerticalScale(16),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(4),
    borderRadius: moderateScale(5),
    borderWidth: 1,
  },
  card: {
    flexDirection: 'row',
    marginBottom: moderateVerticalScale(10),
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  bookImage: {
    width: moderateScale(100),
    height: moderateVerticalScale(150),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(16),
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: scale(16),
    marginBottom: moderateVerticalScale(6),
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: scale(14),
    marginBottom: moderateVerticalScale(4),
    fontWeight: '600',
  },
  bookInfo: {
    fontSize: scale(12),
    marginBottom: moderateVerticalScale(4),
  },
});

export default DiscoverScreen;
