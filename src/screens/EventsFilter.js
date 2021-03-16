import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
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

export default function EventFilter(props) {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [loader, setLoader] = useState(false);
  const [eventFilter, setEventFilter] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const reduxState = useSelector(({auth}) => ({
    events: auth.events,
    selectedEvent: auth.selectedEvent,
  }));

  const onChangeSearch = (value) => {
    setSearchValue(value);
    console.log(value);
    if (value !== '') {
      const getEventsLists = reduxState.events.filter((event) =>
        event.name.toLowerCase().includes(value.toLowerCase()),
      );
      setEventFilter(getEventsLists);
    } else {
      setEventFilter(reduxState.events);
    }
  };

  const clearSearchInputValue = () => {
    setSearchValue('');
    setEventFilter(reduxState.events);
  };

  const navigateToEventList = (eventId) => {
    const getEvents = eventFilter.find((event) => event.id === eventId);
    dispatch(authAction.setSelectedEvent(getEvents));
    props.navigation.goBack();
  };

  useEffect(() => {
    setEventFilter(reduxState.events);
    setSelectedEvent(reduxState.selectedEvent);
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
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
      <ScrollView>
        <WhiteSpace />
        <WhiteSpace />
        {eventFilter.length > 0 ? (
          eventFilter.map((event, index) => {
            var eventStartDateDay = moment(event.startDate).format('D');
            var eventStartDateMonth = moment(event.startDate).format('MMM');

            var eventEndDate = moment(event.endDate).format('D MMM');
            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigateToEventList(event.id)}>
                <WingBlank>
                  <View
                    style={
                      selectedEvent.id === event.id
                        ? {
                            backgroundColor: '#51C8D0',
                          }
                        : {}
                    }>
                    <View style={styles.filterListTopContainer}>
                      <View style={styles.filterListTopDateContainer}>
                        <Text style={styles.filterListTopDaay}>
                          {eventStartDateDay}
                        </Text>
                        <Text style={styles.filterListTopMonth}>
                          {eventStartDateMonth}
                        </Text>
                      </View>

                      <View style={styles.filterListTopNameContainer}>
                        <Text style={styles.filterListTopName}>
                          {event.name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.filterListBottomMainContainer}>
                      <View style={styles.filterListBottomStatusContainer}>
                        <Text style={styles.filterListBottomStatus}>Live</Text>
                      </View>

                      <View style={styles.filterListBottomDateTagContainer}>
                        <View style={styles.filterListBottomDateConainer}>
                          <Text style={styles.filterListBottomDate}>
                            {eventStartDateDay + ' ' + eventStartDateMonth}
                          </Text>
                          <Text style={styles.filterListBottomDate}>-</Text>
                          <Text style={styles.filterListBottomDate}>
                            {eventEndDate}
                          </Text>
                        </View>

                        <View style={styles.filterListBottomTagContainer}>
                          <Text style={styles.filterListBottomTag}>
                            {Discriminator[event.discriminator]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </WingBlank>
              </TouchableOpacity>
            );
          })
        ) : (
          <WingBlank>
            <View style={styles.noResultContainer}>
              <Text style={styles.noResult}>No Result Found</Text>
            </View>
          </WingBlank>
        )}
      </ScrollView>

      <View style={styles.filterOptionMainContainer}>
        <View style={styles.filterOptionContainer}>
          <TouchableOpacity style={styles.filterOptionNextMainContainer()}>
            <View style={styles.filterOptionNextContainer()}></View>
            <Text style={styles.filterOptionNext()}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterOptionNext60MainContainer()}>
            <View style={styles.filterOptionNext60Container()}></View>
            <Text style={styles.filterOptionNext60()}>Next in 60'</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterOptionNextLiveMainContainer()}>
            <View style={styles.filterOptionNextLiveContainer()}></View>
            <Text style={styles.filterOptionNextLive()}>Live</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterOptionNextOtherMainContainer()}>
            <View style={styles.filterOptionNextOtherContainer()}></View>
            <Text style={styles.filterOptionNextOther()}>over</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#2D3F4A',
  },
  searchMainContainer: {
    borderColor: '#8ba5b4',
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
    height: 34,
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
  },
  filterListTopDateContainer: {
    left: 16,
    width: 35,
    height: 40,
    alignItems: 'center',
    //   borderRightWidth: 0.5,
    //   borderRightColor: Colors.white,
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
    left: 30,
  },
  filterListTopName: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  filterListBottomMainContainer: {
    marginTop: 6,
    height: 32,
    flexDirection: 'row',
  },
  filterListBottomStatusContainer: {
    left: 16,
    backgroundColor: '#ff5d87',
    height: 16,
    borderRadius: 2,
    top: 0,
    width: 35,
  },
  filterListBottomStatus: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  filterListBottomDateTagContainer: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-between',
  },
  filterListBottomDateConainer: {
    left: 30,
    flexDirection: 'row',
    top: 0,
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
    top: 0,
    padding: 3,
    marginBottom: 10,
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

  filterOptionMainContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    bottom: 0,
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
  filterOptionNextMainContainer: () => ({
    backgroundColor: '#1f2c33',
    borderRightWidth: 2,
    borderRightColor: '#3e525e',
    width: '25%',
  }),
  filterOptionNextContainer: () => ({
    backgroundColor: '#7cd218',
    height: 2,
    top: 0,
  }),
  filterOptionNext: () => ({
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'uppercase',
  }),
  filterOptionNext60MainContainer: () => ({
    backgroundColor: '#1f2c33',
    borderRightWidth: 2,
    borderRightColor: '#3e525e',
    width: '25%',
  }),
  filterOptionNext60Container: () => ({
    backgroundColor: '#7cd218',
    height: 2,
    top: 0,
  }),
  filterOptionNext60: () => ({
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'uppercase',
  }),
  filterOptionNextLiveMainContainer: () => ({
    backgroundColor: '#1f2c33',
    borderRightWidth: 2,
    borderRightColor: '#3e525e',
    width: '25%',
  }),
  filterOptionNextLiveContainer: () => ({
    backgroundColor: '#7cd218',
    height: 2,
    top: 0,
  }),
  filterOptionNextLive: () => ({
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'uppercase',
  }),
  filterOptionNextOtherMainContainer: () => ({
    backgroundColor: '#1f2c33',
    borderRightWidth: 2,
    borderRightColor: '#3e525e',
    width: '25%',
  }),
  filterOptionNextOtherContainer: () => ({
    backgroundColor: '#7cd218',
    height: 2,
    top: 0,
  }),
  filterOptionNextOther: () => ({
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'uppercase',
  }),
});
