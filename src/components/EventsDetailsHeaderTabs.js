import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';

export default function EventsDetailsHeaderTabs(props) {
  return (
    <View style={styles.headerMainContainer}>
      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={styles.headerLeftIcon}>
        <CustomIconsComponent
          color={'white'}
          name={'arrow-forward-ios'}
          type={'MaterialIcons'}
          size={25}
        />
      </TouchableOpacity>

      <View style={styles.headerRightMainContainer}>
        <View style={styles.headerRightContainer}>
          <View style={styles.chatIcon}>
            <CustomIconsComponent
              color={'#ff5d87'}
              name={'chatbox-ellipses'}
              type={'Ionicons'}
              size={25}
            />
          </View>

          <View style={styles.usersIcon}>
            <CustomIconsComponent
              color={'#8BA5B4'}
              name={'user-check'}
              type={'FontAwesome5'}
              size={20}
            />
          </View>

          <View style={styles.searchIcon}>
            <CustomIconsComponent
              color={'#8BA5B4'}
              name={'magnifying-glass'}
              type={'Foundation'}
              size={30}
            />
          </View>

          <View style={styles.detailIcon}>
            <CustomIconsComponent
              color={'#fff'}
              name={'apps-sharp'}
              type={'Ionicons'}
              size={25}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  headerLeftIcon: {
    backgroundColor: '#F6C955',
    padding: 5,
    borderRadius: 5,
  },
  headerRightMainContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  chatIcon: {
    alignSelf: 'center',
    backgroundColor: '#DEEAEF',
    padding: 5,
    borderRadius: 2,
    marginRight: 8,
  },
  usersIcon: {
    alignSelf: 'center',
    backgroundColor: '#DEEAEF',
    padding: 8,
    borderRadius: 2,
    marginRight: 8,
  },
  searchIcon: {
    alignSelf: 'center',
    backgroundColor: '#DEEAEF',
    paddingVertical: 2,
    paddingHorizontal: 8.5,
    borderRadius: 2,
    marginRight: 8,
  },
  detailIcon: {
    alignSelf: 'center',
    backgroundColor: '#8BA5B4',
    padding: 5,
    borderRadius: 2,
  },
});
