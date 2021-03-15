import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import CustomIconsComponent from '../components/CustomIcons';
import Colors from '../constants/Colors';
import GlobalStyles from '../constants/GlobalStyles';

const {width, height} = Dimensions.get('window');

export default function MyTabBar({state, descriptors, navigation}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  const menuItems = [
    {
      iconName: 'home',
      type: 'Ionicons',
    },
    {
      iconName: 'puzzle-piece',
      type: 'FontAwesome',
    },
    {
      iconName: 'bell',
      type: 'Entypo',
    },
  ];

  const styles = StyleSheet.create({
    mainContainer: {
      height: getBottomSpace() + 70,
      backgroundColor: Colors.primary,
      paddingBottom: getBottomSpace(),
    },
    backdrop: {
      backgroundColor: 'transparent',
      height: height,
      top: -height,
      width: width,
      position: 'absolute',
    },
    menuItemsContainer: {
      position: 'absolute',
      height: 180,
      width: 70,
      zIndex: 1000,
      backgroundColor: Colors.secondary,
      top: -180,
      borderTopRightRadius: 10,
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

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function renderMenu() {
    return (
      isMenuOpen && (
        <>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="menu"
            onPress={() => {
              setIsMenuOpen(false);
            }}
            style={styles.backdrop}
          />
          <View style={styles.menuItemsContainer}>
            {menuItems.map((item) => {
              return (
                <TouchableOpacity
                  style={[styles.tabContainer]}
                  key={item.iconName}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={item.iconName}
                  onPress={() => setIsMenuOpen(false)}>
                  <CustomIconsComponent
                    style={[styles.tabIcon]}
                    color={'#ffffff'}
                    size={30}
                    type={item.type}
                    name={item.iconName}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )
    );
  }

  return (
    <View style={styles.mainContainer}>
      {renderMenu()}
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.menuContainer}
          onPress={() => {
            toggleMenu();
          }}>
          <View style={styles.menuIconContainer}>
            <CustomIconsComponent
              type={'Entypo'}
              size={19}
              name="menu"
              style={styles.menuIcon}
            />
          </View>
        </TouchableOpacity>
        <View style={GlobalStyles.devider} />
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
                accessible={true}
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
                  type={route.params.type}
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
