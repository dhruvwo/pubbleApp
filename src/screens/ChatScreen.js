import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';

export default function ChatScreen(props) {
  const data = props.route.params.data;

  const renderChatCard = () => {
    return (
      <View style={styles.chatCardContainer}>
        <CustomIconsComponent
          color={Colors.greyText}
          name={'smiley'}
          type={'Fontisto'}
          size={40}
          style={styles.smiley}
        />
        <View style={styles.chatDescContainer}>
          <View style={styles.chatDesc}>
            <Text style={styles.chatDescText}>Guest</Text>
            <Text style={styles.chatDescText}>06:57 pm</Text>
            <Text style={styles.chatDescText}>10 Mar</Text>
          </View>
          <View style={styles.cardContainer}>
            <Text>{data.content}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerMainContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.headerLeftIcon}>
          <CustomIconsComponent
            color={Colors.greyText}
            name={'arrow-back-ios'}
            type={'MaterialIcons'}
            size={25}
          />
        </TouchableOpacity>
        <View style={styles.topLeftContainer}>
          <TouchableOpacity
            onPress={() => {}}
            style={styles.starSpaceContainer}>
            <CustomIconsComponent
              type={'AntDesign'}
              name={'star'}
              color={'white'}
              size={20}
            />
          </TouchableOpacity>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>2</Text>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.chatTitleText}>Guest</Text>
          <Text style={styles.descText}>visitor offline</Text>
        </View>
        <TouchableOpacity style={styles.menuContainer}>
          <CustomIconsComponent
            color={Colors.greyText}
            name={'more-vertical'}
            type={'Feather'}
            size={25}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.chatContainer}>{renderChatCard()}</View>
      <View>
        <TextInput
          placeholder="type your answer here"
          style={styles.answerInput}
        />
      </View>
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
    alignItems: 'center',
    // justifyContent: 'space-between',
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
    padding: 5,
    borderRadius: 5,
  },
  starSpaceContainer: {
    backgroundColor: Colors.primaryText,
    width: 32,
    height: '100%',
    backgroundColor: Colors.tertiary,
    padding: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  topLeftContainer: {
    flexDirection: 'row',
  },
  countContainer: {
    backgroundColor: Colors.primaryText,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  countText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  menuContainer: {
    position: 'absolute',
    right: 5,
  },
  titleContainer: {
    marginLeft: 10,
  },
  chatTitleText: {
    fontSize: 14,
    color: Colors.greyText,
  },
  descText: {
    fontSize: 11,
    color: Colors.red,
  },
  chatContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 30,
  },
  chatCardContainer: {
    flexDirection: 'row',
  },
  cardContainer: {
    backgroundColor: Colors.bgColor,
    padding: 15,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  chatDescContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  smiley: {
    marginRight: 10,
    marginTop: 20,
  },
  chatDesc: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  chatDescText: {
    marginRight: 10,
    color: Colors.greyText,
    fontSize: 12,
  },
  answerInput: {
    backgroundColor: Colors.bgColor,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    paddingLeft: 20,
  },
});
