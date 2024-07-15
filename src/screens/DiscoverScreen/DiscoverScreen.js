import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomTheme from '../../constants/CustomTheme';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomSearch from '../../components/CustomSearch';
import navigationString from '../../constants/navigationString';
import Icon from 'react-native-vector-icons/FontAwesome';
import bookSearch from '../../data/BookSearch';
import styles from './Styles';

const DiscoverScreen = ({navigation}) => {
  const [bookData, setBookData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('popular');

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  useEffect(() => {
    checkAndAddBooks();
  }, []);

  const checkAndAddBooks = async () => {
    const booksSnapshot = await firestore().collection('discover').get();
    if (booksSnapshot.empty) {
      await addBooksToFirestore();
    } else {
      fetchBooks();
    }
  };

  const addBooksToFirestore = async () => {
    const batch = firestore().batch();
    const collectionRef = firestore().collection('discover');

    bookSearch.forEach(book => {
      const docRef = collectionRef.doc();
      batch.set(docRef, book);
    });

    await batch.commit();
    console.log('Books added to Firestore!');
    fetchBooks();
  };

  const fetchBooks = async () => {
    try {
      const booksCollection = await firestore().collection('discover').get();
      const booksList = booksCollection.docs.map(doc => ({
        ...doc.data(),
        bookId: doc.id,
      }));
      setBookData(booksList);
      setFilteredData(booksList);
    } catch (error) {
      console.error('Error fetching books: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSort = useMemo(() => {
    const filterAndSort = () => {
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

      return newData;
    };

    return filterAndSort();
  }, [searchText, bookData, sortOption]);

  useEffect(() => {
    setFilteredData(handleFilterAndSort);
  }, [handleFilterAndSort]);

  const renderSortButton = useCallback(
    (title, value, iconName) => (
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
    ),
    [sortOption, darkmodeColor, darkBorderColor],
  );

  const renderItem = useCallback(
    ({item}) => (
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
    ),
    [darkBackgroundColor, darkBorderColor, darkmodeColor, navigation],
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

export default DiscoverScreen;
