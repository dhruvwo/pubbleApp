import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import {List, ActivityIndicator} from '@ant-design/react-native';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../constants/Colors';
import {authAction} from '../store/actions';
import AsyncStorage from '@react-native-community/async-storage';

export default function SelectCommunity(props) {
  const reduxState = useSelector(({auth}) => ({
    user: auth.user,
  }));
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  async function onItemClick(community) {
    setLoader(true);
    await dispatch(authAction.initAfterLogin(community.shortName));
    await AsyncStorage.setItem('selectedCommunity', JSON.stringify(community));
    setLoader(false);
    props.navigation.replace('Home');
  }

  return (
    <SafeAreaView style={styles.safeareaView}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <List>
          {reduxState.user.data.map((community) => {
            return (
              <List.Item
                key={community.shortName}
                onPress={() => {
                  onItemClick(community);
                }}>
                {community.name}
              </List.Item>
            );
          })}
        </List>
      </ScrollView>
      {loader ? (
        <ActivityIndicator toast text="Loading..." animating={true} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeareaView: {
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
