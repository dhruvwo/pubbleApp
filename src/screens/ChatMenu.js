import React, {useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomIconsComponent from '../components/CustomIcons';
import CustomInput from '../components/CustomInput';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HTMLView from 'react-native-htmlview';
import {formatAMPM} from '../services/utilities/Misc';

export default function ChatMenu(props) {
  const data = props.route.params.data;
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Visitor');
  const rightTabs = [
    {
      title: 'Chat',
      iconType: 'Ionicons',
      iconName: 'chatbox',
    },
    {
      title: 'FAQ',
      iconType: 'FontAwesome',
      iconName: 'puzzle-piece',
    },
    {
      title: 'Activities',
      iconType: 'FontAwesome',
      iconName: 'history',
    },
    {
      title: 'Visitor',
      iconType: 'AntDesign',
      iconName: 'contacts',
    },
  ];
  console.log(data, 'data >>>>>>>');
  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareScrollView
        style={styles.mainContainer}
        keyboardShouldPersistTaps={'handled'}>
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
            {rightTabs.map((tab) => {
              const isActive = activeTab === tab.title;
              return (
                <TouchableOpacity
                  key={tab.title}
                  onPress={() => setActiveTab(tab.title)}
                  style={styles.rightIconContainer(isActive)}>
                  <CustomIconsComponent
                    color={isActive ? Colors.white : Colors.primary}
                    name={tab.iconName}
                    type={tab.iconType}
                    size={25}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contain Area */}
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
            showEdit={false}
            placeholder="Name"
            value={data.author?.alias}
            showSubContent={true}
            subContent={data.author?.title}
          />
          <CustomInput
            iconName="mail"
            iconType="Entypo"
            showEdit="true"
            emptyValue="no email provided"
            placeholder="Email"
            value={
              data.author?.email !== 'anon@pubble.co' ? data.author?.email : ''
            }
          />
          <CustomInput
            iconName="phone"
            emptyValue="no phone provided"
            iconType="FontAwesome"
            showEdit="true"
            placeholder="Phone"
            value={data.author?.phone}
          />
          <CustomInput
            iconName="question-circle"
            iconType="FontAwesome"
            innerRenderer={
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors.primaryText,
                      paddingHorizontal: 6,
                      paddingVertical: 5,
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                      marginBottom: 5,
                      marginLeft: 5,
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontWeight: '700',
                        fontSize: 16,
                      }}>
                      {data.type}
                      {data.count}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginLeft: 10,
                      color: 'rgb(204, 204, 204)',
                    }}>
                    {formatAMPM(data.datePublished)}
                  </Text>
                </View>
                <HTMLView
                  stylesheet={htmlStyle()}
                  value={`<div>${data.content}</div>`}
                />
              </View>
            }
          />
          <CustomInput
            iconName="earth"
            iconType="Fontisto"
            value={data.author?.ip}
          />
          <CustomInput
            iconName="flow-tree"
            iconType="Entypo"
            value={data.landingPage}
          />
          {expanded ? (
            <>
              <CustomInput
                iconName="mobile1"
                iconType="AntDesign"
                value={data.userAgent}
              />
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
      </KeyboardAwareScrollView>
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
    justifyContent: 'space-between',
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
    backgroundColor: '#F6C955',
    padding: 5,
    borderRadius: 5,
  },
  headerRightMainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rightIconContainer: (isActive) => {
    return {
      padding: 5,
      backgroundColor: isActive ? Colors.primary : Colors.primaryInactive,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
      borderRadius: 5,
    };
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

const htmlStyle = StyleSheet.create(() => {
  return {
    div: {
      color: 'black',
    },
    span: {
      fontWeight: 'bold',
    },
    a: {
      color: Colors.white,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    account: {
      fontWeight: 'bold',
    },
  };
});
