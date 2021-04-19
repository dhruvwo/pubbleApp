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
import moment from 'moment';
import {pageSize} from '../constants/Default';
import * as _ from 'lodash';
import GifSpinner from '../components/GifSpinner';
import AssignModal from '../components/AssignModal';
import NewAnnouncement from '../components/NewAnnouncement';
import EventFilter from '../components/EventFilter';
import StatusAssignFilter from '../components/StatusAssignFilter';
import CardContainer from '../components/CardContainer';
import AddNewContent from '../components/AddNewContent';

export default function Events(props) {
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
    filterParams: events.filterParams,
    filterStateUpdated: events.filterStateUpdated,
    currentUser: auth?.community?.account,
  }));

  const leftTabs = {
    LQ: [
      {
        title: 'New',
        params: {
          statuses: '10,20,40',
          includeUnapproved: true,
        },
      },
      {
        title: 'In Progress',
        params: {
          statuses: '50,60',
          includeUnapproved: true,
        },
      },
      {
        title: 'Closed',
        params: {
          statuses: '30',
        },
      },
    ],
    BL: [
      {
        title: 'Draft',
        params: {
          statuses: '20,40,30',
          unapprovedOnly: true,
        },
      },
      {
        title: 'Published',
        params: {
          statuses: '20,40,50,60',
          includeUnapproved: false,
        },
      },
      {
        title: 'Trash',
        params: {
          statuses: '0',
        },
      },
    ],
  };
  const rightTabs = [
    {
      title: 'Posts',
      name: 'posts',
      iconType: 'Ionicons',
      iconName: 'newspaper-outline',
      params: {
        postTypes: 'U',
        statuses: '10,20,40,50,60,0,30',
      },
    },
    {
      title: 'polls',
      name: 'polls',
      iconType: 'MaterialCommunityIcons',
      iconName: 'poll-box-outline',
      params: {
        postTypes: 'V',
        statuses: '10,20,40,50,60,0,30',
        sort: 'dateCreated',
      },
    },
  ];
  if (reduxState.selectedEvent.discriminator === 'LQ') {
    rightTabs.unshift({
      title: 'questions',
      name: 'questions',
      iconType: 'FontAwesome',
      iconName: 'question',
      params: {
        statuses: '0,10,20,30,40,50,60',
        postTypes: 'Q',
        searchString: '',
        tags: 'incognito',
      },
    });
  }
  const [inputText, setInputText] = useState('');
  const [active, setActive] = useState([]);
  const [counts, setCounts] = useState({});
  const [activeTab, setActiveTab] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [itemForAssign, setItemForAssign] = useState();
  const [eventActionLoader, setEventActionLoader] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [toggleAddContentModal, setToggleAddContentModal] = useState(false);

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
    if (activeTab.title) {
      setIsLoading(true);
      getStreamData();
    }
  }, [activeTab, reduxState.filterStateUpdated]);

  async function getCountsData() {
    const params = {
      communityId: reduxState.communityId,
      postTypes: 'Q,M',
      appIds: reduxState.selectedEvent.id,
      includeUnapproved: false,
    };
    if (reduxState.selectedEvent.discriminator === 'BL') {
      params.includeDeleted = true;
    }

    const response = await dispatch(eventsAction.getCountsData(params));
    setCounts(response);
  }

  function getCounts() {
    if (reduxState.selectedEvent.discriminator === 'LQ') {
      return {
        0:
          counts.activeCount + counts.assignedCount + counts.unapprovedNewCount,
        1:
          counts.waitingAgentCount +
          counts.waitingVisitorCount +
          counts.unapprovedInProgressCount,
        2: counts.closedCount,
      };
    } else {
      return {
        0: counts.unapprovedNewCount + counts.unapprovedInProgressCount,
        1: counts.activeCount + counts.assignedCount,
        2: counts.deletedCount,
      };
    }
  }

  async function getStreamData(persmsProp = {}) {
    if (!persmsProp.pageNumber || persmsProp.pageNumber === 1) {
      setIsLoading(true);
      setIsLoadMoreLoader(false);
    }
    const params = getParams();
    const response = await dispatch(
      eventsAction.getStreamData({...params, ...persmsProp}),
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

  function getParams() {
    const params = {
      communityId: reduxState.communityId,
      searchAppIds: reduxState.selectedEvent.id,
      scope: 'all',
      pageNumber: 1,
      pageSize: pageSize,
    };
    if (reduxState.selectedEvent.discriminator === 'LQ') {
      params.postTypes = 'Q';
    } else if (reduxState.selectedEvent.discriminator === 'BL') {
      params.postTypes = 'Q,M';
      params.sort = 'datePublishedDesc';
    }
    const sendParams = {
      ...params,
      ...activeTab.params,
    };
    if (reduxState.filterParams[activeTab.title]?.status) {
      if (reduxState.filterParams[activeTab.title].status === 'Approved') {
        sendParams.includeUnapproved = false;
      } else {
        delete sendParams.includeUnapproved;
        sendParams.unapprovedOnly = true;
      }
    }
    if (reduxState.filterParams[activeTab.title]?.assign) {
      sendParams.statuses =
        reduxState.filterParams[activeTab.title].assign === 'Assign'
          ? '40'
          : '20';
    }
    if (reduxState.filterParams[activeTab.title]?.wait) {
      sendParams.statuses =
        reduxState.filterParams[activeTab.title].wait ===
        'Waiting for moderator'
          ? '50'
          : '60';
    }
    return sendParams;
  }

  async function onAddingNewAnnouncement(approved, type) {
    if (inputText !== '') {
      setEventActionLoader(true);
      const currentTime = _.cloneDeep(new Date().getTime());
      const params = {
        isTemp: true,
        dateCreated: currentTime,
        lastUpdated: currentTime,
        id: currentTime,
        datePublished: currentTime,
        type,
        appId: reduxState.selectedEvent.id,
        content: inputText,
        communityId: reduxState.communityId,
        postAsVisitor: false,
        internal: false,
        postToType: 'app',
        approved: approved,
      };
      await dispatch(
        eventsAction.addNewAnnouncementFunc(params, 'announcement'),
      );
      setInputText('');
      setEventActionLoader(false);
    } else {
      Alert.alert('Please enter announcement first.');
    }
  }

  async function onAddingPoll(params) {
    setEventActionLoader(true);
    await dispatch(eventsAction.addNewAnnouncementFunc(params, 'poll'));
    setEventActionLoader(false);
  }

  function renderAdd() {
    if (!['Posts', 'Draft', 'Published'].includes(activeTab.title)) {
      if (activeTab.title === 'polls') {
        return (
          <>
            <View style={styles.addContentMainContainer}>
              <TouchableOpacity
                onPress={() => setToggleAddContentModal(true)}
                style={styles.addContentTouchable}>
                <Text style={styles.addContentText}>Add poll</Text>
              </TouchableOpacity>
            </View>
            {toggleAddContentModal ? (
              <AddNewContent
                itemForAssign={toggleAddContentModal}
                onRequestClose={() => onAddContentModalClose()}
                selectedEvent={reduxState.selectedEvent}
                communityId={reduxState.communityId}
                onAddingPoll={onAddingPoll}
                type="AddPoll"
              />
            ) : null}
          </>
        );
      } else if (activeTab.title === 'questions') {
        return (
          <>
            <View style={styles.addContentMainContainer}>
              <TouchableOpacity
                onPress={() => setToggleAddContentModal(true)}
                style={styles.addContentTouchable}>
                <Text style={styles.addContentText}>Add Question</Text>
              </TouchableOpacity>
            </View>
            {toggleAddContentModal ? (
              <AddNewContent
                itemForAssign={toggleAddContentModal}
                onRequestClose={() => onAddContentModalClose()}
                selectedEvent={reduxState.selectedEvent}
                communityId={reduxState.communityId}
                currentUser={reduxState.currentUser}
                usersCollection={reduxState.usersCollection}
                onAddingPoll={onAddingPoll}
                type="AddQuestion"
              />
            ) : null}
          </>
        );
      } else {
        return null;
      }
    }
    if (['Posts'].includes(activeTab.title)) {
      return (
        <NewAnnouncement
          inputText={inputText}
          setInputText={(value) => setInputText(value)}
          setEventActionLoader={setEventActionLoader}
          title={'Create a new update/announcement'}
          placeholder={'Add new announcement...'}
          onAddClick={(approved) => onAddingNewAnnouncement(approved, 'U')}
        />
      );
    } else {
      return (
        <NewAnnouncement
          inputText={inputText}
          setInputText={(value) => setInputText(value)}
          setEventActionLoader={setEventActionLoader}
          title={'Create a new post'}
          placeholder={'Add new live blog post here...'}
          onAddClick={(approved) => onAddingNewAnnouncement(approved, 'M')}
        />
      );
    }
  }

  function renderItem({item}) {
    return (
      <CardContainer
        user={reduxState.user}
        item={item}
        navigation={props.navigation}
        activeTab={activeTab}
        onAssignPress={() => onAssignPress(item)}
        setEventActionLoader={setEventActionLoader}
      />
    );
  }

  function renderFooter() {
    if (!reduxState.stream.length) {
      return null;
    }
    return !isLoadMoreLoader &&
      reduxState.totalStream <= reduxState.stream.length ? (
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

  function onAddContentModalClose() {
    setToggleAddContentModal(false);
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
            onPress={() => setFilterModal(true)}
            accessibilityRole={'button'}>
            <CustomIconsComponent
              color={'white'}
              name={'magnifying-glass'}
              type={'Foundation'}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moreContainer}
            accessible={true}
            accessibilityLabel={'more'}
            onPress={() => props.navigation.navigate('EventsDetailsScreen')}
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
        {['New', 'In Progress', 'Closed'].includes(activeTab.title) ? (
          <StatusAssignFilter activeTab={activeTab} />
        ) : null}
        {isLoading ? (
          <GifSpinner />
        ) : (
          <View style={styles.dataContainer}>
            {reduxState.selectedEvent?.id ? (
              <>
                <FlatList
                  ListHeaderComponent={renderAdd()}
                  renderItem={renderItem}
                  ListFooterComponent={renderFooter()}
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

  addContentMainContainer: {
    alignItems: 'center',
  },
  addContentTouchable: {
    backgroundColor: Colors.secondary,
    padding: 10,
  },
  addContentText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
