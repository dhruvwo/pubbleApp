import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import CustomFormInput from './CustomFormInput';
import {Checkbox} from '@ant-design/react-native';
import AssignModal from './AssignModal';
import ActionSheetOptions from './ActionSheetOptions';
import {phoneCountryCode} from '../constants/Default';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function AddQuestion(props) {
  const dispatch = useDispatch();
  const {onRequestClose} = props;
  const [nameText, setNameText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [phoneText, setPhoneText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagsData, setTagsData] = useState([]);
  const [approved, setApproved] = useState(false);
  const [assignMembers, setAssignMembers] = useState([]);
  const [apiResponse, setApiResponse] = useState();
  const [displayAssignModal, setDisplayAssignModal] = useState(false);
  const [translationSelectedOption, setTranslationSelectedOption] = useState(
    '353',
  );

  const reduxState = useSelector(({collections, auth}) => ({
    selectedEvent: auth?.selectedEvent,
    communityId: auth?.community?.community?.id || '',
    currentUser: auth?.community?.account,
    usersCollection: collections.users,
    groupsCollection: collections.groups,
  }));

  useEffect(() => {
    setAssignMembers([reduxState.currentUser.id]);
  }, []);

  async function tagHandler() {
    if (tagInput !== '') {
      setTagInput('');
      setTagsData([...tagsData, tagInput]);
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
          const streamData = _.remove(tagsData, function (val, index) {
            return index !== tagValue;
          });
          setTagsData([...streamData]);
        },
      },
    ]);
  }

  function assignMemberDelete(assignId) {
    Alert.alert(
      'Are you sure?',
      'You want to delete this assigned member or group?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const assignMembersData = _.remove(assignMembers, function (val) {
              return val !== assignId;
            });
            setAssignMembers([...assignMembersData]);
          },
        },
      ],
    );
  }

  async function onCreateHandler() {
    if (questionText !== '') {
      const params = {
        communityId: reduxState.communityId,
        appId: reduxState.selectedEvent.id,
        postToType: 'app',
        type: 'Q',
        content: questionText,
        phone:
          phoneText !== '' ? `+${translationSelectedOption}-` + phoneText : '',
        postAsVisitor: true,
        email: emailText,
        visitor: true,
        name: nameText,
        internal: false,
        approved: approved,
      };

      if (tagsData.length > 0) {
        params.tags = tagsData.join(',');
      }

      if (assignMembers.length > 0) {
        params.assignAccountIds = assignMembers.join(',');
      }

      const response = await dispatch(
        eventsAction.addNewAnnouncementFunc(params, 'question'),
      );
      setApiResponse(response);
    } else {
      Alert.alert('Please enter name, email, phone, question first.');
    }
  }
  const assigneeList = {
    assignees: Object.values(reduxState.usersCollection),
  };

  return displayAssignModal ? (
    <View style={{flex: 1}}>
      <AssignModal
        assignedItems={assignMembers}
        itemForAssign={assigneeList}
        onRequestClose={() => setDisplayAssignModal(false)}
        isPersonAssign={true}
        onPressAssign={(data) => setAssignMembers(data)}
      />
    </View>
  ) : (
    <>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentContainer}>
          {apiResponse === undefined ? (
            <>
              <Text style={styles.addQuestionSubText}>
                You are posting a question on behalf of a customer
              </Text>

              <View style={styles.mt15}>
                <Text style={styles.inputLabel}>Name</Text>

                <View style={styles.QuestionInput}>
                  <CustomFormInput
                    placeholder="Name"
                    labelNumber={2}
                    value={nameText}
                    onChange={(value) => {
                      setNameText(value);
                    }}
                  />
                </View>
              </View>

              <View style={styles.mt15}>
                <Text style={styles.inputLabel}>Email</Text>

                <View style={styles.QuestionInput}>
                  <CustomFormInput
                    placeholder="Email"
                    labelNumber={2}
                    value={emailText}
                    onChange={(value) => {
                      setEmailText(value);
                    }}
                  />
                </View>
              </View>

              <View style={styles.mt15}>
                <Text style={styles.inputLabel}>Phone</Text>

                <View style={styles.QuestionInput}>
                  <CustomFormInput
                    placeholder="Phone"
                    value={phoneText}
                    renderInnerView={() => {
                      return (
                        <View style={styles.phoneCodeContainer}>
                          <ActionSheetOptions
                            options={phoneCountryCode}
                            selectedOption={translationSelectedOption}
                            isShowValueField={true}
                            displayField={'name'}
                            valueField={'phoneCode'}
                            onSelectOption={(option) => {
                              setTranslationSelectedOption(option);
                            }}
                          />
                        </View>
                      );
                    }}
                    onChange={(value) => {
                      setPhoneText(value);
                    }}
                  />
                </View>

                <View style={styles.mt15}>
                  <Text style={styles.inputLabel}>
                    Question <Text style={{color: Colors.red}}>*</Text>
                  </Text>

                  <View style={styles.QuestionInput}>
                    <CustomFormInput
                      numOfRows={4}
                      textArea={true}
                      value={questionText}
                      onChange={(text) => {
                        setQuestionText(text);
                      }}
                    />
                  </View>
                </View>

                <View style={styles.tagMainContainer}>
                  <Text>Tag the conversation with searchable keywords</Text>
                  <View style={styles.tagContainer}>
                    <View
                      style={[styles.QuestionInput, styles.inputTagsContainer]}>
                      <CustomFormInput
                        placeholder="Input tags..."
                        value={tagInput}
                        onChange={(text) => {
                          setTagInput(text);
                        }}
                        onSubmitEditing={() => tagHandler()}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => tagHandler()}
                      style={styles.tagAddButton(!!tagInput)}
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
                    {tagsData.map((tag, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => tagDeleteHandler(index)}
                        style={styles.tagListTouchable}>
                        <Text style={styles.tagListText}>{tag}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.mt15}>
                  <Text>
                    Assign team members or entire groups to this question or
                    click name to remove
                  </Text>

                  <View style={styles.QuestionInput}>
                    <TouchableOpacity
                      style={styles.clickToAssign}
                      onPress={() => setDisplayAssignModal(true)}>
                      <Text>Click to assign</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.assignMemberMainContainer}>
                    {assignMembers?.map((assign, index) => {
                      let getUserData = reduxState.usersCollection[assign];
                      if (!getUserData) {
                        getUserData = reduxState.groupsCollection[assign];
                      }
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => assignMemberDelete(assign)}
                          style={styles.assignMemberTouchable}>
                          <CustomIconsComponent
                            color={'white'}
                            name={'user-circle-o'}
                            type={'FontAwesome'}
                            size={20}
                          />
                          <Text style={styles.assignMemberText}>
                            {getUserData.name || getUserData.alias}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.mt15}>
                  <Checkbox
                    checked={approved}
                    onChange={(e) => {
                      setApproved(!approved);
                    }}>
                    {approved ? 'Approved Poll' : 'Unapproved Poll'}
                  </Checkbox>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.submittedQuestionContainer}>
                <View style={styles.countContainer}>
                  <Text style={styles.countText}>
                    {apiResponse.type}
                    {apiResponse.count}
                  </Text>
                </View>

                <Text style={styles.submittedQuestionText}>
                  Question was submitted
                </Text>
              </View>

              <Text style={styles.submittedQuestionText1}>
                You can see the question link below.
              </Text>
              <Text style={styles.submittedQuestionText2}>
                The customer also received this link via SMS or email if
                provided
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(apiResponse.landingPage);
                }}>
                <Text style={styles.submittedQuestionText3}>
                  {apiResponse.landingPage}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
      {apiResponse !== undefined ? (
        <View>
          <View style={styles.bottomActionBtnMainContainer}>
            <View style={styles.submittedQuestionActionContainer}>
              <TouchableOpacity
                onPress={onRequestClose}
                style={styles.submittedQuestionActionTouchable}>
                <Text style={styles.bottomActionBtnCreateText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onCreateHandler}
          style={styles.bottomActionBtnCreateTouchable(questionText)}
          disabled={questionText !== '' ? false : true}>
          <Text style={styles.bottomActionBtnCreateText}>Create</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  clickToAssign: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  QuestionInput: {
    borderWidth: 1,
    borderColor: Colors.primaryText,
    marginTop: 8,
  },
  inputTagsContainer: {
    flexGrow: 1,
    flexShrink: 1,
    marginTop: 0,
  },
  choiceMainContainer: {
    marginTop: 20,
  },
  choiceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  choiceWarningText: {
    color: Colors.unapproved,
    marginLeft: 5,
  },
  choiceEditMainContiner: {
    backgroundColor: Colors.greyBorder,
    padding: 10,
  },
  choiceEditButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  choiceListContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
    flexShrink: 1,
  },
  choiceListTextView: {
    flexDirection: 'row',
  },
  choiceListText: {
    marginLeft: 8,
    flexGrow: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 15,
  },
  choiceActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceTextLengthView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  choiceTextLengthText: (choiceText) => ({
    color: choiceText > 60 ? Colors.unapproved : Colors.black,
  }),
  choiceInputView: {
    borderWidth: 1,
    borderColor: Colors.primaryText,
    marginTop: 8,
  },
  choiceInputTouchable: (choiceText) => ({
    opacity: choiceText ? 1 : 0.5,
  }),
  tagMainContainer: {
    marginTop: 15,
  },
  tagsMainContainer: {paddingHorizontal: 20},
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tagInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: Colors.primaryText,
    borderRadius: 5,
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  tagAddButton: (isActive) => {
    return {
      backgroundColor: Colors.green,
      padding: 5,
      borderRadius: 20,
      marginLeft: 10,
      opacity: isActive ? 1 : 0.5,
    };
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
  bottomActionBtnMainContainer: {
    backgroundColor: Colors.primaryInactive,
  },
  bottomActionBtnContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomActionBtnCreateTouchable: (questionText) => ({
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
    opacity: questionText !== '' ? 1 : 0.5,
    paddingVertical: 10,
    alignItems: 'center',
  }),
  bottomActionBtnCreateText: {
    color: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
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
  mt15: {
    marginTop: 15,
  },
  assignMemberMainContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  assignMemberTouchable: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    marginTop: 15,
    padding: 8,
    marginRight: 8,
  },
  assignMemberText: {
    color: Colors.white,
    fontSize: 15,
    marginLeft: 10,
  },
  submittedQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submittedQuestionText: {
    marginLeft: 15,
    fontSize: 15,
    color: Colors.greyText,
  },
  submittedQuestionText1: {
    marginTop: 15,
    fontSize: 15,
  },
  submittedQuestionText2: {
    marginTop: 5,
    fontSize: 15,
  },
  submittedQuestionText3: {
    marginTop: 5,
    fontSize: 16,
    color: Colors.secondary,
    textDecorationLine: 'underline',
  },
  submittedQuestionActionContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'flex-end',
  },
  submittedQuestionActionTouchable: {
    borderWidth: 1,
    borderColor: Colors.greyText,
    backgroundColor: Colors.greyText,
  },
  addQuestionText: {
    color: Colors.secondary,
    fontSize: 18,
    marginBottom: 5,
  },
  addQuestionSubText: {
    color: Colors.greyText,
    fontSize: 15,
    textAlign: 'center',
  },
  phoneCodeContainer: {
    marginLeft: -8,
    width: 100,
  },
});
