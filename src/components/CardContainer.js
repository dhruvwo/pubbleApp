import React from 'react';
import {useSelector} from 'react-redux';
import AnnouncementCard from './AnnouncementCard';
import EventPollCard from './EventPollCard';
import MessageCard from './MessageCard';
import QuestionCard from './QuestionCard';

export default function CardContainer({
  navigation,
  item,
  activeTab,
  onAssignPress,
  setEventActionLoader,
}) {
  const reduxState = useSelector(({auth}) => ({
    user: auth?.user,
  }));
  switch (item.type) {
    case 'Q':
      return (
        <QuestionCard
          user={reduxState.user}
          item={item}
          onPressCard={() => navigation.navigate('ChatScreen', {data: item})}
          activeTab={activeTab}
          onAssignPress={() => onAssignPress(item)}
          setEventActionLoader={setEventActionLoader}
        />
      );
    case 'M':
      return (
        <MessageCard
          user={reduxState.user}
          item={item}
          onPressCard={() => navigation.navigate('ChatScreen', {data: item})}
          onAssignPress={() => onAssignPress(item)}
          setEventActionLoader={setEventActionLoader}
        />
      );
    case 'V':
      return (
        <EventPollCard
          user={reduxState.user}
          item={item}
          setEventActionLoader={setEventActionLoader}
        />
      );
    case 'U':
      return (
        <AnnouncementCard
          user={reduxState.user}
          item={item}
          onPressCard={() => navigation.navigate('ChatScreen', {data: item})}
          onAssignPress={() => onAssignPress(item)}
          setEventActionLoader={setEventActionLoader}
        />
      );
    default:
      return null;
  }
}
