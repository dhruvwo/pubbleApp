import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
import {useDispatch, useSelector} from 'react-redux';
import {eventsAction, translatesAction} from '../store/actions';
import {formatAMPM, getUserInitals} from '../services/utilities/Misc';
import FastImage from 'react-native-fast-image';
import * as _ from 'lodash';
import GlobalStyles from '../constants/GlobalStyles';
import ChatContent from '../components/ChatContent';
import Modal from 'react-native-modal';
import GifSpinner from '../components/GifSpinner';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import CustomMentionInput from '../components/CustomMentionInput';
import {pusherAuthConfig} from '../services/socket';

export default function ChatScreen(props) {
  const dispatch = useDispatch();
  const params = props.route.params;
  const isMyInbox = params?.isMyInbox;
  const reduxState = useSelector(({auth, collections, events, myInbox}) => ({
    selectedEvent: auth.events[auth.selectedEventIndex],
    user: auth.user,
    communityId: auth.community?.community?.id,
    userAccount: auth.community?.account,
    cannedMessages: auth.community.cannedMessages,
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
    stream: isMyInbox ? myInbox?.stream : events?.stream,
    currentCard: events.currentCard,
  }));
  let currentChat = reduxState.currentCard;
  let interval;
  const starData = reduxState.stream.find((item) => item.id === currentChat.id);
  if (!_.isEmpty(starData)) {
    currentChat['star'] = starData.star;
  }
  const [inputText, setInputText] = useState('');
  const [messageType, setMessageType] = useState('sendAndApproved');
  const [conversation, setConversation] = useState([currentChat]);
  const [selectedMessage, setSelectedMessage] = useState();
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [translate, setTranslate] = useState();
  const [editItem, setEditItem] = useState();
  const [isShowMessageInputOnReopen, setIsShowMessageInputOnReopen] = useState(
    false,
  );
  const [replyingText, setReplyingText] = useState('');
  const [socketChatConversation, setSocketChatConversation] = useState([]);

  const suggestions = [];

  let index = 0;
  for (let key in reduxState.usersCollection) {
    if (index === 5) {
      break;
    }
    suggestions.push(reduxState.usersCollection[key]);
    index++;
  }

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

  useEffect(() => {
    if (currentPage) {
      getConversation();
    }
  }, [currentPage]);

  async function sendTyping() {
    const res = await dispatch(
      eventsAction.replyingPost({
        postId: currentChat.id,
        conversationId: currentChat.conversationId,
        appId: currentChat.appId,
        accountId: reduxState.user.accountId,
        broadcast: 1,
      }),
    );
  }

  useEffect(() => {
    if (
      reduxState.userAccount.id === currentChat.author.id &&
      reduxState.userAccount.status === 'active'
    ) {
      currentChat.author.isOnline = 'online';
    }

    reduxState.currentCard.attachments?.forEach((attachment) => {
      if (attachment.type === 'translate') {
        setTranslate(attachment);
      }
    });
  }, [reduxState.currentCard]);

  useEffect(() => {
    if (currentPage === 1) {
      getConversation();
    } else {
      setCurrentPage(1);
    }
  }, [reduxState.currentCard?.id]);

  useEffect(() => {
    let pusher = pusherAuthConfig();
    let conversationChannel = pusher.subscribe(
      `conversation_${reduxState.currentCard.conversationId}`,
    );

    conversationChannel.bind('replying', (replyingResponse) => {
      if (replyingResponse.author.id !== reduxState.userAccount.id) {
        const replyingName = replyingResponse.author.alias.split(' ');
        setReplyingText(replyingName[0]);

        interval = setTimeout(() => {
          setReplyingText('');
        }, 5000);
      }
    });

    conversationChannel.bind('post', (postResponse) => {
      if (postResponse.type === 'A') {
        const tempId = reduxState.userAccount.id;
        if (tempId !== postResponse.tempId) {
          setSocketChatConversation(postResponse);
        }
      }
    });

    conversationChannel.bind('update', (updateResponse) => {
      if (updateResponse.type === 'A') {
        updateResponse.isEdit = true;
        setSocketChatConversation(updateResponse);
      }
      if (updateResponse.type === 'Q') {
        dispatch(eventsAction.updateCurrentCard(updateResponse));
      }
    });

    let personalChannel = pusher.subscribe(
      `community_account_${reduxState.communityId}_${reduxState.userAccount.id}`,
    );

    personalChannel.bind('approve_post', (approvePostResponse) => {
      if (approvePostResponse.type === 'A') {
        approvePostResponse.isEdit = true;
        setSocketChatConversation(approvePostResponse);
      }
    });

    personalChannel.bind('unapprove_post', (unApprovePostResponse) => {
      if (unApprovePostResponse.type === 'A') {
        unApprovePostResponse.isEdit = true;
        setSocketChatConversation(unApprovePostResponse);
      }
    });

    return () => {
      clearInterval(interval);
      conversationChannel.unsubscribe();
      personalChannel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (socketChatConversation.isEdit) {
      const conversationIndex = _.findIndex(conversation, {
        id: socketChatConversation.id,
      });

      let oldConversation = [...conversation];
      oldConversation[conversationIndex] = socketChatConversation;
      setConversation(oldConversation);
    } else {
      const conversationClone = _.cloneDeep(conversation);
      conversationClone.unshift(socketChatConversation);
      setConversation(conversationClone);
      setReplyingText('');
      clearInterval(interval);
    }
  }, [socketChatConversation]);

  async function getConversation() {
    if (currentPage === 1) {
      setIsShowLoader(true);
    }
    const params = {
      conversationId: currentChat.conversationId,
      postTypes: 'Q,M,A,C,F,N,P,E,S,K,U,H,G',
      pageSize: 50,
      pageNumber: currentPage,
      appId: currentChat.appId,
      sort: 'dateCreated',
      markAsRead: false,
    };
    const response = await dispatch(eventsAction.getConversation(params));
    dispatch(
      eventsAction.updateCurrentCard({
        ...reduxState.currentCard,
        ...response.conversationRoot,
      }),
    );
    response.conversationRoot?.attachments?.forEach((attachment) => {
      if (attachment.type === 'translate') {
        setTranslate(attachment);
      }
    });
    let conversationData = response.data.data;
    if (currentPage > 1) {
      conversationData = _.uniqBy([...conversation, ...conversationData], 'id');
    }
    setConversation(conversationData);
    setPageCount(response.data.pageCount);
    setIsShowLoader(false);
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

  function onCloseEdit(isSubmitEdit, editedText, item) {
    if (isSubmitEdit) {
      const editedTextClone = _.cloneDeep(editedText);
      dispatch(
        eventsAction.editPost({
          postId: item.id,
          content: editedTextClone,
        }),
      ).then((updatedData) => {
        const conversationClone = _.cloneDeep(conversation);
        const index = conversationClone.findIndex((o) => {
          return o.id === item.id;
        });
        if (conversationClone[index] && updatedData?.id) {
          conversationClone[index] = updatedData;
          // conversationClone[index].content = editedTextClone;
          setConversation(conversationClone);
        }
      });
    }
    setEditItem();
  }

  const renderChatCard = ({item, index}) => {
    const isNorS = item.type === 'N' || item.type === 'S';
    const isMyMessage = item.author.id === reduxState.user.accountId;
    const dateCreated = formatAMPM(item.dateCreated);
    let hideName = false;
    const lastItem = conversation[index - 1];
    if (item?.author && lastItem?.author) {
      hideName =
        lastItem.author.id === item.author.id &&
        dateCreated === formatAMPM(lastItem.dateCreated);
    }

    return (
      <View style={styles.chatCardContainer(isMyMessage)}>
        {item.type !== 'N' && item.type !== 'S' ? (
          <View style={styles.imageContainer}>
            {!hideName &&
              (item.author.avatar ? (
                <FastImage
                  style={styles.userImageContainer}
                  source={{
                    uri: item.author.avatar,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              ) : item.author.alias === 'Guest' ? (
                <CustomIconsComponent
                  color={Colors.greyText}
                  name={'smiley'}
                  type={'Fontisto'}
                  size={styles.userImageContainer.height - 3}
                  style={styles.userImageContainer}
                />
              ) : (
                <View style={[styles.userImageContainer, styles.userNameBg]}>
                  <Text style={styles.userName}>
                    {getUserInitals(item.author.alias)}
                  </Text>
                </View>
              ))}
          </View>
        ) : null}
        <View
          style={[
            styles.chatDescContainer(isNorS, isMyMessage),
            isNorS && styles.centeredCard,
          ]}>
          {!hideName && item.type !== 'N' && item.type !== 'S' ? (
            <View style={styles.chatDesc(isMyMessage)}>
              <Text style={styles.chatDescText(isMyMessage)}>
                {item.author.alias}
              </Text>
              <Text style={styles.dateText}>{dateCreated}</Text>
            </View>
          ) : null}
          <ChatContent
            editItem={editItem}
            isEditing={editItem?.id === item.id}
            item={item}
            conversationRoot={reduxState.currentCard}
            isMyMessage={isMyMessage}
            setSelectedMessage={setSelectedMessage}
            onCloseEdit={onCloseEdit}
            usersCollection={reduxState.usersCollection}
          />
        </View>
      </View>
    );
  };

  async function onSendPress(text, files) {
    const currentTime = _.cloneDeep(new Date().getTime());
    const params = {
      appId: currentChat.appId,
      content: text || inputText || '[Battachments]',
      conversationId: currentChat.conversationId,
      communityId: reduxState.communityId,
      postId: currentChat.id,
      tempId: reduxState.userAccount.id,
      dateCreated: currentTime,
      id: currentTime,
      approved: messageType === 'sendAndApproved',
      approveConversation: messageType === 'sendAndApproved',
      author: reduxState.userAccount,
      type: 'A',
    };
    if (files) {
      params['attachments'] = files;
      params['attfile'] = files;
    }
    const clonedParams = _.cloneDeep(params);
    const conversationClone = _.cloneDeep(conversation);
    conversationClone.unshift(clonedParams);
    // setConversation(conversationClone);
    delete params.author;
    delete params.id;
    delete params.dateCreated;
    const addedData = await dispatch(eventsAction.postReply(params));

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

  function markAsTopAnswer(item, isRemove) {
    dispatch(
      eventsAction.markasTop({
        isRemove,
        replyId: item.id,
        conversationId: currentChat.conversationId,
      }),
    );
    const conversationRootClone = _.cloneDeep(reduxState.currentCard);
    conversationRootClone.topReplyId = isRemove ? null : item.id;
    dispatch(
      eventsAction.updateCurrentCard({
        ...reduxState.currentCard,
        ...conversationRootClone,
      }),
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
      eventsAction.deleteItem({
        postId: item.id,
      }),
    );

    if (resData) {
      const index = conversation.findIndex((o) => {
        return item.id === o.id;
      });
      if (index > -1) {
        let conversationClone = _.clone(conversation);
        conversationClone.splice(index, 1);
        setConversation(conversationClone);
      }
    }
  }

  async function banVisitor(item) {
    await dispatch(
      eventsAction.banVisitor({
        communityId: reduxState.communityId,
        type: 'ip',
        value: item.author.ip,
      }),
    );
  }

  async function changeVisibility(item) {
    const resData = await dispatch(
      eventsAction.changeVisibility({
        postId: item.id,
      }),
    );
    const index = conversation.findIndex((o) => {
      return resData.id === o.id;
    });
    if (index > -1) {
      const conversationClone = _.clone(conversation);
      conversationClone[index] = resData;
      setConversation(conversationClone);
    }
  }

  async function approveItem(item) {
    const resData = await dispatch(
      eventsAction.approveUnApprovePost(
        {
          postId: item.id,
        },
        item.approved ? 'unapprove' : 'approve',
      ),
    );
    const index = conversation.findIndex((o) => {
      return resData.id === o.id;
    });
    if (index > -1) {
      const conversationClone = _.clone(conversation);
      conversationClone[index] = resData;
      setConversation(conversationClone);
    }
  }

  async function editItemPress(item) {
    setEditItem(item);
  }

  async function translateMessageV2(item) {
    const resData = await dispatch(
      translatesAction.getTranslation({
        postId: item.id,
      }),
    );

    const index = conversation.findIndex((o) => {
      return item.id === o.id;
    });

    const conversationClone = _.clone(conversation);

    if (conversationClone[index].attachments === null) {
      conversationClone[index].attachments = resData.attachments;
    } else {
      const languageIndex = conversationClone[index].attachments.findIndex(
        (o) => {
          return (
            o.type === 'translate' &&
            o.targetLanguage === translate.sourceLanguage
          );
        },
      );

      if (languageIndex > -1) {
        conversationClone[index].attachments[languageIndex] = {
          ...conversationClone[index].attachments[languageIndex],
          ...resData.attachments,
        };
      } else {
        conversationClone[index].attachments.push(...resData.attachments);
      }
    }

    setConversation(conversationClone);
  }

  /* async function translateMessage(item) {
    const resData = JSON.parse(
      await dispatch(
        translatesAction.getTranslation({
          message: item.content,
          targets: 'en',
        }),
      ),
    );

    const index = conversation.findIndex((o) => {
      return item.id === o.id;
    });
    if (index > -1) {
      const conversationClone = _.clone(conversation);
      resData.forEach((result) => {
        if (result.detectedLanguage.language !== translate.sourceLanguage) {
          const data = {
            type: 'translate',
            sourceLanguage: result.detectedLanguage.language,
            targetLanguage: translate?.sourceLanguage,
            translation: result.translations[0].text,
          };
          if (!conversationClone[index].attachments) {
            conversationClone[index].attachments = [];
          }
          const languageIndex = conversationClone[index].attachments.findIndex(
            (o) => {
              return (
                o.type === 'translate' &&
                o.targetLanguage === translate.sourceLanguage
              );
            },
          );
          if (languageIndex > -1) {
            conversationClone[index].attachments[languageIndex] = {
              ...conversationClone[index].attachments[languageIndex],
              ...data,
            };
          } else {
            conversationClone[index].attachments.push(data);
          }
        }
      });
      setConversation(conversationClone);
    }
  } */

  function renderChatOptionsModal() {
    const selectedMessageClone = _.cloneDeep(selectedMessage);
    if (!selectedMessageClone?.id) {
      return null;
    }
    const isTop =
      selectedMessageClone?.id === reduxState.currentCard?.topReplyId;
    const isMyPost =
      selectedMessageClone?.author?.id === reduxState.user.accountId;

    let options = [
      {
        title: selectedMessageClone.approved
          ? isMyPost
            ? 'Change to Draft'
            : 'Unapprove'
          : 'Publish',
        onPress: () => approveItem(selectedMessageClone),
      },
    ];
    if (
      (selectedMessageClone.type === 'N' ||
        selectedMessageClone.type === 'S') &&
      isMyPost
    ) {
      options = [];
    }
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
        title: 'Edit',
        onPress: () => editItemPress(selectedMessageClone),
      });
      options.push({
        title: 'Delete',
        onPress: () => deleteItemAlert(selectedMessageClone),
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
        onPress: () => translateMessageV2(selectedMessageClone),
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

  async function loadMoredata() {
    setIsLoadMoreLoader(true);
    if (pageCount > currentPage) {
      setCurrentPage(currentPage + 1);
    }
    setIsLoadMoreLoader(false);
  }

  async function enableTranslation() {
    const params = {
      postId: currentChat.id,
    };
    if (translate?.enabled) {
      params.enabled = false;
    }
    await dispatch(eventsAction.tranlationOptionFunc(params));
  }
  if (!reduxState.currentCard?.id) {
    return <View />;
  }

  async function onReopenConversation() {
    setIsShowMessageInputOnReopen(true);
    const params = {
      conversationId: currentChat.conversationId,
    };
    await dispatch(eventsAction.approveDisapproveStreamData(params, 'open'));
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareView style={styles.mainContainer} useNativeDriver={true}>
        <View style={styles.headerMainContainer}>
          <View style={styles.leftContainer}>
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={styles.headerLeftIcon}>
              <CustomIconsComponent
                color={Colors.greyText}
                name={'arrow-back-ios'}
                type={'MaterialIcons'}
                size={25}
              />
            </TouchableOpacity>
            <View style={styles.topLeftContainer}>
              <View style={styles.countContainer}>
                {currentChat.star ? (
                  <View onPress={() => {}} style={styles.starSpaceContainer}>
                    <CustomIconsComponent
                      type={'AntDesign'}
                      name={'star'}
                      color={'white'}
                      size={20}
                    />
                  </View>
                ) : null}
                <Text style={styles.countText}>
                  {currentChat.type}
                  {currentChat.count}
                </Text>
              </View>
            </View>
            <View style={styles.titleContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.authorName}>
                  {currentChat.author.alias}
                </Text>
                {currentChat.author.title ? (
                  <Text style={styles.chatTitleText}>
                    {currentChat.author.title}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.descText(currentChat.author.isOnline)}>
                visitor {currentChat.author.isOnline ? 'online' : 'offline'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              props.navigation.navigate('ChatMenu', {isMyInbox: isMyInbox});
            }}>
            <CustomIconsComponent
              color={Colors.greyText}
              name={'more-vertical'}
              type={'Feather'}
              size={25}
            />
          </TouchableOpacity>
        </View>
        {isShowLoader ? (
          <GifSpinner />
        ) : (
          <>
            <View style={styles.chatContainer}>
              <KeyboardAwareFlatList
                enableResetScrollToCoords={false}
                inverted={true}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                data={conversation}
                contentContainerStyle={styles.flatListContainer}
                renderItem={renderChatCard}
                keyExtractor={(item) => `${item.id}`}
                onMomentumScrollEnd={onMomentumScrollEnd}
                ListFooterComponent={renderFooter}
              />
            </View>

            {currentChat.status === 30 && !isShowMessageInputOnReopen ? (
              <View style={styles.reopenMainContainer}>
                <Text style={styles.reopenTopText}>Conversation is closed</Text>
                <TouchableOpacity
                  onPress={() => onReopenConversation()}
                  style={styles.reopenTouchable}>
                  <Text style={styles.reopenText}>Reopen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <CustomMentionInput
                placeholder="type your answer here"
                value={inputText}
                onChange={(value) => {
                  setInputText(value);
                }}
                onSendPress={(text, file) => onSendPress(text, file)}
                enableTranslation={enableTranslation}
                translate={translate}
                showTranslate={true}
                replying={replyingText}
              />
            )}
          </>
        )}
        {renderChatOptionsModal()}
      </KeyboardAwareView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  leftContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 4,
  },
  headerLeftIcon: {
    padding: 5,
    borderRadius: 5,
  },
  starSpaceContainer: {
    backgroundColor: Colors.primaryText,
    width: 32,
    height: 32,
    backgroundColor: Colors.tertiary,
    padding: 5,
    borderRadius: 5,
  },
  topLeftContainer: {
    flexDirection: 'row',
  },
  countContainer: {
    backgroundColor: Colors.primaryText,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  menuContainer: {
    paddingLeft: 10,
  },
  titleContainer: {
    marginLeft: 10,
  },
  authorName: {
    color: Colors.primary,
  },
  chatTitleText: {
    marginLeft: 10,
    color: Colors.greyText,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  descText: (isOnline) => ({
    fontSize: 11,
    fontWeight: isOnline ? 'bold' : null,
    color: isOnline ? Colors.green : Colors.red,
  }),
  chatContainer: {
    flex: 1,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chatCardContainer: (isMyMessage) => {
    return {
      flexDirection: isMyMessage ? 'row-reverse' : 'row',
      marginHorizontal: 20,
      marginVertical: 3,
    };
  },
  chatDescContainer: (isNorS, isMyMessage) => {
    return {
      flexShrink: 1,
      marginLeft: isNorS || isMyMessage ? 0 : 10,
      marginRight: isNorS || isMyMessage ? 10 : 0,
    };
  },
  centeredCard: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    height: 40,
    width: 40,
  },
  userImageContainer: {
    marginTop: 20,
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  userNameBg: {
    backgroundColor: Colors.usersBg,
    justifyContent: 'center',
  },
  userName: {
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  chatDesc: (isMyMessage) => {
    return {
      flexDirection: isMyMessage ? 'row-reverse' : 'row',
      marginBottom: 2,
      marginTop: 10,
    };
  },
  chatDescText: (isMyMessage) => {
    return {
      marginRight: isMyMessage ? 0 : 10,
      marginLeft: isMyMessage ? 10 : 0,
      color: Colors.primary,
      fontSize: 12,
    };
  },
  dateText: {
    color: Colors.primaryText,
    fontSize: 12,
  },
  messageLength: {
    marginHorizontal: 20,
    fontSize: 12,
    textAlign: 'right',
    color: Colors.primaryText,
    marginVertical: 3,
  },
  answerInput: {
    backgroundColor: Colors.bgColor,
    borderColor: Colors.greyBorder,
    borderWidth: 1,
    marginHorizontal: 20,
    borderRadius: 5,
    padding: 12,
    minHeight: 70,
    maxHeight: 200,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginHorizontal: 13,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  bottomLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pushFormContainer: {
    borderRadius: 5,
    borderColor: Colors.greyBorder,
    borderWidth: 0.5,
    overflow: 'hidden',
    minWidth: 280,
  },
  pushFormHeaderContainer: {
    padding: 12,
    borderBottomColor: Colors.greyBorder,
    borderBottomWidth: 0.5,
    backgroundColor: Colors.primaryInactive,
  },
  pushFormHeader: {
    color: Colors.primaryInactiveText,
  },
  pushFormListContainer: {},
  pushFormItem: {
    padding: 12,
  },
  pushFormItemText: {
    color: Colors.primary,
  },
  bottomRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomIconContainer: {
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  sendOptions: {
    backgroundColor: Colors.usersBg,
    marginRight: 10,
    borderLeftWidth: 0.5,
    borderColor: Colors.greyBorder,
    paddingHorizontal: 4,
    paddingVertical: 7,
  },
  sendButtonContainer: (isDisabled) => {
    return {
      paddingHorizontal: 12,
      backgroundColor: Colors.usersBg,
      opacity: isDisabled ? 0.5 : 1,
    };
  },
  bottomIcon: {},
  popoverOptions: {
    maxWidth: GlobalStyles.windowWidth * 0.8,
  },
  optionsPopoverContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  optionContainer: {
    padding: 12,
    flexShrink: 1,
    flexDirection: 'row',
  },
  optionTitle: (isActive) => {
    return {
      fontSize: 16,
      marginBottom: 5,
      color: Colors.primary,
      fontWeight: isActive ? 'bold' : '500',
      opacity: isActive ? 1 : 0.6,
    };
  },
  optionDescription: (isActive) => {
    return {
      fontSize: 12,
      color: Colors.primary,
      opacity: isActive ? 1 : 0.6,
    };
  },
  optionDevider: {
    borderRightColor: Colors.primary,
    marginVertical: 12,
  },
  cannedContainer: {
    marginHorizontal: 20,
    maxHeight: 300,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.primary,
    marginBottom: 10,
    flexDirection: 'row',
  },
  suggiustensContainer: {
    marginHorizontal: 20,
    maxHeight: 300,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.primary,
    marginBottom: 10,
    overflow: 'hidden',
  },
  suggiustenHeaderContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.bgColor,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.primary,
  },
  cannedCommandsContainer: {
    padding: 8,
    width: 95,
    borderRightColor: Colors.primary,
    borderRightWidth: 0.5,
  },
  cannedCommandContainer: (isActive) => {
    return {
      paddingLeft: 12,
      backgroundColor: isActive ? Colors.primaryActive : 'transparent',
      borderRadius: 5,
      marginVertical: 5,
      padding: 5,
    };
  },
  cannedMessagesFlatlist: {
    maxHeight: 300,
    flexGrow: 1,
    flexShrink: 1,
  },
  cannedMessagesContainer: {
    paddingVertical: 7,
  },
  cannedMessageTitle: (isActive) => {
    return {
      fontSize: 16,
      fontWeight: '600',
      color: isActive ? Colors.white : Colors.black,
    };
  },
  cannedMessageContainer: {
    marginVertical: 5,
    marginHorizontal: 12,
  },
  suggustedUsers: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reopenMainContainer: {
    padding: 20,
  },
  reopenTopText: {
    color: Colors.primaryText,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  reopenTouchable: {
    backgroundColor: Colors.usersBg,
    padding: 10,
  },
  reopenText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
  },
});
