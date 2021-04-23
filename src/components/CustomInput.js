import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';

export default function CustomInput(props) {
  const {
    iconName,
    iconType,
    showEdit,
    placeholder,
    value,
    emptyValue,
    innerRenderer,
    showSubContent,
    subContent,
    onSubmitEdit,
  } = props;

  const [inputText, setInputText] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  return (
    <View style={styles.inputContainer}>
      <CustomIconsComponent
        color={Colors.greyText}
        name={iconName}
        type={iconType}
        size={20}
        style={[styles.iconStyle, styles.leftIconStyle]}
      />
      {innerRenderer ? (
        innerRenderer
      ) : isEditing ? (
        <TextInput
          onSubmitEditing={() => {
            setIsEditing(false);
            onSubmitEdit(inputText);
          }}
          style={[styles.inputStyle, styles.inputBox]}
          placeholder={placeholder || ''}
          textAlignVertical={'center'}
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardType={props.keyboardType}
          value={inputText}
          multiline={props.multiline}
          onChangeText={(text) => {
            setInputText(text);
          }}
        />
      ) : (
        <View style={styles.inputStyle}>
          <Text>{value || emptyValue || ''}</Text>
          {showSubContent ? subContent : null}
        </View>
      )}
      {showEdit ? (
        isEditing ? (
          <TouchableOpacity
            style={styles.buttonStyle(Colors.greyBorder)}
            onPress={() => {
              setIsEditing(false);
              onSubmitEdit(inputText);
            }}>
            <CustomIconsComponent
              color={Colors.primaryActive}
              name={'checkmark-sharp'}
              size={18}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.buttonStyle(Colors.greyBorder)}
            onPress={() => {
              setIsEditing(true);
            }}>
            <CustomIconsComponent
              color={Colors.primaryActive}
              name={'edit'}
              type={'Entypo'}
              size={20}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 3,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: Colors.greyBorder,
    paddingHorizontal: 7,
    marginBottom: 8,
    alignItems: 'center',
  },
  inputStyle: {
    flexGrow: 1,
    flexShrink: 1,
    marginLeft: 10,
    paddingVertical: 3,
    justifyContent: 'center',
    borderRadius: 5,
    minHeight: 34,
  },
  inputBox: {
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: Colors.greyText,
  },
  buttonStyle: (bgColor) => ({
    backgroundColor: bgColor,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginLeft: 10,
  }),
  buttonText: (textColor) => ({
    color: textColor,
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: 'bold',
  }),
  leftIconStyle: {
    width: 28,
    textAlign: 'center',
  },
  iconStyle: {},
});
