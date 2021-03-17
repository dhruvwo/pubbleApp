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
import {
  WingBlank,
  WhiteSpace,
  InputItem,
  ActivityIndicator,
} from '@ant-design/react-native';
import EventsDetailsHeaderTabs from '../components/EventsDetailsHeaderTabs';

export default function EventsDetailsScreen(props) {
  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <EventsDetailsHeaderTabs navigation={props.navigation} />
    </SafeAreaView>
  );
}
