import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import * as React from 'react';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';
import {Popover} from '@ant-design/react-native';
import HTMLView from 'react-native-htmlview';
import {formatAMPM} from '../services/utilities/Misc';
import {eventsAction} from '../store/actions';
import {useDispatch} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';

export default function CardContainer(props) {
  const dispatch = useDispatch();
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
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: -12,
      marginBottom: 12,
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
      justifyContent: 'space-between',
    },
    timeText: {
      color: Colors.primaryText,
    },
    dateContainer: {
      marginLeft: 10,
    },
    menuContainer: {
      flexDirection: 'row',
      padding: 12,
      borderTopWidth: 0.5,
      borderTopColor: Colors.primary,
      backgroundColor: '#f8fafb',
      alignItems: 'center',
    },
    menuLeftSection: {},
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
    },
    checkmarkIcon: {
      marginRight: 5,
    },
    dropdownIcon: {
      marginLeft: 5,
    },
    menuRightSection: {},
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
        <View style={styles.badgeContainer}>
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
          {item.author.alias && (
            <Text style={styles.timeText}>{item.author.alias}</Text>
          )}
          {item.datePublished && (
            <Text style={[styles.timeText, styles.dateContainer]}>
              {formatAMPM(item.datePublished)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.menuLeftSection}></View>
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
              color={item.approved ? Colors.secondary : Colors.red}
              style={styles.checkmarkIcon}
            />
            <Text
              style={[
                styles.approvedLabelTitle,
                !item.approved && {color: Colors.red},
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
        <View style={styles.menuRightSection}></View>
      </View>
    </View>
  );
}
