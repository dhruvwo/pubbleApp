import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomIconsComponent from '../components/CustomIcons';

import * as _ from 'lodash';
import VisitorComponent from '../components/VisitorComponent';
import ActivitiesComponent from '../components/ActivitiesComponent';
import {useSelector} from 'react-redux';
import EventFaq from '../components/EventFaq';

export default function ChatMenu(props) {
  const {data} = props.route.params;
  const reduxState = useSelector(({events}) => ({
    stream: events?.stream,
  }));

  const [activeTab, setActiveTab] = useState('Visitor');
  const [loadedTabs, setLoadedTabs] = useState([activeTab]);
  const [currentChat, setCurrentChat] = useState(data);

  const rightTabs = [
    {
      title: 'Chat',
      iconType: 'Ionicons',
      iconName: 'chatbox',
    },
    // {
    //   title: 'FAQ',
    //   iconType: 'FontAwesome',
    //   iconName: 'puzzle-piece',
    // },
    {
      title: 'Activities',
      iconType: 'FontAwesome',
      iconName: 'history',
    },
    {
      title: 'Visitor',
      iconType: 'AntDesign',
      iconName: 'contacts',
    },
  ];
  useEffect(() => {
    if (reduxState.stream && reduxState.stream.length) {
      const index = reduxState.stream.findIndex((o) => o.id === data.id);
      if (reduxState.stream[index]) {
        setCurrentChat(reduxState.stream[index]);
      }
    }
  }, [reduxState.stream]);

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
          {rightTabs.map((tab) => {
            const isActive = activeTab === tab.title;
            return (
              <TouchableOpacity
                key={tab.title}
                onPress={() => setActiveTab(tab.title)}
                style={styles.rightIconContainer(isActive)}>
                <CustomIconsComponent
                  color={isActive ? Colors.white : Colors.primary}
                  name={tab.iconName}
                  type={tab.iconType}
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
        {loadedTabs.includes('Visitor') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'Visitor' ? styles.activeTabData : {},
            ]}>
            <VisitorComponent data={currentChat} />
          </View>
        )}
        {loadedTabs.includes('Activities') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'Activities' ? styles.activeTabData : {},
            ]}>
            <ActivitiesComponent data={currentChat} />
          </View>
        )}
        {/* {loadedTabs.includes('FAQ') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'FAQ' ? styles.activeTabData : {},
            ]}>
            <EventFaq data={currentChat} />
          </View>
        )} */}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      {renderHeader()}
      {renderTabs()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  rightIconContainer: (isActive) => {
    return {
      padding: 5,
      backgroundColor: isActive ? Colors.primary : Colors.primaryInactive,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
      borderRadius: 5,
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
