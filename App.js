import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {LogBox} from 'react-native';
import {
  subscribeChatChannel,
  subscribePubbleChannel,
} from './src/services/socket';

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

function callback(data) {
  console.log('data in appks', data);
}

function pipeCallback(data) {
  console.log('pipeCallback in appks', data);
}

const App = () => {
  useEffect(() => {
    // const subscription = subscribeChatChannel(callback);
    // const pipeSub = subscribePubbleChannel(pipeCallback);
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);
  return <AppNavigator />;
};

export default App;
