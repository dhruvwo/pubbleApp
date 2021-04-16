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
import {formatAMPM} from '../services/utilities/Misc';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';
import LocalIcons from '../constants/LocalIcons';
import UserGroupImage from './UserGroupImage';
import Attachments from './Attachments';

export default function QuestionCard(props) {
  const [lockUnlockButton, setLockUnlockButton] = useState(false);
  const dispatch = useDispatch();
  const reduxState = useSelector(({collections, auth}) => ({
    usersCollection: collections.users,
    groupsCollection: collections.groups,
    communityId: auth.community?.community?.id,
  }));
  const {item, user, onAssignPress, setEventActionLoader, onPressCard} = props;

  const lockUnlockString = item.lockId
    ? item.lockId === user.accountId
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
      type: item.star ? 'unstar' : 'star',
    };
    await dispatch(
      eventsAction.updateStar(
        params,
        item.star ? 'unstar' : 'star',
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

  async function banVisitor() {
    await dispatch(
      eventsAction.banVisitor({
        communityId: reduxState.communityId,
        type: 'ip',
        value: item.author.ip,
      }),
    );
  }

  const deleteEvent = () => {
    const params = {
      postId: item.id,
    };

    Alert.alert('Are you sure?', 'You want to delete this post?', [
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
                  {props.activeTab.title !== 'Closed' ? (
                    <TouchableOpacity
                      style={styles.menuBottomRightTouchable}
                      onPress={closeStream}>
                      <Text style={styles.menuBottomRightTouchableText}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  {/* <TouchableOpacity style={styles.menuBottomRightTouchableMove}>
                  <Text style={styles.menuBottomRightTouchableText}>
                    Move Post to another app...
                  </Text>
                </TouchableOpacity> */}
                  <View style={styles.menuBottomRightTouchableBan}>
                    <TouchableOpacity
                      style={styles.menuBottomRightTouchable}
                      onPress={banVisitor}>
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
      </TouchableOpacity>
    );
  }

  return item.lockId || item.closeTime > 0 ? (
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
