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
  scrollContainer: {
    flexGrow: 1,
  },
  marginContainer: {
    margin: moderateScale(16),
  },
  header: {
    alignItems: 'center',
    marginVertical: moderateVerticalScale(26),
  },
  logo: {
    width: moderateScale(150),
    height: moderateVerticalScale(120),
    marginBottom: moderateVerticalScale(16),
  },
  content: {
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
  },
  paragraph: {
    fontSize: scale(14),
    marginBottom: moderateVerticalScale(16),
    lineHeight: 22,
  },
  footer: {
    marginTop: moderateVerticalScale(32),
    alignItems: 'center',
  },
  footerText: {
    fontSize: scale(12),
    marginBottom: moderateVerticalScale(4),
    textAlign: 'center',
  },
});

export default styles;
