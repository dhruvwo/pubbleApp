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
import {WingBlank, ActivityIndicator} from '@ant-design/react-native';
import Colors from '../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import CustomIconsComponent from '../components/CustomIcons';
import GlobalStyles from '../constants/GlobalStyles';
import TabsContainer from '../components/TabsContainer';
import {collectionsAction, eventsAction} from '../store/actions';
import CardContainer from '../components/CardContainer';
import moment from 'moment';
import {pageSize} from '../constants/Default';
import * as _ from 'lodash';
import GifSpinner from '../components/GifSpinner';
import EventPollCard from '../components/EventPollCard';
import AssignModal from '../components/AssignModal';
import AnnouncementCard from '../components/AnnouncementCard';
import NewAnnouncement from '../components/NewAnnouncement';
import EventFilter from '../components/EventFilter';

export default function MyInboxScreen(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, events, collections}) => ({
    selectedEvent: auth?.selectedEvent,
    communityId: auth?.community?.community?.id || '',
    user: auth?.user,
    stream: events?.stream,
    totalStream: events?.totalStream,
    currentPage: events?.currentPage,
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
    selectedTagFilter: events.selectedTagFilter,
  }));

  const leftTabs = [
    {
      title: 'New',
      params: {
        statuses: '10,20,40',
        includeUnapproved: true,
        postTypes: 'Q',
        scope: 'all',
        includeAssigned: true,
        includeAuthored: true,
      },
    },
    {
      title: 'In Progress',
      params: {
        statuses: '50,60',
        includeUnapproved: true,
        postTypes: 'Q',
        includeAssigned: true,
        includeAuthored: true,
      },
    },
    {
      title: 'Closed',
      params: {
        statuses: '30',
        postTypes: 'Q',
        pageSize: 20,
        statuses: 30,
        includeAssigned: true,
        includeAuthored: true,
      },
    },
  ];
  const rightTabs = [
    {
      title: 'star',
      name: 'star',
      iconType: 'AntDesign',
      iconName: 'star',
      params: {
        postTypes: 'Q, M',
        includeAssigned: false,
        includeAuthored: false,
        includeStarred: true,
      },
    },
  ];
  const [active, setActive] = useState([]);
  const [counts, setCounts] = useState({});
  const [activeTab, setActiveTab] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [itemForAssign, setItemForAssign] = useState();
  const [eventActionLoader, setEventActionLoader] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  useEffect(() => {
    if (reduxState.selectedEvent) {
      getCountsData();
      if (leftTabs[reduxState.selectedEvent.discriminator]) {
        setActive(leftTabs[reduxState.selectedEvent.discriminator]);
        if (leftTabs[reduxState.selectedEvent.discriminator][0]) {
          setActiveTab(leftTabs[reduxState.selectedEvent.discriminator][0]);
        }
      }
    }
  }, [reduxState.selectedEvent]);

  useEffect(() => {
    if (activeTab) {
      setIsLoading(true);
      getStreamData();
    }
  }, [activeTab]);

  async function getCountsData() {
    const params = {
      communityId: reduxState.communityId,
      postTypes: 'Q,M',
      includeUnapproved: false,
      appIds: reduxState.selectedEvent.id,
    };
    const response = await dispatch(eventsAction.getCountsData(params));
    setCounts(response);
  }

  function getCounts() {
    if (reduxState.selectedEvent.discriminator === 'LQ') {
      return {
        0: counts.activeCount + counts.assignedCount,
        1:
          counts.waitingAgentCount +
          counts.waitingVisitorCount +
          counts.unapprovedInProgressCount,
        2: counts.closedCount,
      };
    } else {
      return {
        0: counts.unapprovedNewCount + counts.unapprovedInProgressCount,
        1:
          counts.unapprovedInProgressCount +
          counts.waitingAgentCount +
          counts.waitingVisitorCount,
        2: counts.deletedCount,
      };
    }
  }

  async function getStreamData(persmsProp = {}) {
    if (!persmsProp.pageNumber || persmsProp.pageNumber === 1) {
      setIsLoading(true);
      setIsLoadMoreLoader(false);
    }
    const params = getparams();
    const response = await dispatch(
      eventsAction.getStreamData({...params, ...persmsProp}, 'inbox'),
    );
    if (response?.data?.length && reduxState.selectedEvent.discriminator) {
      const accountIds = [];
      const appIds = [];
      response.data.forEach((data) => {
        if (data.assignees?.length) {
          data.assignees.forEach((assignee) => {
            if (assignee.type === 'app') {
              if (
                !(
                  assignee.id &&
                  reduxState.groupsCollection &&
                  reduxState.groupsCollection[assignee.id]
                )
              ) {
                appIds.push(assignee.id);
              }
            } else if (assignee.type === 'account') {
              if (
                !(
                  assignee.id &&
                  reduxState.usersCollection &&
                  reduxState.usersCollection[assignee.id]
                )
              ) {
                accountIds.push(assignee.id);
              }
            }
          });
        }
      });
      if (accountIds?.length) {
        dispatch(
          collectionsAction.getDirectoryData({
            accountIds,
            communityId: reduxState.communityId,
          }),
        );
      }
      if (appIds?.length) {
        dispatch(
          collectionsAction.getDirectoryData({
            appIds,
            communityId: reduxState.communityId,
          }),
        );
      }
    }

    setIsLoading(false);
  }

  function onAssignPress(item) {
    setItemForAssign(item);
  }

  function getparams() {
    const params = {
      communityId: reduxState.communityId,
      searchAppIds: reduxState.selectedEvent.id,
      scope: 'all',
      pageNumber: 1,
      pageSize: pageSize,
      includeModerated: false,
      includeCookieId: false,
    };
    if (reduxState.selectedEvent.discriminator === 'LQ') {
      params.postTypes = 'Q';
    } else if (reduxState.selectedEvent.discriminator === 'BL') {
      params.postTypes = 'Q,M';
      params.sort = 'datePublishedDesc';
    }
    return {...params, ...activeTab.params};
  }

  function renderItem({item}) {
    if (item.type === 'Q' || item.type === 'M') {
      return (
        <CardContainer
          user={reduxState.user}
          item={item}
          onPressCard={() =>
            props.navigation.navigate('ChatScreen', {data: item})
          }
          activeTab={activeTab}
          onAssignPress={() => onAssignPress(item)}
          setEventActionLoader={setEventActionLoader}
        />
      );
    } else if (item.type === 'V') {
      return (
        <EventPollCard
          user={reduxState.user}
          item={item}
          setEventActionLoader={setEventActionLoader}
        />
      );
    } else if (item.type === 'U') {
      return (
        <AnnouncementCard
          user={reduxState.user}
          item={item}
          onPressCard={() =>
            props.navigation.navigate('ChatScreen', {data: item})
          }
          activeTab={activeTab}
          onAssignPress={() => onAssignPress(item)}
          setEventActionLoader={setEventActionLoader}
        />
      );
    }
  }

  function renderFooter() {
    if (!reduxState.stream.length) {
      return null;
    }
    return !isLoadMoreLoader &&
      reduxState.totalStream === reduxState.stream.length ? (
      <View>
        <Text
          style={{
            textAlign: 'center',
            margin: 12,
          }}>
          End of list
        </Text>
      </View>
    ) : (
      <GifSpinner />
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

  async function loadMoredata() {
    setIsLoadMoreLoader(true);
    if (reduxState.totalStream > reduxState.stream.length) {
      await getStreamData({pageNumber: reduxState.currentPage + 1});
    }
    setIsLoadMoreLoader(false);
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

  function onAssignClose() {
    setItemForAssign({});
  }

  function onFilterModalClose() {
    setFilterModal(false);
  }

  async function onClearTagFilter() {
    await dispatch(eventsAction.selectedTagFilterOption(null));
    setIsLoading(true);
    getStreamData();
  }

  return (
    <SafeAreaView style={styles.safeareaView}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.container}>
        {eventActionLoader ? (
          <ActivityIndicator toast text="Loading..." animating={true} />
        ) : null}
        <View style={styles.headerContainer}>
          <View style={styles.eventHeaderContainer}>
            <Text style={styles.eventText}>My MESSAGES</Text>
          </View>
          <TouchableOpacity
            style={styles.moreContainer}
            accessible={true}
            accessibilityLabel={'more'}
            onPress={() => props.navigation.navigate('InboxDetailsScreen')}
            accessibilityRole={'button'}>
            <CustomIconsComponent
              color={'white'}
              name={'more-vertical'}
              type={'Feather'}
              size={25}
            />
          </TouchableOpacity>
        </View>
        {!_.isEmpty(activeTab) ? (
          <TabsContainer
            activeTab={activeTab}
            setActiveTab={(activeTab) => setActiveTab(activeTab)}
            leftTabs={active}
            counts={getCounts()}
            rightTabs={rightTabs}
            selectedTagFilter={reduxState.selectedTagFilter}
            onClearTagFilter={onClearTagFilter}
          />
        ) : null}
        {isLoading ? (
          <GifSpinner />
        ) : (
          <View style={styles.dataContainer}>
            {reduxState.selectedEvent?.id ? (
              <>
                <FlatList
                  ListHeaderComponent={
                    activeTab.title === 'Posts' && (
                      <NewAnnouncement
                        setEventActionLoader={setEventActionLoader}
                      />
                    )
                  }
                  renderItem={renderItem}
                  ListFooterComponent={renderFooter}
                  ListEmptyComponent={renderEmpty}
                  onMomentumScrollEnd={onMomentumScrollEnd}
                  data={reduxState.stream}
                  keyExtractor={(item) => `${item.id}`}
                  contentContainerStyle={styles.flatListContainer}
                />
              </>
            ) : (
              renderNoEventSelected()
            )}
          </View>
        )}
      </View>
      {itemForAssign?.id ? (
        <AssignModal
          itemForAssign={itemForAssign}
          onRequestClose={() => onAssignClose()}
        />
      ) : null}
      {filterModal ? (
        <EventFilter
          itemForAssign={filterModal}
          onRequestClose={() => onFilterModalClose()}
          getStreamData={getStreamData}
        />
      ) : null}
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
