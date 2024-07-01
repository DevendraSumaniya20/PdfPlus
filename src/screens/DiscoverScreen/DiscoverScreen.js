import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Drawer} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const DiscoverScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text
        onPress={() => {
          navigation.openDrawer();
        }}>
        DiscoverScreen
      </Text>
    </View>
  );
};

export default DiscoverScreen;
