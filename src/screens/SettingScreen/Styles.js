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
  menuContainer: {
    marginHorizontal: moderateScale(4),
  },
  menuText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: moderateScale(12),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    borderBottomColor: 'rgb(184, 174, 174)',
    borderBottomWidth: 0.5,
  },
});

export default styles;
