import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ActivityIndicator} from '@ant-design/react-native';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../constants/Colors';
import {authAction} from '../store/actions';
import AsyncStorage from '@react-native-community/async-storage';
import LocalIcons from '../constants/LocalIcons';

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

  function goToLogin() {
    props.navigation.replace('Login');
  }

  return (
    <SafeAreaView style={styles.safeareaView}>
      <View style={styles.mainContainer}>
        <Image
          source={LocalIcons.pngIconSet.loginTopImage}
          style={[styles.backgroundImage, styles.topImage]}
        />
        <Image
          source={LocalIcons.pngIconSet.loginBottomImage}
          style={[styles.backgroundImage, styles.bottomImage]}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}>
          <View style={styles.welcomeMainContainer}>
            <View style={styles.welcome}>
              <Text style={styles.welcomeText}>Choose your community</Text>
            </View>
          </View>
          <View style={styles.listContainer}>
            {[...reduxState.user.data].map((community) => {
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  key={community.shortName}
                  onPress={() => {
                    onItemClick(community);
                  }}>
                  <Text style={styles.itemText}>{community.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
      {loader ? (
        <ActivityIndicator toast text="Loading..." animating={true} />
      ) : null}
      <TouchableOpacity
        style={styles.signInContainer}
        onPress={() => goToLogin()}>
        <Text style={styles.signinText}>Back to sign in</Text>
      </TouchableOpacity>
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
    paddingBottom: 50,
  },
  mainContainer: {
    position: 'relative',
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
    height: 50,
  },
  topImage: {
    top: 0,
  },
  bottomImage: {
    bottom: 0,
  },
  welcomeMainContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 4,
    width: '80%',
    alignSelf: 'center',
  },
  itemContainer: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.white,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  itemText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  welcome: {
    top: 80,
    left: 42,
  },
  welcomeText: {
    fontSize: 26,
    color: Colors.white,
  },
  signInContainer: {
    alignSelf: 'center',
    marginVertical: 20,
    // backgroundColor: 'black',
    padding: 15,
    width: '100%',
    bottom: 0,
    position: 'absolute',
  },
  signinText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    color: 'black',
  },
});
