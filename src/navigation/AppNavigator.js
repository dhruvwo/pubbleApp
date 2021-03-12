import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef, isReadyRef} from './RootNavigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

/* Import screen js files */
import Login from '../screens/Login';
import MyTabBar from '../screens/MyTabBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Feed() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Feed Screen</Text>
    </View>
  );
}

function Messages() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Message Screen</Text>
    </View>
  );
}

const tabs = [
  {
    name: 'QuickPay',
    component: Feed,
  },
  {
    name: 'Products',
    component: Messages,
  },
];

function BottomTab() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      tabBarOptions={{
        showLabel: false,
      }}>
      {tabs.map((tab) => {
        return (
          <Tab.Screen
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
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Home" component={BottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
