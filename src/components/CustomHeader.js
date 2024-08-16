import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
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
  onBackPress,
  inlineStyle,
}) => {
  const {darkmodeColor, darkBackgroundColor} = CustomTheme();

  const handleBackPress = () => {
    if (onBackPress) {
      Alert.alert(
        'Confirm',
        'Are you sure you want to go back? Your progress may be lost.',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              if (onPress) onPress();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      if (onPress) onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleBackPress}
        activeOpacity={0.5}>
        <View style={styles.iconContainer}>
          <CustomIcon
            name={iconName}
            size={size}
            color={color || darkmodeColor}
            inlineStyle={inlineStyle}
          />
        </View>
        {text && (
          <View style={styles.textContainer}>
            <Text style={[styles.headerTextTitle, {color: darkmodeColor}]}>
              {text}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginTop: moderateScale(8),
    backgroundColor: 'transparent',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: moderateScale(6),
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  headerTextTitle: {
    fontWeight: '800',
    textAlign: 'center',
    fontSize: scale(18),
    position: 'relative',
  },
});
