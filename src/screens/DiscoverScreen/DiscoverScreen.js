import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import bookSearch from '../../data/BookSearch';
import CustomTheme from '../../constants/CustomTheme';

const DiscoverScreen = () => {
  const [bookData, setBookData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  useEffect(() => {
    setBookData(bookSearch);
    setFilteredData(bookSearch);
    setLoading(false);
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query) {
      const filteredBooks = bookData.filter(
        book =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filteredBooks);
    } else {
      setFilteredData(bookData);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={[styles.card, {backgroundColor: darkBackgroundColor}]}>
        <Image
          source={item.imageLink}
          style={styles.bookImage}
          resizeMethod="auto"
          resizeMode="cover"
        />
        <View style={styles.bookDetails}>
          <Text style={[styles.bookText, {color: darkmodeColor}]}>
            {item.title}
          </Text>
          <Text style={[styles.bookText, {color: darkmodeColor}]}>
            by {item.author}
          </Text>
          <Text style={[styles.bookText, {color: darkmodeColor}]}>
            Country: {item.country}
          </Text>
          <Text style={[styles.bookText, {color: darkmodeColor}]}>
            Language: {item.language}
          </Text>
          <Text style={[styles.bookText, {color: darkmodeColor}]}>
            Year: {item.year}
          </Text>
          <Text style={[styles.bookText, {color: darkmodeColor}]}>
            Pages: {item.pages}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <SafeAreaView style={styles.marginContainer}>
        <TextInput
          style={[
            styles.searchBar,
            {borderColor: darkBorderColor, color: darkmodeColor},
          ]}
          placeholder="Search by title or author"
          placeholderTextColor={darkmodeColor}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {loading ? (
          <ActivityIndicator color={darkmodeColor} size={'large'} />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.bookId.toString()}
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
    margin: 10,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 2,
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  bookText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
});

export default DiscoverScreen;
