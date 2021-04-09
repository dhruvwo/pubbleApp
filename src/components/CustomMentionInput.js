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

export default function CustomMentionInput(props) {
  const {messageType} = props;
  const [activeCannedIndex, setActiveCannedIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isVisibleInsertLink, setIsVisibleInsertLink] = useState(false);
  const reduxState = useSelector(({auth}) => ({
    cannedMessages: auth.community.cannedMessages,
  }));
  const suggestions = [];

  let index = 0;
  for (let key in reduxState.usersCollection) {
    if (index === 5) {
      break;
    }
    suggestions.push(reduxState.usersCollection[key]);
    index++;
  }

  function onContectCardPress() {
    onSendPress('//contact');
  }

  function onAttachPress() {
    console.log('onAttachPress');
  }

  function onLinkPress() {
    setIsVisibleInsertLink(true);
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

  return (
    <View>
      <Text style={styles.messageLength}>{2500 - (inputText.length || 0)}</Text>
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
          {messageType && (
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
                  <View style={[GlobalStyles.devider, styles.optionDevider]} />
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
          )}
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
    </View>
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
