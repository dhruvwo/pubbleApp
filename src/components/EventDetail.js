import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import UserGroupImage from '../components/UserGroupImage';
import * as _ from 'lodash';

export default function EventDetail(props) {
  useEffect(() => {
    console.log('loaded');
  }, []);
  return (
    <ScrollView
      style={styles.contentContainer}
      contentContainerStyle={styles.scrollContainer}>
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.dateText}>9</Text>
          <Text style={styles.monthText}>Mar</Text>
        </View>

        <View style={styles.dashContainer}>
          <Text style={styles.dash}>-</Text>
        </View>

        <View style={styles.dateItem}>
          <Text style={styles.dateText}>30</Text>
          <Text style={styles.monthText}>Jun</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>5:30 AM - 4:30 AM</Text>
      </View>

      <View style={styles.spacerContainer}>
        <Text style={styles.eventText}>Test Live QA App</Text>
        <Text style={styles.eventText}>Display Live QA App</Text>
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
          <Text style={styles.valueText}>30</Text>
          <Text style={styles.fieldText}>Questions</Text>
        </View>
      </View>

      <View style={styles.modsContainer}>
        <Text style={styles.modsTitle}>moderators</Text>
        <View style={styles.modsTagContainer}>
          <Text style={styles.modsTag}>mod</Text>
        </View>
      </View>

      <View style={styles.modsListContainer}>{/* <UserGroupImage/> */}</View>
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
});
