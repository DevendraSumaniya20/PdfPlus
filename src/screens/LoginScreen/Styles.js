// Styles.js

import {StyleSheet} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';

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
  inputView: {
    marginVertical: moderateVerticalScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubblesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 40,
    marginTop: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
