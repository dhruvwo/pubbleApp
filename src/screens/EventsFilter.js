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
    if (value !== '') {
      const getEventsLists = eventFilter.filter((event) =>
        event.name.toLowerCase().includes(value),
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
        {eventFilter.length > 0
          ? eventFilter.map((event, index) => {
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
                          <Text style={styles.filterListBottomStatus}>
                            Live
                          </Text>
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
          : null}
      </ScrollView>
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
    color: '#fff',
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
    color: '#fff',
    flexWrap: 'wrap',
  },
  filterListTopMonth: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#fff',
  },
  filterListTopNameContainer: {
    left: 30,
  },
  filterListTopName: {
    color: '#fff',
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
    color: '#fff',
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
    color: '#fff',
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
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    opacity: 0.5,
  },
});
