import {ActivityIndicator, StyleSheet} from 'react-native';
import * as React from 'react';

export default function LoadMoreLoader(props) {
  const styles = StyleSheet.create({
    loadMoreLoader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      minHeight: 60,
      paddingBottom: 10,
    },
  });

  return <ActivityIndicator style={styles.loadMoreLoader} size={30} />;
}
