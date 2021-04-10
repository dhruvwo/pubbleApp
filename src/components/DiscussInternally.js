import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';
import UserGroupImage from './UserGroupImage';
import * as _ from 'lodash';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import CustomMentionInput from './CustomMentionInput';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';

export default function DiscussInternally(props) {
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState('');
  useEffect(() => {
    console.log('lDiscussInternally oaded');
  }, []);

  function renderChatCard() {
    return <View />;
  }

  return (
    <KeyboardAwareView style={styles.contentContainer}>
      <FlatList
        inverted={true}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        data={conversation}
        contentContainerStyle={styles.flatListContainer}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderChatCard}
        // onMomentumScrollEnd={onMomentumScrollEnd}
        // ListFooterComponent={renderFooter}
      />
      <CustomMentionInput
        placeholder="Chat here..."
        value={inputText}
        hideAttach={true}
        hidePush={true}
        hideCanned={true}
        onChange={(value) => {
          setInputText(value);
        }}
      />
    </KeyboardAwareView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
