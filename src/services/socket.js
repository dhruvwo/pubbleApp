import Pusher from 'pusher-js/react-native';
import {socketConfig} from '../constants/Default';
import store from '../store';
import {
  authAction,
  collectionsAction,
  eventsAction,
  myInboxAction,
  conversationsAction,
} from '../store/actions';
import * as _ from 'lodash';
// import {pipes} from 'pubble-pipes/dist/react-native/pubble-pipes';
let precenceChannel;
let communityChannel;
let communityAccountChannel;
let conversationChannel;
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
    memberAddedResponse.type = 'memberAdded';
    store.dispatch(
      collectionsAction.socketUpdateOfflineStatus(memberAddedResponse),
    );
  });
  precenceChannel.bind('pusher:member_removed', (memberRemovedResponse) => {
    memberRemovedResponse.type = 'memberRemoved';
    store.dispatch(
      collectionsAction.socketUpdateOfflineStatus(memberRemovedResponse),
    );
  });
  precenceChannel.bind('pusher:subscription_error', (data) => {
    console.error('subscribePresenceChannels subscription_error data', data);
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
    const deleteState = store.getState();
    if (
      deletePostResponse.postType === 'Q' ||
      deletePostResponse.postType === 'M'
    ) {
      store.dispatch(eventsAction.deleteStream(deletePostResponse));
    }
    if (
      deletePostResponse.postType === 'A' ||
      deletePostResponse.postType === 'C' ||
      deletePostResponse.postType === 'O'
    ) {
      let chatType;
      if (
        deletePostResponse.postType === 'C' ||
        deletePostResponse.postType === 'A'
      ) {
        chatType = 'chat';
      } else if (deletePostResponse.postType === 'O') {
        chatType = 'internal';
      }
      if (
        deleteState.currentCard.conversationId ===
        deletePostResponse.conversationId
      ) {
        store.dispatch(
          conversationsAction.deleteConversationById({
            postId: deletePostResponse.postId,
            chatType: chatType,
          }),
        );
      }
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
    const postState = store.getState();
    let eventType = '';
    if (postResponse.type === 'Q') {
      if (postResponse.status === 40) {
        eventType = 'New';
      }
    } else if (postResponse.type === 'A') {
      if (postResponse.status === 20) {
        eventType = 'In Progress';
      }
    } else if (postResponse.type === 'M') {
      if (postResponse.status === 20) {
        eventType = 'Draft';
      }
    } else if (postResponse.type === 'C') {
      if (postResponse.status === 20) {
        eventType = 'Published';
      }
    }
    if (eventType) {
      store.dispatch(
        eventsAction.socketNotificationCounts({
          data: postResponse,
          eventType,
        }),
      );
    }
    if (
      postResponse.type === 'A' ||
      postResponse.type === 'C' ||
      postResponse.type === 'O'
    ) {
      let chatType = getChatType(postResponse);
      if (
        postState.currentCard?.conversationId === postResponse.conversationId
      ) {
        store.dispatch(
          conversationsAction.updateConversations({
            ...postResponse,
            chatType: chatType,
          }),
        );
      }
    }
  });

  communityAccountChannel.bind('unapprove_post', (unapprovePostResponse) => {
    if (unapprovePostResponse.type === 'A') {
      store.dispatch(
        conversationsAction.updateConversationById({
          ...unapprovePostResponse,
          chatType: 'chat',
        }),
      );
    } else {
      const getMyinboxStram = state.myInbox.stream;
      if (getMyinboxStram.length > 0) {
        const getMyinboxStramIndex = state.myInbox.stream.findIndex(
          (item) => item.id === unapprovePostResponse.id,
        );
        unapprovePostResponse.star = getMyinboxStram[getMyinboxStramIndex].star;
        store.dispatch(myInboxAction.updateStream(unapprovePostResponse));
      }
      const getStreamForStar = state.events.stream;
      const getStreamForStarIndex = state.events.stream.findIndex(
        (item) => item.id === unapprovePostResponse.id,
      );
      unapprovePostResponse.star = getStreamForStar[getStreamForStarIndex].star;
      store.dispatch(eventsAction.updateStream(unapprovePostResponse));
    }
  });

  communityAccountChannel.bind('approve_post', (approvePostResponse) => {
    if (approvePostResponse.type === 'A') {
      store.dispatch(
        conversationsAction.updateConversationById({
          ...approvePostResponse,
          chatType: 'chat',
        }),
      );
    } else {
      const getMyinboxStram = state.myInbox.stream;
      if (getMyinboxStram.length > 0) {
        const getMyinboxStramIndex = state.myInbox.stream.findIndex(
          (item) => item.id === approvePostResponse.id,
        );
        approvePostResponse.star = getMyinboxStram[getMyinboxStramIndex].star;
        store.dispatch(myInboxAction.updateStream(approvePostResponse));
      }
      const getStreamForStar = state.events.stream;
      const getStreamForStarIndex = state.events.stream.findIndex(
        (item) => item.id === approvePostResponse.id,
      );
      approvePostResponse.star = getStreamForStar[getStreamForStarIndex].star;
      store.dispatch(eventsAction.updateStream(approvePostResponse));
    }
  });

  communityAccountChannel.bind('update', (updateResponse) => {
    const updateState = store.getState();
    if (
      updateResponse.type === 'A' ||
      updateResponse.type === 'C' ||
      updateResponse.type === 'O'
    ) {
      let chatType = getChatType(updateResponse);
      if (
        updateState.currentCard.conversationId === updateResponse.conversationId
      ) {
        store.dispatch(
          conversationsAction.updateConversationById({
            ...updateResponse,
            chatType: chatType,
          }),
        );
      }
    }
    if (updateResponse.type === 'Q') {
      store.dispatch(eventsAction.socketUpdateCurrentStream(updateResponse));
      store.dispatch(myInboxAction.socketUpdateStream(updateResponse));
    }
    if (updateResponse.type === 'M' && updateResponse.status === 0) {
      store.dispatch(
        eventsAction.socketNotificationClearSpecific(updateResponse),
      );
    }
  });

  communityAccountChannel.bind('replying', (replyingResponse) => {
    const replyState = store.getState();
    if (
      replyState.currentCard.conversationId === replyingResponse.conversationId
    ) {
      if (replyingResponse.author.id !== replyState.auth.community.account.id) {
        const replyingName = replyingResponse.author.alias.split(' ');
        store.dispatch(
          conversationsAction.setAnotherPersonTyping(replyingName[0]),
        );
      }
    }
  });
  return communityAccountChannel;
};

