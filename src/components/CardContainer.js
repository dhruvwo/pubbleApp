import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import Colors from '../constants/Colors';
import {Discriminator} from '../constants/Default';
import AnnouncementCard from './AnnouncementCard';
import EventPollCard from './EventPollCard';
import MessageCard from './MessageCard';
import QuestionCard from './QuestionCard';

export default function CardContainer({
  navigation,
  item,
  onAssignPress,
  setEventActionLoader,
  onPressCard,
  isMyIndex,
}) {
  const reduxState = useSelector(({auth, collections}) => ({
    user: auth?.user,
    groupsCollection: collections.groups,
  }));
  let renderLabel = null;
  if (isMyIndex) {
    const appType = reduxState.groupsCollection[item.appId]?.discriminator;
    if (appType) {
      let labelText = Discriminator[appType] || '';
      if (labelText) {
        renderLabel = (
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{labelText}</Text>
          </View>
        );
      }
    }
  }
  switch (item.type) {
    case 'Q':
      return (
        <QuestionCard
          renderLabel={renderLabel}
          user={reduxState.user}
          item={item}
          onPressCard={() => onPressCard(item)}
          onAssignPress={() => onAssignPress(item)}
          setEventActionLoader={setEventActionLoader}
        />
      );
    case 'M':
      return (
        <MessageCard
          renderLabel={renderLabel}
          user={reduxState.user}
          item={item}
          onPressCard={() => onPressCard(item)}
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
          renderLabel={renderLabel}
          user={reduxState.user}
          item={item}
          onPressCard={() => onPressCard(item)}
          onAssignPress={() => onAssignPress(item)}
          setEventActionLoader={setEventActionLoader}
        />
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.green,
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
