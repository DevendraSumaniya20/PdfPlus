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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    justifyContent: 'space-between',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: moderateScale(10),
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  openButton: {
    borderRadius: moderateScale(20),
    padding: moderateScale(8),
    marginVertical: moderateVerticalScale(10),
    minWidth: moderateScale(180),
    alignItems: 'center',
    borderWidth: 1,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: moderateVerticalScale(15),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: moderateVerticalScale(40),
    borderWidth: 1,
    marginBottom: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(10),
    width: moderateScale(100),
    textAlign: 'center',
  },
});

export default styles;
