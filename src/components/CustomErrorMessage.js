import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {moderateScale, scale} from 'react-native-size-matters';
import Color from '../constants/Color';

const CustomErrorMessage = ({text}) => {
  return (
    <View style={styles.errorContainerView}>
      <Text style={styles.errorTextStyle}>{text}</Text>
    </View>
  );
};

export default CustomErrorMessage;

const styles = StyleSheet.create({
  errorContainerView: {
    alignItems: 'center',
    marginTop: moderateScale(4),
  },
  errorTextStyle: {
    color: Color.RED,
    fontSize: scale(14),
    fontWeight: '400',
  },
});
