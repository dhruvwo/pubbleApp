import {Text, StyleSheet, View} from 'react-native';
import * as React from 'react';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';

export default function CardContainer(props) {
  const {item} = props;
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
      padding: 12,
    },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: -12,
    },
    starContainer: {
      backgroundColor: Colors.tertiary,
      padding: 5,
    },
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
      marginTop: 16,
    },
    contentText: {},
    tagsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 5,
    },
    tagContainer: {
      borderRadius: 50,
      padding: 5,
      borderWidth: 1,
      borderColor: Colors.primaryText,
    },
    tagText: {
      color: Colors.primaryText,
    },
    timeContainer: {},
    timeText: {},
    menuContainer: {
      flexDirection: 'row',
      padding: 12,
      borderTopWidth: 0.5,
      borderTopColor: Colors.primary,
    },
    menuLeftSection: {},
    menuRightSection: {},
  });
  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.badgeContainer}>
          {item.starred?.length && (
            <View style={styles.starContainer}>
              <CustomIconsComponent
                type={'AntDesign'}
                name={'star'}
                color={'white'}
                size={20}
              />
            </View>
          )}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {item.type}
              {item.count}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentText}>{item.content}</Text>
        </View>
        {item.tagSet?.length ? (
          <View style={styles.tagsContainer}>
            {item.tagSet.map((tag) => {
              return (
                <View style={styles.tagContainer} key={`${tag.id}`}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}></Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.menuLeftSection}></View>
        <View style={styles.menuRightSection}></View>
      </View>
    </View>
  );
}
