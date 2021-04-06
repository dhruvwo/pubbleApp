import {Text, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import GlobalStyles from '../constants/GlobalStyles';

export default function Attachments({attachments}) {
  return attachments.map((attachment) => {
    console.log('attachment', attachment);

    switch (attachment.type) {
      case 'photo':
        return (
          <FastImage
            style={[styles.attachmentImage]}
            source={{
              uri: attachment.src,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        );
    }
  });
}

const styles = StyleSheet.create({
  attachmentImage: {
    height: GlobalStyles.windowWidth * 0.6,
    width: GlobalStyles.windowWidth * 0.6,
    marginBottom: 10,
    borderRadius: 5,
  },
});
