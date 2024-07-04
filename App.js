import {LogBox, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Navigation from './src/navigation/Navigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';

const App = () => {
  LogBox.ignoreLogs([
    'Warning: A props object containing a "key" prop is being spread into JSX:',
  ]);

  return (
    <View style={{flex: 1}}>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </View>
  );
};

export default App;
