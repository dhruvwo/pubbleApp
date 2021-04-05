import React, {useState, useEffect} from 'react';
import HTMLView from 'react-native-htmlview';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as _ from 'lodash';
import Colors from '../constants/Colors';
import {
  handleURLBB,
  unescapeHTML,
  getMentioned,
  unescapeMentioned,
} from '../services/utilities/Misc';
import CustomIconsComponent from './CustomIcons';

export default function ChatContent({
  item,
  isMyMessage,
  setSelectedMessage,
  conversationRoot,
  editItem,
  isEditing,
  onCloseEdit,
}) {
  const [contentEdit, setContentEdit] = useState('');

  useEffect(() => {
    if (isEditing) {
      let convertedContent = editItem.content;
      convertedContent = unescapeMentioned(convertedContent, item.attachments);
      convertedContent = unescapeHTML(convertedContent);
      setContentEdit(convertedContent);
    }
  }, [isEditing]);

  function renderNode(node, index) {
    if (node.name == 'account' && node.children[0]?.data) {
      const specialSyle = node.attribs.style;
      return (
        <Text
          key={index}
          style={[specialSyle, htmlStyle().account]}
          onPress={() => {
            console.log('user', node);
          }}>
          {node.children[0]?.data}
        </Text>
      );
    }
  }

  let content = item.content;
  if (item?.attachments) {
    content = getMentioned(content, item.attachments);
  }
  content = handleURLBB(content);
  const isDraft = !item.approveConversation && !item.approved;
  const isTop = conversationRoot?.topReplyId === item.id;
  return isEditing ? (
    <View style={styles.cardContainer(isMyMessage, item.tempId, isDraft)}>
      <TextInput
        placeholderTextColor={htmlStyle(isMyMessage).div.color}
        style={htmlStyle(isMyMessage).div}
        placeholder="type here..."
        keyboardType={'url'}
        autoCapitalize={'none'}
        autoCorrect={false}
        value={contentEdit}
        multiline={true}
        onSubmitEditing={() => onCloseEdit(true, contentEdit, item)}
        onChangeText={(text) => {
          setContentEdit(text);
        }}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer()}
          onPress={() => onCloseEdit(true, contentEdit, item)}>
          <CustomIconsComponent
            size={23}
            name={'checkmark'}
            color={Colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer(true)}
          onPress={() => onCloseEdit()}>
          <CustomIconsComponent size={23} name={'close'} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <TouchableOpacity onLongPress={() => setSelectedMessage(item)}>
      {(isDraft || isTop) && (
        <View style={styles.draftContainer}>
          <Text style={styles.draftText}>{isTop ? 'TOP ANSWER' : 'DRAFT'}</Text>
        </View>
      )}

      <View style={styles.cardContainer(isMyMessage, item.tempId, isDraft)}>
        {item.content === '//contact' || item.content === '//share' ? (
          <View style={styles.contactCardContainer}>
            <CustomIconsComponent
              type={'AntDesign'}
              name={'contacts'}
              size={25}
              color={htmlStyle(isMyMessage).div.color}
              style={styles.contactCard}
            />
            <Text style={[styles.contactCardText, htmlStyle(isMyMessage).div]}>
              {item.content === '//share'
                ? 'Requested to share contact details'
                : 'Contact card was pushed in conversation'}
            </Text>
          </View>
        ) : (
          <HTMLView
            renderNode={renderNode}
            stylesheet={htmlStyle(isMyMessage)}
            value={`<div>${content}</div>`}
          />
        )}
      </View>
      {item?.attachments?.length
        ? item.attachments.map((attachment, i) => {
            return attachment.type === 'translate' ? (
              <View
                key={`${i}`}
                style={[
                  styles.cardContainer(isMyMessage),
                  styles.translatedMessageContainer,
                ]}>
                <Text style={styles.translationText}>Translation</Text>
                <HTMLView
                  renderNode={renderNode}
                  stylesheet={htmlStyle()}
                  value={`<div>${attachment.translation}</div>`}
                />
              </View>
            ) : null;
          })
        : null}
    </TouchableOpacity>
  );
}

const htmlStyle = StyleSheet.create((isMyMessage) => {
  return {
    div: {
      color: isMyMessage ? Colors.white : 'black',
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

const styles = StyleSheet.create({
  contactCardContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  contactCard: {
    marginRight: 8,
  },
  contactCardText: {
    fontSize: 16,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  cardContainer: (isMyMessage, isTemp, isDraft) => {
    return {
      padding: 15,
      borderRadius: 5,
      backgroundColor: isMyMessage
        ? isDraft
          ? Colors.green
          : '#0bafff'
        : Colors.bgColor,
      alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
      flexShrink: 1,
      opacity: isTemp ? 0.8 : 1,
    };
  },
  translatedMessageContainer: {
    marginTop: 5,
    backgroundColor: Colors.bgColor,
  },
  translationText: {
    color: Colors.greyText,
    marginBottom: 5,
  },
  translatedMessage: {},
  draftText: {
    color: Colors.white,
    fontSize: 13,
  },
  draftContainer: {
    backgroundColor: Colors.primaryText,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: 'flex-end',
    marginBottom: 3,
    borderRadius: 3,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  buttonContainer: (isClose) => {
    return {
      padding: 5,
      backgroundColor: isClose ? Colors.red : Colors.green,
      borderRadius: 50,
      marginLeft: isClose ? 10 : 0,
    };
  },
});
