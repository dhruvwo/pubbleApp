import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, Text, Modal} from 'react-native';
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

export default function InternalChat(props) {
  const {data} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, collections}) => ({
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
    communityId: auth.community?.community?.id,
    selectedEvent: auth.selectedEvent,
    user: auth.user,
    userAccount: auth.community?.account,
  }));
  const [conversation, setConversation] = useState([]);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState();

  const delayedQuery = useCallback(
    _.debounce(() => sendTyping(), 1500),
    [inputText],
  );

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
      getVisitor();
    }
  }, [currentPage]);

  async function getVisitor() {
    const response = await dispatch(
      eventsAction.getConversation({
        conversationId: data.conversationId,
        postTypes: 'O',
        pageSize: 500,
        pageNumber: currentPage,
        appId: reduxState.selectedEvent.id,
        markAsRead: false,
      }),
    );
    let conversationData = response.data.data;
    if (currentPage > 1) {
      conversationData = _.uniqBy([...conversation, ...conversationData], 'id');
    }
    setConversation(conversationData);
    setPageCount(response.data.pageCount);
    setIsLoading(false);
  }

  function renderFooter() {
    if (
      conversation.length < 5 ||
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

  async function loadMoredata() {
    setIsLoadMoreLoader(true);
    console.log('currentPage', {currentPage, pageCount});
    if (pageCount > currentPage) {
      setCurrentPage(currentPage + 1);
    }
    setIsLoadMoreLoader(false);
  }

  function onMomentumScrollEnd({nativeEvent}) {
    if (
      !isLoadMoreLoader &&
      conversation?.length &&
      nativeEvent.contentSize.height -
        (nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height) <=
        400
    ) {
      loadMoredata();
    }
  }

  function renderChatOptionsModal() {
    const selectedMessageClone = _.cloneDeep(selectedMessage);
    if (!selectedMessageClone?.id) {
      return null;
    }
    const isTop = selectedMessageClone?.id === conversationRoot?.topReplyId;
    const isMyPost =
      selectedMessageClone?.author?.id === reduxState.user.accountId;

    const options = [
      {
        title: selectedMessageClone.approved
          ? isMyPost
            ? 'Change to Draft'
            : 'Unapprove'
          : 'Publish',
        onPress: () => approveItem(selectedMessageClone),
      },
    ];
    const amMod = reduxState.selectedEvent.moderators.includes(
      reduxState.user.accountId,
    );
    if (
      selectedMessageClone.author.id === reduxState.user.accountId ||
      (amMod &&
        (['Q', 'M', 'A', 'C'].includes(selectedMessageClone.type) ||
          selectedMessageClone.visitor ||
          selectedMessageClone.anonymous))
    ) {
      options.push({
        title: 'Delete',
        onPress: () => deleteItemAlert(selectedMessageClone),
      });
      options.push({
        title: 'Edit',
        onPress: () => editItemPress(selectedMessageClone),
      });
    }
    if (selectedMessageClone.type === 'A') {
      options.push({
        title: isTop ? 'Unmark as top answer' : 'Mark as top answer',
        onPress: () => markAsTopAnswer(selectedMessageClone, isTop),
      });
    }
    if (translate?.sourceLanguage) {
      options.push({
        title: 'Translate',
        onPress: () => translateMessage(selectedMessageClone),
      });
    }
    if (selectedMessageClone.type === 'Q') {
      options.push({
        title: selectedMessageClone.privatePost ? 'Public' : 'Private',
        onPress: () => changeVisibility(selectedMessageClone),
      });
    }
    if (!isMyPost) {
      options.push({
        title: 'Ban Visitor',
        onPress: () => banVisitor(selectedMessageClone),
      });
    }

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
            item={item}
            chatmenu={true}
            setSelectedMessage={setSelectedMessage}
          />
        </View>
      </View>
    );
  }

  async function onSendPress(text) {
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
    const clonedParams = _.cloneDeep(params);
    const conversationClone = _.cloneDeep(conversation);
    conversationClone.unshift(clonedParams);
    setConversation(conversationClone);
    delete params.tempId;
    delete params.dateCreated;
    delete params.author;
    delete params.id;
    const addedData = await dispatch(
      eventsAction.addNewAnnouncementFunc(params, 'internal'),
    );
    const conversationClone2 = _.cloneDeep(conversationClone);
    const index = conversationClone2.findIndex((o) => {
      return o.tempId === clonedParams.tempId;
    });
    if (conversationClone[index] && addedData?.id) {
      conversationClone[index] = addedData;
      setConversation(conversationClone);
    }
    setInputText('');
  }

  return (
    <>
      <View style={styles.listContainer}>
        <KeyboardAwareFlatList
          inverted={true}
          keyboardShouldPersistTaps={'handled'}
          data={conversation}
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
        onSendPress={onSendPress}
      />
      {renderChatOptionsModal()}
    </>
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
