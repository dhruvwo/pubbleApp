import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Colors from '../constants/Colors';
import {authAction} from '../store/actions';
import {useDispatch} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

export default function AuthLoadingScreen(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUserToken() {
      let user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user) {
        dispatch(authAction.setUser(user));
      }
      const selectedCommunity = JSON.parse(
        await AsyncStorage.getItem('selectedCommunity'),
      );
      if (selectedCommunity) {
        await dispatch(
          authAction.getCommunityData(selectedCommunity.shortName),
        );
      }
      let pageName = 'Login';
      if (user) {
        pageName = 'Home';
        if (!selectedCommunity) {
          pageName = 'SelectCommunity';
        }
      }
      SplashScreen.hide();
      props.navigation.replace(pageName);
    }
    getUserToken();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
