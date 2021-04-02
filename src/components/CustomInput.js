import React from 'react';
import {Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';

export default function CustomInput(props) {
  const {iconName, iconType, showButton} = props;

  return (
    <TouchableOpacity style={styles.inputContainer}>
      <CustomIconsComponent
        color={Colors.greyText}
        name={iconName}
        type={iconType}
        size={22}
        style={styles.iconStyle}
      />
      <TextInput style={styles.inputStyle} />
      {showButton ? (
        <TouchableOpacity style={styles.buttonStyle(Colors.greyBorder)}>
          <Text style={styles.buttonText(Colors.white)}>Edit</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
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
    alignSelf: 'flex-start',
    marginTop: 5,
  }),
  buttonText: (textColor) => ({
    color: textColor,
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: 'bold',
  }),
  iconStyle: {
    paddingTop: 5,
  },
});
