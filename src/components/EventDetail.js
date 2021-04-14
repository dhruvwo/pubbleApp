import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import Colors from '../constants/Colors';
import UserGroupImage from '../components/UserGroupImage';
import * as _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {eventsAction} from '../store/actions';
import moment from 'moment';

export default function EventDetail(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, collections}) => ({
    selectedEvent: auth.selectedEvent,
    communityId: auth?.community?.community?.id || '',
    usersCollection: collections?.users,
  }));
  const [counts, setCounts] = useState(0);

  useEffect(() => {
    console.log(reduxState.selectedEvent);
    getCountsData();
  }, []);

  async function getCountsData() {
    const params = {
      communityId: reduxState.communityId,
      postTypes: 'Q,M',
      appIds: reduxState.selectedEvent.id,
    };
    if (reduxState.selectedEvent.discriminator === 'BL') {
      params.includeDeleted = true;
    }

    const response = await dispatch(eventsAction.getCountsData(params));
    if (reduxState.selectedEvent.discriminator === 'LQ') {
      setCounts(
        response.activeCount +
          response.assignedCount +
          (response.waitingAgentCount +
            response.waitingVisitorCount +
            response.unapprovedInProgressCount) +
          response.closedCount,
      );
    } else {
      setCounts(
        response.unapprovedNewCount +
          response.unapprovedInProgressCount +
          (response.unapprovedInProgressCount +
            response.waitingAgentCount +
            response.waitingVisitorCount) +
          response.deletedCount,
      );
    }
  }

  var eventStartDateDay = moment(reduxState.selectedEvent.startDate).format(
    'D',
  );
  var eventStartDateMonth = moment(reduxState.selectedEvent.startDate).format(
    'MMM',
  );
  var eventEndDateDay = moment(reduxState.selectedEvent.endDate).format('D');
  var eventEndDateMonth = moment(reduxState.selectedEvent.endDate).format(
    'MMM',
  );
  var eventStartTime = moment(reduxState.selectedEvent.startDate).format(
    'h:mm A',
  );
  var eventEndTime = moment(reduxState.selectedEvent.endDate).format('h:mm A');
  return (
    <ScrollView
      style={styles.contentContainer}
      contentContainerStyle={styles.scrollContainer}>
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.dateText}>{eventStartDateDay}</Text>
          <Text style={styles.monthText}>{eventStartDateMonth}</Text>
        </View>

        <View style={styles.dashContainer}>
          <Text style={styles.dash}>-</Text>
        </View>

        <View style={styles.dateItem}>
          <Text style={styles.dateText}>{eventEndDateDay}</Text>
          <Text style={styles.monthText}>{eventEndDateMonth}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {eventStartTime} - {eventEndTime}
        </Text>
      </View>

      <View style={styles.spacerContainer}>
        <Text style={styles.eventText}>{reduxState.selectedEvent.name}</Text>
        <Text style={styles.eventText}>
          {reduxState.selectedEvent.displayTitle}
        </Text>
        <Text style={[styles.eventText, styles.eventTitle]}>
          Liveblog Event
        </Text>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.middleInner}>
          <Text style={styles.valueText}>-</Text>
          <Text style={styles.fieldText}>Online Users</Text>
        </View>

        <View style={styles.middleInner}>
          <Text style={styles.valueText}>{counts}</Text>
          <Text style={styles.fieldText}>Questions</Text>
        </View>
      </View>

      <View style={styles.modsContainer}>
        <Text style={styles.modsTitle}>moderators</Text>
        <View style={styles.modsTagContainer}>
          <Text style={styles.modsTag}>mod</Text>
        </View>
      </View>

      <View style={styles.modsListContainer}></View>

      <View style={styles.moderatorListConatiner}>
        {reduxState.selectedEvent.moderators.map((moderator) => {
          const getUserData = reduxState.usersCollection[moderator];
          return (
            <View style={styles.moderatorListView}>
              <UserGroupImage
                item={getUserData}
                isAssigneesList={true}
                imageSize={40}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    marginHorizontal: 20,
    // justifyContent:'center'
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  dateItem: {
    backgroundColor: '#ff5d87',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  dateText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    flexWrap: 'wrap',
  },
  monthText: {
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.white,
  },
  dashContainer: {
    marginHorizontal: 8,
  },
  dash: {
    color: '#ff5d87',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacerContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#ff5d87',
  },
  eventText: {
    fontSize: 17,
    marginTop: 3,
  },
  eventTitle: {
    color: '#95b1c1',
  },
  middleContainer: {
    marginTop: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: -5,
  },
  middleInner: {
    backgroundColor: Colors.primaryInactive,
    alignItems: 'center',
    padding: 12,
    borderRadius: 2,
    flex: 1,
    marginHorizontal: 5,
    // marginRight: 15,
  },
  valueText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flexWrap: 'wrap',
  },
  fieldText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B0C6D2',
  },
  modsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modsTitle: {
    color: Colors.primaryText,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
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
  modsListContainer: {
    flexDirection: 'row',
    marginTop: 5,
    borderTopWidth: 3,
    borderTopColor: Colors.primaryText,
    paddingTop: 5,
  },

  moderatorListView: {
    marginBottom: 12,
  },
  moderatorListConatiner: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
