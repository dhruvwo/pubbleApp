import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import Colors from '../constants/Colors';
import * as _ from 'lodash';
import GifSpinner from '../components/GifSpinner';
import HTMLView from 'react-native-htmlview';
import {eventsAction} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';

export default function EventFaq(props) {
  const {data} = props;
  const dispatch = useDispatch();
  const reduxState = useSelector(({auth}) => ({
    communityId: auth.community?.community?.id,
  }));
  const [isLoadMoreLoader, setIsLoadMoreLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    getFaqData();
  }, [faqData]);

  async function getFaqData() {
    const res = await dispatch(
      eventsAction.getFaqDataFunc({
        communityId: reduxState.communityId,
        conv: true,
        q: true,
        tags: '',
        scope: '',
        url: '',
        searchString: '',
        defaultSearch: 1,
        sort: 1,
        pageSize: 3,
      }),
    );
    setFaqData(res);
  }

  function renderFooter() {
    if (!faqData?.data?.length) {
      return null;
    }
    return !isLoadMoreLoader && faqData.total === faqData?.data?.length ? (
      <View>
        <Text
          style={{
            textAlign: 'center',
            margin: 12,
          }}>
          End of list
        </Text>
      </View>
    ) : (
      <GifSpinner />
    );
  }

  function renderEmpty() {
    return isLoading ? (
      <GifSpinner />
    ) : (
      <View style={styles.emptyContainer}>
        <View style={styles.innerEmptyContainer}>
          <Text style={styles.noteText}>No records found.</Text>
        </View>
      </View>
    );
  }

  async function loadMoredata() {
    setIsLoadMoreLoader(true);
    if (faqData.total > faqData?.data?.length) {
      await getStreamData({pageNumber: faqData.currentPage + 1});
    }
    setIsLoadMoreLoader(false);
  }

  function onMomentumScrollEnd({nativeEvent}) {
    if (
      !isLoadMoreLoader &&
      faqData.total > faqData?.data?.length &&
      nativeEvent.contentSize.height -
        (nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height) <=
        400
    ) {
      loadMoredata();
    }
  }

  function renderItem({item}) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.questionContentMainContainer}>
          <View style={styles.questionContentView}>
            <Text style={styles.questionContentText}>
              FAQ
              {item.count}
            </Text>
          </View>

          <View style={styles.scopeView(item.scope)}>
            <Text style={styles.scopeText}>
              {item.scope === 'community' ? 'Website' : 'Webpage'}
            </Text>
          </View>
        </View>

        <View style={styles.questionAnsContainer}>
          <Text style={styles.questionText}>{item.question}</Text>

          <HTMLView
            stylesheet={htmlStyle()}
            value={`<div>${item.answer}</div>`}
          />
        </View>

        {item.tags?.length ? (
          <View style={styles.tagsContainer}>
            {item.tags.map((tagName) => {
              return (
                <View style={styles.tagContainer} key={tagName}>
                  <Text style={styles.tagText}>{tagName}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.FAQMainContiner}>
      <FlatList
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onMomentumScrollEnd={onMomentumScrollEnd}
        data={faqData.data}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  FAQMainContiner: {
    padding: 20,
  },
  mainContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryText,
  },
  scopeView: (scope) => ({
    backgroundColor: scope === 'community' ? Colors.green : Colors.usersBg,
    marginLeft: 15,
    justifyContent: 'center',
    padding: 5,
    borderRadius: 5,
  }),
  scopeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  questionAnsContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  questionContentMainContainer: {
    flexDirection: 'row',
  },
  questionContentView: {
    backgroundColor: Colors.primaryText,
    padding: 5,
    borderRadius: 5,
  },
  questionContentText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
  },
  innerEmptyContainer: {
    alignSelf: 'center',
    margin: 30,
  },
  noteText: {
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '700',
  },

  tagsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tagContainer: {
    borderRadius: 50,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 4,
    marginRight: 4,
    borderWidth: 1,
    borderColor: Colors.primaryText,
  },
  tagText: {
    color: Colors.primaryText,
  },
});

const htmlStyle = StyleSheet.create(() => {
  return {
    div: {
      color: 'black',
    },
    span: {
      fontWeight: 'bold',
    },
    a: {
      color: Colors.white,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    account: {
      fontWeight: 'bold',
    },
  };
});
