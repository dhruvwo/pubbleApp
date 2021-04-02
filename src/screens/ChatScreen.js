import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
import {useDispatch, useSelector} from 'react-redux';
import {eventsAction} from '../store/actions';
import {formatAMPM, getUserInitals} from '../services/utilities/Misc';
import FastImage from 'react-native-fast-image';
import HTMLView from 'react-native-htmlview';
import * as _ from 'lodash';
import InsertLinkModal from '../components/InsertLinkModal';
import {Popover} from '@ant-design/react-native';
import GlobalStyles from '../constants/GlobalStyles';
import {MentionInput} from 'react-native-controlled-mentions';
import UserGroupImage from '../components/UserGroupImage';

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
  const suggestions = [];

  let index = 0;
  for (let key in reduxState.usersCollection) {
    if (index === 5) {
      break;
    }
    suggestions.push(reduxState.usersCollection[key]);
    index++;
  }
  useEffect(() => {
    getConversation();
  }, []);

  async function getConversation() {
    const params = {
      conversationId: data.conversationId,
      postTypes: 'Q,M,A,C,F,N,P,E,S,K,U,H,G',
      pageSize: 50,
      pageNumber: 1,
      appId: reduxState.selectedEvent.id,
      sort: 'dateCreated',
      markAsRead: false,
    };
    const response = await dispatch(eventsAction.getConversation(params));
    setConversation(response.data);
  }

  const renderChatCard = ({item, index}) => {
    let content = item.content;
    if (item.content.includes('[%account|')) {
      const contentData = item.content.split(' ');
      const mentionContent = contentData.filter((item) =>
        item.includes('[%account|'),
      );
      if (mentionContent.length) {
        mentionContent.forEach((mention) => {
          const userId = mention.slice(10, mention.length - 2);
          const userData = reduxState.usersCollection[userId];
          content = item.content.replace(mention, `@${userData.shortName}`);
        });
      }
    }
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
          <View style={styles.cardContainer(isMyMessage, item.tempId)}>
            {item.content === '//contact' || item.content === '//share' ? (
              <View style={styles.contactCardContainer}>
                <CustomIconsComponent
                  type={'AntDesign'}
                  name={'contacts'}
                  size={25}
                  color={htmlStyle(isMyMessage).div.color}
                  style={styles.contactCard}
                />
                <Text
                  style={[styles.contactCardText, htmlStyle(isMyMessage).div]}>
                  {item.content === '//share'
                    ? 'Requested to share contact details'
                    : 'Contact card was pushed in conversation'}
                </Text>
              </View>
            ) : (
              <HTMLView
                stylesheet={htmlStyle(isMyMessage)}
                value={`<div>${content}</div>`}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  function onNotePress() {
    console.log('onNotePress');
  }

  function onChatPress() {
    console.log('onChatPress');
  }

  function onAtPress() {
    console.log('onAtPress');
  }

  function onEmojiPress() {
    console.log('onEmojiPress');
  }

  function onAttachPress() {
    console.log('onAttachPress');
  }

  function onSettingsPress() {
    console.log('onSettingsPress');
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
  async function onSendPress() {
    const currentTime = _.cloneDeep(new Date().getTime());
    const params = {
      appId: reduxState.selectedEvent.id,
      content: inputText,
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
      postId: 309329,
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

  const renderSuggestions = ({keyword, onSuggestionPress}) => {
    if (keyword == null) {
      return null;
    }
    const newSuggestions = [];
    _.forIn(suggestions, (item) => {
      newSuggestions.push(item);
    });
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
                item.name = item.alias;
                onSuggestionPress(item);
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

  const renderCannedMessages = ({keyword, onSuggestionPress}) => {
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
    return (
      <View style={styles.suggiustensContainer}>
        <View>
          <FlatList
            data={newSuggestions}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({item}) => (
              <View
                key={item.id}
                onPress={() => {
                  onSuggestionPress(item);
                }}
                style={styles.cannedMessagesContainer}>
                <Text style={styles.cannedMessageTitle}>{item.name}</Text>
                {item.data?.length && (
                  <View style={styles.cannedMessagesDataContainer}>
                    {item.data.map((o) => {
                      return (
                        <TouchableOpacity
                          key={`${o.id}`}
                          style={styles.cannedMessageContainer}>
                          <Text style={styles.cannedMessage}>{o.text}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareView style={styles.mainContainer} useNativeDriver={true}>
        <View style={styles.headerMainContainer}>
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
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              props.navigation.navigate('ChatMenu');
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
          <FlatList
            inverted={true}
            showsVerticalScrollIndicator={false}
            data={conversation}
            contentContainerStyle={styles.flatListContainer}
            renderItem={renderChatCard}
            keyExtractor={(item) => `${item.id}`}
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
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onNotePress()}>
                <CustomIconsComponent
                  type={'AntDesign'}
                  name={'form'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onFAQPress()}>
                <CustomIconsComponent
                  type={'MaterialCommunityIcons'}
                  name={'puzzle'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onChatPress()}>
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
              {/* <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onAtPress()}>
                <CustomIconsComponent
                  name={'mention'}
                  type={'Octicons'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onEmojiPress()}>
                <CustomIconsComponent
                  name={'insert-emoticon'}
                  type={'MaterialIcons'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity> */}
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
            setInputText(inputText !== '' ? inputText + '\n' + text : text);
          }}
        />
      </KeyboardAwareView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 10,
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
    position: 'absolute',
    right: 5,
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
  cardContainer: (isMyMessage, tempId) => {
    return {
      padding: 15,
      borderRadius: 5,
      backgroundColor: isMyMessage ? '#0bafff' : Colors.bgColor,
      alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
      flexShrink: 1,
      opacity: tempId ? 0.8 : 1,
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
  cannedMessagesContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  cannedMessageTitle: {
    fontSize: 16,
  },
  cannedMessagesDataContainer: {
    paddingLeft: 12,
  },
  cannedMessageContainer: {
    marginVertical: 2,
  },
  suggustedUsers: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactCardContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  contactCard: {
    marginRight: 8,
  },
  contactCardText: {
    fontSize: 16,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
});

const htmlStyle = StyleSheet.create((isMyMessage, tempId) => {
  return {
    div: {
      color: isMyMessage ? Colors.white : 'black',
    },
  };
});
