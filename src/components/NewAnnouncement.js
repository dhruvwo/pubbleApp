import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Alert} from 'react-native';
import Colors from '../constants/Colors';
import {useSelector} from 'react-redux';
import * as _ from 'lodash';
import UserGroupImage from '../components/UserGroupImage';
import CustomMentionInput from './CustomMentionInput';

export default function NewAnnouncement(props) {
  const {onAddClick, title, placeholder, inputText, setInputText} = props;
  const reduxState = useSelector(({auth, collections}) => ({
    loggedInUser: auth.community.account,
    usersCollection: collections?.users,
  }));

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.mainContainer}>
      {!isExpanded ? (
        <View style={styles.topMainContainer}>
          <TouchableOpacity
            onPress={() => setIsExpanded(true)}
            style={styles.announcementTextOnlyContain}>
            <View style={styles.announcementTextOnly}>
              <Text style={styles.addText}>{placeholder}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.addingMainContainer}>
            <View style={styles.addTextWrapper}>
              <Text style={styles.addText}>{title}</Text>
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
              placeholder={placeholder}
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
              onPress={() => setIsExpanded(false)}
              style={[styles.buttonContainer(true), styles.discardView]}>
              <Text style={styles.discardText}>Discard</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => onAddClick(false)}
                disabled={!inputText}
                style={[
                  styles.buttonContainer(!!inputText),
                  styles.saveDraftView,
                ]}>
                <Text style={styles.saveDraftText}>Save Draft</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onAddClick(true)}
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
