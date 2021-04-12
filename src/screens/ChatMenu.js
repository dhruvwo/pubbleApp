import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Alert} from 'react-native';
import Colors from '../constants/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomIconsComponent from '../components/CustomIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AssignModal from '../components/AssignModal';
import {useDispatch} from 'react-redux';
import {eventsAction} from '../store/actions';
import * as _ from 'lodash';
import {Popover} from '@ant-design/react-native';
import GlobalStyles from '../constants/GlobalStyles';
import {translations} from '../constants/Default';
import VisitorComponent from '../components/VisitorComponent';
import ActivitiesComponent from '../components/ActivitiesComponent';

export default function ChatMenu(props) {
  const dispatch = useDispatch();
  const {
    data,
    selectedEvent,
    userAccount,
    communityId,
    user,
    usersCollection,
    groupsCollection,
  } = props.route.params;
  const [activeTab, setActiveTab] = useState('Visitor');
  const [loadedTabs, setLoadedTabs] = useState([activeTab]);
  const [lockUnlockButton, setLockUnlockButton] = useState(false);
  const [toggleVisibility, setToggleVisibility] = useState(false);
  const [toggleapproveString, setToggleapproveString] = useState(false);
  const [itemForAssign, setItemForAssign] = useState();
  const [translationlist, setTranslationlist] = useState();
  const [visibility, setVisibility] = useState(data.privatePost);
  const [approveString, setApproveString] = useState(data.approved);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translationSelectedOption, setTranslationSelectedOption] = useState(
    '',
  );

  const lockUnlockString = data.lockId
    ? data.lockId === user.accountId
      ? 'Unlock'
      : 'Locked'
    : 'Lock';
  const getTranslation = data.attachments.find(
    (att) => att.type === 'translate',
  );

  const rightTabs = [
    {
      title: 'Chat',
      iconType: 'Ionicons',
      iconName: 'chatbox',
    },
    {
      title: 'FAQ',
      iconType: 'FontAwesome',
      iconName: 'puzzle-piece',
    },
    {
      title: 'Activities',
      iconType: 'FontAwesome',
      iconName: 'history',
    },
    {
      title: 'Visitor',
      iconType: 'AntDesign',
      iconName: 'contacts',
    },
  ];

  useEffect(() => {
    if (activeTab && !loadedTabs.includes(activeTab)) {
      const loadedTabsClone = _.cloneDeep(loadedTabs);
      loadedTabsClone.push(activeTab);
      setLoadedTabs(loadedTabsClone);
    }
  }, [activeTab]);

  useEffect(() => {
    getStateCountryFromIP();

    let storeOption = [];
    translations.map((trans) =>
      storeOption.push({
        label: trans.name,
        value: trans.code,
      }),
    );
    setTranslationlist(storeOption);

    if (getTranslation !== undefined) {
      setSourceLanguage(getTranslation.sourceLanguage);
      setTargetLanguage(getTranslation.targetLanguage);
      setTranslationSelectedOption(getTranslation.sourceLanguage);
    }
  }, []);

  async function getStateCountryFromIP() {
    const res = await dispatch(
      eventsAction.getStateCountryFromIPFuc({
        ip: data.author.ip,
        id: data.id,
      }),
    );
  }

  function onAssignClose() {
    setItemForAssign({});
  }

  const pinToTop = async () => {
    const params = {
      postId: data.id,
      appId: selectedEvent.id,
    };
    await dispatch(eventsAction.pinToTop(params));
  };

  async function closeQuestion() {
    await dispatch(
      eventsAction.closeQuestionFunc({
        conversationId: data.conversationId,
      }),
    );
    props.navigation.navigate('Events');
  }

  const LockUnlock = async () => {
    setLockUnlockButton(true);
    const params = {
      conversationId: item.conversationId,
    };
    await dispatch(eventsAction.lockStream(params, lockUnlockString));
    setLockUnlockButton(false);
  };

  const deleteEvent = () => {
    const params = {
      postId: data.id,
    };

    Alert.alert('Are you sure?', 'You want to delete this post?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          await dispatch(eventsAction.deleteStreamData(params));
        },
      },
    ]);
  };

  async function changeVisibility() {
    setVisibility(!visibility);
    await dispatch(
      eventsAction.changeVisibility({
        postId: data.id,
      }),
    );
  }

  const approveUnapprove = async () => {
    setApproveString(!approveString);
    const apiUrlSLug = data.approved ? 'unapprove' : 'approve';
    const params = {
      postId: data.id,
    };
    await dispatch(
      eventsAction.approveDisapproveStreamData(params, apiUrlSLug),
    );
  };

  function onAssignPress() {
    setItemForAssign(data);
  }

  /* console.log(data, 'data >>>>>>>');
  console.log(selectedEvent, 'data >>>>>>>'); */
  function renderHeader() {
    return (
      <View style={styles.headerMainContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.headerLeftIcon}>
          <CustomIconsComponent
            color={'white'}
            name={'arrow-forward-ios'}
            type={'MaterialIcons'}
            size={25}
          />
        </TouchableOpacity>
        <View style={styles.headerRightMainContainer}>
          {rightTabs.map((tab) => {
            const isActive = activeTab === tab.title;
            return (
              <TouchableOpacity
                key={tab.title}
                onPress={() => setActiveTab(tab.title)}
                style={styles.rightIconContainer(isActive)}>
                <CustomIconsComponent
                  color={isActive ? Colors.white : Colors.primary}
                  name={tab.iconName}
                  type={tab.iconType}
                  size={25}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  function renderTabs() {
    return (
      <>
        {loadedTabs.includes('Visitor') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'Visitor' ? styles.activeTabData(activeTab) : {},
            ]}>
            <VisitorComponent
              data={data}
              usersCollection={usersCollection}
              groupsCollection={groupsCollection}
              translationlist={translationlist}
              getTranslation={getTranslation}
              selectedEvent={selectedEvent}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              translationSelectedOption={translationSelectedOption}
              communityId={communityId}
              onAssignPress={onAssignPress}
              setTranslationSelectedOption={setTranslationSelectedOption}
              setSourceLanguage={setSourceLanguage}
              user={user}
            />
          </View>
        )}
        {loadedTabs.includes('Activities') && (
          <View
            style={[
              styles.tabData,
              activeTab === 'Activities' ? styles.activeTabData(activeTab) : {},
            ]}>
            <ActivitiesComponent
              data={data}
              usersCollection={usersCollection}
              groupsCollection={groupsCollection}
            />
          </View>
        )}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareScrollView
        style={styles.mainContainer}
        keyboardShouldPersistTaps={'handled'}>
        {renderHeader()}
        {renderTabs()}
      </KeyboardAwareScrollView>

      {/*  */}
      {loadedTabs.includes('Visitor') && (
        <View
          style={[
            styles.tabData,
            activeTab === 'Visitor' ? styles.activeTabData(activeTab) : {},
          ]}>
          <View style={styles.actionMainContainer}>
            <Popover
              duration={0}
              useNativeDriver={true}
              overlay={
                <View style={styles.approvePopoverContainer}>
                  <TouchableOpacity style={styles.popoverItemContainer}>
                    <Text style={styles.popoverItem}>{'View transcript'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pinToTop}
                    style={[
                      styles.popoverItemContainer,
                      styles.actionPintotop,
                    ]}>
                    <Text style={styles.popoverItem}>
                      {'Pin to top of stream'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.popoverItemContainer}>
                    <Text style={styles.popoverItem}>{'Ban visitor...'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.popoverItemContainer}
                    onPress={deleteEvent}>
                    <Text style={styles.popoverItem}>{'Delete...'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={LockUnlock}
                    style={styles.popoverItemContainer}
                    disabled={
                      lockUnlockString === 'locked' || lockUnlockButton
                    }>
                    <Text style={styles.popoverItem}>{lockUnlockString}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.popoverItemContainer,
                      {flexDirection: 'row'},
                    ]}>
                    <Text style={styles.popoverItem}>Assign</Text>
                    {data.assignees?.length ? (
                      <View style={styles.assignCountContainer}>
                        <Text style={styles.assignCount}>
                          {data.assignees.length}
                        </Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.popoverItemContainer}
                    onPress={() => setToggleVisibility(!toggleVisibility)}>
                    <View style={styles.actionVisiblityContainer}>
                      <Text style={styles.actionVisiblityText}>
                        Visibility:{' '}
                        <Text style={styles.popoverItem}>
                          {!visibility ? 'Public' : 'Private'}
                        </Text>
                      </Text>

                      <CustomIconsComponent
                        color={Colors.primaryText}
                        name={'down'}
                        type="AntDesign"
                        size={18}
                      />
                    </View>
                  </TouchableOpacity>

                  {toggleVisibility ? (
                    <TouchableOpacity
                      onPress={changeVisibility}
                      style={styles.actionVisiblityOption}>
                      <Text style={styles.popoverItem}>
                        Change to {visibility ? 'Public' : 'Private'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    onPress={() => setToggleapproveString(!toggleapproveString)}
                    style={[
                      styles.popoverItemContainer,
                      styles.actionStatusTouchable,
                    ]}>
                    <Text style={styles.actionStatusText}>
                      Status:{' '}
                      <Text style={styles.popoverItem}>
                        {approveString ? 'Approved' : 'Unapprove'}
                      </Text>
                    </Text>

                    <CustomIconsComponent
                      color={Colors.primaryText}
                      name={'down'}
                      type="AntDesign"
                      size={18}
                    />
                  </TouchableOpacity>

                  {toggleapproveString ? (
                    <TouchableOpacity
                      onPress={approveUnapprove}
                      style={styles.actionVisiblityOption}>
                      <Text style={styles.popoverItem}>
                        {!approveString ? 'Approved' : 'Unapprove'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              }
              placement={'top'}>
              <View style={styles.actionTouchable}>
                <Text style={styles.actionText}>Actions...</Text>
              </View>
            </Popover>

            <TouchableOpacity
              onPress={closeQuestion}
              style={styles.actionCloseTouchable}>
              <CustomIconsComponent
                color={Colors.white}
                name={'check'}
                type={'Entypo'}
                size={20}
              />
              <Text style={styles.actionCloseText}>Close question</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {itemForAssign?.id ? (
        <AssignModal
          itemForAssign={itemForAssign}
          onRequestClose={() => onAssignClose()}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 4,
  },
  headerLeftIcon: {
    backgroundColor: '#F6C955',
    padding: 5,
    borderRadius: 5,
  },
  headerRightMainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rightIconContainer: (isActive) => {
    return {
      padding: 5,
      backgroundColor: isActive ? Colors.primary : Colors.primaryInactive,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
      borderRadius: 5,
    };
  },

  actionMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionPintotop: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryInactive,
  },
  actionVisiblityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
  },
  actionVisiblityText: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: '300',
  },
  actionVisiblityOption: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primaryText,
    padding: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.62,
    elevation: 3,
    borderRadius: 5,
  },
  actionStatusTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionStatusText: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: '300',
  },
  actionTouchable: {
    backgroundColor: Colors.primaryText,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.primaryText,
    borderRadius: 2,
    marginRight: 15,
  },
  actionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionCloseTouchable: {
    backgroundColor: Colors.green,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.green,
    borderRadius: 2,
    width: 250,
    flexDirection: 'row',
  },
  actionCloseText: {
    marginLeft: 8,
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  //
  approvePopoverContainer: {
    maxWidth: GlobalStyles.windowWidth * 0.6,
    backgroundColor: '#F8FAFB',
  },
  popoverItemContainer: {
    padding: 12,
  },
  popoverItem: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: 'bold',
  },
  popoverHintContainer: {
    borderTopWidth: 1,
    borderTopColor: '#dfe5e9',
    backgroundColor: Colors.primaryTilt,
    padding: 12,
  },
  popoverHint: {
    color: Colors.primaryText,
  },
  popoverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approvedIcon: {},
  approvedLabelTitle: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  unApprovedLabelTitle: {
    color: Colors.unapproved,
  },
  checkmarkIcon: {
    marginRight: 5,
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  assignCountContainer: {
    backgroundColor: Colors.primaryText,
    borderRadius: 50,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  assignCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  tabData: {
    flex: 0,
    zIndex: -1,
    opacity: 0,
    height: 0,
  },
  activeTabData: (activeTab) => ({
    flex: activeTab === 'Visitor' ? 0 : 1,
    zIndex: 10,
    opacity: 1,
    height: 'auto',
  }),
});
