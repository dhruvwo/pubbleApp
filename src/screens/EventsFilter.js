import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';
import {
  WingBlank,
  WhiteSpace,
  InputItem,
  ActivityIndicator,
} from '@ant-design/react-native';
import Colors from '../constants/Colors';
import {authAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import CustomIconsComponent from '../components/CustomIcons';
import moment from 'moment';
import {Discriminator} from '../constants/Default';
import GlobalStyles from '../constants/GlobalStyles';
import * as _ from 'lodash';

export default function EventFilter(props) {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [loader, setLoader] = useState(false);
  const [eventFilter, setEventFilter] = useState([]);
  const [nextOption, setNextOption] = useState(true);
  const [nextIn60Option, setNextIn60Option] = useState(false);
  const [liveOption, setLiveOption] = useState(true);
  const [overOption, setOverOption] = useState(false);

  const reduxState = useSelector(({auth, events}) => ({
    events: auth.events,
    selectedEvent: auth.events[auth.selectedEventIndex],
    notification: events.notification,
  }));

  const onChangeSearch = (value) => {
    setSearchValue(value);
    if (value !== '') {
      // const getEventsLists = reduxState.events.filter((event) =>
      //   event.name.toLowerCase().includes(value.toLowerCase()),
      // );
      const getEventsLists = [];
      _.forIn(reduxState.events, (item) => {
        if (item.name.toLowerCase().includes(value.toLowerCase())) {
          getEventsLists.push(item);
        }
      });
      setEventFilter(getEventsLists);
    } else {
      const eventFilterData = [];
      Object.keys(reduxState.events).forEach((item, val) => {
        if (
          reduxState.events[item].startDate >= moment().valueOf() ||
          (reduxState.events[item].startDate < moment().valueOf() &&
            reduxState.events[item].endDate >= moment().valueOf())
        ) {
          eventFilterData.push(reduxState.events[item]);
        }
      });
      setEventFilter(eventFilterData);
    }
  };

  const clearSearchInputValue = () => {
    setSearchValue('');
  };

  const navigateToEventList = (eventId) => {
    // const getEvents = eventFilter.find((event) => event.id === eventId);
    const getEvents = reduxState.events[eventId];
    dispatch(authAction.setSelectedEventIndex(getEvents.id));
    props.navigation.goBack();
  };

  const bottomFilterOptionHandler = (val) => {
    const nextDataFilter = [];
    _.forIn(reduxState.events, (item) => {
      if (val === 'next' && item.startDate >= moment().valueOf()) {
        nextDataFilter.push(item);
      }

      if (
        val === 'next60' &&
        item.startDate >= moment().add(60, 'minutes').valueOf()
      ) {
        nextDataFilter.push(item);
      }

      if (
        val === 'live' &&
        item.startDate <= moment().valueOf() &&
        item.endDate >= moment().valueOf()
      ) {
        nextDataFilter.push(item);
      }

      if (val === 'over' && item.endDate < moment().valueOf()) {
        nextDataFilter.push(item);
      }
    });

    const nextEqual = _.isEqual(nextDataFilter, reduxState.events);
    const nextResult = _.pullAll(eventFilter, nextDataFilter);

    if (val === 'next') {
      if (nextOption) {
        setNextOption(!nextOption);
        setEventFilter(
          nextResult.length > 0 ? nextResult : [reduxState.selectedEvent],
        );
      } else {
        if (nextIn60Option) {
          setNextIn60Option(!nextIn60Option);
        }
        setNextOption(!nextOption);
        if (!nextEqual) {
          const finalNextData = _.uniqBy(
            [...eventFilter, ...nextDataFilter],
            'id',
          );
          setEventFilter(finalNextData);
        }
      }
    }

    if (val === 'next60') {
      if (nextIn60Option) {
        setNextIn60Option(!nextIn60Option);
        setEventFilter(
          nextResult.length > 0 ? nextResult : [reduxState.selectedEvent],
        );
      } else {
        if (nextOption) {
          setNextOption(!nextOption);
        }
        setNextIn60Option(!nextIn60Option);

        if (!nextEqual) {
          const finalNext60Data = _.uniqBy(
            [...eventFilter, ...nextDataFilter],
            'id',
          );
          setEventFilter(finalNext60Data);
        }
      }
    }

    if (val === 'live') {
      setLiveOption(!liveOption);
      if (liveOption) {
        setEventFilter(
          nextResult.length > 0 ? nextResult : [reduxState.selectedEvent],
        );
      } else {
        if (!nextEqual) {
          const finalLiveData = _.uniqBy(
            [...eventFilter, ...nextDataFilter],
            'id',
          );
          setEventFilter(finalLiveData);
        }
      }
    }

    if (val === 'over') {
      setOverOption(!overOption);
      if (liveOption) {
        setEventFilter(
          nextResult.length > 0 ? nextResult : [reduxState.selectedEvent],
        );
      } else {
        if (!nextEqual) {
          const finalOverData = _.uniqBy(
            [...eventFilter, ...nextDataFilter],
            'id',
          );
          setEventFilter(finalOverData);
        }
      }
    }
  };

  useEffect(() => {
    if (!nextOption && !nextIn60Option && !liveOption && !overOption) {
      setEventFilter([reduxState.selectedEvent]);
    }
  }, [nextOption, nextIn60Option, liveOption, overOption]);

  useEffect(() => {
    /* setEventFilter(
      reduxState.events.filter(
        (eve) =>
          eve.startDate >= moment().valueOf() ||
          (eve.startDate < moment().valueOf() &&
            eve.endDate >= moment().valueOf()),
      ),
    ); */
    const eventFilterData = [];
    Object.keys(reduxState.events).forEach((item, val) => {
      if (
        reduxState.events[item].startDate >= moment().valueOf() ||
        (reduxState.events[item].startDate < moment().valueOf() &&
          reduxState.events[item].endDate >= moment().valueOf())
      ) {
        eventFilterData.push(reduxState.events[item]);
      }
    });
    setEventFilter(eventFilterData);
  }, [reduxState.events]);

  function renderItem({item}) {
    const notificationCount = reduxState.notification[item.id];
    let totalNotificationCount = [];
    _.forIn(notificationCount, (v, i) => {
      if (v.conversationId.length > 0) {
        totalNotificationCount.push(v.conversationId);
      }
    });
    var eventStartDateDay = moment(item.startDate).format('D');
    var eventStartDateMonth = moment(item.startDate).format('MMM');

    var eventEndDate = moment(item.endDate).format('D MMM');
    return (
      <TouchableOpacity
        onPress={() => navigateToEventList(item.id)}
        style={[
          reduxState.selectedEvent.id === item.id
            ? {
                backgroundColor: '#51C8D0',
                borderRadius: 4,
              }
            : {},
          {
            padding: 12,
          },
        ]}>
        <View style={styles.filterListTopContainer}>
          <View style={styles.filterListTopDateContainer}>
            <Text style={styles.filterListTopDaay}>{eventStartDateDay}</Text>
            <Text style={styles.filterListTopMonth}>{eventStartDateMonth}</Text>

            <View style={styles.filterListBottomStatusContainer}>
              <Text style={styles.filterListBottomStatus}>Live</Text>
            </View>
          </View>

          <View style={[GlobalStyles.devider, styles.devider]} />

          <View style={styles.filterListBottomMainContainer}>
            <View style={styles.filterListBottomDateConainer}>
              <Text style={styles.filterListTopName}>{item.name}</Text>

              {totalNotificationCount?.length > 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors.unapproved,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: '600',
                      }}>
                      {totalNotificationCount?.length}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.filterListBottomDateConainer}>
              <Text style={styles.filterListBottomDate}>
                {`${eventStartDateDay} ${eventStartDateMonth} - ${eventEndDate}`}
              </Text>

              <View style={styles.filterListBottomTagContainer}>
                <Text style={styles.filterListBottomTag}>
                  {Discriminator[item.discriminator]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderFooter() {
    return loader ? (
      <ActivityIndicator toast text="Loading..." animating={true} />
    ) : (
      <View />
    );
  }

  function renderEmpty() {
    return loader ? (
      <ActivityIndicator toast text="Loading..." animating={true} />
    ) : (
      <WingBlank>
        <View style={styles.noResultContainer}>
          <Text style={styles.noResult}>No Result Found</Text>
        </View>
      </WingBlank>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle={'light-content'} />
      {loader ? (
        <ActivityIndicator toast text="Loading..." animating={true} />
      ) : null}
      {/* List of events */}
      {/* Search Bar */}
      <WhiteSpace />
      <WhiteSpace />
      <WingBlank>
        <View style={styles.searchMainContainer}>
          <View style={styles.searchLeftIcon}>
            <CustomIconsComponent
              color={'#89A382'}
              name={'search1'}
              type={'AntDesign'}
              size={20}
            />
          </View>

          <View style={styles.searchInputContainer}>
            <InputItem
              extra={
                <TouchableOpacity
                  style={styles.searchRightIcon}
                  onPress={clearSearchInputValue}>
                  <CustomIconsComponent
                    color={'#89A382'}
                    name={'cross'}
                    type={'Entypo'}
                    size={20}
                  />
                </TouchableOpacity>
              }
              placeholder="Search..."
              placeholderTextColor={'#89A382'}
              accessible={true}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.searchInput}
              onChangeText={(search) => onChangeSearch(search)}
              value={searchValue}></InputItem>
          </View>
        </View>
      </WingBlank>

      {/* Lists of events and filter */}
      <WhiteSpace />
      <WhiteSpace />
      <WingBlank style={{flex: 1}}>
        <FlatList
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          data={eventFilter}
          keyExtractor={(item) => `${item.id}`}
        />
      </WingBlank>

      <View style={styles.filterOptionMainContainer}>
        <View style={styles.filterOptionContainer}>
          <TouchableOpacity
            style={styles.filterOptionNextMainContainer(nextOption)}
            onPress={() => bottomFilterOptionHandler('next')}>
            <View style={styles.filterOptionNextContainer(nextOption)}></View>
            <Text style={styles.filterOptionNext(nextOption)}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterOptionNext60MainContainer(nextIn60Option)}
            onPress={() => bottomFilterOptionHandler('next60')}>
            <View
              style={styles.filterOptionNext60Container(nextIn60Option)}></View>
            <Text style={styles.filterOptionNext60(nextIn60Option)}>
              Next in 60'
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterOptionNextLiveMainContainer(liveOption)}
            onPress={() => bottomFilterOptionHandler('live')}>
            <View
              style={styles.filterOptionNextLiveContainer(liveOption)}></View>
            <Text style={styles.filterOptionNextLive(liveOption)}>Live</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterOptionNextOtherMainContainer(overOption)}
            onPress={() => bottomFilterOptionHandler('over')}>
            <View
              style={styles.filterOptionNextOtherContainer(overOption)}></View>
            <Text style={styles.filterOptionNextOther(overOption)}>over</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.primaryActive,
  },
  searchMainContainer: {
    borderColor: Colors.primaryText,
    borderWidth: 2,
    height: 45,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchLeftIcon: {
    paddingLeft: 10,
    flexDirection: 'row',
  },
  searchInputContainer: {
    width: '94%',
    paddingRight: 0,
  },
  searchRightIcon: {
    height: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  searchInput: {
    borderBottomWidth: 0,
    color: Colors.white,
    width: '10%',
  },
  filterListTopContainer: {
    flexDirection: 'row',
  },
  filterListTopDateContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterListTopDaay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    flexWrap: 'wrap',
  },
  filterListTopMonth: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.white,
  },
  filterListTopNameContainer: {
    // left: 30,
  },
  filterListTopName: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  filterListBottomMainContainer: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'space-between',
  },
  filterListBottomStatusContainer: {
    marginTop: 2,
    backgroundColor: '#ff5d87',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 2,
  },
  filterListBottomStatus: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  filterListBottomDateConainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterListBottomDate: {
    color: Colors.white,
    fontSize: 12,
    opacity: 0.75,
    textTransform: 'uppercase',
  },
  filterListBottomTagContainer: {
    backgroundColor: '#41525d',
    borderRadius: 2,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  filterListBottomTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    opacity: 0.5,
  },
  noResultContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noResult: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  devider: {
    height: 40,
    marginHorizontal: 14,
  },

  filterOptionMainContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 25,
    paddingLeft: 25,
  },
  filterOptionContainer: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3e525e',
    borderRadius: 2,
    width: '95%',
  },

  filterOptionNextMainContainer: (nextOption) => ({
    backgroundColor: nextOption ? '#1f2c33' : 'transparent',
    borderRightWidth: 2,
    borderRightColor: '#3e525e',
    width: '25%',
  }),
  filterOptionNextContainer: (nextOption) => ({
    backgroundColor: nextOption ? '#7cd218' : null,
    height: 2,
    top: 0,
  }),
  filterOptionNext: (nextOption) => ({
    color: nextOption ? Colors.white : Colors.primaryText,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'uppercase',
  }),
  filterOptionNext60MainContainer: (nextIn60Option) => ({
    backgroundColor: nextIn60Option ? '#1f2c33' : 'transparent',
    borderRightWidth: 2,
    borderRightColor: '#3e525e',
    width: '25%',
  }),
  filterOptionNext60Container: (nextIn60Option) => ({
    backgroundColor: nextIn60Option ? '#7cd218' : null,
    height: 2,
    top: 0,
  }),
  filterOptionNext60: (nextIn60Option) => ({
    color: nextIn60Option ? Colors.white : Colors.primaryText,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'uppercase',
  }),
  filterOptionNextLiveMainContainer: (liveOption) => ({
    backgroundColor: liveOption ? '#1f2c33' : 'transparent',
    borderRightWidth: 2,
    borderRightColor: '#3e525e',
    width: '25%',
  }),
  filterOptionNextLiveContainer: (liveOption) => ({
    backgroundColor: liveOption ? '#7cd218' : null,
    height: 2,
    top: 0,
  }),
  filterOptionNextLive: (liveOption) => ({
    color: liveOption ? Colors.white : Colors.primaryText,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'uppercase',
  }),
  filterOptionNextOtherMainContainer: (overOption) => ({
    backgroundColor: overOption ? '#1f2c33' : 'transparent',
    borderRightWidth: 2,
    borderRightColor: '#3e525e',
    width: '25%',
  }),
  filterOptionNextOtherContainer: (overOption) => ({
    backgroundColor: overOption ? '#7cd218' : null,
    height: 2,
    top: 0,
  }),
  filterOptionNextOther: (overOption) => ({
    color: overOption ? Colors.white : Colors.primaryText,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'uppercase',
  }),
});
