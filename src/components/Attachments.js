import {Text, StyleSheet, View, TouchableOpacity, Linking} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import GlobalStyles from '../constants/GlobalStyles';
import HTMLView from 'react-native-htmlview';
import Colors from '../constants/Colors';
import {appImages} from '../constants/Default';
import {unescapeHTML} from '../services/utilities/Misc';
import * as _ from 'lodash';
import CustomIconsComponent from './CustomIcons';

export default function Attachments({attachments, isMyMessage}) {
  const [height, setHeight] = useState(0);
  const [showAns, setShowAns] = useState(false);

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

  return attachments.map((attachment) => {
    switch (attachment.type) {
      case 'photo':
        return (
          <FastImage
            key={`${attachment.id}`}
            style={[
              styles.cardContainer(isMyMessage),
              {
                width: styles.cardContainer(isMyMessage).maxWidth,
                height: height || 0,
              },
            ]}
            source={{
              uri: attachment.src,
            }}
            onLoad={(evt) => {
              setHeight(
                (evt.nativeEvent.height / evt.nativeEvent.width) *
                  styles.cardContainer(isMyMessage).maxWidth,
              );
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        );
      case 'tweet':
        let tauthor = '';
        if (attachment.authorUrl) {
          tauthor = attachment.authorUrl
            .replace('http://twitter.com/', '')
            .replace('https://twitter.com/', '');
        }
        return (
          <TouchableOpacity
            style={[styles.cardContainer(isMyMessage), styles.twitterContainer]}
            key={`${attachment.id}`}
            disabled={!attachment.url}
            onPress={() => {
              Linking.openURL(attachment.url);
            }}>
            <View style={styles.twitterHeader}>
              <FastImage
                style={[
                  styles.twitterImage,
                  {
                    width: styles.cardContainer(isMyMessage).maxWidth,
                    height: height || 0,
                  },
                ]}
                source={{
                  uri: appImages.twitter,
                }}
              />
              <View style={styles.authorUserNameContainer}>
                <Text style={styles.authorName} numberOfLines={2}>
                  {attachment.title.replaceAll('on Twitter', '')}
                </Text>
                <Text style={styles.authorUserName} numberOfLines={1}>
                  @{tauthor}
                </Text>
              </View>
            </View>
            <HTMLView
              stylesheet={htmlStyle()}
              value={`<div>${unescapeHTML(attachment.html)}</div>`}
            />
          </TouchableOpacity>
        );
      case 'post':
        return (
          <View
            style={[styles.cardContainer(isMyMessage), styles.postContainer]}
            key={`${attachment.id}`}>
            <Text style={styles.title}>{attachment.fallback}</Text>
            <Text style={styles.description}>{attachment.title}</Text>
          </View>
        );
      case 'faq':
        return (
          <View
            style={[styles.cardContainer(isMyMessage), styles.postContainer]}
            key={`${attachment.id}`}>
            <TouchableOpacity
              style={styles.questionHeaderContainer}
              onPress={() => {
                setShowAns(!_.cloneDeep(showAns));
              }}>
              <CustomIconsComponent
                size={20}
                name={showAns ? 'minussquareo' : 'plussquareo'}
                color={Colors.usersBg}
                type={'AntDesign'}
                style={styles.iconContainer}
              />
              <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>{attachment.fallback}</Text>
              </View>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{attachment.question}</Text>
              </View>
            </TouchableOpacity>
            {showAns && (
              <View style={styles.answerContainer}>
                <Text style={styles.description}>{attachment.answer}</Text>
              </View>
            )}
          </View>
        );
      case 'link':
        return (
          <TouchableOpacity
            style={[styles.cardContainer(isMyMessage), styles.linkContainer]}>
            <Text style={styles.linkTitle}>{attachment.title}</Text>
            <Text style={styles.linkDesc}>{attachment.desc}</Text>
          </TouchableOpacity>
        );
      case 'video':
        return (
          <TouchableOpacity
            style={styles.cardContainer(isMyMessage)}
            disabled={!attachment.url}
            onPress={() => {
              Linking.openURL(attachment.url);
            }}>
            <FastImage
              key={`${attachment.id}`}
              style={[
                styles.cardContainer(isMyMessage),
                {
                  width: styles.cardContainer(isMyMessage).maxWidth,
                  height: height || 0,
                },
              ]}
              source={{
                uri: attachment.thumbnail,
              }}
              onLoad={(evt) => {
                setHeight(
                  (evt.nativeEvent.height / evt.nativeEvent.width) *
                    styles.cardContainer(isMyMessage).maxWidth,
                );
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        );
      case 'translate':
        return (
          <View
            key={`${attachment.id}`}
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
        );
      case 'doc':
        let fileName = attachment.src;
        const splitData = fileName.split('/');
        fileName = splitData[splitData.length - 1];
        return (
          <TouchableOpacity
            key={`${attachment.id}`}
            style={[styles.cardContainer(isMyMessage), styles.docContainer]}>
            <View>
              <Text>{fileName}</Text>
            </View>
          </TouchableOpacity>
        );
      default:
        return (
          <View style={styles.cardContainer(isMyMessage)}>
            <Text>{attachment.type}</Text>
          </View>
        );
    }
  });
}

const styles = StyleSheet.create({
  cardContainer: (isMyMessage) => {
    return {
      maxWidth: GlobalStyles.windowWidth * 0.68,
      marginVertical: 10,
      borderRadius: 5,
      padding: 12,
      flexShrink: 1,
      alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
      alignItems: isMyMessage ? 'flex-end' : 'flex-start',
    };
  },
  docContainer: {
    backgroundColor: Colors.yellow,
  },
  translatedMessageContainer: {
    backgroundColor: Colors.bgColor,
  },
  translationText: {
    color: Colors.greyText,
    marginBottom: 5,
  },
  twitterContainer: {
    padding: 12,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: Colors.greyBorder,
    marginTop: 5,
  },
  twitterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
  twitterImage: {
    height: 35,
    width: 35,
  },
  authorUserNameContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  authorName: {
    fontWeight: 'bold',
  },
  authorUserName: {
    fontSize: 12,
  },
  postContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.greyBorder,
  },
  questionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 5,
  },
  questionText: {
    color: Colors.usersBg,
    fontWeight: 'bold',
  },
  answerContainer: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: Colors.secondary,
    marginTop: 5,
  },
  linkContainer: {
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.greyBorder,
  },
  linkTitle: {
    fontWeight: '600',
  },
  linkDesc: {
    color: Colors.greyText,
    fontStyle: 'italic',
  },
  fallbackContainer: {
    backgroundColor: Colors.usersBg,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginRight: 5,
  },
  question: {},
  fallbackText: {
    color: Colors.white,
  },
  title: {
    fontSize: 16,
    color: Colors.primaryText,
    marginBottom: 5,
  },
  description: {},
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
      color: 'black',
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    account: {
      fontWeight: 'bold',
    },
  };
});
