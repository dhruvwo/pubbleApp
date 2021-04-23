import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {eventsAction, myInboxAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Popover} from '@ant-design/react-native';
import * as _ from 'lodash';
import GlobalStyles from '../constants/GlobalStyles';

export default function StatusAssignFilter(props) {
  const {activeTab, isMyInbox} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, events, myInbox}) => ({
    communityId: auth?.community?.community?.id || '',
    selectedEvent: auth.selectedEvent,
    filterParams: isMyInbox ? myInbox.filterParams : events.filterParams,
  }));
  const filterData = {
    status: ['Approved', 'Unapproved'],
    assign: ['Assign', 'Unassign'],
    wait: ['Waiting for moderator', 'Waiting for visitor'],
  };
  const isSingleView =
    isMyInbox ||
    (activeTab.title !== 'New' && activeTab.title !== 'In Progress');
  function onSelectOption(type, value) {
    if (reduxState.filterParams[activeTab.title][type] !== value) {
      if (isMyInbox) {
        dispatch(
          myInboxAction.setFilterParams({
            activeTab: activeTab.title,
            type,
            value,
          }),
        );
      } else {
        dispatch(
          eventsAction.setFilterParams({
            activeTab: activeTab.title,
            type,
            value,
          }),
        );
      }
    }
  }

  function renderOptions(options, selected, onPress) {
    return (
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = option === selected;
          return (
            <TouchableOpacity
              key={option}
              style={styles.optionContainer}
              onPress={() => {
                onPress(option);
              }}>
              <Text style={styles.optionText(isSelected)}>{option}</Text>
              {isSelected && (
                <CustomIconsComponent
                  color={Colors.secondary}
                  style={styles.selectedIcon}
                  name={'check'}
                  type={'FontAwesome'}
                  size={18}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  const selectedStatus = reduxState.filterParams[activeTab.title].status || '';
  const selectedWait = reduxState.filterParams[activeTab.title].wait || '';
  const selectedAssign = reduxState.filterParams[activeTab.title].assign || '';
  return (
    <View style={styles.container}>
      {!isMyInbox ? (
        <Popover
          duration={0}
          placement={'bottom'}
          useNativeDriver={true}
          visible={false}
          overlay={renderOptions(
            filterData.status,
            selectedStatus,
            (selected) => onSelectOption('status', selected),
          )}>
          <View style={[styles.filterContainer(isSingleView)]}>
            <CustomIconsComponent
              color={selectedStatus ? Colors.secondary : Colors.primary}
              style={styles.filterIcon}
              name={'text-box-check'}
              type={'MaterialCommunityIcons'}
              size={18}
            />
            <Text
              style={styles.valueText(selectedStatus)}
              lineBreakMode={'tail'}
              numberOfLines={1}>
              {selectedStatus || 'Show all'}
            </Text>
            {selectedStatus ? (
              <TouchableOpacity
                onPress={() => onSelectOption('status', '')}
                style={styles.closeContainer}>
                <CustomIconsComponent
                  color={Colors.white}
                  name={'cross'}
                  type={'Entypo'}
                  size={18}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </Popover>
      ) : null}
      {activeTab.title === 'New' && (
        <Popover
          duration={0}
          placement={'bottom'}
          useNativeDriver={true}
          overlay={renderOptions(
            filterData.assign,
            selectedAssign,
            (selected) => onSelectOption('assign', selected),
          )}>
          <View
            style={[styles.filterContainer(isSingleView), styles.leftBorder]}>
            <CustomIconsComponent
              color={selectedAssign ? Colors.secondary : Colors.primary}
              style={styles.filterIcon}
              name={'account-check'}
              type={'MaterialCommunityIcons'}
              size={18}
            />
            <Text
              style={styles.valueText(selectedAssign)}
              lineBreakMode={'tail'}
              numberOfLines={1}>
              {selectedAssign || 'Show all'}
            </Text>
            {selectedAssign ? (
              <TouchableOpacity
                onPress={() => onSelectOption('assign', '')}
                style={styles.closeContainer}>
                <CustomIconsComponent
                  color={Colors.white}
                  name={'cross'}
                  type={'Entypo'}
                  size={18}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </Popover>
      )}
      {activeTab.title === 'In Progress' && (
        <Popover
          duration={0}
          placement={'bottom'}
          useNativeDriver={true}
          overlay={renderOptions(filterData.wait, selectedWait, (selected) =>
            onSelectOption('wait', selected),
          )}>
          <View
            style={[styles.filterContainer(isSingleView), styles.leftBorder]}>
            <CustomIconsComponent
              color={selectedWait ? Colors.secondary : Colors.primary}
              style={styles.filterIcon}
              name={'account-clock'}
              type={'MaterialCommunityIcons'}
              size={18}
            />
            <Text
              style={styles.valueText(selectedWait)}
              lineBreakMode={'tail'}
              numberOfLines={1}>
              {selectedWait || 'Show all'}
            </Text>
            {selectedWait ? (
              <TouchableOpacity
                onPress={() => onSelectOption('wait', '')}
                style={styles.closeContainer}>
                <CustomIconsComponent
                  color={Colors.white}
                  name={'cross'}
                  type={'Entypo'}
                  size={18}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </Popover>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyBorder,
    marginTop: 10,
    padding: 5,
    marginHorizontal: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 5,
  },
  leftBorder: {borderLeftWidth: 5, borderLeftColor: Colors.greyBorder},
  filterContainer: (isSingleView) => {
    return {
      flexDirection: 'row',
      backgroundColor: Colors.primaryTilt,
      // borderWidth: 1,
      width: isSingleView
        ? GlobalStyles.windowWidth - 30
        : GlobalStyles.windowWidth * 0.5 - 15,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
    };
  },
  filterIcon: {
    marginRight: 5,
  },
  titleText: {
    color: Colors.secondary,
  },
  valueText: (hasValue) => {
    return {
      color: hasValue ? Colors.secondary : Colors.primary,
      flexShrink: 1,
    };
  },
  closeContainer: {
    backgroundColor: Colors.secondary,
    marginLeft: 5,
    borderRadius: 5,
  },
  optionsContainer: {
    width: GlobalStyles.windowWidth * 0.5 - 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  optionContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedIcon: {
    marginLeft: 5,
  },
  optionText: (isSelected) => ({
    color: isSelected ? Colors.secondary : Colors.primaryText,
    fontWeight: '600',
  }),
});
