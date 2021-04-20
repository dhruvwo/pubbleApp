import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';
import {eventsAction, myInboxAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import GifSpinner from './GifSpinner';

const {width} = Dimensions.get('window');

export default function EventFilter(props) {
  const {filterModal, onRequestClose} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, events, myInbox}) => ({
    communityId: auth?.community?.community?.id || '',
    selectedEvent: auth.selectedEvent,
    selectedTagFilter: props.isInboxFilter
      ? myInbox.selectedTagFilter
      : events.selectedTagFilter,
    searchFilter: props.isInboxFilter
      ? myInbox.searchFilter
      : events.searchFilter,
  }));
  const [tagFilterData, setTagFilterData] = useState([]);
  const [loadingTag, setLoadingTag] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  useEffect(() => {
    if (reduxState.searchFilter !== '') {
      setTagSearch(reduxState.searchFilter);
    }
    getTagFilterData();
  }, []);

  async function getTagFilterData() {
    setLoadingTag(true);
    const res = props.isInboxFilter
      ? await dispatch(
          myInboxAction.eventDetailTagFilter({
            communityId: reduxState.communityId,
            postTypes: 'Q,M',
            scope: 'all',
            pageSize: 50000,
            statuses: '0,10,20,30,40,50,60',
          }),
        )
      : await dispatch(
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
    setLoadingTag(false);
  }

  async function onClickTagHandler(selectedTag) {
    let filterData = reduxState.selectedTagFilter;
    const isTagSelected = reduxState.selectedTagFilter?.includes(selectedTag);
    if (isTagSelected) {
      filterData = filterData.filter((item) => item !== selectedTag);
    } else {
      filterData = [...filterData, selectedTag];
    }
    dispatch(
      props.isInboxFilter
        ? myInboxAction.setFilterData({type: 'tag', data: filterData})
        : eventsAction.setFilterData({type: 'tag', data: filterData}),
    );
    onRequestClose();
    // props.navigation.navigate('Events');
  }

  const clearSearchInputValue = () => {
    setTagSearch('');
    dispatch(
      props.isInboxFilter
        ? myInboxAction.setFilterData({type: 'search', data: null})
        : eventsAction.setFilterData({type: 'search', data: null}),
    );
  };

  const onChangeSearch = (value) => {
    setTagSearch(value);
  };

  async function onSearchHandler() {
    dispatch(
      props.isInboxFilter
        ? myInboxAction.setFilterData({type: 'search', data: tagSearch})
        : eventsAction.setFilterData({type: 'search', data: tagSearch}),
    );
    onRequestClose();
  }

  return (
    <Modal
      visible={filterModal}
      onRequestClose={() => {
        onRequestClose();
      }}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Filter</Text>
          <TouchableOpacity onPress={() => onRequestClose()}>
            <CustomIconsComponent
              type={'FontAwesome'}
              name={'close'}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
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
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor={'#89A382'}
                  onSubmitEditing={() => onSearchHandler()}
                  accessible={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(search) => onChangeSearch(search)}
                  value={tagSearch}
                  style={styles.searchInput}
                />
                <TouchableOpacity
                  style={styles.searchRightIcon}
                  onPress={() => clearSearchInputValue()}>
                  <CustomIconsComponent
                    color={'#89A382'}
                    name={'cross'}
                    type={'Entypo'}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.tagAddButton(tagSearch)}
              onPress={() => onSearchHandler()}>
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

          {tagFilterData?.data?.length ? (
            <Text style={styles.topText}>
              Select one or more tags to filter questions
            </Text>
          ) : null}

          {reduxState.selectedTagFilter?.length && !loadingTag ? (
            <TouchableOpacity
              onPress={() =>
                dispatch(
                  props.isInboxFilter
                    ? myInboxAction.setFilterData({type: 'tag', data: []})
                    : eventsAction.setFilterData({type: 'tag', data: []}),
                )
              }
              style={{
                backgroundColor: Colors.greyText,
                padding: 5,
                marginTop: 12,
                alignSelf: 'flex-start',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: Colors.white,
                  textTransform: 'uppercase',
                }}>
                Clear all
              </Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.tagFilterMainContainer}>
            {loadingTag ? (
              <View
                style={{
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 20,
                }}>
                <GifSpinner />
              </View>
            ) : tagFilterData?.data?.length ? (
              tagFilterData.data.map((tags, index) => {
                const isTagSelected =
                  reduxState.selectedTagFilter?.length &&
                  reduxState.selectedTagFilter.includes(tags.tag.name);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => onClickTagHandler(tags.tag.name)}
                    style={[
                      styles.tagFilterTouchable(tags.tag.color),
                      isTagSelected
                        ? styles.tagFilterSelected(tags.tag.color)
                        : null,
                    ]}>
                    <View style={styles.tagFilterContainer}>
                      <Text
                        style={[
                          styles.tagNameText(tags.tag.color),
                          isTagSelected ? styles.tagNameTextSelected : null,
                        ]}>
                        {tags.tag.name}
                      </Text>
                      <View
                        style={[
                          styles.tagRightDivider(tags.tag.color),
                          isTagSelected ? styles.tagRightDividerSelected : null,
                        ]}></View>
                      <Text
                        style={[
                          styles.tagFiltterCount(tags.tag.color),
                          isTagSelected ? styles.tagFiltterCountSelected : null,
                        ]}>
                        {tags.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View>
                <Text style={styles.topText}>No tagged conversations</Text>
                <Text style={styles.topText}>
                  To tag a conversation Open a question and add tags on the
                  right-hand side. Tags make it easier to search for and
                  categorise questions.
                </Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    backgroundColor: Colors.secondary,
    padding: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  activityPubbleUsersText: {
    marginTop: 15,
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
    width: width * 0.15,
    borderWidth: 2,
    borderColor: Colors.primaryText,
  },
  dividerStyle2: {
    width: width * 0.85,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
  },
  topText: {
    fontSize: 14,
    marginTop: 12,
    color: Colors.primaryInactiveText,
  },
  tagFilterMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tagFilterTouchable: (tagColor) => ({
    borderWidth: 2,
    borderColor: tagColor !== '' ? tagColor : Colors.primaryText,
    borderRadius: 28,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 10,
  }),
  tagFilterSelected: (tagColor) => ({
    backgroundColor: tagColor !== '' ? tagColor : Colors.primaryText,
  }),
  tagFilterContainer: {
    flexDirection: 'row',
  },
  tagNameText: (tagColor) => ({
    color: tagColor !== '' ? tagColor : Colors.primaryText,
    textAlign: 'center',
    flexWrap: 'wrap',
  }),
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  tagNameTextSelected: {
    color: Colors.white,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  tagRightDivider: (tagColor) => ({
    marginHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: tagColor !== '' ? tagColor : Colors.primaryText,
  }),
  tagRightDividerSelected: {
    marginHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: Colors.white,
  },
  tagFiltterCount: (tagColor) => ({
    color: tagColor !== '' ? tagColor : Colors.primaryText,
    textAlign: 'center',
    flexWrap: 'wrap',
  }),
  tagFiltterCountSelected: {
    color: Colors.white,
    textAlign: 'center',
    flexWrap: 'wrap',
  },

  searchMainContainer: {
    borderColor: Colors.primaryInactive,
    borderWidth: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
  searchLeftIcon: {
    paddingLeft: 10,
    flexDirection: 'row',
  },
  searchInputContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchInput: {
    flexGrow: 1,
    flexShrink: 1,
  },
  tagAddButton: (tagSearch) => ({
    backgroundColor: Colors.green,
    padding: 5,
    borderRadius: 5,
    opacity: tagSearch ? 1 : 0.5,
    marginLeft: 15,
  }),
});
