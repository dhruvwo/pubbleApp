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

export default function EventFilter(props) {
  useEffect(() => {
    console.log('search loaded');
  }, []);

  return (
    <View>
      <Text>search</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
