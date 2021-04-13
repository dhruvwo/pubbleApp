import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import UserGroupImage from '../components/UserGroupImage';
import * as _ from 'lodash';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function EventFilter(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth}) => ({
    communityId: auth?.community?.community?.id || '',
    selectedEvent: auth.selectedEvent,
  }));
  const [tagFilterData, setTagFilterData] = useState([]);

  useEffect(() => {
    getTagFilterData();
  }, []);

  async function getTagFilterData() {
    const res = await dispatch(
      eventsAction.eventDetailTagFilter({
        communityId: reduxState.communityId,
        postTypes: 'Q,M,U,V',
        scope: 'all',
        pageSize: 50000,
        statuses: '0,10,20,30,40,50,60',
        searchAppIds: reduxState.selectedEvent.id,
      }),
    );
    setTagFilterData(res);
  }

  async function onClickTagHandler(selectedTag) {
    const params = {
      communityId: reduxState.communityId,
      postTypes: 'Q,M,U,V',
      searchString: '',
      tags: selectedTag,
      scope: 'all',
      searchAppIds: reduxState.selectedEvent.id,
      statuses: '0,10,20,30,40,50,60',
    };
    const res = await dispatch(eventsAction.getStreamData(params));
    props.navigation.navigate('Events');
  }

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.activityPubbleUsersText}>Tag filter</Text>

      <View style={styles.dividerStyleMainContainer}>
        <View style={styles.dividerStyle1}></View>
        <View style={styles.dividerStyle2}></View>
      </View>

      <Text style={styles.topText}>
        Select one or more tags to filter questions
      </Text>

      <View style={styles.tagFilterMainContainer}>
        {tagFilterData?.data?.map((tags) => (
          <TouchableOpacity
            onPress={() => onClickTagHandler(tags.tag.name)}
            style={styles.tagFilterTouchable}>
            <View style={styles.tagFilterContainer}>
              <Text
                style={{
                  color:
                    tags.tag.color !== '' ? tags.tag.color : Colors.primaryText,
                  textAlign: 'center',
                  flexWrap: 'wrap',
                }}>
                {tags.tag.name}
              </Text>
              <View
                style={{
                  marginHorizontal: 5,
                  borderRightWidth: 1,
                  borderRightColor:
                    tags.tag.color !== '' ? tags.tag.color : Colors.primaryText,
                }}></View>
              <Text
                style={{
                  color:
                    tags.tag.color !== '' ? tags.tag.color : Colors.primaryText,
                  textAlign: 'center',
                  flexWrap: 'wrap',
                }}>
                {tags.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  activityPubbleUsersText: {
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dividerStyleMainContainer: {
    flexDirection: 'row',
    marginTop: 3,
  },
  dividerStyle1: {
    width: 50,
    borderWidth: 2,
    borderColor: Colors.primaryText,
  },
  dividerStyle2: {
    width: 320,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
  },
  topText: {
    fontSize: 14,
    marginTop: 12,
    color: Colors.primaryInactiveText,
  },
  tagFilterMainContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagFilterTouchable: {
    borderWidth: 2,
    borderColor: tags.tag.color !== '' ? tags.tag.color : Colors.primaryText,
    borderRadius: 28,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 8,
    marginBottom: 10,
  },
  tagFilterContainer: {
    flexDirection: 'row',
  },
});
