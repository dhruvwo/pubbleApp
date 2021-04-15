import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Alert} from 'react-native';
import Colors from '../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import UserGroupImage from '../components/UserGroupImage';
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
      await dispatch(
        eventsAction.addNewAnnouncementFunc(params, 'announcement'),
      );
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
});
