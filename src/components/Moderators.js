import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import UserGroupImage from '../components/UserGroupImage';
import * as _ from 'lodash';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function Moderators(props) {
  const reduxState = useSelector(({auth, collections}) => ({
    usersCollection: collections?.users,
    selectedEvent: auth.selectedEvent,
  }));

  return (
    <>
      <View style={styles.contentContainer}>
        <View style={styles.topHeadingMainContainer}>
          <Text style={styles.activityPubbleUsersText}>Moderators</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.modsTagContainer}>
              <Text style={styles.modsTag}>mod</Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.primaryText,
                borderRadius: 8,
                marginLeft: 8,
                padding: 1,
              }}>
              <CustomIconsComponent
                color={'white'}
                type={'AntDesign'}
                name={'plus'}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dividerStyleMainContainer}>
          <View style={styles.dividerStyle1}></View>
          <View style={styles.dividerStyle2}></View>
        </View>

        <View
          style={{
            marginTop: 10,
          }}>
          {reduxState.selectedEvent.moderators.map((moderator, index) => {
            const getUserData = reduxState.usersCollection[moderator];
            return (
              <View key={index} style={styles.moderatorListView}>
                <UserGroupImage
                  item={getUserData}
                  isAssigneesList={true}
                  imageSize={40}
                />
                <Text>{getUserData.alias}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  activityPubbleUsersText: {
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dividerStyleMainContainer: {
    flexDirection: 'row',
    marginTop: 3,
  },
  dividerStyle1: {
    width: 50,
    borderWidth: 2,
    borderColor: Colors.primaryText,
  },
  dividerStyle2: {
    width: 320,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
  },
  modsTagContainer: {
    borderWidth: 1,
    borderColor: Colors.primaryText,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  modsTag: {
    color: Colors.primaryText,
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: 'bold',
  },

  topHeadingMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moderatorListView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});
