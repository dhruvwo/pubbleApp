import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import Colors from '../constants/Colors';
import {getUserInitals} from '../services/utilities/Misc';
import FastImage from 'react-native-fast-image';
import {MentionInput} from 'react-native-controlled-mentions';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import CustomIconsComponent from '../components/CustomIcons';
import UserGroupImage from '../components/UserGroupImage';
import InsertLinkModal from '../components/InsertLinkModal';
import {eventsAction} from '../store/actions';
import CustomMentionInput from './CustomMentionInput';

export default function NewAnnouncement(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, events, collections}) => ({
    stream: events?.stream,
    loggedInUser: auth.community.account,
    usersCollection: collections?.users,
    cannedMessages: auth.community.cannedMessages,
    communityId: auth?.community?.community?.id || '',
    selectedEvent: auth.selectedEvent,
  }));

  const [toggleNewAnnouncement, setToggleNewAnnouncement] = useState(false);
  const [isVisibleInsertLink, setIsVisibleInsertLink] = useState(false);
  const [activeCannedIndex, setActiveCannedIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const {setEventActionLoader} = props;
  const checkAnnouncementData = reduxState.stream.find(
    (str) => str.type === 'U',
  );
  const suggestions = [];

  let index = 0;
  for (let key in reduxState.usersCollection) {
    if (index === 5) {
      break;
    }
    suggestions.push(reduxState.usersCollection[key]);
    index++;
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

  async function onAddingNewAnnouncement(approved) {
    if (inputText !== '') {
      setEventActionLoader(true);
      const currentTime = _.cloneDeep(new Date().getTime());
      const params = {
        type: 'U',
        appId: reduxState.selectedEvent.id,
        content: inputText,
        communityId: reduxState.communityId,
        isTemp: true,
        dateCreated: currentTime,
        lastUpdated: currentTime,
        id: currentTime,
        datePublished: currentTime,
        postAsVisitor: false,
        internal: false,
        postToType: 'app',
        approved: approved,
      };
      await dispatch(eventsAction.addNewAnnouncementFunc(params));
      setToggleNewAnnouncement(false);
      setInputText('');
      setEventActionLoader(false);
    } else {
      Alert.alert('Please enter announcement first.');
    }
  }

  return (
    <>
      {checkAnnouncementData !== undefined ? (
        <View style={styles.mainContainer}>
          {!toggleNewAnnouncement ? (
            <View style={styles.topMainContainer}>
              <TouchableOpacity
                onPress={() => setToggleNewAnnouncement(true)}
                style={styles.announcementTextOnlyContain}>
                <View style={styles.announcementTextOnly}>
                  <Text style={styles.addText}>Add new announcement...</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.addingMainContainer}>
                <View style={styles.addTextWrapper}>
                  <Text style={styles.addText}>
                    Create a new update/announcement
                  </Text>
                </View>
                <View style={styles.userNameMainConatiner}>
                  <UserGroupImage
                    item={reduxState.loggedInUser}
                    isAssigneesList={true}
                    imageSize={40}
                  />
                  <Text style={styles.currentUserName}>
                    {reduxState.loggedInUser.alias}
                  </Text>
                </View>
                <CustomMentionInput
                  placeholder="Add new announcement..."
                  value={inputText}
                  hideSend={true}
                  hidePush={true}
                  onChange={(value) => {
                    setInputText(value);
                  }}
                />
              </View>

              <View style={styles.actionMainContainer}>
                <TouchableOpacity
                  onPress={() => setToggleNewAnnouncement(false)}
                  style={[styles.buttonContainer(true), styles.discardView]}>
                  <Text style={styles.discardText}>Discard</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => onAddingNewAnnouncement(false)}
                    disabled={!inputText}
                    style={[
                      styles.buttonContainer(!!inputText),
                      styles.saveDraftView,
                    ]}>
                    <Text style={styles.saveDraftText}>Save Draft</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onAddingNewAnnouncement(true)}
                    disabled={!inputText}
                    style={[
                      styles.buttonContainer(!!inputText),
                      styles.publishView,
                    ]}>
                    <Text style={styles.publishText}>Publish</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 8,
  },
  topMainContainer: {
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 3,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  announcementTextOnlyContain: {
    padding: 10,
  },
  announcementTextOnly: {
    borderWidth: 1,
    borderColor: Colors.announcementBorderColor,
    backgroundColor: Colors.primaryInactive,
    padding: 12,
  },
  addingMainContainer: {
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 3,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  addTextWrapper: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryInactive,
    backgroundColor: Colors.primaryTilt,
  },
  addText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  userNameMainConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  currentUserName: {
    fontSize: 15,
  },
  userMainWrapper: {
    flexDirection: 'row',
  },
  userWrapper: {
    backgroundColor: Colors.usersBg,
    borderRadius: 50,
    height: 40,
    width: 40,
  },
  userNameMain: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
    position: 'relative',
  },
  userName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  actionMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  discardView: {
    backgroundColor: Colors.primaryText,
  },
  discardText: {
    color: Colors.white,
  },
  saveDraftView: {
    backgroundColor: Colors.green,
  },
  buttonContainer: (isActive) => {
    return {
      opacity: isActive ? 1 : 0.5,
      fontSize: 13,
      fontWeight: '600',
      padding: 10,
      borderRadius: 2,
    };
  },
  saveDraftText: {
    color: Colors.white,
  },
  publishView: {
    backgroundColor: Colors.usersBg,
    marginLeft: 5,
  },
  publishText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  assigneeImage: {
    zIndex: 2,
    minWidth: 28,
    borderRadius: 28,
    minHeight: 28,
  },
  messageLength: {
    marginHorizontal: 20,
    fontSize: 12,
    textAlign: 'right',
    color: Colors.primaryText,
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
  bottomIconContainer: {
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  bottomIcon: {},

  cannedCommandContainer: (isActive) => {
    return {
      paddingLeft: 12,
      backgroundColor: isActive ? Colors.primaryActive : 'transparent',
      borderRadius: 5,
      marginVertical: 5,
      padding: 5,
    };
  },
  cannedMessageTitle: (isActive) => {
    return {
      fontSize: 16,
      fontWeight: '600',
      color: isActive ? Colors.white : Colors.black,
    };
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
  suggustedUsers: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
  cannedCommandsContainer: {
    padding: 8,
    width: 95,
    borderRightColor: Colors.primary,
    borderRightWidth: 0.5,
  },
  cannedMessageContainer: {
    marginVertical: 5,
    marginHorizontal: 12,
  },
});
