import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from './CustomIcons';
import * as _ from 'lodash';

export default function InsertLinkModal(props) {
  const [urlText, setUrlText] = useState('');
  const [linkText, setLinkText] = useState('');
  const [displayError, setDisplayError] = useState(false);

  const onPressInsert = () => {
    setDisplayError(false);
    let reg = new RegExp(/(([a-zA-z0-9]{2,}).([a-zA-z0-9]{2,}))/g);
    if (reg.test(urlText)) {
      const url = '[url=';
      let formattedLink = '';
      let formattedLinkText = '';
      if (urlText.includes('http://') || urlText.includes('https://')) {
        formattedLink = `${urlText}`;
      } else {
        formattedLink = `http://${urlText}`;
      }
      if (linkText) {
        formattedLinkText = `${linkText}[/url]`;
      } else {
        formattedLinkText = `${formattedLink}[/url]`;
      }
      const finalText = _.cloneDeep(
        url + formattedLink + ']' + formattedLinkText,
      );
      props.onInsertLink(finalText);
      props.onRequestClose();
      setUrlText('');
      setLinkText('');
    } else {
      setDisplayError(true);
    }
  };

  return (
    <Modal
      visible={props.visible}
      onRequestClose={() => {
        props.onRequestClose();
      }}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.avoidingView}>
            <View style={styles.mainContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Insert Link</Text>
                <TouchableOpacity
                  onPress={() => props.onRequestClose()}
                  style={styles.headerLeftIcon}>
                  <CustomIconsComponent
                    color={Colors.primary}
                    name={'close'}
                    type={'FontAwesome'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputHeadingText}>URL</Text>
                <TextInput
                  placeholderTextColor={Colors.greyText}
                  style={[styles.inputStyle, styles.bottomSpacing]}
                  placeholder="www.exmple.com"
                  keyboardType={'url'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  value={urlText}
                  onChangeText={(text) => {
                    setUrlText(text);
                  }}
                />
                <Text style={styles.inputHeadingText}>Link Text</Text>
                <TextInput
                  placeholderTextColor={Colors.greyText}
                  style={styles.inputStyle}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  placeholder="Example Website"
                  value={linkText}
                  onChangeText={(text) => {
                    setLinkText(text);
                  }}
                  onSubmitEditing={() => {
                    onPressInsert();
                  }}
                />
                {displayError ? (
                  <Text style={styles.errorText}>Please add a valid link</Text>
                ) : null}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButtonStyle}
                  onPress={() => {
                    props.onRequestClose();
                  }}>
                  <Text style={styles.buttonText('cancel')}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.insertButtonStyle}
                  onPress={() => {
                    onPressInsert();
                  }}>
                  <Text style={styles.buttonText('insert')}>Insert</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  avoidingView: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.bgColor,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 4,
  },
  headerLeftIcon: {
    padding: 5,
    borderRadius: 5,
  },
  inputContainer: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.greyBorder,
    flex: 1,
    marginTop: 16,
    // justifyContent: 'center',
  },
  inputStyle: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: Colors.bgColor,
    padding: 10,
  },
  bottomSpacing: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  cancelButtonStyle: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    backgroundColor: Colors.bgColor,
    borderRadius: 3,
  },
  insertButtonStyle: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    backgroundColor: Colors.usersBg,
    borderRadius: 3,
  },
  buttonText: (buttonType) => ({
    fontSize: 15,
    color: buttonType === 'insert' ? Colors.white : Colors.primaryText,
    fontWeight: 'bold',
  }),
  inputHeadingText: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingBottom: 5,
    color: Colors.primaryText,
  },
  titleText: {
    color: Colors.primary,
    fontSize: 17,
    flexGrow: 1,
  },
  errorText: {
    marginTop: 5,
    color: Colors.red,
  },
});
