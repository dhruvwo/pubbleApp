import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Colors from '../constants/Colors';
import {authAction} from '../store/actions';
import {useDispatch} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {navigate} from '../RootNavigation';

export default function AuthLoadingScreen(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUserToken() {
      let authenticationResponse = await AsyncStorage.getItem(
        'authenticationResponse',
      );
      authenticationResponse = JSON.parse(authenticationResponse);

      if (authenticationResponse) {
        dispatch(authAction.initAfterLogin());
        dispatch(authAction.setUser(authenticationResponse));
      }
      SplashScreen.hide();
      let pageName = 'Login';
      if (authenticationResponse) {
        pageName = 'Home';
      }

      props.navigation.replace(pageName);
      // navigate(pageName);
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
