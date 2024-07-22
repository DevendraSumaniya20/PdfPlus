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
  title: {
    fontSize: scale(24),
    fontWeight: '700',
    marginBottom: moderateScale(24),
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: moderateVerticalScale(26),
  },
  info: {
    fontSize: scale(18),
    marginBottom: moderateVerticalScale(8),
  },

  profileImage: {
    width: moderateScale(120),
    height: moderateVerticalScale(120),
    borderRadius: moderateScale(250),
    borderWidth: 1,
  },
  labelView: {
    marginBottom: moderateVerticalScale(10),
    marginTop: moderateVerticalScale(6),
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: moderateScale(20),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: scale(20),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(20),
  },
  modalButton: {
    borderRadius: moderateScale(8),
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(8),
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: scale(16),
    fontWeight: '600',
  },
  modalCloseButton: {
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateVerticalScale(20),
    marginTop: moderateVerticalScale(8),
  },
  modalCloseButtonText: {
    fontSize: scale(16),
    fontWeight: '400',
  },
});

export default styles;
