import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

export default function QuantityComponent(props) {
  useEffect(() => {
    console.log('hhhhhhhhh');
  }, []);

  return (
    <View style={GlobalStyles.row}>
      <Text>hhhhhhhhh</Text>
    </View>
  );
}
