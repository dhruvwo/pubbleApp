import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import CustomInput from '../components/CustomInput';
import FastImage from 'react-native-fast-image';
import Colors from '../constants/Colors';
import HTMLView from 'react-native-htmlview';
import {formatAMPM} from '../services/utilities/Misc';
import UserGroupImage from '../components/UserGroupImage';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomIconsComponent from '../components/CustomIcons';
import {eventsAction} from '../store/actions';
import {useDispatch} from 'react-redux';
import * as _ from 'lodash';

export default function VisitorComponent(props) {
  const dispatch = useDispatch();
  const {
    data,
    usersCollection,
    groupsCollection,
    translationlist,
    getTranslation,
    selectedEvent,
    sourceLanguage,
    targetLanguage,
    translationSelectedOption,
    communityId,
    onAssignPress,
    setTranslationSelectedOption,
    setSourceLanguage,
    user,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [phone, setPhone] = useState(data.author?.phone);
  const [alias, setAlias] = useState(data.author?.alias);
  const [email, setEmail] = useState(
    data.author?.email !== 'anon@pubble.co' ? data.author?.email : '',
  );
  const [emailNotification, setEmailNotification] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tagsData, setTagsData] = useState(data.tagSet);
  const [highlight, setHighlight] = useState(data.star);
  const [toggleTranslationOption, setToggleTranslationOption] = useState(false);
  const [translationMargin, setTranslationMargin] = useState(0);

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

  const translationOptionHandler = async () => {
    setSourceLanguage(translationSelectedOption);
    const params = {
      postId: data.id,
      sourceLanguage: translationSelectedOption,
    };
    await dispatch(eventsAction.tranlationOptionFunc(params));
  };

  return (
    <>
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
            <Text style={styles.authorSubTitle}>{data.author?.title}</Text>
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
                  <View style={styles.questionContentMainContainer}>
                    <View style={styles.questionContentView}>
                      <Text style={styles.questionContentText}>
                        {data.type}
                        {data.count}
                      </Text>
                    </View>
                    <Text style={styles.questionContentDate}>
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
                <Text style={styles.qustionAskedText}>
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
          {data.assignees.map((assignee) => {
            return (
              <UserGroupImage
                key={`${assignee.id}`}
                users={usersCollection}
                groups={groupsCollection}
                imageSize={40}
                item={assignee}
              />
            );
          })}
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

      <View style={styles.tagsMainContainer}>
        <View style={styles.tagContainer}>
          <TextInput
            placeholder="input tags..."
            placeholderTextColor="#A8A8A8"
            autoCorrect={false}
            value={tagInput}
            onChangeText={(text) => {
              setTagInput(text);
            }}
            style={styles.tagInput}
          />
          <TouchableOpacity onPress={tagHandler} style={styles.tagAddButton}>
            <CustomIconsComponent
              color={'white'}
              name={'check'}
              type={'Entypo'}
              size={20}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.tagListContainer}>
          {tagsData.map((tag) => (
            <TouchableOpacity
              onPress={() => tagDeleteHandler(tag.name)}
              style={styles.tagListTouchable}>
              <Text style={styles.tagListText}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{padding: 20}}>
        <TouchableOpacity
          onPress={sendEmailNotification}
          style={styles.sendEmailTouchable(emailNotification)}>
          <CustomIconsComponent
            color={Colors.primaryText}
            name={'envelope-o'}
            type={'FontAwesome'}
            size={20}
          />
          <Text style={styles.sendEmailText}>Send email notification</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={updateStar}
          style={styles.highlistTouchable(highlight)}>
          <CustomIconsComponent
            color={highlight ? 'white' : Colors.primaryText}
            name={'staro'}
            type={'AntDesign'}
            size={20}
          />
          <Text style={styles.highlistText(highlight)}>
            Highlight this question
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dueDateTouchable}>
          <CustomIconsComponent
            color={Colors.primaryText}
            name={'clock'}
            type={'Feather'}
            size={20}
          />
          <Text style={styles.dueDateText}>
            Due date -{' '}
            {moment(data.lastUpdated).format('dd MMM DD YYYY hh:mm a')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setToggleTranslationOption(!toggleTranslationOption)}
          style={styles.translationTouchable}>
          <CustomIconsComponent
            color={Colors.primaryText}
            name={'g-translate'}
            type={'MaterialIcons'}
            size={20}
          />
          <Text style={styles.dueDateText}>
            {getTranslation !== undefined
              ? `Active translation [${sourceLanguage} -> ${sourceLanguage}]`
              : 'Set Translation...'}
          </Text>
        </TouchableOpacity>

        {toggleTranslationOption ? (
          <View style={styles.translationViewMainContainer(translationMargin)}>
            {getTranslation !== undefined ? (
              <Text>
                <Text style={{textTransform: 'uppercase'}}>
                  {`[${sourceLanguage} -> ${targetLanguage}]`}
                </Text>{' '}
                translation is enabled
              </Text>
            ) : (
              <Text>
                If the visitor uses a different language click enable to trigger
                translation chat options
              </Text>
            )}

            <View style={styles.translationDropdown}>
              <DropDownPicker
                onOpen={() => setTranslationMargin(100)}
                onClose={() => setTranslationMargin(0)}
                zIndex={1}
                items={translationlist}
                defaultValue={translationSelectedOption}
                containerStyle={{height: 40}}
                style={{backgroundColor: Colors.primaryInactive}}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: Colors.primaryInactive}}
                onChangeItem={(item) =>
                  setTranslationSelectedOption(item.value)
                }
              />
            </View>

            <TouchableOpacity
              onPress={translationOptionHandler}
              style={styles.translationChangeBtn}>
              <Text style={styles.translationChangeText}>
                {getTranslation !== undefined ? 'Change' : 'Enable'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  authorSubTitle: {
    fontSize: 13,
    opacity: 0.85,
    color: Colors.primaryText,
    paddingTop: 3,
  },
  questionContentMainContainer: {
    flexDirection: 'row',
  },
  questionContentView: {
    backgroundColor: Colors.primaryText,
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 8,
    marginLeft: 8,
  },
  questionContentText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  questionContentDate: {
    marginLeft: 10,
    color: 'rgb(204, 204, 204)',
  },
  qustionAskedText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tagsMainContainer: {paddingHorizontal: 20},
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.primaryText,
    borderRadius: 28,
    width: 145,
    marginRight: 10,
  },
  tagAddButton: {
    backgroundColor: Colors.green,
    padding: 5,
  },
  tagListContainer: {
    flexDirection: 'row',
  },
  tagListTouchable: {
    backgroundColor: Colors.primaryText,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.primaryText,
    width: 80,
    padding: 5,
    marginTop: 8,
    marginRight: 8,
  },
  tagListText: {
    color: Colors.white,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  sendEmailTouchable: (emailNotification) => ({
    opacity: emailNotification ? 0.4 : null,
    backgroundColor: Colors.primaryInactive,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
    borderRadius: 2,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  sendEmailText: {
    color: Colors.primaryInactiveText,
    fontWeight: '600',
    marginLeft: 10,
  },
  highlistTouchable: (highlight) => ({
    backgroundColor: highlight ? Colors.yellow : Colors.primaryInactive,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
    borderRadius: 2,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  }),
  highlistText: (highlight) => ({
    color: highlight ? Colors.white : Colors.primaryInactiveText,
    fontWeight: '600',
    marginLeft: 10,
  }),
  dueDateTouchable: {
    backgroundColor: Colors.primaryInactive,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
    borderRadius: 2,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dueDateText: {
    color: Colors.primaryInactiveText,
    fontWeight: '600',
    marginLeft: 10,
  },
  translationTouchable: {
    backgroundColor: Colors.primaryInactive,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
    borderRadius: 2,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  translationViewMainContainer: (translationMargin) => ({
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primaryText,
    borderTopWidth: 0,
    marginBottom: translationMargin !== 0 ? translationMargin : 0,
  }),
  translationDropdown: {
    marginTop: 12,
  },
  translationChangeBtn: {
    backgroundColor: Colors.usersBg,
    padding: 8,
    marginTop: 12,
    borderRadius: 2,
    width: 80,
    zIndex: 0,
  },
  translationChangeText: {color: Colors.white, fontSize: 15},
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
