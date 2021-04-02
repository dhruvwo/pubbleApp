import React, {useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TextInput} from 'react-native';
import Colors from '../constants/Colors';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomIconsComponent from '../components/CustomIcons';
import CustomInput from '../components/CustomInput';
import FastImage from 'react-native-fast-image';

export default function ChatMenu(props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareView style={styles.mainContainer} useNativeDriver={true}>
        <View style={styles.headerMainContainer}>
          <Text>dhrg</Text>
        </View>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.blueTitleText}>Visitor</Text>
          <View style={styles.rightSubHeader}>
            <TouchableOpacity style={styles.questionButton(Colors.tertiary)}>
              <Text style={styles.buttonText(Colors.white)}>10 Questions</Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.buttonText(Colors.greyText),
                styles.questionButton(Colors.greyBorder),
              ]}>
              Offline
            </Text>
          </View>
        </View>
        <View style={styles.inputFormContainer}>
          <CustomInput
            iconName="user"
            iconType="FontAwesome"
            showButton="true"
          />
          <CustomInput iconName="mail" iconType="Entypo" showButton="true" />
          <CustomInput
            iconName="phone"
            iconType="FontAwesome"
            showButton="true"
          />
          <CustomInput iconName="earth" iconType="Fontisto" />
          <CustomInput iconName="flow-tree" iconType="Entypo" />
          {expanded ? (
            <>
              <CustomInput iconName="mobile1" iconType="AntDesign" />
              <CustomInput iconName="flow-tree" iconType="Entypo" />
            </>
          ) : null}
          <TouchableOpacity
            style={styles.expandContainer}
            onPress={() => setExpanded(!expanded)}>
            <CustomIconsComponent
              color={Colors.white}
              name={expanded ? 'angle-double-up' : 'angle-double-down'}
              type="FontAwesome"
              size={22}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.assignedMemberContainer}>
          <Text style={[styles.blueTitleText, styles.extraSpace]}>
            Assigned members/groups
          </Text>
          <View style={styles.avatarContainer}>
            <View>
              <FastImage
                style={[styles.assigneeImage]}
                source={{
                  uri:
                    'https://uploads.pubble.io/upload-images-ss/2019/05/08/c5f4570a99287255748989dec916cd73_8jzzczmk.png',
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.questionButton(Colors.secondary),
                styles.assignButton,
              ]}>
              <Text style={styles.buttonText(Colors.white)}>+ Assign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 4,
  },
  headerLeftIcon: {
    padding: 5,
    borderRadius: 5,
  },
  subHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  rightSubHeader: {
    flexDirection: 'row',
  },
  blueTitleText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  questionButton: (bgColor) => ({
    backgroundColor: bgColor,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginLeft: 10,
  }),
  buttonText: (textColor) => ({
    color: textColor,
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: 'bold',
  }),
  inputFormContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  inputContainer: {
    padding: 3,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: Colors.greyBorder,
    paddingHorizontal: 7,
    alignItems: 'center',
  },
  inputStyle: {
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 0.5,
    borderColor: Colors.greyText,
    marginLeft: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  expandContainer: {
    backgroundColor: Colors.secondary,
    alignSelf: 'flex-start',
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  assignedMemberContainer: {
    backgroundColor: Colors.bgColor,
    padding: 20,
    marginVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.greyBorder,
  },
  extraSpace: {
    marginBottom: 20,
  },
  assignButton: {
    alignSelf: 'flex-start',
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  assigneeImage: {
    height: 50,
    width: 50,
    borderRadius: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
  },
});
