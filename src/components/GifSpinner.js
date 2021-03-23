import {View, Image, StyleSheet} from 'react-native';
import * as React from 'react';

export default function GifSpinner() {
  const styles = StyleSheet.create({
    SpinnerContainer: {
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinner: {height: 50, width: 50},
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
