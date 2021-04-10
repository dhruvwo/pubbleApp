import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import Colors from '../constants/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomIconsComponent from '../components/CustomIcons';
import CustomInput from '../components/CustomInput';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HTMLView from 'react-native-htmlview';
import {formatAMPM} from '../services/utilities/Misc';
import UserGroupImage from '../components/UserGroupImage';
import AssignModal from '../components/AssignModal';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {eventsAction} from '../store/actions';
import * as _ from 'lodash';
import {Popover} from '@ant-design/react-native';
import GlobalStyles from '../constants/GlobalStyles';

export default function ChatMenu(props) {
  const dispatch = useDispatch();
  const {
    data,
    selectedEvent,
    userAccount,
    communityId,
    user,
  } = props.route.params;
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Visitor');
  const [itemForAssign, setItemForAssign] = useState();
  const [phone, setPhone] = useState(data.author?.phone);
  const [alias, setAlias] = useState(data.author?.alias);
  const [email, setEmail] = useState(
    data.author?.email !== 'anon@pubble.co' ? data.author?.email : '',
  );
  const [emailNotification, setEmailNotification] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tagsData, setTagsData] = useState(data.tagSet);
  const [highlight, setHighlight] = useState(data.star);
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

  useEffect(() => {
    getStateCountryFromIP();
  }, []);

  async function getStateCountryFromIP() {
    const res = await dispatch(
      eventsAction.getStateCountryFromIPFuc({
        ip: data.author.ip,
        id: data.id,
      }),
    );
  }

  function onAssignPress() {
    setItemForAssign(data);
  }

  function onAssignClose() {
    setItemForAssign({});
  }

  async function nameUpdate(inputValue) {
    const nameRes = await dispatch(
      eventsAction.editHandlerChatMenuFunc(
        {
          name: inputValue,
          conversationId: data.conversationId,
          postNotification: false,
        },
        'name',
      ),
    );
    setAlias(nameRes);
  }

  async function emailUpdate(inputValue) {
    const emailRes = await dispatch(
      eventsAction.editHandlerChatMenuFunc(
        {
          email: inputValue,
          conversationId: data.conversationId,
          postNotification: false,
        },
        'email',
      ),
    );
    setEmail(emailRes.email);
  }

  async function phoneNumberUpdate(inputValue) {
    const phoneRes = await dispatch(
      eventsAction.editHandlerChatMenuFunc(
        {
          phone: inputValue,
          conversationId: data.conversationId,
          postNotification: false,
        },
        'phone',
      ),
    );
    setPhone(phoneRes.phone);
  }

  async function sendEmailNotification() {
    setEmailNotification(true);
    await dispatch(
      eventsAction.sendEmailNotificationFunc({
        code: 'reply.email.notify',
        conversationId: data.conversationId,
        appId: selectedEvent.id,
      }),
    );
  }

  async function tagHandler() {
    if (tagInput !== '') {
      setTagInput('');
      const tagRes = await dispatch(
        eventsAction.addTagsFunc({
          communityId: communityId,
          conversationId: data.conversationId,
          postId: data.id,
          tags: tagInput,
        }),
      );
      setTagsData([...tagsData, ...tagRes]);
    } else {
      Alert.alert('Please enter tag name');
    }
  }

  async function tagDeleteHandler(tagValue) {
    const streamData = _.remove(tagsData, function (val) {
      return val.name !== tagValue;
    });
    setTagsData([...streamData]);

    await dispatch(
      eventsAction.deleteTagsFunc({
        communityId: communityId,
        conversationId: data.conversationId,
        postId: data.id,
        tags: tagValue,
      }),
    );
  }

  async function updateStar() {
    setHighlight(!highlight);
    const params = {
      conversationId: data.conversationId,
    };
    const reducerParam = {
      conversationId: data.conversationId,
      userId: user.accountId,
      type: data.star ? 'unstar' : 'star',
    };
    const starRes = await dispatch(
      eventsAction.updateStar(
        params,
        highlight ? 'unstar' : 'star',
        reducerParam,
      ),
    );
  }

  async function closeQuestion() {
    await dispatch(
      eventsAction.closeQuestionFunc({
        conversationId: data.conversationId,
      }),
    );
    props.navigation.navigate('Events');
  }

  console.log(data, 'data >>>>>>>');
  console.log(selectedEvent, 'data >>>>>>>');
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
            showEdit={true}
            placeholder="Name"
            value={alias}
            showSubContent={true}
            subContent={
              <Text
                style={{
                  fontSize: 13,
                  opacity: 0.85,
                  color: Colors.primaryText,
                  paddingTop: 3,
                }}>
                {data.author?.title}
              </Text>
            }
            onSubmitEdit={nameUpdate}
          />
          <CustomInput
            iconName="mail"
            iconType="Entypo"
            showEdit="true"
            emptyValue="no email provided"
            placeholder="Email"
            value={email}
            onSubmitEdit={emailUpdate}
          />
          <CustomInput
            iconName="phone"
            emptyValue="no phone provided"
            iconType="FontAwesome"
            showEdit="true"
            placeholder="Phone"
            value={phone}
            onSubmitEdit={phoneNumberUpdate}
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
                          paddingHorizontal: 3,
                          paddingVertical: 2,
                          borderTopRightRadius: 5,
                          borderBottomRightRadius: 5,
                          marginBottom: 8,
                          marginLeft: 8,
                        }}>
                        <Text
                          style={{
                            color: Colors.white,
                            fontWeight: '700',
                            fontSize: 14,
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
                iconName="message1"
                iconType="AntDesign"
                showEdit={false}
                placeholder="Name"
                value="Question asked from app:"
                showSubContent={true}
                subContent={
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}>
                    {selectedEvent.name}
                  </Text>
                }
              />
              <CustomInput
                iconName="mobile1"
                iconType="AntDesign"
                value={data.userAgent}
              />
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
            <UserGroupImage
              item={userAccount}
              isAssigneesList={true}
              imageSize={40}
            />
            <TouchableOpacity
              onPress={onAssignPress}
              style={[
                styles.questionButton(Colors.secondary),
                styles.assignButton,
              ]}>
              <Text style={styles.buttonText(Colors.white)}>+ Assign</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{paddingHorizontal: 20}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder="input tags..."
              placeholderTextColor="#A8A8A8"
              autoCorrect={false}
              value={tagInput}
              onChangeText={(text) => {
                setTagInput(text);
              }}
              style={{
                padding: 12,
                borderWidth: 2,
                borderColor: '#B9CAD2',
                borderRadius: 28,
                width: 145,
                marginRight: 10,
              }}
            />
            <TouchableOpacity
              onPress={tagHandler}
              style={{
                backgroundColor: '#7CD219',
                padding: 5,
              }}>
              <CustomIconsComponent
                color={'white'}
                name={'check'}
                type={'Entypo'}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}>
            {tagsData.map((tag) => (
              <TouchableOpacity
                onPress={() => tagDeleteHandler(tag.name)}
                style={{
                  backgroundColor: '#8BA5B4',
                  borderRadius: 28,
                  borderWidth: 2,
                  borderColor: '#8BA5B4',
                  width: 80,
                  padding: 5,
                  marginTop: 8,
                  marginRight: 8,
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    textAlign: 'center',
                    flexWrap: 'wrap',
                  }}>
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{padding: 20}}>
          <TouchableOpacity
            onPress={sendEmailNotification}
            style={{
              opacity: emailNotification ? 0.4 : null,
              backgroundColor: '#F2F7F9',
              borderWidth: 2,
              borderColor: '#E8F0F3',
              borderRadius: 2,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CustomIconsComponent
              color={'#B2C4CE'}
              name={'envelope-o'}
              type={'FontAwesome'}
              size={20}
            />
            <Text
              style={{
                color: Colors.primaryInactiveText,
                fontWeight: '600',
                marginLeft: 10,
              }}>
              Send email notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={updateStar}
            style={{
              backgroundColor: highlight ? '#F6C853' : '#F2F7F9',
              borderWidth: 2,
              borderColor: '#E8F0F3',
              borderRadius: 2,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <CustomIconsComponent
              color={highlight ? 'white' : '#B2C4CE'}
              name={'staro'}
              type={'AntDesign'}
              size={20}
            />
            <Text
              style={{
                color: highlight ? Colors.white : Colors.primaryInactiveText,
                fontWeight: '600',
                marginLeft: 10,
              }}>
              Highlight this question
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#F2F7F9',
              borderWidth: 2,
              borderColor: '#E8F0F3',
              borderRadius: 2,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <CustomIconsComponent
              color={'#B2C4CE'}
              name={'clock'}
              type={'Feather'}
              size={20}
            />
            <Text
              style={{
                color: Colors.primaryInactiveText,
                fontWeight: '600',
                marginLeft: 10,
              }}>
              Due date -{' '}
              {moment(data.lastUpdated).format('dd MMM DD YYYY hh:mm a')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#F2F7F9',
              borderWidth: 2,
              borderColor: '#E8F0F3',
              borderRadius: 2,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <CustomIconsComponent
              color={'#B2C4CE'}
              name={'g-translate'}
              type={'MaterialIcons'}
              size={20}
            />
            <Text
              style={{
                color: Colors.primaryInactiveText,
                fontWeight: '600',
                marginLeft: 10,
              }}>
              Set Translation...
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}>
        <Popover
          duration={0}
          useNativeDriver={true}
          overlay={
            <View
              style={{
                backgroundColor: '#F8FAFB',
                width: GlobalStyles.windowWidth * 0.6,
              }}>
              <TouchableOpacity
                style={{
                  padding: 12,
                }}>
                <Text>Hello</Text>
              </TouchableOpacity>
            </View>
          }
          placement={'top'}>
          <View
            style={{
              backgroundColor: Colors.primaryText,
              padding: 8,
              borderWidth: 2,
              borderColor: Colors.primaryText,
              borderRadius: 2,
              marginRight: 15,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontWeight: '600',
              }}>
              Actions...
            </Text>
          </View>
        </Popover>

        <TouchableOpacity
          onPress={closeQuestion}
          style={{
            backgroundColor: '#7CD219',
            padding: 8,
            borderWidth: 2,
            borderColor: '#7CD219',
            borderRadius: 2,
            width: 250,
            flexDirection: 'row',
          }}>
          <CustomIconsComponent
            color={'white'}
            name={'check'}
            type={'Entypo'}
            size={20}
          />
          <Text
            style={{
              marginLeft: 8,
              color: Colors.white,
              fontSize: 14,
              fontWeight: '600',
            }}>
            Close question
          </Text>
        </TouchableOpacity>
      </View>

      {itemForAssign?.id ? (
        <AssignModal
          itemForAssign={itemForAssign}
          onRequestClose={() => onAssignClose()}
        />
      ) : null}
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
    marginLeft: 5,
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
