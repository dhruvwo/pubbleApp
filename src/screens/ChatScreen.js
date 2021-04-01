import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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

export default function ChatScreen(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth}) => ({
    selectedEvent: auth.selectedEvent,
    appId: auth.selectedEvent.id,
    communityId: auth.community.community.id,
    user: auth.user,
    userAccount: auth.community.account,
  }));
  const data = props.route.params.data;
  const [inputText, setInputText] = useState('');
  const [messageType, setMessageType] = useState('sendAndApproved');
  const [conversation, setConversation] = useState([data]);
  const [isVisibleInsertLink, setIsVisibleInsertLink] = useState(false);

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
    const isMyMessage = item.author.id === reduxState.user.accountId;
    const dateCreated = formatAMPM(item.dateCreated);
    let hideName = false;
    const lastItem = conversation[index - 1];
    if (lastItem) {
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
          <View style={styles.cardContainer(isMyMessage)}>
            <HTMLView
              stylesheet={htmlStyle(isMyMessage)}
              value={`<div>${item.content}</div>`}
            />
          </View>
        </View>
      </View>
    );
  };

  function onNotePress() {
    console.log('onNotePress');
  }

  function onFAQPress() {
    console.log('onFAQPress');
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

  async function onSendPress() {
    const currentTime = _.cloneDeep(new Date().getTime());
    console.log('onSendPress', data);
    const params = {
      appId: reduxState.appId,
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
    const addedData = await dispatch(eventsAction.postReply(params));

    const conversationClone2 = _.cloneDeep(conversationClone);
    const index = conversationClone2.findIndex((o) => {
      return o.tempId === clonedParams.tempId;
    });
    if (conversationClone[index]) {
      conversationClone[index] = addedData;
      setConversation(conversationClone);
    }
    setInputText('');
  }

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
          <TouchableOpacity style={styles.menuContainer}>
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
            keyboardShouldPersistTaps={'handled'}
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
          <TextInput
            placeholder="type your answer here"
            multiline={true}
            value={inputText}
            onChangeText={(value) => setInputText(value)}
            style={styles.answerInput}
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
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onFAQPress()}>
                <CustomIconsComponent
                  type={'MaterialCommunityIcons'}
                  name={'puzzle'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity>
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
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onAtPress()}>
                <CustomIconsComponent
                  name={'mention'}
                  type={'Octicons'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onEmojiPress()}>
                <CustomIconsComponent
                  name={'insert-emoticon'}
                  type={'MaterialIcons'}
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
              <TouchableOpacity
                style={styles.bottomIconContainer}
                onPress={() => onSettingsPress()}>
                <CustomIconsComponent
                  type={'Ionicons'}
                  name={'options-outline'}
                  style={styles.bottomIcon}
                  size={25}
                />
              </TouchableOpacity>
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
  cardContainer: (isMyMessage) => {
    return {
      backgroundColor: isMyMessage ? '#0bafff' : Colors.bgColor,
      padding: 15,
      borderRadius: 5,
    };
  },
  chatDescContainer: (isMyMessage) => {
    return {
      // flexGrow: 1,
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
    height: 70,
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
  sendButtonContainer: (isDisabled) => {
    return {
      paddingHorizontal: 10,
      backgroundColor: Colors.usersBg,
      marginRight: 10,
      opacity: isDisabled ? 0.5 : 1,
    };
  },
  bottomIcon: {},
});

const htmlStyle = StyleSheet.create((isMyMessage) => {
  return {
    div: {
      color: isMyMessage ? Colors.white : 'black',
    },
  };
});
