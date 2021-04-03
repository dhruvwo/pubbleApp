import React, {useState, useEffect} from 'react';
import HTMLView from 'react-native-htmlview';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as _ from 'lodash';
import Colors from '../constants/Colors';
import {handleURLBB} from '../services/utilities/Misc';
import CustomIconsComponent from './CustomIcons';

export default function ChatContent({
  item,
  isMyMessage,
  setSelectedMessage,
  conversationRoot,
  usersCollection,
}) {
  // function getMentioned(str) {
  //   const regex = /\[%account\|(\d+)*%\]/gm;
  //   let m;
  //   let newStr = _.cloneDeep(str);
  //   while ((m = regex.exec(str)) !== null) {
  //     if (m.index === regex.lastIndex) {
  //       regex.lastIndex++;
  //     }
  //     const user = usersCollection[m[1]];
  //     if (user) {
  //       newStr = newStr.replace(
  //         m[0],
  //         `<account accountId=${JSON.stringify(user.id)}>@${
  //           user.shortName
  //         }</account>`,
  //       );
  //     }
  //   }
  //   return newStr;
  // }

  function getMentioned(str, attachments) {
    let newStr = _.cloneDeep(str);
    attachments.forEach((attachment) => {
      if (attachment.type === 'account' || attachment.type === 'post') {
        newStr = newStr.replace(
          attachment.pattern,
          `<account accountId=${attachment.targetId}>${attachment.fallback}</account>`,
        );
      }
    });
    return newStr;
  }

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
  return (
    <TouchableOpacity
      onLongPress={() => setSelectedMessage(item)}
      style={{zIndex: 10}}>
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
                  stylesheet={[htmlStyle(isMyMessage)]}
                  value={`<div>${attachment.translation}</div>`}
                />
              </View>
            ) : null;
          })
        : null}
    </TouchableOpacity>
  );
}

const htmlStyle = StyleSheet.create((isMyMessage, tempId) => {
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
});
