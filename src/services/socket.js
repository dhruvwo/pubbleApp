import Pusher from 'pusher-js/react-native';
import {socketConfig} from '../constants/Default';
import store from '../store';
import {authAction, collectionsAction, eventsAction} from '../store/actions';
import * as _ from 'lodash';
// import {pipes} from 'pubble-pipes/dist/react-native/pubble-pipes';
let precenceChannel;
let communityChannel;
let communityAccountChannel;
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

export function pusherAuthConfig() {
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
  precenceChannel = pusher.subscribe(
    `presence-community_${state.auth.community.community.id}`,
  );
  precenceChannel.bind(
    'pusher:subscription_succeeded',
    (subscriptionSucceeded) => {
      console.log(
        'subscribePresenceChannels connection success...',
        subscriptionSucceeded,
      );

      if (!subscriptionSucceeded.myID) {
        store.dispatch(authAction.updateUserStatus({status: 'active'}));
      }

      subscriptionSucceeded.type = 'newConnection';
      store.dispatch(
        collectionsAction.socketUpdateOfflineStatus(subscriptionSucceeded),
      );
    },
  );
  precenceChannel.bind('pusher:member_added', (memberAddedResponse) => {
    console.log(
      'subscribePresenceChannels member_added data',
      memberAddedResponse,
    );
    memberAddedResponse.type = 'memberAdded';
    store.dispatch(
      collectionsAction.socketUpdateOfflineStatus(memberAddedResponse),
    );
  });
  precenceChannel.bind('pusher:member_removed', (memberRemovedResponse) => {
    console.log(
      'subscribePresenceChannels member_removed data',
      memberRemovedResponse,
    );
    memberRemovedResponse.type = 'memberRemoved';
    store.dispatch(
      collectionsAction.socketUpdateOfflineStatus(memberRemovedResponse),
    );
  });
  precenceChannel.bind('pusher:subscription_error', (data) => {
    console.log('subscribePresenceChannels subscription_error data', data);
  });
  return precenceChannel;
};

export const subscribeCommunityChannels = (callback) => {
  const state = store.getState();
  pusher = pusherAuthConfig();

  communityChannel = pusher.subscribe(
    `community_${state.auth.community.community.id}`,
  );

  communityChannel.bind('new_canned_message', (newCannedMessageResponse) => {
    store.dispatch(authAction.updateCannedMessage(newCannedMessageResponse));
  });

  communityChannel.bind(
    'delete_canned_message',
    (removeCannedMessageResponse) => {
      store.dispatch(
        authAction.removeCannedMessage(removeCannedMessageResponse),
      );
    },
  );

  communityChannel.bind('new_app', (newAppResponse) => {
    store.dispatch(authAction.addNewEventsSocket(newAppResponse));
  });

  communityChannel.bind('update_app', (updateAppResponse) => {
    store.dispatch(authAction.updateEventsSocket(updateAppResponse));
  });

  communityChannel.bind('update_account', (updateAccountMessageResponse) => {
    const state = store.getState();
    if (
      state.auth?.community?.account?.id ===
      updateAccountMessageResponse.accountId
    ) {
      store.dispatch(
        authAction.updateUserDetails(updateAccountMessageResponse),
      );
    }

    store.dispatch(
      collectionsAction.updateUserCollectionAvatar(
        updateAccountMessageResponse,
      ),
    );
  });

  communityChannel.bind(
    'update_account_status',
    (updateAccountStatusResponse) => {
      const state = store.getState();
      if (
        state.auth?.community?.account?.id ===
        updateAccountStatusResponse.accountId
      ) {
        store.dispatch(
          authAction.updateUserStatus(updateAccountStatusResponse),
        );
      }

      store.dispatch(
        collectionsAction.updateUserCollectionStatus(
          updateAccountStatusResponse,
        ),
      );
    },
  );

  communityChannel.bind('pusher:subscription_success', (data) => {
    console.log('subscription_success data', data);
  });

  communityChannel.bind('pusher:subscription_error', (data) => {
    console.log('subscription_error data', data);
  });

  communityChannel.bind('new_remind_task', (newRemindTaskMessageResponse) => {
    store.dispatch(eventsAction.fnUpdateTask(newRemindTaskMessageResponse));
  });

  communityChannel.bind(
    'delete_remind_task',
    (deleteRemindTaskMessageResponse) => {
      store.dispatch(
        eventsAction.fnDeleteTask(deleteRemindTaskMessageResponse),
      );
    },
  );

  communityChannel.bind('pin', (pinMessageResponse) => {
    store.dispatch(authAction.fnPin(pinMessageResponse));
  });

  communityChannel.bind('unpin', (unpinMessageResponse) => {
    store.dispatch(authAction.fnUnpin(unpinMessageResponse));
  });

  communityChannel.bind('delete_post', (deletePostResponse) => {
    if (
      deletePostResponse.postType === 'Q' ||
      deletePostResponse.postType === 'M'
    ) {
      store.dispatch(eventsAction.deleteStream(deletePostResponse));
    }
    if (deletePostResponse.postType === 'A') {
      console.log(deletePostResponse, 'deletePostResponse//////');
    }
  });

  communityChannel.bind('new_subscriber', (newSubscriberResponse) => {
    if (newSubscriberResponse.subscriber.targetType === 'app') {
      const checkEventData = state.auth.events.findIndex(
        (item) => item.id === newSubscriberResponse.subscriber.targetId,
      );

      if (checkEventData === -1) {
        store.dispatch(
          collectionsAction.socketAddNewSubscriber(newSubscriberResponse),
        );
      } else {
        newSubscriberResponse.eventIndex = checkEventData;
        store.dispatch(authAction.socketNewSubscriber(newSubscriberResponse));
      }
    }
  });

  communityChannel.bind('delete_subscriber', (deleteSubscriberResponse) => {
    if (deleteSubscriberResponse.targetType === 'app') {
      const checkEventData = state.auth.events.findIndex(
        (item) => item.id === deleteSubscriberResponse.targetId,
      );

      if (checkEventData === -1) {
        store.dispatch(
          collectionsAction.socketUpdateSubscriber(deleteSubscriberResponse),
        );
      } else {
        deleteSubscriberResponse.eventIndex = checkEventData;
        store.dispatch(
          authAction.socketUpdateSubscriber(deleteSubscriberResponse),
        );
      }
    }
  });
  communityChannel.bind('new_votes', (newVoteResponse) => {
    store.dispatch(eventsAction.socketUpdatePoll(newVoteResponse));
  });

  communityChannel.bind('post', (postResponse) => {
    console.log(postResponse, 'post response.........');
  });

  return communityChannel;
};

export const subscribeCommunityAccountChannels = (callback) => {
  const state = store.getState();
  pusher = pusherAuthConfig();

  communityAccountChannel = pusher.subscribe(
    `community_account_${state.auth.community.community.id}_${state.auth.community.account.id}`,
  );

  communityAccountChannel.bind('post', (postResponse) => {
    if (postResponse.type === 'Q') {
      if (postResponse.status === 40) {
        postResponse.notificationType = 'events';
        postResponse.notificationName = 'new';
        store.dispatch(eventsAction.socketNotificationCounts(postResponse));
      }
    }
  });
  return communityAccountChannel;
};
