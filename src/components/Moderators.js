import React from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
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

  function renderItem({item}) {
    const getUserData = reduxState.usersCollection[item];
    return (
      <View style={styles.moderatorListView}>
        <UserGroupImage
          item={getUserData}
          isAssigneesList={true}
          imageSize={40}
        />
        <Text>{getUserData.alias}</Text>
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <View style={styles.topHeadingMainContainer}>
        <Text style={styles.activityPubbleUsersText}>Moderators</Text>
        <View style={styles.modContainer}>
          <View style={styles.modsTagContainer}>
            <Text style={styles.modsTag}>mod</Text>
          </View>

          <TouchableOpacity style={styles.plusIconTouchable}>
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

      <View style={styles.moderatorListConatiner}>
        <FlatList
          renderItem={renderItem}
          data={reduxState.selectedEvent.moderators}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    </View>
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
  modContainer: {flexDirection: 'row'},
  plusIconTouchable: {
    backgroundColor: Colors.primaryText,
    borderRadius: 8,
    marginLeft: 8,
    padding: 1,
  },
  moderatorListConatiner: {
    marginTop: 10,
    flex: 1,
  },
});
