import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';
import HTMLView from 'react-native-htmlview';
import GlobalStyles from '../constants/GlobalStyles';
import {Popover} from '@ant-design/react-native';
import {useDispatch, useSelector} from 'react-redux';
import {eventsAction} from '../store/actions';
import moment from 'moment';

export default function EventPollCard(props) {
  const dispatch = useDispatch();
  const {item, user, setEventActionLoader} = props;
  const [toggleVotingOptions, setToggleVotingOptions] = useState(false);
  const reduxState = useSelector(({auth}) => ({
    appId: auth.selectedEvent.id,
  }));

  const publishUnpublishHandler = async () => {
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

  const deletePoll = () => {
    const params = {
      postId: item.id,
    };

    Alert.alert('Are you sure ?', 'You want to delete this Poll ?', [
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

  const closeVotingHandler = async () => {
    setEventActionLoader(true);
    const params = {
      postId: item.id,
      endDate: item.votingOpen ? moment().unix() : 0,
    };
    await dispatch(eventsAction.closePollVotingAction(params));
    setEventActionLoader(false);
  };

  const voteHandler = async (attachmentId) => {
    const params = {
      postId: item.id,
      targetId: attachmentId,
      targetType: 'attachment',
    };
    await dispatch(eventsAction.votingAction(params));
  };

  function pinToTop() {
    const params = {
      postId: item.id,
      appId: reduxState.appId,
    };
    dispatch(eventsAction.pinToTop(params));
  }

  const totalVotesCount = item.attachments.reduce(
    (total, currentValue) => (total = total + currentValue.votes),
    0,
  );

  const findCurrentUserVoted = item.attachments.find(
    (att) => att.voted === true,
  );

  const isMyPost = item.author.id === user.accountId;

  return (
    <>
      <View style={styles.cardContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <View style={styles.topLeftContainer}>
              <View style={styles.countContainer(item.approved)}>
                <Text style={styles.countText}>
                  {item.type}
                  {item.count}
                </Text>
                <Text style={styles.activePollText}>
                  {item.approved ? 'Active Poll' : 'inactive poll'}
                </Text>
              </View>
            </View>

            <View style={styles.topRightContainer}>
              <View style={styles.assigneesContainer(item.votingOpen)}>
                <Text style={styles.votingText(item.votingOpen)}>
                  {item.votingOpen ? 'Voting Open' : 'Voting Closed'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            {/* <Text style={styles.contentText}>{item.content}</Text> */}
            <HTMLView value={item.content} stylesheet={styles} />
          </View>

          {!toggleVotingOptions ? (
            <View style={styles.pollOptionMainContainer}>
              {item.attachments.map((attach, index) => (
                <View key={index} style={styles.pollOptionWrapper}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <View
                      style={styles.pollOptionContainer(
                        attach.votes,
                        attach.percentage,
                      )}>
                      <View style={styles.pollOptionIcon}>
                        <CustomIconsComponent
                          name={'checkcircleo'}
                          type={'AntDesign'}
                          size={20}
                          color={attach.votes > 0 ? '#5BE0E7' : '#B0C2CC'}
                        />
                      </View>
                      <Text style={styles.pollOptionText}>{attach.desc}</Text>
                    </View>

                    <View
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 7,
                      }}>
                      {attach.votes > 0 ? (
                        <View style={{}}>
                          <Text style={styles.pollOptionPercentage}>
                            {attach.percentage}%
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.pollOptionMainContainer}>
              {item.attachments.map((attach, index) => (
                <View key={index} style={styles.pollOptionWrapper}>
                  <TouchableOpacity
                    style={styles.pollOptionVotingEnableContainer}
                    onPress={() => voteHandler(attach.id)}>
                    <View style={styles.pollOptionIcon}>
                      <CustomIconsComponent
                        name={'checkcircleo'}
                        type={'AntDesign'}
                        size={20}
                        color={attach.votes > 0 ? '#5BE0E7' : '#B0C2CC'}
                      />
                    </View>
                    <Text style={styles.pollOptionText}>{attach.desc}</Text>
                  </TouchableOpacity>

                  {attach.votes > 0 ? (
                    <Text style={styles.pollOptionPercentage}>
                      {attach.percentage}%
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          <View style={styles.voteContainer}>
            <Text style={styles.voteCount}>{totalVotesCount} votes</Text>
            <Text style={styles.voteText}>
              {' '}
              - Voting is open until manually closed
            </Text>
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

          <View style={styles.voteActionContainer}>
            <TouchableOpacity onPress={closeVotingHandler}>
              <Text style={styles.voteActionRightText}>
                {item.votingOpen ? 'Close voting' : 'Open voting'}
              </Text>
            </TouchableOpacity>
            {findCurrentUserVoted !== undefined ? (
              <View>
                <Text style={styles.alreadyVotedActionLeftText}>
                  You voted already
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setToggleVotingOptions(!toggleVotingOptions)}>
                <Text style={styles.voteActionLeftText}>
                  {!toggleVotingOptions ? 'I want to vote' : 'Cancel'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Popover
            duration={0}
            useNativeDriver={true}
            overlay={
              <View
                style={{
                  width: 160,
                }}>
                <TouchableOpacity
                  style={styles.popoverItemContainer}
                  onPress={() => publishUnpublishHandler()}>
                  <Text style={styles.popoverItem}>
                    {item.approved ? 'Unpublish' : 'Publish'}
                  </Text>
                </TouchableOpacity>
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
                {item.approved ? 'Publish' : 'Unpublish'}
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
            <Popover
              duration={0}
              useNativeDriver={true}
              overlay={
                <View style={styles.approvePopoverContainer}>
                  <TouchableOpacity style={styles.menuBottomRightTouchable}>
                    <Text style={styles.menuBottomRightTouchableText}>
                      Clone
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.menuBottomRightTouchable,
                      !isMyPost && styles.disabledItem,
                    ]}
                    disabled={!isMyPost}>
                    <Text style={styles.menuBottomRightTouchableText}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  {item.approved ? (
                    <TouchableOpacity
                      style={styles.menuBottomRightTouchable}
                      onPress={() => pinToTop()}>
                      <Text style={styles.menuBottomRightTouchableText}>
                        Pin to top of stream
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
                      onPress={deletePoll}>
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
      </View>
    </>
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
  countContainer: (active) => ({
    flexDirection: 'row',
    backgroundColor: active ? '#7CD219' : Colors.primaryText,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  }),
  countText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
    marginHorizontal: 15,
  },
  activePollText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
    marginRight: 5,
    textTransform: 'uppercase',
  },
  topRightContainer: {
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'hidden',
  },
  assigneesContainer: (votingOpen) => ({
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: votingOpen ? '#1ec8d1' : '#f15c87',
    paddingHorizontal: 8,
    borderRadius: 4,
  }),
  votingText: (votingOpen) => ({
    color: votingOpen ? '#1ec8d1' : '#f15c87',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
  }),
  content: {
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
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
  popoverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmarkIcon: {
    marginRight: 5,
  },
  approvedLabelTitle: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  unApprovedLabelTitle: {
    color: Colors.unapproved,
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  menuBottomRightTouchable: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disabledItem: {
    opacity: 0.5,
  },
  menuBottomRightTouchableText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
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
  pollOptionMainContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  pollOptionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pollOptionContainer: (votes, percentage) => ({
    flexDirection: 'row',
    backgroundColor: votes > 0 ? '#DEEAEF' : null,
    width: votes > 0 ? `${percentage}%` : null,
    borderWidth: votes > 0 ? 1 : 0,
    borderColor: votes > 0 ? '#DEEAEF' : null,
    borderRadius: 2,
    marginBottom: 8,
    padding: 5,
    // marginRight: 15,
  }),
  pollOptionVotingEnableContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: '#DEEAEF',
    borderRadius: 2,
    marginBottom: 8,
    padding: 5,
    marginRight: 15,
  },
  pollOptionIcon: {
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  pollOptionText: {
    color: '#8ba5b4',
    fontSize: 15,
    fontWeight: '600',
  },
  pollOptionPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8ba5b4',
    marginRight: 8,
  },
  voteContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  voteCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  voteText: {
    fontWeight: 'normal',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  voteActionContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  voteActionRightText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8ba5b4',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    marginRight: 15,
  },
  alreadyVotedActionLeftText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#79DEE4',
  },
  voteActionLeftText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#8ba5b4',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
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
});
