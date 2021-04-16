import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Popover} from '@ant-design/react-native';
import * as _ from 'lodash';
import GlobalStyles from '../constants/GlobalStyles';

export default function StatusAssignFilter(props) {
  const {activeTab} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, events}) => ({
    communityId: auth?.community?.community?.id || '',
    selectedEvent: auth.selectedEvent,
    filterParams: events.filterParams,
  }));
  const filterData = {
    status: ['Approved', 'Unapproved'],
    assign: ['Assign', 'Unassign'],
    wait: ['Waiting for moderator', 'Waiting for visitor'],
  };

  function clearFilter(type) {
    dispatch(
      eventsAction.setFilterParams({
        activeTab: activeTab.title,
        type,
        value: '',
      }),
    );
  }

  function onSelectOption(type, value) {
    dispatch(
      eventsAction.setFilterParams({
        activeTab: activeTab.title,
        type,
        value,
      }),
    );
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
              <Text style={styles.optionText}>{option}</Text>
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
      <Popover
        duration={0}
        placement={'bottom'}
        useNativeDriver={true}
        overlay={renderOptions(filterData.status, selectedStatus, (selected) =>
          onSelectOption('status', selected),
        )}>
        <View style={styles.filterContainer(selectedStatus)}>
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
              onPress={() => clearFilter('status')}
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
          <View style={styles.filterContainer(selectedAssign)}>
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
                onPress={() => clearFilter('assign')}
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
          <View style={styles.filterContainer(selectedWait)}>
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
                onPress={() => clearFilter('wait')}
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
    height: 45,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgColor,
  },
  filterContainer: (hasValue) => {
    return {
      flexDirection: 'row',
      borderColor: hasValue ? Colors.secondary : Colors.primary,
      borderWidth: 1,
      width: GlobalStyles.windowWidth * 0.5 - 13,
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
    maxWidth: GlobalStyles.windowWidth * 0.8,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  optionContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
  },
  selectedIcon: {
    marginLeft: 5,
  },
  optionText: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
});
