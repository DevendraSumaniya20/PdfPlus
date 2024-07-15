import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

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

export default styles;
