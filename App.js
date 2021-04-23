import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {LogBox} from 'react-native';
import {subscribePresenceChannels} from './src/services/socket';
import {useSelector} from 'react-redux';

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

const App = () => {
  const reduxState = useSelector(({auth}) => ({
    communityId: auth.community?.community?.id,
  }));

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  useEffect(() => {
    let pusherPublicChannelSub = '';
    // let pubblePublicChannelSub = '';
    if (reduxState.communityId) {
      pusherPublicChannelSub = subscribePresenceChannels(callback);
      // pubblePublicChannelSub = subscribePubbleChannel(pipeCallback);
    }
    return () => {
      if (pusherPublicChannelSub.unsubscribe) {
        pusherPublicChannelSub.unsubscribe();
      }
      // pubblePublicChannelSub.unsubscribe();
    };
  }, [reduxState.communityId]);

  function callback(data) {
    console.log('data in appks', data);
  }

  function pipeCallback(data) {
    console.log('pipeCallback in appks', data);
  }

  return <AppNavigator />;
};

export default App;
