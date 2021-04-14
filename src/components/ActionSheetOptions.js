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
  } = props;
  let selectedValue = placeholder || '';

  const showOptions = [];
  let selectedIndex = 0;
  const cancelButtonIndex = options.length;
  options.forEach((o, i) => {
    if (selectedOption === o[valueField]) {
      selectedIndex = i;
      selectedValue = o[displayField];
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
    <TouchableOpacity onPress={() => onOptionPress()} style={styles.container}>
      <Text style={styles.text}>{selectedValue}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: Colors.primaryInactive,
  },
  text: {
    color: Colors.primaryActive,
  },
});