export const subscribeConversationChannels = (callback) => {
  const state = store.getState();
  pusher = pusherAuthConfig();
  conversationChannel = pusher.subscribe(
    `conversation_${state.events.currentCard.conversationId}`,
  );

  // conversationChannel.bind('replying', (replyingResponse) => {
  //   const replyState = store.getState();
  //   // console.log(replyingResponse, 'api response');
  //   if (
  //     replyState.conversations.currentConversationId ===
  //     replyingResponse.conversationId
  //   ) {
  //     // console.log('if');
  //     if (replyingResponse.author.id !== replyState.auth.community.account.id) {
  //       // console.log('if-1');
  //       const replyingName = replyingResponse.author.alias.split(' ');
  //       // console.log(replyingName, 'replying');
  //       store.dispatch(
  //         conversationsAction.setAnotherPersonTyping(replyingName[0]),
  //       );
  //     }
  //   }
  // });

  conversationChannel.bind('update', (updateResponse) => {
    if (updateResponse.type === 'A') {
      store.dispatch(
        conversationsAction.updateConversationById({
          ...updateResponse,
          chatType: 'chat',
        }),
      );
    }
    if (updateResponse.type === 'Q') {
      store.dispatch(eventsAction.socketUpdateCurrentStream(updateResponse));
      store.dispatch(myInboxAction.socketUpdateStream(updateResponse));
    }
  });
  return conversationChannel;
};

const getChatType = (res) => {
  if (res.type === 'C' || res.type === 'A') {
    return 'chat';
  } else if (res.type === 'O' && res.appId.toString() !== res.conversationId) {
    return 'internal';
  } else if (res.type === 'O' && res.appId.toString() === res.conversationId) {
    return 'eventChat';
  }
};
