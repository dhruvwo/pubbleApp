import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {eventsAction} from '../store/actions';
import Colors from '../constants/Colors';
import GifSpinner from '../components/GifSpinner';
import UserGroupImage from '../components/UserGroupImage';
import ChatContent from '../components/ChatContent';
import {formatAMPM} from '../services/utilities/Misc';
import CustomMentionInput from '../components/CustomMentionInput';
import * as _ from 'lodash';

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
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');

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
    console.log(res, 'res ........');
    setInternalChatData(res.data);
    setIsLoading(false);
  }

  function renderFooter() {
    if (!internalChatData?.data?.length) {
      return null;
    }
    return !isLoadMoreLoader &&
      internalChatData.total === internalChatData?.data?.length ? (
      <View>
        {/* <Text
          style={{
            textAlign: 'center',
            margin: 12,
          }}>
          End of list
        </Text> */}
      </View>
    ) : (
      <GifSpinner />
    );
  }

  function renderEmpty() {
    return isLoading ? (
      <GifSpinner />
    ) : (
      <View style={styles.emptyContainer}>
        <View style={styles.innerEmptyContainer}>
          <Text style={styles.noteText}>No records found.</Text>
        </View>
      </View>
    );
  }

  async function loadMoredata() {
    setIsLoadMoreLoader(true);
    if (internalChatData.total > internalChatData?.data?.length) {
      const res = await dispatch(
        eventsAction.getConversation({
          conversationId: data.conversationId,
          postTypes: 'O',
          pageSize: 500,
          pageNumber: 1,
          appId: reduxState.selectedEvent.id,
          markAsRead: false,
          pageNumber: internalChatData.currentPage + 1,
        }),
      );
      setInternalChatData(res.data);
    }
    setIsLoadMoreLoader(false);
  }

  function onMomentumScrollEnd({nativeEvent}) {
    if (
      !isLoadMoreLoader &&
      internalChatData.total > internalChatData?.data?.length
    ) {
      loadMoredata();
    }
  }

  function renderItem({item}) {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
        }}>
        <View>
          <UserGroupImage
            item={item.author}
            isAssigneesList={true}
            imageSize={40}
          />
        </View>
        <View
          style={{
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              {item.author.alias}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.primaryText,
              }}>
              {formatAMPM(item.datePublished)}
            </Text>
          </View>
          <View>
            <ChatContent
              item={item}
              usersCollection={reduxState.usersCollection}
              chatmenu={true}
            />
          </View>
        </View>
      </View>
    );
  }

  async function onSendPress(text) {
    const currentTime = _.cloneDeep(new Date().getTime());
    console.log(data);
    const params = {
      type: 'O',
      appId: reduxState.selectedEvent.id,
      content: text || inputText,
      conversationId: data.conversationId,
      tempId: currentTime,
      appType: '',
      communityId: reduxState.communityId,
      pending: true,
      isTemp: true,
      dateCreated: currentTime,
      lastUpdated: currentTime,
      id: currentTime,
      datePublished: currentTime,
    };
    console.log(params, '///////');
    const resss = await dispatch(
      eventsAction.addNewAnnouncementFunc(params, 'internal'),
    );
    console.log(resss, '.......');
    // setInternalChatData([...internalChatData.data, ...resss.data.data]);
  }

  return (
    <>
      <View
        style={{
          padding: 20,
          flex: 1,
        }}>
        <FlatList
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onMomentumScrollEnd={onMomentumScrollEnd}
          data={internalChatData?.data}
          keyExtractor={(item) => `${item.id}`}
        />
      </View>

      <CustomMentionInput
        placeholder="Discuss internally here..."
        value={inputText}
        hidePush={true}
        onChange={(value) => {
          setInputText(value);
        }}
        onSendPress={onSendPress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
  },
  innerEmptyContainer: {
    alignSelf: 'center',
    margin: 30,
  },
  noteText: {
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '700',
  },
});
