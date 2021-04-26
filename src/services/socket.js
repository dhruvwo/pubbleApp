import Pusher from 'pusher-js/react-native';
import {socketConfig} from '../constants/Default';
import store from '../store';
import {authAction, collectionsAction} from '../store/actions';
// import {pipes} from 'pubble-pipes/dist/react-native/pubble-pipes';

Pusher.log = (msg) => {
  console.log(msg);
};
let pusher = new Pusher(socketConfig.pusher.key, {
  ...socketConfig.pusher.config,
});

pusher.connection.bind('state_change', function (states) {
  console.log('states', states);
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
      'subscribePresenceChannels connection success...',
      subscriptionSucceeded,
    );
  });
  channel.bind('pusher:member_added', (data) => {
    console.log('subscribePresenceChannels member_added data', data);
  });
  channel.bind('pusher:member_removed', (data) => {
    console.log('subscribePresenceChannels member_removed data', data);
  });
  channel.bind('pusher:subscription_error', (data) => {
    console.log('subscribePresenceChannels subscription_error data', data);
  });
  return channel;
};

export const subscribeCommunityChannels = (callback) => {
  const state = store.getState();
  pusher = pusherAuthConfig();

  const channel = pusher.subscribe(
    `community_${state.auth.community.community.id}`,
  );

  channel.bind('new_canned_message', (newCannedMessageResponse) => {
    store.dispatch(authAction.updateCannedMessage(newCannedMessageResponse));
  });

  channel.bind('delete_canned_message', (removeCannedMessageResponse) => {
    store.dispatch(authAction.removeCannedMessage(removeCannedMessageResponse));
  });

  channel.bind('update_account_status', (updateAccountStatusResponse) => {
    const state = store.getState();
    if (
      state.auth?.community?.account?.id ===
      updateAccountStatusResponse.accountId
    ) {
      store.dispatch(authAction.updateUserStatus(updateAccountStatusResponse));
    }

    store.dispatch(
      collectionsAction.updateUserCollectionStatus(updateAccountStatusResponse),
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
