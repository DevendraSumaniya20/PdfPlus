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
  mainNotificationView: {
    marginVertical: moderateVerticalScale(32),
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginTop: moderateVerticalScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  settingText: {
    fontSize: scale(14),
    fontWeight: '700',
  },
});

export default styles;
