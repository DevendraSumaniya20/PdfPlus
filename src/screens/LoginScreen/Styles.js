import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginContainer: {
    marginHorizontal: moderateScale(16),
  },
  welcomeTextView: {
    marginVertical: moderateVerticalScale(16),
  },
  imageView: {
    alignItems: 'center',
    marginTop: moderateScale(52),
    marginHorizontal: moderateScale(16),
    marginBottom: moderateVerticalScale(16),
  },
  image: {
    width: moderateScale(343),
    height: moderateScale(253),
  },
  inputView: {
    marginVertical: moderateVerticalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubblesContainer: {
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
    marginTop: moderateVerticalScale(20),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  forgotPasswordView: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  forgotPasswordTextStyle: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: scale(14),
  },
  SignUpView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpTextStyle: {
    fontSize: scale(16),
    fontFamily: 'Poppins',
    fontWeight: '900',
  },
});

export default styles;
