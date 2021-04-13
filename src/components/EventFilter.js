import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import UserGroupImage from '../components/UserGroupImage';
import * as _ from 'lodash';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {InputItem} from '@ant-design/react-native';

export default function EventFilter(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth}) => ({
    communityId: auth?.community?.community?.id || '',
    selectedEvent: auth.selectedEvent,
  }));
  const [tagFilterData, setTagFilterData] = useState([]);
  const [tagSearch, setTagSearch] = useState('');

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
    await dispatch(eventsAction.getStreamData(params));
    props.navigation.navigate('Events');
  }

  const clearSearchInputValue = () => {
    setTagSearch('');
  };

  const onChangeSearch = (value) => {
    setTagSearch(value);
  };

  async function onSearchHandler() {
    const params = {
      communityId: reduxState.communityId,
      postTypes: 'Q',
      searchString: tagSearch,
      scope: 'all',
      searchAppIds: reduxState.selectedEvent.id,
      statuses: '10,20,40,50,60,0,30',
    };
    await dispatch(eventsAction.getStreamData(params));
    props.navigation.navigate('Events');
  }

  return (
    <View style={styles.contentContainer}>
      <View style={styles.searchMainContainer}>
        <View style={styles.searchLeftIcon}>
          <CustomIconsComponent
            color={Colors.primaryActive}
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
            value={tagSearch}></InputItem>
        </View>

        <TouchableOpacity
          containerStyle={styles.tagAddButton(tagSearch)}
          onPress={onSearchHandler}>
          <CustomIconsComponent
            color={'white'}
            name={'check'}
            type={'Entypo'}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.activityPubbleUsersText}>Tag filter</Text>

      <View style={styles.dividerStyleMainContainer}>
        <View style={styles.dividerStyle1}></View>
        <View style={styles.dividerStyle2}></View>
      </View>

      <Text style={styles.topText}>
        Select one or more tags to filter questions
      </Text>

      <View style={styles.tagFilterMainContainer}>
        {tagFilterData?.data?.map((tags, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onClickTagHandler(tags.tag.name)}
            style={styles.tagFilterTouchable(tags.tag.color)}>
            <View style={styles.tagFilterContainer}>
              <Text style={styles.tagNameText(tags.tag.color)}>
                {tags.tag.name}
              </Text>
              <View style={styles.tagRightDivider(tags.tag.color)}></View>
              <Text style={styles.tagFiltterCount(tags.tag.color)}>
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
  tagFilterTouchable: (tagColor) => ({
    borderWidth: 2,
    borderColor: tagColor !== '' ? tagColor : Colors.primaryText,
    borderRadius: 28,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 8,
    marginBottom: 10,
  }),
  tagFilterContainer: {
    flexDirection: 'row',
  },
  tagNameText: (tagColor) => ({
    color: tagColor !== '' ? tagColor : Colors.primaryText,
    textAlign: 'center',
    flexWrap: 'wrap',
  }),
  tagRightDivider: (tagColor) => ({
    marginHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: tagColor !== '' ? tagColor : Colors.primaryText,
  }),
  tagFiltterCount: (tagColor) => ({
    color: tagColor !== '' ? tagColor : Colors.primaryText,
    textAlign: 'center',
    flexWrap: 'wrap',
  }),

  searchMainContainer: {
    borderColor: Colors.primaryInactive,
    borderWidth: 2,
    borderRadius: 4,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    width: '10%',
  },
  tagAddButton: (tagSearch) => ({
    backgroundColor: Colors.green,
    padding: 5,
    borderRadius: 5,
    opacity: tagSearch ? 1 : 0.5,
  }),
});
