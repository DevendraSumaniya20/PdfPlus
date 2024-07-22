import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  Share,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomInput from '../../../../components/CustomTextInput';
import CustomTheme from '../../../../constants/CustomTheme';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters';
import CustomButton from '../../../../components/CustomButton';
import CustomHeader from '../../../../components/CustomHeader';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const FeedbackScreen = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(true);

  const {screenName} = route.params || {};
  const {darkmodeColor, darkBackgroundColor, darkBorderColor} = CustomTheme();

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const userDoc = await firestore().collection('Users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setEmail(userData.email || '');
        } else {
          console.log('User document does not exist in Firestore');
        }
      } else {
        console.log('No user ID found in local storage');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (!email || !request) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await firestore().collection('Feedback').add({
        email,
        request,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      // await Share.share({
      //   message: `Feedback received from ${email}:\n\n${request}`,
      // });

      Alert.alert('Feedback Submitted', 'Thank you for your feedback!');
      setEmail('');
      setRequest('');
    } catch (error) {
      console.error('Error submitting feedback: ', error);
      Alert.alert('Error', 'There was an error submitting your feedback.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={'large'} color={darkmodeColor} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: darkBackgroundColor}]}>
      <View style={styles.marginContainer}>
        <CustomHeader
          text={screenName}
          iconName={'chevron-back'}
          color={darkmodeColor}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.welcomeTextView}>
          <Text style={[styles.title, {color: darkmodeColor}]}>
            We Value Your Feedback
          </Text>
          <Text style={[styles.subtitle, {color: darkmodeColor}]}>
            Let us know what PDF or book you would like to add:
          </Text>
        </View>

        <View style={{marginVertical: moderateVerticalScale(4)}}>
          <View style={styles.emailView}>
            <CustomInput
              value={email}
              multiline={false}
              placeholderTextColor={darkmodeColor}
              onChangeText={setEmail}
              placeholder="Your Email"
              keyboardType="email-address"
              editable={false}
            />
          </View>

          <CustomInput
            placeholderTextColor={darkmodeColor}
            placeholder="Describe your request here..."
            value={request}
            onChangeText={setRequest}
            multiline={true}
            numberOfLines={4}
            inputStyle={{
              height: moderateVerticalScale(120),
            }}
            textAlignVertical={'top'}
          />
        </View>

        <View style={styles.submitButtonView}>
          <CustomButton text={'Submit Request'} onPress={handleSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  marginContainer: {
    margin: moderateScale(16),
  },
  welcomeTextView: {
    marginVertical: moderateVerticalScale(16),
  },
  title: {
    fontSize: scale(22),
    fontWeight: 'bold',
    marginBottom: moderateVerticalScale(8),
  },
  subtitle: {
    fontSize: scale(16),
    fontWeight: '600',
  },
  emailView: {
    marginVertical: moderateVerticalScale(8),
  },
  submitButtonView: {
    marginVertical: moderateVerticalScale(16),
  },
});
