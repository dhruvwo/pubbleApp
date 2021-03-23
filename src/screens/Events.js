import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from 'react-native';
import {WingBlank} from '@ant-design/react-native';
import Colors from '../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import CustomIconsComponent from '../components/CustomIcons';
import GlobalStyles from '../constants/GlobalStyles';
import TabsContainer from '../components/TabsContainer';
import {eventsAction} from '../store/actions';
import LoadMoreLoader from '../components/LoadMoreLoader';
import CardContainer from '../components/CardContainer';
import moment from 'moment';
import {pageSize} from '../constants/Default';
import * as _ from 'lodash';
import GifSpinner from '../components/GifSpinner';

export default function Events(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, events}) => ({
    selectedEvent: auth.selectedEvent,
    community: auth.community,
    user: auth.user,
    stream: events.stream,
    totalStream: events.totalStream,
  }));

  const rightTabs = [
    {
      name: 'questions',
      iconType: 'FontAwesome',
      iconName: 'question',
    },
    {
      name: 'posts',
      iconType: 'Ionicons',
      iconName: 'newspaper-outline',
    },
    {
      name: 'polls',
      iconType: 'MaterialCommunityIcons',
      iconName: 'poll-box-outline',
    },
  ];
  const [active, setActive] = useState([]);
  const [activeTab, setActiveTab] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [conts, setCounts] = useState();

  useEffect(() => {
    setIsLoading(true);
    let tabs;
    if (reduxState.selectedEvent.discriminator === 'LQ') {
      tabs = [
        {
          title: 'New',
          count: 0,
        },
        {
          title: 'In Progress',
          count: 0,
        },
        {
          title: 'Closed',
          count: 0,
        },
      ];
    } else {
      tabs = [
        {
          title: 'Draft',
          count: 0,
        },
        {
          title: 'Published',
          count: 0,
        },
        {
          title: 'Trash',
          count: 0,
        },
      ];
    }

    setActive(tabs);
    setActiveTab(tabs[0].title);

    getCountsData();
    getStreamData();
  }, [reduxState.selectedEvent]);

  async function getCountsData() {
    const params = {
      communityId: reduxState.community.community.id,
      postTypes: 'Q,M',
      appIds: reduxState.selectedEvent.id,
      includeUnapproved: false,
      includeDeleted: true,
      /* includeAssigned: true,
      includeAuthored: true,
      includeModerated: false,
      includeUnapproved: false, */
    };

    const response = await dispatch(eventsAction.getCountsData(params));

    let tabs;
    if (reduxState.selectedEvent.discriminator === 'LQ') {
      tabs = [
        {
          title: 'New',
          count:
            response.unapprovedNewCount +
            response.activeCount +
            response.assignedCount,
        },
        {
          title: 'In Progress',
          count:
            response.waitingAgentCount +
            response.waitingVisitorCount +
            response.unapprovedInProgressCount,
        },
        {
          title: 'Closed',
          count: response.closedCount,
        },
      ];
    } else {
      tabs = [
        {
          title: 'Draft',
          count:
            response.unapprovedNewCount + response.unapprovedInProgressCount,
        },
        {
          title: 'Published',
          count:
            response.activeCount +
            response.assignedCount +
            response.waitingAgentCount +
            response.waitingVisitorCount,
        },
        {
          title: 'Trash',
          count: response.deletedCount,
        },
      ];
    }

    await setActive(tabs);
    await setActiveTab(tabs[0].title);
    setCounts(response.data);
  }

  async function getStreamData() {
    const params = {
      communityId: reduxState.community.community.id,
      postTypes: reduxState.selectedEvent.discriminator === 'LQ' ? 'Q' : 'M',
      scope: 'all',
      pageSize: pageSize,
      statuses:
        reduxState.selectedEvent.discriminator === 'LQ'
          ? '10,20,40'
          : '20,40,30',
      includeUnapproved: true,
      searchAppIds: reduxState.selectedEvent.id,
    };

    await dispatch(eventsAction.getStreamData(params));
    setIsLoading(false);
  }

  const changeTabs = async (tabTitle) => {
    setIsLoading(true);

    setIsLoadMoreLoader(false);
    setActiveTab(tabTitle);

    let status = '';
    if (reduxState.selectedEvent.discriminator === 'LQ') {
      if (tabTitle === 'New') {
        status = '10,20,40';
      }
      if (tabTitle === 'In Progress') {
        status = '50,60';
      }
      if (tabTitle === 'Closed') {
        status = '30';
      }
    } else {
      if (tabTitle === 'Draft') {
        status = '20,40,30';
      }
      if (tabTitle === 'Published') {
        status = '20,40,50,60';
      }
      if (tabTitle === 'Trash') {
        status = '0';
      }
    }

    const params = {
      communityId: reduxState.community.community.id,
      postTypes: reduxState.selectedEvent.discriminator === 'LQ' ? 'Q' : 'M',
      scope: 'all',
      pageSize: pageSize,
      statuses: status,
      includeUnapproved: tabTitle === 'Published' ? false : true,
      searchAppIds: reduxState.selectedEvent.id,
    };

    await dispatch(eventsAction.getStreamData(params));
    setIsLoading(false);
  };

  function renderItem({item}) {
    return <CardContainer user={reduxState.user} item={item} />;
  }

  function renderFooter() {
    if (!reduxState.stream.length) {
      return null;
    }
    return !isLoadMoreLoader &&
      reduxState.totalStream === reduxState.stream.length ? (
      <View>{/* <Text>End of list</Text> */}</View>
    ) : isLoadMoreLoader ? (
      <LoadMoreLoader />
    ) : (
      <TouchableOpacity
        onPress={loadMoredata}
        style={{
          marginTop: 12,
          backgroundColor: Colors.primaryText,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}>
        <Text
          style={{
            color: Colors.white,
            textAlign: 'center',
            fontWeight: '700',
          }}>
          Load More...
        </Text>
      </TouchableOpacity>
    );
  }

  function renderNoEventSelected() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.innerEmptyContainer}>
          <Text style={styles.noteText}>No event stelected</Text>
          <WingBlank style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              Please select an event from the left list.
            </Text>
            <Text style={styles.descriptionText}>
              If the list is empty it means you are not subscribed to any event.
              Please contact your admin or event moderator
            </Text>
          </WingBlank>
          <Text style={styles.noteText}>
            As admin you can view all the events by selecting "Show all events"
            from the bottom of the list on left.
          </Text>
        </View>
      </View>
    );
  }

  function renderEmpty() {
    return isLoading ? (
      <GifSpinner />
    ) : (
      <View style={styles.emptyContainer}>
        <View style={styles.innerEmptyContainer}>
          <Text style={styles.noteText}>No records found.</Text>
        </View>
      </View>
    );
  }

  function loadMoredata() {
    setIsLoadMoreLoader(true);
    console.log('end called');
  }

  function onMomentumScrollEnd({nativeEvent}) {
    if (
      !isLoadMoreLoader &&
      reduxState.totalStream > reduxState.stream.length &&
      nativeEvent.contentSize.height -
        (nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height) <=
        400
    ) {
      loadMoredata();
    }
  }

  return (
    <SafeAreaView style={styles.safeareaView}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {reduxState.selectedEvent && (
            <TouchableOpacity
              style={styles.eventDateContainer}
              accessibilityLabel={'change event'}
              accessibilityHint={'open event list'}
              accessibilityRole={'button'}
              onPress={() => props.navigation.navigate('EventsFilter')}>
              <CustomIconsComponent
                color={Colors.secondary}
                name={'caret-down-circle'}
                size={45}
              />
              <View style={styles.dateContainer}>
                <Text accessible={true} style={styles.dayContainer}>
                  {moment(reduxState.selectedEvent.startDate).format('D')}
                </Text>
                <Text style={styles.monthContainer}>
                  {moment(reduxState.selectedEvent.startDate).format('MMM')}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={[GlobalStyles.devider, styles.devider]} />
          <View style={styles.eventHeaderContainer}>
            <Text style={styles.eventText}>
              {reduxState.selectedEvent.name}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.moreContainer}
            accessible={true}
            accessibilityLabel={'more'}
            accessibilityRole={'button'}
            onPress={() => props.navigation.navigate('EventsDetailsScreen')}>
            <CustomIconsComponent
              color={'white'}
              name={'more-vertical'}
              type={'Feather'}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <TabsContainer
          activeTab={activeTab}
          setActiveTab={changeTabs}
          leftTabs={active}
          rightTabs={rightTabs}
        />
        {isLoading ? (
          <GifSpinner />
        ) : (
          <View style={styles.dataContainer}>
            {reduxState.selectedEvent?.id ? (
              <FlatList
                renderItem={renderItem}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onMomentumScrollEnd={onMomentumScrollEnd}
                data={reduxState.stream}
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={styles.flatListContainer}
              />
            ) : (
              renderNoEventSelected()
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeareaView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 54,
    width: '100%',
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDateContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  devider: {
    height: 36,
  },
  dateContainer: {
    marginLeft: 5,
    justifyContent: 'center',
  },
  dayContainer: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monthContainer: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  eventHeaderContainer: {
    paddingHorizontal: 12,
    flexGrow: 1,
    flexShrink: 1,
  },
  eventText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  moreContainer: {
    paddingHorizontal: 12,
  },
  iconContainer: {
    backgroundColor: Colors.secondary,
    width: 36,
    height: 36,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 44,
  },
  dataContainer: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  flatListContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  emptyContainer: {
    flex: 1,
  },
  innerEmptyContainer: {
    alignSelf: 'center',
    margin: 30,
  },
  descriptionContainer: {
    paddingVertical: 10,
  },
  noteText: {
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '700',
  },
  descriptionText: {
    color: Colors.primary,
    textAlign: 'center',
  },
});
