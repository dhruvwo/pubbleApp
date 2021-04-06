import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
import InsertLinkModal from '../components/InsertLinkModal';
import {Popover} from '@ant-design/react-native';
import GlobalStyles from '../constants/GlobalStyles';
import {MentionInput} from 'react-native-controlled-mentions';
import UserGroupImage from '../components/UserGroupImage';
import ChatContent from '../components/ChatContent';
import Modal from 'react-native-modal';
import GifSpinner from '../components/GifSpinner';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

export default function ChatScreen(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, collections}) => ({
    selectedEvent: auth.selectedEvent,
    user: auth.user,
    communityId: auth.community?.community?.id,
    userAccount: auth.community?.account,
    cannedMessages: auth.community.cannedMessages,
    usersCollection: collections?.users,
  }));
  const data = props.route.params.data;
  const [inputText, setInputText] = useState('');
  const [messageType, setMessageType] = useState('sendAndApproved');
  const [conversation, setConversation] = useState([data]);
  const [isVisibleInsertLink, setIsVisibleInsertLink] = useState(false);
  const [activeCannedIndex, setActiveCannedIndex] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState();
  const [conversationRoot, setConversationRoot] = useState({});
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [translate, setTranslate] = useState();
  const [editItem, setEditItem] = useState();

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
    if (currentPage) {
      getConversation();
    }
  }, [currentPage]);

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

  async function getConversation() {
    const params = {
      conversationId: data.conversationId,
      postTypes: 'Q,M,A,C,F,N,P,E,S,K,U,H,G',
      pageSize: 50,
      pageNumber: currentPage,
      appId: reduxState.selectedEvent.id,
      sort: 'dateCreated',
      markAsRead: false,
    };
    const response = await dispatch(eventsAction.getConversation(params));
    setConversationRoot(response.conversationRoot);
    response.conversationRoot.attachments.forEach((attachment) => {
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
        <View style={styles.chatDescContainer(isMyMessage)}>
          {!hideName ? (
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
            conversationRoot={conversationRoot}
            isMyMessage={isMyMessage}
            setSelectedMessage={setSelectedMessage}
            onCloseEdit={onCloseEdit}
            usersCollection={reduxState.usersCollection}
          />
        </View>
      </View>
    );
  };

  function onContectCardPress() {
    onSendPress('//contact');
  }

  function onAttachPress() {
    console.log('onAttachPress');
  }

  function onLinkPress() {
    setIsVisibleInsertLink(true);
  }

  function manualEscape(t) {
    var e = /[&<>"'`]/g,
      o = /[&<>"'`]/,
      n = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;',
      },
      i = function (t) {
        return n[t];
      };
    return o.test(t) ? t.replace(e, i) : t;
  }
  // function htmlStep1(html) {
  //   var entityMap = {
  //     '&': '&amp;',
  //     '<': '&lt;',
  //     '>': '&gt;',
  //     '"': '&quot;',
  //     "'": '&#39;',
  //     '`': '&#x60;',
  //   };

  //   return String(html).replace(/[&<>"']/g, function (s) {
  //     return entityMap[s];
  //   });
  // }
  // function filterContent(cc) {
  //   cc = cc.replace('\n\n+', '\n\n');

  //   //cc = this.(cc);

  //   cc = cc.replace('<', '&lt;');
  //   cc = cc.replace('>', '&gt;');

  //   cc = cc.replace('&amp;amp;', '&');
  //   cc = cc.replace('&amp;', '&');
  //   cc = cc.replace('&#39;', "'");
  //   cc = cc.replace('&nbsp;;', ' ');

  //   cc = cc.replace('<script', '&lt;script');
  //   cc = cc.replace('<iframe>', '&lt;iframe&gt;');
  //   cc = cc.replace('<style>', '&lt;style&gt;');
  //   cc = cc.replace('<frame>', '&lt;frame&gt;');
  //   cc = cc.replace('</style>', '&lt;/style&gt;');
  //   cc = cc.replace('</script>', '&lt;/script&gt;');
  //   cc = cc.replace('</iframe>', '&lt;/iframe&gt;');
  //   cc = cc.replace('</frame>', '&lt;/frame&gt;');
  //   cc = cc.replace('&#x2F;', '/');
  //   cc = cc.replace('%', '#@$');

  //   cc = cc.replace('\n', '<br/>');

  //   cc = utils.safeContent(cc);

  //   try {
  //     cc = decodeURI(cc);
  //   } catch (e) {
  //     //cc = "";
  //   }

  //   cc = cc.replace('#@$', '%');

  //   cc = cc.replace('&lt;%', '<%').replace('%&gt;', '%>');

  //   //var regex = /\[(.*?)\|(.*?)\]/g;
  //   // cc = cc.replace(regex, "$1");

  //   cc = emjos.shortnameToImage(cc);

  //   return cc;
  // }
  async function onSendPress(text) {
    const currentTime = _.cloneDeep(new Date().getTime());
    const params = {
      appId: reduxState.selectedEvent.id,
      content: text || inputText,
      conversationId: data.conversationId,
      communityId: reduxState.communityId,
      postId: data.id,
      tempId: currentTime,
      dateCreated: currentTime,
      id: currentTime,
      approved: messageType === 'sendAndApproved',
      approveConversation: messageType === 'sendAndApproved',
      author: reduxState.userAccount,
      type: 'A',
    };
    const clonedParams = _.cloneDeep(params);
    const conversationClone = _.cloneDeep(conversation);
    conversationClone.unshift(clonedParams);
    setConversation(conversationClone);
    delete params.tempId;
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

  function onAccountNamePress(text, keyword) {
    let newText = text.split(' ')[0].toLowerCase() + ' ';
    if (inputText) {
      if (keyword) {
        newText = inputText.replace(keyword, newText);
      } else {
        newText = `${inputText}${newText}`;
      }
    }
    setInputText(newText);
  }

  function onCannedMessagePress(text, keyword) {
    let newText = text;
    if (inputText) {
      const trimLength = keyword.length - 1 || -1;
      newText = `${inputText.slice(0, trimLength)}${newText}`;
    }
    setInputText(newText);
  }

  function onCannedIconPress() {
    if (inputText && inputText.charAt(inputText.length - 1) === '\\') {
      setInputText(inputText.slice(0, -1));
    } else {
      setInputText(`\\${inputText}`);
    }
  }

  function markAsTopAnswer(item, isRemove) {
    dispatch(
      eventsAction.markasTop({
        isRemove,
        replyId: item.id,
        conversationId: data.conversationId,
      }),
    );
    const conversationRootClone = _.cloneDeep(conversationRoot);
    conversationRootClone.topReplyId = isRemove ? null : item.id;
    setConversationRoot(conversationRootClone);
  }

  function banVisitorAlert(item) {
    Alert.alert('Ban visitor', 'Are you sure you want to ban this visitor?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Ban',
        onPress: () => {
          banVisitor(item);
        },
      },
    ]);
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

  async function translateMessage(item) {
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
  }

  const renderSuggestions = ({keyword}) => {
    if (keyword == null || keyword.includes(' ')) {
      return null;
    }
    const newSuggestions = [];
    _.forIn(suggestions, (item) => {
      if (item?.alias?.toLowerCase().includes(keyword.toLowerCase())) {
        newSuggestions.push(item);
      }
    });
    if (newSuggestions.length === 0) {
      return null;
    }
    return (
      <View style={styles.suggiustensContainer}>
        <View style={styles.suggiustenHeaderContainer}>
          <Text>People</Text>
        </View>
        <FlatList
          data={newSuggestions}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({item}) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                onAccountNamePress(item.alias, keyword, true);
              }}
              style={styles.suggustedUsers}>
              <UserGroupImage
                item={item}
                isAssigneesList={true}
                imageSize={30}
              />
              <Text style={styles.suggustedUserName}>{item.alias}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

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

  const renderCannedMessages = ({keyword}) => {
    if (keyword == null) {
      return null;
    }
    const newSuggestions = [];
    _.forIn(reduxState.cannedMessages, (item, key) => {
      if (key.includes(keyword)) {
        newSuggestions.push({
          name: `\\${key}`,
          data: item,
        });
      }
    });
    if (newSuggestions.length === 0) {
      return null;
    }
    return (
      <View style={styles.cannedContainer}>
        <View style={styles.cannedCommandsContainer}>
          <FlatList
            data={newSuggestions}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={(item) => item.name}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  setActiveCannedIndex(index);
                }}
                style={[
                  styles.cannedCommandContainer(index === activeCannedIndex),
                ]}>
                <Text
                  style={styles.cannedMessageTitle(
                    index === activeCannedIndex,
                  )}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {newSuggestions && newSuggestions[activeCannedIndex]?.data?.length && (
          <FlatList
            data={newSuggestions[activeCannedIndex].data}
            style={styles.cannedMessagesFlatlist}
            contentContainerStyle={styles.cannedMessagesContainer}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  onCannedMessagePress(item.text, keyword);
                }}
                style={styles.cannedMessageContainer}>
                <Text style={styles.cannedMessage}>{item.text}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

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
                {data.star ? (
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
                  {data.type}
                  {data.count}
                </Text>
              </View>
            </View>
            <View style={styles.titleContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.authorName}>{data.author.alias}</Text>
                {data.author.title ? (
                  <Text style={styles.chatTitleText}>{data.author.title}</Text>
                ) : null}
              </View>
              <Text style={styles.descText}>
                visitor {data.author.isOnline ? 'online' : 'offline'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              props.navigation.navigate('ChatMenu', {data});
            }}>
            <CustomIconsComponent
              color={Colors.greyText}
              name={'more-vertical'}
              type={'Feather'}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.chatContainer}>
          <KeyboardAwareFlatList
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
        <View>
          <Text style={styles.messageLength}>
            {2500 - (inputText.length || 0)}
          </Text>
          <MentionInput
            placeholder="type your answer here"
            multiline={true}
            autoCapitalize={'none'}
            autoCorrect={false}
            value={inputText}
            onChange={(value) => {
              setInputText(value);
            }}
            style={styles.answerInput}
            partTypes={[
              {
                trigger: '@',
                renderSuggestions,
                textStyle: {fontWeight: '600', color: 'blue'},
              },
              {
                trigger: '\\',
                renderSuggestions: renderCannedMessages,
                textStyle: {fontWeight: '600', color: 'blue'},
              },
            ]}
          />
          <View style={styles.bottomContainer}>
            <View style={styles.bottomLeftContainer}>
              <Popover
                duration={0}
                useNativeDriver={true}
                placement={'top'}
                overlay={
                  <View style={styles.pushFormContainer}>
                    <View style={styles.pushFormHeaderContainer}>
                      <Text style={styles.pushFormHeader}>
                        Push form in conversation
                      </Text>
                    </View>
                    <View style={styles.pushFormListContainer}>
                      <TouchableOpacity
                        style={styles.pushFormItem}
                        onPress={() => onContectCardPress()}>
                        <Text style={styles.pushFormItemText}>
                          Visitor contact card
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }>
                <View style={styles.bottomIconContainer}>
                  <CustomIconsComponent
                    type={'AntDesign'}
                    name={'form'}
                    style={styles.bottomIcon}
                    size={23}
                  />
                </View>
              </Popover>
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onCannedIconPress()}>
                <CustomIconsComponent
                  name={'chatbubble-ellipses-outline'}
                  type={'Ionicons'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onAttachPress()}>
                <CustomIconsComponent
                  name={'document-attach-outline'}
                  type={'Ionicons'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onLinkPress()}>
                <CustomIconsComponent
                  name={'link'}
                  type={'Ionicons'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomRightContainer}>
              {/* <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onSettingsPress()}>
                <CustomIconsComponent
                  type={'Ionicons'}
                  name={'options-outline'}
                  style={styles.bottomIcon}
                  size={25}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                disabled={!inputText}
                style={[
                  styles.bottomIconContainer,
                  styles.sendButtonContainer(!inputText),
                ]}
                onPress={() => onSendPress()}>
                <CustomIconsComponent
                  type={'MaterialIcons'}
                  color={'white'}
                  name={'send'}
                  style={[styles.bottomIcon]}
                  size={23}
                />
              </TouchableOpacity>
              <Popover
                duration={0}
                useNativeDriver={true}
                placement={'top'}
                overlay={
                  <View
                    style={[
                      styles.popoverOptions,
                      styles.optionsPopoverContainer,
                    ]}>
                    <TouchableOpacity
                      style={styles.optionContainer}
                      onPress={() => {
                        setMessageType('saveAsDraft');
                      }}>
                      <View>
                        <Text
                          style={styles.optionTitle(
                            messageType === 'saveAsDraft',
                          )}>
                          Save as Draft
                        </Text>
                        <Text
                          style={styles.optionDescription(
                            messageType === 'saveAsDraft',
                          )}>
                          The reply will be posted when question is approved
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={[GlobalStyles.devider, styles.optionDevider]}
                    />
                    <TouchableOpacity
                      style={styles.optionContainer}
                      onPress={() => {
                        setMessageType('sendAndApproved');
                      }}>
                      <View>
                        <Text
                          style={styles.optionTitle(
                            messageType === 'sendAndApproved',
                          )}>
                          Send &amp; Approve
                        </Text>
                        <Text
                          style={styles.optionDescription(
                            messageType === 'sendAndApproved',
                          )}>
                          The reply and the question will both be approved and
                          published
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }>
                <View style={[styles.bottomIconContainer, styles.sendOptions]}>
                  <CustomIconsComponent
                    type={'Entypo'}
                    color={'white'}
                    name={'dots-three-vertical'}
                    style={[styles.dotsIcon]}
                    size={18}
                  />
                </View>
              </Popover>
            </View>
          </View>
        </View>
        <InsertLinkModal
          visible={isVisibleInsertLink}
          onRequestClose={() => {
            setIsVisibleInsertLink(false);
          }}
          onInsertLink={(text) => {
            setInputText(inputText ? `${inputText}\n${text}` : text);
          }}
        />
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
  menuContainer: {},
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
  descText: {
    fontSize: 11,
    color: Colors.red,
  },
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
  chatDescContainer: (isMyMessage) => {
    return {
      flexShrink: 1,
      marginLeft: isMyMessage ? 0 : 10,
      marginRight: isMyMessage ? 10 : 0,
    };
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
});
