import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  ScrollView,
} from 'react-native';
import {WingBlank, WhiteSpace, InputItem} from '@ant-design/react-native';
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

export default function Events(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth}) => ({
    selectedEvent: auth.selectedEvent,
    community: auth.community,
    user: auth.user,
  }));

  const leftTabs = [
    {
      title: 'New',
    },
    {
      title: 'In Progress',
    },
    {
      title: 'Closed',
    },
  ];
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
  const [activeTab, setActiveTab] = useState(leftTabs[0].title);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [data, setData] = useState();
  const [conts, setCounts] = useState();

  useEffect(() => {
    getCountsData();
    getStreamData();
  }, []);

  async function getCountsData() {
    const params = {
      communityId: reduxState.community.community.id,
      postTypes: 'Q',
      includeAssigned: true,
      includeAuthored: true,
      includeModerated: false,
      includeUnapproved: false,
    };

    const response = await dispatch(eventsAction.getCountsData(params));
    setCounts(response.data);
  }

  async function getStreamData() {
    const params = {
      communityId: reduxState.community.community.id,
      postTypes: 'Q',
      scope: 'all',
      pageSize: pageSize,
      statuses: '10,20,40',
      includeUnapproved: true,
      searchAppIds: 21332,
    };

    const response = await dispatch(eventsAction.getStreamData(params));
    setData(response.data);
    setIsLoading(false);
  }

  function renderItem({item}) {
    return <CardContainer user={reduxState.user} item={item} />;
  }

  function renderFooter() {
    return isLoadMoreLoader ? <LoadMoreLoader /> : <View />;
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
    return isLoading ? <LoadMoreLoader /> : renderNoEventSelected();
  }

  return (
    <SafeAreaView style={styles.safeareaView}>
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
            accessibilityRole={'button'}>
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
          setActiveTab={setActiveTab}
          leftTabs={leftTabs}
          rightTabs={rightTabs}
        />
        <View style={styles.dataContainer}>
          {reduxState.selectedEvent?.id ? (
            <FlatList
              renderItem={renderItem}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmpty}
              data={data}
              keyExtractor={(item) => `${item.id}`}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            renderNoEventSelected()
          )}
        </View>
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
