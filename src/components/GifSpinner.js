import {View, Image, StyleSheet} from 'react-native';
import * as React from 'react';

export default function GifSpinner(props) {
  const styles = StyleSheet.create({
    SpinnerContainer: {
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinner: {
      height: props?.size || 35,
      width: props?.size || 35,
    },
  });

  return (
    <View style={styles.SpinnerContainer}>
      <Image
        style={styles.spinner}
        source={require('../assets/images/pubble-spinner-64.gif')}
      />
    </View>
  );
}
