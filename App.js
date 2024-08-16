import {LogBox, View} from 'react-native';
import React, {useEffect} from 'react';
import Navigation from './src/navigation/Navigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  LogBox.ignoreAllLogs(true);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={{flex: 1}}>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </View>
  );
};

export default App;
