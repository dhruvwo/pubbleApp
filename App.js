import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {LogBox} from 'react-native';
import {
  subscribePresenceChannels,
  subscribeCommunityChannels,
  subscribeCommunityAccountChannels,
} from './src/services/socket';
import {useSelector} from 'react-redux';
import {axiosInterceptor} from './src/services/interceptor';

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};
axiosInterceptor();

const App = () => {
  const reduxState = useSelector(({auth}) => ({
    communityId: auth.community?.community?.id,
  }));

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  useEffect(() => {
    let communityChannelsSub = '';
    let communityAccountChannelsSub = '';
    let presenceChannelsSub = '';
    // let pubblePublicChannelSub = '';
    if (reduxState.communityId) {
      presenceChannelsSub = subscribePresenceChannels(callback);
      communityChannelsSub = subscribeCommunityChannels(callback);
      communityAccountChannelsSub = subscribeCommunityAccountChannels(callback);
      // pubblePublicChannelSub = subscribePubbleChannel(pipeCallback);
    }
    return () => {
      if (communityChannelsSub.unsubscribe) {
        communityChannelsSub.unsubscribe();
      }
      if (communityAccountChannelsSub.unsubscribe) {
        communityAccountChannelsSub.unsubscribe();
      }
      if (presenceChannelsSub.unsubscribe) {
        presenceChannelsSub.unsubscribe();
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
