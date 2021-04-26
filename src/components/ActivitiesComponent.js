import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';
import UserGroupImage from '../components/UserGroupImage';
import HTMLView from 'react-native-htmlview';
import {formatAMPM} from '../services/utilities/Misc';
import {useDispatch, useSelector} from 'react-redux';
import {eventsAction} from '../store/actions';
import GifSpinner from '../components/GifSpinner';

export default function ActivitiesComponent(props) {
  const {data, navigation} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, collections}) => ({
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
    communityId: auth.community?.community?.id,
  }));
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [activityTotal, setActivityTotal] = useState(1);
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);

  useEffect(() => {
    if (data.author.cookieId !== null || data.author.cookieId !== undefined) {
      getVisitor();
    } else {
      setActivityData(data);
    }
  }, []);

  async function getVisitor() {
    const res = await dispatch(
      eventsAction.chatmenuStreamVisitor({
        postTypes: 'Q,U,M',
        visitorId: data.author.id,
        communityId: reduxState.communityId,
        cookieId: data.author.cookieId,
      }),
    );

    if (res !== null) {
      setActivityData(res.data);
      setActivityTotal(res.total);
      setActivityCurrentPage(res.currentPage);
    } else {
      setActivityData([data]);
      setActivityTotal(1);
      setActivityCurrentPage(1);
    }
  }

  function renderFooter() {
    if (!activityData?.length) {
      return null;
    }
    return !isLoadMoreLoader && activityTotal === activityData?.length ? (
      <View>
        <Text
          style={{
            textAlign: 'center',
            margin: 12,
          }}>
          End of list
        </Text>
      </View>
    ) : (
      <GifSpinner />
    );
  }

  function renderEmpty() {
    return isLoading ? (
      <GifSpinner />
    ) : (
      <View style={styles.emptyContainer}>
        <View style={styles.innerEmptyContainer}>
          <Text style={styles.noteText}>No records found.</Text>
        </View>
      </View>
    );
  }

  async function loadMoredata() {
    setIsLoadMoreLoader(true);
    if (activityTotal > activityData?.length) {
      const loadMoreRes = await dispatch(
        eventsAction.chatmenuStreamVisitor({
          postTypes: 'Q,U,M',
          visitorId: data.author.id,
          communityId: reduxState.communityId,
          cookieId: data.author.cookieId,
          pageNumber: activityCurrentPage + 1,
        }),
      );
      setActivityData([...activityData, ...loadMoreRes.data]);
      setActivityCurrentPage(loadMoreRes.currentPage);
    }
    setIsLoadMoreLoader(false);
  }

  function onMomentumScrollEnd({nativeEvent}) {
    if (
      !isLoadMoreLoader &&
      activityTotal > activityData?.length &&
      nativeEvent.contentSize.height -
        (nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height) <=
        400
    ) {
      loadMoredata();
    }
  }

  function onClickActivityCardHandler(item) {
    dispatch(eventsAction.updateCurrentCard(item));
    navigation.goBack();
  }

  function renderItem({item}) {
    return (
      <TouchableOpacity
        style={styles.cardContauber}
        onPress={() => onClickActivityCardHandler(item)}>
        <View style={styles.pubbleUsersConatiner}>
          <View style={styles.questionContentMainContainer}>
            <View style={styles.questionContentView}>
              <Text style={styles.questionContentText}>
                {item.type}
                {item.count}
              </Text>
            </View>
          </View>

          <View style={styles.userGroupContainer}>
            {item.assignees?.length &&
              item.assignees.map((assignee) => {
                return (
                  <UserGroupImage
                    key={`${assignee.id}`}
                    users={reduxState.usersCollection}
                    groups={reduxState.groupsCollection}
                    imageSize={30}
                    item={assignee}
                  />
                );
              })}
          </View>
        </View>

        <HTMLView
          stylesheet={htmlStyle()}
          value={`<div>${item.content}</div>`}
        />

        <Text style={styles.questionContentDate}>
          {formatAMPM(item.datePublished)}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.activityPubbleUsersText}>
          user activity with pubble
        </Text>

        <View style={styles.dividerStyleMainContainer}>
          <View style={styles.dividerStyle1}></View>
          <View style={styles.dividerStyle2}></View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.activitiesMainContainer}>
      <FlatList
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={renderEmpty}
        onMomentumScrollEnd={onMomentumScrollEnd}
        data={activityData}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  activitiesMainContainer: {
    paddingVertical: 20,
  },
  headerContainer: {
    marginBottom: 10,
  },
  onlineVisitorText: {
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
    flexGrow: 1,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
  },
  flatListContainer: {
    paddingHorizontal: 20,
  },
  activityPubbleUsersMainContainer: {
    // marginTop: 70,
  },
  activityPubbleUsersText: {
    color: Colors.primaryText,
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardContauber: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryText,
  },
  pubbleUsersConatiner: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  questionContentMainContainer: {
    flexDirection: 'row',
  },
  questionContentView: {
    backgroundColor: Colors.primaryText,
    paddingHorizontal: 3,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 8,
  },
  questionContentText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  userGroupContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    flexShrink: 1,
  },
  questionContentDate: {
    marginTop: 10,
    color: Colors.primaryText,
    marginBottom: 8,
  },
});

const htmlStyle = StyleSheet.create(() => {
  return {
    div: {
      color: 'black',
    },
    span: {
      fontWeight: 'bold',
    },
    a: {
      color: Colors.white,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    account: {
      fontWeight: 'bold',
    },
  };
});
