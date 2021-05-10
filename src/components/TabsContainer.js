import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';

export default function TabsContainer({
  activeTab,
  setActiveTab,
  leftTabs,
  rightTabs,
  counts,
  selectedTagFilter,
  searchString,
  onClearTagFilter,
  notification,
  selectedEvent,
  onPressNotificationText,
}) {
  let notificationObject = 0;
  if (selectedEvent !== undefined) {
    notificationObject = notification[selectedEvent.id]?.[`${activeTab.title}`];
  }

  return (
    <View
      style={styles.subHeaderContainer(
        selectedTagFilter?.length || searchString,
      )}>
      {selectedTagFilter?.length || searchString ? (
        <View style={styles.tagFilterMainContainer}>
          <View style={styles.tagFilterRightContainer}>
            <CustomIconsComponent
              name={'magnifying-glass'}
              type={'Foundation'}
              size={30}
            />
            <Text style={styles.tagFilterText}>
              {selectedTagFilter?.length === 0
                ? 'Search result'
                : 'Tag results'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClearTagFilter}
            style={styles.tagFilterLeftContainer}>
            <Text style={styles.tagFilterClearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.subHeaderLeftContainer}>
            {leftTabs.map((tab, i) => {
              const showNotificationDot =
                notification[selectedEvent.id]?.[`${tab.title}`];
              const isActive = tab.title === activeTab.title;
              return (
                <React.Fragment key={tab.title}>
                  <TouchableOpacity
                    style={[
                      styles.itemContainer,
                      isActive && styles.itemContainerActive,
                      {
                        paddingLeft: i === 0 ? 5 : 30,
                        marginLeft: i === 0 ? 0 : -15,
                        marginRight: leftTabs.length !== i + 1 ? 15 : 0,
                        zIndex: 100 - i,
                      },
                    ]}
                    onPress={() => {
                      setActiveTab(tab);
                    }}>
                    <Text
                      style={[
                        styles.itemText,
                        isActive && styles.itemTextActive,
                      ]}>
                      {counts[i] || 0} {isActive && activeTab.title}
                    </Text>
                    {showNotificationDot?.conversationId?.length > 0 ? (
                      <View
                        style={{
                          position: 'absolute',
                          paddingLeft: 10,
                          paddingBottom: 20,
                        }}>
                        <CustomIconsComponent
                          color={Colors.unapproved}
                          type={'Entypo'}
                          name={'dot-single'}
                          size={35}
                        />
                      </View>
                    ) : null}
                    {leftTabs.length !== i + 1 && (
                      <View style={styles.arrowStyle}>
                        <CustomIconsComponent
                          name={'caretright'}
                          type={'AntDesign'}
                          size={50}
                          color={
                            isActive ? Colors.secondary : Colors.primaryInactive
                          }
                        />
                      </View>
                    )}
                    {leftTabs.length !== i + 1 && (
                      <View style={[styles.arrowStyle, styles.arrowStyleWhite]}>
                        <CustomIconsComponent
                          name={'caretright'}
                          type={'AntDesign'}
                          size={50}
                          color={'white'}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
          {rightTabs && (
            <View style={styles.rightTabsContainer}>
              {rightTabs.map((tab) => {
                const isActive = activeTab.name === tab.name;
                return (
                  <TouchableOpacity
                    key={tab.name}
                    onPress={() => {
                      setActiveTab(tab);
                    }}
                    style={[
                      styles.rightButton,
                      isActive && styles.rightButtonActive(activeTab.title),
                    ]}>
                    <CustomIconsComponent
                      type={tab.iconType}
                      name={tab.iconName}
                      size={25}
                      color={isActive ? 'white' : Colors.primaryText}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {notificationObject?.count > 0 ? (
            <TouchableOpacity
              onPress={() =>
                onPressNotificationText({
                  data: notificationObject.data,
                  actionType: 'updateStream',
                  which: activeTab.title,
                  selectedId: selectedEvent.id,
                })
              }>
              <Text>{notificationObject?.count} new question</Text>
            </TouchableOpacity>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subHeaderContainer: (selectedTagFilter) => ({
    backgroundColor: 'white',
    height: selectedTagFilter ? null : 55,
    width: '100%',
    flexDirection: selectedTagFilter ? null : 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 4,
    zIndex: 2,
  }),
  subHeaderLeftContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 32,
  },
  itemContainer: {
    backgroundColor: Colors.primaryInactive,
    paddingVertical: 5,
    paddingHorizontal: 8,
    height: 32,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    minWidth: 30,
    flexGrow: 1,
    flexShrink: 1,
  },
  itemContainerActive: {
    backgroundColor: Colors.secondary,
  },
  itemText: {
    color: Colors.primaryText,
  },
  itemTextActive: {
    color: Colors.white,
  },
  arrowStyle: {
    marginLeft: -20,
    zIndex: 1000,
    position: 'absolute',
    right: -20,
  },
  arrowStyleWhite: {
    marginLeft: -25,
    zIndex: 1,
    right: -25,
  },
  rightTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightButton: {
    height: 32,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryInactive,
    marginHorizontal: 3,
  },
  rightButtonActive: (tabTitle) => ({
    backgroundColor: tabTitle === 'star' ? Colors.yellow : Colors.secondary,
  }),

  tagFilterMainContainer: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagFilterRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagFilterText: {
    fontSize: 20,
    marginLeft: 10,
  },
  tagFilterLeftContainer: {
    borderWidth: 2,
    borderRadius: 2,
    borderColor: Colors.primaryText,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tagFilterClearText: {
    color: Colors.primaryText,
    textTransform: 'uppercase',
  },
});
