import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';

export default function EventsDetailsScreen(props) {
  const dataArry = [
    {
      header: 'My Inbox',
      content:
        'This section is where you can find all questions that are assigned to you. Questions can be assigned by your co-workers and also by automatically by the system. Note that a question can have multiple assignees. "Team Inbox" shows all customer questions which includes questions assigned to you.',
    },
    {
      header: 'Customer enquiry',
      content:
        'A new customer question will be found in the "NEW" tab and will be moved to "IN PROGRESS" as soon as the conversation starts. Once the issue has been resolved, you can close the question and the question will move to the CLOSED tab. Questions will be auto-closed after a period of time defined by your administrator.',
    },
    {
      header: 'Closing questions',
      content:
        'Should I close questions as quickly as possible? Yes, but you should only close a question when the customer issue has been resolved. Closing a question before it has been resolved might leave an unsatisfactory impression with the customer. The goal is to have as few questions as possible in the NEW and IN PROGRESS tabs but not at the expense of good customer service.',
    },
  ];
  function renderHeader() {
    return (
      <View style={styles.headerMainContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.headerLeftIcon}>
          <CustomIconsComponent
            color={'white'}
            name={'arrow-forward-ios'}
            type={'MaterialIcons'}
            size={25}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      {renderHeader()}
      <ScrollView style={styles.contentContainer}>
        {dataArry.map((val, i) => {
          return (
            <View style={styles.contentStyle} key={i}>
              <Text style={styles.headerText}>{val.header}</Text>
              <Text style={styles.contentText}>{val.content}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  headerMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
    backgroundColor: Colors.yellow,
    padding: 5,
    borderRadius: 5,
  },
  contentContainer: {
    padding: 10,
  },
  contentStyle: {
    paddingBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  contentText: {
    fontSize: 16,
  },
});
