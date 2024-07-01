import React from 'react';
import {View} from 'react-native';

import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import CustomTheme from '../../constants/CustomTheme';
import styles from './Styles';
import Bubble from '../../animation/Bubble';

const LoginScreen = () => {
  const {darkmodeColor, darkBackgroundColor} = CustomTheme();

  return (
    <View style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.bubblesContainer}>
        {[...Array(50)].map((_, index) => (
          <Bubble key={index} index={index} />
        ))}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.marginContainer}>
          <View style={styles.inputView}>
            <CustomTextInput
              placeholder="Email"
              placeholderTextColor={darkmodeColor}
            />
            <View style={{marginVertical: 8}} />
            <CustomTextInput
              placeholder="Password"
              placeholderTextColor={darkmodeColor}
            />
          </View>

          <CustomButton text={'Login'} onPress={() => {}} />
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
