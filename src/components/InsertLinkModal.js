import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import Modal from 'react-native-modal';

const {width, height} = Dimensions.get('window');

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
      const finalText = url + formattedLink + ']' + formattedLinkText;
      props.onInsertLink(finalText);
      props.onRequestClose();
      setUrlText('');
      setLinkText('');
    } else {
      setDisplayError(true);
    }
  };

  return (
    <View>
      <Modal
        visible={props.visible}
        transparent={true}
        style={styles.modalStyle}
        onBackdropPress={() => props.onRequestClose()}
        onRequestClose={() => {
          props.onRequestClose();
        }}>
        <SafeAreaView style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>Insert Link</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeadingText}>URL</Text>
            <TextInput
              placeholderTextColor={Colors.greyText}
              style={[styles.inputStyle, styles.bottomSpacing]}
              placeholder="www.exmple.com"
              value={urlText}
              onChangeText={(text) => {
                setUrlText(text);
              }}
            />
            <Text style={styles.inputHeadingText}>Link Text</Text>
            <TextInput
              placeholderTextColor={Colors.greyText}
              style={styles.inputStyle}
              placeholder="Example Website"
              value={linkText}
              onChangeText={(text) => {
                setLinkText(text);
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
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 2,
    borderColor: Colors.bgColor,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: Colors.bgColor,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.greyBorder,
  },
  inputStyle: {
    borderWidth: 2,
    borderColor: Colors.bgColor,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  bottomSpacing: {
    marginBottom: 20,
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
    backgroundColor: Colors.secondary,
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
    color: Colors.primaryText,
    fontSize: 17,
  },
  errorText: {
    marginTop: 5,
  },
});
