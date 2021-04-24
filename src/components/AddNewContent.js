import React, {useState, useEffect} from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Colors from '../constants/Colors';
import AddPollComponent from './AddPollComponent';
import AddQuestion from './AddQuestion';
import AddTwitterQuestion from './AddTwitterQuestion';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';

export default function AddNewContent(props) {
  const {data, isClone, type} = props.route.params;
  function renderComponent() {
    switch (type) {
      case 'Poll': {
        return (
          <AddPollComponent
            {...props.route.params}
            navigation={props.navigation}
          />
        );
      }
      case 'Question': {
        return (
          <AddQuestion {...props.route.params} navigation={props.navigation} />
        );
      }
      case 'Twitter': {
        return (
          <AddTwitterQuestion
            {...props.route.params}
            navigation={props.navigation}
          />
        );
      }
    }
  }

  let title = 'Create';
  if (!_.isEmpty(data)) {
    if (!isClone) {
      title = 'Edit';
    }
  }
  title = `${title} ${type}`;
  if (type === 'Twitter') {
    title += ' Question';
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
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
        <Text style={styles.title}>{title}</Text>
      </View>
      {renderComponent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
