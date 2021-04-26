import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import {TextareaItem, InputItem} from '@ant-design/react-native';

export default function CustomFormInput(props) {
  const {
    textArea,
    value,
    onChange,
    onSubmitEditing,
    placeholder,
    renderInnerView,
    numOfRows,
    style,
    maxLength,
    containerStyle,
  } = props;

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {textArea ? (
        <TextareaItem
          rows={numOfRows}
          value={value}
          onChangeText={(text) => {
            onChange(text);
          }}
        />
      ) : (
        <InputItem
          clear
          accessible={true}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          labelNumber={2}
          value={value}
          autoCapitalize="none"
          autoCorrect={false}
          style={style}
          maxLength={maxLength}
          onSubmitEditing={() => {
            onSubmitEditing ? onSubmitEditing() : null;
          }}
          blurOnSubmit={false}
          onChange={(value) => onChange(value)}>
          {renderInnerView ? renderInnerView() : null}
        </InputItem>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.primaryText,
    marginTop: 8,
    borderRadius: 5,
  },
});
