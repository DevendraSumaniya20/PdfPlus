import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React from 'react';
import ImagePath from '../../../../constants/ImagePath';
import CustomTheme from '../../../../constants/CustomTheme';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomHeader from '../../../../components/CustomHeader';

const AboutScreen = ({navigation, route}) => {
  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  const {screenName} = route.params || {};

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.marginContainer}>
          <CustomHeader
            text={screenName}
            iconName={'chevron-back'}
            color={darkmodeColor}
            onPress={() => {
              navigation.goBack();
            }}
          />

          <View style={styles.header}>
            <Image
              source={
                darkmodeColor === '#000'
                  ? ImagePath.LOGOBLACK
                  : ImagePath.LOGOWHITE
              }
              resizeMethod="auto"
              resizeMode="center"
              style={styles.logo}
            />
          </View>
          <View
            style={[
              styles.content,
              {
                backgroundColor: darkBackgroundColor,
                borderColor: darkBorderColor,
              },
            ]}>
            <Text style={[styles.paragraph, {color: darkmodeColor}]}>
              Welcome to our app! We are dedicated to providing the best
              experience for our users. Our mission is to innovate and
              constantly improve our services.
            </Text>
            <Text style={[styles.paragraph, {color: darkmodeColor}]}>
              Access a variety of study materials and books directly from the
              app. You can download them for offline use and view them anytime.
            </Text>
            <Text style={[styles.paragraph, {color: darkmodeColor}]}>
              Our team consists of experienced professionals passionate about
              technology and user experience. We strive to create intuitive and
              engaging applications that make a difference in your daily life.
            </Text>
            <Text style={[styles.paragraph, {color: darkmodeColor}]}>
              Thank you for choosing our app. We hope you enjoy using it as much
              as we enjoyed creating it for you.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: darkmodeColor}]}>
              Creator: Devendra Sumaniya | Email: pdfplus@gmail.com
            </Text>
            <Text style={[styles.footerText, {color: darkmodeColor}]}>
              Version: 1.0.0
            </Text>
            <Text style={[styles.footerText, {color: darkmodeColor}]}>
              © 2024 All Rights Reserved
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  marginContainer: {
    margin: moderateScale(16),
  },
  header: {
    alignItems: 'center',
    marginVertical: moderateVerticalScale(32),
  },
  logo: {
    width: moderateScale(120),
    height: moderateVerticalScale(100),
    marginBottom: moderateVerticalScale(16),
  },
  content: {
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  paragraph: {
    fontSize: scale(14),
    marginBottom: moderateVerticalScale(16),
    lineHeight: 22,
  },
  footer: {
    marginTop: moderateVerticalScale(32),
    alignItems: 'center',
  },
  footerText: {
    fontSize: scale(12),
    marginBottom: moderateVerticalScale(4),
    textAlign: 'center',
  },
});
