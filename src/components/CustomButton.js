import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ripple from 'react-native-material-ripple';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomTheme from '../constants/CustomTheme';

const CustomButton = ({
  text,
  onPress,
  width,
  inlineStyle,
  textStyle,
  disabled,
}) => {
  const {
    darkmodeColor,
    darkBackgroundColor,
    darkBorderColor,
    disabledBackgroundColor,
    disabledTextColor,
    disabledBorderColor,
  } = CustomTheme();

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <Ripple
      rippleColor={darkmodeColor}
      onPress={handlePress}
      rippleOpacity={0.7}
      rippleDuration={1000}
      style={[
        styles.CustombuttonView,
        inlineStyle,
        {
          backgroundColor: disabled
            ? disabledBackgroundColor
            : darkBackgroundColor,
          borderColor: disabled ? disabledBorderColor : darkBorderColor,
        },
      ]}
      disabled={disabled}>
      <Text
        style={[
          styles.textStyle,
          textStyle,
          {
            color: disabled ? disabledTextColor : darkmodeColor,
          },
        ]}>
        {text}
      </Text>
    </Ripple>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  CustombuttonView: {
    width: moderateScale(343),
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: moderateScale(16),
    borderWidth: 1,
  },
  textStyle: {
    fontSize: scale(16),
    fontFamily: 'Poppins',
    fontWeight: '700',
    textAlign: 'center',
  },
});
