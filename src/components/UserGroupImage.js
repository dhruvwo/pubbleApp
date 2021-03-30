import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import FastImage from 'react-native-fast-image';
import {getUserInitals} from '../services/utilities/Misc';

export default function UserGroupImage({
  item,
  isAssigneesList,
  users,
  groups,
  lockId,
}) {
  const size = isAssigneesList ? 40 : 28;
  const styles = StyleSheet.create({
    assigneeContainer: {
      minWidth: size,
      minHeight: size,
      borderRadius: isAssigneesList ? size : 0,
      marginLeft: 7,
    },
    listAssigneesContainer: {
      marginRight: 10,
      marginLeft: 0,
    },
    lockedCard: {
      backgroundColor: Colors.primaryInactive,
      position: 'relative',
      borderRadius: 3,
      padding: 3,
      borderWidth: 0.3,
      zIndex: 1,
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
    assigneeImage: {
      zIndex: 2,
      minWidth: size,
      borderRadius: isAssigneesList ? size : 0,
      minHeight: size,
    },
    assigneeTextContainer: {
      minWidth: size,
      minHeight: size,
      justifyContent: 'center',
      borderRadius: isAssigneesList ? size : 3,
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
  });

  if (item.type === 'account' && (users || isAssigneesList)) {
    const user = isAssigneesList ? item : users[item.id];
    if (user && user.id && user.alias) {
      return (
        <View
          style={[
            styles.assigneeContainer,
            isAssigneesList && styles.listAssigneesContainer,
            item.id === lockId ? styles.lockedCard : {},
          ]}>
          {!isAssigneesList && item.id === lockId && (
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
              style={[styles.assigneeTextContainer, styles.initialsContainer]}>
              <Text style={[styles.nameText, styles.initialsText]}>
                {getUserInitals(user.alias)}
              </Text>
            </View>
          )}
        </View>
      );
    }
  } else if (item.type === 'app') {
    const group = isAssigneesList ? item : groups[item.id];
    if (group) {
      return (
        <View
          key={`${group.id}`}
          style={[
            styles.assigneeTextContainer,
            styles.groupNameContainer,
            isAssigneesList && styles.listAssigneesContainer,
          ]}>
          <Text style={styles.nameText}>{group.name}</Text>
        </View>
      );
    }
  }
  return (
    <View
      key={'group'}
      style={[
        styles.assigneeTextContainer,
        styles.groupNameContainer,
        isAssigneesList && styles.listAssigneesContainer,
      ]}>
      <CustomIconsComponent
        type={'FontAwesome5'}
        name={'hashtag'}
        size={22}
        color={styles.nameText.color}
        style={styles.nameText}
      />
    </View>
  );
}
