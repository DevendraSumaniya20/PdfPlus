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
    marginHorizontal: moderateScale(16),
  },
  welcomeTextView: {
    marginVertical: moderateVerticalScale(16),
  },
  imageView: {
    alignItems: 'center',
    marginTop: moderateScale(16),
    marginHorizontal: moderateScale(16),
    marginBottom: moderateVerticalScale(16),
  },
  image: {
    width: moderateScale(120),
    height: moderateScale(120),
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
    fontWeight: '700',
  },
});

export default styles;
