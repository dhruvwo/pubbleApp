import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';
import {Popover} from '@ant-design/react-native';
import HTMLView from 'react-native-htmlview';
import {formatAMPM, getUserInitals} from '../services/utilities/Misc';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';
import FastImage from 'react-native-fast-image';
import LocalIcons from '../constants/LocalIcons';

export default function CardContainer(props) {
  const [lockUnlockButton, setLockUnlockButton] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector(({collections}) => ({
    usersCollection: collections.users,
    groupsCollection: collections.groups,
  }));
  const {item, user, onAssignPress, setEventActionLoader} = props;
  const isStarred = item.starred?.includes(user.accountId);
  const cardLockedByAssignee = item.assignees?.find(
    (assi) => assi.assignMethod === 'lock',
  );
  const lockUnlockString = cardLockedByAssignee?.id
    ? cardLockedByAssignee?.id === user.accountId
      ? 'unlock'
      : 'locked'
    : 'lock';

  async function updateStar() {
    setEventActionLoader(true);
    const params = {
      conversationId: item.conversationId,
    };
    const reducerParam = {
      conversationId: item.conversationId,
      userId: user.accountId,
      type: isStarred ? 'unstar' : 'star',
    };
    await dispatch(
      eventsAction.updateStar(
        params,
        isStarred ? 'unstar' : 'star',
        reducerParam,
      ),
    );
    setEventActionLoader(false);
  }

  const approveUnapprove = async () => {
    setEventActionLoader(true);
    const apiUrlSLug = item.approved ? 'unapprove' : 'approve';
    const params = {
      postId: item.id,
    };
    await dispatch(
      eventsAction.approveDisapproveStreamData(params, apiUrlSLug),
    );
    setEventActionLoader(false);
  };

  const closeStream = async () => {
    setEventActionLoader(true);
    const params = {
      conversationId: item.conversationId,
    };
    await dispatch(eventsAction.closeStreamData(params));
    setEventActionLoader(false);
  };
  const LockUnlock = async () => {
    setEventActionLoader(true);
    setLockUnlockButton(true);
    const params = {
      conversationId: item.conversationId,
    };
    await dispatch(eventsAction.lockStream(params, lockUnlockString));
    setLockUnlockButton(false);
    setEventActionLoader(false);
  };

  const deleteEvent = () => {
    const params = {
      postId: item.id,
    };

    Alert.alert('Are you sure ?', 'You want to delete this card ?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setEventActionLoader(true);
          await dispatch(eventsAction.deleteStreamData(params));
          setEventActionLoader(false);
        },
      },
    ]);
  };

  function renderInnerPart() {
    return (
      <>
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <View style={styles.topLeftContainer}>
              <TouchableOpacity
                onPress={() => updateStar()}
                style={styles.starSpaceContainer(isStarred)}>
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
              {item.privatePost && (
                <View style={styles.buttonContainer}>
                  <CustomIconsComponent
                    name={'eye-off'}
                    size={18}
                    color={'white'}
                  />
                </View>
              )}
            </View>
            <View style={styles.topRightContainer}>
              {item.assignees?.length ? (
                <View style={styles.assigneesContainer}>
                  {item.assignees.map((assignee) => {
                    if (
                      assignee.type === 'account' &&
                      reduxState.usersCollection
                    ) {
                      const user = reduxState.usersCollection[assignee.id];
                      if (user && user.id && user.alias) {
                        return (
                          <View
                            key={`${user.id}`}
                            style={[
                              styles.assigneeContainer,
                              assignee.assignMethod === 'lock'
                                ? styles.lockedCard
                                : {},
                            ]}>
                            {assignee.assignMethod === 'lock' && (
                              <>
                                <View style={styles.lockIconContainer}>
                                  <CustomIconsComponent
                                    type={'Entypo'}
                                    name={'lock'}
                                    size={styles.lockIcon.lineHeight}
                                    style={styles.lockIcon}
                                  />
                                </View>
                                <View style={styles.iconBorder} />
                              </>
                            )}
                            {user.avatar ? (
                              <FastImage
                                style={[styles.assigneeImage]}
                                source={{
                                  uri: user.avatar,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            ) : (
                              <View
                                style={[
                                  styles.assigneeTextContainer,
                                  styles.initialsContainer,
                                ]}>
                                <Text
                                  style={[
                                    styles.nameText,
                                    styles.initialsText,
                                  ]}>
                                  {getUserInitals(user)}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      }
                    } else if (assignee.type === 'app') {
                      const group = reduxState.groupsCollection[assignee.id];
                      if (group) {
                        return (
                          <View
                            key={`${group.id}`}
                            style={[
                              styles.assigneeTextContainer,
                              styles.groupNameContainer,
                            ]}>
                            <Text style={styles.nameText}>{group.name}</Text>
                          </View>
                        );
                      }
                    }
                    return null;
                  })}
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.content}>
            {/* <Text style={styles.contentText}>{item.content}</Text> */}
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
        <View style={styles.menuContainer}>
          <Popover
            duration={0}
            useNativeDriver={true}
            overlay={
              <View style={styles.approvePopoverContainer}>
                <TouchableOpacity
                  style={styles.popoverItemContainer}
                  onPress={approveUnapprove}>
                  <Text style={styles.popoverItem}>
                    {item.approved ? 'Unapprove' : 'Approve'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.popoverHintContainer}>
                  <Text style={styles.popoverHint}>
                    {item.approved
                      ? 'Unapproving will remove post from the app widge'
                      : 'Approving will make post visible to visitors'}
                  </Text>
                </View>
              </View>
            }
            placement={'bottom'}>
            <View style={styles.popoverContainer}>
              <CustomIconsComponent
                name={item.approved ? 'check-circle' : 'close-circle'}
                type={'MaterialCommunityIcons'}
                size={16}
                color={item.approved ? Colors.secondary : Colors.unapproved}
                style={styles.checkmarkIcon}
              />
              <Text
                style={[
                  styles.approvedLabelTitle,
                  !item.approved && styles.unApprovedLabelTitle,
                ]}>
                {item.approved ? 'Approved' : 'Unapproved'}
              </Text>
              <CustomIconsComponent
                type={'Entypo'}
                name={'chevron-down'}
                size={15}
                color={styles.approvedLabelTitle.color}
                style={styles.dropdownIcon}
              />
            </View>
          </Popover>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={styles.assignButtonContainer}
              onPress={onAssignPress}>
              <Text style={styles.assignText}>Assign</Text>
              {item.assignees?.length ? (
                <View style={styles.assignCountContainer}>
                  <Text style={styles.assignCount}>
                    {item.assignees.length}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>

            <Popover
              duration={0}
              useNativeDriver={true}
              overlay={
                <View style={styles.approvePopoverContainer}>
                  <TouchableOpacity
                    style={styles.menuBottomRightTouchable}
                    onPress={LockUnlock}
                    disabled={
                      lockUnlockString === 'locked' || lockUnlockButton
                    }>
                    <Text style={styles.menuBottomRightTouchableText}>
                      {lockUnlockString}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuBottomRightTouchable}
                    onPress={closeStream}>
                    <Text style={styles.menuBottomRightTouchableText}>
                      Close
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={styles.menuBottomRightTouchableMove}>
                  <Text style={styles.menuBottomRightTouchableText}>
                    Move Post to another app...
                  </Text>
                </TouchableOpacity> */}
                  <View style={styles.menuBottomRightTouchableBan}>
                    <TouchableOpacity style={styles.menuBottomRightTouchable}>
                      <Text style={styles.menuBottomRightTouchableText}>
                        Ban visitor...
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuBottomRightTouchable}
                      onPress={deleteEvent}>
                      <Text style={styles.menuBottomRightTouchableText}>
                        Delete...
                      </Text>
                    </TouchableOpacity>
                  </View>
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
          </View>
        </View>
      </>
    );
  }

  return cardLockedByAssignee ? (
    <ImageBackground
      source={LocalIcons.pngIconSet.lockedCardBg}
      resizeMode={'repeat'}
      style={[styles.cardContainer]}>
      {renderInnerPart()}
    </ImageBackground>
  ) : (
    <View style={[styles.cardContainer]}>{renderInnerPart()}</View>
  );
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
  },
  topRightContainer: {
    flexGrow: 1,
    flexShrink: 1,
    // overflow: 'hidden',
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
  assigneeContainer: {
    minWidth: 28,
    minHeight: 28,
    marginLeft: 7,
  },
  lockedCard: {
    backgroundColor: Colors.primaryInactive,
    position: 'relative',
    borderRadius: 3,
    padding: 3,
    borderWidth: 0.3,
    zIndex: 1,
  },
  assigneeImage: {
    zIndex: 2,
    minWidth: 28,
    minHeight: 28,
  },
  lockIconContainer: {
    position: 'absolute',
    zIndex: 4,
    padding: 1.5,
    top: -7,
    right: -7,
    borderRadius: 3,
    backgroundColor: Colors.primaryInactive,
  },
  iconBorder: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: -1,
    height: 17,
    width: 17,
    borderWidth: 0.25,
    borderRadius: 3,
  },
  lockIcon: {
    lineHeight: 12,
  },
  assigneeTextContainer: {
    minWidth: 28,
    minHeight: 28,
    justifyContent: 'center',
    borderRadius: 3,
  },
  initialsContainer: {
    backgroundColor: Colors.usersBg,
  },
  groupNameContainer: {
    backgroundColor: Colors.groupColor,
    marginLeft: 7,
  },
  nameText: {
    color: Colors.white,
    paddingHorizontal: 3,
    paddingVertical: 1,
    textAlign: 'center',
  },
  initialsText: {
    textTransform: 'uppercase',
  },
  countText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
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
  dateContainer: {
    marginLeft: 10,
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
  popoverItemContainer: {
    padding: 12,
  },
  popoverItem: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: '600',
  },
  popoverHintContainer: {
    borderTopWidth: 1,
    borderTopColor: '#dfe5e9',
    backgroundColor: Colors.primaryTilt,
    padding: 12,
  },
  popoverHint: {
    color: Colors.primaryText,
  },
  popoverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approvedIcon: {},
  approvedLabelTitle: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  assignButtonContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  assignText: {
    color: Colors.primaryText,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5,
  },
  assignCountContainer: {
    backgroundColor: Colors.primaryText,
    borderRadius: 50,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  unApprovedLabelTitle: {
    color: Colors.unapproved,
  },
  checkmarkIcon: {
    marginRight: 5,
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
    textTransform: 'capitalize',
  },
  menuBottomRightTouchableMove: {
    borderTopWidth: 1,
    borderTopColor: '#dfe5e9',
    backgroundColor: '#fff',
    padding: 12,
  },
  menuBottomRightTouchableBan: {
    borderTopWidth: 1,
    borderTopColor: '#dfe5e9',
    backgroundColor: '#fff',
  },
});
