import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef, isReadyRef} from './RootNavigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

/* Import screen js files */
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import Login from '../screens/Login';
import MyTabBar from '../screens/MyTabBar';
import {Button} from '@ant-design/react-native';
import {useDispatch} from 'react-redux';
import {authAction} from '../store/actions';
import SelectCommunity from '../screens/SelectCommunity';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Chat() {
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

function Events() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Events Screen</Text>
    </View>
  );
}
function TeamChat() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>TeamChat Screen</Text>
    </View>
  );
}

const tabs = [
  {
    name: 'My Inbox',
    type: 'FontAwesome',
    iconName: 'inbox',
    component: Chat,
  },
  {
    name: 'Events',
    iconName: 'broadcast',
    type: 'Octicons',
    component: Events,
  },
  {
    name: 'Team Chat',
    iconName: 'hashtag',
    type: 'FontAwesome5',
    component: TeamChat,
  },
];

function BottomTab() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      {tabs.map((tab) => {
        return (
          <Tab.Screen
            initialParams={{
              iconName: tab.iconName,
              type: tab.type,
            }}
            key={tab.name}
            name={tab.name}
            component={tab.component}
          />
        );
      })}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{headerShown: false, animationEnabled: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SelectCommunity"
          component={SelectCommunity}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Home" component={BottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
