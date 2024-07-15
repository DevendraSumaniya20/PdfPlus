import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomIcon from './CustomIcon';
import {moderateScale, scale} from 'react-native-size-matters';
import CustomTheme from '../constants/CustomTheme';

const CustomSearch = ({
  placeholder,
  placeholderTextColor,
  onChangeText,
  iconName,
  size,
  type,
  iconColor,
  iconName2,
  type2,
  iconColor2,
  textInputStyle,
  value,
  onPress,
}) => {
  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: darkBackgroundColor, borderColor: darkBorderColor},
      ]}>
      <View
        style={[
          styles.textInputContainer,
          {backgroundColor: darkBackgroundColor, borderColor: darkBorderColor},
        ]}>
        {value ? null : (
          <CustomIcon
            name={iconName}
            color={iconColor}
            size={size}
            type={type}
          />
        )}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
          style={[
            styles.textInput,
            textInputStyle,
            {
              borderColor: darkBorderColor,
              backgroundColor: darkBackgroundColor,
            },
          ]}
          value={value}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          autoFocus={false}
        />
        <TouchableOpacity onPress={onPress}>
          {value ? null : (
            <CustomIcon
              name={iconName2}
              color={iconColor2}
              size={size}
              type={type2}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomSearch;

const styles = StyleSheet.create({
  container: {},
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: Platform.OS === 'ios' ? moderateScale(8) : moderateScale(4),
    borderWidth: 1,
    borderRadius: moderateScale(10),
  },
  textInput: {
    flex: 1,
    fontSize: scale(16),
    marginLeft: moderateScale(8),
    fontWeight: '600',
  },
});
