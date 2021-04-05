import React from 'react';
import {Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';

export default function CustomInput(props) {
  const {iconName, iconType, showEdit, placeholder, value, isEditing} = props;
  const [inputText, setInputText] = useState(value);

  return (
    <View style={styles.inputContainer}>
      <CustomIconsComponent
        color={Colors.greyText}
        name={iconName}
        type={iconType}
        size={22}
        style={[styles.iconStyle, styles.leftIconStyle]}
      />
      {isEditing ? (
        <TextInput
          style={styles.inputStyle}
          placeholder={placeholder || ''}
          keyboardType={'url'}
          autoCapitalize={'none'}
          autoCorrect={false}
          value={inputText}
          multiline={true}
          onSubmitEditing={() => onEditClick(inputText)}
          onChangeText={(text) => {
            setInputText(text);
          }}
        />
      ) : (
        <View></View>
      )}
      {showEdit ? (
        <TouchableOpacity
          style={styles.buttonStyle(Colors.greyBorder)}
          onPress={() => onEditClick(inputText)}>
          <CustomIconsComponent
            color={Colors.primaryActive}
            name={'edit'}
            type={'Entypo'}
            size={20}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
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
    marginBottom: 10,
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
