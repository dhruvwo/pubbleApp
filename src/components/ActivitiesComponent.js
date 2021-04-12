import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Colors from '../constants/Colors';
import UserGroupImage from '../components/UserGroupImage';
import HTMLView from 'react-native-htmlview';
import {formatAMPM} from '../services/utilities/Misc';
import {useSelector} from 'react-redux';

export default function ActivitiesComponent(props) {
  const {data} = props;
  const reduxState = useSelector(({collections}) => ({
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
  }));

  return (
    <View style={styles.activitiesMainContainer}>
      <Text style={styles.onlineVisitorText}>Visitor onsite activity</Text>

      <View style={styles.dividerStyleMainContainer}>
        <View style={styles.dividerStyle1}></View>
        <View style={styles.dividerStyle2}></View>
      </View>

      {/*  */}
      <View style={styles.activityPubbleUsersMainContainer}>
        <Text style={styles.activityPubbleUsersText}>
          user activity with pubble
        </Text>

        <View style={styles.dividerStyleMainContainer}>
          <View style={styles.dividerStyle1}></View>
          <View style={styles.dividerStyle2}></View>
        </View>

        <View style={styles.pubbleUsersConatiner}>
          <View style={styles.questionContentMainContainer}>
            <View style={styles.questionContentView}>
              <Text style={styles.questionContentText}>
                {data.type}
                {data.count}
              </Text>
            </View>
          </View>

          <View style={styles.userGroupContainer}>
            {data.assignees.map((assignee) => {
              return (
                <UserGroupImage
                  key={`${assignee.id}`}
                  users={reduxState.usersCollection}
                  groups={reduxState.groupsCollection}
                  imageSize={30}
                  item={assignee}
                />
              );
            })}
          </View>
        </View>

        <HTMLView
          stylesheet={htmlStyle()}
          value={`<div>${data.content}</div>`}
        />

        <Text style={styles.questionContentDate}>
          {formatAMPM(data.datePublished)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activitiesMainContainer: {
    padding: 20,
  },
  onlineVisitorText: {
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
  activityPubbleUsersMainContainer: {
    marginTop: 70,
  },
  activityPubbleUsersText: {
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pubbleUsersConatiner: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  questionContentMainContainer: {
    flexDirection: 'row',
  },
  questionContentView: {
    backgroundColor: Colors.primaryText,
    paddingHorizontal: 3,
    paddingVertical: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 8,
  },
  questionContentText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  userGroupContainer: {flexDirection: 'row'},
  questionContentDate: {
    marginTop: 10,
    color: Colors.primaryText,
  },
});

const htmlStyle = StyleSheet.create(() => {
  return {
    div: {
      color: 'black',
    },
    span: {
      fontWeight: 'bold',
    },
    a: {
      color: Colors.white,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    account: {
      fontWeight: 'bold',
    },
  };
});
