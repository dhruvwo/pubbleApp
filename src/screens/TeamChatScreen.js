import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {LocalizationContext} from '../components/Translations';

export default function TeamChatScreen(props) {
  const {translations, initializeAppLanguage, setAppLanguage} = useContext(
    LocalizationContext,
  );

  useEffect(() => {
    initializeAppLanguage();
    // setAppLanguage('fr');
  }, []);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{translations['TeamChat']}</Text>
      <Text>{translations['hello']}</Text>
      <Text>{translations['how are you']}</Text>

      <TouchableOpacity
        onPress={() => setAppLanguage('en')}
        style={{borderWidth: 1, borderColor: 'blue'}}>
        <Text>Change language to en</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setAppLanguage('fr')}
        style={{borderWidth: 1, borderColor: 'blue'}}>
        <Text>Change language to fr</Text>
      </TouchableOpacity>
    </View>
  );
}
