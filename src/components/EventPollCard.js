import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';
import HTMLView from 'react-native-htmlview';
import GlobalStyles from '../constants/GlobalStyles';
import {Popover} from '@ant-design/react-native';
import {useDispatch} from 'react-redux';
import {eventsAction} from '../store/actions';

export default function EventPollCard(props) {
  const dispatch = useDispatch();
  const {item, user, setEventActionLoader} = props;

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
            {item.votingOpen ? (
              <View style={styles.topRightContainer}>
                <View style={styles.assigneesContainer}>
                  <Text style={styles.votingText}>Voting Open</Text>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.content}>
            {/* <Text style={styles.contentText}>{item.content}</Text> */}
            <HTMLView value={item.content} stylesheet={styles} />
          </View>

          <View style={styles.pollOptionMainContainer}>
            {item.attachments.map((attach, index) => (
              <View key={index} style={styles.pollOptionContainer}>
                <CustomIconsComponent
                  name={'checkcircleo'}
                  type={'AntDesign'}
                  size={20}
                  color={'#B0C2CC'}
                  style={styles.pollOptionIcon}
                />
                <Text style={styles.pollOptionText}>{attach.desc}</Text>
              </View>
            ))}
          </View>

          <View style={styles.voteContainer}>
            <Text style={styles.voteCount}>{item.votes} votes</Text>
            <Text style={styles.voteText}>
              {' '}
              - Voting is open until manually closed
            </Text>
          </View>

          <View style={styles.voteActionContainer}>
            <TouchableOpacity>
              <Text style={styles.voteActionRightText}>Close voting</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.voteActionLeftText}>I want to vote</Text>
            </TouchableOpacity>
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
                  <TouchableOpacity style={styles.menuBottomRightTouchable}>
                    <Text style={styles.menuBottomRightTouchableText}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  {item.approved ? (
                    <TouchableOpacity style={styles.menuBottomRightTouchable}>
                      <Text style={styles.menuBottomRightTouchableText}>
                        Pin to top of stream
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity style={styles.menuBottomRightTouchableMove}>
                    <Text style={styles.menuBottomRightTouchableText}>
                      Move Post to another app...
                    </Text>
                  </TouchableOpacity>
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
  assigneesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: '#1ec8d1',
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  votingText: {
    color: '#1ec8d1',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
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
  pollOptionContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  pollOptionText: {
    color: '#8ba5b4',
    fontSize: 15,
    fontWeight: '600',
  },
  voteContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
  voteActionLeftText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#8ba5b4',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
