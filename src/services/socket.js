import Pusher from 'pusher-js/react-native';
import {socketConfig} from '../constants/Default';
import Pubble from 'pubble-pipes/dist/react-native/pubble-pipes';

const pusher = new Pusher(socketConfig.pusher.key, {
  ...socketConfig.config,
  auth: {
    params: {
      communityId: '2904',
      page: 'https://pubbledev.pubblebot.com',
    },
  },
});
const pubble = new Pubble.pipes(
  socketConfig.pubble.key,
  socketConfig.pubble.config,
);

console.log('pubble', {pusher, pubble});

export const subscribeChatChannel = (callback) => {
  const channel = pusher.subscribe('chat_channel');
  console.log('calling pusher...', channel);
  channel.bind('pusher:subscription_succeeded', (subscriptionSucceeded) => {
    console.log(
      'subscribeChatChannel connection success...',
      subscriptionSucceeded,
    );
    channel.bind('join', (data) => {
      console.log('join data', data);
    });
    channel.bind('part', (data) => {
      console.log('part data', data);
    });
    channel.bind('message', (data) => {
      console.log('message data', data);
      callback(data);
    });
  });
  return channel;
};

export const subscribePubbleChannel = (callback) => {
  const channel = pubble.subscribe('chat_channel');
  channel.bind('pubble:subscription_succeeded', (subscriptionSucceeded) => {
    console.log(
      'subscribePubbleChannel connection success....',
      subscriptionSucceeded,
    );
    callback(subscriptionSucceeded);
  });
  return channel;
};

// export const connectSocket = ({email, token, serviceId}) => {
//   // store.dispatch(liveEventAttacksLoading(true));
//   console.log('connectSocket:::::::::');
//   if (socketService.client) {
//     disconnectSocket();
//   }
//   localStorage.debug = '';
//   const host = `${document.location.protocol}//${Config ? Config.host : ''}:${
//     Config ? Config.port : ''
//   }`;
//   socketService.client = connect(host, {
//     query: {
//       'X-Paid-User-Username': email,
//       'X-Paid-User-Token': token,
//       'X-Paid-User-Service-Id': serviceId,
//     },
//     transports: ['websocket'],
//     secure: true,
//   });

//   // socket.client = connect(`${Config ? Config.constant.nodeAPIUrl : 'localhost:4949'}`);
//   socketService.client.on('connect', (data) => {
//     console.log(data, 'Socket Connected');
//   });
//   socketService.client.on('error', (data) => {
//     console.log(data, 'Socket Error');
//   });

//   socketService.client.on('PROFILE_UPDATE', (data) => {
//     console.log(data, 'Socket PROFILE_UPDATE');
//     store.dispatch(SocketProfileSetupState(data));
//   });
// };
