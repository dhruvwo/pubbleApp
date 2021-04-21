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
import TabsContainer from '../components/TabsContainer';
import {collectionsAction, myInboxAction} from '../store/actions';
import CardContainer from '../components/CardContainer';
import {pageSize} from '../constants/Default';
import * as _ from 'lodash';
import GifSpinner from '../components/GifSpinner';
import AssignModal from '../components/AssignModal';
import EventFilter from '../components/EventFilter';
import StatusAssignFilter from '../components/StatusAssignFilter';

export default function MyInboxScreen(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, myInbox, collections, events}) => ({
    communityId: auth?.community?.community?.id || '',
    user: auth?.user,
    stream: myInbox?.stream,
    totalStream: myInbox?.totalStream,
    currentPage: myInbox?.currentPage,
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
    selectedTagFilter: myInbox?.selectedTagFilter,
    searchFilter: myInbox.searchFilter,
    filterParams: myInbox.filterParams,
    filterStateUpdated: myInbox.filterStateUpdated,
  }));

  const leftTabs = [
    {
      title: 'New',
      params: {
        statuses: '10,20,40',
        includeUnapproved: true,
        postTypes: 'Q',
        // searchConversationIds: 'da9b6cd52dd649d0994935182787efe5',
        includeAssigned: true,
        includeAuthored: true,
        includeModerated: false,
        includeCookieId: false,
      },
    },
    {
      title: 'In Progress',
      params: {
        statuses: '50,60',
        includeUnapproved: true,
        postTypes: 'Q',
        // searchConversationIds: 'da9b6cd52dd649d0994935182787efe5',
        includeAssigned: true,
        includeAuthored: true,
        includeModerated: false,
        includeCookieId: false,
      },
    },
    {
      title: 'Closed',
      params: {
        statuses: '30',
        postTypes: 'Q',
        // searchConversationIds: 'da9b6cd52dd649d0994935182787efe5',
        statuses: 30,
        includeAssigned: true,
        includeAuthored: true,
        includeModerated: false,
        includeCookieId: false,
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
        includeModerated: false,
        includeStarred: true,
        includeCookieId: false,
      },
    },
  ];
  const [counts, setCounts] = useState({});
  const [activeTab, setActiveTab] = useState(leftTabs[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [itemForAssign, setItemForAssign] = useState();
  const [eventActionLoader, setEventActionLoader] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    getCountsData();
  }, []);

  useEffect(() => {
    if (activeTab) {
      setIsLoading(true);
      getStreamData();
    }
  }, [activeTab, reduxState.filterStateUpdated]);

  async function getCountsData() {
    const params = {
      communityId: reduxState.communityId,
      postTypes: 'Q',
      includeAssigned: true,
      includeAuthored: true,
      includeModerated: false,
      includeUnapproved: false,
    };
    const response = await dispatch(myInboxAction.getCountsData(params));
    setCounts(response);
  }

  function getCounts() {
    return {
      0: counts.unapprovedNewCount + counts.activeCount + counts.assignedCount,
      1:
        counts.waitingAgentCount +
        counts.waitingVisitorCount +
        counts.unapprovedInProgressCount,
      2: counts.closedCount,
    };
  }

  async function getStreamData(persmsProp = {}) {
    if (!persmsProp.pageNumber || persmsProp.pageNumber === 1) {
      setIsLoading(true);
      setIsLoadMoreLoader(false);
    }
    const params = getparams();
    const response = await dispatch(
      myInboxAction.getStreamData({...params, ...persmsProp}),
    );
    if (response?.data?.length) {
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
      scope: 'all',
      pageNumber: 1,
      pageSize: pageSize,
      postTypes: 'Q,M',
      statuses: '0,10,20,30,40,50,60',
    };
    let sendParams = {
      ...params,
      ...activeTab.params,
    };

    if (reduxState.searchFilter) {
      const searchParams = {
        searchString: reduxState.searchFilter,
        statuses: '0,10,20,30,40,50,60',
      };
      sendParams = {...sendParams, ...searchParams};
      return sendParams;
    } else if (reduxState.selectedTagFilter?.length) {
      let tagString = '';
      reduxState.selectedTagFilter.length &&
        reduxState.selectedTagFilter.forEach((item, index) => {
          tagString = tagString + item;
          if (index < reduxState.selectedTagFilter.length - 1) {
            tagString = tagString + ',';
          }
        });
      const tagParams = {
        searchString: '',
        tags: tagString,
        statuses: '0,10,20,30,40,50,60',
      };
      sendParams = {...sendParams, ...tagParams};
      return sendParams;
    }
    if (
      reduxState.filterParams[activeTab.title]?.assign &&
      reduxState.filterParams[activeTab.title].assign !== ''
    ) {
      if (activeTab.title === 'New') {
        sendParams.statuses =
          reduxState.filterParams[activeTab.title].assign === 'Assign'
            ? '40'
            : '20';
      }
    } else if (
      activeTab.title === 'In Progress' &&
      reduxState.filterParams[activeTab.title].wait !== ''
    ) {
      sendParams.statuses =
        reduxState.filterParams[activeTab.title].wait ===
        'Waiting for moderator'
          ? '50'
          : '60';
    }
    return sendParams;
  }

  function renderItem({item}) {
    return (
      <CardContainer
        isMyIndex={true}
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
    if (!reduxState.stream?.length) {
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
    await dispatch(myInboxAction.setFilterData({type: 'tag', data: []}));
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
            <Text style={styles.eventText(true)}>My Messages</Text>
            <Text style={styles.eventText(false)}>
              (
              {counts.unapprovedNewCount +
                counts.activeCount +
                counts.assignedCount +
                counts.waitingAgentCount +
                counts.waitingVisitorCount +
                counts.unapprovedInProgressCount}
              ) Conversations
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
            leftTabs={leftTabs}
            counts={getCounts()}
            rightTabs={rightTabs}
            selectedTagFilter={reduxState.selectedTagFilter}
            onClearTagFilter={onClearTagFilter}
            searchString={reduxState.searchFilter}
          />
        ) : null}
        {['New', 'In Progress'].includes(activeTab.title) &&
        reduxState.selectedTagFilter?.length === 0 &&
        !reduxState.searchFilter ? (
          <StatusAssignFilter isMyInbox={true} activeTab={activeTab} />
        ) : null}
        {isLoading ? (
          <GifSpinner />
        ) : (
          <View style={styles.dataContainer}>
            <FlatList
              renderItem={renderItem}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmpty}
              onMomentumScrollEnd={onMomentumScrollEnd}
              data={reduxState.stream}
              keyExtractor={(item) => `${item.id}`}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>
        )}
      </View>
      {itemForAssign?.id ? (
        <AssignModal
          isMyInbox={true}
          itemForAssign={itemForAssign}
          onRequestClose={() => onAssignClose()}
        />
      ) : null}
      {filterModal ? (
        <EventFilter
          isInboxFilter={true}
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
  eventText: (condition) => ({
    fontSize: condition ? 16 : 15,
    fontWeight: condition ? '700' : null,
    color: 'white',
  }),
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
