import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {eventsAction} from '../store/actions';
import Colors from '../constants/Colors';
import GifSpinner from '../components/GifSpinner';
import UserGroupImage from '../components/UserGroupImage';

export default function InternalChat(props) {
  const {data} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, collections}) => ({
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
    communityId: auth.community?.community?.id,
    selectedEvent: auth.selectedEvent,
  }));
  const [internalChatData, setInternalChatData] = useState([]);

  useEffect(() => {
    getVisitor();
  }, []);

  async function getVisitor() {
    const res = await dispatch(
      eventsAction.getConversation({
        conversationId: data.conversationId,
        postTypes: 'O',
        pageSize: 500,
        pageNumber: 1,
        appId: reduxState.selectedEvent.id,
        markAsRead: false,
      }),
    );
    console.log(res, '.....');
    setInternalChatData(res.data.data);
  }

  function renderItem({item}) {
    console.log(data);
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View>
          <UserGroupImage
            item={item.author}
            isAssigneesList={true}
            imageSize={40}
          />
        </View>
        <View></View>
      </View>
    );
  }

  return (
    <View
      style={{
        padding: 20,
      }}>
      <FlatList
        renderItem={renderItem}
        //   ListFooterComponent={renderFooter}
        //   ListEmptyComponent={renderEmpty}
        //   onMomentumScrollEnd={onMomentumScrollEnd}
        data={internalChatData}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
}
