import React, {useEffect, useContext} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {LogBox} from 'react-native';
import {
  LocalizationProvider,
  LocalizationContext,
} from './src/components/Translations';

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

const App = () => {
  const {initializeAppLanguage} = useContext(LocalizationContext); // 1

  useEffect(() => {
    initializeAppLanguage(); // 2
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);
  return (
    <LocalizationProvider>
      <AppNavigator />
    </LocalizationProvider>
  );
};

export default App;
