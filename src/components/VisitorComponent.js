import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import CustomInput from '../components/CustomInput';
import Colors from '../constants/Colors';
import HTMLView from 'react-native-htmlview';
import {formatAMPM} from '../services/utilities/Misc';
import UserGroupImage from '../components/UserGroupImage';
import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomIconsComponent from '../components/CustomIcons';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AssignModal from '../components/AssignModal';
import {Popover} from '@ant-design/react-native';
import {translations} from '../constants/Default';
import GlobalStyles from '../constants/GlobalStyles';
import ActionSheetOptions from './ActionSheetOptions';
import TimerComponent from './TimerComponent';

export default function VisitorComponent(props) {
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth, collections, events}) => ({
    selectedEvent: auth.selectedEvent,
    user: auth.user,
    communityId: auth.community?.community?.id,
    usersCollection: collections?.users,
    groupsCollection: collections.groups,
    currentTask: events.currentTask,
  }));
  const {data, navigation} = props;

  const [expanded, setExpanded] = useState(false);
  const [phone, setPhone] = useState(data.author?.phone);
  const [alias, setAlias] = useState(data.author?.alias);
  const [email, setEmail] = useState(
    data.author?.email !== 'anon@pubble.co' ? data.author?.email : '',
  );
  const [emailNotification, setEmailNotification] = useState(false);
  const [smsNotification, setSMSNotification] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tagsData, setTagsData] = useState(data.tagSet);
  const [toggleTranslationOption, setToggleTranslationOption] = useState(false);
  const [translationSelectedOption, setTranslationSelectedOption] = useState(
    '',
  );
  const [lockUnlockButton, setLockUnlockButton] = useState(false);
  const [toggleVisibility, setToggleVisibility] = useState(false);
  const [toggleapproveString, setToggleapproveString] = useState(false);
  const [itemForAssign, setItemForAssign] = useState();
  const [visibility, setVisibility] = useState(data.privatePost);
  const [approveString, setApproveString] = useState(data.approved);
  const [questionCountString, setQuestionCountString] = useState(0);
  const [isDisableCloseButton, setIsDisableCloseButton] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const translationOptions = translations;
  const lockUnlockString = data.lockId
    ? data.lockId === reduxState.user.accountId
      ? 'Unlock'
      : 'Locked'
    : 'Lock';
  const getTranslation = data.attachments.find(
    (att) => att.type === 'translate',
  );
  if (getTranslation?.sourceLanguage === 'en') {
    translationOptions.unshift({
      name: 'English',
      nativeName: 'English',
      dir: 'ltr',
      code: 'en',
    });
  }
  const languageString =
    getTranslation?.sourceLanguage && getTranslation.targetLanguage
      ? `[${getTranslation.sourceLanguage} -> ${getTranslation?.targetLanguage}]`
      : '';
  useEffect(() => {
    getStateCountryFromIP();
    getQuestionCount();

    if (getTranslation?.enabled) {
      setTranslationSelectedOption(getTranslation.sourceLanguage);
    }
  }, []);

  async function getQuestionCount() {
    const res = await dispatch(
      eventsAction.chatmenuStreamVisitor({
        postTypes: 'Q,U,M',
        visitorId: data.author.id,
        communityId: reduxState.communityId,
        cookieId: data.author.cookieId,
      }),
    );
    if (res === null) {
      setQuestionCountString('First');
    } else {
      setQuestionCountString(res.data.length);
    }
  }

  async function getStateCountryFromIP() {
    const res = await dispatch(
      eventsAction.getStateCountryFromIPFuc({
        ip: data.author.ip,
        id: data.id,
      }),
    );
  }

  function onAssignClose() {
    setItemForAssign({});
  }

  const pinToTop = async () => {
    const params = {
      postId: data.id,
      appId: reduxState.selectedEvent.id,
    };
    await dispatch(eventsAction.pinToTop(params));
  };

  async function closeQuestion() {
    setIsDisableCloseButton(true);
    await dispatch(
      eventsAction.closeQuestionFunc({
        conversationId: data.conversationId,
      }),
    );
    navigation.navigate('Events');
  }

  const LockUnlock = async () => {
    setLockUnlockButton(true);
    const params = {
      conversationId: item.conversationId,
    };
    await dispatch(eventsAction.lockStream(params, lockUnlockString));
    setLockUnlockButton(false);
  };

  const deleteEvent = () => {
    const params = {
      postId: data.id,
    };

    Alert.alert('Are you sure?', 'You want to delete this post?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          await dispatch(eventsAction.deleteStreamData(params));
        },
      },
    ]);
  };

  async function changeVisibility() {
    setVisibility(!visibility);
    await dispatch(
      eventsAction.changeVisibility({
        postId: data.id,
      }),
    );
  }

  const approveUnapprove = async () => {
    setApproveString(!approveString);
    const apiUrlSLug = data.approved ? 'unapprove' : 'approve';
    const params = {
      postId: data.id,
    };
    await dispatch(
      eventsAction.approveDisapproveStreamData(params, apiUrlSLug),
    );
  };

  function onAssignPress() {
    setItemForAssign(data);
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

  async function sendNotification(type) {
    if (type === 'email') {
      setEmailNotification(true);
    } else {
      setSMSNotification(true);
    }
    await dispatch(
      eventsAction.sendEmailNotificationFunc({
        code: `reply.${type}.notify`,
        conversationId: data.conversationId,
        appId: reduxState.selectedEvent.id,
      }),
    );
  }

  async function banVisitor() {
    await dispatch(
      eventsAction.banVisitor({
        communityId: reduxState.communityId,
        type: 'ip',
        value: data.author.ip,
      }),
    );
  }

  async function tagHandler() {
    if (tagInput !== '') {
      setTagInput('');
      const tagRes = await dispatch(
        eventsAction.addTagsFunc({
          communityId: reduxState.communityId,
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
    Alert.alert('Are you sure?', 'You want to delete this tag?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const streamData = _.remove(tagsData, function (val) {
            return val.name !== tagValue;
          });
          setTagsData([...streamData]);
          dispatch(
            eventsAction.deleteTagsFunc({
              communityId: reduxState.communityId,
              conversationId: data.conversationId,
              postId: data.id,
              tags: tagValue,
            }),
          );
        },
      },
    ]);
  }

  async function updateStar() {
    const params = {
      conversationId: data.conversationId,
    };
    const reducerParam = {
      conversationId: data.conversationId,
      userId: reduxState.user.accountId,
      type: data.star ? 'unstar' : 'star',
    };
    await dispatch(
      eventsAction.updateStar(
        params,
        data.star ? 'unstar' : 'star',
        reducerParam,
      ),
    );
  }

  const translationOptionHandler = async () => {
    const params = {
      postId: data.id,
    };
    if (translationSelectedOption) {
      params.sourceLanguage = translationSelectedOption;
    }
    await dispatch(eventsAction.tranlationOptionFunc(params));
  };

  const fnDeleteDueDate = () => {
    Alert.alert('Are you sure?', 'You want to remove reminder?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: () => {
          deleteReminder();
        },
      },
    ]);
  };

  const deleteReminder = async () => {
    const params = {
      conversationId: data.conversationId,
    };
    await dispatch(eventsAction.deleteTaskReminder(params));
  };

  return (
    <>
      {/* Contain Area */}
      <KeyboardAwareScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.blueTitleText}>Visitor</Text>
          <View style={styles.rightSubHeader}>
            <TouchableOpacity style={styles.questionButton(Colors.tertiary)}>
              <Text style={styles.buttonText(Colors.white)}>
                {questionCountString} Questions
              </Text>
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
              data.author?.title ? (
                <Text style={styles.authorSubTitle}>{data.author?.title}</Text>
              ) : null
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
                  <View style={{marginHorizontal: 10}}>
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
                    {reduxState.selectedEvent.name}
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
            {data.assignees?.length &&
              data.assignees.map((assignee) => {
                return (
                  <UserGroupImage
                    key={`${assignee.id}`}
                    users={reduxState.usersCollection}
                    groups={reduxState.groupsCollection}
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
              placeholder="Input tags..."
              autoCorrect={false}
              value={tagInput}
              onChangeText={(text) => {
                setTagInput(text);
              }}
              style={styles.tagInput}
            />
            <TouchableOpacity
              onPress={tagHandler}
              containerStyle={styles.tagAddButton(!!tagInput)}
              disabled={!tagInput}>
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
                key={tag.name}
                onPress={() => tagDeleteHandler(tag.name)}
                style={styles.tagListTouchable}>
                <Text style={styles.tagListText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{padding: 20}}>
          {email ? (
            <TouchableOpacity
              onPress={() => sendNotification('email')}
              disabled={emailNotification}
              style={styles.sendEmailTouchable(emailNotification)}>
              <CustomIconsComponent
                color={Colors.primaryText}
                name={'envelope-o'}
                type={'FontAwesome'}
                size={20}
              />
              <Text style={styles.sendEmailText}>Send email notification</Text>
            </TouchableOpacity>
          ) : null}
          {phone ? (
            <TouchableOpacity
              onPress={() => sendNotification('sms')}
              disabled={smsNotification}
              style={[
                styles.sendEmailTouchable(smsNotification),
                styles.marginTop5,
              ]}>
              <CustomIconsComponent
                color={Colors.primaryText}
                name={'message-arrow-right'}
                type={'MaterialCommunityIcons'}
                size={20}
              />
              <Text style={styles.sendEmailText}>Send SMS notification</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={updateStar}
            style={styles.highlistTouchable(data.star)}>
            <CustomIconsComponent
              color={data.star ? 'white' : Colors.primaryText}
              name={data.star ? 'star' : 'staro'}
              type={'AntDesign'}
              size={20}
            />
            <Text style={styles.highlistText(data.star)}>
              Highlight this question
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dueDateTouchable}
            onPress={() => {
              reduxState.currentTask?.[0]?.executeTime
                ? fnDeleteDueDate()
                : setShowReminder(!showReminder);
            }}>
            <CustomIconsComponent
              color={Colors.primaryText}
              name={'clock'}
              type={'Feather'}
              size={20}
            />
            <Text style={styles.dueDateText}>
              {reduxState.currentTask?.[0]?.executeTime
                ? 'Due date -' +
                  moment(reduxState.currentTask?.[0].executeTime).format(
                    'ddd MMM DD YYYY hh:mm a',
                  )
                : 'Add reminder'}
            </Text>
          </TouchableOpacity>
          {showReminder && (
            <View style={styles.translationViewMainContainer}>
              <TimerComponent
                data={data}
                fnClose={() => setShowReminder(false)}
              />
            </View>
          )}
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
                ? `Active translation ${languageString}`
                : 'Set Translation...'}
            </Text>
          </TouchableOpacity>

          {toggleTranslationOption ? (
            <View style={styles.translationViewMainContainer}>
              {getTranslation !== undefined ? (
                <Text>
                  <Text style={{textTransform: 'uppercase'}}>
                    {languageString}
                  </Text>{' '}
                  translation is enabled
                </Text>
              ) : (
                <Text>
                  If the visitor uses a different language click enable to
                  trigger translation chat options
                </Text>
              )}
              <View style={styles.translationDropdown}>
                <ActionSheetOptions
                  options={translations}
                  isShowValueField={false}
                  selectedOption={translationSelectedOption}
                  displayField={'nativeName'}
                  valueField={'code'}
                  placeholder={'Detect Language Automatically'}
                  onSelectOption={(option) => {
                    setTranslationSelectedOption(option);
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={translationOptionHandler}
                style={styles.translationChangeBtn}>
                <Text style={styles.translationChangeText}>
                  {getTranslation?.enabled ? 'Change' : 'Enable'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.actionMainContainer}>
        <Popover
          duration={0}
          useNativeDriver={true}
          overlay={
            <View style={styles.approvePopoverContainer}>
              <TouchableOpacity style={styles.popoverItemContainer}>
                <Text style={styles.popoverItem}>{'View transcript'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pinToTop}
                style={[styles.popoverItemContainer, styles.actionPintotop]}>
                <Text style={styles.popoverItem}>{'Pin to top of stream'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popoverItemContainer}
                onPress={banVisitor}>
                <Text style={styles.popoverItem}>{'Ban visitor...'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popoverItemContainer}
                onPress={deleteEvent}>
                <Text style={styles.popoverItem}>{'Delete...'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={LockUnlock}
                style={styles.popoverItemContainer}
                disabled={lockUnlockString === 'locked' || lockUnlockButton}>
                <Text style={styles.popoverItem}>{lockUnlockString}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popoverItemContainer}
                onPress={() => setToggleVisibility(!toggleVisibility)}>
                <View style={styles.actionVisiblityContainer}>
                  <Text style={styles.actionVisiblityText}>
                    Visibility:{' '}
                    <Text style={styles.popoverItem}>
                      {!visibility ? 'Public' : 'Private'}
                    </Text>
                  </Text>

                  <CustomIconsComponent
                    color={Colors.primaryText}
                    name={'down'}
                    type="AntDesign"
                    size={18}
                  />
                </View>
              </TouchableOpacity>

              {toggleVisibility ? (
                <TouchableOpacity
                  onPress={changeVisibility}
                  style={styles.actionVisiblityOption}>
                  <Text style={styles.popoverItem}>
                    Change to {visibility ? 'Public' : 'Private'}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => setToggleapproveString(!toggleapproveString)}
                style={[
                  styles.popoverItemContainer,
                  styles.actionStatusTouchable,
                ]}>
                <Text style={styles.actionStatusText}>
                  Status:{' '}
                  <Text style={styles.popoverItem}>
                    {approveString ? 'Approved' : 'Unapprove'}
                  </Text>
                </Text>

                <CustomIconsComponent
                  color={Colors.primaryText}
                  name={'down'}
                  type="AntDesign"
                  size={18}
                />
              </TouchableOpacity>

              {toggleapproveString ? (
                <TouchableOpacity
                  onPress={approveUnapprove}
                  style={styles.actionVisiblityOption}>
                  <Text style={styles.popoverItem}>
                    {!approveString ? 'Approved' : 'Unapprove'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
          placement={'top'}>
          <View style={styles.actionTouchable}>
            <Text style={styles.actionText}>Actions...</Text>
          </View>
        </Popover>

        <TouchableOpacity
          onPress={() => closeQuestion()}
          disabled={isDisableCloseButton}>
          <View style={styles.actionCloseTouchable(isDisableCloseButton)}>
            <CustomIconsComponent
              color={Colors.white}
              name={'check'}
              type={'Entypo'}
              size={18}
            />
            <Text style={styles.actionCloseText}>Close question</Text>
          </View>
        </TouchableOpacity>
      </View>
      {itemForAssign?.id ? (
        <AssignModal
          itemForAssign={itemForAssign}
          onRequestClose={() => onAssignClose()}
        />
      ) : null}
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
    marginLeft: 7,
  }),
  buttonText: (textColor) => ({
    color: textColor,
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: 'bold',
  }),
  inputFormContainer: {
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
    justifyContent: 'center',
    padding: 10,
  },
  assigneeImage: {
    height: 50,
    width: 50,
    borderRadius: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  },
  questionContentText: {
    color: Colors.white,
    fontWeight: '700',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: Colors.primaryText,
    borderRadius: 28,
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  tagAddButton: (isActive) => {
    return {
      backgroundColor: Colors.green,
      padding: 5,
      borderRadius: 5,
      opacity: isActive ? 1 : 0.5,
    };
  },
  tagAddButtonActive: {
    opacity: 1,
  },
  tagListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagListTouchable: {
    backgroundColor: Colors.primaryText,
    borderRadius: 28,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 8,
    marginRight: 8,
  },
  tagListText: {
    color: Colors.white,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  sendEmailTouchable: (emailNotification) => ({
    opacity: emailNotification ? 0.4 : 1,
    backgroundColor: Colors.primaryInactive,
    borderWidth: 2,
    borderColor: Colors.primaryInactive,
    borderRadius: 2,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  marginTop5: {
    marginTop: 5,
  },
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
  translationViewMainContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primaryText,
    borderTopWidth: 0,
  },
  translationDropdown: {
    marginTop: 12,
  },
  translationChangeBtn: {
    backgroundColor: Colors.usersBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 12,
    borderRadius: 2,
    zIndex: 0,
  },
  translationChangeText: {color: Colors.white, fontSize: 15},
  actionMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionPintotop: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryInactive,
  },
  actionVisiblityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
  },
  actionVisiblityText: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: '300',
  },
  actionVisiblityOption: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primaryText,
    padding: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 3,
    borderRadius: 5,
  },
  actionStatusTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionStatusText: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: '300',
  },
  actionTouchable: {
    backgroundColor: Colors.primaryText,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.primaryText,
    borderRadius: 2,
    marginRight: 15,
  },
  actionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionCloseTouchable: (isDisableCloseButton) => ({
    backgroundColor: Colors.green,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.green,
    borderRadius: 2,
    flexDirection: 'row',
    opacity: isDisableCloseButton ? 0.5 : 1,
  }),
  actionCloseText: {
    marginLeft: 8,
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  approvePopoverContainer: {
    maxWidth: GlobalStyles.windowWidth * 0.6,
    backgroundColor: '#F8FAFB',
  },
  popoverItemContainer: {
    padding: 12,
  },
  popoverItem: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: 'bold',
  },
  popoverHintContainer: {
    borderTopWidth: 1,
    borderTopColor: '#dfe5e9',
    backgroundColor: Colors.primaryTilt,
    padding: 12,
  },
  popoverHint: {
    color: Colors.primaryText,
  },
  popoverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approvedIcon: {},
  approvedLabelTitle: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  unApprovedLabelTitle: {
    color: Colors.unapproved,
  },
  checkmarkIcon: {
    marginRight: 5,
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  assignCountContainer: {
    backgroundColor: Colors.primaryText,
    borderRadius: 50,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  assignCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  tabData: {
    flex: 0,
    zIndex: -1,
    opacity: 0,
    height: 0,
  },
  activeTabData: {
    flex: 1,
    zIndex: 10,
    opacity: 1,
    height: 'auto',
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
