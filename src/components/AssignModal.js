import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';
import {InputItem} from '@ant-design/react-native';
import GlobalStyles from '../constants/GlobalStyles';

export default function AssignModal(props) {
  const [searchValue, setSearchValue] = useState('');
  const [records, setRecords] = useState([]);

  const {onRequestClose} = props;

  const onChangeSearch = (value) => {
    setSearchValue(value);
  };

  const clearSearchInputValue = () => {
    setSearchValue('');
  };

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.innerEmptyContainer}>
          <Text style={styles.noteText}>No records found.</Text>
        </View>
      </View>
    );
  }

  function renderItem(item) {
    return <View>{item.id}</View>;
  }

  return (
    <Modal
      visible={!!props.itemForAssign?.id}
      onRequestClose={() => {
        onRequestClose();
      }}>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Assign users/groups to conversation
            </Text>
            <TouchableOpacity
              onPress={() => onRequestClose()}
              style={styles.closeContainer}>
              <CustomIconsComponent
                type={'FontAwesome'}
                name={'close'}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.dataContainer}>
            <View style={styles.searchContainer}>
              <InputItem
                placeholder="Search..."
                accessible={true}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.searchInput}
                onChangeText={(search) => onChangeSearch(search)}
                value={searchValue}
                extra={
                  <TouchableOpacity
                    style={styles.searchRightIcon}
                    onPress={clearSearchInputValue}>
                    <CustomIconsComponent
                      color={'#89A382'}
                      name={'cross'}
                      type={'Entypo'}
                      size={20}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <View>
              <FlatList
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                data={records}
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={styles.flatListContainer}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.secondary,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.white,
    fontSize: 19,
    fontWeight: 'bold',
    flexGrow: 1,
    flexShrink: 1,
  },
  closeContainer: {
    padding: 5,
    alignSelf: 'flex-end',
    marginLeft: 5,
  },
  dataContainer: {
    marginTop: 10,
    padding: 12,
  },
  searchContainer: {
    width: GlobalStyles.windowWidth - 24,
  },
  searchRightIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  searchInput: {
    paddingHorizontal: 5,
  },
  emptyContainer: {
    flex: 1,
  },
  innerEmptyContainer: {
    alignSelf: 'center',
    margin: 30,
  },
});
