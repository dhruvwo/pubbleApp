import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {TextareaItem, InputItem} from '@ant-design/react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';

export default function AddPollComponent(props) {
  const {
    toggleAddContentModal,
    onRequestClose,
    selectedEvent,
    communityId,
    onAddingPoll,
  } = props;
  const [questionText, setQuestionText] = useState('');
  const [choiceText, setChoiceText] = useState('');
  const [choiceTextArray, setChoiceTextArray] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagsData, setTagsData] = useState([]);
  const [choiceEdit, setChoiceEdit] = useState();
  const [choiceEditText, setChoiceEditText] = useState('');
  const [approved, setApproved] = useState(false);
  const [toggleTooltip, setToggleTooltip] = useState(false);

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
          const streamData = _.remove(tagsData, function (val) {
            return val !== tagValue;
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
          const choicesData = _.remove(choiceTextArray, function (val) {
            return val !== choiceText;
          });
          setChoiceTextArray([...choicesData]);
        },
      },
    ]);
  }

  function onCreateHandler() {
    if (questionText !== '' && choiceTextArray.length > 2) {
      onRequestClose();
      const params = {
        content: questionText,
        startDate: 0,
        endDate: 0,
        approved: approved,
        communityId: communityId,
        appId: selectedEvent.id,
        type: 'V',
      };

      if (tagsData.length > 0) {
        params.tags = tagsData.join(',');
      }

      _.each(choiceTextArray, function (choice, key) {
        let index = 'pollOption' + (key + 1);
        params[`${index}`] = choice;
      });
      onAddingPoll(params);
    } else {
      Alert.alert('Please enter question and choices first.');
    }
  }

  return (
    <>
      <View style={styles.contentContainer}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.QuestionText}>Question</Text>
            <Text>{questionText.length || 0} / 160</Text>
          </View>

          <View style={styles.QuestionInput}>
            <TextInput
              placeholder="please add text for question"
              placeholderTextColor={Colors.placeholder}
              autoCorrect={false}
              value={questionText}
              maxLength={160}
              onChangeText={(text) => {
                setQuestionText(text);
              }}
              style={{
                padding: 15,
              }}
            />
          </View>
        </View>

        <View style={styles.choiceMainContainer}>
          <Text style={styles.choiceText}>
            Choices{' '}
            {choiceTextArray.length === 1 ? (
              <Text style={styles.choiceWarningText}>
                (please add atleast two choices)
              </Text>
            ) : null}
          </Text>

          {choiceTextArray?.map((choice, index) => {
            if (choiceEdit === index) {
              return (
                <View key={index} style={styles.choiceEditMainContiner}>
                  <TextInput
                    autoCorrect={false}
                    value={choiceEditText}
                    onChangeText={(text) => {
                      setChoiceEditText(text);
                    }}
                    style={styles.tagInput}
                  />
                  <View style={styles.choiceEditButtonsContainer}>
                    <TouchableOpacity onPress={() => setChoiceEdit()}>
                      <CustomIconsComponent
                        type={'Entypo'}
                        color={Colors.primary}
                        name={'squared-cross'}
                        size={30}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onChoiceHandler(true)}>
                      <CustomIconsComponent
                        type={'AntDesign'}
                        color={Colors.primary}
                        name={'checksquare'}
                        size={28}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            } else {
              return (
                <View key={index} style={styles.choiceListContainer}>
                  <View style={styles.choiceListTextView}>
                    <CustomIconsComponent
                      type={'AntDesign'}
                      color={Colors.secondary}
                      name={'checkcircleo'}
                      size={20}
                    />
                    <Text style={styles.choiceListText}>
                      {choice.substring(0, 40)}
                    </Text>
                  </View>

                  <View style={styles.choiceActionContainer}>
                    <TouchableOpacity onPress={() => onRemoveChoices(choice)}>
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
                </View>
              );
            }
          })}

          <View style={styles.choiceTextLengthView}>
            <Text style={styles.choiceTextLengthText(choiceText.length)}>
              {choiceText.length || 0} / 60
            </Text>
          </View>
          <View style={styles.choiceInputView}>
            <InputItem
              clear
              accessible={true}
              labelNumber={2}
              value={choiceText}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="add a new choice..."
              placeholderTextColor="grey"
              onSubmitEditing={() => onChoiceHandler(false)}
              onChange={(value) => {
                setChoiceText(value);
              }}>
              <TouchableOpacity
                onPress={() => onChoiceHandler(false)}
                style={styles.choiceInputTouchable(!!choiceText)}
                disabled={!choiceText}>
                <CustomIconsComponent
                  type={'AntDesign'}
                  color={Colors.secondary}
                  name={'pluscircle'}
                  size={20}
                />
              </TouchableOpacity>
            </InputItem>
          </View>
        </View>

        <View style={styles.tagMainContainer}>
          <View style={styles.tagContainer}>
            <TextInput
              placeholder="Input tags..."
              placeholderTextColor={Colors.placeholder}
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
      </View>

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
              style={styles.bottomActionBtnCreateTouchable(
                questionText,
                choiceTextArray.length,
              )}
              disabled={
                questionText !== '' && choiceTextArray.length >= 2
                  ? false
                  : true
              }>
              <Text style={styles.bottomActionBtnCreateText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    borderRadius: 5,
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
    borderRadius: 5,
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
  bottomActionBtnCreateTouchable: (questionText, choiceTextArrayLength) => ({
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
    opacity: questionText !== '' && choiceTextArrayLength >= 2 ? 1 : 0.5,
  }),
  bottomActionBtnCreateText: {
    color: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
