import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {Checkbox} from '@ant-design/react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';
import CustomFormInput from './CustomFormInput';
import {useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {eventsAction} from '../store/actions';
import ToastService from '../services/utilities/ToastService';

export default function AddPollComponent(props) {
  const {data, isClone} = props;
  const [questionText, setQuestionText] = useState('');
  const [choiceText, setChoiceText] = useState('');
  const [choiceTextArray, setChoiceTextArray] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagsData, setTagsData] = useState([]);
  const [choiceEdit, setChoiceEdit] = useState();
  const [choiceEditText, setChoiceEditText] = useState('');
  const [approved, setApproved] = useState(false);
  const reduxState = useSelector(({auth}) => ({
    appId: auth.selectedEvent.id,
    communityId: auth?.community?.community?.id || '',
  }));

  useEffect(() => {
    if (data) {
      setQuestionText(data.content);
      let pollOptionData = [];
      data?.attachments.map((val, i) => pollOptionData.push(val.desc));
      setChoiceTextArray(pollOptionData);
      setTagsData(data.tags);
      setApproved(data.approved);
    }
  }, [data]);

  function onChoiceHandler(isEdit) {
    if (isEdit) {
      if (choiceTextArray[choiceEdit]) {
        choiceTextArray[choiceEdit] = choiceEditText;
      }
      setChoiceTextArray(choiceTextArray);
      setChoiceEditText('');
      setChoiceEdit();
    } else {
      if (choiceText === '') {
        Alert.alert('Please enter choice');
      } else {
        if (choiceText.length <= 60) {
          setChoiceTextArray([...choiceTextArray, choiceText]);
          setChoiceText('');
        } else {
          Alert.alert('Only 60 characters allowed in choice');
        }
      }
    }
  }

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

  function onRemoveChoices(choiceText) {
    Alert.alert('Are you sure?', 'You want to delete this choice?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const choicesData = _.remove(choiceTextArray, function (val, ind) {
            return ind !== choiceText;
          });
          setChoiceTextArray([...choicesData]);
        },
      },
    ]);
  }

  async function onCreateHandler() {
    if (questionText !== '' && choiceTextArray.length >= 2) {
      const params = {
        content: questionText,
        startDate: 0,
        endDate: 0,
        approved: approved,
        communityId: reduxState.communityId,
        appId: reduxState.appId,
        type: 'V',
      };

      if (tagsData.length > 0) {
        params.tags = tagsData.join(',');
      }

      _.each(choiceTextArray, function (choice, key) {
        let index = 'pollOption' + (key + 1);
        params[`${index}`] = choice;
      });
      if (!item.id || (item.id && isClone)) {
        await dispatch(eventsAction.addNewAnnouncementFunc(params, 'poll'));
        ToastService({
          message: 'Poll successfully created',
        });
      } else {
        params.postId = item.id;
        await dispatch(eventsAction.updatePoll(params));
        ToastService({
          message: 'Poll successfully updated',
        });
      }
      props.navigation.goBack();
    } else {
      Alert.alert('Please enter question and choices first.');
    }
  }

  return (
    <>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.innerContentContainer}>
          <View style={styles.mt15}>
            <Text style={styles.inputLabel}>Question</Text>
            <Text>{questionText.length || 0} / 160</Text>
          </View>

          <CustomFormInput
            placeholder="please add text for question"
            value={questionText}
            maxLength={160}
            onChange={(text) => {
              setQuestionText(text);
            }}
          />

          <View style={styles.choiceMainContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.inputLabel}>
                Choices{' '}
                {choiceTextArray.length === 1 ? (
                  <Text style={styles.choiceWarningText}>
                    (please add atleast two choices)
                  </Text>
                ) : null}
              </Text>
              {choiceTextArray.length === 0 ? (
                <Text> {choiceText.length || 0} / 60</Text>
              ) : null}
            </View>

            {choiceTextArray?.map((choice, index) => {
              // if (choiceEdit === index) {
              return (
                // <View key={index} style={styles.choiceEditMainContiner}>
                <View
                  key={index}
                  style={styles.editInputContainer(choiceEdit === index)}>
                  <CustomIconsComponent
                    type={'AntDesign'}
                    color={Colors.secondary}
                    name={'checkcircleo'}
                    size={20}
                  />
                  <TextInput
                    editable={choiceEdit === index}
                    autoCorrect={false}
                    value={
                      choiceEdit === index
                        ? choiceEditText
                        : choice.substring(0, 40)
                    }
                    onChangeText={(text) => {
                      setChoiceEditText(text);
                    }}
                    style={styles.tagInput}
                  />
                  {choiceEdit !== index ? (
                    <View style={styles.choiceActionContainer}>
                      <TouchableOpacity onPress={() => onRemoveChoices(index)}>
                        <CustomIconsComponent
                          type={'AntDesign'}
                          color={Colors.unapproved}
                          name={'minuscircle'}
                          size={20}
                          style={{
                            marginRight: 8,
                          }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setChoiceEditText(choice);
                          setChoiceEdit(index);
                        }}>
                        <CustomIconsComponent
                          type={'MaterialCommunityIcons'}
                          color={Colors.yellow}
                          name={'pencil-circle'}
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => onChoiceHandler(true)}>
                      <CustomIconsComponent
                        type={'AntDesign'}
                        color={Colors.secondary}
                        name={'checkcircle'}
                        size={20}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}

            {choiceTextArray.length ? (
              <View style={styles.choiceTextLengthView}>
                <Text style={styles.choiceTextLengthText(choiceText.length)}>
                  {choiceText.length || 0} / 60
                </Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <CustomFormInput
                labelNumber={2}
                containerStyle={styles.choiceInputView}
                value={choiceText}
                placeholder="add a new choice..."
                onSubmitEditing={() => onChoiceHandler(false)}
                onChange={(value) => {
                  setChoiceText(value);
                }}
              />
              <TouchableOpacity
                onPress={() => onChoiceHandler(false)}
                style={styles.choiceInputTouchable(!!choiceText)}
                disabled={!choiceText}>
                <CustomIconsComponent
                  type={'AntDesign'}
                  color={Colors.secondary}
                  name={'pluscircle'}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tagMainContainer}>
            <Text style={styles.inputLabel}>Tags</Text>
            <View style={styles.tagContainer}>
              <CustomFormInput
                placeholder="Input tags..."
                value={tagInput}
                onChange={(text) => {
                  setTagInput(text);
                }}
                containerStyle={styles.inputTagsContainer}
                onSubmitEditing={tagHandler}
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
                  onPress={() => tagDeleteHandler(index)}
                  style={styles.tagListTouchable}>
                  <Text style={styles.tagListText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.checkboxInput}>
            <Checkbox
              checked={approved}
              onChange={(e) => {
                setApproved(!approved);
              }}>
              Approved Poll
            </Checkbox>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        onPress={onCreateHandler}
        style={styles.bottomActionBtnCreateTouchable(
          questionText,
          choiceTextArray.length,
        )}
        disabled={
          questionText !== '' && choiceTextArray.length >= 2 ? false : true
        }>
        <Text style={styles.bottomActionBtnCreateText}>
          {data && !isClone ? 'Edit' : 'Create'}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  innerContentContainer: {
    flex: 1,
    padding: 20,
  },
  editInputContainer: (isEditable) => ({
    flexDirection: 'row',
    borderWidth: 1,
    marginVertical: 5,
    borderColor: isEditable ? Colors.secondary : 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
  }),
  inputTags: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: Colors.primaryText,
    borderRadius: 28,
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  checkboxInput: {
    marginTop: 15,
  },
  choiceListContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
    flexShrink: 1,
  },
  QuestionInput: {
    borderWidth: 1,
    borderColor: Colors.primaryText,
    marginTop: 8,
    borderRadius: 5,
  },
  inputTagsContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  choiceMainContainer: {
    marginTop: 20,
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
  choiceListTextView: {
    flexDirection: 'row',
    marginLeft: 10,
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
    marginTop: 5,
  },
  choiceTextLengthText: (choiceText, hasChoices) => ({
    color: choiceText > 60 ? Colors.unapproved : Colors.black,
    marginRight: hasChoices ? 40 : 0,
    marginBottom: 5,
  }),
  choiceInputView: {
    borderWidth: 1,
    borderColor: Colors.primaryText,
    flexGrow: 1,
    flexShrink: 1,
    borderRadius: 5,
    marginTop: 8,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceInputTouchable: (choiceText) => ({
    opacity: choiceText ? 1 : 0.5,
    marginLeft: 10,
  }),
  tagMainContainer: {
    marginTop: 15,
  },
  tagsMainContainer: {paddingHorizontal: 20},
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 10,
  },
  tagAddButton: (isActive) => {
    return {
      backgroundColor: Colors.green,
      padding: 5,
      borderRadius: 20,
      opacity: isActive ? 1 : 0.5,
      marginLeft: 10,
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
  bottomActionBtnCreateTouchable: (questionText, choiceTextArrayLength) => ({
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
    opacity: questionText !== '' && choiceTextArrayLength >= 2 ? 1 : 0.5,
    paddingVertical: 10,
    alignItems: 'center',
  }),
  bottomActionBtnCreateText: {
    color: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontWeight: 'bold',
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
  mt15: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
