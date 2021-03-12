import React, {useState} from 'react';
import {SafeAreaView, Text, View, Alert, StyleSheet} from 'react-native';
import {
  Button,
  WingBlank,
  InputItem,
  List,
  ActivityIndicator,
  WhiteSpace,
  Toast,
} from '@ant-design/react-native';
import CustomIcons from '../components/CustomIcons';
import {useDispatch} from 'react-redux';
import {authAction} from '../store/actions/auth';
import Colors from '../constants/Colors';

import AsyncStorage from '@react-native-community/async-storage';

export default function Login(props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const emailOnchangeHandler = (email) => {
    setEmail(email);
  };

  const passwordOnchangeHandler = (password) => {
    setPassword(password);
  };

  const LoginHandler = async () => {
    // console.log(
    //   AsyncStorage.getItem('authenticationResponse'),
    //   'local storage',
    // );
    // AsyncStorage.removeItem('authenticationResponse');

    if (email === '') {
      emailRef.focus();
      Toast.info('Please enter email', 2);
    } else if (password === '') {
      passwordRef.focus();
      Toast.info('Please enter password', 1);
    }

    if (email !== '' && password !== '') {
      setLoader(true);
      const loginData = await dispatch(authAction.login({email, password}));
      const initApi = await dispatch(authAction.initAfterLogin());
      if (loginData?.code !== 200) {
        setLoader(false);
        Alert.alert(
          'Error',
          'Incoorect Email/Password. Please try again',
          [{text: 'OK'}],
          {cancelable: false},
        );
      }
      if (loginData?.code === 200) {
        setLoader(false);
        props.navigation.replace('Home');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeareaView}>
      {loader ? (
        <ActivityIndicator toast text="Loading..." animating={true} />
      ) : null}

      <View style={styles.welcomeMainContainer}>
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Welcome</Text>
        </View>
      </View>

      <View style={styles.loginMainContainer}>
        <WingBlank
          style={{
            marginBottom: 20,
            width: '80%',
            left: 28,
          }}>
          <View
            style={{
              marginBottom: 2,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
              }}
              accessibilityLabel="Email">
              Email
            </Text>
          </View>

          <List>
            <InputItem
              clear
              labelNumber={2}
              ref={(el) => (emailRef = el)}
              autoCapitalize="none"
              placeholder="me@example.com"
              placeholderTextColor="grey"
              style={{
                fontSize: 16,
              }}
              onChange={(email) => emailOnchangeHandler(email)}>
              <CustomIcons
                type={'Entypo'}
                color={'grey'}
                name={'mail-with-circle'}
                size={20}
              />
            </InputItem>
          </List>
        </WingBlank>

        <WingBlank
          style={{
            marginBottom: 5,
            width: '80%',
            left: 28,
          }}>
          <View
            style={{
              marginBottom: 2,
            }}
            accessibilityLabel="Password">
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
              }}>
              Password
            </Text>
          </View>
          <List>
            <InputItem
              clear
              labelNumber={2}
              ref={(el) => (passwordRef = el)}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor="grey"
              style={{
                fontSize: 16,
              }}
              type="password"
              onChange={(password) => passwordOnchangeHandler(password)}>
              <CustomIcons
                type={'FontAwesome5'}
                color={'grey'}
                name={'unlock-alt'}
                size={20}
              />
            </InputItem>
          </List>
        </WingBlank>

        <WhiteSpace />
        <WhiteSpace />
        <WhiteSpace />
        <WhiteSpace />
        <WingBlank
          style={{
            alignItems: 'center',
          }}>
          <Button
            onPress={LoginHandler}
            style={{
              backgroundColor: '#fff',
              width: 120,
              height: 32,
              height: 40,
              width: '40%',
            }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'normal',
                color: '#3e525e',
              }}>
              Sign In
            </Text>
          </Button>
        </WingBlank>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeareaView: {
    backgroundColor: '#00c9dd',
    flex: 1,
  },
  welcomeMainContainer: {
    flex: 2,
  },
  welcome: {
    top: 80,
    opacity: 0.85,
    left: 42,
  },
  welcomeText: {
    fontSize: 26,
    color: 'rgb(255, 255, 255)',
  },
  loginMainContainer: {
    flex: 3,
  },
});
