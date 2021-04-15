import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Popover} from '@ant-design/react-native';

export default function StatusAssignFilter(props) {
  const {setIsLoading, activeTab, getStreamData} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, events}) => ({
    communityId: auth?.community?.community?.id || '',
    selectedEvent: auth.selectedEvent,
    selectedTagFilter: events.selectedTagFilter,
  }));

  const [toggleStatusFilter, setToggleStatusFilter] = useState(false);
  const [toggleAssignFilter, setToggleAssignFilter] = useState(false);
  const [togglWaitFilter, setTogglWaitFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Show all');
  const [assignFilter, setAssignFilter] = useState('Show all');
  const [waitFilter, setwaitFilter] = useState('Show all');
  const [currentFilter, setCurrentFilter] = useState('');

  useEffect(() => {
    console.log(currentFilter);
    if (
      statusFilter !== 'Show all' ||
      assignFilter !== 'Show all' ||
      waitFilter !== 'Show all'
    ) {
      excFilter();
    }
    //   console.log('changed');
    //   setStatusFilter('Show all');
    //   setAssignFilter('Show all');
    //   setwaitFilter('Show all');
    //   setCurrentFilter('');
  }, [activeTab]);

  useEffect(() => {
    if (currentFilter !== '') {
      excFilter();
    }
  }, [currentFilter]);

  async function excFilter() {
    setIsLoading(true);
    /* const params = {
      communityId: reduxState.communityId,
      postTypes: 'Q',
      scope: 'all',
      pageSize: 20,
      searchAppIds: reduxState.selectedEvent.id,
    }; */
    const params = {};

    if (activeTab.title === 'New') {
      if (currentFilter === 'Approve') {
        params.statuses = '30';
        params.includeUnapproved = false;
      }
      if (currentFilter === 'Unapprove') {
        if (assignFilter === 'Unassigned') {
          params.statuses = '20';
        } else if (assignFilter === 'Assigned') {
          params.statuses = '40';
        } else {
          params.statuses = '20,40';
        }
        params.unapprovedOnly = true;
      }
      if (currentFilter === 'Assigned') {
        params.statuses = '40';
        if (statusFilter === 'Approve') {
          params.includeUnapproved = false;
        }
        if (statusFilter === 'Unapprove') {
          params.unapprovedOnly = true;
        }
      }
      if (currentFilter === 'Unassigned') {
        params.statuses = '20';
        if (statusFilter === 'Approve') {
          params.includeUnapproved = false;
        }
        if (statusFilter === 'Unapprove') {
          params.unapprovedOnly = true;
        }
      }
    }

    if (activeTab.title === 'In Progress') {
      if (currentFilter === 'Approve') {
        params.statuses = '50,60';
        params.includeUnapproved = false;
      }
      if (currentFilter === 'Unapprove') {
        if (assignFilter === 'Waiting for visitor') {
          params.statuses = '60';
        } else if (assignFilter === 'Waiting for moderator') {
          params.statuses = '50';
        } else {
          params.statuses = '50,60';
        }
        params.unapprovedOnly = true;
      }
      if (currentFilter === 'Waiting for moderator') {
        params.statuses = '50';
        if (statusFilter === 'Approve') {
          params.statuses = '60';
          params.includeUnapproved = false;
        }
        if (statusFilter === 'Unapprove') {
          params.unapprovedOnly = true;
        }
      }
      if (currentFilter === 'Waiting for visitor') {
        params.statuses = '60';
        if (statusFilter === 'Approve') {
          params.statuses = '60';
          params.includeUnapproved = false;
        }
        if (statusFilter === 'Unapprove') {
          params.unapprovedOnly = true;
        }
      }
    }

    if (activeTab.title === 'Closed') {
      if (currentFilter === 'Approve') {
        params.statuses = '30';
        params.includeUnapproved = false;
      }
      if (currentFilter === 'Unapprove') {
        params.statuses = '30';
        params.unapprovedOnly = true;
      }
    }

    console.log(params, 'params');
    // const response = await dispatch(eventsAction.getStreamData(params));
    const response = await dispatch(eventsAction.filterParams(params));
    console.log(response, 'respone');
    setIsLoading(false);
  }

  async function applyFilterHandler(status) {
    setToggleStatusFilter(false);
    setToggleAssignFilter(false);
    setTogglWaitFilter(false);

    setCurrentFilter(status);
  }

  function onClearStatusFilter() {
    if (activeTab.title === 'New') {
      setStatusFilter('Show all');
      if (assignFilter !== 'Show all') {
        setCurrentFilter(assignFilter);
      } else {
        getStreamData();
      }
    }
    if (activeTab.title === 'In Progress') {
      setStatusFilter('Show all');
      if (waitFilter !== 'Show all') {
        setCurrentFilter(waitFilter);
      } else {
        getStreamData();
      }
    }
    if (activeTab.title === 'Closed') {
      setStatusFilter('Show all');
      getStreamData();
    }
  }

  function onClearAssignFilter() {
    setAssignFilter('Show all');
    if (statusFilter !== 'Show all') {
      setCurrentFilter(statusFilter);
    } else {
      getStreamData();
    }
  }

  function onClearWaitFilter() {
    setwaitFilter('Show all');
    if (statusFilter !== 'Show all') {
      setCurrentFilter(statusFilter);
    } else {
      getStreamData();
    }
  }

  return (
    <View
      style={
        {
          // paddingHorizontal: 20,
          // alignItems: 'center',
        }
      }>
      <View
        style={{
          backgroundColor: Colors.white,
          flexDirection: 'row',
          padding: 5,
          width: '100%',
        }}>
        <Popover
          duration={0}
          useNativeDriver={true}
          overlay={
            <View
              style={{
                // backgroundColor: Colors.primaryTilt,
                paddingHorizontal: 10,
                paddingVertical: 10,
                // borderWidth: 1,
                // borderColor: Colors.primaryText,
                // marginRight: 15,
              }}>
              <TouchableOpacity
                onPress={() => {
                  applyFilterHandler('Approve');
                  setStatusFilter('Approve');
                }}>
                <Text
                  style={{
                    color: Colors.primaryText,
                    fontSize: 14,
                    fontWeight: '600',
                    marginBottom: 8,
                  }}>
                  Approve
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  applyFilterHandler('Unapprove');
                  setStatusFilter('Unapprove');
                }}>
                <Text
                  style={{
                    color: Colors.primaryText,
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                  Unapprove
                </Text>
              </TouchableOpacity>
            </View>
          }
          placement={'bottom'}>
          <View
            style={{
              backgroundColor: Colors.primaryTilt,
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: Colors.primaryText,
              paddingHorizontal: 10,
              paddingVertical: 2,
              alignItems: 'center',
              //   flex: 1,
            }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color:
                  statusFilter !== 'Show all'
                    ? Colors.secondary
                    : Colors.primaryText,
                marginLeft: 5,
              }}>
              Status:{' '}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color:
                  statusFilter !== 'Show all'
                    ? Colors.secondary
                    : Colors.primaryInactiveText,
              }}>
              {statusFilter}
            </Text>
            {statusFilter !== 'Show all' ? (
              <TouchableOpacity
                onPress={onClearStatusFilter}
                style={{
                  backgroundColor: Colors.secondary,
                  marginLeft: 5,
                }}>
                <CustomIconsComponent
                  color={Colors.white}
                  name={'cross'}
                  type={'Entypo'}
                  size={20}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </Popover>

        {activeTab.title === 'New' ? (
          <Popover
            duration={0}
            useNativeDriver={true}
            overlay={
              <View
                style={{
                  //   backgroundColor: Colors.primaryTilt,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  //   borderWidth: 1,
                  //   borderColor: Colors.primaryText,
                  //   marginLeft: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    applyFilterHandler('Assigned');
                    setAssignFilter('Assigned');
                  }}>
                  <Text
                    style={{
                      color: Colors.primaryText,
                      fontSize: 14,
                      fontWeight: '600',
                      marginBottom: 8,
                    }}>
                    Assigned
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    applyFilterHandler('Unassigned');
                    setAssignFilter('Unassigned');
                  }}>
                  <Text
                    style={{
                      color: Colors.primaryText,
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                    Unassigned
                  </Text>
                </TouchableOpacity>
              </View>
            }
            placement={'bottom'}>
            <View
              style={{
                backgroundColor: Colors.primaryTilt,
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: Colors.primaryText,
                paddingHorizontal: 10,
                paddingVertical: 2,
                alignItems: 'center',
                // flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color:
                    assignFilter !== 'Show all'
                      ? Colors.secondary
                      : Colors.primaryText,
                  marginLeft: 5,
                }}>
                Assign:{' '}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color:
                    assignFilter !== 'Show all'
                      ? Colors.secondary
                      : Colors.primaryInactiveText,
                }}>
                {assignFilter}
              </Text>
              {assignFilter !== 'Show all' ? (
                <TouchableOpacity
                  onPress={onClearAssignFilter}
                  style={{
                    backgroundColor: Colors.secondary,
                    marginLeft: 5,
                  }}>
                  <CustomIconsComponent
                    color={Colors.white}
                    name={'cross'}
                    type={'Entypo'}
                    size={20}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </Popover>
        ) : null}

        {activeTab.title === 'In Progress' ? (
          <Popover
            duration={0}
            useNativeDriver={true}
            overlay={
              <View
                style={{
                  //   backgroundColor: Colors.primaryTilt,
                  paddingHorizontal: 25,
                  paddingVertical: 10,
                  //   borderWidth: 1,
                  //   borderColor: Colors.primaryText,
                  //   marginLeft: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    applyFilterHandler('Waiting for moderator');
                    setwaitFilter('Waiting for moderator');
                  }}>
                  <Text
                    style={{
                      color: Colors.primaryText,
                      fontSize: 14,
                      fontWeight: '600',
                      marginBottom: 8,
                    }}>
                    Waiting for moderator
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    applyFilterHandler('Waiting for visitor');
                    setwaitFilter('Waiting for visitor');
                  }}>
                  <Text
                    style={{
                      color: Colors.primaryText,
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                    Waiting for visitor
                  </Text>
                </TouchableOpacity>
              </View>
            }
            placement={'bottom'}>
            <View
              style={{
                backgroundColor: Colors.primaryTilt,
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: Colors.primaryText,
                paddingHorizontal: 10,
                paddingVertical: 2,
                alignItems: 'center',
                // flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color:
                    waitFilter !== 'Show all'
                      ? Colors.secondary
                      : Colors.primaryText,
                  marginLeft: 5,
                }}>
                Wait:{' '}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color:
                    waitFilter !== 'Show all'
                      ? Colors.secondary
                      : Colors.primaryInactiveText,
                }}>
                {waitFilter}
              </Text>
              {waitFilter !== 'Show all' ? (
                <TouchableOpacity
                  onPress={onClearWaitFilter}
                  style={{
                    backgroundColor: Colors.secondary,
                    marginLeft: 5,
                  }}>
                  <CustomIconsComponent
                    color={Colors.white}
                    name={'cross'}
                    type={'Entypo'}
                    size={20}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </Popover>
        ) : null}
      </View>
    </View>
  );
}
