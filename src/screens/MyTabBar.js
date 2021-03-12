import React from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import CustomIconsComponent from '../components/CustomIcons';
import Colors from '../constants/Colors';

export default function MyTabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  function Chat(props) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>{props.name}</Text>
      </View>
    );
  }

  const menuItems = [
    {
      name: 'My Inbox',
      iconName: 'inbox',
      type: 'Octicons',
      component: Chat,
    },
    {
      name: 'Events',
      iconName: 'home',
      component: Chat,
    },
    {
      name: 'Feather',
      iconName: 'bell',
      component: Chat,
    },
  ];

  const styles = StyleSheet.create({
    mainContainer: {
      height: getBottomSpace() + 70,
      backgroundColor: Colors.primary,
      paddingBottom: getBottomSpace(),
    },
    menuItemsContainer: {
      position: 'absolute',
      height: 180,
      width: 70,
      zIndex: 1000,
      backgroundColor: Colors.secondary,
      top: -180,
      borderTopRightRadius: 5,
    },
    innerContainer: {
      flexDirection: 'row',
      height: 70,
    },
    menuContainer: {
      width: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuIconContainer: {
      backgroundColor: Colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      height: 30,
      width: 30,
    },
    menuIcon: {
      padding: 5,
      borderRadius: 8,
      color: '#fff',
      textAlign: 'center',
    },
    devider: {
      borderLeftWidth: 0.5,
      borderLeftColor: '#ffffff',
      marginVertical: 10,
    },
    tabsContainer: {
      flexGrow: 1,
      flexDirection: 'row',
    },
    tabContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    activeTabContainer: {
      backgroundColor: Colors.primaryActive,
      // paddingBottom: getBottomSpace(),
      // marginBottom: -getBottomSpace(),
    },
    tabIcon: {
      marginBottom: 7,
    },
    tabLabel: {
      textAlign: 'center',
      color: '#ffffff',
      fontSize: 13,
    },
  });

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const onPress = (route, isFocused) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.menuItemsContainer}>
        {menuItems.map((item) => {
          return (
            <TouchableOpacity
              style={[styles.tabContainer]}
              key={item.name}
              accessibilityRole="button"
              accessibilityLabel={item.name}
              onPress={() => onPress(item, false)}>
              <CustomIconsComponent
                style={[styles.tabIcon]}
                color={'#ffffff'}
                size={30}
                name={item.type}
                name={item.iconName}
                type={'Entypo'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.menuContainer}>
          <View style={styles.menuIconContainer}>
            <CustomIconsComponent
              type={'Entypo'}
              size={19}
              name="menu"
              style={styles.menuIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.devider} />
        <View style={styles.tabsContainer}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            return (
              <TouchableOpacity
                style={[
                  styles.tabContainer,
                  isFocused ? styles.activeTabContainer : {},
                ]}
                key={route.name}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={route.name}
                onPress={() => onPress(route, isFocused)}>
                <CustomIconsComponent
                  style={[
                    styles.tabIcon,
                    isFocused ? styles.activeTabIcon : {},
                  ]}
                  color={'#ffffff'}
                  size={25}
                  name={route.params.iconName}
                />
                <Text style={styles.tabLabel}>{route.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
