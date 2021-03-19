import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import * as React from 'react';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';
import {Popover} from '@ant-design/react-native';
import HTMLView from 'react-native-htmlview';
import {formatAMPM, getUserFromCollection} from '../services/utilities/Misc';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';

export default function CardContainer(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({collections}) => ({
    usersCollection: collections.users,
  }));
  const {item, user} = props;
  const isStarred = item.starred?.includes(user.accountId);
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
      overflow: 'hidden',
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
      marginLeft: 5,
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
    },
    popoverHintContainer: {
      borderTopWidth: 0.5,
      borderTopColor: Colors.primary,
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

  function updateStar() {
    const params = {
      conversationId: item.conversationId,
    };
    dispatch(eventsAction.updateStar(params, isStarred ? 'unstar' : 'star'));
  }

  return (
    <View style={styles.cardContainer}>
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
          </View>
          <View style={styles.topRightContainer}>
            {item.assignees?.length ? (
              <View style={styles.assigneesContainer}>
                {item.assignees.map((assigneesName) => {
                  const user = getUserFromCollection(
                    assigneesName.id,
                    reduxState.usersCollection,
                  );
                  return (
                    user &&
                    user.id && (
                      <View
                        style={styles.assigneeContainer}
                        key={`${assigneesName.id}`}>
                        <Text>{user.id}</Text>
                      </View>
                    )
                  );
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
              <TouchableOpacity style={styles.popoverItemContainer}>
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
          <TouchableOpacity style={styles.assignButtonContainer}>
            <Text style={styles.assignText}>Assign</Text>
            <View
              style={{
                backgroundColor: Colors.primaryText,
                borderRadius: 50,
                height: 20,
                width: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                2
              </Text>
            </View>
          </TouchableOpacity>

          <Popover
            duration={0}
            useNativeDriver={true}
            overlay={
              <View style={styles.approvePopoverContainer}>
                <TouchableOpacity style={styles.menuBottomRightTouchable}>
                  <Text style={styles.menuBottomRightTouchableText}>Lock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuBottomRightTouchable}>
                  <Text style={styles.menuBottomRightTouchableText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuBottomRightTouchableMove}>
                  <Text style={styles.menuBottomRightTouchableText}>
                    Move Post to another app...
                  </Text>
                </TouchableOpacity>
                <View style={styles.menuBottomRightTouchableBan}>
                  <TouchableOpacity style={styles.menuBottomRightTouchable}>
                    <Text style={styles.menuBottomRightTouchableText}>
                      Ban visitor...
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuBottomRightTouchable}>
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
  );
}
