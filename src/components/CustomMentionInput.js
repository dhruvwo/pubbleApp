import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {useSelector} from 'react-redux';
import * as _ from 'lodash';
import InsertLinkModal from '../components/InsertLinkModal';
import Modal from 'react-native-modal';
import {Popover} from '@ant-design/react-native';
import GlobalStyles from '../constants/GlobalStyles';
import {MentionInput} from 'react-native-controlled-mentions';
import UserGroupImage from '../components/UserGroupImage';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import ToastService from '../services/utilities/ToastService';
import {uploadFile} from '../services/utilities/CustomFileTransfar';
import ProgressCircle from 'react-native-progress-circle';

const {width} = Dimensions.get('window');

export default function CustomMentionInput(props) {
  const {
    messageType,
    value,
    onChange,
    placeholder,
    onSendPress,
    hideSend,
    hidePush,
    hideAttach,
    hideCanned,
    showTranslate,
    translate,
    enableTranslation,
    replying,
  } = props;
  const [activeCannedIndex, setActiveCannedIndex] = useState(0);
  const [isVisibleFileUploadModal, setIsVisibleFileUploadModal] = useState(
    false,
  );
  const [inputText, setInputText] = useState(value);
  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);
  const [isVisibleInsertLink, setIsVisibleInsertLink] = useState(false);
  const [isTrashIconVisible, setIsTrashIconVisible] = useState(true);
  const [fileUploadPercentage, setFileUploadPercentage] = useState({});
  const [isFileUploading, setIsFileUploading] = useState(false);
  const reduxState = useSelector(({auth, collections, events}) => ({
    cannedMessages: auth.community.cannedMessages,
    user: auth.user,
    usersCollection: collections?.users,
    currentCard: events.currentCard,
    community: auth.community,
  }));
  const suggestions = [];
  const validTypes = [
    'png',
    'gif',
    'jpg',
    'jpeg',
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'mp4',
    'mpeg',
    'avi',
    'wmv',
    'mov',
    'm4v',
    'txt',
  ];
  useEffect(() => {
    if (onChange) {
      onChange(inputText);
    }
  }, [inputText]);

  useEffect(() => {
    setInputText(value);
  }, [value]);

  let index = 0;
  for (let key in reduxState.usersCollection) {
    if (index === 5) {
      break;
    }
    suggestions.push(reduxState.usersCollection[key]);
    index++;
  }
  function onContectCardPress() {
    onSendPress('//contact');
  }

  async function checkPermission() {
    if (Platform.OS === 'ios') {
      setIsVisibleFileUploadModal(true);
    } else {
      const grantPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //   PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Camera Permission',
          message:
            'Pubble needs access to your camera ' +
            ' upload an image or document.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (grantPermission === PermissionsAndroid.RESULTS.GRANTED) {
        setIsVisibleFileUploadModal(true);
      } else {
        console.warn('Camera permission denied');
      }
    }
  }

  async function getPermission(type) {
    var component = require('react-native-permissions');
    const {request, RESULTS, PERMISSIONS} = component;
    const result = await request(
      type === 'image'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.IOS.READ_EXTERNAL_STORAGE,
    );
    switch (result) {
      case RESULTS.UNAVAILABLE:
        ToastService({message: 'Please provide permission'});
        return false;
      case RESULTS.DENIED:
        ToastService({message: 'Permission denied'});
        return false;
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        ToastService({message: 'Permission blocked'});
        return false;
    }
  }

  async function onPressImageUpload() {
    const galleryPermission = true;
    await getPermission('image?');
    if (galleryPermission) {
      let options = {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 550,
        quality: 1,
      };
      launchImageLibrary(options, (response) => {
        console.log({response});

        if (response.didCancel) {
          console.log('User cancelled photo picker');
          Alert.alert('You did not select any image');
          setIsVisibleFileUploadModal(false);
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setIsVisibleFileUploadModal(false);
          if (response.fileSize < 10000001) {
            if (validTypes.includes(response.fileName.split('.').pop())) {
              setSelectedUploadFiles([
                ...selectedUploadFiles,
                {
                  ...response,
                  rndid: `${reduxState.user.accountId}_${new Date().getTime()}`,
                },
              ]);
            } else {
              ToastService({
                message: 'invalid selected file type.',
                isLong: true,
              });
            }
          } else {
            ToastService({
              message: 'file size is too large (max size is 10Mb)',
              isLong: true,
            });
          }
        }
      });
    }
  }

  function onPressDeletedFile(item) {
    Alert.alert('Are you sure?', 'You want to delete this file?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const remainingFiles = selectedUploadFiles.filter(
            (data) => data.uri !== item.uri,
          );
          setSelectedUploadFiles(remainingFiles);
        },
      },
    ]);
  }

  function renderSelectedFiles() {
    return (
      <View style={styles.selectedFileMainContainer}>
        {selectedUploadFiles.map((item, index) => {
          const fileType = item.type.toLowerCase().includes('image')
            ? 'image'
            : item.type.toLowerCase().includes('pdf')
            ? 'pdf'
            : item.name.split('.').pop();
          const percentage = fileUploadPercentage[`${item.rndid}`];
          return (
            <View style={styles.selectedFileContainer} key={index}>
              {percentage && percentage !== 100 ? (
                <View style={[fileType === 'image' && styles.centerStyle]}>
                  <ProgressCircle
                    percent={percentage}
                    radius={17.5}
                    borderWidth={5}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff">
                    <Text
                      style={{fontSize: 10, fontWeight: 'bold'}}
                      numberOfLines={1}>
                      {percentage}%
                    </Text>
                  </ProgressCircle>
                </View>
              ) : null}
              {fileType === 'image' ? (
                <FastImage
                  style={{height: width * 0.18, width: width * 0.18}}
                  source={{
                    uri: item.uri,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <Text style={styles.fileTypeText}>{fileType}</Text>
              )}
              {isTrashIconVisible ? (
                <TouchableOpacity
                  style={styles.trashIconContainer}
                  onPress={() => onPressDeletedFile(item)}>
                  <CustomIconsComponent
                    type={'MaterialCommunityIcons'}
                    name={'trash-can'}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }

  function displayFileUploadPopover() {
    return (
      <Modal
        isVisible={isVisibleFileUploadModal}
        onRequestClose={() => {
          setIsVisibleFileUploadModal(false);
        }}
        onBackdropPress={() => {
          setIsVisibleFileUploadModal(false);
        }}>
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={styles.uploadInnerContainer}
            onPress={() => onPressImageUpload()}>
            <CustomIconsComponent
              type={'MaterialIcons'}
              name={'image'}
              style={styles.uploadIcon}
              size={50}
            />
            <Text>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              // const galleryPermission = await getPermission('doc');
              // if (galleryPermission) {
              onAttachPress();
              // }
            }}
            style={styles.uploadInnerContainer}>
            <CustomIconsComponent
              type={'Ionicons'}
              name={'document'}
              style={styles.uploadIcon}
              size={50}
            />
            <Text>Upload Document</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  async function onAttachPress() {
    // setIsVisibleFileUploadModal(false);
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.video,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.plainText,
        ],
      });
      for (const res of results) {
        setIsVisibleFileUploadModal(false);
        if (res.size < 10000001) {
          if (validTypes.includes(res.name.split('.').pop())) {
            setSelectedUploadFiles([
              ...selectedUploadFiles,
              {
                ...res,
                rndid: `${reduxState.user.accountId}_${new Date().getTime()}`,
              },
            ]);
          } else {
            ToastService({
              message: 'invalid selected file type.',
              isLong: true,
            });
          }
        } else {
          ToastService({
            message: 'file size is too large (max size is 10Mb)',
            isLong: true,
          });
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        console.log('error', err);
      }
    }
  }

  function onLinkPress() {
    setIsVisibleInsertLink(true);
  }

  async function uploadFiles() {
    setIsFileUploading(true);
    setIsTrashIconVisible(false);
    const uploadedFiles = await Promise.all(
      selectedUploadFiles.map(async (image) => {
        const params = {
          file: {
            name: image.fileName ? image.fileName : image.name,
            uri:
              Platform.OS === 'android'
                ? image.uri
                : image.uri.replace('file://', ''),
            type: image.type,
          },
          custom: JSON.stringify({
            conversationId: reduxState.currentCard.conversationId,
            appId: reduxState.currentCard.appId,
            communityName: reduxState.community.community.shortName,
            accountId: reduxState.user.accountId,
          }),
          rndid: image.rndid,
        };
        const uploadRes = await uploadFile(params, (percentage, rndid) => {
          fileUploadPercentage[`${rndid}`] = percentage;
          setFileUploadPercentage(_.cloneDeep(fileUploadPercentage));
        });
        setFileUploadPercentage({});
        setIsFileUploading(false);
        return uploadRes;
      }),
    );
    onSendPress('', uploadedFiles.join());
    setSelectedUploadFiles([]);
  }

  function onAccountNamePress(text, keyword) {
    let newText = text.split(' ')[0].toLowerCase() + ' ';
    if (inputText) {
      if (keyword) {
        newText = inputText.replace(keyword, newText);
      } else {
        newText = `${inputText}${newText}`;
      }
    }
    setInputText(newText);
  }

  function onCannedMessagePress(text, keyword) {
    let newText = text;
    if (inputText) {
      const trimLength = keyword.length - 1 || -1;
      newText = `${inputText.slice(0, trimLength)}${newText}`;
    }
    setInputText(newText);
  }

  function onCannedIconPress() {
    if (inputText && inputText.charAt(inputText.length - 1) === '\\') {
      setInputText(inputText.slice(0, -1));
    } else {
      setInputText(`\\${inputText}`);
    }
  }

  const renderSuggestions = ({keyword}) => {
    if (keyword == null || keyword.includes(' ')) {
      return null;
    }
    const newSuggestions = [];
    _.forIn(suggestions, (item) => {
      if (item?.alias?.toLowerCase().includes(keyword.toLowerCase())) {
        newSuggestions.push(item);
      }
    });
    if (newSuggestions.length === 0) {
      return null;
    }
    return (
      <View style={styles.suggiustensContainer}>
        <View style={styles.suggiustenHeaderContainer}>
          <Text>People</Text>
        </View>
        <FlatList
          data={newSuggestions}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({item}) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                onAccountNamePress(item.alias, keyword, true);
              }}
              style={styles.suggustedUsers}>
              <UserGroupImage
                item={item}
                isAssigneesList={true}
                imageSize={30}
              />
              <Text style={styles.suggustedUserName}>{item.alias}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderCannedMessages = ({keyword}) => {
    if (keyword == null) {
      return null;
    }
    const newSuggestions = [];
    _.forIn(reduxState.cannedMessages, (item, key) => {
      if (key.includes(keyword)) {
        newSuggestions.push({
          name: `\\${key}`,
          data: item,
        });
      }
    });
    if (newSuggestions.length === 0) {
      return null;
    }
    return (
      <View style={styles.cannedContainer}>
        <View style={styles.cannedCommandsContainer}>
          <FlatList
            data={newSuggestions}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={(item) => item.name}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  setActiveCannedIndex(index);
                }}
                style={[
                  styles.cannedCommandContainer(index === activeCannedIndex),
                ]}>
                <Text
                  style={styles.cannedMessageTitle(
                    index === activeCannedIndex,
                  )}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {newSuggestions && newSuggestions[activeCannedIndex]?.data?.length && (
          <FlatList
            data={newSuggestions[activeCannedIndex].data}
            style={styles.cannedMessagesFlatlist}
            contentContainerStyle={styles.cannedMessagesContainer}
            keyboardShouldPersistTaps={'handled'}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  onCannedMessagePress(item.text, keyword);
                }}
                style={styles.cannedMessageContainer}>
                <Text style={styles.cannedMessage}>{item.text}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  const partTypes = [
    {
      trigger: '@',
      renderSuggestions,
      textStyle: {fontWeight: '600', color: 'blue'},
    },
  ];

  if (!hideCanned) {
    partTypes.push({
      trigger: '\\',
      renderSuggestions: renderCannedMessages,
      textStyle: {fontWeight: '600', color: 'blue'},
    });
  }

  return (
    <View>
      {displayFileUploadPopover()}
      {selectedUploadFiles.length ? renderSelectedFiles() : null}
      {!!replying ? (
        <Text style={styles.selectedFileMainContainer}>
          {replying} is typing...
        </Text>
      ) : null}
      <Text style={styles.messageLength}>{2500 - (inputText.length || 0)}</Text>
      <MentionInput
        placeholder={placeholder || 'type here'}
        multiline={true}
        autoCapitalize={'none'}
        autoCorrect={false}
        value={inputText}
        onChange={(value) => {
          setInputText(value);
        }}
        style={styles.answerInput}
        partTypes={partTypes}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.bottomLeftContainer}>
          {hidePush !== true && (
            <Popover
              duration={0}
              useNativeDriver={true}
              placement={'top'}
              overlay={
                <View style={styles.pushFormContainer}>
                  <View style={styles.pushFormHeaderContainer}>
                    <Text style={styles.pushFormHeader}>
                      Push form in conversation
                    </Text>
                  </View>
                  <View style={styles.pushFormListContainer}>
                    <TouchableOpacity
                      style={styles.pushFormItem}
                      onPress={() => onContectCardPress()}>
                      <Text style={styles.pushFormItemText}>
                        Visitor contact card
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }>
              <View style={styles.bottomIconContainer}>
                <CustomIconsComponent
                  type={'AntDesign'}
                  name={'form'}
                  style={styles.bottomIcon}
                  size={23}
                />
              </View>
            </Popover>
          )}
          {hideCanned !== true && (
            <TouchableOpacity
              style={styles.bottomIconContainer}
              onPress={() => onCannedIconPress()}>
              <CustomIconsComponent
                name={'chatbubble-ellipses-outline'}
                type={'Ionicons'}
                style={styles.bottomIcon}
                size={23}
              />
            </TouchableOpacity>
          )}
          {hideAttach !== true && (
            <TouchableOpacity
              style={styles.bottomIconContainer}
              onPress={() => checkPermission()}>
              <CustomIconsComponent
                name={'document-attach-outline'}
                type={'Ionicons'}
                style={styles.bottomIcon}
                size={23}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.bottomIconContainer}
            onPress={() => onLinkPress()}>
            <CustomIconsComponent
              name={'link'}
              type={'Ionicons'}
              style={styles.bottomIcon}
              size={23}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomRightContainer}>
          {showTranslate && (
            <TouchableOpacity
              style={[styles.bottomIconContainer, styles.translateContainer]}
              onPress={enableTranslation}>
              <CustomIconsComponent
                name={translate?.enabled ? 'translate' : 'translate-off'}
                type={'MaterialCommunityIcons'}
                style={styles.bottomIcon}
                color={translate?.enabled ? Colors.usersBg : Colors.greyText}
                size={23}
              />
            </TouchableOpacity>
          )}
          {hideSend !== true && (
            <TouchableOpacity
              disabled={
                (!inputText && selectedUploadFiles.length < 1) ||
                isFileUploading
              }
              style={[
                styles.bottomIconContainer,
                styles.sendButtonContainer(
                  !inputText && selectedUploadFiles.length < 1,
                ),
              ]}
              onPress={async () => {
                if (selectedUploadFiles.length) {
                  await uploadFiles();
                } else {
                  onSendPress();
                }
              }}>
              {isFileUploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <CustomIconsComponent
                  type={'MaterialIcons'}
                  color={'white'}
                  name={'send'}
                  style={[styles.bottomIcon]}
                  size={23}
                />
              )}
            </TouchableOpacity>
          )}
          {messageType && (
            <Popover
              duration={0}
              useNativeDriver={true}
              placement={'top'}
              overlay={
                <View
                  style={[
                    styles.popoverOptions,
                    styles.optionsPopoverContainer,
                  ]}>
                  <TouchableOpacity
                    style={styles.optionContainer}
                    onPress={() => {
                      setMessageType('saveAsDraft');
                    }}>
                    <View>
                      <Text
                        style={styles.optionTitle(
                          messageType === 'saveAsDraft',
                        )}>
                        Save as Draft
                      </Text>
                      <Text
                        style={styles.optionDescription(
                          messageType === 'saveAsDraft',
                        )}>
                        The reply will be posted when question is approved
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={[GlobalStyles.devider, styles.optionDevider]} />
                  <TouchableOpacity
                    style={styles.optionContainer}
                    onPress={() => {
                      setMessageType('sendAndApproved');
                    }}>
                    <View>
                      <Text
                        style={styles.optionTitle(
                          messageType === 'sendAndApproved',
                        )}>
                        Send &amp; Approve
                      </Text>
                      <Text
                        style={styles.optionDescription(
                          messageType === 'sendAndApproved',
                        )}>
                        The reply and the question will both be approved and
                        published
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }>
              <View style={[styles.bottomIconContainer, styles.sendOptions]}>
                <CustomIconsComponent
                  type={'Entypo'}
                  color={'white'}
                  name={'dots-three-vertical'}
                  style={[styles.dotsIcon]}
                  size={18}
                />
              </View>
            </Popover>
          )}
        </View>
      </View>
      <InsertLinkModal
        visible={isVisibleInsertLink}
        onRequestClose={() => {
          setIsVisibleInsertLink(false);
        }}
        onInsertLink={(text) => {
          setInputText(inputText ? `${inputText}\n${text}` : text);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centerStyle: {
    position: 'absolute',
    zIndex: 1,
  },
  selectedFileMainContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedFileContainer: {
    height: width * 0.2,
    width: width * 0.2,
    backgroundColor: 'lightgrey',
    borderWidth: 5,
    borderColor: Colors.greyText,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 10,
  },
  trashIconContainer: {
    backgroundColor: 'black',
    borderRadius: 20,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -10,
    top: -10,
  },
  fileTypeText: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.greyText,
  },
  leftContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 4,
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  uploadInnerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftIcon: {
    padding: 5,
    borderRadius: 5,
  },
  starSpaceContainer: {
    backgroundColor: Colors.primaryText,
    width: 32,
    height: 32,
    backgroundColor: Colors.tertiary,
    padding: 5,
    borderRadius: 5,
  },
  uploadIcon: {
    marginBottom: 10,
  },
  topLeftContainer: {
    flexDirection: 'row',
  },
  countContainer: {
    backgroundColor: Colors.primaryText,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  titleContainer: {
    marginLeft: 10,
  },
  authorName: {
    color: Colors.primary,
  },
  chatTitleText: {
    marginLeft: 10,
    color: Colors.greyText,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  descText: {
    fontSize: 11,
    color: Colors.red,
  },
  chatContainer: {
    flex: 1,
  },
  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chatCardContainer: (isMyMessage) => {
    return {
      flexDirection: isMyMessage ? 'row-reverse' : 'row',
      marginHorizontal: 20,
      marginVertical: 3,
    };
  },
  chatDescContainer: (isMyMessage) => {
    return {
      flexShrink: 1,
      marginLeft: isMyMessage ? 0 : 10,
      marginRight: isMyMessage ? 10 : 0,
    };
  },
  imageContainer: {
    height: 40,
    width: 40,
  },
  userImageContainer: {
    marginTop: 20,
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  userNameBg: {
    backgroundColor: Colors.usersBg,
    justifyContent: 'center',
  },
  userName: {
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  chatDesc: (isMyMessage) => {
    return {
      flexDirection: isMyMessage ? 'row-reverse' : 'row',
      marginBottom: 2,
      marginTop: 10,
    };
  },
  chatDescText: (isMyMessage) => {
    return {
      marginRight: isMyMessage ? 0 : 10,
      marginLeft: isMyMessage ? 10 : 0,
      color: Colors.primary,
      fontSize: 12,
    };
  },
  dateText: {
    color: Colors.primaryText,
    fontSize: 12,
  },
  messageLength: {
    marginHorizontal: 20,
    fontSize: 12,
    textAlign: 'right',
    color: Colors.primaryText,
    marginVertical: 3,
  },
  answerInput: {
    backgroundColor: Colors.bgColor,
    borderColor: Colors.greyBorder,
    borderWidth: 1,
    marginHorizontal: 20,
    borderRadius: 5,
    padding: 12,
    minHeight: 70,
    maxHeight: 200,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  bottomLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pushFormContainer: {
    borderRadius: 5,
    borderColor: Colors.greyBorder,
    borderWidth: 0.5,
    overflow: 'hidden',
    minWidth: 280,
  },
  pushFormHeaderContainer: {
    padding: 12,
    borderBottomColor: Colors.greyBorder,
    borderBottomWidth: 0.5,
    backgroundColor: Colors.primaryInactive,
  },
  pushFormHeader: {
    color: Colors.primaryInactiveText,
  },
  pushFormListContainer: {},
  pushFormItem: {
    padding: 12,
  },
  pushFormItemText: {
    color: Colors.primary,
  },
  bottomRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomIconContainer: {
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  translateContainer: {
    marginRight: 5,
  },
  sendOptions: {
    backgroundColor: Colors.usersBg,
    marginRight: 10,
    borderLeftWidth: 0.5,
    borderColor: Colors.greyBorder,
    paddingHorizontal: 4,
    paddingVertical: 7,
  },
  sendButtonContainer: (isDisabled) => {
    return {
      paddingHorizontal: 12,
      backgroundColor: Colors.usersBg,
      opacity: isDisabled ? 0.5 : 1,
      height: 35,
      width: 50,
    };
  },
  bottomIcon: {},
  popoverOptions: {
    maxWidth: GlobalStyles.windowWidth * 0.8,
  },
  optionsPopoverContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  optionContainer: {
    padding: 12,
    flexShrink: 1,
    flexDirection: 'row',
  },
  optionTitle: (isActive) => {
    return {
      fontSize: 16,
      marginBottom: 5,
      color: Colors.primary,
      fontWeight: isActive ? 'bold' : '500',
      opacity: isActive ? 1 : 0.6,
    };
  },
  optionDescription: (isActive) => {
    return {
      fontSize: 12,
      color: Colors.primary,
      opacity: isActive ? 1 : 0.6,
    };
  },
  optionDevider: {
    borderRightColor: Colors.primary,
    marginVertical: 12,
  },
  cannedContainer: {
    marginHorizontal: 20,
    maxHeight: 300,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.primary,
    marginBottom: 10,
    flexDirection: 'row',
  },
  suggiustensContainer: {
    marginHorizontal: 20,
    maxHeight: 300,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.primary,
    marginBottom: 10,
    overflow: 'hidden',
  },
  suggiustenHeaderContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.bgColor,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.primary,
  },
  cannedCommandsContainer: {
    padding: 8,
    width: 95,
    borderRightColor: Colors.primary,
    borderRightWidth: 0.5,
  },
  cannedCommandContainer: (isActive) => {
    return {
      paddingLeft: 12,
      backgroundColor: isActive ? Colors.primaryActive : 'transparent',
      borderRadius: 5,
      marginVertical: 5,
      padding: 5,
    };
  },
  cannedMessagesFlatlist: {
    maxHeight: 300,
    flexGrow: 1,
    flexShrink: 1,
  },
  cannedMessagesContainer: {
    paddingVertical: 7,
  },
  cannedMessageTitle: (isActive) => {
    return {
      fontSize: 16,
      fontWeight: '600',
      color: isActive ? Colors.white : Colors.black,
    };
  },
  cannedMessageContainer: {
    marginVertical: 5,
    marginHorizontal: 12,
  },
  suggustedUsers: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
