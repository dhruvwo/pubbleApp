import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import Colors from '../constants/Colors';

export default function ActionSheetOptions(props) {
  const {
    options,
    selectedOption,
    displayField,
    valueField,
    onSelectOption,
    placeholder,
    isShowValueField,
  } = props;
  let selectedValue = placeholder || '';

  const showOptions = [];
  let selectedIndex = 0;
  const cancelButtonIndex = options.length;
  options.forEach((o, i) => {
    if (selectedOption === o[valueField]) {
      selectedIndex = i;

      if (isShowValueField) {
        selectedValue = '+' + o[valueField];
      } else {
        selectedValue = o[displayField];
      }
    }
    showOptions.push(o[displayField]);
  });
  showOptions.push('Cancel');

  function onOptionPress() {
    ActionSheet.showActionSheetWithOptions(
      {
        options: showOptions,
        cancelButtonIndex,
        destructiveButtonIndex: selectedIndex,
        tintColor: 'blue',
      },
      (buttonIndex) => {
        if (buttonIndex !== cancelButtonIndex) {
          onSelectOption(options[buttonIndex][valueField]);
        }
      },
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onOptionPress()}
      style={styles.container(isShowValueField)}>
      <Text style={styles.text}>{selectedValue}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: (isShowValueField) => ({
    padding: !isShowValueField ? 8 : null,
    backgroundColor: !isShowValueField ? Colors.primaryInactive : null,
  }),
  text: {
    color: Colors.primaryActive,
  },
});
