import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import EventDetail from '../components/EventDetail';

import * as _ from 'lodash';
import DiscussInternally from '../components/DiscussInternally';
import EventFaq from '../components/EventFaq';
import EventFilter from '../components/EventFilter';

export default function EventsDetailsScreen(props) {
  const [activeTab, setActiveTab] = useState('detail');
  const [loadedTabs, setLoadedTabs] = useState([activeTab]);
  const rightIcons = [
    {
      name: 'chatbox-ellipses',
      type: 'Ionicons',
      title: 'chat',
    },
    {
      name: 'user-check',
      type: 'FontAwesome5',
      title: 'mods',
    },
    {
      name: 'magnifying-glass',
      type: 'Foundation',
      title: 'search',
    },
    {
      name: 'apps-sharp',
      type: 'Ionicons',
      title: 'detail',
    },
  ];

  useEffect(() => {
    if (activeTab && !loadedTabs.includes(activeTab)) {
      const loadedTabsClone = _.cloneDeep(loadedTabs);
      loadedTabsClone.push(activeTab);
      setLoadedTabs(loadedTabsClone);
    }
  }, [activeTab]);

  function renderHeader() {
    return (
      <View style={styles.headerMainContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.headerLeftIcon}>
          <CustomIconsComponent
            color={'white'}
            name={'arrow-forward-ios'}
            type={'MaterialIcons'}
            size={25}
          />
        </TouchableOpacity>

        <View style={styles.headerRightMainContainer}>
          {rightIcons.map((tab) => {
            const isActive = tab.title === activeTab;
            return (
              <TouchableOpacity
                key={tab.title}
                style={styles.headerRightIcons(isActive)}
                onPress={() => {
                  setActiveTab(tab.title);
                }}>
                <CustomIconsComponent
                  color={isActive ? Colors.white : Colors.primary}
                  name={tab.name}
                  type={tab.type}
                  size={25}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  function renderTabs() {
    return (
      <>
        {loadedTabs.includes('chat') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'chat' ? styles.activeTabData : {},
            ]}>
            <DiscussInternally />
          </View>
        )}
        {loadedTabs.includes('mods') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'mods' ? styles.activeTabData : {},
            ]}>
            <EventFaq />
          </View>
        )}
        {loadedTabs.includes('search') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'search' ? styles.activeTabData : {},
            ]}>
            <EventFilter />
          </View>
        )}
        {loadedTabs.includes('detail') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'detail' ? styles.activeTabData : {},
            ]}>
            <EventDetail />
          </View>
        )}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      {renderHeader()}
      {renderTabs()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  headerMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 4,
  },
  headerLeftIcon: {
    backgroundColor: '#F6C955',
    padding: 5,
    borderRadius: 5,
  },
  headerRightMainContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  headerRightIcons: (isActive) => {
    return {
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: isActive ? Colors.primaryActive : Colors.primaryInactive,
      padding: 5,
      borderRadius: 2,
      marginRight: 10,
    };
  },
  tabData: {
    flex: 0,
    zIndex: -1,
    opacity: 0,
    height: 0,
  },
  activeTabData: {
    flex: 1,
    zIndex: 10,
    opacity: 1,
    height: 'auto',
  },
});
