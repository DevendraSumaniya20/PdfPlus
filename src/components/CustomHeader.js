import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomIcon from './CustomIcon';
import CustomTheme from '../constants/CustomTheme';

const CustomHeader = ({
  text,
  iconName,
  size = scale(24),
  color,
  onPress,
  inlineStyle,
}) => {
  const {darkmodeColor, darkBackgroundColor} = CustomTheme();

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={[styles.button, {}]}
        onPress={onPress}
        activeOpacity={0.5}>
        <View style={styles.iconContainer}>
          <CustomIcon
            name={iconName}
            size={size}
            color={darkmodeColor}
            inlineStyle={inlineStyle}
          />
        </View>
        <Text style={[styles.headerTextTitle, {color: darkmodeColor}]}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: moderateScale(6),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextTitle: {
    fontWeight: '800',
    textAlign: 'center',
    fontSize: scale(18),
    flex: 1,
  },
});
