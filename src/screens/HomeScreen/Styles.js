import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

export const styles = StyleSheet.create({
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
  nextView: {
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  text: {
    fontSize: scale(16),
    fontFamily: 'Poppins-Bold',
  },
  card: {
    flex: 1,

    marginVertical: moderateVerticalScale(8),
    marginHorizontal: moderateScale(8),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 'auto',
    paddingVertical: moderateVerticalScale(8),
  },
  cardText: {
    fontSize: scale(14),
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    lineHeight: 24,
  },
});
