import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import Colors from '../constants/Colors';
import {useDispatch} from 'react-redux';
import CustomIconsComponent from '../components/CustomIcons';

export default function Events(props) {
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.safeareaView}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.eventDateContainer}
            accessibilityLabel={'change event'}
            accessibilityHint={'open event list'}
            accessibilityRole={'button'}>
            <CustomIconsComponent
              color={Colors.secondary}
              name={'caret-down-circle'}
              size={45}
            />
            <View style={styles.dateContainer}>
              <Text accessible={true} style={styles.dayContainer}>
                9
              </Text>
              <Text style={styles.monthContainer}>MAR</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.eventHeaderContainer}>
            <Text style={styles.eventText}>Test</Text>
          </View>
          <TouchableOpacity
            style={styles.moreContainer}
            accessible={true}
            accessibilityLabel={'more'}
            accessibilityRole={'button'}>
            <CustomIconsComponent
              color={'white'}
              name={'more-vertical'}
              type={'Feather'}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeareaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: 54,
    width: '100%',
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDateContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRightWidth: 0.5,
    borderRightColor: Colors.white,
  },
  dateContainer: {
    marginLeft: 5,
    justifyContent: 'center',
  },
  dayContainer: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monthContainer: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  eventHeaderContainer: {
    paddingHorizontal: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
  eventText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  moreContainer: {
    paddingHorizontal: 10,
  },
  iconContainer: {
    backgroundColor: Colors.secondary,
  },
});
