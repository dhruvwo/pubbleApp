import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import {TextareaItem} from '@ant-design/react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';
import ActionSheetOptions from './ActionSheetOptions';
import {eventsAction} from '../store/actions';
import {useDispatch} from 'react-redux';

export default function AddTwitterQuestion(props) {
  const dispatch = useDispatch();
  const {
    onRequestClose,
    selectedEvent,
    communityId,
    currentUser,
    usersCollection,
  } = props;
  const [questionText, setQuestionText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagsData, setTagsData] = useState([]);
  const [approved, setApproved] = useState(false);
  const [toggleTooltip, setToggleTooltip] = useState(false);
  const [assignMembers, setAssignMembers] = useState([]);
  const [assignMembersArray, setAssignMembersArray] = useState([]);
  const [apiResponse, setApiResponse] = useState();
  const [disableCreateBtn, setDisableCreateBtn] = useState(false);

  useEffect(() => {
    const assignArr = [];
    selectedEvent.moderators.map((events) =>
      assignArr.push(usersCollection[events]),
    );
    setAssignMembersArray(assignArr);
    setAssignMembers([currentUser.id]);
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
          const streamData = _.remove(tagsData, function (val) {
            return val !== tagValue;
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
      setDisableCreateBtn(true);
      const params = {
        communityId: communityId,
        appId: selectedEvent.id,
        postToType: 'app',
        type: 'Q',
        content: questionText,
        postAsVisitor: true,
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

  return (
    <>
      <View style={styles.contentContainer}>
        {apiResponse === undefined ? (
          <>
            <Text style={styles.addQuestionText}>
              Add question from twitter
            </Text>
            <Text style={styles.addQuestionSubText}>
              Paste twitter link to create a question with that tweet post
            </Text>

            <View style={styles.mt15}>
              <Text style={styles.QuestionText}>
                Twitter link <Text style={{color: Colors.red}}>*</Text>
              </Text>

              <View style={styles.QuestionInput}>
                <TextareaItem
                  rows={4}
                  value={questionText}
                  onChangeText={(text) => {
                    setQuestionText(text);
                  }}
                />
              </View>
            </View>

            <View style={styles.tagMainContainer}>
              <Text>Tag the conversation with searchable keywords</Text>
              <View style={styles.tagContainer}>
                <TextInput
                  placeholder="Input tags..."
                  autoCorrect={false}
                  value={tagInput}
                  onChangeText={(text) => {
                    setTagInput(text);
                  }}
                  onSubmitEditing={tagHandler}
                  style={styles.tagInput}
                />
                <TouchableOpacity
                  onPress={tagHandler}
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
                    onPress={() => tagDeleteHandler(tag)}
                    style={styles.tagListTouchable}>
                    <Text style={styles.tagListText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.mt15}>
              <Text>
                Assign team members or entire groups to this question or click
                name to remove
              </Text>

              <View style={styles.QuestionInput}>
                <ActionSheetOptions
                  options={assignMembersArray}
                  selectedOption={assignMembers}
                  displayField={'alias'}
                  valueField={'id'}
                  placeholder={'Click to assign'}
                  onSelectOption={(option) => {
                    setAssignMembers([...assignMembers, option]);
                  }}
                />
              </View>

              <View style={styles.assignMemberMainContainer}>
                {assignMembers?.map((assign, index) => {
                  const getUserData = usersCollection[assign];
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
                        {getUserData.alias}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
                Twitter question was submitted
              </Text>
            </View>

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
        <View>
          {toggleTooltip ? (
            <View style={styles.tooltipMainContainer}>
              <View style={styles.tooltipContainer}>
                <Text style={styles.tooltipText1}>
                  This item will be created as{' '}
                  {approved ? 'approved' : 'unapproved'}
                </Text>
                <Text style={styles.tooltipText2}>
                  Click to change status to{' '}
                  {!approved ? 'approved' : 'unapproved'}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.bottomActionBtnMainContainer}>
            {toggleTooltip ? (
              <View style={styles.tooltipBottomArrow}></View>
            ) : null}
            <View style={styles.bottomActionBtnContainer(toggleTooltip)}>
              <TouchableOpacity
                onPress={() => {
                  setToggleTooltip(true);
                  setApproved(!approved);
                }}
                style={styles.bottomActionBtnApproveTouchable(approved)}>
                <Text style={styles.bottomActionBtnApproveText(approved)}>
                  {approved ? 'Approved Poll' : 'Unapproved Poll'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onCreateHandler}
                style={styles.bottomActionBtnCreateTouchable(questionText)}
                disabled={
                  questionText !== '' || disableCreateBtn ? false : true
                }>
                <Text style={styles.bottomActionBtnCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  QuestionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  QuestionInput: {
    borderWidth: 1,
    borderColor: Colors.primaryText,
    marginTop: 8,
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
  tooltipMainContainer: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  tooltipContainer: {
    backgroundColor: Colors.primaryActive,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  tooltipText1: {
    color: Colors.white,
    fontSize: 15,
    marginBottom: 5,
  },
  tooltipText2: {
    color: Colors.white,
    fontSize: 15,
  },
  tooltipBottomArrow: {
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.primaryActive,
    transform: [{rotate: '180deg'}],
    marginRight: 355,
    marginLeft: 45,
  },
  bottomActionBtnMainContainer: {
    backgroundColor: Colors.primaryInactive,
  },
  bottomActionBtnContainer: (toggleTooltip) => ({
    paddingHorizontal: 20,
    paddingTop: toggleTooltip ? null : 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  bottomActionBtnApproveTouchable: (approved) => ({
    borderWidth: 1,
    borderColor: approved ? Colors.green : Colors.unapproved,
    backgroundColor: Colors.white,
  }),
  bottomActionBtnApproveText: (approved) => ({
    color: approved ? Colors.green : Colors.unapproved,
    paddingHorizontal: 8,
    paddingVertical: 3,
  }),
  bottomActionBtnCreateTouchable: (questionText) => ({
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
    opacity: questionText !== '' ? 1 : 0.5,
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
  },
});
