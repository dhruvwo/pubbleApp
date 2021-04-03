import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {LogBox} from 'react-native';

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);
  return <AppNavigator />;
};

export default App;
