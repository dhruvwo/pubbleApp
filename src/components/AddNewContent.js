import React from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import AddPollComponent from './AddPollComponent';
import AddQuestion from './AddQuestion';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomIconsComponent from '../components/CustomIcons';

export default function AddNewContent(props) {
  const {
    toggleAddContentModal,
    onRequestClose,
    selectedEvent,
    communityId,
    onAddingPoll,
    type,
  } = props;

  function renderComponent() {
    if (type === 'AddPoll') {
      return (
        <AddPollComponent
          itemForAssign={toggleAddContentModal}
          onRequestClose={() => onRequestClose()}
          selectedEvent={selectedEvent}
          communityId={communityId}
          onAddingPoll={onAddingPoll}
        />
      );
    }

    if (type === 'AddQuestion') {
      return (
        <AddQuestion
          itemForAssign={toggleAddContentModal}
          onRequestClose={() => onRequestClose()}
          selectedEvent={selectedEvent}
          communityId={communityId}
          onAddingPoll={onAddingPoll}
        />
      );
    }
  }

  return (
    <Modal
      visible={toggleAddContentModal}
      onRequestClose={() => {
        onRequestClose();
      }}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => onRequestClose()}>
              <CustomIconsComponent
                type={'FontAwesome'}
                name={'close'}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>

          {renderComponent()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: Colors.secondary,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
