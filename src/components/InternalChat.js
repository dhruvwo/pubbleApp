import React, {useEffect, useState, useCallback} from 'react';
import {Alert, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {eventsAction} from '../store/actions';
import Colors from '../constants/Colors';
import GifSpinner from '../components/GifSpinner';
import UserGroupImage from '../components/UserGroupImage';
import ChatContent from '../components/ChatContent';
import {formatAMPM} from '../services/utilities/Misc';
import CustomMentionInput from '../components/CustomMentionInput';
import * as _ from 'lodash';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {conversationsAction} from '../store/actions/conversations';

export default function InternalChat(props) {
  const {data} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, collections, conversations}) => ({
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
    communityId: auth.community?.community?.id,
    selectedEvent: auth.events[auth.selectedEventIndex],
    user: auth.user,
    userAccount: auth.community?.account,
    conversations: conversations.internal,
  }));
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState();
  const [editItem, setEditItem] = useState();

  const delayedQuery = useCallback(
    _.debounce(() => sendTyping(), 1500),
    [inputText],
  );

  useEffect(() => {
    if (!!selectedMessage?.id) {
      dispatch(conversationsAction.setCurrentConversationId(data));
    }
    return () => {
      // dispatch(conversationsAction.removeCurrentConversationId());
    };
  }, []);

  useEffect(() => {
    if (inputText) {
      delayedQuery();
    }
    return delayedQuery.cancel;
  }, [inputText, delayedQuery]);

  async function sendTyping() {
    const res = await dispatch(
      eventsAction.replyingPost({
        postId: data.id,
        conversationId: data.conversationId,
        appId: reduxState.selectedEvent.id,
        accountId: reduxState.user.accountId,
        broadcast: 1,
      }),
    );
  }

  useEffect(() => {
    if (currentPage) {
      getConversation();
    }
  }, [currentPage]);

  async function getConversation() {
    const response = await dispatch(
      eventsAction.getConversation(
        {
          conversationId: data.conversationId,
          postTypes: 'O',
          pageSize: 500,
          pageNumber: currentPage,
          appId: reduxState.selectedEvent.id,
          markAsRead: false,
        },
        'internal',
      ),
    );
    setPageCount(response.data.pageCount);
    setIsLoading(false);
  }

  function renderFooter() {
    if (
      reduxState.conversations.length < 5 ||
      (!isLoadMoreLoader && currentPage === pageCount)
    ) {
      return null;
    }
    return <GifSpinner />;
  }

  function renderEmpty() {
    return isLoading ? (
      <GifSpinner />
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.noteText}>No records found.</Text>
      </View>
    );
  }

  function deleteItemAlert(item) {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          deleteItem(item);
        },
      },
    ]);
  }

  async function deleteItem(item) {
    const resData = await dispatch(
      eventsAction.deleteItem(
        {
          postId: item.id,
        },
        'internal',
      ),
    );
  }
  async function editItemPress(item) {
    setEditItem(item);
  }
  async function loadMoredata() {
    setIsLoadMoreLoader(true);
    if (pageCount > currentPage) {
      setCurrentPage(currentPage + 1);
    }
    setIsLoadMoreLoader(false);
  }

  function onMomentumScrollEnd({nativeEvent}) {
    if (
      !isLoadMoreLoader &&
      reduxState.conversations?.length &&
      nativeEvent.contentSize.height -
        (nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height) <=
        400
    ) {
      loadMoredata();
    }
  }

  function onCloseEdit(isSubmitEdit, editedText, item) {
    if (isSubmitEdit) {
      const editedTextClone = _.cloneDeep(editedText);
      dispatch(
        eventsAction.editPost(
          {
            postId: item.id,
            content: editedTextClone,
          },
          'internal',
        ),
      );
    }
    setEditItem();
  }

  function renderChatOptionsModal() {
    const selectedMessageClone = _.cloneDeep(selectedMessage);
    if (!selectedMessageClone?.id) {
      return null;
    }
    const options = [];
    options.push({
      title: 'Delete',
      onPress: () => deleteItemAlert(selectedMessageClone),
    });
    options.push({
      title: 'Edit',
      onPress: () => editItemPress(selectedMessageClone),
    });

    return (
      <Modal
        backdropOpacity={0.5}
        isVisible={!!selectedMessage?.id}
        onRequestClose={() => setSelectedMessage()}
        onBackButtonPress={() => setSelectedMessage()}
        onBackdropPress={() => setSelectedMessage()}>
        <View
          style={{
            backgroundColor: Colors.primaryInactive,
            borderRadius: 5,
            width: 250,
            alignSelf: 'center',
            paddingVertical: 8,
          }}>
          {options.map((o) => {
            return (
              <TouchableOpacity
                key={o.title}
                onPress={() => {
                  setSelectedMessage({});
                  o.onPress();
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}>
                <Text>{o.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    );
  }

  function renderItem({item}) {
    return (
      <View style={styles.itemContainer}>
        <UserGroupImage
          item={item.author}
          isAssigneesList={true}
          imageSize={40}
        />
        <View style={styles.rightContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.name}>{item.author.alias}</Text>
            <Text style={styles.date}>{formatAMPM(item.datePublished)}</Text>
          </View>
          <ChatContent
            editItem={editItem}
            isDisabled={item.author.id !== reduxState.user.accountId}
            isEditing={editItem?.id === item.id}
            item={item}
            chatmenu={true}
            setSelectedMessage={setSelectedMessage}
            onCloseEdit={onCloseEdit}
          />
        </View>
      </View>
    );
  }

  async function onSendPress(text, files) {
    const currentTime = _.cloneDeep(new Date().getTime());
    const params = {
      type: 'O',
      appId: reduxState.selectedEvent.id,
      content: text || inputText,
      conversationId: data.conversationId,
      appType: '',
      communityId: reduxState.communityId,
      pending: true,
      tempId: currentTime,
      dateCreated: currentTime,
      datePublished: currentTime,
      author: reduxState.userAccount,
      id: currentTime,
      approved: true,
    };
    if (files) {
      params['attachments'] = files;
      params['attfile'] = files;
    }
    dispatch(
      conversationsAction.appendConversations({
        ...params,
        chatType: 'internal',
      }),
    );

    delete params.tempId;
    delete params.dateCreated;
    delete params.author;
    delete params.id;
    dispatch(eventsAction.addNewAnnouncementFunc(params, 'internal'));
    setInputText('');
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={styles.listContainer}>
        <KeyboardAwareFlatList
          enableResetScrollToCoords={false}
          inverted={true}
          keyboardShouldPersistTaps={'handled'}
          data={reduxState.conversations}
          contentContainerStyle={styles.flatlistContainer}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          onMomentumScrollEnd={onMomentumScrollEnd}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      </View>
      <CustomMentionInput
        placeholder="Discuss internally here..."
        value={inputText}
        hidePush={true}
        onChange={(value) => {
          setInputText(value);
        }}
        onSendPress={(text, file) => onSendPress(text, file)}
      />
      {renderChatOptionsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    transform: [{scaleY: -1}],
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
  listContainer: {
    // paddingVertical: 20,
    flex: 1,
  },
  flatlistContainer: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  rightContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    flexGrow: 1,
    flexShrink: 1,
  },
  date: {
    fontWeight: '600',
    paddingLeft: 5,
    color: Colors.primaryText,
  },
});
