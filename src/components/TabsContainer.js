import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Colors from '../constants/Colors';
import {useDispatch} from 'react-redux';
import CustomIconsComponent from '../components/CustomIcons';

export default function TabsContainer({
  activeTab,
  setActiveTab,
  leftTabs,
  rightTabs,
}) {
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  return (
    <View style={styles.subHeaderContainer}>
      <View style={styles.subHeaderLeftContainer}>
        {leftTabs.map((tab, i) => {
          const isActive = tab.title === activeTab;
          return (
            <React.Fragment key={tab.title}>
              <TouchableOpacity
                style={[
                  styles.itemContainer,
                  isActive && styles.itemContainerActive,
                  {
                    paddingLeft: i === 0 ? 5 : 30,
                    marginLeft: i === 0 ? 0 : -15,
                    marginRight: leftTabs.length !== i + 1 ? 15 : 0,
                    zIndex: 100 - i,
                  },
                ]}
                onPress={() => {
                  setActiveTab(tab.title);
                }}>
                <Text
                  style={[styles.itemText, isActive && styles.itemTextActive]}>
                  {tab.count || 0} {isActive && activeTab}
                </Text>
                {leftTabs.length !== i + 1 && (
                  <View style={styles.arrowStyle}>
                    <CustomIconsComponent
                      name={'caretright'}
                      type={'AntDesign'}
                      size={50}
                      color={
                        isActive ? Colors.secondary : Colors.primaryInactive
                      }
                    />
                  </View>
                )}
                {leftTabs.length !== i + 1 && (
                  <View style={[styles.arrowStyle, styles.arrowStyleWhite]}>
                    <CustomIconsComponent
                      name={'caretright'}
                      type={'AntDesign'}
                      size={50}
                      color={'white'}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
      {rightTabs && (
        <View style={styles.rightTabsContainer}>
          {rightTabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => {
                  setActiveTab(tab.name);
                }}
                style={[
                  styles.rightButton,
                  isActive && styles.rightButtonActive,
                ]}>
                <CustomIconsComponent
                  type={tab.iconType}
                  name={tab.iconName}
                  size={25}
                  color={isActive ? 'white' : Colors.primaryText}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subHeaderContainer: {
    backgroundColor: 'white',
    height: 55,
    width: '100%',
    flexDirection: 'row',
    padding: 12,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 4,
    zIndex: 2,
  },
  subHeaderLeftContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 32,
  },
  itemContainer: {
    backgroundColor: Colors.primaryInactive,
    paddingVertical: 5,
    paddingHorizontal: 8,
    height: 32,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    minWidth: 30,
    flexGrow: 1,
    flexShrink: 1,
  },
  itemContainerActive: {
    backgroundColor: Colors.secondary,
  },
  itemText: {
    color: Colors.primaryText,
  },
  itemTextActive: {
    color: Colors.white,
  },
  arrowStyle: {
    marginLeft: -20,
    zIndex: 1000,
    position: 'absolute',
    right: -20,
  },
  arrowStyleWhite: {
    marginLeft: -25,
    zIndex: 1,
    right: -25,
  },
  rightTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightButton: {
    height: 32,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryInactive,
    marginHorizontal: 3,
  },
  rightButtonActive: {
    backgroundColor: Colors.secondary,
  },
});
