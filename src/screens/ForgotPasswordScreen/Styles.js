import {StyleSheet} from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import Color from '../../constants/Color';
import {moderateScaleVertical} from '../../constants/responsiveSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  subcontainer: {
    flex: 1,
  },

  welcomeTextView: {
    marginVertical: moderateVerticalScale(16),
  },

  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  textinputTop: {
    marginHorizontal: moderateScale(12),
  },

  textinputName: {
    marginHorizontal: moderateScale(8),
    marginTop: moderateScale(8),
  },
});
export default styles;
