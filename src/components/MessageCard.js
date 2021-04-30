import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';
import {Popover} from '@ant-design/react-native';
import HTMLView from 'react-native-htmlview';
import {formatAMPM} from '../services/utilities/Misc';
import {eventsAction, myInboxAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';
import UserGroupImage from './UserGroupImage';
import Attachments from './Attachments';

export default function MessageCard(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({collections, auth}) => ({
    usersCollection: collections.users,
    groupsCollection: collections.groups,
    communityId: auth.community?.community?.id,
    selectedEvent: auth.events[auth.selectedEventIndex],
  }));
  const {
    item,
    user,
    setEventActionLoader,
    onPressCard,
    renderLabel,
    isMyInbox,
  } = props;
  let isPinned;
  if (reduxState.selectedEvent?.pinnedPosts === null) {
    isPinned = false;
  } else {
    isPinned = reduxState.selectedEvent?.pinnedPosts?.includes(item.id);
  }

  function updateStar() {
    setEventActionLoader(true);
    const params = {
      conversationId: item.conversationId,
    };
    const reducerParam = {
      conversationId: item.conversationId,
      userId: user.accountId,
      type: item.star ? 'unstar' : 'star',
    };
    if (isMyInbox) {
      dispatch(
        myInboxAction.updateStar(
          params,
          item.star ? 'unstar' : 'star',
          reducerParam,
        ),
      );
    } else {
      dispatch(
        eventsAction.updateStar(
          params,
          item.star ? 'unstar' : 'star',
          reducerParam,
        ),
      );
    }
    setEventActionLoader(false);
  }

  const onPublishPost = async () => {
    const params = {
      postId: item.id,
    };
    if (item.status === 0) {
      await dispatch(eventsAction.restorePost(params));
    } else {
      if (item.approved) {
        await dispatch(eventsAction.moveToDraft(params));
      } else {
        await dispatch(eventsAction.publishPost(params));
      }
    }
  };

  function onMoveToTrashAlert() {
    Alert.alert('Are you sure?', 'You want to delete this post?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: onMoveToTrash,
      },
    ]);
  }

  const onMoveToTrash = async () => {
    const params = {
      postId: item.id,
    };
    await dispatch(eventsAction.moveToTrash(params));
  };

  const onPermanentlyDelete = async () => {
    Alert.alert('Are you sure?', 'You want to permanentl delete this post?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: deletePost,
      },
    ]);
  };

  const deletePost = async () => {
    const params = {
      postId: item.id,
    };
    await dispatch(eventsAction.permanentlyDelete(params));
  };

  const onPinTop = async () => {
    const params = {
      postId: item.id,
      appId: item.appId,
    };
    if (!isPinned) {
      await dispatch(eventsAction.pinToTop(params));
    } else {
      await dispatch(eventsAction.unPinPost(params));
    }
  };

  function renderInnerPart() {
    return (
      <>
        <TouchableOpacity onPress={() => onPressCard()}>
          <View style={styles.contentContainer}>
            <View style={styles.topContainer}>
              <View style={styles.topLeftContainer}>
                <TouchableOpacity
                  onPress={() => updateStar()}
                  style={styles.starSpaceContainer(item.star)}>
                  <CustomIconsComponent
                    type={'AntDesign'}
                    name={'star'}
                    color={'white'}
                    size={20}
                  />
                </TouchableOpacity>
                <View style={styles.countContainer}>
                  <Text style={styles.countText}>
                    {item.type}
                    {item.count}
                  </Text>
                </View>
                {item.privatePost && (
                  <View style={styles.buttonContainer}>
                    <CustomIconsComponent
                      name={'eye-off'}
                      size={18}
                      color={'white'}
                    />
                  </View>
                )}
                {isPinned && (
                  <View style={styles.pinStyle}>
                    <CustomIconsComponent
                      type={'Entypo'}
                      name={'pin'}
                      color={'white'}
                      size={20}
                    />
                  </View>
                )}
                {renderLabel}
              </View>
              <View style={styles.topRightContainer}>
                {item.assignees?.length ? (
                  <View style={styles.assigneesContainer}>
                    {item.assignees.map((assignee) => {
                      return (
                        <UserGroupImage
                          key={`${assignee.id}`}
                          users={reduxState.usersCollection}
                          groups={reduxState.groupsCollection}
                          item={assignee}
                          lockId={item.lockId}
                        />
                      );
                    })}
                  </View>
                ) : null}
              </View>
            </View>
            <View style={styles.content}>
              {item.attachments?.length > 0 ? (
                <Attachments attachments={item.attachments} />
              ) : null}
              <HTMLView value={item.content} stylesheet={styles} />
            </View>
            {item.tags?.length ? (
              <View style={styles.tagsContainer}>
                {item.tags.map((tagName) => {
                  return (
                    <View style={styles.tagContainer} key={tagName}>
                      <Text style={styles.tagText}>{tagName}</Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
            <View style={styles.timeContainer}>
              {item.author.phone ||
              (item.author.email && item.author.email !== 'anon@pubble.co') ? (
                <CustomIconsComponent
                  type={'AntDesign'}
                  name={'contacts'}
                  size={18}
                  style={styles.timeText}
                />
              ) : null}
              {item.author.title && (
                <HTMLView
                  stylesheet={{
                    div: styles.timeText,
                  }}
                  value={`<div>${item.author.title}</div>`}
                />
              )}
              {item.author.alias && (
                <Text style={styles.timeText}>{item.author.alias}</Text>
              )}
              {item.datePublished && (
                <Text style={[styles.timeText]}>
                  {formatAMPM(item.datePublished)}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.menuContainer}>
          <View
            style={{
              flexDirection: 'row',
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}>
            {(!item.approved || item.status === 0) && (
              <TouchableOpacity
                style={styles.assignButtonContainer}
                onPress={onPublishPost}>
                <CustomIconsComponent
                  style={styles.iconStyle}
                  type={'AntDesign'}
                  name={'checkcircleo'}
                  color={Colors.primaryText}
                  size={18}
                />
                <Text style={styles.assignText}>Publish this post</Text>
              </TouchableOpacity>
            )}
            {(item.approved || item.status === 0) && (
              <TouchableOpacity
                style={styles.assignButtonContainer}
                onPress={onPublishPost}>
                <CustomIconsComponent
                  style={styles.iconStyle}
                  type={'Feather'}
                  name={'edit'}
                  color={Colors.primaryText}
                  size={18}
                />
                <Text style={styles.assignText}>Move to draft</Text>
              </TouchableOpacity>
            )}

            {item.status !== 0 && (
              <TouchableOpacity
                style={styles.assignButtonContainer}
                onPress={onMoveToTrashAlert}>
                <CustomIconsComponent
                  style={styles.iconStyle}
                  type={'Ionicons'}
                  name={'trash-bin-sharp'}
                  color={Colors.primaryText}
                  size={18}
                />
                <Text style={styles.assignText}>Move to Trash</Text>
              </TouchableOpacity>
            )}
            {(item.approved || item.status === 0) && (
              <Popover
                duration={0}
                useNativeDriver={true}
                placement={'top'}
                overlay={
                  <View style={styles.approvePopoverContainer}>
                    {item.approved && item.status !== 0 && (
                      <TouchableOpacity
                        style={styles.menuBottomRightTouchable}
                        onPress={onPinTop}>
                        <Text style={styles.menuBottomRightTouchableText}>
                          {isPinned ? 'Unpin' : 'Pin'} to top of stream
                        </Text>
                      </TouchableOpacity>
                    )}
                    {item.status === 0 && (
                      <TouchableOpacity
                        style={styles.menuBottomRightTouchable}
                        onPress={onPermanentlyDelete}>
                        <Text style={styles.menuBottomRightTouchableText}>
                          Permanently Delete
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                }
                placement={'bottom'}>
                <View style={styles.popoverContainer}>
                  <CustomIconsComponent
                    type={'Entypo'}
                    name={'dots-three-horizontal'}
                    size={15}
                    color={styles.approvedLabelTitle.color}
                    style={styles.dropdownIcon}
                  />
                </View>
              </Popover>
            )}
          </View>
        </View>
      </>
    );
  }

  return <View style={[styles.cardContainer]}>{renderInnerPart()}</View>;
}

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 12,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 3,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topLeftContainer: {
    flexDirection: 'row',
    marginLeft: -12,
    marginBottom: 12,
    flexGrow: 1,
    zIndex: 1000,
  },
  topRightContainer: {
    flexGrow: 1,
    flexShrink: 1,
    zIndex: 10,
    overflow: 'hidden',
    padding: 10,
    margin: -10,
    paddingLeft: 20,
  },
  starSpaceContainer: (isActive) => ({
    backgroundColor: Colors.primaryText,
    width: 32,
    height: '100%',
    backgroundColor: isActive ? Colors.tertiary : Colors.primaryText,
    padding: 5,
  }),
  countContainer: {
    backgroundColor: Colors.primaryText,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  buttonContainer: {
    backgroundColor: Colors.primaryText,
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  assigneesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  countText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    marginBottom: 12,
  },
  tagsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tagContainer: {
    borderRadius: 50,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 4,
    marginRight: 4,
    borderWidth: 1,
    borderColor: Colors.primaryText,
  },
  tagText: {
    color: Colors.primaryText,
  },
  timeContainer: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  timeText: {
    color: Colors.primaryText,
    marginRight: 10,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#dfe5e9',
    backgroundColor: '#f8fafb',
    alignItems: 'center',
  },
  approvePopoverContainer: {
    maxWidth: GlobalStyles.windowWidth * 0.6,
  },
  popoverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approvedLabelTitle: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  assignButtonContainer: {
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  assignText: {
    color: Colors.primaryText,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 2,
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  menuBottomRightTouchable: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuBottomRightTouchableText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  iconStyle: {
    paddingHorizontal: 4,
  },
  pinStyle: {
    backgroundColor: '#FEC241',
    marginHorizontal: 10,
    padding: 5,
  },
});
