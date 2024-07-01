import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomIcon from './CustomIcon';
import Color from '../constants/Color';
import CustomTheme from '../constants/CustomTheme';

const CustomInput = ({
  placeholder = '',
  inputStyle = {},
  onChangeText = () => {},
  secureTextEntry,
  onPressRight,
  rightIcon,
  autoFocus,
  placeholderTextColor,
}) => {
  const {darkmodeColor, darkBorderColor, darkBackgroundColor} = CustomTheme();

  return (
    <View style={[styles.textInput, {borderColor: darkBorderColor}]}>
      <TextInput
        placeholder={placeholder}
        style={[styles.inputStyle, inputStyle, {color: darkmodeColor}]}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        placeholderTextColor={placeholderTextColor}
      />
      {!!rightIcon && (
        <View style={styles.rightIconContainer}>
          <TouchableOpacity onPress={onPressRight}>
            <CustomIcon name={rightIcon} size={20} color={darkmodeColor} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputStyle: {
    padding: moderateScale(12),
    fontSize: scale(14),
    height: moderateScale(52),
    fontFamily: 'Rubik-Regular',
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 21,
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    justifyContent: 'space-between',
    textAlign: 'left',
    width: moderateScale(343),
  },
  rightIconContainer: {
    marginRight: moderateScale(8),
    alignItems: 'center',
  },
});
