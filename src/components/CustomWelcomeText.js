import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import CustomTheme from '../constants/CustomTheme';

const CustomWelcomeText = ({
  text,
  lineHeight,
  letterSpacing,
  width,
  fontWeight = '500',
  fontFamily = 'Rubik-Regular',
  fontSize = scale(24),
  inlineStyle,
}) => {
  const {darkmodeColor, darkBorderColor, darkBackgroundColor} = CustomTheme();
  return (
    <View style={[styles.welcomeTextView, {}]}>
      <Text
        style={[
          styles.textStyle,

          inlineStyle,
          {
            lineHeight: lineHeight,
            letterSpacing: letterSpacing,
            width: width,
            fontWeight: fontWeight,
            fontFamily: fontFamily,
            fontSize: fontSize,
          },
          {color: darkmodeColor},
        ]}>
        {text}
      </Text>
    </View>
  );
};

export default CustomWelcomeText;

const styles = StyleSheet.create({
  welcomeTextView: {
    alignItems: 'center',
  },
  textStyle: {},
});
