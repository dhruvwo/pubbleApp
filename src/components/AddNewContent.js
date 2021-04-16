import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {TextareaItem, InputItem} from '@ant-design/react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import * as _ from 'lodash';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import GlobalStyles from '../constants/GlobalStyles';

export default function AddNewContent(props) {
  const {
    toggleAddContentModal,
    onRequestClose,
    inputText,
    setInputText,
  } = props;
  const [choiceText, setChoiceText] = useState('');
  const [choiceTextArray, setChoiceTextArray] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagsData, setTagsData] = useState([]);

  function onChoiceHandler() {
    if (choiceText.length <= 60) {
      setChoiceText('');
      setChoiceTextArray([...choiceTextArray, choiceText]);
    } else {
      Alert.alert('Only 60 characters allowed in choice');
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

  return (
    <Modal
      visible={toggleAddContentModal}
      onRequestClose={() => {
        onRequestClose();
      }}>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            backgroundColor: Colors.secondary,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => onRequestClose()}>
            <CustomIconsComponent
              type={'FontAwesome'}
              name={'close'}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Question
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.primaryText,
                marginTop: 8,
              }}>
              <TextareaItem
                rows={4}
                placeholder="please add text for question"
                count={160}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Choices{' '}
              {choiceTextArray.length === 1 ? (
                <Text
                  style={{
                    color: Colors.unapproved,
                    marginLeft: 5,
                  }}>
                  (please add atleast two choices)
                </Text>
              ) : null}
            </Text>

            {choiceTextArray?.map((choice, index) => (
              <View
                key={index}
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                  flexShrink: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <CustomIconsComponent
                    type={'AntDesign'}
                    color={Colors.secondary}
                    name={'checkcircleo'}
                    size={20}
                  />
                  <Text
                    style={{
                      marginLeft: 8,
                      flexGrow: 1,
                      flexShrink: 1,
                      flexWrap: 'wrap',
                      fontSize: 15,
                    }}>
                    {choice.substring(1, 40)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
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

                  <TouchableOpacity>
                    <CustomIconsComponent
                      type={'MaterialCommunityIcons'}
                      color={Colors.yellow}
                      name={'pencil-circle'}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 15,
              }}>
              <Text
                style={{
                  color:
                    choiceText.length > 60 ? Colors.unapproved : Colors.black,
                }}>
                {choiceText.length || 0} / 60
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.primaryText,
                marginTop: 8,
              }}>
              <InputItem
                clear
                accessible={true}
                labelNumber={2}
                value={choiceText}
                autoCapitalize="none"
                autoCorrect={false}
                type="email-address"
                placeholder="add a new choice..."
                placeholderTextColor="grey"
                onChange={(value) => {
                  setChoiceText(value);
                }}>
                <TouchableOpacity onPress={onChoiceHandler}>
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

          <View
            style={{
              marginTop: 15,
            }}>
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
              {tagsData.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => tagDeleteHandler(tag)}
                  style={styles.tagListTouchable}>
                  <Text style={styles.tagListText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.primaryInactive,
            paddingHorizontal: 20,
            paddingVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: Colors.unapproved,
              backgroundColor: Colors.white,
            }}>
            <Text
              style={{
                color: Colors.unapproved,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}>
              Unapprove Poll
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: Colors.secondary,
              backgroundColor: Colors.secondary,
            }}>
            <Text
              style={{
                color: Colors.white,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
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
});
