import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {authAction} from '../store/actions';
import {Button} from '@ant-design/react-native';

export default function MyInboxScreen(props) {
  const dispatch = useDispatch();
  function onLogoutPress() {
    dispatch(authAction.logout());
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Inbox Screen</Text>

      <Button onPress={onLogoutPress} accessibilityLabel="Log ou">
        <Text>Log out</Text>
      </Button>
    </View>
  );
}
