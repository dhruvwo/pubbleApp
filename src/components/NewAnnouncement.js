import React, {useState, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, FlatList} from 'react-native';
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
  const [publishBtnDisable, setPublishBtnDisable] = useState(true);
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

  function onLinkPress() {
    setIsVisibleInsertLink(true);
  }

  function onCannedIconPress() {
    if (inputText && inputText.charAt(inputText.length - 1) === '@') {
      setInputText(inputText.slice(0, -1));
    } else {
      setInputText(`@${inputText}`);
    }
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

  async function onAddingNewAnnouncement(approved) {
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
  }

  function onTextChangeAnnouncement(value) {
    setPublishBtnDisable(false);
    setInputText(value);
  }

  return (
    <>
      {checkAnnouncementData !== undefined ? (
        <View style={styles.MainContainer}>
          {!toggleNewAnnouncement ? (
            <View style={styles.TopMainContainer}>
              <TouchableOpacity
                onPress={() => setToggleNewAnnouncement(true)}
                style={styles.AnnouncementTextOnlyContain}>
                <View style={styles.AnnouncementTextOnly}>
                  <Text>Add new announcemnent...</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.AddingMainContainer}>
                <View style={styles.AddTextWrapper}>
                  <Text style={styles.AddText}>
                    Create a new update/announcemnent
                  </Text>
                </View>
                <View style={styles.UserNameMainConatiner}>
                  {reduxState.loggedInUser.avatar ? (
                    <FastImage
                      style={[styles.assigneeImage]}
                      source={{
                        uri: reduxState.loggedInUser.avatar,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ) : (
                    <>
                      <View style={styles.UserMainWrapper}>
                        <View style={styles.UserWrapper}>
                          <View style={styles.UserNameMain}>
                            <Text style={styles.UserName}>
                              {getUserInitals(reduxState.loggedInUser.alias)}
                            </Text>
                          </View>
                        </View>
                        <Text style={{marginLeft: 8}}>
                          {reduxState.loggedInUser.alias}
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                <View>
                  <Text style={styles.messageLength}>
                    {2500 - (inputText.length || 0)}
                  </Text>
                  <MentionInput
                    placeholder="Add new announcement..."
                    multiline={true}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    value={inputText}
                    onChange={(value) => {
                      onTextChangeAnnouncement(value);
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
                        onPress={() => onCannedIconPress()}>
                        <CustomIconsComponent
                          name={'edit'}
                          type={'Feather'}
                          style={styles.bottomIcon}
                          size={20}
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
                  </View>
                </View>
              </View>

              <View style={styles.ActionMainContainer}>
                <TouchableOpacity
                  onPress={() => setToggleNewAnnouncement(false)}
                  style={styles.DiscardView}>
                  <Text style={styles.DiscardText}>Discard</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => onAddingNewAnnouncement(false)}
                    disabled={publishBtnDisable}
                    style={styles.SaveDraftView}>
                    <Text style={styles.SaveDraftText}>Save Draft</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onAddingNewAnnouncement(true)}
                    disabled={publishBtnDisable}
                    style={styles.PublishView}>
                    <Text style={styles.PublishText}>Publish</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      ) : null}

      <InsertLinkModal
        visible={isVisibleInsertLink}
        onRequestClose={() => {
          setIsVisibleInsertLink(false);
        }}
        onInsertLink={(text) => {
          setInputText(inputText ? `${inputText}\n${text}` : text);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    marginTop: 5,
  },
  TopMainContainer: {
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
  AnnouncementTextOnlyContain: {
    padding: 10,
  },
  AnnouncementTextOnly: {
    borderWidth: 1,
    borderColor: '#d9e7ec',
    backgroundColor: '#E9F0F3',
    padding: 12,
  },
  AddingMainContainer: {
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
  AddTextWrapper: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(222,234,239,1)',
    backgroundColor: 'rgba(222,234,239,0.2)',
  },
  AddText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8ba5b4',
  },
  UserNameMainConatiner: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 25,
    paddingBottom: 12,
  },
  UserMainWrapper: {
    flexDirection: 'row',
  },
  UserWrapper: {
    backgroundColor: '#5D9CEC',
    borderRadius: 50,
    height: 40,
    width: 40,
  },
  UserNameMain: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
    position: 'relative',
  },
  UserName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ActionMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  DiscardView: {
    backgroundColor: '#8BA5B4',
    padding: 10,
    borderRadius: 2,
  },
  DiscardText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  SaveDraftView: {
    backgroundColor: '#7CD219',
    padding: 10,
    borderRadius: 2,
  },
  SaveDraftText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  PublishView: {
    backgroundColor: '#51AFFF',
    padding: 10,
    borderRadius: 2,
    marginLeft: 15,
  },
  PublishText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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
