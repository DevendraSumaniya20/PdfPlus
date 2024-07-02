import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomTheme from '../constants/CustomTheme';

const CustomDescriptionText = ({
  text,
  fontsize = scale(14),
  marginVertical,
  marginTop,
  lineHeight,
  fontWeight,
  fontFamily,
  inlineStyle,
}) => {
  const {darkmodeColor, darkBorderColor, darkBackgroundColor} = CustomTheme();
  return (
    <View style={styles.descriptionTextView}>
      <Text
        style={[
          styles.textStyle,
          inlineStyle,
          {
            fontSize: fontsize,
            marginVertical: marginVertical,
            marginTop: marginTop,
            lineHeight: lineHeight,
            fontWeight: fontWeight,
            fontFamily: fontFamily,
          },
          {color: darkmodeColor},
        ]}>
        {text}
      </Text>
    </View>
  );
};

export default CustomDescriptionText;

const styles = StyleSheet.create({
  descriptionTextView: {
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
  },
  textStyle: {
    fontStyle: 'normal',
  },
});
