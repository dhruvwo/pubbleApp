import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {InputItem} from '@ant-design/react-native';
import GlobalStyles from '../constants/GlobalStyles';
import {useDispatch, useSelector} from 'react-redux';
import UserGroupImage from './UserGroupImage';
import _ from 'lodash';
import {collectionsAction, eventsAction} from '../store/actions';

export default function AssignModal(props) {
  const {
    onRequestClose,
    itemForAssign,
    assignedItems,
    isPersonAssign,
    onPressAssign,
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const [itemAssignees, setItemAssignees] = useState([]);
  const [nonAssignees, setNonAssignees] = useState([]);
  const [itemAssigneesId, setItemAssigneesId] = useState([]);
  const reduxState = useSelector(({collections, auth}) => ({
    usersCollection: collections.users,
    groupsCollection: collections.groups,
    community: auth.community,
  }));
  const dispatch = useDispatch();

  const onChangeSearch = (value) => {
    setSearchValue(value);
  };

  const delayedQuery = useCallback(
    _.debounce(() => searchGroups(), 1500),
    [searchValue],
  );

  useEffect(() => {
    if (searchValue) {
      delayedQuery();
    }
    return delayedQuery.cancel;
  }, [searchValue, delayedQuery]);

  async function searchGroups() {
    console.log('searchGroups called');
    const res = await dispatch(
      collectionsAction.searchDirectoryData({
        communityId: reduxState.community.community.id,
        searchString: searchValue,
        communityType: 'assignee',
      }),
    );
    const responseData = res.data;
    const itemAssigneesIds = itemAssignees.map((o) => o.id);
    const finalData = responseData.filter(
      (o) => !itemAssigneesIds.includes(o.id),
    );
    console.log({
      finalData,
      responseData,
      itemAssigneesIds,
    });
    setNonAssignees(finalData);
  }

  useEffect(() => {
    if (isPersonAssign) {
      const assignedList = [];
      const nonAssigneeList = [];
      const assignedIdList = [];
      itemForAssign.assignees.forEach((item) => {
        const data = assignedItems.includes(item.id);
        if (data) {
          assignedList.push(item);
          assignedIdList.push(item.id);
        } else {
          nonAssigneeList.push(item);
        }
      });
      setItemAssignees(assignedList);
      setItemAssigneesId(assignedIdList);
      setNonAssignees(nonAssigneeList);
    } else {
      if (!searchValue) {
        const assigneesUserIds = [];
        const assigneesGroupIds = [];
        if (!itemForAssign.assignees) {
          itemForAssign.assignees = [];
        }
        itemForAssign.assignees.forEach((assignee) => {
          if (assignee.type === 'account') {
            assigneesUserIds.push(assignee.id);
          } else {
            assigneesGroupIds.push(assignee.id);
          }
        });
        const itemAssignees = [];
        const nonAssignees = [];
        _.forIn(reduxState.usersCollection, (o) => {
          if (assigneesUserIds.includes(o.id)) {
            itemAssignees.push(o);
          } else {
            nonAssignees.push(o);
          }
        });
        if (assigneesGroupIds?.length) {
          _.forIn(reduxState.groupsCollection, (o) => {
            if (assigneesGroupIds.includes(o.id)) {
              itemAssignees.push(o);
            }
          });
        }
        setItemAssignees(itemAssignees);
        setNonAssignees(nonAssignees);
      }
    }
  }, [itemForAssign, searchValue]);

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.innerEmptyContainer}>
          <Text style={styles.noteText}>No records found.</Text>
        </View>
      </View>
    );
  }

  async function onItemPress(item, isAdd) {
    let itemAssigneesClone = _.clone(itemAssignees);
    let nonAssigneesClone = _.clone(nonAssignees);
    if (!isAdd) {
      nonAssigneesClone = nonAssigneesClone.filter((o) => o.id !== item.id);
      setNonAssignees(nonAssigneesClone);
      itemAssigneesClone.push(item);
      setItemAssignees(itemAssigneesClone);
      setItemAssigneesId([...itemAssigneesId, item.id]);
    } else {
      itemAssigneesClone = itemAssigneesClone.filter((o) => o.id !== item.id);
      setItemAssignees(itemAssigneesClone);
      setItemAssigneesId([...itemAssigneesId, item.id]);
      nonAssigneesClone.push(item);
      setNonAssignees(nonAssigneesClone);
      const removeId = itemAssigneesId.filter((data) => data !== item.id);
      setItemAssigneesId(removeId);
      if (!isPersonAssign) {
        dispatch(
          eventsAction.removeAssignee({
            conversationId: itemForAssign.conversationId,
            assigneeType: item.type || 'app',
            assigneeId: item.id,
          }),
        );
      }
    }
  }

  function updateUserAssigns() {
    let accountIds = [];
    let appIds = [];
    itemAssignees.forEach((o) => {
      if (o.type === 'account') {
        accountIds.push(o.id);
      } else {
        appIds.push(o.id);
      }
    });

    dispatch(
      eventsAction.updateAssigneData({
        conversationId: itemForAssign.conversationId,
        accountIds: accountIds.join(),
        appIds: appIds.join(),
      }),
    );
  }

  function renderItem(item, isAdd) {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          onItemPress(item, isAdd);
        }}>
        <UserGroupImage item={item} isAssigneesList={true} />
        <View style={styles.nameContainer}>
          <Text>{item.alias || item.name}</Text>
          {item.name && item.open ? (
            <Text style={styles.publicText}>Public</Text>
          ) : null}
        </View>
        <CustomIconsComponent
          name={!isAdd ? 'add-circle' : 'close-circle'}
          size={35}
          color={Colors.primary}
          style={styles.rightIcon}
        />
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      visible={isPersonAssign ? true : !!itemForAssign?.id}
      onRequestClose={() => {
        onRequestClose();
      }}>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          nestedScrollEnabled={true}
          bounces={false}
          style={styles.container}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Assign users/groups to conversation
            </Text>
            <TouchableOpacity
              onPress={() => onRequestClose()}
              style={styles.closeContainer}>
              <CustomIconsComponent
                type={'FontAwesome'}
                name={'close'}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.dataContainer}>
            <TextInput
              placeholder="Search..."
              accessible={true}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.searchContainer}
              onChangeText={(search) => onChangeSearch(search)}
              value={searchValue}
              clearButtonMode={'always'}
              returnKeyType={'search'}
              title={'search'}
            />
            <View style={styles.listsContainer}>
              <View style={styles.flatlistContainer}>
                <FlatList
                  keyboardShouldPersistTaps={'handled'}
                  contentContainerStyle={styles.flatListContentContainer}
                  renderItem={({item}) => renderItem(item)}
                  ListEmptyComponent={renderEmpty}
                  data={nonAssignees}
                  keyExtractor={(item) => `${item.id}`}
                />
              </View>
              <View style={styles.assigneeListContainer}>
                <Text style={styles.assigneeList}>Assignee List</Text>
              </View>
              <View style={styles.flatlistContainer}>
                <FlatList
                  keyboardShouldPersistTaps={'handled'}
                  contentContainerStyle={styles.flatListContentContainer}
                  renderItem={({item}) => renderItem(item, true)}
                  ListEmptyComponent={renderEmpty}
                  data={itemAssignees}
                  keyExtractor={(item) => `${item.id}`}
                />
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={onRequestClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    if (isPersonAssign) {
                      onPressAssign(itemAssigneesId);
                    } else {
                      updateUserAssigns();
                    }
                    onRequestClose();
                  }}>
                  <Text style={styles.buttonText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.secondary,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.white,
    fontSize: 19,
    fontWeight: 'bold',
    flexGrow: 1,
    flexShrink: 1,
  },
  closeContainer: {
    padding: 5,
    alignSelf: 'flex-end',
    marginLeft: 5,
  },
  dataContainer: {
    marginTop: 10,
    padding: 12,
    flex: 1,
  },
  searchContainer: {
    width: GlobalStyles.windowWidth - 24,
    // height: 50,
    borderRadius: 5,
    borderWidth: 0.5,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  searchInput: {
    paddingHorizontal: 5,
  },
  emptyContainer: {
    flex: 1,
  },
  innerEmptyContainer: {
    alignSelf: 'center',
    margin: 30,
  },
  listsContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  assigneeListContainer: {},
  assigneeList: {
    fontSize: 18,
  },
  flatlistContainer: {
    height: GlobalStyles.windowHeight / 2 - 165,
    borderRadius: 5,
    borderWidth: 0.5,
  },
  flatListContentContainer: {
    paddingBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  nameContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  publicText: {
    fontSize: 14,
  },
  rightIcon: {},
});
