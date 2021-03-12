import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
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
import LocalIcons from '../constants/LocalIcons';

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
      <View style={styles.positionContain}>
        <Image
          source={LocalIcons.pngIconSet.loginTopImage}
          style={styles.topImage}
        />
        {loader ? (
          <ActivityIndicator toast text="Loading..." animating={true} />
        ) : null}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={styles.welcomeMainContainer}>
            <View style={styles.welcome}>
              <Text style={styles.welcomeText}>Welcome</Text>
            </View>
          </View>

          <View style={styles.loginMainContainer}>
            <WingBlank style={styles.emailMainContainer}>
              <View style={styles.emailContainer}>
                <Text style={styles.emailText} accessibilityLabel="Email">
                  Email
                </Text>
              </View>

              <List>
                <InputItem
                  clear
                  labelNumber={2}
                  ref={(el) => (emailRef = el)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="me@example.com"
                  placeholderTextColor="grey"
                  style={styles.email}
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

            <WingBlank style={styles.passwordMainContainer}>
              <View
                style={styles.passwordContainer}
                accessibilityLabel="Password">
                <Text style={styles.passwordText}>Password</Text>
              </View>
              <List>
                <InputItem
                  clear
                  labelNumber={2}
                  ref={(el) => (passwordRef = el)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Password"
                  placeholderTextColor="grey"
                  style={styles.password}
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
            <WingBlank style={styles.loginBtnMainContainer}>
              <Button
                onPress={LoginHandler}
                style={styles.loginBtnContainer}
                accessibilityLabel="Sign In">
                <Text style={styles.loginBtn}>Sign In</Text>
              </Button>
            </WingBlank>
          </View>
        </KeyboardAvoidingView>

        <Image
          source={LocalIcons.pngIconSet.loginBottomImage}
          style={styles.bottomImage}
        />
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
  emailMainContainer: {
    marginBottom: 20,
    width: '80%',
    left: 28,
  },
  emailContainer: {
    marginBottom: 2,
  },
  emailText: {
    fontSize: 16,
    color: '#fff',
  },
  email: {
    fontSize: 16,
  },
  passwordMainContainer: {
    marginBottom: 5,
    width: '80%',
    left: 28,
  },
  passwordContainer: {
    marginBottom: 2,
  },
  passwordText: {
    fontSize: 16,
    color: '#fff',
  },
  password: {
    fontSize: 16,
  },
  loginBtnMainContainer: {
    alignItems: 'center',
  },
  loginBtnContainer: {
    backgroundColor: '#fff',
    width: 120,
    height: 32,
    height: 40,
    width: '40%',
  },
  loginBtn: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#3e525e',
  },
  positionContain: {
    position: 'relative',
    flex: 1,
  },
  topImage: {
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
    height: 50,
    top: 0,
  },
  bottomImage: {
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
    height: 50,
    bottom: 0,
  },
});
