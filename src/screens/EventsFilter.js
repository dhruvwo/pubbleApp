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
  };

  const clearSearchInputValue = () => {
    setSearchValue('');
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#2D3F4A',
      }}>
      {loader ? (
        <ActivityIndicator toast text="Loading..." animating={true} />
      ) : null}
      {/* List of events */}
      {/* Search Bar */}
      <WhiteSpace />
      <WhiteSpace />
      <WingBlank>
        <View
          style={{
            borderColor: '#8ba5b4',
            borderWidth: 2,
            height: 45,
            borderRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              paddingLeft: 10,
              flexDirection: 'row',
            }}>
            <CustomIconsComponent
              color={'#89A382'}
              name={'search1'}
              type={'AntDesign'}
              size={20}
            />
          </View>

          <View
            style={{
              width: '94%',
              paddingRight: 0,
            }}>
            <InputItem
              extra={
                <TouchableOpacity
                  style={{
                    height: '100%',
                    alignItems: 'center',
                    paddingTop: 10,
                  }}
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
              style={{
                borderBottomWidth: 0,
                color: '#fff',
                width: '10%',
              }}
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
                <TouchableOpacity onPress={() => navigateToEventList(event.id)}>
                  <WingBlank key={index}>
                    <View
                      style={
                        selectedEvent.id === event.id
                          ? {
                              backgroundColor: '#51C8D0',
                              marginTop: 5,
                            }
                          : {
                              marginTop: 5,
                            }
                      }>
                      <View
                        style={{
                          height: 34,
                          width: '100%',
                          marginTop: 10,
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            left: 16,
                            width: 35,
                            height: 40,
                            alignItems: 'center',
                            //   borderRightWidth: 0.5,
                            //   borderRightColor: Colors.white,
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 'bold',
                              color: '#fff',
                              flexWrap: 'wrap',
                            }}>
                            {eventStartDateDay}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              color: '#fff',
                            }}>
                            {eventStartDateMonth}
                          </Text>
                        </View>

                        <View
                          style={{
                            left: 30,
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontWeight: '600',
                              fontSize: 15,
                            }}>
                            {event.name}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: 6,
                          height: 32,
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            left: 16,
                            backgroundColor: '#ff5d87',
                            height: 16,
                            borderRadius: 2,
                            top: 0,
                            width: 35,
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              textAlign: 'center',
                            }}>
                            Live
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            width: '85%',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              left: 30,
                              flexDirection: 'row',
                              top: 0,
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 12,
                                opacity: 0.75,
                                textTransform: 'uppercase',
                              }}>
                              {eventStartDateDay + ' ' + eventStartDateMonth}
                            </Text>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 12,
                                opacity: 0.75,
                                textTransform: 'uppercase',
                              }}>
                              -
                            </Text>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 12,
                                opacity: 0.75,
                                textTransform: 'uppercase',
                              }}>
                              {eventEndDate}
                            </Text>
                          </View>

                          <View
                            style={{
                              backgroundColor: '#41525d',
                              borderRadius: 2,
                              top: 0,
                              padding: 3,
                              marginBottom: 10,
                            }}>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                opacity: 0.5,
                              }}>
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
