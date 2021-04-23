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
  const {onRequestClose, onSubmit, type, isClone, data} = props;
  let currentTitle = '';

  function renderComponent() {
    switch (type) {
      case 'Poll': {
        return (
          <AddPollComponent
            onRequestClose={() => onRequestClose()}
            onSubmit={onSubmit}
            data={data}
            isClone={isClone}
          />
        );
      }
      case 'Question': {
        return (
          <AddQuestion
            onRequestClose={() => onRequestClose()}
            onSubmit={onSubmit}
          />
        );
      }
      case 'Twitter': {
        return (
          <AddTwitterQuestion
            onRequestClose={() => onRequestClose()}
            onSubmit={onSubmit}
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
    <Modal
      visible={!!type}
      onRequestClose={() => {
        onRequestClose();
      }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={() => onRequestClose()}>
            <CustomIconsComponent
              type={'FontAwesome'}
              name={'close'}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
        {renderComponent()}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: Colors.secondary,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
