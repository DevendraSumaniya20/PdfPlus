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
    marginVertical: moderateVerticalScale(8),
  },
  signUpTextStyle: {
    fontSize: scale(16),
    fontFamily: 'Poppins',
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    padding: moderateScale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(18),
  },
  modalButton: {
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: scale(16),
  },
  modalCancelButton: {
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginTop: moderateVerticalScale(10),
    width: '100%',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: scale(16),
  },
});

export default styles;
