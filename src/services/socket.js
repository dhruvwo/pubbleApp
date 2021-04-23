import Pusher from 'pusher-js/react-native';
import {socketConfig} from '../constants/Default';
import store from '../store';
// import {pipes} from 'pubble-pipes/dist/react-native/pubble-pipes';

let pusher = new Pusher(socketConfig.pusher.key, {
  ...socketConfig.pusher.config,
});
// const pubble = new pipes(socketConfig.pubble.key, socketConfig.pubble.config);

function pusherAuthConfig() {
  const state = store.getState();
  if (state.auth?.community?.community?.id && !pusher.config.auth?.params) {
    pusher.config = {
      ...pusher.config,
      auth: {
        params: {
          communityId: state.auth.community.community.id,
          page: `https://${state.auth.community.community.shortName}.pubblebot.com`,
        },
      },
    };
  }
  return pusher;
}

export const subscribePresenceChannels = (callback) => {
  const state = store.getState();
  pusher = pusherAuthConfig();

  const channel = pusher.subscribe(
    `presence-community_${state.auth.community.community.id}`,
  );
  channel.bind('pusher:subscription_succeeded', (subscriptionSucceeded) => {
    console.log(
      'subscribeChatChannel connection success...',
      subscriptionSucceeded,
    );
  });
  channel.bind('pusher:member_added', (data) => {
    console.log('member_added data', data);
  });
  channel.bind('pusher:member_removed', (data) => {
    console.log('member_removed data', data);
  });
  channel.bind('pusher:subscription_error', (data) => {
    console.log('subscription_error data', data);
    callback(data);
  });
  return channel;
};

export const subscribeCommunityChannels = (callback) => {
  const state = store.getState();
  pusher = pusherAuthConfig();

  const channel = pusher.subscribe(
    `community_${state.auth.community.community.id}`,
  );
  channel.bind('new_canned_message', (subscriptionSucceeded) => {
    console.log(
      'subscribeChatChannel connection success...',
      subscriptionSucceeded,
    );
  });
  channel.bind('pusher:subscription_success', (data) => {
    console.log('subscription_success data', data);
  });
  channel.bind('pusher:subscription_error', (data) => {
    console.log('subscription_error data', data);
  });
  return channel;
};
